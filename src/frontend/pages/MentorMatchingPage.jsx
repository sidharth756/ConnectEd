import React, { useEffect, useState } from 'react';
import { 
  UserCheck, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  X, 
  Video
} from 'lucide-react';
import { alumniApi } from '../services/api';

export default function MentorMatchingPage({ onOpenAI }) {
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [sessionTopic, setSessionTopic] = useState('Mock Technical Architecture Interview');
  const [sessionDate, setSessionDate] = useState('2026-09-12');
  const [sessionTime, setSessionTime] = useState('16:00');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  useEffect(() => {
    async function load() {
      const allAlumni = await alumniApi.getAlumni();
      setMentors(allAlumni.filter(a => a.availability === 'Available for Mentorship'));
    }
    load();
  }, []);

  const handleBookSession = (e) => {
    e.preventDefault();
    setBookingConfirmed(true);
    setTimeout(() => {
      setBookingConfirmed(false);
      setSelectedMentor(null);
    }, 2500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2.5">
            <UserCheck className="w-6 h-6 text-amber-600" />
            <span>Mentor Discovery & 1-on-1 Sessions</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Book 1-on-1 career guidance & mock technical interviews with verified alumni mentors.
          </p>
        </div>
        <button 
          onClick={onOpenAI}
          className="px-3.5 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs sm:text-sm flex items-center space-x-2 transition shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-brand-100" />
          <span>Ask AI to Recommend Session Topics</span>
        </button>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {mentors.map((m) => (
          <div key={m.id} className="pro-card pro-card-hover p-5 rounded-xl space-y-4 flex flex-col justify-between">
            <div className="flex items-start space-x-3.5">
              <img 
                src={m.avatar} 
                alt={m.name} 
                className="w-13 h-13 rounded-lg object-cover ring-1 ring-slate-200 flex-none"
              />
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-slate-900 text-sm">{m.name}</h3>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    Verified Mentor
                  </span>
                </div>
                <p className="text-xs font-medium text-brand-700">{m.title} @ {m.company}</p>
                <p className="text-xs text-slate-500">B.E. CSE • KCE • Class of {m.graduationYear}</p>
              </div>
            </div>

            {/* Contextual Match Explanation */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-xs">
              <div className="text-[11px] font-semibold text-slate-500 flex items-center justify-between">
                <span>Why Matched?</span>
                <span className="text-emerald-700 font-bold">{m.matchScore}% Similarity Score</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                <span className="text-[10px] px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-medium">
                  ✓ KCE Alumni
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-medium">
                  ✓ Same career goal
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-medium">
                  ✓ {m.graduationYear} KCE Batch
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed italic">
              "{m.bio}"
            </p>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-emerald-700 font-medium flex items-center">
                <Video className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Google Meet Ready
              </span>
              <button 
                onClick={() => setSelectedMentor(m)}
                className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs shadow-sm transition flex items-center space-x-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Request Mentorship</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="pro-card max-w-lg w-full rounded-xl p-6 space-y-5 relative border border-slate-200 bg-white shadow-2xl">
            <button 
              onClick={() => setSelectedMentor(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 border-b border-slate-200 pb-3">
              <img src={selectedMentor.avatar} alt={selectedMentor.name} className="w-10 h-10 rounded-lg object-cover ring-1 ring-slate-200" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Schedule 1-on-1 Mentorship</h3>
                <p className="text-xs text-brand-700">With {selectedMentor.name} ({selectedMentor.company})</p>
              </div>
            </div>

            {bookingConfirmed ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-1 text-emerald-800">
                <CheckCircle2 className="w-7 h-7 mx-auto text-emerald-600" />
                <h4 className="font-bold text-sm">Session Confirmed!</h4>
                <p className="text-xs text-emerald-700">Calendar invite & Google Meet link sent to your email.</p>
              </div>
            ) : (
              <form onSubmit={handleBookSession} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Select Topic</label>
                  <select 
                    value={sessionTopic}
                    onChange={(e) => setSessionTopic(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus-ring"
                  >
                    <option>Mock Technical Architecture Interview</option>
                    <option>Resume & Portfolio Review</option>
                    <option>Career Transition to AI Research</option>
                    <option>Referral Strategy & Cold Emailing</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                    <input 
                      type="date"
                      value={sessionDate}
                      onChange={(e) => setSessionDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Time</label>
                    <input 
                      type="time"
                      value={sessionTime}
                      onChange={(e) => setSessionTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus-ring"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs shadow-sm transition"
                >
                  Confirm & Reserve Time Slot
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
