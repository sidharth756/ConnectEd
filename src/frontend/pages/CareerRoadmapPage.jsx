import React, { useEffect, useState } from 'react';
import { 
  Compass, 
  CheckCircle2, 
  Sparkles, 
  Calendar, 
  Users, 
  Clock,
  Check,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Award,
  Database,
  RefreshCw,
  X,
  ExternalLink,
  BookOpen,
  Code,
  Layers,
  CheckSquare,
  Wrench,
  Target,
  HelpCircle,
  AlertCircle,
  FileText,
  Plus
} from 'lucide-react';
import { roadmapApi, userApi, careerIntelligenceApi } from '../services/api';

export default function CareerRoadmapPage({ user: propUser, setActiveTab, onOpenAI }) {
  const [roadmapData, setRoadmapData] = useState(null);
  const [user, setUser] = useState(propUser || null);
  const [expandedPhases, setExpandedPhases] = useState({});
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [dbSaved, setDbSaved] = useState(false);

  // Market Intelligence state
  const [marketIntel, setMarketIntel] = useState(null);
  const [intelLoading, setIntelLoading] = useState(false);
  
  // Task level learning resources state
  const [taskResourcesMap, setTaskResourcesMap] = useState({});
  const [expandedTaskResources, setExpandedTaskResources] = useState({});

  // Custom AI Roadmap Modal state
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [targetRoleInput, setTargetRoleInput] = useState('');
  const [timelineWeeksInput, setTimelineWeeksInput] = useState(12);

  const toggleTaskResources = async (taskId, taskText, skills = []) => {
    const isExpanding = !expandedTaskResources[taskId];
    setExpandedTaskResources(prev => ({ ...prev, [taskId]: isExpanding }));

    if (isExpanding && (!taskResourcesMap[taskId] || taskResourcesMap[taskId].error)) {
      setTaskResourcesMap(prev => ({
        ...prev,
        [taskId]: { loading: true, resources: [], practice: null, outcome: null, error: null }
      }));

      try {
        const res = await roadmapApi.getTaskResources({ taskId, taskText, skills });
        if (res.success && res.resources && res.resources.length > 0) {
          setTaskResourcesMap(prev => ({
            ...prev,
            [taskId]: { 
              loading: false, 
              resources: res.resources, 
              practice: res.practice, 
              outcome: res.outcome, 
              topic: res.topic, 
              error: null 
            }
          }));
        } else {
          setTaskResourcesMap(prev => ({
            ...prev,
            [taskId]: { loading: false, resources: [], practice: null, outcome: null, error: res.message || 'Learning resources currently unavailable for this custom task.' }
          }));
        }
      } catch (e) {
        setTaskResourcesMap(prev => ({
          ...prev,
          [taskId]: { loading: false, resources: [], practice: null, outcome: null, error: 'Learning resources currently unavailable for this custom task.' }
        }));
      }
    }
  };



  const presetRoles = [
    'Full Stack Software Engineer',
    'AI / ML Engineer',
    'Backend Systems Architect',
    'Data & Analytics Engineer',
    'Cloud DevOps Engineer',
    'Product Manager'
  ];

  useEffect(() => {
    if (propUser) {
      setUser(propUser);
    }
  }, [propUser]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [u, rData] = await Promise.all([
        propUser ? Promise.resolve(propUser) : userApi.getCurrentUser(),
        roadmapApi.getRoadmap('student1')
      ]);
      setUser(u);
      
      let parsedRoadmap = rData;
      if (Array.isArray(rData)) {
        parsedRoadmap = normalizeLegacyRoadmap(rData, u);
      }
      
      // Ensure we always have valid phases
      if (!parsedRoadmap || !parsedRoadmap.phases || !Array.isArray(parsedRoadmap.phases) || parsedRoadmap.phases.length === 0) {
        parsedRoadmap = getDefault4PhaseRoadmap(u?.targetRole, u);
      }

      setRoadmapData(parsedRoadmap);

      if (parsedRoadmap && parsedRoadmap.phases && parsedRoadmap.phases.length > 0) {
        setExpandedPhases({ [parsedRoadmap.phases[0].phaseNumber || 1]: true });
      }
      setLoading(false);

      // Fetch Tavily Market Intelligence
      const targetRole = parsedRoadmap?.targetRole || u?.targetRole || 'Senior AI Engineer';
      const skills = parsedRoadmap?.skillGapAnalysis?.possessedSkills || u?.skills || [];
      fetchMarketIntel(targetRole, skills);
    }
    load();
  }, []);

  async function fetchMarketIntel(role, skills = []) {
    setIntelLoading(true);
    try {
      const intel = await careerIntelligenceApi.analyze({
        careerGoal: role,
        currentSkills: skills
      });
      setMarketIntel(intel);
    } catch (e) {
      console.warn("Error fetching market intelligence:", e);
    } finally {
      setIntelLoading(false);
    }
  }

  function getDefault4PhaseRoadmap(targetRole, userInfo) {
    const isDemoAlex = userInfo?.id === 'user_101' || userInfo?.email === 'alex.johnson@kce.edu';
    const hasRole = Boolean(targetRole || userInfo?.targetRole);
    const roleName = targetRole || userInfo?.targetRole || (isDemoAlex ? 'Senior AI Engineer' : '');
    const companyName = userInfo?.targetCompany || (isDemoAlex ? 'Google DeepMind' : '');
    const possessed = (userInfo?.skillsList || userInfo?.skills?.map(s => typeof s === 'string' ? s : s.name)) || (isDemoAlex ? ['Python', 'React', 'Git', 'Data Structures'] : []);
    const readiness = userInfo?.readiness !== undefined && userInfo?.readiness !== null && userInfo?.readiness !== 0 ? userInfo.readiness : (isDemoAlex ? 64 : 0);

    return {
      studentName: userInfo?.name || (isDemoAlex ? 'Alex Johnson' : 'Student'),
      targetRole: roleName,
      targetCompany: companyName,
      skillGapAnalysis: {
        possessedSkills: possessed,
        missingSkills: hasRole ? ['System Design & Architecture', 'Docker & Kubernetes', 'PostgreSQL & Vector DBs', 'Model Deployment & Monitoring'] : [],
        readinessScore: readiness,
        analysisSummary: hasRole 
          ? `Solid foundation in core engineering. Focused execution on milestone tasks will bridge your benchmark gap to target readiness.`
          : `Target career goal not configured. Set up your target goal to generate your personalized 4-phase placement trajectory.`
      },
      phases: [
        {
          phaseNumber: 1,
          title: 'Phase 1: Deep Core Mastery & System Foundations',
          duration: 'Weeks 1 – 4',
          description: 'Solidify core programming language internals, asynchronous I/O models, and clean architectural design patterns.',
          skillsToLearn: ['Data Structures & Algorithms', 'Python Internals', 'Async Concurrency', 'REST & gRPC APIs'],
          keyProjects: ['High-Throughput Concurrent Task Queue Engine'],
          recommendedTopics: ['Event Loop Internals', 'Memory Optimization & Garbage Collection', 'Clean Code Principles'],
          tasks: [
            { id: 'p1_t1', text: 'Master Advanced Async/Await & Event Loop Internals', done: true },
            { id: 'p1_t2', text: 'Implement Custom Concurrent Queue with Exponential Backoff Retry', done: true },
            { id: 'p1_t3', text: 'Build High-Performance gRPC Microservice Communication Layer', done: false }
          ]
        },
        {
          phaseNumber: 2,
          title: 'Phase 2: Database Scalability & Cache Architectures',
          duration: 'Weeks 5 – 8',
          description: 'Master relational schema optimization, query indexing, caching strategies, and vector data persistence.',
          skillsToLearn: ['PostgreSQL Indexing & Partitioning', 'Redis Caching Clusters', 'Vector DBs (pgvector/Pinecone)', 'Schema Migrations'],
          keyProjects: ['Distributed Cache & Vector Search Engine for AI Embeddings'],
          recommendedTopics: ['B-Tree Indexing & EXPLAIN ANALYZE', 'Write-Through vs Cache-Aside Patterns', 'HNSW Vector Indexes'],
          tasks: [
            { id: 'p2_t1', text: 'Optimize PostgreSQL Queries using Composite Indexes & EXPLAIN ANALYZE', done: true },
            { id: 'p2_t2', text: 'Configure Distributed Redis Cluster with LRU Eviction Policies', done: false },
            { id: 'p2_t3', text: 'Integrate Vector Similarity Search for RAG Embeddings', done: false }
          ]
        },
        {
          phaseNumber: 3,
          title: 'Phase 3: Containerization, Kubernetes & DevOps Infrastructure',
          duration: 'Weeks 9 – 12',
          description: 'Deploy microservice stacks using Docker containers, automated CI/CD pipelines, and cloud orchestrators.',
          skillsToLearn: ['Docker Multi-stage Builds', 'Kubernetes Orchestration', 'CI/CD Pipelines (GitHub Actions)', 'Prometheus & Grafana Tracing'],
          keyProjects: ['Production CI/CD Pipeline & Kubernetes Deployment Manifests'],
          recommendedTopics: ['Container Security & Image Minimization', 'Zero-downtime Rolling Updates', 'Observability & Metrics'],
          tasks: [
            { id: 'p3_t1', text: 'Dockerize Full-Stack Services with Multi-stage Minimal Images', done: false },
            { id: 'p3_t2', text: 'Setup Automated GitHub Actions CI/CD Integration Pipeline', done: false },
            { id: 'p3_t3', text: 'Deploy Kubernetes Ingress & Configure Health Check Probes', done: false }
          ]
        },
        {
          phaseNumber: 4,
          title: 'Phase 4: Enterprise Architecture & Alumni Mock Interview Prep',
          duration: 'Weeks 13 – 16',
          description: 'Synthesize full-stack systems knowledge into high-availability architecture diagrams and practice mock technical interviews.',
          skillsToLearn: ['System Design Architecture', 'Load Balancing & Rate Limiting', 'Failover & Circuit Breakers', 'Alumni Mock Interview Mastery'],
          keyProjects: ['End-to-End Scalable System Architecture Portfolio Presentation'],
          recommendedTopics: ['Distributed Rate Limiting (Token Bucket)', 'CAP Theorem & Eventual Consistency', 'Behavioral & Architecture Interview Prep'],
          tasks: [
            { id: 'p4_t1', text: 'Design End-to-End High Availability System Architecture Diagram', done: false },
            { id: 'p4_t2', text: 'Schedule Mock Technical Architecture Interview with Verified Alumni Mentor', done: false },
            { id: 'p4_t3', text: 'Request Direct Internal Job Referral via ConnectEd Alumni Network', done: false }
          ]
        }
      ]
    };
  }

  function normalizeLegacyRoadmap(legacyArray, userInfo) {
    if (!legacyArray || legacyArray.length === 0) return getDefault4PhaseRoadmap(userInfo?.targetRole, userInfo);
    return {
      studentName: userInfo?.name || 'Alex Johnson',
      targetRole: userInfo?.targetRole || 'Software Engineer',
      targetCompany: userInfo?.targetCompany || 'Google',
      skillGapAnalysis: {
        possessedSkills: userInfo?.skills?.map(s => typeof s === 'string' ? s : s.name) || ['Java', 'React', 'SQL'],
        missingSkills: ['System Design', 'Docker', 'PostgreSQL', 'Cloud Deployments'],
        readinessScore: userInfo?.readiness || 65,
        analysisSummary: `Solid background. Focus on system architecture and cloud infrastructure to reach target readiness.`
      },
      phases: legacyArray.map((node, idx) => ({
        phaseNumber: idx + 1,
        title: node.title || `Phase ${idx + 1}`,
        duration: node.duration || `Weeks ${idx * 3 + 1}-${idx * 3 + 3}`,
        description: node.subtitle || 'Milestone phase for target role mastery.',
        skillsToLearn: node.skills || ['System Design', 'Docker', 'PostgreSQL'],
        keyProjects: node.projects || ['Hands-on Architecture Project'],
        recommendedTopics: ['REST APIs', 'Cloud Services', 'Database Query Tuning'],
        tasks: node.tasks || [
          { id: `t_${idx}_1`, text: 'Core Architecture Review', done: true },
          { id: `t_${idx}_2`, text: 'Build Practical Demo Module', done: false }
        ]
      }))
    };
  }

  const togglePhaseExpand = (phaseNum) => {
    setExpandedPhases(prev => ({ ...prev, [phaseNum]: !prev[phaseNum] }));
  };

  const handleToggleTask = async (phaseIndex, taskIndex) => {
    if (!roadmapData || !roadmapData.phases) return;

    const updatedPhases = [...roadmapData.phases];
    const targetPhase = { ...updatedPhases[phaseIndex] };
    const updatedTasks = [...(targetPhase.tasks || [])];
    
    updatedTasks[taskIndex] = {
      ...updatedTasks[taskIndex],
      done: !updatedTasks[taskIndex].done
    };
    targetPhase.tasks = updatedTasks;
    updatedPhases[phaseIndex] = targetPhase;

    const totalTasks = updatedPhases.reduce((acc, p) => acc + (p.tasks?.length || 0), 0);
    const completedTasks = updatedPhases.reduce((acc, p) => acc + (p.tasks?.filter(t => t.done)?.length || 0), 0);
    const newReadiness = totalTasks > 0 ? Math.min(98, Math.max(35, Math.round((completedTasks / totalTasks) * 60 + 35))) : 65;

    const updatedRoadmapData = {
      ...roadmapData,
      phases: updatedPhases,
      skillGapAnalysis: {
        ...roadmapData.skillGapAnalysis,
        readinessScore: newReadiness
      }
    };

    setRoadmapData(updatedRoadmapData);

    const res = await roadmapApi.saveRoadmap({
      studentId: 'student1',
      targetRole: updatedRoadmapData.targetRole || user?.targetRole || 'Software Engineer',
      roadmapData: updatedRoadmapData,
      skillsToAcquire: updatedRoadmapData.skillGapAnalysis?.missingSkills || []
    });

    if (res.success) {
      setDbSaved(true);
      setTimeout(() => setDbSaved(false), 2500);
    }
  };

  const handleRefreshMarketRoadmap = async () => {
    setGenerating(true);
    try {
      const role = roadmapData?.targetRole || user?.targetRole || 'Software Engineer';
      const skills = user?.skills?.map(s => typeof s === 'string' ? s : s.name) || ['Python', 'Git', 'JavaScript'];
      
      const updatedData = await roadmapApi.refreshMarketRoadmap({
        targetRole: role,
        currentSkills: skills,
        timelineWeeks: timelineWeeksInput
      });

      if (updatedData) {
        setRoadmapData(updatedData);
        setDbSaved(true);
        setTimeout(() => setDbSaved(false), 3000);
      }
    } catch (e) {
      console.error("Market roadmap refresh error:", e);
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateCustomAIRoadmap = async (roleToGenerate) => {
    const role = roleToGenerate || targetRoleInput || user?.targetRole || 'Senior AI Engineer';
    setGenerating(true);
    try {
      const generatedData = await roadmapApi.generateAIRoadmap({
        studentName: user?.name || 'Alex Johnson',
        targetRole: role,
        currentSkills: user?.skills?.map(s => typeof s === 'string' ? s : s.name) || ['JavaScript', 'React', 'Git', 'Python'],
        bio: user?.bio || '',
        timelineWeeks: timelineWeeksInput
      });

      const finalRoadmap = (generatedData && generatedData.phases && generatedData.phases.length > 0) 
        ? generatedData 
        : getDefault4PhaseRoadmap(role, user);

      setRoadmapData(finalRoadmap);
      if (finalRoadmap?.phases && finalRoadmap.phases.length > 0) {
        setExpandedPhases({ [finalRoadmap.phases[0].phaseNumber || 1]: true });
      }

      fetchMarketIntel(role, user?.skills?.map(s => typeof s === 'string' ? s : s.name) || []);

      setIsCustomizerOpen(false);
      setDbSaved(true);
      setTimeout(() => setDbSaved(false), 3000);
    } catch (e) {
      console.error("Generate roadmap error", e);
      setRoadmapData(getDefault4PhaseRoadmap(role, user));
    } finally {
      setGenerating(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="p-8 text-center text-slate-400 space-y-4 max-w-4xl mx-auto">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="font-bold text-sm">Loading Database-Persisted Career Roadmap...</p>
      </div>
    );
  }

  const currentRole = roadmapData?.targetRole || user.targetRole;
  const readiness = roadmapData?.skillGapAnalysis?.readinessScore || user.readiness || 65;
  const missingSkills = roadmapData?.skillGapAnalysis?.missingSkills || ['System Design', 'Docker', 'Cloud Services'];
  const possessedSkills = roadmapData?.skillGapAnalysis?.possessedSkills || ['JavaScript', 'React', 'Git'];
  const phases = roadmapData?.phases || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl w-full mx-auto">
      {/* DB Persistence Status Alert */}
      {dbSaved && (
        <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Progress automatically saved to PostgreSQL Database!</span>
          </div>
          <span className="text-[10px] bg-emerald-800 text-white px-2 py-0.5 rounded font-bold">DATABASE SYNCED</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2.5">
            <Compass className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Interactive Career Roadmap Trajectory</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Dynamic AI milestone trajectory stored in database for target role: <strong className="text-slate-900 dark:text-white font-bold">{currentRole}</strong>.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button 
            onClick={() => handleRefreshMarketRoadmap()}
            disabled={generating}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md transition flex items-center space-x-2 active:scale-95 disabled:opacity-50"
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Researching Web Market (Tavily)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-100" />
                <span>Update Roadmap (Tavily Research)</span>
              </>
            )}
          </button>

          <button 
            onClick={() => setIsCustomizerOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#162030] hover:bg-slate-100 dark:hover:bg-[#1f2d45] text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-[#233147] shadow-sm transition flex items-center space-x-2"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Customize AI Target Role</span>
          </button>
        </div>
      </div>

      {/* Market-Driven Updates Banner (Tavily Research Output) */}
      {roadmapData?.marketUpdates && (
        <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-800 text-slate-100 shadow-md space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-indigo-900/60 pb-2">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="font-extrabold uppercase text-indigo-300 tracking-wider">Market-Driven Updates (Tavily Web Research & Extract)</span>
            </div>
            <span className="text-[10px] text-indigo-300 bg-indigo-900/80 px-2.5 py-0.5 rounded-lg border border-indigo-700 font-bold">Updated: {roadmapData.marketUpdates.updatedAt}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-indigo-300 uppercase flex items-center space-x-1">
                <Plus className="w-3 h-3 text-indigo-300" />
                <span>Added Missing Skills to Roadmap:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(roadmapData.marketUpdates.addedSkills || []).map((sk, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-indigo-900/80 text-indigo-200 border border-indigo-700 font-bold text-[11px] flex items-center space-x-1">
                    <Plus className="w-3 h-3 text-indigo-300 flex-none" />
                    <span>{sk}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-emerald-400 uppercase flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Already Covered Student Skills:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(roadmapData.marketUpdates.coveredSkills || []).map((sk, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 font-bold text-[11px] flex items-center space-x-1">
                    <Check className="w-3 h-3 text-emerald-400 flex-none" />
                    <span>{sk}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {roadmapData.marketUpdates.marketInsights && roadmapData.marketUpdates.marketInsights.length > 0 && (
            <p className="text-slate-300 italic text-[11px] pt-1">
              "{roadmapData.marketUpdates.marketInsights.join(' ')}"
            </p>
          )}
        </div>
      )}

      {/* Target Destination & Skill Gap Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#162030] border border-slate-200 dark:border-[#233147] text-slate-900 dark:text-white shadow-sm dark:shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#233147] pb-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">CAREER DESTINATION GOAL</span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">{currentRole}</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">Target Focus: {roadmapData?.targetCompany || user.targetCompany || 'Top Tech Enterprise'}</p>
          </div>
          <div className="sm:text-right space-y-1">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Target Readiness</span>
            <div className="inline-flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950 px-3.5 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400">
              <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-bold">{readiness}% Ready</span>
            </div>
          </div>
        </div>

        {/* Skill Gap Analysis Pills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0d131f] border border-slate-200 dark:border-[#253349] space-y-2">
            <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Possessed Core Skills</span>
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {possessedSkills.map((sk, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-[11px] flex items-center space-x-1">
                  <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 flex-none" />
                  <span>{sk}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0d131f] border border-slate-200 dark:border-[#253349] space-y-2">
            <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 tracking-wider flex items-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Critical Missing Skill Gaps</span>
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {missingSkills.map((sk, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold text-[11px] flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400 flex-none" />
                  <span>{sk}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {roadmapData?.skillGapAnalysis?.analysisSummary && (
          <p className="text-xs text-slate-600 dark:text-slate-300 italic border-t border-slate-200 dark:border-[#233147] pt-3 leading-relaxed">
            "{roadmapData.skillGapAnalysis.analysisSummary}"
          </p>
        )}
      </div>


      {/* Tavily AI Career Intelligence Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#162030] border border-slate-200 dark:border-[#233147] shadow-sm text-slate-900 dark:text-white space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-[#233147] pb-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>LIVE AI CAREER MARKET INTELLIGENCE</span>
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              2026 Job Market Demands & Learning Resources for {currentRole}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Retrieved real-time industry requirements combined with verified KCE alumni guidance.
            </p>
          </div>
          <span className="text-xs px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800 flex-none self-start sm:self-auto">
            Powered by Tavily Web Search
          </span>
        </div>

        {intelLoading ? (
          <div className="p-6 text-center text-xs text-slate-400 space-y-2">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="font-semibold">Retrieving real-time Tavily market intelligence & official learning resources...</p>
          </div>
        ) : marketIntel ? (
          <div className="space-y-5 text-xs">
            {/* Market Insights & Trends */}
            {marketIntel.marketInsights && marketIntel.marketInsights.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0d131f] border border-slate-200 dark:border-[#253349] space-y-2">
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                  Current Market Trends & Hiring Requirements
                </span>
                <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 font-medium">
                  {marketIntel.marketInsights.map((insight, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-indigo-500 font-bold flex-none">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Official Open-Source & Documentation Resources */}
            {marketIntel.learningResources && marketIntel.learningResources.length > 0 && (
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Recommended Official Open-Source & Documentation Resources
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {marketIntel.learningResources.map((res, idx) => (
                    <a
                      key={idx}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0d131f] border border-slate-200 dark:border-[#253349] hover:border-indigo-500 transition flex items-start justify-between group"
                    >
                      <div className="space-y-1 pr-2">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-extrabold text-[10px]">
                            {res.skill}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">{res.type}</span>
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                          {res.title}
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 flex-none" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Alumni Matches */}
            {marketIntel.recommendedAlumni && marketIntel.recommendedAlumni.length > 0 && (
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Verified KCE Alumni Mentors for {currentRole}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {marketIntel.recommendedAlumni.map((alum, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-[#0d131f] border border-slate-200 dark:border-[#253349] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white text-xs">{alum.name}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                          {alum.matchPercentage}
                        </span>
                      </div>
                      <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">{alum.role} @ {alum.company}</p>
                      <p className="text-[10px] text-slate-500">{alum.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tavily Search Sources Transparency */}
            {marketIntel.sources && marketIntel.sources.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0d131f] border border-slate-200 dark:border-[#253349] space-y-2">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Market Intelligence Sources (Tavily Citations)
                </span>
                <div className="flex flex-wrap gap-2">
                  {marketIntel.sources.map((src, idx) => (
                    <a
                      key={idx}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#162030] border border-slate-200 dark:border-[#253349] hover:border-indigo-500 text-slate-700 dark:text-slate-300 font-medium text-[11px] flex items-center space-x-1.5 transition"
                    >
                      <span className="truncate max-w-[220px]">{src.title}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 flex-none" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Visual Connected Node Trajectory */}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>4-Phase Milestone Trajectory</span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Click phases to expand interactive tasks & resources</span>
        </div>

        <div className="space-y-4">
          {phases.map((phase, pIdx) => {
            const phaseNum = phase.phaseNumber || (pIdx + 1);
            const isExpanded = !!expandedPhases[phaseNum];
            const tasks = phase.tasks || [];
            const doneCount = tasks.filter(t => t.done).length;
            const isCompleted = tasks.length > 0 && doneCount === tasks.length;
            const isCurrent = !isCompleted && (pIdx === 0 || phases[pIdx - 1]?.tasks?.every(t => t.done));

            return (
              <div key={phaseNum} className="relative flex flex-col items-center">
                {/* Connector line between phase cards */}
                {pIdx > 0 && <div className="w-0.5 h-5 bg-slate-300 dark:bg-[#253349] my-0.5"></div>}

                {/* Phase Main Card */}
                <div className={`w-full pro-card rounded-xl border transition-all duration-200 ${
                  isCurrent
                    ? 'border-2 border-indigo-500 bg-white dark:bg-[#162030] shadow-md dark:shadow-lg'
                    : isCompleted
                      ? 'border-emerald-300 dark:border-emerald-800/80 bg-white dark:bg-[#162030]'
                      : 'border-slate-200 dark:border-[#233147] bg-white dark:bg-[#162030]'
                }`}>
                  {/* Phase Header */}
                  <div 
                    onClick={() => togglePhaseExpand(phaseNum)}
                    className="p-5 flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Phase Number Node */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm flex-none shadow-sm ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isCurrent
                            ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                            : 'bg-slate-100 dark:bg-[#0d131f] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#253349]'
                      }`}>
                        {isCompleted ? <Check className="w-6 h-6 stroke-[3]" /> : phaseNum}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">{phase.title}</h4>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-600 text-white">
                              YOU ARE HERE
                            </span>
                          )}
                          {isCompleted && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">
                              COMPLETED
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Timeline: {phase.duration || `Weeks ${pIdx * 3 + 1}-${pIdx * 3 + 3}`}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {tasks.length > 0 && (
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 hidden sm:inline-block bg-slate-100 dark:bg-[#0d131f] px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#253349]">
                          {doneCount} / {tasks.length} Tasks Checked
                        </span>
                      )}
                      <button className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded">
                        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Phase Details (Expandable) */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-200 dark:border-[#233147] space-y-5">
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{phase.description}</p>

                      {/* Required Skills for Phase */}
                      {phase.skillsToLearn && phase.skillsToLearn.length > 0 && (
                        <div className="space-y-1.5">
                          <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                            <Code className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                            <span>Required Skills to Master</span>
                          </h5>
                          <div className="flex flex-wrap gap-1.5">
                            {phase.skillsToLearn.map((skill, sIdx) => (
                              <span key={sIdx} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#0d131f] border border-slate-200 dark:border-[#253349] text-indigo-600 dark:text-indigo-300 font-semibold text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Interactive Task Tree */}
                      {tasks.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                            <CheckSquare className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                            <span>Actionable Task Checklist (Database Saved)</span>
                          </h5>
                          <div className="space-y-2">
                            {tasks.map((t, tIdx) => {
                              const tId = t.id || `p${phaseNum}_t${tIdx}`;
                              const isResExpanded = !!expandedTaskResources[tId];
                              const resState = taskResourcesMap[tId];
                              const resCount = resState?.resources?.length || 0;

                              return (
                                <div key={tId} className="space-y-2 rounded-xl border border-slate-200 dark:border-[#253349] p-3 bg-slate-50 dark:bg-[#0d131f] transition">
                                  {/* Task completion toggle row */}
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div 
                                      onClick={() => handleToggleTask(pIdx, tIdx)}
                                      className="flex items-center space-x-3 text-xs text-left cursor-pointer flex-1 select-none"
                                    >
                                      <div className={`w-4 h-4 rounded flex items-center justify-center flex-none ${
                                        t.done ? 'bg-emerald-600 text-white font-bold' : 'border border-slate-400 dark:border-slate-600 bg-white dark:bg-[#0d131f]'
                                      }`}>
                                        {t.done && <Check className="w-3 h-3 stroke-[3]" />}
                                      </div>
                                      <span className={`font-bold text-slate-900 dark:text-white ${t.done ? 'line-through opacity-80' : ''}`}>{t.text}</span>
                                    </div>

                                    <div className="flex items-center space-x-2 flex-none self-end sm:self-auto">
                                      {/* Collapsible Resources Button */}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleTaskResources(tId, t.text, phase.skillsToLearn || []);
                                        }}
                                        className="px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/90 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[11px] font-extrabold transition flex items-center space-x-1.5 shadow-sm"
                                      >
                                        <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                                        <span>Learning Resources{resCount > 0 ? ` (${resCount})` : ''}</span>
                                        {isResExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                      </button>

                                      <span className={`text-[10px] px-2 py-1 rounded font-bold ${
                                        t.done ? 'bg-emerald-600 dark:bg-emerald-800 text-white' : 'bg-slate-200 dark:bg-[#162030] text-slate-700 dark:text-slate-400'
                                      }`}>
                                        {t.done ? 'DONE' : 'TO DO'}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Expandable Learning Resources Section */}
                                  {isResExpanded && (
                                    <div className="pt-3 border-t border-slate-200 dark:border-[#233147] space-y-2 mt-1">
                                      {resState?.loading ? (
                                        <div className="p-3 text-center text-[11px] text-slate-400 space-y-1.5">
                                          <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                          <p className="font-semibold">Discovering trusted learning materials via Tavily Search...</p>
                                        </div>
                                      ) : resState?.error || (!resState?.resources || resState.resources.length === 0) ? (
                                        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs italic font-medium flex items-center justify-between">
                                          <span>{resState?.error || "Learning resources temporarily unavailable."}</span>
                                          <button 
                                            onClick={() => toggleTaskResources(tId, t.text, phase.skillsToLearn || [])} 
                                            className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline ml-2"
                                          >
                                            Retry Search
                                          </button>
                                        </div>
                                      ) : resState?.error || (!resState?.resources || resState.resources.length === 0) ? (
                                        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs italic font-medium flex items-center justify-between">
                                          <span>{resState?.error || "Learning resources currently unavailable for this task."}</span>
                                          <button 
                                            onClick={() => toggleTaskResources(tId, t.text, phase.skillsToLearn || [])} 
                                            className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline ml-2"
                                          >
                                            Retry Search
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="space-y-3">
                                          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] px-1">
                                            <span className="font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center space-x-1.5">
                                              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                                              <span>Hybrid Learning Path ({resState.resources.length} Best Materials)</span>
                                            </span>
                                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-[10px] border border-emerald-300 dark:border-emerald-800 flex items-center space-x-1">
                                              <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                              <span>Personalized for your roadmap</span>
                                            </span>
                                          </div>

                                          {/* Resource Cards */}
                                          <div className="grid grid-cols-1 gap-2">
                                            {resState.resources.map((r, rIdx) => (
                                              <div 
                                                key={rIdx} 
                                                className="p-3 rounded-xl bg-white dark:bg-[#162030] border border-slate-200 dark:border-[#253349] hover:border-indigo-500 transition shadow-sm space-y-1.5"
                                              >
                                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                                  <div className="space-y-1 pr-2">
                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                      <span className="font-extrabold text-slate-900 dark:text-white text-xs flex items-center space-x-1.5">
                                                        <FileText className="w-3.5 h-3.5 text-indigo-500 flex-none" />
                                                        <span>{r.title}</span>
                                                      </span>
                                                      <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-extrabold text-[10px] border border-indigo-200 dark:border-indigo-800">
                                                        {r.type || 'Official Docs'}
                                                      </span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">{r.description}</p>
                                                    
                                                    {r.reason && (
                                                      <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold italic bg-indigo-50/50 dark:bg-indigo-950/40 p-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900/50 flex items-center space-x-1.5">
                                                        <HelpCircle className="w-3 h-3 text-indigo-500 flex-none" />
                                                        <span>Why recommended: {r.reason}</span>
                                                      </p>
                                                    )}
                                                    
                                                    <span className="text-[10px] text-slate-400 font-semibold block pt-0.5">Source: {r.source}</span>
                                                  </div>

                                                  <a
                                                    href={r.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] flex items-center justify-center space-x-1.5 flex-none shadow-sm transition self-start sm:self-auto"
                                                  >
                                                    <span>Open Resource</span>
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                  </a>
                                                </div>
                                              </div>
                                            ))}
                                          </div>

                                          {/* Practice & Outcome Actionable Boxes */}
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                                            {resState.practice && (
                                              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-950 dark:text-indigo-200 space-y-1">
                                                <span className="text-[10px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400 tracking-wider flex items-center space-x-1.5">
                                                  <Wrench className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                                  <span>PRACTICE EXERCISE</span>
                                                </span>
                                                <p className="text-[11px] font-semibold leading-relaxed">{resState.practice}</p>
                                              </div>
                                            )}

                                            {resState.outcome && (
                                              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 space-y-1">
                                                <span className="text-[10px] font-extrabold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider flex items-center space-x-1.5">
                                                  <Target className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                                  <span>EXPECTED LEARNING OUTCOME</span>
                                                </span>
                                                <p className="text-[11px] font-semibold leading-relaxed">{resState.outcome}</p>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )}

                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                        </div>
                      )}

                      {/* Hands-On Portfolio Projects */}
                      {phase.keyProjects && phase.keyProjects.length > 0 && (
                        <div className="space-y-1.5 p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200">
                          <h5 className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center space-x-1.5">
                            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            <span>Key Practical Portfolio Project to Build</span>
                          </h5>
                          <p className="text-xs text-indigo-950 dark:text-indigo-200 font-bold">{phase.keyProjects.join(' • ')}</p>
                        </div>
                      )}

                      {/* Recommended Topics to Study */}
                      {phase.recommendedTopics && phase.recommendedTopics.length > 0 && (
                        <div className="space-y-1">
                          <h5 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Recommended Study Topics</h5>
                          <div className="flex flex-wrap gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                            {phase.recommendedTopics.map((topic, topIdx) => (
                              <span key={topIdx} className="inline-flex items-center space-x-1 bg-slate-100 dark:bg-[#0d131f] px-2.5 py-1 rounded-lg border border-slate-200 dark:border-[#253349]">
                                <span>• {topic}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Target Role AI Customizer Modal */}
      {isCustomizerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="pro-card max-w-lg w-full rounded-2xl p-6 space-y-6 bg-white dark:bg-[#162030] border border-slate-200 dark:border-[#233147] shadow-2xl relative text-slate-900 dark:text-white">
            <button 
              onClick={() => setIsCustomizerOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1.5 border-b border-slate-200 dark:border-[#233147] pb-4">
              <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>AI Roadmap Generator</span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Customize Target Career Role</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select or type any target role to generate a dynamic 4-phase learning trajectory saved to database.
              </p>
            </div>

            {/* Role Presets */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Select Preset Target Role</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {presetRoles.map((role, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setTargetRoleInput(role);
                      handleGenerateCustomAIRoadmap(role);
                    }}
                    disabled={generating}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-[#253349] hover:border-indigo-500 bg-slate-50 dark:bg-[#0d131f] hover:bg-slate-100 dark:hover:bg-[#192436] text-slate-800 dark:text-slate-200 font-bold text-xs text-left transition flex items-center justify-between"
                  >
                    <span>{role}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Or Type Custom Career Role</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="text" 
                  placeholder="e.g. Cybersecurity Specialist, DevOps Architect"
                  value={targetRoleInput}
                  onChange={(e) => setTargetRoleInput(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-[#0d131f] border border-slate-200 dark:border-[#253349] rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus-ring"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Timeline (Weeks)</label>
                <select 
                  value={timelineWeeksInput}
                  onChange={(e) => setTimelineWeeksInput(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-[#0d131f] border border-slate-200 dark:border-[#253349] rounded-xl p-2.5 text-xs text-slate-900 dark:text-slate-100 focus-ring"
                >
                  <option value={8}>8 Weeks (Intensive)</option>
                  <option value={12}>12 Weeks (Standard 3 Months)</option>
                  <option value={16}>16 Weeks (Comprehensive)</option>
                </select>
              </div>
            </div>

            <button 
              onClick={() => handleGenerateCustomAIRoadmap()}
              disabled={generating || !targetRoleInput.trim()}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating AI Roadmap & Saving to DB...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-100" />
                  <span>Generate & Save Roadmap to DB</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
