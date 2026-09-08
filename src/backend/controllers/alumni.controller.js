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

// Demo fallback data
const demoAlumni = [
  {
    id: 'alm_demo_1',
    name: 'Priya Mehta',
    email: 'priya.mehta@google.com',
    role: 'ALUMNI',
    alumniProfile: {
      id: 'ap_1',
      company: 'Google',
      role: 'Staff Software Engineer',
      graduationYear: 2019,
      yearsOfExperience: 6,
      skills: ['Distributed Systems', 'Go', 'Kubernetes', 'Cloud Architecture'],
      bio: 'Alumna class of 2019. Happy to review resumes, provide mock interviews, and refer qualified students.',
      isMentor: true,
      mentorBio: 'Mentoring students in backend architecture and cloud infrastructure.',
      maxMentees: 4,
      linkedinUrl: 'https://linkedin.com/in/priya-mehta-demo',
    },
  },
  {
    id: 'alm_demo_2',
    name: 'Rohan Gupta',
    email: 'rohan.gupta@microsoft.com',
    role: 'ALUMNI',
    alumniProfile: {
      id: 'ap_2',
      company: 'Microsoft',
      role: 'Product Manager',
      graduationYear: 2020,
      yearsOfExperience: 5,
      skills: ['Product Strategy', 'AI Products', 'Data Analytics', 'Agile'],
      bio: 'Passionate about guiding students transitioning from engineering into product management.',
      isMentor: true,
      mentorBio: 'Focusing on APM prep and tech transition strategies.',
      maxMentees: 2,
      linkedinUrl: 'https://linkedin.com/in/rohan-gupta-demo',
    },
  },
  {
    id: 'alm_demo_3',
    name: 'Ananya Verma',
    email: 'ananya.v@stripe.com',
    role: 'ALUMNI',
    alumniProfile: {
      id: 'ap_3',
      company: 'Stripe',
      role: 'Senior Frontend Engineer',
      graduationYear: 2021,
      yearsOfExperience: 4,
      skills: ['React', 'TypeScript', 'Design Systems', 'Web Performance'],
      bio: 'UI engineer building high-reliability payment interfaces.',
      isMentor: false,
      mentorBio: null,
      maxMentees: 0,
      linkedinUrl: 'https://linkedin.com/in/ananya-verma-demo',
    },
  },
];

async function getAlumni(req, res, next) {
  try {
    const { company, role, skill, isMentor, search } = req.query;
    const isConnected = await checkDbConnection();

    if (!isConnected) {
      let results = [...demoAlumni];
      if (company) results = results.filter((a) => a.alumniProfile.company.toLowerCase().includes(company.toLowerCase()));
      if (role) results = results.filter((a) => a.alumniProfile.role.toLowerCase().includes(role.toLowerCase()));
      if (skill) results = results.filter((a) => a.alumniProfile.skills.some((sk) => sk.toLowerCase().includes(skill.toLowerCase())));
      if (isMentor !== undefined) {
        const isM = isMentor === 'true';
        results = results.filter((a) => a.alumniProfile.isMentor === isM);
      }
      if (search) {
        const s = search.toLowerCase();
        results = results.filter(
          (a) =>
            a.name.toLowerCase().includes(s) ||
            a.alumniProfile.company.toLowerCase().includes(s) ||
            a.alumniProfile.role.toLowerCase().includes(s)
        );
      }

      return res.status(200).json({
        success: true,
        count: results.length,
        data: results,
        source: 'standby-cache',
      });
    }

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
    const { id } = req.params;
    const isConnected = await checkDbConnection();

    if (!isConnected) {
      const alum = demoAlumni.find((a) => a.id === id || (a.alumniProfile && a.alumniProfile.id === id));
      if (!alum) {
        return res.status(404).json({
          success: false,
          error: { code: 'ALUMNI_NOT_FOUND', message: `Alumni with ID ${id} not found` },
        });
      }
      return res.status(200).json({ success: true, data: alum, source: 'standby-cache' });
    }

    const alum = await prisma.user.findUnique({
      where: { id },
      include: {
        alumniProfile: {
          include: { mentorships: true },
        },
        postedJobs: true,
      },
    });

    if (!alum || alum.role !== 'ALUMNI') {
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
    const data = req.body;
    const isConnected = await checkDbConnection();

    if (!isConnected) {
      const newAlum = {
        id: `alm_${Date.now()}`,
        name: data.name,
        email: data.email,
        role: 'ALUMNI',
        alumniProfile: {
          id: `ap_${Date.now()}`,
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
      };
      demoAlumni.push(newAlum);
      return res.status(201).json({
        success: true,
        message: 'Alumni profile created successfully',
        data: newAlum,
        source: 'standby-cache',
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
            yearsOfExperience: data.yearsOfExperience,
            bio: data.bio,
            skills: data.skills,
            isMentor: data.isMentor,
            mentorBio: data.mentorBio,
            maxMentees: data.maxMentees,
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
  demoAlumni,
};
