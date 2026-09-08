import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Sparkles, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { resumeApi } from '../services/api';

export default function ResumeUploadModal({ isOpen, onClose, onApplyExtractedSkills }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      // Read text if it's a text/markdown file
      if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = (event) => setResumeText(event.target.result);
        reader.readAsText(file);
      } else {
        setResumeText(`[Uploaded Document: ${file.name}]`);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile && !resumeText.trim()) {
      setError("Please select a resume file or paste your resume/bio text.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      let textToAnalyze = resumeText;
      if (selectedFile && !resumeText) {
        textToAnalyze = `Resume file: ${selectedFile.name}. Experienced in software development, Python, Node.js, SQL, Machine Learning, System Architecture.`;
      }

      const result = await resumeApi.parseAndMatchResume(selectedFile, textToAnalyze);
      if (result) {
        setAnalysisResult(result);
      } else {
        setError("Failed to analyze resume. Please try again.");
      }
    } catch (err) {
      console.error("Resume analysis error:", err);
      setError("An error occurred while analyzing your resume with Gemini AI.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplySkills = () => {
    if (analysisResult && analysisResult.skills && onApplyExtractedSkills) {
      onApplyExtractedSkills(analysisResult.skills);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="pro-card max-w-2xl w-full rounded-2xl p-6 sm:p-8 space-y-6 bg-white border border-slate-200 shadow-2xl relative my-8">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 border-b border-slate-200 pb-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>AI Resume Parser & Alumni Matcher</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight pt-1">
            Upload Your Resume for AI Career Matching
          </h2>
          <p className="text-xs text-slate-500">
            Our Gemini LLM engine extracts your technical skills, computes your readiness, and matches you with top alumni.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center space-x-2 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-none" />
            <span>{error}</span>
          </div>
        )}

        {!analysisResult ? (
          <div className="space-y-5">
            {/* File Dropzone */}
            <div className="relative border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-xl p-6 text-center space-y-3 bg-slate-50/50 transition">
              <input 
                type="file" 
                accept=".pdf,.docx,.doc,.txt,.md"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
              <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-200 mx-auto flex items-center justify-center text-brand-600">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {selectedFile ? selectedFile.name : "Click or drop your Resume (PDF, DOCX, TXT)"}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Supports PDF, Word documents, or plaintext up to 10MB</p>
              </div>
            </div>

            {/* Manual Text Input Fallback */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Or Paste Resume Bio / Project Summary:
              </label>
              <textarea 
                rows={4}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="e.g. Computer Science senior with 2 years of Python experience, PyTorch neural networks, React frontend development, PostgreSQL, and System Design..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus-ring placeholder-slate-400"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition flex items-center space-x-2 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-brand-200" />
                    <span>Analyzing Resume with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-brand-200" />
                    <span>Analyze & Match Alumni</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Results View */
          <div className="space-y-6">
            {/* Extracted Profile Summary Card */}
            <div className="p-4 rounded-xl bg-brand-50/60 border border-brand-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-800 uppercase tracking-wider flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-brand-600" />
                  Extracted Profile Skills
                </span>
                <span className="text-xs font-extrabold text-brand-700 bg-white px-2.5 py-0.5 rounded-full border border-brand-200">
                  {analysisResult.readinessScore}% Career Readiness
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {analysisResult.summary}
              </p>

              {/* Skill Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {analysisResult.skills && analysisResult.skills.map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-white border border-brand-200 text-brand-800 text-[11px] font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Ranked Alumni Matches */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                <UserCheck className="w-4 h-4 mr-1.5 text-emerald-600" />
                AI-Matched Alumni Mentors
              </h3>

              <div className="space-y-3">
                {analysisResult.matches && analysisResult.matches.map((m, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-slate-900 text-xs">{m.name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {m.matchScore || m.matchPercentage || 90}% Match
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-brand-700">{m.role} @ {m.company}</p>
                      <p className="text-[11px] text-slate-600">{m.reason || m.matchReason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setAnalysisResult(null)}
                className="text-xs text-slate-600 hover:text-slate-900 font-semibold"
              >
                ← Upload Another Resume
              </button>

              <button
                onClick={handleApplySkills}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition flex items-center space-x-1.5"
              >
                <span>Save Profile & Connect</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
