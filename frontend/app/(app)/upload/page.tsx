"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { Step1Domain } from "@/components/upload/Step1Domain";
import { Step2Source } from "@/components/upload/Step2Source";
import { Step3Review } from "@/components/upload/Step3Review";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [domain, setDomain] = useState<string>("hiring");
  const [auditId, setAuditId] = useState<string>("");
  const router = useRouter();

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderProgressBar = () => {
    if (currentStep === 1) {
      // Large progress bar for step 1
      return (
        <div className="mb-16 flex items-center justify-center">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#00ADB5] flex items-center justify-center text-[#002022] font-bold ring-4 ring-[#00ADB5]/20">
                1
              </div>
              <span className="text-[10px] font-orbitron tracking-widest text-[#00ADB5]">
                DOMAIN
              </span>
            </div>
            <div className="w-24 h-[2px] bg-[#3C494A] mb-6"></div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#2F353E] border border-[#3C494A] flex items-center justify-center text-[#AABBC4] font-bold">
                2
              </div>
              <span className="text-[10px] font-orbitron tracking-widest text-[#AABBC4]">
                SOURCE
              </span>
            </div>
            <div className="w-24 h-[2px] bg-[#3C494A] mb-6"></div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#2F353E] border border-[#3C494A] flex items-center justify-center text-[#AABBC4] font-bold">
                3
              </div>
              <span className="text-[10px] font-orbitron tracking-widest text-[#AABBC4]">
                REVIEW
              </span>
            </div>
          </div>
        </div>
      );
    }

    // Compact progress bar for steps 2 and 3
    return (
      <div className="flex items-center justify-between mb-10 px-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep > 1
                ? "bg-[#00ADB5]/20 border border-[#00ADB5] text-[#55d8e1]"
                : "bg-[#00ADB5] text-[#002022] shadow-[0_0_15px_rgba(85,216,225,0.4)]"
            }`}
          >
            {currentStep > 1 ? (
              <Check className="w-4 h-4" />
            ) : (
              <span className="text-xs font-black font-orbitron">01</span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-orbitron text-[10px] tracking-widest text-[#55d8e1]">
              {currentStep > 1 ? "STEP 01" : "ACTIVE"}
            </span>
            <span className="text-xs font-bold text-[#EEEEEE]">
              Project Config
            </span>
          </div>
        </div>
        <div
          className={`flex-1 h-[1px] mx-6 ${
            currentStep > 1
              ? "bg-gradient-to-r from-[#00adb5] to-[#393e46]/30"
              : "bg-[#393e46]/30"
          }`}
        ></div>

        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep > 2
                ? "bg-[#00ADB5]/20 border border-[#00ADB5] text-[#55d8e1]"
                : currentStep === 2
                ? "bg-[#00ADB5] text-[#002022] shadow-[0_0_15px_rgba(85,216,225,0.4)]"
                : "bg-[#393e46] text-[#EEEEEE]"
            }`}
          >
            {currentStep > 2 ? (
              <Check className="w-4 h-4" />
            ) : (
              <span className="text-xs font-black font-orbitron">02</span>
            )}
          </div>
          <div className="flex flex-col">
            <span
              className={`font-orbitron text-[10px] tracking-widest ${
                currentStep >= 2 ? "text-[#55d8e1]" : "text-[#AABBC4]"
              }`}
            >
              {currentStep > 2
                ? "STEP 02"
                : currentStep === 2
                ? "ACTIVE"
                : "PENDING"}
            </span>
            <span className="text-xs font-bold text-[#EEEEEE]">
              Dataset Upload
            </span>
          </div>
        </div>
        <div
          className={`flex-1 h-[1px] mx-6 ${
            currentStep > 2
              ? "bg-gradient-to-r from-[#00adb5] to-[#393e46]/30"
              : "bg-[#393e46]/30"
          }`}
        ></div>

        <div
          className={`flex items-center gap-3 ${
            currentStep < 3 ? "opacity-40" : ""
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === 3
                ? "bg-[#00ADB5] text-[#002022] shadow-[0_0_15px_rgba(85,216,225,0.4)]"
                : "bg-[#393e46] text-[#EEEEEE]"
            }`}
          >
            <span className="text-xs font-black font-orbitron">03</span>
          </div>
          <div className="flex flex-col">
            <span
              className={`font-orbitron text-[10px] tracking-widest ${
                currentStep === 3 ? "text-[#55d8e1]" : ""
              }`}
            >
              {currentStep === 3 ? "ACTIVE" : "PENDING"}
            </span>
            <span className="text-xs font-bold text-[#EEEEEE]">
              Bias Analysis
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-8 lg:px-12">
      {renderProgressBar()}

      <div className="mt-8 relative z-10">
        {currentStep === 1 && (
          <Step1Domain
            onNext={(d: string) => { setDomain(d); setCurrentStep(2); }}
            onCancel={() => router.push("/dashboard")}
          />
        )}
        {currentStep === 2 && (
          <Step2Source domain={domain} onNext={(id: string) => { setAuditId(id); setCurrentStep(3); }} onBack={handlePrevStep} />
        )}
        {currentStep === 3 && (
          <Step3Review 
            auditId={auditId} 
            onAnalysisComplete={() => router.push(`/dashboard?auditId=${auditId}`)} 
          />
        )}
      </div>

      {/* Background Decoration Elements */}
      <div className="fixed top-[15%] right-[-10%] w-[400px] h-[400px] bg-[#00adb5] rounded-full blur-[160px] opacity-[0.05] pointer-events-none -z-10"></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-[#00adb5] rounded-full blur-[140px] opacity-[0.03] pointer-events-none -z-10"></div>
    </div>
  );
}
