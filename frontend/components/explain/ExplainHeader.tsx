// c:\Obsidian\Ethyx\frontend\components\explain\ExplainHeader.tsx
"use client";

import React from "react";
import { Shield, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { AuditMeta } from "@/types/explain";

interface ExplainHeaderProps {
  audit: AuditMeta | null;
}

export function ExplainHeader({ audit }: ExplainHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-[#3C494A]/30 pb-8 mb-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="p-2 rounded-lg bg-[#1C2128] border border-[#3C494A]/50 text-[#AABBC4] hover:text-[#55d8e1] hover:border-[#55d8e1]/50 transition-all"
          aria-label="Back to Dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-orbitron text-2xl font-black tracking-wide text-[#EEEEEE]">
              EXPLAINABILITY
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-orbitron font-bold tracking-widest bg-[#00ADB5]/10 border border-[#00ADB5]/30 text-[#55d8e1] uppercase">
              {audit?.domain || "Audits"}
            </span>
          </div>
          <p className="text-[#AABBC4] text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#00ADB5]" />
            {audit?.file_name || "Loading dataset..."}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden md:block">
          <span className="text-[10px] font-orbitron text-[#AABBC4] block mb-1 tracking-widest">
            STATUS
          </span>
          <span className="text-sm font-dm-mono font-bold text-[#55d8e1] uppercase">
            {audit?.status || "Unknown"}
          </span>
        </div>
      </div>
    </div>
  );
}
