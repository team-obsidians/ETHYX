// c:\Obsidian\Ethyx\frontend\app\(app)\explain\page.tsx
"use client";

// 1. React and Next.js imports
import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// 2. External library imports (none)

// 3. Internal component imports
import { ExplainHeader } from "@/components/explain/ExplainHeader";
import { PredictionTable } from "@/components/explain/PredictionTable";
import { ExplainDetailPanel } from "@/components/explain/ExplainDetailPanel";

// 4. Utility and type imports
import { useExplainData } from "@/hooks/useExplainData";
import type { IndividualPrediction } from "@/types/explain";

function ExplainContent() {
  const searchParams = useSearchParams();
  const auditId = searchParams.get("auditId");
  
  const { data, loading, error } = useExplainData(auditId);
  const [selectedRow, setSelectedRow] = useState<IndividualPrediction | null>(null);

  if (!auditId) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center font-dm-sans">
        <div className="text-4xl mb-4">📊</div>
        <h2 className="text-xl font-orbitron font-bold text-[#EEEEEE] tracking-wider uppercase">
          No Audit ID Provided
        </h2>
        <p className="text-sm text-[#6B8090] mt-2 max-w-md">
          Please select an active bias audit from the dashboard to inspect individual prediction explainability metrics.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#00ADB5]"></div>
        <span className="text-xs font-orbitron text-[#AABBC4] mt-4 tracking-widest uppercase">
          Loading Audit Data...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center font-dm-sans">
        <div className="text-4xl mb-4 text-[#EF4444]">⚠️</div>
        <h2 className="text-xl font-orbitron font-bold text-[#EF4444] tracking-wider uppercase">
          Error Loading Data
        </h2>
        <p className="text-sm text-[#6B8090] mt-2 max-w-md">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <ExplainHeader
        audit={data.audit}
      />

      {/* Asymmetric workstation layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: Entity Predictions Table */}
        <div className="xl:col-span-5">
          <PredictionTable
            rows={data.rows}
            selectedId={selectedRow?.id || null}
            onSelectRow={(id) => {
              const found = data.rows.find(r => r.id === id);
              setSelectedRow(found || null);
            }}
          />
        </div>

        {/* Right: Explainability Metrics Workspace */}
        <div className="xl:col-span-7">
          <ExplainDetailPanel
            prediction={selectedRow}
            protectedAttributes={data.audit.protected_attributes}
            selectedExplanation={data.selected_explanation}
          />
        </div>
      </div>
    </div>
  );
}

export default function ExplainPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00ADB5]"></div>
        </div>
      }
    >
      <ExplainContent />
    </Suspense>
  );
}
