# Automated Resume Screening Tool (Gemini ATS)

An AI-powered Applicant Tracking System (ATS) that utilizes Google's Gemini 3 Flash model to parse, analyze, and rank resumes against specific job descriptions with high precision.

---

## 1. Project Overview
The **Automated Resume Screening Tool** is a full-stack application designed to solve the "high-volume application" problem in recruitment. It automates the initial screening phase by extracting key data from resumes (PDF, DOCX, TXT) and comparing them against a job specification provided by the recruiter.

### The Problem
HR teams often receive hundreds of resumes for a single role. Manually reading each one is:
- **Time-consuming**: Hours spent on unqualified candidates.
- **Inconsistent**: Subjective bias can lead to missing top talent.
- **Inefficient**: Hard to compare candidates side-by-side objectively.

### The Solution
This tool provides a **technical score (0-100)**, extracts structured candidate data, and provides a "Strengths vs. Gaps" analysis for every resume uploaded.

---

## 2. Tech Stack
| Component | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS (Design) |
| **Backend** | Express.js (Node.js) |
| **AI Engine** | Google Gemini 3 Flash (@google/genai) |
| **Parsing** | pdf-parse, mammoth (DOCX), multer |
| **Animations** | Motion (formerly Framer Motion) |
| **Icons** | Lucide React |

---

## 3. Key Features
- **Multi-Format Ingestion**: Supports `.pdf`, `.docx`, and `.txt` files.
- **AI Ranking**: Uses LLM semantic understanding instead of simple keyword matching.
- **Deep Extraction**: Automatically finds years of experience, contact info, and skill sets.
- **Reasoning Engine**: Explains *why* a candidate received a certain score.
- **Rich Dashboard**: A polished, responsive UI for managing job specs and candidate lists.
- **Privacy First**: Files are parsed in memory and never stored permanently.

---

## 4. Installation Guide

### Prerequisites
- Node.js (v18 or higher)
- A Google AI Studio API Key ([Get one here](https://aistudio.google.com/app/apikey))

### Steps
1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd automated-resume-screening-tool
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

---

## 5. Folder Structure
```text
/
├── server.ts            # Express server (File parsing & health checks)
├── src/
│   ├── components/      # UI Components (JobForm, FileUpload, ResultsList)
│   ├── lib/             # Logic (Gemini API integration)
│   ├── types.ts         # TypeScript interfaces
│   ├── App.tsx          # Main entry layout
│   └── main.tsx         # React DOM mounting
├── package.json         # Dependency management
└── README.md            # You are here
```

---

## 6. How it Works (Workflow)
1. **Job Definition**: Recruiter enters the Job Title, Description, and required skills.
2. **Resume Upload**: Multiple resumes are uploaded via the drag-and-drop interface.
3. **Extraction**: The Express backend parses raw text from the documents.
4. **Analysis**: Gemini 3 Flash processes the text against the Job Spec.
5. **Ranking**: Results are sorted by score and displayed with actionable insights.

---

## 7. Learning Outcomes
- **NLP Implementation**: Learned how to leverage Large Language Models for unstructured text extraction.
- **Full-Stack Integration**: Bridged a Node.js text-parsing backend with a reactive React frontend.
- **Technical Recruiting**: Understood the metrics that matter in an ATS (Score weighting, Experience validation).
- **TypeScript**: Implemented robust type safety across the entire data pipeline.

---

## 8. Future Improvements
- **Bulk Export**: Exporting candidate rankings to CSV/Excel.
- **Interview Questions Generator**: Using Gemini to suggest 5 specific questions based on the candidate's gaps.
- **Email Integration**: Sending automated "Shortlisted" emails directly from the dashboard.

---

**Developed for GitHub Portfolio Integration**
*This project serves as a proof-of-work for AI/NLP and Full-Stack Development roles.*
