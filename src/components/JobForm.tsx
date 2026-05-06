import React, { useState } from "react";
import { JobDescription } from "../types";
import { Briefcase, List, Clock, FileText } from "lucide-react";

interface Props {
  onSave: (job: JobDescription) => void;
}

export default function JobForm({ onSave }: Props) {
  const [job, setJob] = useState<JobDescription>({
    title: "",
    description: "",
    requiredSkills: [],
    minExperience: 0,
  });

  const [skillsText, setSkillsText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...job,
      requiredSkills: skillsText.split(",").map(s => s.trim()).filter(Boolean)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
      <div className="flex items-center gap-2 mb-2 text-zinc-900 font-semibold">
        <Briefcase size={18} className="text-blue-600" />
        <h2>Job Specification</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Job Title</label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={job.title}
            onChange={(e) => setJob({ ...job, title: e.target.value })}
            placeholder="e.g. Senior Software Engineer"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Description</label>
          <textarea
            required
            rows={4}
            className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
            value={job.description}
            onChange={(e) => setJob({ ...job, description: e.target.value })}
            placeholder="Key responsibilities and expectations..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Skills (Comma separated)</label>
            <div className="relative">
              <input
                type="text"
                required
                className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                placeholder="React, Node, SQL..."
              />
              <List size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Min Exp (Years)</label>
            <div className="relative">
              <input
                type="number"
                min="0"
                required
                className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={job.minExperience}
                onChange={(e) => setJob({ ...job, minExperience: parseInt(e.target.value) || 0 })}
              />
              <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2.5 px-4 bg-zinc-900 text-white font-medium rounded-lg hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
      >
        <FileText size={18} />
        Set Job Parameters
      </button>
    </form>
  );
}
