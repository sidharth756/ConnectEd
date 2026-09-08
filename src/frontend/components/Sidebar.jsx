import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  Compass, 
  UserCheck, 
  Briefcase,
  Bot,
  CheckCircle2
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onOpenAI }) {
  const sections = [
    {
      title: 'Career Journey',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
        { id: 'goal', label: 'Goals & Skill Gaps', icon: Target, badge: null },
        { id: 'roadmap', label: 'Career Roadmap', icon: Compass, badge: 'Active' },
      ]
    },
    {
      title: 'Networking & Mentorship',
      items: [
        { id: 'alumni', label: 'Alumni Discovery', icon: Users, badge: 'Match' },
        { id: 'mentors', label: 'Mentor Matching', icon: UserCheck, badge: 'Available' },
      ]
    },
    {
      title: 'Opportunities',
      items: [
        { id: 'jobs', label: 'Jobs & Referrals', icon: Briefcase, badge: 'Hot' },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-61px)] p-4 select-none">
      <div className="space-y-6">
        {sections.map((section, idx) => (
          <div key={idx}>
            <h2 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              {section.title}
            </h2>
            <nav className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 border-l-2 border-brand-600 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        isActive 
                          ? 'bg-brand-100 text-brand-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}

        {/* AI Copilot Card */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2">
          <div className="flex items-center space-x-2 text-brand-700 font-semibold text-xs">
            <Bot className="w-4 h-4 text-brand-600" />
            <span>AI Career Copilot</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Generate outreach notes, skill gap strategies & interview prep.
          </p>
          <button 
            onClick={onOpenAI}
            className="w-full py-1.5 px-3 rounded-lg bg-white hover:bg-slate-100 text-slate-800 text-xs font-medium border border-slate-300 flex items-center justify-center space-x-1.5 shadow-sm transition"
          >
            <Bot className="w-3.5 h-3.5 text-brand-600" />
            <span>Open Assistant</span>
          </button>
        </div>
      </div>

      {/* Footer Status */}
      <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center space-x-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>ConnectEd v1.0</span>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-medium">Verified</span>
      </div>
    </aside>
  );
}
