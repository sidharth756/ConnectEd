const { z } = require('zod');
const { prisma, checkDbConnection } = require('../db/client');
const { demoAlumni } = require('./alumni.controller');

// Validation Schema
const mentorshipRequestSchema = z.object({
  mentorId: z.string().min(1, 'Mentor ID is required'),
  menteeId: z.string().min(1, 'Mentee/Student ID is required'),
  message: z.string().min(10, 'Please provide a message explaining your mentorship goals (min 10 chars)'),
  goals: z.array(z.string()).default([]),
});

const demoRequests = [
  {
    id: 'req_1',
    mentorId: 'ap_1',
    menteeId: 'std_demo_1',
    status: 'ACCEPTED',
    message: 'Looking for guidance on preparing for senior backend and infrastructure roles.',
    goals: ['Resume Review', 'System Design Mock', 'Career Path Strategy'],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

async function getMentors(req, res, next) {
  try {
    const { skill, company } = req.query;
    const isConnected = await checkDbConnection();

    if (!isConnected) {
      let mentors = demoAlumni.filter((a) => a.alumniProfile && a.alumniProfile.isMentor);
      if (skill) mentors = mentors.filter((m) => m.alumniProfile.skills.some((s) => s.toLowerCase().includes(skill.toLowerCase())));
      if (company) mentors = mentors.filter((m) => m.alumniProfile.company.toLowerCase().includes(company.toLowerCase()));

      return res.status(200).json({
        success: true,
        count: mentors.length,
        data: mentors,
        source: 'standby-cache',
      });
    }

    const where = {
      role: 'ALUMNI',
      alumniProfile: { isMentor: true },
    };
    if (company) where.alumniProfile.company = { contains: company, mode: 'insensitive' };
    if (skill) where.alumniProfile.skills = { has: skill };

    const mentors = await prisma.user.findMany({
      where,
      include: {
        alumniProfile: {
          include: {
            mentorships: {
              where: { status: 'ACCEPTED' },
            },
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      count: mentors.length,
      data: mentors,
      source: 'database',
    });
  } catch (err) {
    next(err);
  }
}

async function requestMentorship(req, res, next) {
  try {
    const { mentorId, menteeId, message, goals } = req.body;
    const isConnected = await checkDbConnection();

    if (!isConnected) {
      const newRequest = {
        id: `req_${Date.now()}`,
        mentorId,
        menteeId,
        status: 'PENDING',
        message,
        goals: goals || [],
        createdAt: new Date().toISOString(),
      };
      demoRequests.push(newRequest);

      return res.status(201).json({
        success: true,
        message: 'Mentorship request submitted successfully',
        data: newRequest,
        source: 'standby-cache',
      });
    }

    const request = await prisma.mentorship.create({
      data: {
        mentorId,
        menteeId,
        message,
        goals,
        status: 'PENDING',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Mentorship request submitted successfully',
      data: request,
      source: 'database',
    });
  } catch (err) {
    next(err);
  }
}

async function getMentorshipRequests(req, res, next) {
  try {
    const { userId, status } = req.query;
    const isConnected = await checkDbConnection();

    if (!isConnected) {
      let requests = [...demoRequests];
      if (status) requests = requests.filter((r) => r.status === status);
      if (userId) requests = requests.filter((r) => r.mentorId === userId || r.menteeId === userId);

      return res.status(200).json({
        success: true,
        count: requests.length,
        data: requests,
        source: 'standby-cache',
      });
    }

    const where = {};
    if (status) where.status = status;
    if (userId) {
      where.OR = [
        { mentor: { userId } },
        { mentee: { userId } },
      ];
    }

    const requests = await prisma.mentorship.findMany({
      where,
      include: {
        mentor: { include: { user: true } },
        mentee: { include: { user: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
      source: 'database',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMentors,
  requestMentorship,
  getMentorshipRequests,
  mentorshipRequestSchema,
};
