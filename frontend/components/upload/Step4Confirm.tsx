"use client";

import React, { useState } from "react";
import { ArrowLeft, PlayCircle, Loader2 } from "lucide-react";

interface Step4ConfirmProps {
  file: File | null;
  rowCount: number;
  columnCount: number;
  mapping: any;
  domain: string;
  strictness: string;
  onConfirm: () => Promise<void>;
  onBack: () => void;
}

export function Step4Confirm({ file, rowCount, columnCount, mapping, domain, strictness, onConfirm, onBack }: Step4ConfirmProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await onConfirm();
    } catch (err: any) {
      setError(err.message || "An error occurred during submission.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-12">
        <h2 className="text-4xl font-black font-orbitron tracking-tight text-[#EEEEEE] mb-4">
          Confirm & Start Audit
        </h2>
        <p className="text-[#AABBC4] text-lg max-w-2xl leading-relaxed">
          Review your configuration before initiating the fairness engine.
        </p>
      </div>

      <div className="glass-card p-8 rounded-xl border border-[#00ADB5]/30 max-w-3xl mb-12 shadow-teal-glow relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ADB5]/10 rounded-full blur-3xl"></div>
        
        <div className="grid grid-cols-2 gap-y-6 gap-x-12 relative z-10">
          <div>
            <span className="block text-[10px] font-orbitron text-[#AABBC4] mb-1">DATASET</span>
            <span className="font-dm-mono text-sm text-[#EEEEEE]">{file?.name}</span>
          </div>
          <div>
            <span className="block text-[10px] font-orbitron text-[#AABBC4] mb-1">SIZE</span>
            <span className="font-dm-mono text-sm text-[#EEEEEE]">{file ? (file.size / 1024 / 1024).toFixed(2) : 0} MB</span>
          </div>
          <div>
            <span className="block text-[10px] font-orbitron text-[#AABBC4] mb-1">DIMENSIONS</span>
            <span className="font-dm-mono text-sm text-[#EEEEEE]">{rowCount} rows × {columnCount} cols</span>
          </div>
          <div>
            <span className="block text-[10px] font-orbitron text-[#AABBC4] mb-1">TASK TYPE</span>
            <span className="font-dm-mono text-sm text-[#EEEEEE]">{mapping.taskType}</span>
          </div>
          <div>
            <span className="block text-[10px] font-orbitron text-[#AABBC4] mb-1">TARGET COLUMN</span>
            <span className="font-dm-mono text-sm text-[#55d8e1]">{mapping.targetColumn}</span>
          </div>
          <div>
            <span className="block text-[10px] font-orbitron text-[#AABBC4] mb-1">PROTECTED ATTRIBUTES</span>
            <span className="font-dm-mono text-sm text-orange-400">{mapping.protectedAttributes?.join(", ")}</span>
          </div>
          <div>
            <span className="block text-[10px] font-orbitron text-[#AABBC4] mb-1">PREDICTION COLUMN</span>
            <span className="font-dm-mono text-sm text-[#EEEEEE]">{mapping.predictionColumn || "None"}</span>
          </div>
          <div>
            <span className="block text-[10px] font-orbitron text-[#AABBC4] mb-1">POSITIVE LABEL</span>
            <span className="font-dm-mono text-sm text-[#EEEEEE]">{mapping.positiveLabel || "N/A"}</span>
          </div>
          <div className="col-span-2 pt-4 border-t border-[#3C494A]/50 flex gap-12">
            <div>
              <span className="block text-[10px] font-orbitron text-[#AABBC4] mb-1">DOMAIN POLICY</span>
              <span className="font-dm-mono text-sm text-[#EEEEEE] uppercase">{domain}</span>
            </div>
            <div>
              <span className="block text-[10px] font-orbitron text-[#AABBC4] mb-1">STRICTNESS</span>
              <span className="font-dm-mono text-sm text-[#EEEEEE] uppercase">{strictness}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-lg text-sm text-[#EF4444]">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="mt-8 w-full py-4 bg-gradient-to-r from-[#55d8e1] to-[#00adb5] rounded-lg text-[#002022] font-bold font-orbitron tracking-widest text-sm hover:opacity-90 transition-all transform active:scale-95 shadow-[0_0_20px_rgba(85,216,225,0.4)] flex justify-center items-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> INITIALIZING ENGINE...</>
          ) : (
            <><PlayCircle className="w-5 h-5" /> START FAIRNESS AUDIT</>
          )}
        </button>
      </div>

      <div className="flex items-center justify-between py-8 max-w-3xl">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="flex items-center gap-2 text-sm text-[#AABBC4] hover:text-[#EEEEEE] transition-all font-bold font-orbitron tracking-widest disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          PREVIOUS
        </button>
      </div>
    </div>
  );
}
