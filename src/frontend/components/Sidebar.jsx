import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  Compass, 
  UserCheck, 
  Bot,
  CheckCircle2,
  User,
  MessageSquare,
  X
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onOpenAI, isMobileOpen, onCloseMobile, activeUser }) {
  const userRole = (activeUser?.role || 'student').toLowerCase();

  const studentSections = [
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
        { id: 'mentors', label: 'Mentor Matching', icon: UserCheck, badge: 'Match' },
        { id: 'messages', label: 'Messages & Outreach', icon: MessageSquare, badge: 'Chat' },
      ]
    },
    {
      title: 'Account Settings',
      items: [
        { id: 'profile', label: 'My Profile & Skills', icon: User, badge: 'Edit' }
      ]
    }
  ];

  const alumniSections = [
    {
      title: 'Alumni Portal',
      items: [
        { id: 'dashboard', label: 'Alumni Overview', icon: LayoutDashboard, badge: 'Portal' },
        { id: 'alumni', label: 'Alumni Network', icon: Users, badge: null },
        { id: 'mentors', label: 'Session Requests', icon: UserCheck, badge: 'Pending' },
        { id: 'messages', label: 'Student Messages', icon: MessageSquare, badge: 'Chat' },
      ]
    },
    {
      title: 'Account Settings',
      items: [
        { id: 'profile', label: 'My Mentor Profile', icon: User, badge: 'Edit' }
      ]
    }
  ];

  const adminSections = [
    {
      title: 'Admin Control Center',
      items: [
        { id: 'dashboard', label: 'Platform Overview', icon: LayoutDashboard, badge: 'Admin' },
        { id: 'alumni', label: 'Alumni Directory', icon: Users, badge: 'Verify' },
        { id: 'mentors', label: 'Mentor Directory', icon: UserCheck, badge: null },
      ]
    },
    {
      title: 'Account Settings',
      items: [
        { id: 'profile', label: 'Admin Settings', icon: User, badge: 'Manage' }
      ]
    }
  ];

  const sections = userRole === 'alumni' ? alumniSections : userRole === 'admin' ? adminSections : studentSections;

  const sidebarContent = (
    <aside className="w-64 min-w-[16rem] h-full flex-none bg-white dark:bg-[#131c2e] border-r border-slate-200 dark:border-[#233147] flex flex-col justify-between p-3.5 select-none overflow-y-auto transition-colors duration-200">
      <div className="space-y-5">
        {/* Mobile Header with Close button */}
        <div className="flex md:hidden items-center justify-between pb-2 border-b border-slate-200 dark:border-[#233147]">
          <span className="font-extrabold text-sm text-slate-900 dark:text-white">Navigation</span>
          <button 
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1.5">
            <h2 className="px-2.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              {section.title}
            </h2>
            <nav className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-50/80 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200/80 dark:border-indigo-500/30 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-[#192436]'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Icon className={`w-4 h-4 flex-none ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-400'}`} />
                      <span className="whitespace-nowrap text-left text-xs font-semibold">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold flex-none whitespace-nowrap ml-auto ${
                        isActive 
                          ? 'bg-indigo-100 dark:bg-indigo-500/30 text-indigo-700 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-500/40'
                          : 'bg-slate-100 dark:bg-[#0d131f] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-[#253349]'
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
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0d131f] border border-slate-200 dark:border-[#253349] text-left space-y-2 shadow-xs">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
            <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>AI Career Copilot</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug font-medium">
            Generate outreach notes, skill gap strategies & interview prep.
          </p>
          <button 
            onClick={() => {
              onOpenAI();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full py-2 px-3 rounded-xl bg-white dark:bg-[#162030] hover:bg-slate-100 dark:hover:bg-[#1f2d45] text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-[#253349] flex items-center justify-center space-x-1.5 shadow-xs transition active:scale-95"
          >
            <Bot className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Open Assistant</span>
          </button>
        </div>
      </div>

      {/* Footer Status */}
      <div className="pt-3 border-t border-slate-200 dark:border-[#253349] flex items-center justify-between text-[10px] text-slate-400">
        <div className="flex items-center space-x-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="font-semibold">ConnectEd v1.0</span>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded font-bold">Verified</span>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Static Sidebar */}
      <div className="hidden md:block h-full flex-none">
        {sidebarContent}
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity" 
            onClick={onCloseMobile}
          />
          <div className="relative w-64 h-full bg-white dark:bg-[#131c2e] z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
