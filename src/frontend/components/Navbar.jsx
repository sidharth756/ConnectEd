import React, { useState, useEffect, useRef } from 'react';
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
  ChevronDown,
  Sun,
  Moon,
  Menu
} from 'lucide-react';

export default function Navbar({ 
  onToggleAIAssistant, 
  activeUser, 
  isAuthenticated, 
  onOpenAuth, 
  onLogout,
  onNavigateTab,
  onOpenEditProfile,
  theme = 'dark',
  onToggleTheme,
  onToggleMobileMenu,
  notifications = [],
  onMarkAllNotificationsRead,
  onSelectNotification
}) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const menuRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="flex-none z-30 w-full bg-white dark:bg-[#131c2e] border-b border-slate-200 dark:border-[#233147] px-4 lg:px-8 py-3 flex items-center justify-between shadow-sm dark:shadow-md transition-colors duration-200">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3">
        {isAuthenticated && (
          <button 
            onClick={onToggleMobileMenu}
            className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 md:hidden hover:bg-slate-100 dark:hover:bg-[#1f2d45] border border-slate-200 dark:border-[#253349]"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </button>
        )}
        <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md flex-none">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
              Connect<span className="text-indigo-600 dark:text-indigo-400">Ed</span>
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Alumni Platform
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium">Bridging Students & Alumni through Mentorship</p>
        </div>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center space-x-2.5 flex-none">
        {/* Stone Light / Dark Theme Switcher Button */}
        <button 
          onClick={onToggleTheme}
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0d131f] text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-[#1f2d45] border border-slate-300 dark:border-[#253349] transition flex items-center space-x-1.5 text-xs font-bold shadow-sm"
          title={`Switch to ${theme === 'dark' ? 'Stone Light' : 'Executive Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline text-[11px]">Stone Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline text-[11px]">Executive Dark</span>
            </>
          )}
        </button>

        {/* AI Copilot Button */}
        <button 
          onClick={onToggleAIAssistant}
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition active:scale-95"
          title="Open AI Career Copilot"
        >
          <Bot className="w-4 h-4 text-indigo-100" />
          <span className="hidden sm:inline">AI Copilot</span>
        </button>

        {/* Notifications Button & Dropdown Menu */}
        <div ref={notifRef} className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(prev => !prev)}
            aria-label="View notifications"
            className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1f2d45] border border-slate-200 dark:border-[#253349] transition"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-rose-500 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center shadow-sm animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-white dark:bg-[#162030] border border-slate-200 dark:border-[#233147] rounded-2xl shadow-2xl p-4 space-y-3 text-xs animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#233147] pb-2.5">
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={() => {
                      if (onMarkAllNotificationsRead) onMarkAllNotificationsRead();
                    }}
                    className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 space-y-1">
                    <Bell className="w-6 h-6 mx-auto stroke-1" />
                    <p className="text-xs font-medium">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id}
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        if (onSelectNotification) onSelectNotification(n);
                      }}
                      className={`p-3 rounded-xl border transition cursor-pointer flex items-start space-x-3 ${
                        !n.read 
                          ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/60' 
                          : 'bg-slate-50/60 dark:bg-[#0d131f] border-slate-200/60 dark:border-[#233147] opacity-80'
                      }`}
                    >
                      <div className="h-8 w-8 rounded-lg bg-indigo-600/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-none mt-0.5">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-slate-900 dark:text-white truncate">{n.title}</span>
                          <span className="text-[10px] text-slate-400 flex-none ml-2">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">{n.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Auth / Profile Controls */}
        {isAuthenticated && activeUser ? (
          <div ref={menuRef} className="relative pl-2 border-l border-slate-200 dark:border-[#253349]">
            <button 
              onClick={() => setIsProfileMenuOpen(prev => !prev)}
              className="flex items-center space-x-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1f2d45] transition"
            >
              <img 
                src={activeUser.avatar || activeUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'} 
                alt={activeUser.name}
                className="w-8 h-8 rounded-xl object-cover ring-2 ring-indigo-500/40" 
              />
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center">
                  {activeUser.name}
                  <ShieldCheck className="w-3.5 h-3.5 ml-1 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">KCE • Class of {activeUser?.graduationYear || 2026}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 top-12 z-50 w-60 bg-white dark:bg-[#162030] border border-slate-200 dark:border-[#233147] rounded-2xl shadow-xl p-2 space-y-1 text-xs animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-[#233147]">
                  <div className="font-bold text-slate-900 dark:text-white">{activeUser.name}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{activeUser.email}</div>
                  <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold mt-0.5 capitalize">{activeUser.role} • {activeUser.university || 'KCE'}</div>
                </div>

                <button 
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    if (onOpenEditProfile) onOpenEditProfile();
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1f2d45] text-slate-800 dark:text-slate-200 text-left font-bold transition"
                >
                  <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>View & Edit Full Profile</span>
                </button>

                <button 
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    onNavigateTab('goal');
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1f2d45] text-slate-800 dark:text-slate-200 text-left font-bold transition"
                >
                  <Target className="w-4 h-4 text-slate-400" />
                  <span>Career Goal Setup</span>
                </button>

                <div className="pt-1 border-t border-slate-100 dark:border-[#233147]">
                  <button 
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 text-left font-bold transition"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-[#253349]">
            <button 
              onClick={() => onOpenAuth('login')}
              className="px-3.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1f2d45] font-bold text-xs border border-slate-200 dark:border-[#253349] transition"
            >
              Sign In
            </button>
            <button 
              onClick={() => onOpenAuth('register')}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition"
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
