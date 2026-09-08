const { z } = require('zod');
const { prisma, checkDbConnection } = require('../db/client');

// Validation Schemas
const studentCreateSchema = z.object({
  email: z.string().email('Valid email is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  major: z.string().optional(),
  graduationYear: z.number().int().min(2000).max(2035).optional(),
  bio: z.string().max(1000).optional(),
  targetRole: z.string().optional(),
  skills: z.array(z.string()).default([]),
  gpa: z.number().min(0).max(4.0).optional(),
  githubUrl: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
});

const studentQuerySchema = z.object({
  major: z.string().optional(),
  targetRole: z.string().optional(),
  skill: z.string().optional(),
  search: z.string().optional(),
});

async function getStudents(req, res, next) {
  try {
    const isConnected = await checkDbConnection();
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        error: { code: 'DATABASE_UNAVAILABLE', message: 'Database service is currently unavailable' },
      });
    }

    const { major, targetRole, skill, search } = req.query;
    const where = {};
    if (major || targetRole || skill) {
      where.studentProfile = {};
      if (major) where.studentProfile.major = { contains: major, mode: 'insensitive' };
      if (targetRole) where.studentProfile.targetRole = { contains: targetRole, mode: 'insensitive' };
      if (skill) where.studentProfile.skills = { has: skill };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const students = await prisma.user.findMany({
      where: { ...where, role: 'STUDENT' },
      include: { studentProfile: true },
    });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
      source: 'database',
    });
  } catch (err) {
    next(err);
  }
}

async function getStudentById(req, res, next) {
  try {
    const isConnected = await checkDbConnection();
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        error: { code: 'DATABASE_UNAVAILABLE', message: 'Database service is currently unavailable' },
      });
    }

    const { id } = req.params;
    const student = await prisma.user.findFirst({
      where: {
        OR: [{ id }, { studentProfile: { id } }],
        role: 'STUDENT',
      },
      include: {
        studentProfile: {
          include: { careerRoadmaps: true, mentorships: true },
        },
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: { code: 'STUDENT_NOT_FOUND', message: `Student with ID ${id} not found` },
      });
    }

    res.status(200).json({ success: true, data: student, source: 'database' });
  } catch (err) {
    next(err);
  }
}

async function createStudent(req, res, next) {
  try {
    const isConnected = await checkDbConnection();
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        error: { code: 'DATABASE_UNAVAILABLE', message: 'Database service is currently unavailable' },
      });
    }

    const data = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: { code: 'USER_ALREADY_EXISTS', message: `User with email ${data.email} already exists` },
      });
    }

    const student = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        role: 'STUDENT',
        studentProfile: {
          create: {
            major: data.major,
            graduationYear: data.graduationYear,
            targetRole: data.targetRole,
            skills: data.skills || [],
            bio: data.bio,
            gpa: data.gpa,
            githubUrl: data.githubUrl,
            linkedinUrl: data.linkedinUrl,
          },
        },
      },
      include: { studentProfile: true },
    });

    res.status(201).json({
      success: true,
      message: 'Student profile created successfully',
      data: student,
      source: 'database',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  studentCreateSchema,
  studentQuerySchema,
};
