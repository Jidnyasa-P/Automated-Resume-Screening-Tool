/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { JobDescription, MatchResult, ResumeData } from "./types";
import JobForm from "./components/JobForm";
import FileUpload from "./components/FileUpload";
import ResultsList from "./components/ResultsList";
import CandidateModal from "./components/CandidateModal";
import { matchResumes } from "./lib/gemini";
import { Sparkles, LayoutDashboard, Settings2, Info } from "lucide-react";

export default function App() {
  const [job, setJob] = useState<JobDescription | null>(null);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedResult, setSelectedResult] = useState<MatchResult | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then(r => r.json())
      .then(d => console.log("API Health Check Success:", d))
      .catch(e => console.error("API Health Check Failed (Unexpected):", e));
  }, []);

  const handleUpload = async (files: File[]) => {
    if (!job) return;
    setIsProcessing(true);

    try {
      // 1. Upload files to Express server for parsing
      const formData = new FormData();
      files.forEach(file => formData.append("resumes", file));

      const response = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Server failed to parse resumes");
      const parsedResumes: { fileName: string; text: string }[] = await response.json();

      // 2. Use Gemini on frontend to match and rank
      const resumeData: ResumeData[] = parsedResumes.map(r => ({
        fileName: r.fileName,
        rawText: r.text
      }));

      const matchResults = await matchResumes(job, resumeData);
      setResults(prev => [...matchResults, ...prev].sort((a, b) => b.score - a.score));
    } catch (error) {
      console.error("Error processing resumes:", error);
      alert("Failed to process resumes. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 selection:bg-blue-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-zinc-900 p-2 rounded-lg">
              <Sparkles size={20} className="text-white" />
            </div>
            <h1 className="font-black text-xl tracking-tighter uppercase italic">Gemini ATS</h1>
          </div>
          <nav className="flex items-center gap-6">
            <button className="text-sm font-bold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-widest flex items-center gap-2">
              <LayoutDashboard size={14} />
              Dashboard
            </button>
            <button className="text-sm font-bold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-widest flex items-center gap-2">
              <Settings2 size={14} />
              Settings
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left: Configuration */}
          <div className="lg:col-span-4 space-y-6">
            <JobForm onSave={setJob} />
            
            {job ? (
              <FileUpload onUpload={handleUpload} isUploading={isProcessing} />
            ) : (
              <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl flex items-start gap-3">
                <Info className="text-blue-500 shrink-0 mt-0.5" size={20} />
                <div>
                  <h3 className="font-bold text-blue-900 text-sm">Action Required</h3>
                  <p className="text-sm text-blue-700 mt-1 leading-relaxed">
                    Please define the job parameters first. This helps Gemini accurately rank candidates based on your specific requirements.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {job && (
              <div className="bg-zinc-900 text-white p-6 rounded-2xl flex items-center justify-between shadow-xl shadow-zinc-200 overflow-hidden relative">
                <div className="relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Active Search</span>
                  <h2 className="text-2xl font-bold mt-1">{job.title}</h2>
                  <p className="text-sm text-zinc-400 mt-1">{job.minExperience}+ years • {job.requiredSkills.join(", ")}</p>
                </div>
                <div className="relative z-10">
                  <button 
                    onClick={() => setJob(null)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors backdrop-blur-sm"
                  >
                    Change Job
                  </button>
                </div>
                {/* Decorative background circle */}
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              </div>
            )}

            {results.length > 0 ? (
              <ResultsList results={results} onSelect={setSelectedResult} />
            ) : (
              <div className="flex-1 min-h-[400px] border-2 border-dashed border-zinc-200 rounded-3xl flex flex-col items-center justify-center text-center p-8 bg-white/50">
                <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                  <LayoutDashboard size={24} className="text-zinc-300" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900">No candidates analyzed yet</h3>
                <p className="text-zinc-500 mt-2 max-w-xs mx-auto">
                  Upload resumes on the left to start ranking candidates with Gemini AI.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <CandidateModal 
        result={selectedResult} 
        onClose={() => setSelectedResult(null)} 
      />

      <footer className="mt-20 border-t border-zinc-200 py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
            © 2026 Gemini ATS • Built for Speed
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-widest">Privacy Policy</a>
            <a href="#" className="text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-widest">Terms of Service</a>
            <a href="#" className="text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-widest">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
