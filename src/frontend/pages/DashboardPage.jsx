import React, { useEffect, useState } from 'react';
import { 
  Target, 
  Compass, 
  ArrowRight, 
  X,
  CheckCircle2,
  RefreshCw,
  UserCheck
} from 'lucide-react';
import { alumniApi, userApi, roadmapApi } from '../services/api';

export default function DashboardPage({ setActiveTab, onOpenAI }) {
  const [user, setUser] = useState(null);
  const [topAlumni, setTopAlumni] = useState([]);
  const [roadmap, setRoadmap] = useState([]);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const careerOptions = [
    'AI / ML Engineer',
    'Software Engineer',
    'Data Scientist',
    'Product Engineer'
  ];

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [userData, alumniData, roadmapData] = await Promise.all([
        userApi.getCurrentUser(),
        alumniApi.getAlumni(),
        roadmapApi.getRoadmap()
      ]);
      setUser(userData);
      setTopAlumni(alumniData.slice(0, 2));
      setRoadmap(roadmapData);
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
      <div className="p-8 space-y-6 animate-pulse max-w-5xl mx-auto">
        <div className="h-32 bg-white rounded-xl border border-slate-200"></div>
        <div className="h-48 bg-white rounded-xl border border-slate-200"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      {/* 1. Student Profile Header Section */}
      <div className="pro-card p-6 rounded-xl border border-slate-200 bg-white shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-start space-x-4">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-16 h-16 rounded-xl object-cover ring-1 ring-slate-200 flex-none"
          />
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-slate-900">{user.name}</h1>
            <p className="text-xs text-slate-600 font-medium">
              B.E. Computer Science & Engineering • KCE (Class of {user.graduationYear || 2026})
            </p>
            <div className="text-xs text-brand-700 font-semibold pt-0.5">
              Target Goal: {user.targetRole} @ {user.targetCompany}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button 
            onClick={() => setIsGoalModalOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs border border-slate-300 transition flex items-center space-x-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
            <span>Change Career Goal</span>
          </button>
          <button 
            onClick={() => setIsEditProfileOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs border border-slate-300 transition"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* 2. Main Career Journey & Next Best Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Career Journey Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Career Goal & Progress Bar */}
          <div className="pro-card p-6 rounded-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Career Goal</span>
                <h2 className="text-lg font-bold text-slate-900">{user.targetRole}</h2>
                <p className="text-xs text-brand-700 font-medium">{user.targetCompany}</p>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Readiness Score</span>
                <div className="text-2xl font-extrabold text-slate-900">{user.readiness}%</div>
              </div>
            </div>

            {/* Readiness Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-600 font-medium">
                <span>Overall Career Readiness</span>
                <span>{user.readiness}% Ready</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className="bg-brand-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${user.readiness}%` }}
                ></div>
              </div>
            </div>

            {/* Key Skills Progress Bars */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Key Skill Benchmark Levels</h3>
              <div className="space-y-2.5">
                {user.skills.slice(0, 3).map((sk, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-800">
                      <span>{sk.name}</span>
                      <span className="text-slate-500">{sk.current}% / {sk.target}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                      <div 
                        className="bg-slate-700 h-full rounded-full"
                        style={{ width: `${sk.current}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 text-right">
              <button 
                onClick={() => setActiveTab('goal')}
                className="text-xs text-brand-600 hover:text-brand-700 font-semibold"
              >
                View Full Skill Gap Analysis →
              </button>
            </div>
          </div>

          {/* Recommended Alumni Spotlights */}
          <div className="pro-card p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Relevant Alumni Mentors</h3>
              <button 
                onClick={() => setActiveTab('alumni')}
                className="text-xs text-brand-600 font-semibold hover:underline"
              >
                Explore All
              </button>
            </div>

            <div className="space-y-3">
              {topAlumni.map((alum) => (
                <div key={alum.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={alum.avatar} alt={alum.name} className="w-10 h-10 rounded-lg object-cover ring-1 ring-slate-200" />
                    <div>
                      <h4 className="font-semibold text-slate-900 text-xs">{alum.name}</h4>
                      <p className="text-[11px] text-slate-600">{alum.title} @ {alum.company}</p>
                      <p className="text-[10px] text-brand-700 font-medium">{alum.matchReason}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('mentors')}
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-300 shadow-sm transition"
                  >
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Dominant NEXT BEST ACTION Card */}
        <div className="space-y-6">
          <div className="pro-card p-6 rounded-xl border-2 border-brand-500 bg-white space-y-4 shadow-md">
            <div className="flex items-center space-x-2 text-brand-700 font-bold text-xs uppercase tracking-wider">
              <Compass className="w-4 h-4 text-brand-600" />
              <span>Next Best Action</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">{user.nextAction}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Completing this roadmap milestone will increase your career readiness score by +8%.
              </p>
            </div>

            <button 
              onClick={() => setActiveTab('roadmap')}
              className="w-full py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center space-x-2"
            >
              <span>Continue Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* AI Copilot Prompt */}
          <div className="pro-card p-5 rounded-xl space-y-3 bg-slate-50">
            <h4 className="font-bold text-xs text-slate-900">Need Guidance?</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ask your AI Copilot to review your resume or draft referral requests to alumni.
            </p>
            <button 
              onClick={onOpenAI}
              className="w-full py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-300 shadow-sm transition"
            >
              Ask AI Assistant
            </button>
          </div>
        </div>
      </div>

      {/* Career Goal Selector Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="pro-card max-w-md w-full rounded-xl p-6 space-y-5 bg-white border border-slate-200 shadow-2xl relative">
            <button 
              onClick={() => setIsGoalModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-900 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Choose Your Target Career</h3>
              <p className="text-xs text-slate-500">Selecting a new goal dynamically updates your skill benchmarks and roadmap.</p>
            </div>

            <div className="space-y-2">
              {careerOptions.map((goal, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectGoal(goal)}
                  className={`w-full p-3 rounded-lg border text-xs text-left font-semibold flex items-center justify-between transition ${
                    user.currentGoalKey === goal
                      ? 'bg-brand-50 border-brand-300 text-brand-700'
                      : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span>{goal}</span>
                  {user.currentGoalKey === goal && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="pro-card max-w-md w-full rounded-xl p-6 space-y-4 bg-white border border-slate-200 shadow-2xl relative">
            <button 
              onClick={() => setIsEditProfileOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-900 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-3">Edit Profile Information</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                <input type="text" defaultValue={user.name} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus-ring" />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">University / Institution</label>
                <input type="text" value="KCE" readOnly className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2 text-slate-600 font-medium cursor-not-allowed" />
              </div>
            </div>

            <button 
              onClick={() => setIsEditProfileOpen(false)}
              className="w-full py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition"
            >
              Save Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
