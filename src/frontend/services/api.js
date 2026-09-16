// API Service layer for ConnectEd Frontend
// Multi-goal support, dynamic skill benchmarks, and Authentication API
import alumniMockData from '../../ai/data/alumniMockData.js';

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
    targetDays: 100,
    daysCompleted: 36,
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
    company: 'Google',
    title: 'Senior Software Engineer',
    impactScore: 985,
    menteesGuided: 34,
    targetRole: 'Senior Software Engineer',
    targetCompany: 'Google',
    currentSkills: ['System Design', 'Java', 'AWS', 'Python'],
  },
  admin: {
    id: 'admin_1',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@kce.edu',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    major: 'Computer Science & AI',
    graduationYear: 2012,
    university: 'KCE',
    title: 'Head of Alumni Relations & Platform Admin',
    company: 'KCE Institute',
    targetRole: 'Platform Administrator',
    targetCompany: 'KCE ConnectEd Platform',
    currentSkills: ['Platform Governance', 'Alumni Analytics', 'Career Mentorship Strategy'],
  }
};

let currentUserSession = DEMO_USERS.alex;

const MOCK_ALUMNI = alumniMockData;

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
    const token = localStorage.getItem('connected_token');
    if (token) {
      try {
        const res = await fetch(`${getBackendUrl()}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const u = json.data;
            const roleLower = (u.role || 'STUDENT').toLowerCase();
            const formattedUser = {
              id: u.id,
              name: u.name,
              email: u.email,
              role: roleLower,
              avatar: u.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
              major: u.studentProfile?.major || u.alumniProfile?.major || 'Computer Science',
              graduationYear: u.studentProfile?.graduationYear || u.alumniProfile?.graduationYear || 2026,
              university: u.studentProfile?.university || u.alumniProfile?.university || 'KCE',
              targetRole: u.studentProfile?.targetRole || u.alumniProfile?.currentRole || '',
              targetCompany: u.studentProfile?.targetCompany || u.alumniProfile?.company || '',
              currentSkills: u.studentProfile?.skills || u.alumniProfile?.skills || []
            };
            currentUserSession = formattedUser;
            isAuthenticatedSession = true;
            return { isAuthenticated: true, user: formattedUser };
          }
        }
      } catch (e) {
        console.warn("Session restore from token failed:", e);
      }
    }
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

    try {
      const res = await fetch(`${getBackendUrl()}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        if (json.token) {
          localStorage.setItem('connected_token', json.token);
        }
        const u = json.user;
        const roleLower = (u.role || 'STUDENT').toLowerCase();
        currentUserSession = {
          id: u.id,
          name: u.name,
          email: u.email,
          role: roleLower,
          avatar: u.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
          targetRole: u.targetRole || u.studentProfile?.targetRole || '',
          targetCompany: u.targetCompany || u.studentProfile?.targetCompany || '',
        };
        isAuthenticatedSession = true;
        return { success: true, user: currentUserSession };
      } else if (json.error && json.error.message) {
        throw new Error(json.error.message);
      }
    } catch (e) {
      console.warn("Backend login failed, using fallback session:", e.message);
    }

    // Default fallback authentication if backend offline or demo user
    isAuthenticatedSession = true;
    currentUserSession = {
      ...DEMO_USERS.alex,
      email: email || DEMO_USERS.alex.email
    };
    return { success: true, user: currentUserSession };
  },

  async register(userData) {
    try {
      const res = await fetch(`${getBackendUrl()}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: (userData.role || 'STUDENT').toUpperCase()
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        if (json.token) {
          localStorage.setItem('connected_token', json.token);
        }
        const u = json.user;
        const roleLower = (u.role || 'STUDENT').toLowerCase();
        currentUserSession = {
          id: u.id,
          name: u.name,
          email: u.email,
          role: roleLower,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
          major: userData.major || '',
          graduationYear: Number(userData.graduationYear) || 2026,
          university: userData.university || 'KCE',
          targetRole: userData.targetRole || '',
          targetCompany: userData.targetCompany || '',
          currentSkills: [],
        };
        isAuthenticatedSession = true;
        return { success: true, user: currentUserSession };
      } else if (json.error && json.error.message) {
        throw new Error(json.error.message);
      }
    } catch (e) {
      console.warn("Backend registration failed:", e.message);
    }

    isAuthenticatedSession = true;
    currentUserSession = {
      id: 'user_' + Date.now(),
      name: userData.name || 'New User',
      email: userData.email,
      role: userData.role || 'student',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250',
      major: userData.major || '',
      graduationYear: Number(userData.graduationYear) || 2026,
      university: userData.university || 'KCE',
      targetRole: userData.targetRole || '',
      targetCompany: '',
      currentSkills: [],
      skillsList: [],
      skills: [],
      daysCompleted: 0,
      readiness: 0,
      bio: '',
    };
    return { success: true, user: currentUserSession };
  },

  async logout() {
    localStorage.removeItem('connected_token');
    isAuthenticatedSession = false;
    return { success: true };
  }
};

export const alumniApi = {
  async getAlumni(sortBy = 'impactScore') {
    try {
      const res = await fetch(`${getBackendUrl()}/api/alumni`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          let list = json.data.map(item => {
            const profile = item.alumniProfile || {};
            const roleStr = item.role || item.title || profile.role || profile.title || 'Software Developer';
            const companyStr = item.company || profile.company || 'KCE Partner Company';
            const bioStr = item.bio || profile.bio || `${item.name} is a KCE Alum specializing in ${roleStr}.`;
            const skillsArr = (Array.isArray(item.skills) && item.skills.length > 0) 
              ? item.skills 
              : ((Array.isArray(profile.skills) && profile.skills.length > 0) ? profile.skills : ['Engineering']);
            const locationStr = item.location || profile.location || 'India';
            const degreeStr = item.degree || profile.degree || 'B.E. Engineering';
            const majorStr = item.major || profile.major || 'Engineering';

            return {
              id: item.id,
              username: item.username || item.id,
              name: item.name || 'Alumni Mentor',
              avatar: item.avatar || item.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
              avatarUrl: item.avatarUrl || item.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
              title: roleStr,
              role: roleStr,
              company: companyStr,
              graduationYear: item.graduationYear || profile.graduationYear || 2021,
              university: 'KCE',
              degree: degreeStr,
              major: majorStr,
              domain: majorStr,
              location: locationStr,
              matchScore: item.matchScore || profile.matchScore || 85,
              impactScore: item.impactScore || profile.impactScore || 850,
              menteesGuided: item.menteesGuided || profile.menteesGuided || 10,
              badgeTier: item.badgeTier || profile.badgeTier || 'Verified Alum ✨',
              matchReason: item.matchReason || profile.matchReason || bioStr,
              skills: skillsArr,
              bio: bioStr,
              availability: item.availability || profile.availability || 'Available for Mentorship',
              linkedInUrl: item.linkedInUrl || item.linkedin || profile.linkedinUrl || '',
              linkedin: item.linkedin || item.linkedInUrl || profile.linkedinUrl || ''
            };
          });

          if (sortBy === 'impactScore') {
            list.sort((a, b) => (b.impactScore || 0) - (a.impactScore || 0));
          } else if (sortBy === 'matchScore') {
            list.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
          }
          return list;
        }
      }
    } catch (e) {
      console.warn("DB Alumni fetch failed, using fallback:", e);
    }

    const list = [...MOCK_ALUMNI];
    if (sortBy === 'impactScore') {
      list.sort((a, b) => (b.impactScore || 0) - (a.impactScore || 0));
    } else if (sortBy === 'matchScore') {
      list.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }
    return list;
  },

  async getAlumniById(id) {
    const norm = s => String(s || '').replace('_', '-');
    return MOCK_ALUMNI.find(a => norm(a.id) === norm(id)) || MOCK_ALUMNI[0];
  },

  async incrementImpactScore(alumniId, points = 50) {
    const norm = s => String(s || '').replace('_', '-');
    const alum = MOCK_ALUMNI.find(a => norm(a.id) === norm(alumniId));
    if (alum) {
      alum.impactScore = (alum.impactScore || 700) + points;
      alum.menteesGuided = (alum.menteesGuided || 10) + 1;
      if (alum.impactScore > 950) alum.badgeTier = '#1 Top Mentor 🔥';
      else if (alum.impactScore > 900) alum.badgeTier = 'Master Mentor ⭐';
      else if (alum.impactScore > 800) alum.badgeTier = 'Senior Mentor ⚡';
    }
    return alum;
  }
};

export const userApi = {
  async getCurrentUser() {
    if (currentUserSession?.id) {
      try {
        const isAlumni = currentUserSession.role === 'alumni' || currentUserSession.role === 'ALUMNI';
        const endpoint = isAlumni 
          ? `${getBackendUrl()}/api/alumni/${currentUserSession.id}`
          : `${getBackendUrl()}/api/students/${currentUserSession.id}`;
        
        const res = await fetch(endpoint);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const dbUser = json.data;
            const prof = dbUser.studentProfile || dbUser.alumniProfile || {};
            
            currentUserSession = {
              ...currentUserSession,
              name: dbUser.name || currentUserSession.name,
              avatar: dbUser.avatarUrl || currentUserSession.avatar,
              avatarUrl: dbUser.avatarUrl || currentUserSession.avatarUrl || currentUserSession.avatar,
              bio: prof.bio !== undefined && prof.bio !== '' ? prof.bio : currentUserSession.bio,
              major: prof.major || currentUserSession.major,
              graduationYear: prof.graduationYear || currentUserSession.graduationYear,
              company: prof.company || currentUserSession.company,
              title: prof.role || currentUserSession.title,
              customTargetRole: prof.targetRole || currentUserSession.customTargetRole || currentUserSession.targetRole,
              customTargetCompany: prof.targetCompany || currentUserSession.customTargetCompany || currentUserSession.targetCompany,
              gpa: prof.gpa || currentUserSession.gpa,
              githubUrl: prof.githubUrl || currentUserSession.githubUrl,
              linkedinUrl: prof.linkedinUrl || currentUserSession.linkedinUrl,
              skillsList: Array.isArray(prof.skills) && prof.skills.length > 0 ? prof.skills : currentUserSession.skillsList,
              skills: Array.isArray(prof.skills) && prof.skills.length > 0 ? prof.skills : currentUserSession.skills,
              isMentor: prof.isMentor !== undefined ? prof.isMentor : currentUserSession.isMentor,
              mentorBio: prof.mentorBio || currentUserSession.mentorBio,
              maxMentees: prof.maxMentees || currentUserSession.maxMentees,
            };
          }
        }
      } catch (e) {
        // Silently preserve session state if DB offline
      }
    }

    const isDemoAlex = currentUserSession?.id === 'user_101' || currentUserSession?.email === 'alex.johnson@kce.edu';
    
    if (isDemoAlex) {
      const goalData = CAREER_GOALS[currentGoalKey] || CAREER_GOALS['AI / ML Engineer'];
      return {
        ...currentUserSession,
        targetRole: currentUserSession.customTargetRole || currentUserSession.targetRole || goalData.targetRole,
        targetCompany: currentUserSession.customTargetCompany || currentUserSession.targetCompany || goalData.targetCompany,
        targetDays: 100,
        daysCompleted: 36,
        readiness: 64,
        nextAction: goalData.nextAction,
        skills: currentUserSession.skillsList || goalData.skills,
        currentGoalKey: currentGoalKey
      };
    }

    return {
      ...currentUserSession,
      targetRole: currentUserSession.customTargetRole || currentUserSession.targetRole || '',
      targetCompany: currentUserSession.customTargetCompany || currentUserSession.targetCompany || '',
      targetDays: 100,
      daysCompleted: currentUserSession.daysCompleted || 0,
      readiness: currentUserSession.customReadiness || currentUserSession.readiness || 0,
      nextAction: currentUserSession.customNextAction || currentUserSession.nextAction || 'Set up your target career goal to begin benchmarking',
      skills: currentUserSession.skillsList || currentUserSession.skills || [],
      currentGoalKey: currentGoalKey
    };
  },

  async updateCareerGoal(goalKey) {
    if (CAREER_GOALS[goalKey]) {
      currentGoalKey = goalKey;
      delete currentUserSession.customTargetRole;
      delete currentUserSession.customTargetCompany;
      const goal = CAREER_GOALS[goalKey];
      currentUserSession.targetRole = goal.targetRole;
      currentUserSession.targetCompany = goal.targetCompany;

      if (currentUserSession?.id) {
        try {
          const isAlumni = currentUserSession.role === 'alumni' || currentUserSession.role === 'ALUMNI';
          const endpoint = isAlumni
            ? `${getBackendUrl()}/api/alumni/${currentUserSession.id}`
            : `${getBackendUrl()}/api/students/${currentUserSession.id}`;
          await fetch(endpoint, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              targetRole: goal.targetRole,
              targetCompany: goal.targetCompany
            })
          });
        } catch (e) {
          // Fallback
        }
      }
    }
    return this.getCurrentUser();
  },

  async updateProfile(profileData) {
    try {
      const isAlumni = currentUserSession.role === 'alumni' || currentUserSession.role === 'ALUMNI';
      const endpoint = isAlumni
        ? `${getBackendUrl()}/api/alumni/${currentUserSession.id}`
        : `${getBackendUrl()}/api/students/${currentUserSession.id}`;

      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const dbUser = json.data;
          const profile = dbUser.studentProfile || dbUser.alumniProfile || {};
          
          currentUserSession = {
            ...currentUserSession,
            ...profileData,
            name: profileData.name || dbUser.name || currentUserSession.name,
            avatar: profileData.avatarUrl || dbUser.avatarUrl || currentUserSession.avatar,
            avatarUrl: profileData.avatarUrl || dbUser.avatarUrl || currentUserSession.avatar,
            bio: profileData.bio !== undefined ? profileData.bio : (profile.bio || currentUserSession.bio),
            headline: profileData.headline || currentUserSession.headline,
            specialization: profileData.specialization || currentUserSession.specialization,
            major: profileData.major || profile.major || currentUserSession.major,
            company: profileData.company || profile.company || currentUserSession.company,
            title: profileData.role || profile.role || currentUserSession.title,
            customTargetRole: profileData.targetRole || profile.targetRole || currentUserSession.targetRole,
            customTargetCompany: profileData.targetCompany || currentUserSession.targetCompany,
            graduationYear: profileData.graduationYear || profile.graduationYear || currentUserSession.graduationYear,
            gpa: profileData.gpa || profile.gpa || currentUserSession.gpa,
            yearsOfExperience: profileData.yearsOfExperience || profile.yearsOfExperience || currentUserSession.yearsOfExperience,
            skillsList: profileData.skills || profile.skills || currentUserSession.skillsList,
            skills: profileData.skills || profile.skills || currentUserSession.skills,
            githubUrl: profileData.githubUrl || profile.githubUrl || currentUserSession.githubUrl,
            linkedinUrl: profileData.linkedinUrl || profile.linkedinUrl || currentUserSession.linkedinUrl,
            portfolioUrl: profileData.portfolioUrl || currentUserSession.portfolioUrl,
            isMentor: profileData.isMentor !== undefined ? profileData.isMentor : profile.isMentor,
            mentorBio: profileData.mentorBio || profile.mentorBio || currentUserSession.mentorBio,
            maxMentees: profileData.maxMentees || profile.maxMentees || currentUserSession.maxMentees,
          };
          return { success: true, user: await this.getCurrentUser() };
        }
      }
    } catch (e) {
      console.warn("DB Profile update failed, updating local state:", e);
    }

    currentUserSession = {
      ...currentUserSession,
      ...profileData,
      name: profileData.name || currentUserSession.name,
      avatar: profileData.avatarUrl || currentUserSession.avatar,
      avatarUrl: profileData.avatarUrl || currentUserSession.avatar,
      title: profileData.role || currentUserSession.title,
      customTargetRole: profileData.targetRole || currentUserSession.targetRole,
      customTargetCompany: profileData.targetCompany || currentUserSession.targetCompany,
      skillsList: profileData.skills || currentUserSession.skillsList,
      skills: profileData.skills || currentUserSession.skills
    };
    return { success: true, user: await this.getCurrentUser() };
  },


  async getSkillGaps() {
    return CAREER_GOALS[currentGoalKey].skills;
  },

  async getBiggestGap() {
    return CAREER_GOALS[currentGoalKey].biggestGap;
  }
};

function getBackendUrl() {
  const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  return `http://${host}:5000`;
}

function getAIUrl() {
  const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  return `http://${host}:8000`;
}

export const roadmapApi = {
  async getRoadmap(studentId) {
    const targetId = studentId || currentUserSession?.id || 'student1';
    try {
      const res = await fetch(`${getBackendUrl()}/api/career/roadmap/${targetId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data && data.data.roadmapData) {
          return data.data.roadmapData;
        }
      }
    } catch (e) {
      console.warn("DB Roadmap fetch failed, using fallback:", e);
    }
    return null;
  },

  async saveRoadmap({ studentId, targetRole, roadmapData, skillsToAcquire = [] }) {
    const targetId = studentId || currentUserSession?.id || 'student1';
    try {
      const res = await fetch(`${getBackendUrl()}/api/career/roadmap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: targetId,
          targetRole: targetRole || 'Software Engineer',
          roadmapData,
          skillsToAcquire
        })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error("Save roadmap error:", e);
    }
    return { success: false };
  },

  async searchTopicResources(topic, targetRole = '') {
    try {
      const res = await fetch(`${getAIUrl()}/api/ai/search-resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, targetRole, maxResults: 3 })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Topic resources fetch error:", e);
    }
    return [];
  },

  async generateAIRoadmap({ targetRole, currentSkills = [], studentName = 'Student', bio = '', timelineWeeks = 12 }) {
    try {
      const res = await fetch(`${getBackendUrl()}/api/career/roadmap/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          currentSkills,
          timelineWeeks,
          studentName
        })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          await this.saveRoadmap({
            studentId: 'student1',
            targetRole,
            roadmapData: json.data,
            skillsToAcquire: json.data.skillGapAnalysis?.missingSkills || []
          });
          return json.data;
        }
      }
    } catch (e) {
      console.warn("Backend RAG Roadmap generator error, using smart fallback:", e);
    }

    const buildFallbackResources = (topic, pNum) => [
      {
        id: `res_${pNum}_doc`,
        title: `${topic} Official Documentation & Developer Reference`,
        url: topic.toLowerCase().includes('docker') ? 'https://docs.docker.com/' : 'https://docs.python.org/3/',
        category: 'Documentation',
        source: 'Official Docs',
        snippet: `Comprehensive official developer documentation and technical guides for ${topic}.`,
        score: 0.94,
        topic: topic,
        phaseNumber: pNum,
        ctaText: 'Read Docs'
      },
      {
        id: `res_${pNum}_vid`,
        title: `${topic} Complete Video Masterclass Tutorial`,
        url: 'https://www.youtube.com/watch?v=Aceg0n04LJw',
        category: 'Video',
        source: 'youtube.com',
        snippet: `Step-by-step practical video tutorial covering ${topic} architectural principles and production usage.`,
        score: 0.90,
        topic: topic,
        phaseNumber: pNum,
        ctaText: 'Watch Video'
      },
      {
        id: `res_${pNum}_tut`,
        title: `Deep Dive Tutorial: ${topic} Engineering Best Practices`,
        url: 'https://realpython.com/',
        category: 'Tutorial',
        source: 'realpython.com',
        snippet: `In-depth hands-on technical tutorial breaking down ${topic} internals, common pitfalls, and design patterns.`,
        score: 0.88,
        topic: topic,
        phaseNumber: pNum,
        ctaText: 'Learn Tutorial'
      },
      {
        id: `res_${pNum}_crs`,
        title: `Production ${topic} & Backend Engineering Specialization`,
        url: 'https://www.coursera.org/resources/back-end-development-interview-prep-guide',
        category: 'Course',
        source: 'coursera.org',
        snippet: `Structured learning pathway and certification prep course focused on ${topic}.`,
        score: 0.86,
        topic: topic,
        phaseNumber: pNum,
        ctaText: 'View Course'
      },
      {
        id: `res_${pNum}_prc`,
        title: `${topic} Coding Challenges & Practice Labs`,
        url: 'https://leetcode.com/problemset/all/',
        category: 'Practice',
        source: 'leetcode.com',
        snippet: `Interactive coding challenges, query tuning exercises, and algorithmic practice problems for ${topic}.`,
        score: 0.85,
        topic: topic,
        phaseNumber: pNum,
        ctaText: 'Practice Problems'
      },
      {
        id: `res_${pNum}_prj`,
        title: `GitHub Repository: ${topic} Open Source Production Project`,
        url: 'https://github.com/jaydeepkarale/backend-engineering-resources',
        category: 'Project',
        source: 'github.com',
        snippet: `Production-ready open-source GitHub repository featuring clean code and deployment manifests for ${topic}.`,
        score: 0.89,
        topic: topic,
        phaseNumber: pNum,
        ctaText: 'View Project'
      }
    ];

    const fallbackData = {
      studentName,
      targetRole,
      targetCompany: 'Top Tech Industry',
      skillGapAnalysis: {
        possessedSkills: currentSkills.length > 0 ? currentSkills : ['JavaScript', 'React', 'Git'],
        missingSkills: ['System Design', 'Docker & CI/CD', 'Cloud Infrastructure', 'Microservices Security'],
        readinessScore: 68,
        analysisSummary: `Solid foundation in ${currentSkills.join(', ') || 'software development'}. To become a ${targetRole}, focus on containerization, cloud infrastructure, and system design.`
      },
      phases: [
        {
          phaseNumber: 1,
          title: 'Core Fundamentals & Prerequisite Tools',
          duration: 'Weeks 1-3',
          description: `Strengthen core prerequisites, data structures, and Linux administration for ${targetRole}.`,
          skillsToLearn: ['Data Structures & Algorithms', 'Linux CLI', 'Git Flow'],
          keyProjects: ['Automated Build & Testing Suite'],
          recommendedTopics: ['Async Architecture', 'Git Branching Strategies', 'Clean Code Principles'],
          resources: ['Async Architecture', 'Git Branching Strategies'].flatMap(t => buildFallbackResources(t, 1)),
          tasks: [
            { id: 'p1_1', text: 'Complete Data Structures & Algorithms Benchmark', done: true },
            { id: 'p1_2', text: 'Configure Linux & Git Workflow Pipeline', done: true }
          ]
        },
        {
          phaseNumber: 2,
          title: `Core ${targetRole} Stack Mastery`,
          duration: 'Weeks 4-6',
          description: 'Master core backend/frontend frameworks, database query tuning, and containerization.',
          skillsToLearn: ['Docker', 'PostgreSQL Query Tuning', 'REST & GraphQL APIs'],
          keyProjects: ['Containerized Multi-Service Web Application'],
          recommendedTopics: ['Database Indexing', 'API Authentication & JWT', 'Docker Compose'],
          resources: ['Database Indexing', 'Docker Compose'].flatMap(t => buildFallbackResources(t, 2)),
          tasks: [
            { id: 'p2_1', text: 'Build Production RESTful API with Auth', done: false },
            { id: 'p2_2', text: 'Containerize Application with Docker Compose', done: false }
          ]
        },
        {
          phaseNumber: 3,
          title: 'Cloud Infrastructure & Hands-On Portfolio Build',
          duration: 'Weeks 7-9',
          description: 'Build a production-grade portfolio application deployed on cloud infrastructure with CI/CD.',
          skillsToLearn: ['AWS EC2 / S3', 'GitHub Actions CI/CD', 'Prometheus & Grafana'],
          keyProjects: [`Production-Grade ${targetRole} Portfolio Project`],
          recommendedTopics: ['Cloud Hosting', 'Continuous Delivery', 'System Monitoring & Logging'],
          resources: ['Cloud Hosting', 'Continuous Delivery'].flatMap(t => buildFallbackResources(t, 3)),
          tasks: [
            { id: 'p3_1', text: 'Deploy Application Stack to AWS Cloud', done: false },
            { id: 'p3_2', text: 'Implement Automated GitHub Actions CI/CD Pipeline', done: false }
          ]
        },
        {
          phaseNumber: 4,
          title: 'System Design, Portfolio Review & Interview Loop',
          duration: 'Weeks 10-12',
          description: 'Prepare for technical interview loops, system design sessions, and resume review with mentors.',
          skillsToLearn: ['System Design', 'Scalability & Caching', 'Mock Interviews'],
          keyProjects: ['Interactive Live Demo & Technical Documentation'],
          recommendedTopics: ['Redis Distributed Caching', 'Load Balancing', 'Alumni Mock Interview'],
          resources: ['Redis Distributed Caching', 'Load Balancing'].flatMap(t => buildFallbackResources(t, 4)),
          tasks: [
            { id: 'p4_1', text: 'Complete Mock System Design Interview Loop', done: false },
            { id: 'p4_2', text: 'Conduct Portfolio Review & Referral Chat with Alumni Mentor', done: false }
          ]
        }
      ]
    };

    await this.saveRoadmap({
      studentId: 'student1',
      targetRole,
      roadmapData: fallbackData,
      skillsToAcquire: fallbackData.skillGapAnalysis.missingSkills
    });

    return fallbackData;
  }
};


export const jobApi = {
  async getJobs() {
    return MOCK_JOBS;
  }
};

function smartNLPParser(prompt, customUserGoal = null) {
  const lower = prompt.toLowerCase();
  const userGoal = customUserGoal || CAREER_GOALS[currentGoalKey];

  const knownSkills = [
    'java', 'spring boot', 'python', 'react', 'node', 'c++', 'aws', 'docker', 
    'ai', 'machine learning', 'system design', 'data', 'testing', 'embedded', 
    'fastapi', 'sql', 'devops', 'cybersecurity', 'android', 'kotlin', 'microservices', 'frontend'
  ];
  const matchedSkills = knownSkills.filter(s => lower.includes(s));

  const knownCompanies = [
    'google', 'bosch', 'purple slate', 'tata', 'capgemini', 'pwc', 'razorpay', 
    'zoho', 'stripe', 'meta', 'vercel', 'openai', 'ultramain', 'cognizant', 'mindtree'
  ];
  const matchedCompanies = knownCompanies.filter(c => lower.includes(c));

  let matches = MOCK_ALUMNI.filter(alum => {
    const alumSkills = (alum.skills || []).map(s => s.toLowerCase());
    const alumRole = (alum.role || alum.title || '').toLowerCase();
    const alumBio = (alum.bio || '').toLowerCase();
    const alumCompany = (alum.company || '').toLowerCase();

    const skillMatch = matchedSkills.some(ms => alumSkills.some(as => as.includes(ms)) || alumRole.includes(ms) || alumBio.includes(ms));
    const companyMatch = matchedCompanies.some(mc => alumCompany.includes(mc));

    if (matchedSkills.length > 0 && matchedCompanies.length > 0) {
      return skillMatch && companyMatch;
    }
    return skillMatch || companyMatch;
  });

  if (matches.length === 0) {
    matches = MOCK_ALUMNI.slice(0, 3);
  }

  const skillText = matchedSkills.length > 0 ? matchedSkills.map(s => s.toUpperCase()).join(', ') : '';
  const companyText = matchedCompanies.length > 0 ? matchedCompanies.map(c => c.toUpperCase()).join(', ') : '';

  let headerText = '';
  if (skillText && companyText) {
    headerText = `I searched our alumni network for ${skillText} specialists at ${companyText} and found ${matches.length} matching mentors:`;
  } else if (skillText) {
    headerText = `I analyzed our verified alumni database for ${skillText} professionals and found ${matches.length} matching alumni:`;
  } else if (companyText) {
    headerText = `Here are verified alumni mentors at ${companyText}:`;
  } else {
    const targetText = userGoal?.targetRole && userGoal?.targetCompany 
      ? `${userGoal.targetRole} at ${userGoal.targetCompany}` 
      : 'your target career goals';
    headerText = `Based on your profile targeting ${targetText}, here are the top recommended alumni mentors:`;
  }

  const formattedAlumni = matches.slice(0, 5).map(a => ({
    ...a,
    matchReason: a.matchReason || `Expertise in ${(a.skills || []).join(', ')} aligns with your career target as ${a.title} @ ${a.company}.`
  }));

  const itemizedText = formattedAlumni.map((a, idx) => {
    return `**${idx + 1}. ${a.name}** (${a.title} @ ${a.company})\n💡 *Why Perfect Match:* ${a.matchReason}`;
  }).join('\n\n');

  return {
    text: `${headerText}\n\n${itemizedText}`,
    suggestedAlumni: formattedAlumni
  };
}

export const aiAssistantApi = {
  async sendMessage(prompt) {
    const currentUser = await userApi.getCurrentUser();
    const userGoal = {
      studentName: currentUser.name || 'Student',
      targetRole: currentUser.targetRole || 'Software Engineer',
      targetCompany: currentUser.targetCompany || 'Tech Enterprise',
      readiness: currentUser.readiness || 75,
      currentSkills: currentUser.skillsList || (Array.isArray(currentUser.skills) ? currentUser.skills : [])
    };
    
    try {
      const res = await fetch(`${getBackendUrl()}/api/ai/copilot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          userGoal,
          currentSkills: userGoal.currentSkills
        })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.text) {
          return {
            id: 'msg_' + Date.now(),
            sender: 'assistant',
            text: json.text,
            suggestedAlumni: json.suggestedAlumni || MOCK_ALUMNI.slice(0, 8),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        }
      }
    } catch (e) {
      console.warn("Backend AI route unavailable, using smart NLP parser:", e);
    }

    const fallback = smartNLPParser(prompt, userGoal);
    return {
      id: 'msg_' + Date.now(),
      sender: 'assistant',
      text: fallback.text,
      suggestedAlumni: fallback.suggestedAlumni,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }
};

export const resumeApi = {
  async parseAndMatchResume(file, text) {
    const content = text || (file ? file.name : '');
    const knownSkillsList = [
      'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express',
      'Java', 'C++', 'PostgreSQL', 'SQL', 'Docker', 'Kubernetes', 'AWS',
      'Machine Learning', 'PyTorch', 'TensorFlow', 'System Design', 'Git',
      'Microservices', 'REST', 'gRPC', 'GraphQL', 'Redis', 'Vector Databases'
    ];

    const extractedSkills = knownSkillsList.filter(sk => 
      content.toLowerCase().includes(sk.toLowerCase())
    );

    const finalSkills = extractedSkills.length > 0 
      ? extractedSkills 
      : ['Python', 'JavaScript', 'Node.js', 'SQL', 'Git', 'System Design'];

    const allAlumni = await alumniApi.getAlumni();
    const topMatches = allAlumni.slice(0, 3).map(a => ({
      name: a.name,
      role: a.role || a.title,
      company: a.company,
      matchScore: Math.floor(Math.random() * 10) + 88,
      reason: `Direct skill overlap in ${finalSkills.slice(0, 2).join(', ')} and career trajectory align with ${a.name}'s role at ${a.company}.`
    }));

    return {
      summary: `Parsed resume document containing ${finalSkills.length} extracted technical competencies. Profile ready for placement benchmarking.`,
      skills: finalSkills,
      readinessScore: Math.min(95, Math.max(65, finalSkills.length * 12 + 40)),
      matches: topMatches
    };
  }
};
