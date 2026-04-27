"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  CloudUpload,
  FileText,
  CheckCircle2,
  Circle,
  Settings,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import Papa from "papaparse";
import { toast } from "sonner";

import { getAuthToken } from "@/lib/getAuthToken";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["", "text/csv", "application/vnd.ms-excel"];

interface Step2SourceProps {
  domain: string;
  onNext: (auditId: string) => void;
  onBack: () => void;
}

export function Step2Source({ domain, onNext, onBack }: Step2SourceProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const getProgressWidthClass = (progress: number) => {
    if (progress >= 100) return "w-full";
    if (progress >= 60) return "w-[60%]";
    if (progress >= 30) return "w-[30%]";
    if (progress >= 10) return "w-[10%]";
    return "w-0";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleInitializeAnalysis = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error("File exceeds 10MB limit.");
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith(".csv") || !ALLOWED_TYPES.includes(selectedFile.type)) {
      toast.error("Only CSV files are supported.");
      return;
    }

    setIsInitializing(true);
    setIsUploading(true);
    setUploadProgress(10);

    try {
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            const data = results.data as any[];
            const rowCount = data.length;
            const headers = results.meta.fields || [];
            const columnCount = headers.length;
            
            // Infer columns to pass to the backend
            const commonProtected = ["ethnicity", "race", "gender", "sex", "age"];
            let inferredProtected = headers.filter(h => commonProtected.includes(h.toLowerCase()));
            if (inferredProtected.length === 0) inferredProtected = headers.length > 0 ? [headers[0]] : ["Unknown"];
            
            const commonTargets = ["loan_status", "status", "target", "label", "outcome", "prediction"];
            let inferredTarget = headers.find(h => commonTargets.includes(h.toLowerCase()));
            if (!inferredTarget) inferredTarget = headers.length > 1 ? headers[headers.length - 1] : "Unknown";

            let inferredPrediction = headers.find(h => h.toLowerCase() === "prediction" || h.toLowerCase() === "pred");
            if (!inferredPrediction) inferredPrediction = inferredTarget;

            setUploadProgress(30);

            if (!API_URL) {
              throw new Error("NEXT_PUBLIC_API_URL is not configured");
            }

            const { token } = await getAuthToken();

            const sasResponse = await fetch(`${API_URL}/upload/sas-url`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                filename: selectedFile.name,
                content_type: selectedFile.type || "text/csv",
              }),
            });

            if (!sasResponse.ok) {
              const errData = await sasResponse
                .json()
                .catch(() => ({ detail: "Failed to initialize upload" }));
              throw new Error(errData.detail || "Failed to initialize upload");
            }

            const uploadTarget: { upload_url: string; blob_name: string } =
              await sasResponse.json();

            setUploadProgress(60);

            const uploadRes = await fetch(uploadTarget.upload_url, {
              method: "PUT",
              headers: {
                "x-ms-blob-type": "BlockBlob",
                "Content-Type": selectedFile.type || "text/csv",
              },
              body: selectedFile,
            });

            if (!uploadRes.ok) {
              throw new Error("Failed to upload file");
            }

            const response = await fetch("/api/audits", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                fileName: selectedFile.name,
                fileSize: selectedFile.size,
                blobPath: uploadTarget.blob_name,
                rowCount: rowCount,
                columnCount: columnCount,
                targetColumn: inferredTarget,
                predictionColumn: inferredPrediction,
                protectedAttributes: inferredProtected,
                positiveLabel: null,
                taskType: "binary_classification",
                domain: domain,
                strictness: "standard"
              })
            });
            
            if (!response.ok) {
              throw new Error("Failed to create audit");
            }
            
            const auditData = await response.json();
            const newAuditId = auditData.id;
            
            setUploadProgress(100);
            setTimeout(() => {
              onNext(newAuditId);
            }, 500);

          } catch (err) {
            console.error("Error creating/uploading audit:", err);
            setIsInitializing(false);
            setIsUploading(false);
            toast.error("Upload failed. Check console for details.");
          }
        },
        error: (err) => {
          console.error("Failed to parse CSV:", err);
          setIsInitializing(false);
          setIsUploading(false);
          toast.error("Failed to parse CSV.");
        }
      });
      
    } catch (err) {
      console.error("Error:", err);
      setIsInitializing(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Main Upload Area */}
        <div className="md:col-span-8 space-y-6">
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden border border-[#00ADB5]/20">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#55d8e1]/40 to-transparent"></div>
            <div className="mb-6">
              <h2 className="font-orbitron text-lg font-bold tracking-tight text-[#EEEEEE]">
                Source Selection
              </h2>
              <p className="text-sm text-[#AABBC4]">
                Upload your structured data for automated bias auditing.
              </p>
            </div>

            {/* Dashed Dropzone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#55d8e1]/30 rounded-xl bg-[#0e141c]/40 p-10 flex flex-col items-center justify-center group hover:border-[#55d8e1]/60 transition-all cursor-pointer"
            >
              <input
                type="file"
                accept=".csv"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <div className="w-16 h-16 rounded-full bg-[#00adb5]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CloudUpload className="w-8 h-8 text-[#55d8e1]" />
              </div>
              <h3 className="text-base font-bold mb-1 text-[#EEEEEE]">
                {selectedFile ? selectedFile.name : "Drop CSV files here"}
              </h3>
              <p className="text-xs text-[#AABBC4] mb-6">
                {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : "or click to browse local storage"}
              </p>
              {!selectedFile && (
                <div className="flex gap-3">
                  <div className="px-3 py-1.5 rounded bg-[#2F353E] border border-[#3C494A] flex items-center gap-2">
                    <FileText className="w-3 h-3 text-[#55d8e1]" />
                    <span className="font-dm-mono text-[10px] text-[#EEEEEE]">
                      CSV ONLY
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Active Progress State */}
            {isUploading && selectedFile && (
              <div className="mt-8 p-4 bg-[#1a2029]/80 border border-[#3C494A] rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#00adb5]/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#55d8e1]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold font-dm-mono text-[#EEEEEE]">
                        {selectedFile.name}
                      </p>
                      <p className="text-[10px] text-[#55d8e1] animate-pulse">
                        {uploadProgress < 100
                          ? "Uploading..."
                          : "Validating columns..."}
                      </p>
                    </div>
                  </div>
                  <span className="font-dm-mono text-xs text-[#55d8e1]">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#393e46] rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-[#55d8e1] to-[#00adb5] shadow-[0_0_10px_rgba(85,216,225,0.5)] transition-all duration-300 ${getProgressWidthClass(uploadProgress)}`}
                  ></div>
                </div>
                <div className="flex justify-between mt-3 text-[10px] text-[#AABBC4] font-dm-mono">
                  <span>Uploaded: {((selectedFile.size * (uploadProgress / 100)) / 1024 / 1024).toFixed(2)} MB / {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                  <span>Speed: calculating...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Secondary Info Panels */}
        <div className="md:col-span-4 space-y-6">
          {/* Validation Rules Card */}
          <div className="glass-card rounded-2xl p-5 border border-[#00ADB5]/20">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-[#55d8e1]" />
              <h3 className="font-orbitron text-xs font-bold uppercase tracking-widest text-[#EEEEEE]">
                Audit Protocol
              </h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#55d8e1] mt-0.5" />
                <div className="text-[11px]">
                  <span className="block font-bold text-[#EEEEEE]">
                    UTF-8 Encoding
                  </span>
                  <span className="text-[#AABBC4]">
                    Requirement for text bias extraction.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#55d8e1] mt-0.5" />
                <div className="text-[11px]">
                  <span className="block font-bold text-[#EEEEEE]">
                    Protected Attributes
                  </span>
                  <span className="text-[#AABBC4]">
                    Must include gender, age, or ethnicity labels.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Circle className="w-4 h-4 text-[#6B8090] mt-0.5" />
                <div className="text-[11px] opacity-60">
                  <span className="block font-bold text-[#EEEEEE]">
                    Target Outcome
                  </span>
                  <span className="text-[#AABBC4]">
                    Binary or continuous labels for scoring.
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* AI Insights Preview */}
          <div className="glass-card rounded-2xl p-5 relative overflow-hidden group border border-[#00ADB5]/20">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00adb5]/5 to-transparent opacity-50"></div>
            <div className="relative z-10">
              <h4 className="text-[10px] font-black font-orbitron text-[#55d8e1] mb-2 tracking-tighter uppercase">
                Suggested Config
              </h4>
              <div className="bg-[#0e141c]/60 p-3 rounded-lg border border-[#55d8e1]/10 mb-3">
                <p className="text-[11px] leading-relaxed italic text-[#AABBC4]">
                  "Detected domain '{domain}'. Applying calibrated bias model by default."
                </p>
              </div>
              <button className="w-full py-2 bg-transparent border border-[#00adb5]/40 text-[#55d8e1] text-[10px] font-bold font-orbitron rounded hover:bg-[#00adb5] hover:text-[#0e141c] transition-all flex items-center justify-center gap-2">
                CHANGE MODEL <Settings className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-12 pt-6 border-t border-[#3C494A] flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-[#AABBC4] hover:text-[#EEEEEE] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous Step
        </button>
        <div className="flex gap-4">
          <button className="px-6 py-2.5 rounded-lg text-sm font-bold text-[#AABBC4] hover:bg-[#393e46]/30 transition-all">
            Save Draft
          </button>
          <button
            onClick={handleInitializeAnalysis}
            disabled={isInitializing || !selectedFile}
            className="px-8 py-2.5 bg-gradient-to-r from-[#55d8e1] to-[#00adb5] rounded-lg text-sm font-bold text-[#002022] shadow-[0_4px_15px_rgba(0,173,181,0.3)] hover:shadow-[0_4px_25px_rgba(0,173,181,0.5)] transition-all flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isInitializing ? "Initializing..." : "Initialize Analysis"}
            {!isInitializing && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </div>
      </div>
    </div>
  );
}
