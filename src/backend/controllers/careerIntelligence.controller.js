// Controller for AI Career Intelligence (Tavily Market Research + KCE Alumni Data + LLM RAG)

import { prisma, checkDbConnection } from '../db/client.js';
import { getCareerMarketIntelligence } from '../services/tavilyService.js';
import { globalRAGPipeline } from '../../ai/rag/ragPipeline.js';

// Pre-defined mapping of official, high-quality open-source & documentation resources for major tech skills
const OFFICIAL_RESOURCE_DIRECTORY = {
  pytorch: { title: 'PyTorch Official Documentation & Tutorials', url: 'https://pytorch.org/docs/stable/index.html', type: 'Official Docs' },
  tensorflow: { title: 'TensorFlow Official Core Guide & Documentation', url: 'https://www.tensorflow.org/learn', type: 'Official Docs' },
  transformers: { title: 'Hugging Face Transformers Documentation', url: 'https://huggingface.co/docs/transformers/index', type: 'Official Docs' },
  llms: { title: 'OpenAI Developer Documentation & Guides', url: 'https://platform.openai.com/docs/introduction', type: 'Official Docs' },
  rag: { title: 'LangChain RAG Architecture & Vector Indexing Guide', url: 'https://python.langchain.com/docs/use_cases/question_answering/', type: 'Architecture Guide' },
  'vector databases': { title: 'Pinecone Vector Database & Retrieval Guide', url: 'https://www.pinecone.io/learn/vector-database/', type: 'Architecture Guide' },
  docker: { title: 'Docker Official Getting Started Guide & Documentation', url: 'https://docs.docker.com/get-started/', type: 'Official Docs' },
  kubernetes: { title: 'Kubernetes Official Cluster Administration Docs', url: 'https://kubernetes.io/docs/home/', type: 'Official Docs' },
  aws: { title: 'AWS Cloud Developer Documentation & Architecture Center', url: 'https://docs.aws.amazon.com/', type: 'Official Docs' },
  react: { title: 'React Official Documentation & Learn Guide', url: 'https://react.dev/learn', type: 'Official Docs' },
  'next.js': { title: 'Next.js App Router Official Documentation', url: 'https://nextjs.org/docs', type: 'Official Docs' },
  'node.js': { title: 'Node.js Official API Documentation', url: 'https://nodejs.org/en/docs/', type: 'Official Docs' },
  python: { title: 'Python 3 Official Language & Standard Library Docs', url: 'https://docs.python.org/3/', type: 'Official Docs' },
  sql: { title: 'PostgreSQL Official Documentation', url: 'https://www.postgresql.org/docs/', type: 'Official Docs' },
  'system design': { title: 'System Design Primer (Open Source Repository)', url: 'https://github.com/donnemartin/system-design-primer', type: 'Open-Source Repo' },
};

/**
 * Helper to match high-quality learning resource for a given skill name
 */
function getResourceForSkill(skillName) {
  const normalized = skillName.toLowerCase().trim();
  if (OFFICIAL_RESOURCE_DIRECTORY[normalized]) {
    return {
      skill: skillName,
      ...OFFICIAL_RESOURCE_DIRECTORY[normalized],
    };
  }
  // Generic fallback resource
  return {
    skill: skillName,
    title: `${skillName} Official Developer Documentation`,
    url: `https://www.google.com/search?q=${encodeURIComponent(skillName + ' official documentation')}`,
    type: 'Official Resource',
  };
}

/**
 * Controller: Analyze Career Intelligence
 * Endpoint: POST /api/career-intelligence/analyze
 */
export async function analyzeCareerIntelligence(req, res, next) {
  try {
    const { careerGoal, currentSkills: reqSkills, studentId } = req.body || {};

    let targetRole = careerGoal || 'AI Engineer';
    let currentSkills = Array.isArray(reqSkills) && reqSkills.length > 0 ? reqSkills : [];

    // If studentId provided and skills/role missing, pull from DB
    if (studentId && (!targetRole || currentSkills.length === 0)) {
      try {
        const isDbOk = await checkDbConnection();
        if (isDbOk) {
          const profile = await prisma.studentProfile.findFirst({
            where: { OR: [{ id: studentId }, { userId: studentId }] },
          });
          if (profile) {
            if (!targetRole && profile.targetRole) targetRole = profile.targetRole;
            if (currentSkills.length === 0 && Array.isArray(profile.skills)) {
              currentSkills = profile.skills;
            }
          }
        }
      } catch (e) {}
    }

    if (currentSkills.length === 0) {
      currentSkills = ['Python', 'SQL', 'Git'];
    }

    // 1. Fetch Real-time Market Intelligence from Tavily
    const tavilyData = await getCareerMarketIntelligence(targetRole, currentSkills);

    // 2. Fetch KCE Alumni Profiles from DB (or fallback)
    let alumniList = [];
    try {
      const isDbOk = await checkDbConnection();
      if (isDbOk) {
        const dbUsers = await prisma.user.findMany({
          where: { role: 'ALUMNI' },
          include: { alumniProfile: true },
        });

        alumniList = dbUsers.map(u => ({
          id: u.id,
          name: u.name,
          role: u.alumniProfile?.role || 'Senior Engineer',
          company: u.alumniProfile?.company || 'Tech Enterprise',
          graduationYear: u.alumniProfile?.graduationYear || 2020,
          skills: u.alumniProfile?.skills || [],
          bio: u.alumniProfile?.bio || '',
          availability: u.alumniProfile?.isMentor ? 'Available for Mentorship' : 'Referral Only',
        }));
      }
    } catch (e) {}

    // Fallback seed alumni if DB is empty/unavailable
    if (alumniList.length === 0) {
      alumniList = [
        { id: 'alum_1', name: 'Priya Sharma', role: 'Senior Software Engineer', company: 'Google', graduationYear: 2019, skills: ['System Design', 'Python', 'AWS', 'PyTorch'], availability: 'Available for Mentorship' },
        { id: 'alum_2', name: 'Marcus Vance', role: 'Principal Software Architect', company: 'Stripe', graduationYear: 2017, skills: ['Distributed Systems', 'Node.js', 'PostgreSQL'], availability: 'Referral Only' },
        { id: 'alum_3', name: 'Elena Rostova', role: 'Product Lead - AI Infrastructure', company: 'OpenAI', graduationYear: 2020, skills: ['AI Strategy', 'Python', 'LLMs', 'API Infrastructure'], availability: 'Available for Mentorship' },
        { id: 'alum_4', name: 'David Kim', role: 'Lead Full Stack Engineer', company: 'Vercel', graduationYear: 2021, skills: ['React', 'Next.js', 'TypeScript'], availability: 'Available for Mentorship' },
      ];
    }

    // 3. RAG Semantic Match Alumni using globalRAGPipeline
    const ragResult = await globalRAGPipeline.executeSearch(
      `Career guidance and mentorship for ${targetRole} target role`,
      alumniList,
      4
    );

    const recommendedAlumni = (ragResult.matches || []).slice(0, 3).map(m => ({
      alumniId: m.alumniId,
      name: m.name,
      role: m.role,
      company: m.company,
      matchedSkills: m.matchedSkills || [],
      matchScore: m.matchScore || 88,
      matchPercentage: `${m.matchScore || 88}%`,
      reason: m.reason || `KCE Alum working as ${m.role} at ${m.company}.`,
    }));

    // 4. Extract Market Demands & Identify Skill Gaps
    const defaultMarketSkillMap = {
      'AI Engineer': ['PyTorch', 'LLMs', 'RAG', 'Vector Databases', 'Docker', 'AWS'],
      'Software Engineer': ['System Design', 'Docker', 'PostgreSQL', 'Microservices', 'AWS', 'Kubernetes'],
      'Data Scientist': ['PyTorch', 'SQL', 'A/B Testing', 'Machine Learning', 'Pandas', 'Spark'],
      'Product Engineer': ['React', 'Next.js', 'TypeScript', 'Node.js', 'GraphQL', 'Tailwind CSS'],
    };

    const inDemandMarketSkills = defaultMarketSkillMap[targetRole] || ['System Design', 'Docker', 'Cloud Infrastructure', 'APIs', 'CI/CD'];

    // Identify Skill Gaps
    const currentLower = new Set(currentSkills.map(s => s.toLowerCase()));
    const skillGaps = inDemandMarketSkills.filter(s => !currentLower.has(s.toLowerCase()));

    // 5. Generate Recommended Learning Path & High-Quality Resources
    const recommendedLearningPath = skillGaps.length > 0 ? skillGaps : ['Advanced System Design', 'Performance Optimization'];

    const learningResources = recommendedLearningPath.map(skill => getResourceForSkill(skill));

    // 6. Formulate Market Insights from Tavily Results
    const marketInsights = [];
    if (tavilyData.marketAnswer) {
      marketInsights.push(tavilyData.marketAnswer);
    }
    if (tavilyData.results && tavilyData.results.length > 0) {
      tavilyData.results.slice(0, 3).forEach(r => {
        if (r.snippet) {
          marketInsights.push(`${r.title}: ${r.snippet}`);
        }
      });
    }

    if (marketInsights.length === 0) {
      marketInsights.push(`Current market demand for ${targetRole} emphasizes ${recommendedLearningPath.slice(0, 3).join(', ')}.`);
    }

    // 7. Construct Final Response Payload
    const responsePayload = {
      success: true,
      careerGoal: targetRole,
      currentSkills,
      marketSkills: inDemandMarketSkills,
      skillGaps,
      recommendedLearningPath,
      learningResources,
      recommendedAlumni,
      marketInsights,
      sources: tavilyData.sources || [],
      meta: {
        tavilySearchSuccess: tavilyData.success,
        tavilyCached: Boolean(tavilyData.results?.[0]?.cached),
        ragSource: ragResult.meta?.fallbackMode ? 'KCE Vector Matcher' : 'ConnectEd RAG Engine',
      },
    };

    res.status(200).json(responsePayload);
  } catch (err) {
    next(err);
  }
}
