import React, { useState, useRef } from "react";
import { Upload, X, FileCheck, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  onUpload: (files: File[]) => Promise<void>;
  isUploading: boolean;
}

export default function FileUpload({ onUpload, isUploading }: Props) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcess = async () => {
    if (selectedFiles.length === 0) return;
    await onUpload(selectedFiles);
    setSelectedFiles([]);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm space-y-4">
      <div className="flex items-center gap-2 mb-2 text-zinc-900 font-semibold">
        <Upload size={18} className="text-indigo-600" />
        <h2>Resume Hub</h2>
      </div>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-3
          ${dragActive ? "border-indigo-500 bg-indigo-50/50" : "border-zinc-200 bg-zinc-50 hover:bg-zinc-100/50"}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt"
          className="hidden"
          onChange={handleChange}
        />
        <div className="p-3 bg-white rounded-full shadow-sm">
          <Upload className="text-zinc-400" size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-900">Click or drag resumes here</p>
          <p className="text-xs text-zinc-500 mt-1">Supports PDF, DOCX, and TXT files</p>
        </div>
      </div>

      <AnimatePresence>
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar"
          >
            {selectedFiles.map((file, idx) => (
              <motion.div
                key={`${file.name}-${idx}`}
                layout
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-center justify-between p-2.5 bg-zinc-50 rounded-lg border border-zinc-100"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileCheck size={14} className="text-zinc-400 shrink-0" />
                  <span className="text-xs font-medium text-zinc-700 truncate">{file.name}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                  className="p-1 hover:bg-zinc-200 rounded text-zinc-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        disabled={selectedFiles.length === 0 || isUploading}
        onClick={handleProcess}
        className={`
          w-full py-2.5 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2
          ${selectedFiles.length > 0 && !isUploading 
            ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100" 
            : "bg-zinc-100 text-zinc-400 cursor-not-allowed"}
        `}
      >
        {isUploading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Analyzing with Gemini...
          </>
        ) : (
          <>
            <FileCheck size={18} />
            Parse {selectedFiles.length} Resume{selectedFiles.length !== 1 ? "s" : ""}
          </>
        )}
      </button>
    </div>
  );
}
