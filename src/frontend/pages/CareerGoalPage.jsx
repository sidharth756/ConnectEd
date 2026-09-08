import React, { useEffect, useState } from 'react';
import { 
  Target, 
  BarChart2, 
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import { userApi } from '../services/api';

export default function CareerGoalPage({ setActiveTab, onOpenAI }) {
  const [user, setUser] = useState(null);
  const [skillGaps, setSkillGaps] = useState([]);
  const [biggestGap, setBiggestGap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const u = await userApi.getCurrentUser();
      const sg = await userApi.getSkillGaps();
      const bg = await userApi.getBiggestGap();
      setUser(u);
      setSkillGaps(sg);
      setBiggestGap(bg);
      setLoading(false);
    }
    load();
  }, []);

  if (loading || !user) {
    return <div className="p-8 text-center text-slate-500">Loading Skill Gap Comparison...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2.5">
          <Target className="w-6 h-6 text-brand-600" />
          <span>Skill Gap Benchmark Comparison</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Comparing your current skills against the target requirements for {user.targetRole} @ {user.targetCompany}.
        </p>
      </div>

      {/* BIGGEST GAP Highlight Card */}
      {biggestGap && (
        <div className="pro-card p-6 rounded-xl border-2 border-brand-500 bg-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-bold text-brand-700 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Biggest Skill Gap Identified</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">{biggestGap.skill}</h2>
            <p className="text-xs text-slate-600">
              Gap: <strong className="text-amber-700 font-bold">{biggestGap.gap}% Deficiency</strong> • Recommended module: {biggestGap.resource}
            </p>
          </div>

          <button 
            onClick={() => setActiveTab('roadmap')}
            className="px-4 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center space-x-1.5 flex-none"
          >
            <span>View Recommended Learning Path</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Side-by-side Visual Skill Comparison */}
      <div className="pro-card p-6 rounded-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <BarChart2 className="w-4 h-4 text-slate-600" />
            <span>Your Skills vs Target Requirement Benchmark</span>
          </h2>
          <span className="text-xs text-slate-500">Target Role: {user.targetRole}</span>
        </div>

        <div className="space-y-6">
          {skillGaps.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-800">
                <span>{item.name}</span>
                <div className="space-x-3 text-xs">
                  <span className="text-brand-700">Your Level: {item.current}%</span>
                  <span className="text-slate-500">Target Benchmark: {item.target}%</span>
                </div>
              </div>

              {/* Side-by-side Progress Bars */}
              <div className="grid grid-cols-2 gap-3">
                {/* Your Skill Level */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                    <div 
                      className="bg-brand-600 h-full rounded-full"
                      style={{ width: `${item.current}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">Your Proficiency</span>
                </div>

                {/* Target Requirement */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                    <div 
                      className="bg-slate-700 h-full rounded-full"
                      style={{ width: `${item.target}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">Benchmark Requirement</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
