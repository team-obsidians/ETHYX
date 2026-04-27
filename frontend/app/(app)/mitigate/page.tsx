// c:\Obsidian\Ethyx\frontend\app\(app)\mitigate\page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { StrategyGrid } from "@/components/mitigate/StrategyGrid";
import { ComparisonPanel } from "@/components/mitigate/ComparisonPanel";
import { MitigationFlowVisualizer } from "@/components/mitigate/MitigationFlowVisualizer";
import { CodeGenerator } from "@/components/mitigate/CodeGenerator";
import { useMitigateData } from "@/hooks/useMitigateData";
import { Rocket } from "lucide-react";
import type { MitigatedMetrics } from "@/types/mitigate";

/** Bridge generic Record<string, number> → typed MitigatedMetrics */
function toMitigatedMetrics(
  raw: Record<string, number> | undefined | null
): MitigatedMetrics | null {
  if (!raw) return null;
  return {
    bias_score: raw.bias_score ?? 0,
    accuracy: raw.accuracy ?? 0,
  };
}

function MitigateContent() {
  const searchParams = useSearchParams();
  const auditId = searchParams.get("auditId");
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>("reweighing");
  const { loading, error, data } = useMitigateData(auditId);

  const handleStrategySelect = (strategyId: string) => {
    setSelectedStrategyId(strategyId);
  };

  if (!auditId) {
    return (
      <section className="px-10 py-8">
        <div className="glass-card p-8 rounded-xl text-center">
          <p className="text-[#AABBC4] font-dm-sans">
            No audit selected. Please navigate from the dashboard or provide an
            auditId in the URL.
          </p>
        </div>
      </section>
    );
  }

  const selectedStrategy = data?.strategies?.find(
    (s) => s.id === selectedStrategyId
  );

  return (
    <>
      {/* Header Section */}
      <section className="px-10 py-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-orbitron text-4xl font-black tracking-tight text-[#EEEEEE]">
              BIAS <span className="text-primary">MITIGATION</span>
            </h2>
            <p className="text-[#EEEEEE]/50 mt-2 font-dm-sans text-sm max-w-xl">
              Applying debiasing algorithms to the current model state. Select a
              strategy to preview its impact on fairness metrics and predictive
              performance.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="glass-card px-4 py-2 rounded-lg flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-widest text-[#EEEEEE]/40">
                Audit ID
              </span>
              <span className="font-dm-mono text-primary">
                {auditId.slice(0, 8)}…
              </span>
            </div>
          </div>
        </div>
        {error && (
          <div className="mt-4 p-3 bg-error/20 border border-error/50 rounded-lg text-error text-sm">
            {error}
          </div>
        )}
      </section>

      {/* Split Content Area */}
      <section className="flex-1 px-10 pb-8 flex gap-8 overflow-hidden">
        {/* Left Side: Strategy Grid (45%) */}
        <div className="w-[45%] flex flex-col gap-6 overflow-y-auto pr-2 relative">
          {loading && (
            <div className="absolute inset-0 bg-[#0e141c]/50 backdrop-blur-sm z-20 flex items-center justify-center rounded-xl">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          )}
          <StrategyGrid
            selectedStrategyId={selectedStrategyId}
            onSelect={handleStrategySelect}
            targetAttribute="Protected_Class_01"
            fairnessMetric="Statistical Parity Difference"
          />
        </div>

        {/* Right Side: Comparison Panel (55%) */}
        <div className="w-[55%] flex flex-col gap-6 relative">
          {loading && (
            <div className="absolute inset-0 bg-[#0e141c]/50 backdrop-blur-sm z-20 flex items-center justify-center rounded-xl" />
          )}

          <ComparisonPanel
            baselineMetrics={toMitigatedMetrics(data?.current_metrics)}
            mitigatedMetrics={toMitigatedMetrics(selectedStrategy?.metrics_after)}
          />

          <MitigationFlowVisualizer />

          <CodeGenerator
            pythonCode={selectedStrategy?.python_code || null}
            strategyId={selectedStrategyId}
          />

          {/* Action Bar */}
          <div className="mt-auto flex gap-4">
            <button
              className="flex-1 bg-primary hover:bg-primary-container text-on-primary-fixed font-orbitron font-bold py-4 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,173,181,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !data}
            >
              <Rocket className="w-5 h-5" />
              DEPLOY MITIGATED MODEL
            </button>
            <button className="px-8 bg-transparent border border-[#55d8e1]/40 text-primary font-orbitron font-bold py-4 rounded-lg hover:bg-primary/5 transition-colors">
              EXPORT REPORT
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default function MitigatePage() {
  return (
    <Suspense
      fallback={
        <section className="px-10 py-8">
          <div className="animate-pulse glass-card p-8 rounded-xl h-32" />
        </section>
      }
    >
      <MitigateContent />
    </Suspense>
  );
}
