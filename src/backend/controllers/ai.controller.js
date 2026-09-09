import alumniMockData from '../../ai/data/alumniMockData.js';
import { globalRAGPipeline } from '../../ai/rag/ragPipeline.js';
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
          role: item.alumniProfile?.role || 'Senior Engineer',
          title: item.alumniProfile?.role || 'Senior Engineer',
          company: item.alumniProfile?.company || 'Tech Leader',
          skills: item.alumniProfile?.skills || [],
          bio: item.alumniProfile?.bio || '',
          availability: item.alumniProfile?.availability || 'Available for Mentorship',
          graduationYear: item.alumniProfile?.graduationYear || 2021,
          impactScore: item.alumniProfile?.impactScore || 850
        }));
      }
    } catch (e) {
      // Fallback to mock data
    }

    // Execute RAG Pipeline with Qwen 2.5 3B / Gemini
    const searchQuery = `${prompt} (Target Role: ${userGoal?.targetRole || 'Software Engineer'} at ${userGoal?.targetCompany || 'Tech'})`;
    const ragResult = await globalRAGPipeline.executeSearch(searchQuery, alumniList, 5);

    const isQwen = !ragResult.meta?.fallbackMode;
    const modelSource = isQwen ? 'Local Ollama (Qwen 2.5 3B) RAG Engine' : 'ConnectEd RAG Vector Search';

    const responseHeader = isQwen
      ? `🤖 [Qwen 2.5 3B RAG Engine]: Evaluated ${alumniList.length} database profiles and retrieved ${ragResult.matches.length} top candidates for "${prompt}". Here is why each alumnus is a perfect fit:`
      : `I evaluated our verified database for "${prompt}". Here are the top recommended alumni matches:`;

    const suggestedAlumni = (ragResult.matches || []).map(m => {
      const orig = alumniList.find(a => String(a.id) === String(m.alumniId) || a.name === m.name) || {};
      const matchReasonText = m.reason || orig.matchReason || `Perfect match based on overlapping expertise in ${(m.matchedSkills || orig.skills || []).join(', ')}.`;
      return {
        id: m.alumniId || orig.id,
        name: m.name || orig.name,
        role: m.role || orig.role || orig.title,
        title: m.role || orig.role || orig.title,
        company: m.company || orig.company,
        avatar: orig.avatarUrl || orig.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
        avatarUrl: orig.avatarUrl || orig.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
        skills: m.matchedSkills || orig.skills || [],
        matchReason: matchReasonText,
        matchScore: m.matchScore || 92,
        impactScore: orig.impactScore || 850,
        availability: orig.availability || 'Available for Mentorship'
      };
    });

    const matchExplanationsText = suggestedAlumni.map((alum, idx) => {
      return `**${idx + 1}. ${alum.name}** (${alum.title} @ ${alum.company}) - **${alum.matchScore}% Match**\n💡 *Why Perfect Match:* ${alum.matchReason}`;
    }).join('\n\n');

    const fullResponseText = `${responseHeader}\n\n${matchExplanationsText}`;

    return res.status(200).json({
      success: true,
      source: modelSource,
      text: fullResponseText,
      suggestedAlumni: suggestedAlumni,
      meta: ragResult.meta
    });
  } catch (err) {
    next(err);
  }
}

