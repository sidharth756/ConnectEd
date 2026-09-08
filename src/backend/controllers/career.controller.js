const { z } = require('zod');
const { prisma, checkDbConnection } = require('../db/client');

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

    const roadmap = await prisma.careerRoadmap.findFirst({
      where: {
        OR: [{ studentId }, { student: { userId: studentId } }],
      },
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
      return res.status(404).json({
        success: false,
        error: { code: 'STUDENT_NOT_FOUND', message: `Student profile with ID ${studentId} not found` },
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
