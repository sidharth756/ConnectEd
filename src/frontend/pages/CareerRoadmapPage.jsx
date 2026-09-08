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
  ArrowDown,
  Award
} from 'lucide-react';
import { roadmapApi, userApi } from '../services/api';

export default function CareerRoadmapPage({ setActiveTab, onOpenAI }) {
  const [roadmap, setRoadmap] = useState([]);
  const [user, setUser] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [u, r] = await Promise.all([
        userApi.getCurrentUser(),
        roadmapApi.getRoadmap()
      ]);
      setUser(u);
      setRoadmap(r);
      // Auto-expand current active node
      const current = r.find(n => n.current);
      if (current) {
        setExpandedNodes({ [current.id]: true });
      } else if (r.length > 0) {
        setExpandedNodes({ [r[0].id]: true });
      }
      setLoading(false);
    }
    load();
  }, []);

  const toggleNodeExpand = (id) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleTask = (milestoneId, taskId) => {
    setRoadmap(prev => prev.map(m => {
      if (m.id !== milestoneId) return m;
      const updatedTasks = m.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t);
      const allDone = updatedTasks.every(t => t.done);
      return { ...m, tasks: updatedTasks, completed: allDone };
    }));
  };

  if (loading || !user) {
    return <div className="p-8 text-center text-slate-500">Loading Interactive Career Roadmap...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2.5">
            <Compass className="w-6 h-6 text-brand-600" />
            <span>Interactive Career Roadmap Trajectory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Connected milestone diagram guiding your journey to {user.targetRole} @ {user.targetCompany}.
          </p>
        </div>
        <button 
          onClick={onOpenAI}
          className="px-3.5 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs sm:text-sm flex items-center space-x-2 transition shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-brand-100" />
          <span>Ask AI Copilot for Guidance</span>
        </button>
      </div>

      {/* Target Destination Banner Node */}
      <div className="p-5 rounded-xl bg-slate-900 text-white flex items-center justify-between shadow-card">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-brand-400 tracking-wider">CAREER DESTINATION</span>
          <h2 className="text-lg font-bold">{user.targetRole}</h2>
          <p className="text-xs text-slate-300">{user.targetCompany}</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800">
            {user.readiness}% Target Readiness
          </span>
        </div>
      </div>

      {/* Visual Connected Node Diagram Trajectory */}
      <div className="relative space-y-4">
        {roadmap.map((node, idx) => {
          const isExpanded = !!expandedNodes[node.id];
          return (
            <div key={node.id} className="relative flex flex-col items-center">
              {/* Connected Line Segment (except top item) */}
              {idx > 0 && (
                <div className="w-0.5 h-6 bg-slate-300 my-1"></div>
              )}

              {/* Node Main Container Card */}
              <div className={`w-full pro-card rounded-xl border transition-all duration-200 ${
                node.current 
                  ? 'border-2 border-brand-500 bg-white shadow-md' 
                  : node.completed 
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : 'border-slate-200 bg-white'
              }`}>
                {/* Node Header Row */}
                <div 
                  onClick={() => toggleNodeExpand(node.id)}
                  className="p-4 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center space-x-3.5">
                    {/* Status Circle Node Indicator */}
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs flex-none ${
                      node.completed 
                        ? 'bg-emerald-600 text-white' 
                        : node.current 
                          ? 'bg-brand-600 text-white shadow-sm ring-2 ring-brand-300'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {node.completed ? <Check className="w-5 h-5 stroke-[3]" /> : idx + 1}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-slate-900 text-sm">{node.title}</h3>
                        <span className="text-xs text-slate-500 font-medium">• {node.subtitle}</span>
                        {node.current && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-600 text-white">
                            YOU ARE HERE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium">Duration: {node.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-semibold text-slate-600 hidden sm:inline">
                      {node.tasks.filter(t => t.done).length} / {node.tasks.length} Tasks
                    </span>
                    <button className="p-1 text-slate-400 hover:text-slate-900 rounded">
                      {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Node Details (Expandable) */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-200 space-y-4">
                    {/* Task Tree */}
                    <div className="space-y-2">
                      <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Milestone Task Tree</h4>
                      <div className="space-y-1.5 font-mono text-xs">
                        {node.tasks.map((t, tIdx) => {
                          const prefix = tIdx === node.tasks.length - 1 ? '└' : '├';
                          return (
                            <button
                              key={t.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTask(node.id, t.id);
                              }}
                              className={`w-full p-2 rounded-lg flex items-center space-x-2.5 text-left transition ${
                                t.done ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'bg-slate-50 text-slate-800 hover:bg-slate-100'
                              }`}
                            >
                              <span className="text-slate-400 font-bold">{prefix}</span>
                              <div className={`w-3.5 h-3.5 rounded flex items-center justify-center flex-none ${
                                t.done ? 'bg-emerald-600 text-white' : 'border border-slate-400 bg-white'
                              }`}>
                                {t.done && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>
                              <span className={t.done ? 'line-through opacity-80' : ''}>{t.text}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Linked Mentor & Continue Action */}
                    <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Users className="w-4 h-4 text-brand-600" />
                        <span>Alumni Mentor: <strong className="text-slate-900 font-semibold">{node.mentor}</strong></span>
                      </div>

                      {node.current && (
                        <button 
                          onClick={() => setActiveTab('mentors')}
                          className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition"
                        >
                          Book Mentor Session for Node
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
