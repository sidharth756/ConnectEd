import React, { useEffect, useState } from 'react';
import { 
  Target, 
  Compass, 
  ArrowRight, 
  X,
  CheckCircle2,
  RefreshCw,
  UserCheck,
  Award,
  AlertTriangle,
  Sparkles,
  BookOpen,
  CheckSquare,
  Users,
  Code,
  ShieldCheck,
  TrendingUp,
  Layers,
  Bot
} from 'lucide-react';
import { alumniApi, userApi, roadmapApi } from '../services/api';
import AlumniProfileModal from '../components/AlumniProfileModal';

export default function DashboardPage({ user: propUser, setActiveTab, onOpenAI, onOpenEditProfile }) {
  const [user, setUser] = useState(propUser || null);
  const [topAlumni, setTopAlumni] = useState([]);
  const [roadmapData, setRoadmapData] = useState(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [detailedAlumniModal, setDetailedAlumniModal] = useState(null);
  const [loading, setLoading] = useState(true);

  const careerOptions = [
    'AI / ML Engineer',
    'Senior AI Engineer',
    'Full Stack Software Engineer',
    'Backend Systems Architect',
    'Cloud DevOps Engineer',
    'Data & Analytics Engineer'
  ];

  useEffect(() => {
    if (propUser) {
      setUser(propUser);
    }
  }, [propUser]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const userData = propUser ? await Promise.resolve(propUser) : await userApi.getCurrentUser();
      const currentUserId = userData?.id || 'student1';
      const [alumniData, rData] = await Promise.all([
        alumniApi.getAlumni(),
        roadmapApi.getRoadmap(currentUserId)
      ]);
      setUser(userData);
      setTopAlumni((alumniData || []).slice(0, 3));
      setRoadmapData(rData);
    } catch (e) {
      console.error("Dashboard load error", e);
    } finally {
      setLoading(false);
    }
  }

  const handleSelectGoal = async (goalKey) => {
    await userApi.updateCareerGoal(goalKey);
    setIsGoalModalOpen(false);
    await loadData();
  };

  if (loading || !user) {
    return (
      <div className="p-8 space-y-6 animate-pulse max-w-7xl w-full mx-auto">
        <div className="h-32 bg-white dark:bg-[#162030] rounded-2xl border border-slate-200 dark:border-[#233147]"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-white dark:bg-[#162030] rounded-2xl border border-slate-200 dark:border-[#233147]"></div>
          ))}
        </div>
      </div>
    );
  }

  const isDemoAlex = user.id === 'user_101' || user.email === 'alex.johnson@kce.edu';
  const hasTargetGoal = Boolean(user.targetRole && user.targetRole.trim() !== '');

  // Only Alex Johnson demo persona gets pre-seeded demo roadmap if no DB roadmap exists
  const activePhase = roadmapData?.phases?.[1] || roadmapData?.phases?.[0] || (isDemoAlex ? {
    phaseNumber: 2,
    title: 'Phase 2: Database Scalability & Cache Architectures',
    duration: 'Weeks 5 – 8',
    tasks: [
      { id: 't1', text: 'Optimize PostgreSQL Queries with EXPLAIN ANALYZE', done: true },
      { id: 't2', text: 'Configure Redis Cluster with Eviction Policies', done: false },
      { id: 't3', text: 'Integrate Vector Search for RAG Embeddings', done: false }
    ]
  } : null);

  const daysCompleted = user.daysCompleted !== undefined ? user.daysCompleted : (isDemoAlex ? 36 : 1);
  const targetDays = user.targetDays || 100;
  const daysLeft = Math.max(0, targetDays - daysCompleted);

  const userSkillList = Array.isArray(user.skillsList) ? user.skillsList : (Array.isArray(user.skills) ? user.skills : []);
  const hasSkill = (name) => userSkillList.some(s => String(s).toLowerCase().includes(name.toLowerCase()));

  const alexDemoSkillMeters = [
    { name: 'Python Internals & Async I/O', current: hasSkill('python') ? 75 : 30, target: 90 },
    { name: 'Machine Learning & LLM Pipelines', current: (hasSkill('pytorch') || hasSkill('machine learning')) ? 70 : 25, target: 85 },
    { name: 'System Architecture & Scalability', current: hasSkill('system') ? 65 : 35, target: 80 },
    { name: 'Vector Databases (pgvector/Pinecone)', current: hasSkill('sql') ? 60 : 20, target: 85 }
  ];

  let skillMeters = [];
  if (Array.isArray(user.skills) && typeof user.skills[0] === 'object' && user.skills.length > 0) {
    skillMeters = user.skills;
  } else if (isDemoAlex) {
    skillMeters = alexDemoSkillMeters;
  } else if (userSkillList.length > 0) {
    skillMeters = userSkillList.map(skName => ({
      name: typeof skName === 'string' ? skName : (skName.name || 'Skill'),
      current: typeof skName === 'object' ? (skName.current || 50) : 60,
      target: typeof skName === 'object' ? (skName.target || 85) : 85
    }));
  }

  const criticalSkillGapsCount = skillMeters.length > 0 ? skillMeters.filter(s => s.current < 50).length : 0;
  const topCriticalGap = skillMeters.length > 0 ? (skillMeters.find(s => s.current < 50)?.name?.split(' ')?.[0] || 'None') : 'None';

  let readinessPercent = 0;
  if (user.readiness !== undefined && user.readiness !== null && user.readiness !== 0) {
    readinessPercent = user.readiness;
  } else if (skillMeters.length > 0) {
    readinessPercent = Math.round(
      skillMeters.reduce((acc, curr) => acc + (curr.current / curr.target), 0) / skillMeters.length * 100
    );
  } else if (isDemoAlex) {
    readinessPercent = 64;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto">
      
      {/* 1. Student Profile Banner Header */}
      <div className="pro-card p-6 rounded-2xl bg-white dark:bg-[#162030] border border-slate-200 dark:border-[#233147] shadow-sm dark:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start space-x-4">
          <div className="relative flex-none w-16 h-16 sm:w-20 sm:h-20">
            <img 
              src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'} 
              alt={user.name} 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-indigo-500 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1 rounded-full text-xs shadow" title="Verified KCE Student">
              <ShieldCheck className="w-3.5 h-3.5 stroke-[3]" />
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{user.name}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                STUDENT
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                ⏱️ 100-DAY CHALLENGE
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              {user.degree || user.major ? `${user.degree || user.major} • ` : ''}KCE (Class of {user.graduationYear || 2026})
            </p>
            <div className="flex items-center space-x-2 text-xs font-bold pt-0.5">
              <span className="text-slate-500 dark:text-slate-400">Target Goal:</span>
              {hasTargetGoal ? (
                <span className="text-indigo-600 dark:text-indigo-400">{user.targetRole} {user.targetCompany ? `@ ${user.targetCompany}` : ''}</span>
              ) : (
                <span className="text-amber-500 font-bold italic">Not Configured (Click 'Setup Career Goal')</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button 
            onClick={() => setIsGoalModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0d131f] hover:bg-slate-100 dark:hover:bg-[#192436] text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-[#253349] transition flex items-center space-x-1.5 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{hasTargetGoal ? 'Change Career Goal' : 'Setup Career Goal'}</span>
          </button>
          <button 
            onClick={onOpenEditProfile}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition"
          >
            View & Edit Full Profile
          </button>
        </div>
      </div>

      {/* Onboarding Banner for New Accounts with Blank Goals */}
      {!hasTargetGoal && (
        <div className="p-5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/80 text-amber-900 dark:text-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-none mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-extrabold text-sm">Target Career Goal Not Configured</h3>
              <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                Welcome, {user.name}! Your account profile is clean. Select your target career role (e.g. Senior AI Engineer, Full Stack Software Engineer) and target company to initialize your placement roadmap and skill benchmark scoring.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-none">
            <button 
              onClick={() => setIsGoalModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-sm transition"
            >
              Set Career Goal
            </button>
            <button 
              onClick={onOpenEditProfile}
              className="px-4 py-2 rounded-xl bg-white dark:bg-[#162030] hover:bg-slate-100 dark:hover:bg-[#192436] text-slate-800 dark:text-slate-200 font-bold text-xs border border-amber-300 dark:border-amber-800 transition"
            >
              Fill Profile Details
            </button>
          </div>
        </div>
      )}

      {/* 2. Top Metric KPI Row (4 Stat Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Target Readiness */}
        <div className="pro-card p-4 rounded-2xl bg-white dark:bg-[#162030] border border-slate-200 dark:border-[#233147] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Target Readiness</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{readinessPercent}%</span>
            {readinessPercent > 0 && (
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +8% gain
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {hasTargetGoal ? `For ${user.targetRole}` : 'Goal Not Set'}
          </p>
        </div>

        {/* Card 2: Skill Gaps Identified */}
        <div className="pro-card p-4 rounded-2xl bg-white dark:bg-[#162030] border border-slate-200 dark:border-[#233147] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Critical Skill Gaps</span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{criticalSkillGapsCount} Gaps</span>
            <span className="text-[11px] font-bold text-slate-500">{topCriticalGap}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {user.targetCompany ? `Priority for ${user.targetCompany}` : 'Target Company Not Set'}
          </p>
        </div>

        {/* Card 3: Alumni Mentors Matched */}
        <div className="pro-card p-4 rounded-2xl bg-white dark:bg-[#162030] border border-slate-200 dark:border-[#233147] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Alumni Matches</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{topAlumni.length || 0} Mentors</span>
            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">Verified KCE</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Verified Alumni Directory</p>
        </div>

        {/* Card 4: 100-Day Target Horizon */}
        <div className="pro-card p-4 rounded-2xl bg-white dark:bg-[#162030] border border-slate-200 dark:border-[#233147] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">100-Day Target Horizon</span>
            <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">Day {daysCompleted} / {targetDays}</span>
            <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">{daysLeft} Days Left</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">100-Day Target Placement Horizon</p>
        </div>
      </div>

      {/* 3. Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Career Goal & Skill Benchmark Level Matrix */}
          <div className="pro-card p-6 rounded-2xl bg-white dark:bg-[#162030] border border-slate-200 dark:border-[#233147] shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#233147] pb-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">TARGET BENCHMARK METRICS</span>
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">{hasTargetGoal ? user.targetRole : 'Target Career Goal Not Set'}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user.targetCompany ? `Benchmark standard at ${user.targetCompany}` : 'Select a target role and company to view hiring benchmarks'}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Overall Readiness</span>
                <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{readinessPercent}%</div>
              </div>
            </div>

            {/* Overall Readiness Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-extrabold">
                <span className="text-slate-700 dark:text-slate-200">Overall Trajectory Completion</span>
                <span className="text-indigo-600 dark:text-indigo-400">{readinessPercent}% Ready</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-[#0d131f] rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-[#253349]">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500" 
                  style={{ width: `${readinessPercent}%` }}
                />
              </div>
            </div>

            {/* Individual Skill Meter Progress Bars */}
            <div className="space-y-3 pt-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                &lt;&gt; Key Skill Benchmark Levels vs Target Standard
              </span>

              {skillMeters.length === 0 ? (
                <div className="p-6 text-center text-slate-400 bg-slate-50 dark:bg-[#0d131f] rounded-xl border border-slate-200 dark:border-[#253349] space-y-2">
                  <BookOpen className="w-8 h-8 mx-auto stroke-1" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No Skill Benchmarks Configured</p>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">Set your career goal or add your current skills in profile settings to populate skill benchmark levels.</p>
                  <button 
                    onClick={() => setIsGoalModalOpen(true)}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-sm mt-1"
                  >
                    Set Target Career Goal
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {skillMeters.map((sk, idx) => {
                    const isGap = sk.current < 50;
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900 dark:text-slate-100">{sk.name}</span>
                            {isGap && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded font-extrabold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                CRITICAL GAP
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-bold text-slate-500">
                            You: <strong className="text-indigo-600 dark:text-indigo-400">{sk.current}%</strong> / Target: {sk.target}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-[#0d131f] rounded-full overflow-hidden border border-slate-200 dark:border-[#253349]">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${isGap ? 'bg-amber-500' : 'bg-indigo-600'}`} 
                            style={{ width: `${sk.current}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-[#233147]">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Based on real-time placement standards</span>
              <button 
                onClick={() => setActiveTab('goal')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-extrabold flex items-center space-x-1"
              >
                <span>View Full Skill Gap Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Active Roadmap Phase Checklist Preview */}
          <div className="pro-card p-6 rounded-2xl bg-white dark:bg-[#162030] border border-slate-200 dark:border-[#233147] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#233147] pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">ACTIVE ROADMAP MILESTONE</span>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{activePhase ? activePhase.title : 'No Roadmap Milestone Active'}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Timeline: {activePhase ? (activePhase.duration || 'Weeks 1 – 4') : 'Not Set'}</p>
              </div>
              <button 
                onClick={() => setActiveTab('roadmap')}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center space-x-1.5 flex-none"
              >
                <span>Open Interactive Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {!activePhase ? (
              <div className="p-6 text-center text-slate-400 bg-slate-50 dark:bg-[#0d131f] rounded-xl border border-slate-200 dark:border-[#253349] space-y-2">
                <Compass className="w-8 h-8 mx-auto stroke-1" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No Active Roadmap Milestones</p>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">Set up your target career goal to generate a 4-phase milestone trajectory customized to your target role.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Active Milestone Tasks</span>
                </span>
                <div className="space-y-1.5">
                  {(activePhase.tasks || []).slice(0, 3).map((t, tIdx) => (
                    <div 
                      key={t.id || tIdx}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition ${
                        t.done 
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-bold' 
                          : 'bg-slate-50 dark:bg-[#0d131f] border-slate-200 dark:border-[#253349] text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className={`w-4 h-4 rounded flex items-center justify-center ${
                          t.done ? 'bg-emerald-600 text-white' : 'border border-slate-400 bg-white dark:bg-[#0d131f]'
                        }`}>
                          {t.done && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                        <span className={t.done ? 'line-through opacity-80' : ''}>{t.text}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        t.done ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-[#162030] text-slate-600 dark:text-slate-400'
                      }`}>
                        {t.done ? 'DONE' : 'TO DO'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Top Matched Alumni Mentors Spotlight */}
          <div className="pro-card p-6 rounded-2xl bg-white dark:bg-[#162030] border border-slate-200 dark:border-[#233147] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#233147] pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Top Matched Alumni Mentors</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Verified alumni available for 1-on-1 sessions and referrals.</p>
              </div>
              <button 
                onClick={() => setActiveTab('alumni')}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-extrabold hover:underline"
              >
                Explore All Mentors →
              </button>
            </div>

            <div className="space-y-3">
              {topAlumni.map((alum) => (
                <div 
                  key={alum.id} 
                  onClick={() => setDetailedAlumniModal(alum)}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0d131f] border border-slate-200 dark:border-[#253349] flex items-center justify-between gap-3 cursor-pointer group/row hover:border-indigo-400/50 transition"
                >
                  <div className="flex items-center space-x-3">
                    <img src={alum.avatar} alt={alum.name} className="w-11 h-11 rounded-xl object-cover ring-2 ring-indigo-500/30 flex-none group-hover/row:ring-indigo-500 transition" />
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs group-hover/row:text-indigo-500 transition">{alum.name}</h4>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
                          {alum.matchScore || 94}% Match
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">{alum.title} @ {alum.company}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{alum.graduationYear} KCE Alum • {alum.availability || 'Available'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setDetailedAlumniModal(alum);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition flex-none"
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Alumni Profile Deep-Dive Modal */}
        {detailedAlumniModal && (
          <AlumniProfileModal
            alumni={detailedAlumniModal}
            onClose={() => setDetailedAlumniModal(null)}
            onOpenRequestMentorship={() => setActiveTab('alumni')}
            user={user}
          />
        )}

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Dominant NEXT BEST ACTION Card */}
          <div className="pro-card p-6 rounded-2xl border-2 border-indigo-500/40 dark:border-indigo-600/50 bg-white dark:bg-[#162030] space-y-4 shadow-md">
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Next Best Action</span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {hasTargetGoal ? (user.nextAction || 'Complete Skill Gap Milestone') : 'Set Your Target Career Goal'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {hasTargetGoal 
                  ? 'Completing your roadmap milestones increases your career readiness score.' 
                  : 'Choosing your target role & enterprise will generate your 100-day placement roadmap and skill benchmark scoring.'}
              </p>
            </div>

            <button 
              onClick={() => hasTargetGoal ? setActiveTab('roadmap') : setIsGoalModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2 active:scale-95"
            >
              <span>{hasTargetGoal ? 'Continue Roadmap Trajectory' : 'Setup Target Goal Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* AI Career Insights & Copilot Box */}
          <div className="pro-card p-5 rounded-2xl bg-slate-50 dark:bg-[#0d131f] border border-slate-200 dark:border-[#253349] space-y-3">
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
              <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>AI Copilot Recommendation</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {hasTargetGoal 
                ? (skillMeters.length > 0 
                  ? `Based on your profile, focusing on ${topCriticalGap !== 'None' ? topCriticalGap : 'core system fundamentals'} provides the fastest boost to your ${user.targetRole} readiness.` 
                  : `Welcome ${user.name}! Add your current skills in profile settings to generate skill gap recommendations.`)
                : `Welcome ${user.name}! You haven't set a target career goal yet. Click 'Ask AI Copilot for Advice' to explore recommended career tracks for KCE students.`}
            </p>
            <button 
              onClick={onOpenAI}
              className="w-full py-2 rounded-xl bg-white dark:bg-[#162030] hover:bg-slate-100 dark:hover:bg-[#1f2d45] text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-[#253349] shadow-sm transition flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Ask AI Copilot for Advice</span>
            </button>
          </div>

          {/* Activity & Database Sync Feed */}
          <div className="pro-card p-5 rounded-2xl bg-white dark:bg-[#162030] border border-slate-200 dark:border-[#233147] shadow-sm space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Live System Status</span>
            </h4>
            <div className="space-y-2 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
              <div className="flex items-center justify-between">
                <span>PostgreSQL DB Sync</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">CONNECTED</span>
              </div>
              <div className="flex items-center justify-between">
                <span>AI Recommendation Engine</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Alumni Network Matches</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">{topAlumni.length || 0} Mentors</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Career Goal Selector Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="pro-card max-w-md w-full rounded-2xl p-6 space-y-5 bg-white dark:bg-[#162030] border border-slate-200 dark:border-[#233147] shadow-2xl relative text-slate-900 dark:text-white">
            <button 
              onClick={() => setIsGoalModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">Select Your Target Career Goal</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Choose a target career track to update benchmarks and AI skill gap analysis.</p>
            </div>

            <div className="space-y-2">
              {careerOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelectGoal(option)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#0d131f] hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-slate-200 dark:border-[#253349] hover:border-indigo-300 dark:hover:border-indigo-800 text-left font-bold text-xs text-slate-800 dark:text-slate-200 transition flex items-center justify-between group"
                >
                  <span>{option}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
