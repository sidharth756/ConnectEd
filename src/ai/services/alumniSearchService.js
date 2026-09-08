import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateStructuredJson } from '../utils/llmClient.js';
import { AlumniSearchResultSchema } from '../schemas/alumniSearchSchema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getAlumniDatabase() {
  const dataPath = path.join(__dirname, '../data/alumniMockData.js');
  try {
    const rawContent = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(rawContent);
  } catch (error) {
    console.error("[JS AI Engine] Error loading alumni data:", error.message);
    return [];
  }
}

/**
 * Perform semantic search to find alumni matching a student's skills/query.
 * 
 * @param {string} userQuery - Natural language query (e.g. "I am a Spring Boot student find me alumni similar to my skill")
 * @param {Array} customAlumniDb - Optional custom database of alumni from PostgreSQL
 * @returns {Promise<Object>} Validated structured alumni matches with explainable reasons
 */
export async function searchAlumniBySkills(userQuery, customAlumniDb = null) {
  const db = customAlumniDb || getAlumniDatabase();

  const prompt = `
You are the AI Semantic Alumni Matcher for ConnectEd.
A student typed the following search request: "${userQuery}".

Here is the database of actual alumni:
${JSON.stringify(db, null, 2)}

Your instructions:
1. Identify the student's mentioned skills, experience, and target domain from their query.
2. Select the top alumni from the provided database who have relevant skills, companies, or roles.
3. NEVER invent any alumni not present in the database.
4. DO NOT generate fake percentage confidence scores.
5. Provide a clear, understandable, human-friendly reason explaining WHY each alumnus was selected for this student.

Return ONLY a JSON object matching this exact schema format:
{
  "query": "${userQuery}",
  "extractedIntent": {
    "studentSkills": ["skill1", "skill2"],
    "targetDomain": "Domain Name"
  },
  "matches": [
    {
      "alumniId": "alum-101",
      "name": "Alumnus Name",
      "role": "Current Role",
      "company": "Company Name",
      "matchedSkills": ["matchedSkill1"],
      "reason": "Specific human-understandable match explanation"
    }
  ]
}
`;

  // Call Gemini API LLM client
  const llmResult = await generateStructuredJson(prompt, AlumniSearchResultSchema);

  if (llmResult) {
    return llmResult;
  }

  // Fallback Rule-Based Engine (when API key is absent or offline during demo)
  return fallbackSkillMatcher(userQuery, db);
}

/**
 * Fallback deterministic matching algorithm ensuring hackathon resilience.
 */
function fallbackSkillMatcher(query, db) {
  const queryLower = query.toLowerCase();
  
  // Extract keywords
  const knownKeywords = [
    "spring boot", "java", "react", "node.js", "python", "aws", "docker", "kubernetes", 
    "microservices", "machine learning", "ai", "data analyst", "devops", "c++", "android",
    "kotlin", "cybersecurity", "sql", "tableau", "solidworks", "embedded"
  ];
  const detectedSkills = knownKeywords.filter(kw => queryLower.includes(kw));

  if (queryLower.includes("spring") && !detectedSkills.includes("spring boot")) {
    detectedSkills.push("spring boot");
  }

  const matches = db.map(alum => {
    const alumSkills = alum.skills || [];
    const matchedSkills = alumSkills.filter(s => 
      queryLower.includes(s.toLowerCase()) || detectedSkills.some(ds => s.toLowerCase().includes(ds))
    );

    if (matchedSkills.length === 0) return null;

    return {
      alumniId: String(alum.id),
      name: alum.name,
      role: alum.role,
      company: alum.company,
      matchedSkills: matchedSkills,
      reason: `Matched based on overlapping skills in ${matchedSkills.join(', ')} and background as ${alum.role} at ${alum.company}.`
    };
  }).filter(Boolean);

  const fallbackResult = {
    query: query,
    extractedIntent: {
      studentSkills: detectedSkills.length > 0 ? detectedSkills : ["Software Engineering"],
      targetDomain: detectedSkills.includes("spring boot") || detectedSkills.includes("java") ? "Java Backend Engineering" : "Software Development"
    },
    matches: matches
  };

  return AlumniSearchResultSchema.parse(fallbackResult);
}
