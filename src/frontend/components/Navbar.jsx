import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Bot, 
  GraduationCap,
  ShieldCheck,
  LogOut,
  User,
  Settings,
  Target,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ 
  onToggleAIAssistant, 
  activeUser, 
  isAuthenticated, 
  onOpenAuth, 
  onLogout,
  onNavigateTab 
}) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200 px-4 lg:px-8 py-3 flex items-center justify-between shadow-subtle">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3">
        <div className="h-9 w-9 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-sm">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg tracking-tight text-slate-900">
              Connect<span className="text-brand-600">Ed</span>
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-brand-50 text-brand-700 border border-brand-200">
              Alumni Platform
            </span>
          </div>
          <p className="text-[11px] text-slate-500 hidden sm:block">Bridging Students & Alumni through Mentorship</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search alumni by role, company, or skills..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus-ring"
          />
        </div>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center space-x-3">
        {/* AI Copilot Button */}
        <button 
          onClick={onToggleAIAssistant}
          className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs shadow-sm transition active:scale-95"
          title="Open AI Career Copilot"
        >
          <Bot className="w-4 h-4 text-brand-100" />
          <span className="hidden sm:inline">AI Copilot</span>
        </button>

        {/* Notifications */}
        <button 
          aria-label="View notifications"
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-600 rounded-full"></span>
        </button>

        {/* Auth / Profile Controls */}
        {isAuthenticated && activeUser ? (
          <div className="relative pl-2 border-l border-slate-200">
            <button 
              onClick={() => setIsProfileMenuOpen(prev => !prev)}
              className="flex items-center space-x-2.5 p-1 rounded-lg hover:bg-slate-100 transition"
            >
              <img 
                src={activeUser.avatar} 
                alt={activeUser.name}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-300" 
              />
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-slate-900 flex items-center">
                  {activeUser.name}
                  <ShieldCheck className="w-3.5 h-3.5 ml-1 text-emerald-600" />
                </div>
                <div className="text-[10px] text-slate-500">KCE • Class of {activeUser?.graduationYear || 2026}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 top-11 z-50 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl p-2 space-y-1 text-xs animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-slate-200">
                  <div className="font-bold text-slate-900">{activeUser.name}</div>
                  <div className="text-[11px] text-slate-500 truncate">{activeUser.email}</div>
                  <div className="text-[10px] text-brand-700 font-semibold mt-0.5 capitalize">{activeUser.role} • {activeUser.university}</div>
                </div>

                <button 
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    onNavigateTab('dashboard');
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 text-left font-medium transition"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Profile Overview</span>
                </button>

                <button 
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    onNavigateTab('goal');
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 text-left font-medium transition"
                >
                  <Target className="w-4 h-4 text-slate-500" />
                  <span>Career Goal Setup</span>
                </button>

                <div className="pt-1 border-t border-slate-200">
                  <button 
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-rose-50 text-rose-700 text-left font-semibold transition"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
            <button 
              onClick={() => onOpenAuth('login')}
              className="px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold text-xs border border-slate-300 transition"
            >
              Sign In
            </button>
            <button 
              onClick={() => onOpenAuth('register')}
              className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition"
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
