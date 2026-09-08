const { z } = require('zod');
const { prisma, checkDbConnection } = require('../db/client');

// Validation Schemas
const jobCreateSchema = z.object({
  title: z.string().min(2, 'Job title is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().optional(),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT']).default('FULL_TIME'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  requirements: z.array(z.string()).default([]),
  referralAvailable: z.boolean().default(true),
  applyUrl: z.string().url().optional().or(z.literal('')),
  postedById: z.string().min(1, 'Poster ID is required'),
});

const demoJobs = [
  {
    id: 'job_1',
    title: 'Software Engineer - Distributed Systems',
    company: 'Google',
    location: 'Bangalore, India (Hybrid)',
    type: 'FULL_TIME',
    description: 'Looking for a new grad / early career engineer to join the Cloud Infrastructure team.',
    requirements: ['Go', 'C++', 'Distributed Systems', 'Computer Science Fundamentals'],
    referralAvailable: true,
    applyUrl: 'https://careers.google.com/jobs/results/demo',
    postedById: 'alm_demo_1',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'job_2',
    title: 'AI / ML Engineer Intern',
    company: 'Microsoft',
    location: 'Hyderabad, India (Onsite)',
    type: 'INTERNSHIP',
    description: 'Summer 2027 internship working on enterprise Copilot integrations and RAG pipelines.',
    requirements: ['Python', 'PyTorch', 'Vector Databases', 'Prompt Engineering'],
    referralAvailable: true,
    applyUrl: 'https://careers.microsoft.com/jobs/demo',
    postedById: 'alm_demo_2',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'job_3',
    title: 'Frontend Engineer (Design Systems)',
    company: 'Stripe',
    location: 'Remote',
    type: 'FULL_TIME',
    description: 'Join the Core UI platform team crafting reusable, accessible web components.',
    requirements: ['React', 'TypeScript', 'CSS', 'Accessibility'],
    referralAvailable: false,
    applyUrl: 'https://stripe.com/jobs/demo',
    postedById: 'alm_demo_3',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
];

async function getJobs(req, res, next) {
  try {
    const { company, type, referralOnly, search } = req.query;
    const isConnected = await checkDbConnection();

    if (!isConnected) {
      let results = [...demoJobs];
      if (company) results = results.filter((j) => j.company.toLowerCase().includes(company.toLowerCase()));
      if (type) results = results.filter((j) => j.type === type);
      if (referralOnly === 'true') results = results.filter((j) => j.referralAvailable);
      if (search) {
        const s = search.toLowerCase();
        results = results.filter(
          (j) =>
            j.title.toLowerCase().includes(s) ||
            j.company.toLowerCase().includes(s) ||
            j.requirements.some((r) => r.toLowerCase().includes(s))
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
    if (company) where.company = { contains: company, mode: 'insensitive' };
    if (type) where.type = type;
    if (referralOnly === 'true') where.referralAvailable = true;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const jobs = await prisma.job.findMany({
      where,
      include: {
        postedBy: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
      source: 'database',
    });
  } catch (err) {
    next(err);
  }
}

async function getJobById(req, res, next) {
  try {
    const { id } = req.params;
    const isConnected = await checkDbConnection();

    if (!isConnected) {
      const job = demoJobs.find((j) => j.id === id);
      if (!job) {
        return res.status(404).json({
          success: false,
          error: { code: 'JOB_NOT_FOUND', message: `Job with ID ${id} not found` },
        });
      }
      return res.status(200).json({ success: true, data: job, source: 'standby-cache' });
    }

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        postedBy: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        error: { code: 'JOB_NOT_FOUND', message: `Job with ID ${id} not found` },
      });
    }

    res.status(200).json({ success: true, data: job, source: 'database' });
  } catch (err) {
    next(err);
  }
}

async function createJob(req, res, next) {
  try {
    const data = req.body;
    const isConnected = await checkDbConnection();

    if (!isConnected) {
      const newJob = {
        id: `job_${Date.now()}`,
        title: data.title,
        company: data.company,
        location: data.location,
        type: data.type,
        description: data.description,
        requirements: data.requirements || [],
        referralAvailable: data.referralAvailable !== false,
        applyUrl: data.applyUrl,
        postedById: data.postedById,
        createdAt: new Date().toISOString(),
      };
      demoJobs.unshift(newJob);

      return res.status(201).json({
        success: true,
        message: 'Job posting / referral created successfully',
        data: newJob,
        source: 'standby-cache',
      });
    }

    const job = await prisma.job.create({
      data: {
        title: data.title,
        company: data.company,
        location: data.location,
        type: data.type,
        description: data.description,
        requirements: data.requirements,
        referralAvailable: data.referralAvailable,
        applyUrl: data.applyUrl,
        postedById: data.postedById,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Job posting / referral created successfully',
      data: job,
      source: 'database',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getJobs,
  getJobById,
  createJob,
  jobCreateSchema,
};
