const { z } = require('zod');
const { prisma, checkDbConnection } = require('../db/client');

// Validation Schemas
const alumniCreateSchema = z.object({
  email: z.string().email('Valid email is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Current role is required'),
  graduationYear: z.number().int().min(1980).max(2025).optional(),
  yearsOfExperience: z.number().int().min(0).max(50).default(0),
  bio: z.string().max(1000).optional(),
  skills: z.array(z.string()).default([]),
  isMentor: z.boolean().default(false),
  mentorBio: z.string().optional(),
  maxMentees: z.number().int().min(1).max(20).default(3),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
});

const alumniQuerySchema = z.object({
  company: z.string().optional(),
  role: z.string().optional(),
  skill: z.string().optional(),
  isMentor: z.enum(['true', 'false']).optional(),
  search: z.string().optional(),
});

async function getAlumni(req, res, next) {
  try {
    const isConnected = await checkDbConnection();
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        error: { code: 'DATABASE_UNAVAILABLE', message: 'Database service is currently unavailable' },
      });
    }

    const { company, role, skill, isMentor, search } = req.query;
    const where = {};
    if (company || role || skill || isMentor !== undefined) {
      where.alumniProfile = {};
      if (company) where.alumniProfile.company = { contains: company, mode: 'insensitive' };
      if (role) where.alumniProfile.role = { contains: role, mode: 'insensitive' };
      if (skill) where.alumniProfile.skills = { has: skill };
      if (isMentor !== undefined) where.alumniProfile.isMentor = isMentor === 'true';
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { alumniProfile: { company: { contains: search, mode: 'insensitive' } } },
        { alumniProfile: { role: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const alumni = await prisma.user.findMany({
      where: { ...where, role: 'ALUMNI' },
      include: { alumniProfile: true },
    });

    res.status(200).json({
      success: true,
      count: alumni.length,
      data: alumni,
      source: 'database',
    });
  } catch (err) {
    next(err);
  }
}

async function getAlumniById(req, res, next) {
  try {
    const isConnected = await checkDbConnection();
    if (!isConnected) {
      return res.status(503).json({
        success: false,
        error: { code: 'DATABASE_UNAVAILABLE', message: 'Database service is currently unavailable' },
      });
    }

    const { id } = req.params;
    const alum = await prisma.user.findFirst({
      where: {
        OR: [{ id }, { alumniProfile: { id } }],
        role: 'ALUMNI',
      },
      include: {
        alumniProfile: {
          include: { mentorships: true },
        },
        postedJobs: true,
      },
    });

    if (!alum) {
      return res.status(404).json({
        success: false,
        error: { code: 'ALUMNI_NOT_FOUND', message: `Alumni with ID ${id} not found` },
      });
    }

    res.status(200).json({ success: true, data: alum, source: 'database' });
  } catch (err) {
    next(err);
  }
}

async function createAlumni(req, res, next) {
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

    const alum = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        role: 'ALUMNI',
        alumniProfile: {
          create: {
            company: data.company,
            role: data.role,
            graduationYear: data.graduationYear,
            yearsOfExperience: data.yearsOfExperience || 0,
            bio: data.bio,
            skills: data.skills || [],
            isMentor: data.isMentor || false,
            mentorBio: data.mentorBio,
            maxMentees: data.maxMentees || 3,
            linkedinUrl: data.linkedinUrl,
          },
        },
      },
      include: { alumniProfile: true },
    });

    res.status(201).json({
      success: true,
      message: 'Alumni profile created successfully',
      data: alum,
      source: 'database',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAlumni,
  getAlumniById,
  createAlumni,
  alumniCreateSchema,
  alumniQuerySchema,
};
