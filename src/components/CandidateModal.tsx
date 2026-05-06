import { MatchResult } from "../types";
import { X, Mail, Phone, GraduationCap, Briefcase, ChevronRight, CheckCircle2, AlertCircle, Quote } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  result: MatchResult | null;
  onClose: () => void;
}

export default function CandidateModal({ result, onClose }: Props) {
  if (!result) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black ${getScoreColor(result.score)}`}>
                {Math.round(result.score)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-zinc-900">{result.candidate.name}</h2>
                <div className="flex items-center gap-3 mt-1 text-zinc-500">
                  <span className="flex items-center gap-1 text-sm"><Mail size={14}/> {result.candidate.email}</span>
                  {result.candidate.phone && <span className="flex items-center gap-1 text-sm"><Phone size={14}/> {result.candidate.phone}</span>}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-lg transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Left Column: Summary & Info */}
              <div className="md:col-span-2 space-y-8">
                <section>
                  <div className="flex items-center gap-2 mb-4 text-zinc-400">
                    <Quote size={20} />
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Profile Summary</h3>
                  </div>
                  <p className="text-zinc-600 leading-relaxed text-lg italic">
                    {result.candidate.summary}
                  </p>
                </section>

                <div className="grid grid-cols-2 gap-6">
                  <section>
                    <div className="flex items-center gap-2 mb-3 text-zinc-400">
                      <GraduationCap size={16} />
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Education</h3>
                    </div>
                    <p className="text-zinc-900 font-medium">{result.candidate.education}</p>
                  </section>
                  <section>
                    <div className="flex items-center gap-2 mb-3 text-zinc-400">
                      <Briefcase size={16} />
                      <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Experience</h3>
                    </div>
                    <p className="text-zinc-900 font-medium">{result.candidate.experience} Years Relevant</p>
                  </section>
                </div>

                <section>
                  <div className="flex items-center gap-2 mb-4 text-zinc-400">
                    <ChevronRight size={16} />
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Detailed Reasoning</h3>
                  </div>
                  <div className="p-5 bg-zinc-50 rounded-xl border border-zinc-100 text-zinc-700 leading-relaxed">
                    {result.reasoning}
                  </div>
                </section>

                <div className="grid grid-cols-2 gap-6">
                  <section>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600 mb-3 ml-1">Key Strengths</h3>
                    <ul className="space-y-2">
                      {result.strengths.map((s, i) => (
                        <li key={i} className="flex gap-2 text-sm text-zinc-600 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100/50">
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600 mb-3 ml-1">Risk Factors / Gaps</h3>
                    <ul className="space-y-2">
                      {result.gaps.map((g, i) => (
                        <li key={i} className="flex gap-2 text-sm text-zinc-600 bg-amber-50/50 p-2 rounded-lg border border-amber-100/50">
                          <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                          {g}
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </div>

              {/* Right Column: Skills & Source */}
              <div className="space-y-8">
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">Skills Extracted</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.candidate.skills.map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-zinc-900 text-white rounded-lg text-xs font-medium uppercase tracking-tight">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2">Original Document</h3>
                  <p className="text-xs font-medium text-zinc-800 break-all">{result.fileName}</p>
                </section>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function getScoreColor(score: number) {
  if (score >= 80) return "bg-emerald-600 text-white";
  if (score >= 60) return "bg-blue-600 text-white";
  if (score >= 40) return "bg-amber-600 text-white";
  return "bg-rose-600 text-white";
}
