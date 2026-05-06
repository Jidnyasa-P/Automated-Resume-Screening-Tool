import { MatchResult } from "../types";
import { User, Award, ExternalLink, Mail, Phone, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  results: MatchResult[];
  onSelect: (result: MatchResult) => void;
}

export default function ResultsList({ results, onSelect }: Props) {
  if (results.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-zinc-900">Ranked Candidates</h2>
        <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-2 py-1 rounded-full">
          {results.length} Profiles Scanned
        </span>
      </div>

      <div className="grid gap-4">
        {results.map((result, idx) => (
          <motion.div
            key={result.candidate.email + idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => onSelect(result)}
            className="group relative bg-white p-5 rounded-xl border border-zinc-200 hover:border-blue-500 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
          >
            {/* Score Ring */}
            <div className={`absolute top-0 right-0 h-1 w-full ${getScoreBg(result.score)}`} />
            
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${getScoreColor(result.score)}`}>
                  <User size={24} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-zinc-900 group-hover:text-blue-600 transition-colors truncate">
                    {result.candidate.name}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    <span className="flex items-center gap-1 text-xs text-zinc-500">
                      <Mail size={12} /> {result.candidate.email}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-zinc-500">
                      <Calendar size={12} /> {result.candidate.experience} yrs exp
                    </span>
                  </div>
                  
                  {/* Summary Preview */}
                  <p className="mt-3 text-sm text-zinc-600 line-clamp-2 italic leading-relaxed">
                    "{result.candidate.summary}"
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {result.candidate.skills.slice(0, 4).map(skill => (
                      <span key={skill} className="px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded text-[10px] font-semibold uppercase tracking-tight">
                        {skill}
                      </span>
                    ))}
                    {result.candidate.skills.length > 4 && (
                      <span className="text-[10px] text-zinc-400 font-medium self-center">
                        +{result.candidate.skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className={`text-3xl font-black ${getScoreTextColor(result.score)}`}>
                  {Math.round(result.score)}%
                </div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Match Score</div>
                <button className="mt-4 p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                  <ExternalLink size={18} />
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-4 pt-4 border-t border-zinc-100 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span className="text-xs text-zinc-600 truncate">{result.strengths[0]}</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle size={14} className="text-amber-500" />
                <span className="text-xs text-zinc-600 truncate">{result.gaps[0] || "No gaps detected"}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function getScoreBg(score: number) {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-blue-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-rose-500";
}

function getScoreColor(score: number) {
  if (score >= 80) return "bg-emerald-50 text-emerald-600 border border-emerald-100";
  if (score >= 60) return "bg-blue-50 text-blue-600 border border-blue-100";
  if (score >= 40) return "bg-amber-50 text-amber-600 border border-amber-100";
  return "bg-rose-50 text-rose-600 border border-rose-100";
}

function getScoreTextColor(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-blue-600";
  if (score >= 40) return "text-amber-600";
  return "text-rose-600";
}
