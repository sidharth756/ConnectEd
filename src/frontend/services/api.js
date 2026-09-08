// API Service layer for ConnectEd Frontend
// Multi-goal support, dynamic skill benchmarks, and Authentication API

const CAREER_GOALS = {
  'AI / ML Engineer': {
    targetRole: 'Senior AI Engineer',
    targetCompany: 'Google DeepMind',
    readiness: 64,
    skills: [
      { name: 'Python', current: 72, target: 90 },
      { name: 'Machine Learning', current: 54, target: 85 },
      { name: 'System Design', current: 35, target: 80 },
      { name: 'Cloud Infrastructure', current: 40, target: 70 },
    ],
    nextAction: 'Complete System Design — Module 2',
    biggestGap: { skill: 'System Design', gap: 45, resource: 'Scalable System Architecture Course' },
    roadmap: [
      {
        id: 'r1',
        title: 'Foundation',
        subtitle: 'Python + DSA',
        duration: '2 weeks',
        completed: true,
        current: false,
        mentor: 'Dr. Sarah Chen',
        tasks: [
          { id: 't1', text: 'Advanced Python OOP & AsyncIO', done: true },
          { id: 't2', text: 'Data Structures & Algorithm Benchmark', done: true }
        ]
      },
      {
        id: 'r2',
        title: 'AI Core',
        subtitle: 'ML + Deep Learning',
        duration: '3 weeks',
        completed: true,
        current: false,
        mentor: 'Dr. Sarah Chen',
        tasks: [
          { id: 't3', text: 'PyTorch Neural Network Architectures', done: true },
          { id: 't4', text: 'Transformer Models & Attention Mechanisms', done: true }
        ]
      },
      {
        id: 'r3',
        title: 'Engineering',
        subtitle: 'System Design + APIs',
        duration: '3 weeks',
        completed: false,
        current: true, // You are here
        mentor: 'Priya Sharma — Senior SWE',
        tasks: [
          { id: 't5', text: 'Learn scalability fundamentals & load balancing', done: true },
          { id: 't6', text: 'Design URL shortener & vector retrieval API', done: false },
          { id: 't7', text: 'Complete mock System Design interview', done: false }
        ]
      },
      {
        id: 'r4',
        title: 'Production',
        subtitle: 'Cloud + MLOps',
        duration: '2 weeks',
        completed: false,
        current: false,
        mentor: 'Marcus Vance',
        tasks: [
          { id: 't8', text: 'Deploy model using vLLM on AWS EC2', done: false },
          { id: 't9', text: 'Setup Prometheus & Grafana monitoring', done: false }
        ]
      },
      {
        id: 'r5',
        title: 'Portfolio',
        subtitle: '2 Real-world Projects',
        duration: '2 weeks',
        completed: false,
        current: false,
        mentor: 'David Kim',
        tasks: [
          { id: 't10', text: 'Build multimodal RAG search engine', done: false }
        ]
      },
      {
        id: 'r6',
        title: 'Alumni Mentor',
        subtitle: 'Mock Interview',
        duration: '1 week',
        completed: false,
        current: false,
        mentor: 'Dr. Sarah Chen',
        tasks: [
          { id: 't11', text: '1-on-1 Alumni Mock Technical Assessment', done: false }
        ]
      },
      {
        id: 'r7',
        title: 'Career Ready',
        subtitle: 'Target Role Qualified',
        duration: 'Ready',
        completed: false,
        current: false,
        mentor: 'ConnectEd Placement',
        tasks: [
          { id: 't12', text: 'Submit referral applications to Google DeepMind', done: false }
        ]
      }
    ]
  },
  'Software Engineer': {
    targetRole: 'Senior Software Engineer',
    targetCompany: 'Stripe',
    readiness: 78,
    skills: [
      { name: 'Node.js / Java', current: 85, target: 90 },
      { name: 'System Design', current: 65, target: 85 },
      { name: 'PostgreSQL & SQL', current: 80, target: 85 },
      { name: 'Distributed Systems', current: 50, target: 80 },
    ],
    nextAction: 'Complete Distributed Systems Consensus Lab',
    biggestGap: { skill: 'Distributed Systems', gap: 30, resource: 'Distributed Systems Consensus Course' },
    roadmap: [
      {
        id: 'r1',
        title: 'Foundation',
        subtitle: 'OOP & Data Modeling',
        duration: '2 weeks',
        completed: true,
        current: false,
        mentor: 'Marcus Vance',
        tasks: [{ id: 't1', text: 'Master Postgres schema indexing', done: true }]
      },
      {
        id: 'r2',
        title: 'Engineering',
        subtitle: 'Microservices & REST',
        duration: '3 weeks',
        completed: true,
        current: false,
        mentor: 'Marcus Vance',
        tasks: [{ id: 't2', text: 'Build gRPC backend microservices', done: true }]
      },
      {
        id: 'r3',
        title: 'Distributed Systems',
        subtitle: 'Consensus & Raft',
        duration: '3 weeks',
        completed: false,
        current: true,
        mentor: 'Priya Sharma — Senior SWE',
        tasks: [{ id: 't3', text: 'Implement Raft consensus algorithm', done: false }]
      },
      {
        id: 'r4',
        title: 'Career Ready',
        subtitle: 'Stripe Qualified',
        duration: 'Ready',
        completed: false,
        current: false,
        mentor: 'Marcus Vance',
        tasks: [{ id: 't4', text: 'Apply for Stripe Referral', done: false }]
      }
    ]
  },
  'Data Scientist': {
    targetRole: 'Senior Data Scientist',
    targetCompany: 'Meta',
    readiness: 70,
    skills: [
      { name: 'Python & Pandas', current: 88, target: 95 },
      { name: 'SQL & Data Warehouse', current: 75, target: 90 },
      { name: 'A/B Testing & Statistics', current: 50, target: 85 },
      { name: 'Machine Learning', current: 60, target: 80 },
    ],
    nextAction: 'Complete Experimentation & A/B Testing Case Study',
    biggestGap: { skill: 'A/B Testing & Statistics', gap: 35, resource: 'Trustworthy Online Controlled Experiments' },
    roadmap: [
      {
        id: 'r1',
        title: 'Foundation',
        subtitle: 'SQL & Analytics',
        duration: '2 weeks',
        completed: true,
        current: false,
        mentor: 'Elena Rostova',
        tasks: [{ id: 't1', text: 'Advanced SQL Window Functions', done: true }]
      },
      {
        id: 'r2',
        title: 'Experimentation',
        subtitle: 'A/B Testing & Stats',
        duration: '3 weeks',
        completed: false,
        current: true,
        mentor: 'Elena Rostova',
        tasks: [{ id: 't2', text: 'Design hypothesis test for product feature', done: false }]
      }
    ]
  },
  'Product Engineer': {
    targetRole: 'Product Engineer',
    targetCompany: 'Vercel',
    readiness: 82,
    skills: [
      { name: 'React & Next.js', current: 90, target: 95 },
      { name: 'TypeScript', current: 85, target: 90 },
      { name: 'UI/UX Design', current: 70, target: 85 },
      { name: 'Edge Performance', current: 55, target: 80 },
    ],
    nextAction: 'Optimize Edge Rendering & Hydration',
    biggestGap: { skill: 'Edge Performance', gap: 25, resource: 'Vercel Web Vitals Mastery' },
    roadmap: [
      {
        id: 'r1',
        title: 'Frontend Master',
        subtitle: 'React & Tailwind',
        duration: '2 weeks',
        completed: true,
        current: false,
        mentor: 'David Kim',
        tasks: [{ id: 't1', text: 'Build design token system', done: true }]
      },
      {
        id: 'r2',
        title: 'Edge Runtime',
        subtitle: 'Server Components',
        duration: '2 weeks',
        completed: false,
        current: true,
        mentor: 'David Kim',
        tasks: [{ id: 't2', text: 'Build React Server Component App', done: false }]
      }
    ]
  }
};

let currentGoalKey = 'AI / ML Engineer';
let isAuthenticatedSession = true;

const DEMO_USERS = {
  alex: {
    id: 'user_101',
    name: 'Alex Johnson',
    email: 'alex.johnson@kce.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    major: 'Computer Science',
    graduationYear: 2026,
    university: 'KCE',
    targetRole: 'Senior AI Engineer',
    targetCompany: 'Google DeepMind',
    currentSkills: ['Python', 'PyTorch', 'React', 'JavaScript', 'Node.js', 'SQL'],
  },
  priya: {
    id: 'alum_1',
    name: 'Priya Sharma',
    email: 'priya.sharma@google.com',
    role: 'alumni',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    major: 'Computer Science',
    graduationYear: 2019,
    university: 'KCE',
    targetRole: 'Senior Software Engineer',
    targetCompany: 'Google',
    currentSkills: ['System Design', 'Java', 'AWS', 'Python'],
  }
};

let currentUserSession = DEMO_USERS.alex;

const MOCK_ALUMNI = [
  {
    id: 'alum_1',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    title: 'Senior Software Engineer',
    company: 'Google',
    graduationYear: 2019,
    university: 'KCE',
    degree: 'B.E. Computer Science & Engineering',
    major: 'Computer Science',
    location: 'San Francisco, CA',
    matchScore: 92,
    matchReason: 'Works in your target role • 2019 KCE Alum',
    skills: ['System Design', 'Java', 'AWS', 'Python'],
    bio: '2019 KCE CSE Alum now working on Google Cloud infrastructure. Passionate about guiding KCE juniors in system design.',
    availability: 'Available for Mentorship',
    pastRoles: ['Software Engineer @ Meta', 'Intern @ Amazon', 'B.E. CSE — KCE (Class of 2019)'],
    linkedInUrl: 'https://linkedin.com'
  },
  {
    id: 'alum_2',
    name: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    title: 'Principal Software Architect',
    company: 'Stripe',
    graduationYear: 2017,
    university: 'KCE',
    degree: 'B.E. Computer Science & Engineering',
    major: 'Software Engineering',
    location: 'New York, NY',
    matchScore: 89,
    matchReason: '2017 KCE Alum • Same career goal trajectory',
    skills: ['Node.js', 'Distributed Systems', 'PostgreSQL', 'System Architecture'],
    bio: '2017 KCE Alum building core financial infrastructure at Stripe. Mentoring KCE students on distributed architecture.',
    availability: 'Referral Only',
    pastRoles: ['Senior Backend Engineer @ Uber', 'B.E. CSE — KCE (Class of 2017)'],
    linkedInUrl: 'https://linkedin.com'
  },
  {
    id: 'alum_3',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    title: 'Product Lead - AI Infrastructure',
    company: 'OpenAI',
    graduationYear: 2020,
    university: 'KCE',
    degree: 'B.E. Computer Science & Engineering',
    major: 'Computer Science',
    location: 'San Francisco, CA',
    matchScore: 86,
    matchReason: '2020 KCE Alum • AI Infrastructure Lead',
    skills: ['AI Strategy', 'Product Management', 'API Infrastructure'],
    bio: '2020 KCE Alum leading product infrastructure for frontier models at OpenAI.',
    availability: 'Available for Mentorship',
    pastRoles: ['APM @ Google Cloud', 'B.E. CSE — KCE (Class of 2020)'],
    linkedInUrl: 'https://linkedin.com'
  },
  {
    id: 'alum_4',
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    title: 'Lead Full Stack Engineer',
    company: 'Vercel',
    graduationYear: 2021,
    university: 'KCE',
    degree: 'B.E. Computer Science & Engineering',
    major: 'Computer Science',
    location: 'Remote',
    matchScore: 84,
    matchReason: '2021 KCE Alum • Frontend & Next.js Specialist',
    skills: ['React', 'Next.js', 'Tailwind CSS', 'Performance'],
    bio: '2021 KCE Alum building fast web interfaces and developer tools at Vercel.',
    availability: 'Available for Mentorship',
    pastRoles: ['Frontend Engineer @ Figma', 'B.E. CSE — KCE (Class of 2021)'],
    linkedInUrl: 'https://linkedin.com'
  }
];

const MOCK_JOBS = [
  {
    id: 'job_1',
    title: 'AI Systems Engineer (New Grad 2026)',
    company: 'Google DeepMind',
    companyLogo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&q=80&w=120',
    location: 'Mountain View, CA (Hybrid)',
    type: 'Full-time',
    postedDate: '2 days ago',
    alumniCount: 2,
    alumniContacts: [
      { id: 'alum_1', name: 'Priya Sharma', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250', title: 'Senior SWE' }
    ],
    matchPercentage: 94,
    description: 'Join the team building foundation models and scaling inference infrastructure.'
  },
  {
    id: 'job_2',
    title: 'Backend Infrastructure Engineer',
    company: 'Stripe',
    companyLogo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=120',
    location: 'San Francisco, CA / Remote',
    type: 'Full-time',
    postedDate: '1 day ago',
    alumniCount: 3,
    alumniContacts: [
      { id: 'alum_2', name: 'Marcus Vance', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250', title: 'Principal Architect' }
    ],
    matchPercentage: 89,
    description: 'Design distributed microservices processing financial transactions globally.'
  }
];

export const authApi = {
  async getSession() {
    return {
      isAuthenticated: isAuthenticatedSession,
      user: currentUserSession
    };
  },

  async login({ email, password, demoKey }) {
    if (demoKey && DEMO_USERS[demoKey]) {
      currentUserSession = DEMO_USERS[demoKey];
      isAuthenticatedSession = true;
      return { success: true, user: currentUserSession };
    }
    
    // Default fallback authentication
    isAuthenticatedSession = true;
    currentUserSession = {
      ...DEMO_USERS.alex,
      email: email || DEMO_USERS.alex.email
    };
    return { success: true, user: currentUserSession };
  },

  async register(userData) {
    isAuthenticatedSession = true;
    currentUserSession = {
      id: 'user_' + Date.now(),
      name: userData.name || 'New User',
      email: userData.email,
      role: userData.role || 'student',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
      major: userData.major || 'Computer Science',
      graduationYear: Number(userData.graduationYear) || 2026,
      university: userData.university || 'KCE',
      targetRole: userData.targetRole || 'Software Engineer',
      targetCompany: 'Tech Corp',
      currentSkills: ['JavaScript', 'React', 'HTML/CSS'],
    };
    return { success: true, user: currentUserSession };
  },

  async logout() {
    isAuthenticatedSession = false;
    return { success: true };
  }
};

export const alumniApi = {
  async getAlumni() {
    return MOCK_ALUMNI;
  },
  async getAlumniById(id) {
    return MOCK_ALUMNI.find(a => a.id === id) || MOCK_ALUMNI[0];
  }
};

export const userApi = {
  async getCurrentUser() {
    const goalData = CAREER_GOALS[currentGoalKey];
    return {
      ...currentUserSession,
      targetRole: goalData.targetRole,
      targetCompany: goalData.targetCompany,
      readiness: goalData.readiness,
      nextAction: goalData.nextAction,
      skills: goalData.skills,
      currentGoalKey: currentGoalKey
    };
  },

  async updateCareerGoal(goalKey) {
    if (CAREER_GOALS[goalKey]) {
      currentGoalKey = goalKey;
    }
    return this.getCurrentUser();
  },

  async getSkillGaps() {
    return CAREER_GOALS[currentGoalKey].skills;
  },

  async getBiggestGap() {
    return CAREER_GOALS[currentGoalKey].biggestGap;
  }
};

export const roadmapApi = {
  async getRoadmap() {
    return CAREER_GOALS[currentGoalKey].roadmap;
  }
};

export const jobApi = {
  async getJobs() {
    return MOCK_JOBS;
  }
};

export const aiAssistantApi = {
  async sendMessage(prompt) {
    const lower = prompt.toLowerCase();
    let responseText = "Based on your career target, I recommend focusing on your largest skill gap in System Design.";

    if (lower.includes('referral') || lower.includes('outreach')) {
      responseText = "Here is a personalized referral note for Priya Sharma at Google:\n\n'Hi Priya, I'm Alex, a CS Senior at KCE aiming for a Senior AI Engineer role. I noticed your work on Cloud systems and would appreciate your advice on transitioning to production engineering.'";
    } else if (lower.includes('gap') || lower.includes('skill')) {
      const gap = CAREER_GOALS[currentGoalKey].biggestGap;
      responseText = `Your largest skill gap is ${gap.skill} (Gap: ${gap.gap}%). I recommend starting the ${gap.resource} module.`;
    }

    return {
      id: 'msg_' + Date.now(),
      sender: 'assistant',
      text: responseText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }
};
