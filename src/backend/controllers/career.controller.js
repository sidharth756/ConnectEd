import { z } from 'zod';
import { prisma, checkDbConnection } from '../db/client.js';
import { globalRAGPipeline } from '../../ai/rag/ragPipeline.js';
import { searchTaskLearningResources, researchAndUpdateRoadmap } from '../services/tavilyService.js';

// Validation Schemas
const roadmapSaveSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  targetRole: z.string().min(2, 'Target role is required'),
  roadmapData: z.record(z.any()).or(z.array(z.any())),
  skillsToAcquire: z.array(z.string()).default([]),
});

async function getRoadmap(req, res, next) {
  try {
    const isConnected = await checkDbConnection();
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        error: { code: 'DATABASE_UNAVAILABLE', message: 'Database service is currently unavailable' },
      });
    }

    const { studentId } = req.params;

    let roadmap = await prisma.careerRoadmap.findFirst({
      where: {
        OR: [{ studentId }, { student: { userId: studentId } }],
      },
      orderBy: { generatedAt: 'desc' },
    });

    if (!roadmap) {
      roadmap = await prisma.careerRoadmap.findFirst({
        orderBy: { generatedAt: 'desc' },
      });
    }

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        error: { code: 'ROADMAP_NOT_FOUND', message: `No roadmap found` },
      });
    }

    res.status(200).json({ success: true, data: roadmap, source: 'database' });
  } catch (err) {
    next(err);
  }
}

async function saveRoadmap(req, res, next) {
  try {
    const isConnected = await checkDbConnection();
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        error: { code: 'DATABASE_UNAVAILABLE', message: 'Database service is currently unavailable' },
      });
    }

    const { studentId, targetRole, roadmapData, skillsToAcquire } = req.body;

    let studentProfile = await prisma.studentProfile.findUnique({
      where: { id: studentId },
    });
    if (!studentProfile) {
      studentProfile = await prisma.studentProfile.findUnique({
        where: { userId: studentId },
      });
    }

    if (!studentProfile) {
      const user = await prisma.user.findFirst({
        where: { OR: [{ id: studentId }, { role: 'STUDENT' }] }
      });
      if (user) {
        studentProfile = await prisma.studentProfile.create({
          data: {
            userId: user.id,
            major: 'Computer Science & Engineering',
            graduationYear: 2026,
            targetRole: targetRole || 'Software Engineer',
          }
        });
      }
    }

    if (!studentProfile) {
      studentProfile = await prisma.studentProfile.findFirst();
    }

    if (!studentProfile) {
      return res.status(404).json({
        success: false,
        error: { code: 'STUDENT_NOT_FOUND', message: `No student profile available for roadmap attachment` },
      });
    }

    const roadmap = await prisma.careerRoadmap.create({
      data: {
        studentId: studentProfile.id,
        targetRole,
        roadmapData,
        skillsToAcquire: skillsToAcquire || [],
      },
    });

    res.status(201).json({
      success: true,
      message: 'Career roadmap saved to database successfully',
      data: roadmap,
      source: 'database',
    });
  } catch (err) {
    next(err);
  }
}

async function generateAIRoadmap(req, res, next) {
  try {
    const { targetRole, timelineWeeks, currentSkills, studentId } = req.body;
    const roleToBuild = targetRole || 'Software Engineer';
    const weeks = Number(timelineWeeks) || 12;

    // Execute Tavily Market Research & Extract to dynamically construct/update the Career Roadmap
    const updatedRoadmap = await researchAndUpdateRoadmap({
      targetRole: roleToBuild,
      currentSkills: currentSkills || ['Git', 'JavaScript', 'Python'],
      timelineWeeks: weeks
    });

    // Auto-save to DB if available
    try {
      let studentProfile = await prisma.studentProfile.findFirst();
      if (studentProfile) {
        await prisma.careerRoadmap.create({
          data: {
            studentId: studentProfile.id,
            targetRole: roleToBuild,
            roadmapData: updatedRoadmap,
            skillsToAcquire: updatedRoadmap.skillGapAnalysis?.missingSkills || []
          }
        });
      }
    } catch (e) {}

    return res.status(200).json({
      success: true,
      source: 'Tavily Web Research & Content Extract Engine',
      data: updatedRoadmap
    });
  } catch (err) {
    next(err);
  }
}

async function refreshMarketRoadmap(req, res, next) {
  try {
    const { targetRole, currentSkills, timelineWeeks } = req.body;
    const roleToBuild = targetRole || 'Software Engineer';

    const updatedRoadmap = await researchAndUpdateRoadmap({
      targetRole: roleToBuild,
      currentSkills: currentSkills || [],
      timelineWeeks: timelineWeeks || 12
    });

    return res.status(200).json({
      success: true,
      source: 'Tavily Web Research Engine (2026)',
      data: updatedRoadmap
    });
  } catch (err) {
    next(err);
  }
}

async function getTaskResources(req, res, next) {
  try {
    const taskId = req.query.taskId || req.body.taskId || 'task-1';
    const taskText = req.query.taskText || req.body.taskText || req.query.task || req.body.task || '';
    let skills = req.query.skills || req.body.skills || [];

    if (typeof skills === 'string') {
      try {
        skills = JSON.parse(skills);
      } catch (e) {
        skills = skills.split(',').map(s => s.trim());
      }
    }

    if (!taskText) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_TASK', message: 'Task text parameter is required' }
      });
    }

    const result = await searchTaskLearningResources(taskText, skills);

    return res.status(200).json({
      success: result.success,
      taskId,
      topic: result.topic || taskText,
      resources: result.resources || [],
      practice: result.practice || null,
      outcome: result.outcome || null,
      message: result.message || null,
      cached: result.cached || false
    });
  } catch (err) {
    next(err);
  }
}

export {
  getRoadmap,
  saveRoadmap,
  generateAIRoadmap,
  refreshMarketRoadmap,
  getTaskResources,
  roadmapSaveSchema,
};


