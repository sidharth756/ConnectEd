const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting ConnectEd database seed...');

  // 1. Seed Students (Users + StudentProfiles)
  const student1User = await prisma.user.upsert({
    where: { email: 'student1@connected.demo' },
    update: {
      name: 'Aarav Sharma',
      role: 'STUDENT',
    },
    create: {
      email: 'student1@connected.demo',
      name: 'Aarav Sharma',
      role: 'STUDENT',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    },
  });

  const student1Profile = await prisma.studentProfile.upsert({
    where: { userId: student1User.id },
    update: {
      major: 'Computer Science',
      graduationYear: 2026,
      bio: 'Aspiring Software Engineer passionate about backend systems and distributed databases.',
      targetRole: 'Software Engineer',
      skills: ['Java', 'C++', 'SQL', 'React', 'Node.js'],
      gpa: 3.8,
      githubUrl: 'https://github.com/aaravsharma',
      linkedinUrl: 'https://linkedin.com/in/aaravsharma',
    },
    create: {
      userId: student1User.id,
      major: 'Computer Science',
      graduationYear: 2026,
      bio: 'Aspiring Software Engineer passionate about backend systems and distributed databases.',
      targetRole: 'Software Engineer',
      skills: ['Java', 'C++', 'SQL', 'React', 'Node.js'],
      gpa: 3.8,
      githubUrl: 'https://github.com/aaravsharma',
      linkedinUrl: 'https://linkedin.com/in/aaravsharma',
    },
  });

  const student2User = await prisma.user.upsert({
    where: { email: 'student2@connected.demo' },
    update: {
      name: 'Ananya Verma',
      role: 'STUDENT',
    },
    create: {
      email: 'student2@connected.demo',
      name: 'Ananya Verma',
      role: 'STUDENT',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
    },
  });

  const student2Profile = await prisma.studentProfile.upsert({
    where: { userId: student2User.id },
    update: {
      major: 'Information Technology',
      graduationYear: 2025,
      bio: 'Data enthusiast interested in data analytics and software engineering.',
      targetRole: 'Data Analyst / Software Engineer',
      skills: ['Python', 'SQL', 'React', 'Git', 'Pandas'],
      gpa: 3.7,
      githubUrl: 'https://github.com/ananyaverma',
      linkedinUrl: 'https://linkedin.com/in/ananyaverma',
    },
    create: {
      userId: student2User.id,
      major: 'Information Technology',
      graduationYear: 2025,
      bio: 'Data enthusiast interested in data analytics and software engineering.',
      targetRole: 'Data Analyst / Software Engineer',
      skills: ['Python', 'SQL', 'React', 'Git', 'Pandas'],
      gpa: 3.7,
      githubUrl: 'https://github.com/ananyaverma',
      linkedinUrl: 'https://linkedin.com/in/ananyaverma',
    },
  });

  // 2. Seed Alumni (Users + AlumniProfiles)
  const alumni1User = await prisma.user.upsert({
    where: { email: 'alumni1@connected.demo' },
    update: {
      name: 'Vikram Patel',
      role: 'ALUMNI',
    },
    create: {
      email: 'alumni1@connected.demo',
      name: 'Vikram Patel',
      role: 'ALUMNI',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    },
  });

  const alumni1Profile = await prisma.alumniProfile.upsert({
    where: { userId: alumni1User.id },
    update: {
      company: 'Google',
      role: 'Senior Software Engineer',
      graduationYear: 2020,
      yearsOfExperience: 5,
      bio: 'Building scalable backend microservices and cloud infrastructure at Google.',
      skills: ['Java', 'Spring Boot', 'PostgreSQL', 'System Design'],
      isMentor: true,
      mentorBio: 'Glad to mentor students interested in backend development and system design.',
      maxMentees: 3,
      linkedinUrl: 'https://linkedin.com/in/vikrampatel',
    },
    create: {
      userId: alumni1User.id,
      company: 'Google',
      role: 'Senior Software Engineer',
      graduationYear: 2020,
      yearsOfExperience: 5,
      bio: 'Building scalable backend microservices and cloud infrastructure at Google.',
      skills: ['Java', 'Spring Boot', 'PostgreSQL', 'System Design'],
      isMentor: true,
      mentorBio: 'Glad to mentor students interested in backend development and system design.',
      maxMentees: 3,
      linkedinUrl: 'https://linkedin.com/in/vikrampatel',
    },
  });

  const alumni2User = await prisma.user.upsert({
    where: { email: 'alumni2@connected.demo' },
    update: {
      name: 'Priya Nair',
      role: 'ALUMNI',
    },
    create: {
      email: 'alumni2@connected.demo',
      name: 'Priya Nair',
      role: 'ALUMNI',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    },
  });

  const alumni2Profile = await prisma.alumniProfile.upsert({
    where: { userId: alumni2User.id },
    update: {
      company: 'Amazon',
      role: 'Data Engineer',
      graduationYear: 2019,
      yearsOfExperience: 6,
      bio: 'Specializing in distributed data pipelines, ETL, and cloud data warehouses.',
      skills: ['Python', 'SQL', 'AWS', 'Apache Spark'],
      isMentor: true,
      mentorBio: 'Passionate about guiding students pursuing data engineering and analytics careers.',
      maxMentees: 4,
      linkedinUrl: 'https://linkedin.com/in/priyanair',
    },
    create: {
      userId: alumni2User.id,
      company: 'Amazon',
      role: 'Data Engineer',
      graduationYear: 2019,
      yearsOfExperience: 6,
      bio: 'Specializing in distributed data pipelines, ETL, and cloud data warehouses.',
      skills: ['Python', 'SQL', 'AWS', 'Apache Spark'],
      isMentor: true,
      mentorBio: 'Passionate about guiding students pursuing data engineering and analytics careers.',
      maxMentees: 4,
      linkedinUrl: 'https://linkedin.com/in/priyanair',
    },
  });

  const alumni3User = await prisma.user.upsert({
    where: { email: 'alumni3@connected.demo' },
    update: {
      name: 'Rohan Mehta',
      role: 'ALUMNI',
    },
    create: {
      email: 'alumni3@connected.demo',
      name: 'Rohan Mehta',
      role: 'ALUMNI',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    },
  });

  const alumni3Profile = await prisma.alumniProfile.upsert({
    where: { userId: alumni3User.id },
    update: {
      company: 'Microsoft',
      role: 'Product Manager',
      graduationYear: 2018,
      yearsOfExperience: 7,
      bio: 'Leading product management for cloud computing platforms.',
      skills: ['Product Strategy', 'Agile', 'Cloud Computing', 'User Research'],
      isMentor: false,
      mentorBio: null,
      maxMentees: 0,
      linkedinUrl: 'https://linkedin.com/in/rohanmehta',
    },
    create: {
      userId: alumni3User.id,
      company: 'Microsoft',
      role: 'Product Manager',
      graduationYear: 2018,
      yearsOfExperience: 7,
      bio: 'Leading product management for cloud computing platforms.',
      skills: ['Product Strategy', 'Agile', 'Cloud Computing', 'User Research'],
      isMentor: false,
      mentorBio: null,
      maxMentees: 0,
      linkedinUrl: 'https://linkedin.com/in/rohanmehta',
    },
  });

  // 3. Seed Mentorships
  const existingMentorship1 = await prisma.mentorship.findFirst({
    where: {
      mentorId: alumni1Profile.id,
      menteeId: student1Profile.id,
    },
  });

  if (existingMentorship1) {
    await prisma.mentorship.update({
      where: { id: existingMentorship1.id },
      data: {
        status: 'ACCEPTED',
        message: 'Looking forward to receiving guidance on backend technical interview prep.',
        goals: ['System Design Prep', 'Backend Architecture', 'Mock Interview'],
      },
    });
  } else {
    await prisma.mentorship.create({
      data: {
        mentorId: alumni1Profile.id,
        menteeId: student1Profile.id,
        status: 'ACCEPTED',
        message: 'Looking forward to receiving guidance on backend technical interview prep.',
        goals: ['System Design Prep', 'Backend Architecture', 'Mock Interview'],
      },
    });
  }

  const existingMentorship2 = await prisma.mentorship.findFirst({
    where: {
      mentorId: alumni2Profile.id,
      menteeId: student2Profile.id,
    },
  });

  if (existingMentorship2) {
    await prisma.mentorship.update({
      where: { id: existingMentorship2.id },
      data: {
        status: 'PENDING',
        message: 'Seeking mentorship for transitioning into data engineering.',
        goals: ['SQL & ETL Pipelines', 'AWS Certification Prep'],
      },
    });
  } else {
    await prisma.mentorship.create({
      data: {
        mentorId: alumni2Profile.id,
        menteeId: student2Profile.id,
        status: 'PENDING',
        message: 'Seeking mentorship for transitioning into data engineering.',
        goals: ['SQL & ETL Pipelines', 'AWS Certification Prep'],
      },
    });
  }

  // 4. Seed Jobs
  const job1Data = {
    title: 'Junior Software Engineer',
    company: 'Google',
    location: 'Bengaluru, India (Hybrid)',
    type: 'FULL_TIME',
    description: 'Join our Google Cloud backend engineering team building high-throughput APIs and storage infrastructure.',
    requirements: ['Java', 'Data Structures', 'PostgreSQL', 'REST APIs'],
    referralAvailable: true,
    applyUrl: 'https://careers.google.com/jobs/101',
    postedById: alumni1User.id,
  };

  const existingJob1 = await prisma.job.findFirst({
    where: { title: job1Data.title, postedById: alumni1User.id },
  });

  if (existingJob1) {
    await prisma.job.update({ where: { id: existingJob1.id }, data: job1Data });
  } else {
    await prisma.job.create({ data: job1Data });
  }

  const job2Data = {
    title: 'Data Engineering Intern',
    company: 'Amazon',
    location: 'Hyderabad, India (On-site)',
    type: 'INTERNSHIP',
    description: 'Summer 2026 internship focusing on big data processing pipelines and AWS cloud integration.',
    requirements: ['Python', 'SQL', 'Git', 'Apache Spark'],
    referralAvailable: true,
    applyUrl: 'https://amazon.jobs/102',
    postedById: alumni2User.id,
  };

  const existingJob2 = await prisma.job.findFirst({
    where: { title: job2Data.title, postedById: alumni2User.id },
  });

  if (existingJob2) {
    await prisma.job.update({ where: { id: existingJob2.id }, data: job2Data });
  } else {
    await prisma.job.create({ data: job2Data });
  }

  const job3Data = {
    title: 'Associate Product Manager',
    company: 'Microsoft',
    location: 'Noida, India (Remote)',
    type: 'FULL_TIME',
    description: 'Collaborate with cross-functional engineering teams to define user workflows and product features.',
    requirements: ['Product Strategy', 'Agile', 'Analytics', 'User Research'],
    referralAvailable: false,
    applyUrl: 'https://careers.microsoft.com/jobs/103',
    postedById: alumni3User.id,
  };

  const existingJob3 = await prisma.job.findFirst({
    where: { title: job3Data.title, postedById: alumni3User.id },
  });

  if (existingJob3) {
    await prisma.job.update({ where: { id: existingJob3.id }, data: job3Data });
  } else {
    await prisma.job.create({ data: job3Data });
  }

  // 5. Seed Career Roadmap
  const roadmapPayload = {
    studentId: student1Profile.id,
    targetRole: 'Full Stack Software Engineer',
    skillsToAcquire: ['Node.js', 'Express', 'System Design', 'Docker', 'PostgreSQL'],
    roadmapData: {
      title: 'Full Stack Software Engineer Roadmap',
      targetRole: 'Full Stack Software Engineer',
      durationWeeks: 12,
      phases: [
        {
          phase: 1,
          title: 'Advanced Data Structures & Algorithms',
          duration: 'Weeks 1-3',
          topics: ['Graphs & Trees', 'Dynamic Programming', 'System Design Basics'],
        },
        {
          phase: 2,
          title: 'Backend Engineering with Express & Prisma',
          duration: 'Weeks 4-7',
          topics: ['RESTful API Design', 'PostgreSQL Schema Design', 'Prisma ORM', 'JWT Authentication'],
        },
        {
          phase: 3,
          title: 'Frontend Integration & Deployment',
          duration: 'Weeks 8-12',
          topics: ['React & State Management', 'Dockerizing Applications', 'CI/CD Pipelines', 'Mock Interviews'],
        },
      ],
    },
  };

  const existingRoadmap = await prisma.careerRoadmap.findFirst({
    where: { studentId: student1Profile.id },
  });

  if (existingRoadmap) {
    await prisma.careerRoadmap.update({
      where: { id: existingRoadmap.id },
      data: roadmapPayload,
    });
  } else {
    await prisma.careerRoadmap.create({
      data: roadmapPayload,
    });
  }

  console.log('✅ ConnectEd seed script completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
