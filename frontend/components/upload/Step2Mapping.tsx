"use client";

import React, { useState } from "react";
import { ArrowLeft, ChevronRight, AlertTriangle } from "lucide-react";

interface Step2MappingProps {
  headers: string[];
  previewData: any[];
  onNext: (mapping: {
    targetColumn: string;
    predictionColumn: string;
    protectedAttributes: string[];
    positiveLabel: string;
    taskType: string;
  }) => void;
  onBack: () => void;
}

export function Step2Mapping({ headers, previewData, onNext, onBack }: Step2MappingProps) {
  const [targetColumn, setTargetColumn] = useState("");
  const [predictionColumn, setPredictionColumn] = useState("");
  const [protectedAttributes, setProtectedAttributes] = useState<string[]>([]);
  const [positiveLabel, setPositiveLabel] = useState("");
  const [taskType, setTaskType] = useState("binary_classification");
  const [error, setError] = useState<string | null>(null);

  const toggleProtectedAttribute = (col: string) => {
    if (protectedAttributes.includes(col)) {
      setProtectedAttributes(protectedAttributes.filter((c) => c !== col));
    } else {
      setProtectedAttributes([...protectedAttributes, col]);
    }
  };

  const handleNext = () => {
    setError(null);
    if (!targetColumn) return setError("Target column is required.");
    if (protectedAttributes.length === 0) return setError("At least one protected attribute is required.");
    if (taskType === "binary_classification" && !positiveLabel) return setError("Positive label is required for binary classification.");
    if (targetColumn === predictionColumn) return setError("Target and prediction columns cannot be the same.");
    if (protectedAttributes.includes(targetColumn)) return setError("Target cannot be a protected attribute.");
    if (protectedAttributes.includes(predictionColumn)) return setError("Prediction cannot be a protected attribute.");

    onNext({
      targetColumn,
      predictionColumn,
      protectedAttributes,
      positiveLabel,
      taskType
    });
  };

  return (
    <div className="w-full">
      <div className="mb-12">
        <h2 className="text-4xl font-black font-orbitron tracking-tight text-[#EEEEEE] mb-4">
          Column Mapping
        </h2>
        <p className="text-[#AABBC4] text-lg max-w-2xl leading-relaxed">
          Assign AI audit roles to your data columns.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg flex items-center gap-3 max-w-4xl">
          <AlertTriangle className="text-[#EF4444] w-5 h-5" />
          <span className="text-sm text-[#EF4444]">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 max-w-4xl">
        <div className="glass-card p-6 rounded-xl border border-[#00ADB5]/20">
          <label className="block text-xs font-orbitron text-[#AABBC4] mb-2">TASK TYPE *</label>
          <select
            value={taskType}
            onChange={(e) => setTaskType(e.target.value)}
            className="w-full bg-[#0e141c] border border-[#3C494A] rounded-lg p-3 text-[#EEEEEE] font-dm-sans mb-6 focus:border-[#00ADB5] outline-none"
          >
            <option value="binary_classification">Binary Classification</option>
            <option value="multi_class_classification">Multi-class Classification</option>
          </select>

          <label className="block text-xs font-orbitron text-[#AABBC4] mb-2">TARGET COLUMN (ACTUAL) *</label>
          <select
            value={targetColumn}
            onChange={(e) => setTargetColumn(e.target.value)}
            className="w-full bg-[#0e141c] border border-[#3C494A] rounded-lg p-3 text-[#EEEEEE] font-dm-sans mb-6 focus:border-[#00ADB5] outline-none"
          >
            <option value="">Select column...</option>
            {headers.map(h => <option key={h} value={h}>{h}</option>)}
          </select>

          <label className="block text-xs font-orbitron text-[#AABBC4] mb-2">PREDICTION COLUMN (OPTIONAL)</label>
          <select
            value={predictionColumn}
            onChange={(e) => setPredictionColumn(e.target.value)}
            className="w-full bg-[#0e141c] border border-[#3C494A] rounded-lg p-3 text-[#EEEEEE] font-dm-sans mb-6 focus:border-[#00ADB5] outline-none"
          >
            <option value="">None (Analyze dataset only)</option>
            {headers.map(h => <option key={h} value={h}>{h}</option>)}
          </select>

          {taskType === "binary_classification" && (
            <>
              <label className="block text-xs font-orbitron text-[#AABBC4] mb-2">POSITIVE LABEL *</label>
              <input
                type="text"
                value={positiveLabel}
                onChange={(e) => setPositiveLabel(e.target.value)}
                placeholder="e.g. 1, Yes, Approved"
                className="w-full bg-[#0e141c] border border-[#3C494A] rounded-lg p-3 text-[#EEEEEE] font-dm-sans mb-6 focus:border-[#00ADB5] outline-none"
              />
            </>
          )}
        </div>

        <div className="glass-card p-6 rounded-xl border border-orange-500/20">
          <label className="block text-xs font-orbitron text-[#AABBC4] mb-2">PROTECTED ATTRIBUTES *</label>
          <p className="text-xs text-[#6B8090] mb-4">Select columns representing sensitive demographics (e.g. Race, Gender, Age).</p>
          <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto pr-2">
            {headers.map(h => (
              <div
                key={h}
                onClick={() => toggleProtectedAttribute(h)}
                className={`px-3 py-2 rounded-lg text-sm cursor-pointer border transition-colors ${
                  protectedAttributes.includes(h)
                    ? "bg-orange-500/20 border-orange-500/50 text-orange-200"
                    : "bg-[#2F353E] border-[#3C494A] text-[#AABBC4] hover:border-[#55d8e1]/50"
                }`}
              >
                {h}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-6 rounded-xl border border-[#3C494A]/50 max-w-4xl overflow-x-auto">
        <h3 className="text-sm font-bold text-[#EEEEEE] mb-4 font-orbitron">DATA PREVIEW</h3>
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-[#161c25]">
              {headers.slice(0, 8).map(h => (
                <th key={h} className="px-4 py-2 border-r border-[#3C494A]/50 text-xs font-orbitron text-[#AABBC4] whitespace-nowrap">
                  {h}
                </th>
              ))}
              {headers.length > 8 && <th className="px-4 py-2 text-xs text-[#6B8090]">...</th>}
            </tr>
          </thead>
          <tbody className="font-dm-mono text-xs text-[#EEEEEE]">
            {previewData.map((row, i) => (
              <tr key={i} className="border-b border-[#3C494A]/50">
                {headers.slice(0, 8).map(h => (
                  <td key={h} className="px-4 py-2 whitespace-nowrap">{row[h]?.toString().substring(0, 20)}</td>
                ))}
                {headers.length > 8 && <td className="px-4 py-2 text-[#6B8090]">...</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between py-8 border-t border-[#3C494A] mt-12 max-w-4xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-[#AABBC4] hover:text-[#EEEEEE] transition-all font-bold font-orbitron tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" />
          PREVIOUS
        </button>
        <button
          onClick={handleNext}
          className="bg-[#00ADB5] text-[#002022] px-8 py-3 rounded-lg font-black font-orbitron tracking-widest hover:shadow-[0_0_20px_rgba(0,173,181,0.4)] transition-all flex items-center gap-2"
        >
          CONTINUE
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
