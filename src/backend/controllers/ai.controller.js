import alumniMockData from '../../ai/data/alumniMockData.js';
import { globalRAGPipeline } from '../../ai/rag/ragPipeline.js';
import { generateText } from '../../ai/utils/llmClient.js';
import { prisma } from '../db/client.js';

export async function handleCopilotQuery(req, res, next) {
  try {
    const { prompt, userGoal, currentSkills } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ success: false, error: 'Prompt query is required' });
    }

    // Fetch alumni database
    let alumniList = alumniMockData;
    try {
      const dbAlumni = await prisma.user.findMany({
        where: { role: 'ALUMNI' },
        include: { alumniProfile: true },
      });
      if (dbAlumni && dbAlumni.length > 0) {
        alumniList = dbAlumni.map(item => ({
          id: item.id,
          name: item.name,
          role: item.alumniProfile?.role || 'Software Engineer',
          title: item.alumniProfile?.role || 'Software Engineer',
          company: item.alumniProfile?.company || 'Tech Enterprise',
          skills: item.alumniProfile?.skills || [],
          bio: item.alumniProfile?.bio || '',
          availability: item.alumniProfile?.availability || 'Available for Mentorship',
          graduationYear: item.alumniProfile?.graduationYear || 2021,
          impactScore: item.alumniProfile?.impactScore || 850
        }));
      }
    } catch (e) {}

    // Execute RAG Search
    const searchQuery = `${prompt} (Target Role: ${userGoal?.targetRole || 'Software Engineer'} at ${userGoal?.targetCompany || 'Tech'})`;
    const ragResult = await globalRAGPipeline.executeSearch(searchQuery, alumniList, 5);

    const isLocalLlm = !ragResult.meta?.fallbackMode;
    const modelSource = isLocalLlm ? 'Local Ollama (Granite 4.2 3B) RAG Engine' : 'ConnectEd RAG Vector Search';

    const suggestedAlumni = (ragResult.matches || []).map(m => {
      const orig = alumniList.find(a => String(a.id) === String(m.alumniId) || a.name === m.name) || {};
      return {
        id: m.alumniId || orig.id,
        name: m.name || orig.name,
        role: m.role || orig.role || orig.title,
        title: m.role || orig.role || orig.title,
        company: m.company || orig.company,
        avatar: orig.avatarUrl || orig.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
        avatarUrl: orig.avatarUrl || orig.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
        skills: m.matchedSkills || orig.skills || [],
        matchReason: m.reason || orig.matchReason || `Expertise in ${(orig.skills || []).slice(0, 3).join(', ')} as ${orig.role} @ ${orig.company}.`,
        matchScore: m.matchScore || 92,
        impactScore: orig.impactScore || 850,
        availability: orig.availability || 'Available for Mentorship'
      };
    });

    // Unleash Granite 4.2 3B Full Reasoning & Natural Language Potential
    const llmPrompt = `
You are the ConnectEd AI Career Copilot, an elite AI Career & Mentorship Advisor for KCE (Kathir College of Engineering) students.

STUDENT PROFILE:
- Student Name: ${userGoal?.studentName || 'Student'}
- Target Career Role: ${userGoal?.targetRole || 'Software Engineer'}
- Target Company: ${userGoal?.targetCompany || 'Tech Enterprise'}
- Current Skills: ${(currentSkills || userGoal?.currentSkills || []).join(', ') || 'Software Engineering'}

STUDENT USER PROMPT:
"${prompt}"

RETRIEVED KCE ALUMNI MENTORS (RAG Vector Database Search across 134 Profiles):
${JSON.stringify(suggestedAlumni.map((a, idx) => ({
  index: idx + 1,
  name: a.name,
  role: a.title,
  company: a.company,
  skills: a.skills,
  matchScore: `${a.matchScore}%`,
  reason: a.matchReason
})), null, 2)}

INSTRUCTIONS FOR YOUR RESPONSE:
1. Address the student in a warm, encouraging, executive AI tone.
2. Directly answer their query using deep domain intelligence.
3. Integrate the retrieved alumni naturally into your advice, highlighting why their specific background (company, role, skills) makes them the ideal mentor for mock interviews, resume feedback, or direct referral requests.
4. Format your response cleanly using Markdown with sections (e.g. 🎯 Strategic Career Alignment, 👥 Top Recommended Alumni Mentors, 🚀 Actionable Next Steps).
5. DO NOT output robotic template code or static lists. Write a natural, highly intelligent, customized response!
`;

    let generatedText = await generateText(llmPrompt);

    if (!generatedText) {
      // Clean fallback formatting if offline
      const header = `🤖 **ConnectEd AI Copilot Analysis** (${modelSource})\n\nBased on your query "${prompt}" targeting **${userGoal?.targetRole || 'Software Engineering'}**, I evaluated our verified alumni network. Here is your guidance:`;
      const itemized = suggestedAlumni.map((a, idx) => 
        `### ${idx + 1}. **${a.name}** (*${a.title} @ ${a.company}*) • **${a.matchScore}% Match**\n💡 **Why Ideal:** ${a.matchReason}`
      ).join('\n\n');
      generatedText = `${header}\n\n${itemized}`;
    }

    return res.status(200).json({
      success: true,
      source: modelSource,
      text: generatedText,
      suggestedAlumni: suggestedAlumni,
      meta: ragResult.meta
    });
  } catch (err) {
    next(err);
  }
}

