"use client";

import React, { useState } from "react";
import { Briefcase, CreditCard, HeartPulse, CheckCircle2, ChevronRight } from "lucide-react";

interface DomainOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  standard: string;
}

const DOMAINS: DomainOption[] = [
  {
    id: "hiring",
    title: "Hiring",
    description:
      "Audit recruitment algorithms for gender, racial, or age-based bias in applicant tracking systems and resume screening.",
    icon: <Briefcase className="w-8 h-8" />,
    standard: "EEOC Compliance",
  },
  {
    id: "financial",
    title: "Financial",
    description:
      "Analyze credit scoring, loan approval models, and risk assessment engines for disparate impact and predatory patterns.",
    icon: <CreditCard className="w-8 h-8" />,
    standard: "FICO Fairness",
  },
  {
    id: "healthcare",
    title: "Healthcare",
    description:
      "Audit diagnostic AI and patient prioritization algorithms for equity in access and treatment recommendations.",
    icon: <HeartPulse className="w-8 h-8" />,
    standard: "HIPAA Ethics",
  },
];

interface Step1DomainProps {
  onNext: (domain: string) => void;
  onCancel: () => void;
}

export function Step1Domain({ onNext, onCancel }: Step1DomainProps) {
  const [selectedDomain, setSelectedDomain] = useState<string>("hiring");

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-12">
        <h2 className="text-4xl font-black font-orbitron tracking-tight text-[#EEEEEE] mb-4">
          Domain Selection
        </h2>
        <p className="text-[#AABBC4] text-lg max-w-2xl leading-relaxed">
          Select the specific sector your dataset originates from. ETHYX AI will calibrate its
          ethical lenses and bias detection models according to sector-specific regulatory standards.
        </p>
      </div>

      {/* Domain Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {DOMAINS.map((domain) => {
          const isSelected = selectedDomain === domain.id;
          return (
            <div
              key={domain.id}
              onClick={() => setSelectedDomain(domain.id)}
              className={`glass-card rounded-xl p-8 border-2 relative flex flex-col items-start min-h-[340px] group transition-all duration-500 cursor-pointer ${
                isSelected
                  ? "border-[#00ADB5] bg-[#00ADB5]/5"
                  : "border-[#00ADB5]/10 hover:border-[#00ADB5]/40 hover:bg-white/5"
              }`}
            >
              {isSelected && (
                <div className="absolute top-6 right-6 px-3 py-1 bg-[#00ADB5] text-[#002022] rounded-full text-[10px] font-black tracking-widest font-orbitron flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 fill-[#00ADB5] text-[#002022]" />
                  SELECTED
                </div>
              )}
              <div
                className={`w-16 h-16 rounded-xl flex items-center justify-center mb-8 border ${
                  isSelected
                    ? "bg-[#00ADB5]/10 border-[#00ADB5]/30 text-[#00ADB5]"
                    : "bg-[#242B35] border-[#3C494A] text-[#6B8090] group-hover:text-[#00ADB5] transition-colors"
                }`}
              >
                {domain.icon}
              </div>
              <h3 className="text-2xl font-bold font-orbitron mb-4 tracking-tight text-[#EEEEEE]">
                {domain.title}
              </h3>
              <p className="text-[#AABBC4] leading-relaxed mb-8 flex-grow">
                {domain.description}
              </p>
              <div
                className={`mt-auto w-full pt-6 border-t ${
                  isSelected ? "border-[#00ADB5]/20" : "border-[#3C494A]"
                }`}
              >
                <span
                  className={`text-[10px] font-dm-mono uppercase tracking-widest ${
                    isSelected ? "text-[#55d8e1]/80" : "text-[#AABBC4]/60"
                  }`}
                >
                  Active Standard: {domain.standard}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Navigation Actions */}
      <div className="flex items-center justify-between py-8 border-t border-[#3C494A]">
        <button
          onClick={onCancel}
          className="px-8 py-3 text-[#00ADB5] font-bold font-orbitron tracking-widest hover:bg-[#00ADB5]/5 rounded-lg transition-all"
        >
          CANCEL
        </button>
        <div className="flex gap-4">
          <button
            onClick={() => onNext(selectedDomain)}
            className="bg-[#00ADB5] text-[#002022] px-10 py-4 rounded-lg font-black font-orbitron tracking-widest hover:shadow-[0_0_20px_rgba(0,173,181,0.4)] transition-all flex items-center gap-2"
          >
            CONTINUE
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
