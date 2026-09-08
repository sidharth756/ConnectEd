import React, { useEffect, useState } from 'react';
import { 
  Briefcase, 
  Sparkles, 
  Building2, 
  MapPin, 
  Send, 
  CheckCircle2, 
  X, 
  Clock
} from 'lucide-react';
import { jobApi } from '../services/api';

export default function JobsReferralsPage({ onOpenAI, setActiveTab }) {
  const [jobs, setJobs] = useState([]);
  const [selectedJobModal, setSelectedJobModal] = useState(null);
  const [referralSent, setReferralSent] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await jobApi.getJobs();
      setJobs(data);
    }
    load();
  }, []);

  const handleSendReferral = () => {
    setReferralSent(true);
    setTimeout(() => {
      setReferralSent(false);
      setSelectedJobModal(null);
    }, 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2.5">
            <Briefcase className="w-6 h-6 text-brand-600" />
            <span>Opportunities & Alumni Referrals</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Connect career opportunities with verified internal alumni at target companies.
          </p>
        </div>
        <button 
          onClick={onOpenAI}
          className="px-3.5 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs sm:text-sm flex items-center space-x-2 transition shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-brand-100" />
          <span>Ask AI to Draft Referral Pitch</span>
        </button>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.map((j) => (
          <div key={j.id} className="pro-card pro-card-hover p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start space-x-4">
              <img src={j.companyLogo} alt={j.company} className="w-12 h-12 rounded-lg object-cover ring-1 ring-slate-200 flex-none" />
              <div className="space-y-1">
                <div className="flex items-center space-x-2.5">
                  <h3 className="font-semibold text-slate-900 text-base">{j.title}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                    {j.type}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center text-slate-700 font-medium"><Building2 className="w-3.5 h-3.5 mr-1 text-slate-400" />{j.company}</span>
                  <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />{j.location}</span>
                  <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />{j.postedDate}</span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 max-w-2xl mt-1">{j.description}</p>
              </div>
            </div>

            {/* Contextual Alumni Connection Indicator & Referral CTA */}
            <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200 flex-none">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-1.5 overflow-hidden">
                  {j.alumniContacts.map(ac => (
                    <img key={ac.id} src={ac.avatar} alt={ac.name} className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {j.alumniCount} KCE Alumni work here
                </span>
              </div>

              <button 
                onClick={() => setSelectedJobModal(j)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition flex items-center justify-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask for Referral</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Referral Composer Modal */}
      {selectedJobModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="pro-card max-w-lg w-full rounded-xl p-6 space-y-5 relative border border-slate-200 bg-white shadow-2xl">
            <button 
              onClick={() => setSelectedJobModal(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-0.5 border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Request Referral for {selectedJobModal.title}</h3>
              <p className="text-xs text-brand-700">Target Company: {selectedJobModal.company}</p>
            </div>

            {referralSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-1 text-emerald-800">
                <CheckCircle2 className="w-7 h-7 mx-auto text-emerald-600" />
                <h4 className="font-bold text-sm">Referral Request Sent!</h4>
                <p className="text-xs text-emerald-700">Your note was delivered to verified alumni at {selectedJobModal.company}.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <span className="font-semibold text-slate-700">Contacting Verified Internal KCE Alumni:</span>
                  <div className="flex items-center space-x-2.5 pt-1">
                    <img src={selectedJobModal.alumniContacts[0].avatar} className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <div className="font-semibold text-slate-900">{selectedJobModal.alumniContacts[0].name}</div>
                      <div className="text-[10px] text-slate-500">{selectedJobModal.alumniContacts[0].title}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Outreach Pitch Note</label>
                  <textarea 
                    rows={4}
                    defaultValue={`Hi ${selectedJobModal.alumniContacts[0].name.split(' ')[0]}, I saw the ${selectedJobModal.title} opening at ${selectedJobModal.company}. As a KCE CS student with a background in PyTorch & RAG systems, I would be grateful for your internal referral!`}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-900 focus-ring"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleSendReferral}
                    className="py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs shadow-sm transition"
                  >
                    Send Referral Request
                  </button>
                  <button 
                    onClick={() => {
                      onOpenAI();
                      setSelectedJobModal(null);
                    }}
                    className="py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs border border-slate-300 shadow-sm transition"
                  >
                    Improve with AI
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
