"use client";

import React, { useState, useRef } from "react";
import { CloudUpload, FileText, TableProperties, AlertCircle } from "lucide-react";
import Papa from "papaparse";

interface Step1UploadProps {
  onNext: (file: File, headers: string[], preview: any[], rowCount: number) => void;
  onCancel: () => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function Step1Upload({ onNext, onCancel }: Step1UploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setError(null);
    if (!file.name.endsWith(".csv")) {
      setError("Only CSV files are supported.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("File exceeds 10MB limit.");
      return;
    }

    setIsParsing(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setIsParsing(false);
        const data = results.data as any[];
        if (data.length < 10) {
          setError("Dataset must have at least 10 rows.");
          return;
        }
        if (results.meta.fields && results.meta.fields.length < 2) {
          setError("Dataset must have at least 2 columns.");
          return;
        }
        
        onNext(file, results.meta.fields || [], data.slice(0, 5), data.length);
      },
      error: (err) => {
        setIsParsing(false);
        setError("Failed to parse CSV: " + err.message);
      }
    });
  };

  return (
    <div className="w-full">
      <div className="mb-12">
        <h2 className="text-4xl font-black font-orbitron tracking-tight text-[#EEEEEE] mb-4">
          Dataset Upload
        </h2>
        <p className="text-[#AABBC4] text-lg max-w-2xl leading-relaxed">
          Upload your structured data for automated bias auditing.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-8 relative overflow-hidden border border-[#00ADB5]/20 max-w-3xl mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg flex items-center gap-3">
            <AlertCircle className="text-[#EF4444] w-5 h-5" />
            <span className="text-sm text-[#EF4444]">{error}</span>
          </div>
        )}

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#55d8e1]/30 rounded-xl bg-[#0e141c]/40 p-16 flex flex-col items-center justify-center group hover:border-[#55d8e1]/60 transition-all cursor-pointer"
        >
          <input
            type="file"
            accept=".csv"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <div className="w-20 h-20 rounded-full bg-[#00adb5]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <CloudUpload className="w-10 h-10 text-[#55d8e1]" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-[#EEEEEE]">
            {isParsing ? "Parsing CSV..." : "Drop CSV files here"}
          </h3>
          <p className="text-sm text-[#AABBC4] mb-8">
            or click to browse local storage (Max 10MB)
          </p>
          <div className="flex gap-4">
            <div className="px-4 py-2 rounded bg-[#2F353E] border border-[#3C494A] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#55d8e1]" />
              <span className="font-dm-mono text-xs text-[#EEEEEE]">CSV</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between py-8 border-t border-[#3C494A] mt-12">
        <button
          onClick={onCancel}
          className="px-8 py-3 text-[#AABBC4] font-bold font-orbitron tracking-widest hover:bg-[#AABBC4]/5 rounded-lg transition-all"
        >
          CANCEL
        </button>
      </div>
    </div>
  );
}
