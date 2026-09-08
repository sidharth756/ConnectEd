import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AINetworkingAssistant from './components/AINetworkingAssistant';
import AuthModal from './components/AuthModal';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AlumniDiscoveryPage from './pages/AlumniDiscoveryPage';
import CareerGoalPage from './pages/CareerGoalPage';
import CareerRoadmapPage from './pages/CareerRoadmapPage';
import MentorMatchingPage from './pages/MentorMatchingPage';
import JobsReferralsPage from './pages/JobsReferralsPage';
import { userApi, authApi } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [activeUser, setActiveUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Auth Modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');

  useEffect(() => {
    async function initSession() {
      const session = await authApi.getSession();
      setIsAuthenticated(session.isAuthenticated);
      if (session.user) {
        setActiveUser(session.user);
      }
    }
    initSession();
  }, []);

  const handleToggleAIAssistant = () => {
    setIsAIAssistantOpen(prev => !prev);
  };

  const handleOpenAuth = (tabName = 'login') => {
    setAuthModalTab(tabName);
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    await authApi.logout();
    setIsAuthenticated(false);
    setActiveUser(null);
  };

  const handleAuthSuccess = async (user) => {
    setIsAuthenticated(true);
    setActiveUser(user);
    setIsAuthModalOpen(false);
  };

  const handleQuickDemo = async () => {
    const res = await authApi.login({ demoKey: 'alex' });
    if (res.success) {
      setIsAuthenticated(true);
      setActiveUser(res.user);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-brand-600 selection:text-white">
      {/* Top Header */}
      <Navbar 
        onToggleAIAssistant={handleToggleAIAssistant}
        activeUser={activeUser}
        isAuthenticated={isAuthenticated}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Main Content Area */}
      {!isAuthenticated ? (
        <main className="flex-1 overflow-y-auto">
          <LandingPage 
            onOpenAuth={handleOpenAuth}
            onQuickDemo={handleQuickDemo}
          />
        </main>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          <Sidebar 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenAI={() => setIsAIAssistantOpen(true)}
          />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto pb-16 md:pb-8">
            {activeTab === 'dashboard' && (
              <DashboardPage 
                setActiveTab={setActiveTab} 
                onOpenAI={() => setIsAIAssistantOpen(true)} 
              />
            )}

            {activeTab === 'alumni' && (
              <AlumniDiscoveryPage 
                onOpenAI={() => setIsAIAssistantOpen(true)}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'goal' && (
              <CareerGoalPage 
                setActiveTab={setActiveTab}
                onOpenAI={() => setIsAIAssistantOpen(true)}
              />
            )}

            {activeTab === 'roadmap' && (
              <CareerRoadmapPage 
                setActiveTab={setActiveTab}
                onOpenAI={() => setIsAIAssistantOpen(true)}
              />
            )}

            {activeTab === 'mentors' && (
              <MentorMatchingPage 
                onOpenAI={() => setIsAIAssistantOpen(true)}
              />
            )}

            {activeTab === 'jobs' && (
              <JobsReferralsPage 
                onOpenAI={() => setIsAIAssistantOpen(true)}
                setActiveTab={setActiveTab}
              />
            )}
          </main>

          {/* Slide-over AI Assistant Copilot */}
          <AINetworkingAssistant 
            isOpen={isAIAssistantOpen}
            onClose={() => setIsAIAssistantOpen(false)}
          />
        </div>
      )}

      {/* Login / Register Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
