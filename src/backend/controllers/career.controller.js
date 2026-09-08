const { z } = require('zod');
const { prisma, checkDbConnection } = require('../db/client');

// Validation Schemas
const roadmapSaveSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  targetRole: z.string().min(2, 'Target role is required'),
  roadmapData: z.record(z.any()).or(z.array(z.any())),
  skillsToAcquire: z.array(z.string()).default([]),
});

const demoRoadmaps = {
  std_demo_1: {
    id: 'rdmp_1',
    studentId: 'std_demo_1',
    targetRole: 'Full Stack Engineer',
    skillsToAcquire: ['Docker', 'AWS ECS', 'System Design', 'Redis Caching'],
    roadmapData: {
      phases: [
        {
          title: 'Phase 1: Backend Architecture Fundamentals',
          duration: '4 Weeks',
          milestones: ['Design scalable RESTful APIs', 'Implement Redis caching', 'Prisma ORM advanced queries'],
        },
        {
          title: 'Phase 2: Cloud & Container Deployment',
          duration: '4 Weeks',
          milestones: ['Containerize with Docker', 'Deploy to AWS ECS / Fargate', 'Set up GitHub Actions CI/CD'],
        },
        {
          title: 'Phase 3: Alumni Mentorship & System Design',
          duration: '2 Weeks',
          milestones: ['Conduct mock interviews with Google alumni', 'Review production project architecture'],
        },
      ],
    },
    generatedAt: new Date().toISOString(),
  },
};

async function getRoadmap(req, res, next) {
  try {
    const { studentId } = req.params;
    const isConnected = await checkDbConnection();

    if (!isConnected) {
      const roadmap = demoRoadmaps[studentId];
      if (!roadmap) {
        return res.status(404).json({
          success: false,
          error: { code: 'ROADMAP_NOT_FOUND', message: `No roadmap found for student ${studentId}` },
        });
      }
      return res.status(200).json({ success: true, data: roadmap, source: 'standby-cache' });
    }

    const roadmap = await prisma.careerRoadmap.findFirst({
      where: { studentId },
      orderBy: { generatedAt: 'desc' },
    });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        error: { code: 'ROADMAP_NOT_FOUND', message: `No roadmap found for student ${studentId}` },
      });
    }

    res.status(200).json({ success: true, data: roadmap, source: 'database' });
  } catch (err) {
    next(err);
  }
}

async function saveRoadmap(req, res, next) {
  try {
    const { studentId, targetRole, roadmapData, skillsToAcquire } = req.body;
    const isConnected = await checkDbConnection();

    if (!isConnected) {
      const newRoadmap = {
        id: `rdmp_${Date.now()}`,
        studentId,
        targetRole,
        roadmapData,
        skillsToAcquire: skillsToAcquire || [],
        generatedAt: new Date().toISOString(),
      };
      demoRoadmaps[studentId] = newRoadmap;

      return res.status(201).json({
        success: true,
        message: 'Career roadmap saved successfully',
        data: newRoadmap,
        source: 'standby-cache',
      });
    }

    const roadmap = await prisma.careerRoadmap.create({
      data: {
        studentId,
        targetRole,
        roadmapData,
        skillsToAcquire,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Career roadmap saved successfully',
      data: roadmap,
      source: 'database',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getRoadmap,
  saveRoadmap,
  roadmapSaveSchema,
};
