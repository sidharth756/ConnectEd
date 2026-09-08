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

// Demo fallback data when DB is not yet populated
const demoStudents = [
  {
    id: 'std_demo_1',
    name: 'Aarav Patel',
    email: 'aarav.patel@university.edu',
    role: 'STUDENT',
    studentProfile: {
      major: 'Computer Science',
      graduationYear: 2026,
      targetRole: 'Full Stack Engineer',
      skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL'],
      bio: 'Junior CS student passionate about distributed systems and AI web applications.',
      gpa: 3.85,
    },
  },
  {
    id: 'std_demo_2',
    name: 'Neha Sharma',
    email: 'neha.sharma@university.edu',
    role: 'STUDENT',
    studentProfile: {
      major: 'Data Science',
      graduationYear: 2025,
      targetRole: 'Machine Learning Engineer',
      skills: ['Python', 'PyTorch', 'SQL', 'FastAPI', 'Pandas'],
      bio: 'Senior student focusing on NLP and semantic search architectures.',
      gpa: 3.92,
    },
  },
];

async function getStudents(req, res, next) {
  try {
    const { major, targetRole, skill, search } = req.query;
    const isConnected = await checkDbConnection();

    if (!isConnected) {
      let results = [...demoStudents];
      if (major) results = results.filter((s) => s.studentProfile.major.toLowerCase().includes(major.toLowerCase()));
      if (targetRole) results = results.filter((s) => s.studentProfile.targetRole.toLowerCase().includes(targetRole.toLowerCase()));
      if (skill) results = results.filter((s) => s.studentProfile.skills.some((sk) => sk.toLowerCase().includes(skill.toLowerCase())));
      if (search) results = results.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

      return res.status(200).json({
        success: true,
        count: results.length,
        data: results,
        source: 'standby-cache',
      });
    }

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
    const { id } = req.params;
    const isConnected = await checkDbConnection();

    if (!isConnected) {
      const student = demoStudents.find((s) => s.id === id);
      if (!student) {
        return res.status(404).json({
          success: false,
          error: { code: 'STUDENT_NOT_FOUND', message: `Student with ID ${id} not found` },
        });
      }
      return res.status(200).json({ success: true, data: student, source: 'standby-cache' });
    }

    const student = await prisma.user.findUnique({
      where: { id },
      include: {
        studentProfile: {
          include: { careerRoadmaps: true, mentorships: true },
        },
      },
    });

    if (!student || student.role !== 'STUDENT') {
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
    const data = req.body;
    const isConnected = await checkDbConnection();

    if (!isConnected) {
      const newStudent = {
        id: `std_${Date.now()}`,
        name: data.name,
        email: data.email,
        role: 'STUDENT',
        studentProfile: {
          major: data.major,
          graduationYear: data.graduationYear,
          targetRole: data.targetRole,
          skills: data.skills || [],
          bio: data.bio,
          gpa: data.gpa,
          githubUrl: data.githubUrl,
          linkedinUrl: data.linkedinUrl,
        },
      };
      demoStudents.push(newStudent);
      return res.status(201).json({
        success: true,
        message: 'Student profile created successfully',
        data: newStudent,
        source: 'standby-cache',
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
            skills: data.skills,
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
