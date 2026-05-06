export interface ResumeData {
  fileName: string;
  rawText: string;
}

export interface CandidateInfo {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: number; // years
  education: string;
  summary: string;
}

export interface MatchResult {
  fileName: string;
  score: number; // 0-100
  candidate: CandidateInfo;
  reasoning: string;
  strengths: string[];
  gaps: string[];
}

export interface JobDescription {
  title: string;
  description: string;
  requiredSkills: string[];
  minExperience: number;
}
