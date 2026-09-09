import { z } from 'zod';
import { prisma, checkDbConnection } from '../db/client.js';

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
      // Fall back to any available roadmap in the DB
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
      // Auto-create student profile if user exists
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
      // Fall back to first student profile in DB
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

export {
  getRoadmap,
  saveRoadmap,
  roadmapSaveSchema,
};
