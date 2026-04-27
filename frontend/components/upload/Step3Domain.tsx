"use client";

import React, { useState } from "react";
import { Briefcase, CreditCard, HeartPulse, CheckCircle2, ChevronRight, ArrowLeft } from "lucide-react";

interface Step3DomainProps {
  onNext: (domain: string, strictness: string) => void;
  onBack: () => void;
}

const DOMAINS = [
  { id: "hiring", title: "Hiring", desc: "Check gender, age, disability, and ethnicity-related adverse impact.", icon: <Briefcase className="w-6 h-6" /> },
  { id: "financial", title: "Lending", desc: "Check protected class impact on approval/denial outcomes.", icon: <CreditCard className="w-6 h-6" /> },
  { id: "healthcare", title: "Healthcare", desc: "Check access, diagnosis, and care recommendation disparities.", icon: <HeartPulse className="w-6 h-6" /> },
  { id: "general", title: "General", desc: "Use standard fairness thresholds.", icon: <CheckCircle2 className="w-6 h-6" /> },
];

export function Step3Domain({ onNext, onBack }: Step3DomainProps) {
  const [selectedDomain, setSelectedDomain] = useState<string>("general");
  const [strictness, setStrictness] = useState<string>("standard");

  return (
    <div className="w-full">
      <div className="mb-12">
        <h2 className="text-4xl font-black font-orbitron tracking-tight text-[#EEEEEE] mb-4">
          Domain Settings
        </h2>
        <p className="text-[#AABBC4] text-lg max-w-2xl leading-relaxed">
          Calibrate ETHYX AI ethical lenses and bias detection models based on context.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-4xl">
        {DOMAINS.map((domain) => {
          const isSelected = selectedDomain === domain.id;
          return (
            <div
              key={domain.id}
              onClick={() => setSelectedDomain(domain.id)}
              className={`glass-card rounded-xl p-6 border-2 relative flex flex-col items-start cursor-pointer transition-all ${
                isSelected ? "border-[#00ADB5] bg-[#00ADB5]/5" : "border-[#00ADB5]/10 hover:border-[#00ADB5]/40 hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className={`p-3 rounded-lg ${isSelected ? "bg-[#00ADB5]/20 text-[#55d8e1]" : "bg-[#242B35] text-[#6B8090]"}`}>
                  {domain.icon}
                </div>
                <h3 className="text-lg font-bold font-orbitron text-[#EEEEEE]">{domain.title}</h3>
              </div>
              <p className="text-sm text-[#AABBC4] leading-relaxed">{domain.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="glass-card p-6 rounded-xl border border-[#3C494A]/50 max-w-4xl mb-12">
        <h3 className="font-orbitron font-bold text-[#EEEEEE] mb-4">AUDIT STRICTNESS</h3>
        <div className="flex gap-4">
          {["standard", "strict", "research"].map(level => (
            <button
              key={level}
              onClick={() => setStrictness(level)}
              className={`px-6 py-3 rounded-lg font-orbitron tracking-widest text-xs uppercase font-bold transition-all border ${
                strictness === level ? "bg-[#00ADB5] text-[#002022] border-[#00ADB5]" : "bg-[#2F353E] text-[#AABBC4] border-[#3C494A] hover:border-[#55d8e1]/50"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
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
          onClick={() => onNext(selectedDomain, strictness)}
          className="bg-[#00ADB5] text-[#002022] px-8 py-3 rounded-lg font-black font-orbitron tracking-widest hover:shadow-[0_0_20px_rgba(0,173,181,0.4)] transition-all flex items-center gap-2"
        >
          CONTINUE
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
