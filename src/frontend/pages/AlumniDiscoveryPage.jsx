import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  Users, 
  Building2, 
  MapPin, 
  X,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { alumniApi } from '../services/api';

export default function AlumniDiscoveryPage({ onOpenAI }) {
  const [alumni, setAlumni] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedAlumniModal, setSelectedAlumniModal] = useState(null);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await alumniApi.getAlumni();
      setAlumni(data);
    }
    load();
  }, []);

  const filteredAlumni = alumni.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCompany = selectedCompany === 'All' || a.company === selectedCompany;
    return matchesSearch && matchesCompany;
  });

  const handleSendRequest = () => {
    setRequestSent(true);
    setTimeout(() => {
      setRequestSent(false);
      setSelectedAlumniModal(null);
    }, 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2.5">
            <Users className="w-6 h-6 text-brand-600" />
            <span>Alumni Discovery & Mentorship Network</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Connect with verified alumni ranked by relevance to your target career goal.
          </p>
        </div>
        <button 
          onClick={onOpenAI}
          className="px-3.5 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs sm:text-sm flex items-center space-x-2 transition shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-brand-100" />
          <span>Ask AI Copilot for Introductions</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="pro-card p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, skill, company..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-900 focus-ring"
          />
        </div>

        <div className="flex items-center space-x-2.5 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-600 font-medium">Company:</span>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus-ring"
          >
            <option value="All">All Companies</option>
            <option value="Google">Google</option>
            <option value="Stripe">Stripe</option>
            <option value="OpenAI">OpenAI</option>
            <option value="Vercel">Vercel</option>
          </select>
        </div>
      </div>

      {/* Spacious Alumni Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredAlumni.map((alum) => (
          <div 
            key={alum.id}
            className="pro-card pro-card-hover p-5 rounded-xl space-y-3 flex flex-col justify-between"
          >
            <div className="flex items-start space-x-3.5">
              <img 
                src={alum.avatar} 
                alt={alum.name} 
                className="w-12 h-12 rounded-lg object-cover ring-1 ring-slate-200 flex-none"
              />
              <div className="space-y-0.5">
                <h3 className="font-semibold text-slate-900 text-sm">{alum.name}</h3>
                <p className="text-xs font-medium text-slate-700">{alum.title} — <span className="text-brand-700">{alum.company}</span></p>
                <p className="text-xs text-slate-500">B.E. CSE • KCE • Class of {alum.graduationYear}</p>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Skills</span>
              <p className="text-xs text-slate-700 font-medium">{alum.skills.join(' · ')}</p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <span className="font-semibold text-slate-500">Connection relevance: </span>
              <strong className="text-brand-700 font-semibold">{alum.matchReason}</strong>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">{alum.availability}</span>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setSelectedAlumniModal(alum)}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-300 shadow-sm transition"
                >
                  View Profile
                </button>
                <button 
                  onClick={() => setSelectedAlumniModal(alum)}
                  className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition"
                >
                  Connect
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alumni Detail Modal */}
      {selectedAlumniModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="pro-card max-w-lg w-full rounded-xl p-6 space-y-5 bg-white border border-slate-200 shadow-2xl relative">
            <button 
              onClick={() => setSelectedAlumniModal(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-900 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start space-x-4 border-b border-slate-200 pb-4">
              <img src={selectedAlumniModal.avatar} alt={selectedAlumniModal.name} className="w-14 h-14 rounded-lg object-cover ring-1 ring-slate-200" />
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedAlumniModal.name}</h3>
                <p className="text-xs font-semibold text-brand-700">{selectedAlumniModal.title} @ {selectedAlumniModal.company}</p>
                <p className="text-xs text-slate-500">B.E. Computer Science & Engineering • KCE • Class of {selectedAlumniModal.graduationYear}</p>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Career Summary</h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                {selectedAlumniModal.bio}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200">
              {requestSent ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-center text-xs font-bold text-emerald-800 flex items-center justify-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Outreach connection request sent to {selectedAlumniModal.name}!</span>
                </div>
              ) : (
                <button 
                  onClick={handleSendRequest}
                  className="w-full py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition"
                >
                  Send Connection Request
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
