import { GoogleGenAI, Type } from "@google/genai";
import { JobDescription, MatchResult, ResumeData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function matchResumes(
  job: JobDescription,
  resumes: ResumeData[]
): Promise<MatchResult[]> {
  const model = "gemini-3-flash-preview";

  const results: MatchResult[] = [];

  for (const resume of resumes) {
    const prompt = `
      You are an expert HR Recruiter and ATS (Applicant Tracking System) specializing in technical screening.
      
      Job Title: ${job.title}
      Job Description: ${job.description}
      Required Skills: ${job.requiredSkills.join(", ")}
      Minimum Experience: ${job.minExperience} years

      Resume Content (File: ${resume.fileName}):
      ---
      ${resume.rawText}
      ---

      Tasks:
      1. Extract candidate information (Name, Email, Phone, Skills, Experience Years, Education, Summary).
      2. Analyze how well the resume matches the job description.
      3. Assign a score from 0 to 100 based on skill relevance, experience level, and overall fit.
      4. Provide detailed reasoning for the score.
      5. Identify specific strengths and missing gaps.

      Return ONLY a JSON object matching the requested schema.
    `;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER, description: "Matching score (0-100)" },
              reasoning: { type: Type.STRING },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
              candidate: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  email: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  experience: { type: Type.NUMBER, description: "Total years of experience" },
                  education: { type: Type.STRING },
                  summary: { type: Type.STRING },
                },
                required: ["name", "email", "skills", "experience"],
              },
            },
            required: ["score", "reasoning", "candidate", "strengths", "gaps"],
          },
        },
      });

      const data = JSON.parse(response.text || "{}");
      results.push({
        ...data,
        fileName: resume.fileName,
      });
    } catch (error) {
      console.error(`Error processing resume ${resume.fileName}:`, error);
      // Push a fallback failed result
      results.push({
        fileName: resume.fileName,
        score: 0,
        reasoning: "Failed to analyze resume.",
        strengths: [],
        gaps: ["Analysis error"],
        candidate: {
          name: "Error",
          email: "N/A",
          phone: "N/A",
          skills: [],
          experience: 0,
          education: "N/A",
          summary: "Error during parsing.",
        },
      });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
