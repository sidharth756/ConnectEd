import React from 'react';
import { 
  GraduationCap, 
  Target, 
  Compass, 
  Users, 
  Briefcase, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  UserCheck
} from 'lucide-react';

export default function LandingPage({ onOpenAuth, onQuickDemo }) {
  const valuePillars = [
    {
      icon: Users,
      title: 'Explainable Alumni Matching',
      description: 'Connect with verified alumni matched specifically by your target role, shared technical skills, and college background.'
    },
    {
      icon: Compass,
      title: 'Interactive Node Roadmap',
      description: 'Follow a step-by-step connected trajectory diagram guiding you month-by-month from foundation skills to career readiness.'
    },
    {
      icon: Target,
      title: 'Skill Gap Benchmarks',
      description: 'Analyze side-by-side proficiency comparisons comparing your current skills against actual hiring standards at top companies.'
    },
    {
      icon: Briefcase,
      title: 'Alumni Job Referrals',
      description: 'Request direct internal job referrals from verified alumni working at Google DeepMind, Stripe, OpenAI & Vercel.'
    }
  ];

  const howItWorksSteps = [
    {
      step: '01',
      title: 'Define Target Career Goal',
      description: 'Select your ambition (Senior AI Engineer, Software Engineer, Data Scientist) and target company.'
    },
    {
      step: '02',
      title: 'Analyze Skill Gaps',
      description: 'Review your proficiency benchmarks against real alumni hiring requirements to identify priority gaps.'
    },
    {
      step: '03',
      title: 'Follow Your Node Roadmap',
      description: 'Execute monthly milestone tasks, complete projects, and track live career readiness progress.'
    },
    {
      step: '04',
      title: 'Get Mentored & Referred',
      description: 'Book 1-on-1 mock interviews with alumni mentors and request internal job referrals.'
    }
  ];

  const alumniTestimonials = [
    {
      name: 'Priya Sharma',
      role: 'Senior Software Engineer',
      company: 'Google',
      college: 'KCE • Class of 2019',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
      quote: 'ConnectEd allows me to give back to KCE students by conducting mock system design interviews and referring top candidates.'
    },
    {
      name: 'Marcus Vance',
      role: 'Principal Software Architect',
      company: 'Stripe',
      college: 'KCE • Class of 2017',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      quote: 'The skill gap visualization helps students focus on real distributed systems skills rather than generic resume keywords.'
    }
  ];

  return (
    <div className="space-y-16 py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* 1. Hero Section */}
      <section className="text-center space-y-6 pt-6 sm:pt-12">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>AI-Powered Alumni Career Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-tight">
          Bridge the Gap Between Campus & Your Target Career Goal
        </h1>

        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          ConnectEd analyzes your skill gaps, maps your month-by-month career roadmap, and matches you with verified alumni mentors at Google, Stripe, OpenAI & Vercel.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={() => onOpenAuth('register')}
            className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition flex items-center space-x-2"
          >
            <span>Get Started — It's Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={onQuickDemo}
            className="px-6 py-3 rounded-lg bg-white dark:bg-[#162030] hover:bg-slate-50 dark:hover:bg-[#1f2d45] text-slate-800 dark:text-slate-200 font-bold text-sm border border-slate-300 dark:border-[#233147] shadow-sm transition flex items-center space-x-2"
          >
            <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Explore Demo Account</span>
          </button>
        </div>

        {/* Credibility proof badges */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium border-t border-slate-200 dark:border-[#233147] max-w-3xl mx-auto">
          <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-600 dark:text-emerald-400" /> Verified Alumni Networks</span>
          <span className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-1.5 text-indigo-600 dark:text-indigo-400" /> Verified KCE Alumni Network</span>
          <span className="flex items-center"><Sparkles className="w-4 h-4 mr-1.5 text-purple-600 dark:text-purple-400" /> 1-on-1 Alumni Mentorship</span>
        </div>
      </section>

      {/* 2. Value Pillars Grid */}
      <section className="space-y-8 pt-6">
        <div className="text-center space-y-1">
          <h2 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Platform Capabilities</h2>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Designed for Serious Career Growth</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {valuePillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div key={idx} className="pro-card p-6 rounded-xl space-y-3 bg-white dark:bg-[#162030] border border-slate-200 dark:border-[#233147] shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-[#0d131f] border border-indigo-200 dark:border-[#253349] flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">{pillar.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. How It Works Steps */}
      <section className="pro-card p-8 rounded-xl bg-white dark:bg-[#162030] border border-slate-200 dark:border-[#233147] shadow-sm space-y-8">
        <div className="text-center space-y-1">
          <h2 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Simple Process</h2>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">How ConnectEd Works</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorksSteps.map((s, idx) => (
            <div key={idx} className="space-y-2 border-l-2 border-indigo-500 pl-4">
              <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">{s.step}</span>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">{s.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Verified Alumni Testimonials */}
      <section className="space-y-8">
        <div className="text-center space-y-1">
          <h2 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Alumni Proof</h2>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Trusted by Verified Alumni Leaders</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {alumniTestimonials.map((item, idx) => (
            <div key={idx} className="pro-card p-6 rounded-xl bg-white dark:bg-[#162030] border border-slate-200 dark:border-[#233147] shadow-sm space-y-4">
              <p className="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">"{item.quote}"</p>
              <div className="flex items-center space-x-3 pt-2 border-t border-slate-200 dark:border-[#233147]">
                <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-lg object-cover ring-1 ring-slate-300 dark:ring-slate-700" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">{item.name}</h4>
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">{item.role} @ {item.company}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{item.college}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Call To Action Banner */}
      <section className="pro-card p-8 sm:p-10 rounded-xl bg-slate-900 dark:bg-[#131c2e] text-white text-center space-y-6 shadow-xl border border-slate-800 dark:border-[#233147]">
        <div className="space-y-2">
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Ready to Land Your Target Career Goal?</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Join ConnectEd today to define your target role, analyze your skill gaps, and get mentored by alumni.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onOpenAuth('register')}
            className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition"
          >
            Create Free Account
          </button>
          <button
            onClick={() => onOpenAuth('login')}
            className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition"
          >
            Sign In to Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-8 border-t border-slate-200 dark:border-[#233147] text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="font-bold text-slate-900 dark:text-white">ConnectEd Platform</span>
        </div>
        <p>© 2026 ConnectEd Alumni Career & Mentorship Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
