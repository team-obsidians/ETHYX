// c:\Obsidian\Ethyx\frontend\components\explain\ExplainDetailPanel.tsx
"use client";

import React, { useState } from "react";
import { ShapContributionChart } from "./ShapContributionChart";
import { CounterfactualCard } from "./CounterfactualCard";
import { PDPChart } from "./PDPChart";
import { LocalNarrativeCard } from "./LocalNarrativeCard";
import { ProtectedAttributeImpactCard } from "./ProtectedAttributeImpactCard";
import { ExplainEmptyState } from "./ExplainEmptyState";
import type { IndividualPrediction, SelectedExplanation } from "@/types/explain";

interface ExplainDetailPanelProps {
  prediction: IndividualPrediction | null;
  protectedAttributes: string[];
  selectedExplanation?: SelectedExplanation | null;
}

export function ExplainDetailPanel({ prediction, protectedAttributes, selectedExplanation }: ExplainDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<"shap" | "counterfactual" | "pdp">("shap");

  if (!prediction) {
    return (
      <div className="h-[500px] rounded-xl border border-[#00ADB5]/12 bg-[#1C2128]/80 backdrop-blur-[14px] flex flex-col items-center justify-center text-center p-6">
        <div className="w-12 h-12 rounded-full border border-[#3C494A]/50 flex items-center justify-center mb-4 text-[#6B8090]">
          🔍
        </div>
        <h3 className="font-orbitron text-sm font-bold text-[#EEEEEE] tracking-widest uppercase">
          Select a Prediction
        </h3>
        <p className="text-xs font-dm-sans text-[#6B8090] mt-2 max-w-xs">
          Choose an entity record from the table to view live explanation metrics.
        </p>
      </div>
    );
  }

  const shapData = selectedExplanation?.shap || [];
  const counterfactualData = selectedExplanation?.counterfactual || null;
  const pdpData = selectedExplanation?.pdp || [];

  return (
    <div className="space-y-6">
      {/* Top Row: Narrative & Impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LocalNarrativeCard
          entityName={prediction.entity}
          prediction={prediction.prediction}
          confidence={prediction.confidence}
          fairnessRisk={prediction.fairness_risk}
        />
        <ProtectedAttributeImpactCard
          attributes={protectedAttributes}
          fairnessRisk={prediction.fairness_risk}
        />
      </div>

      {/* Tabs Section */}
      <div className="glass-card rounded-xl border border-[#00ADB5]/12 bg-[#1C2128]/80 backdrop-blur-[14px] p-4">
        <div className="flex space-x-4 border-b border-[#3C494A]/20 pb-2 mb-6">
          {(["shap", "counterfactual", "pdp"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-orbitron text-xs font-bold tracking-widest uppercase px-4 py-2 border-b-2 transition-colors duration-200 ${
                activeTab === tab
                  ? "border-[#00ADB5] text-[#00ADB5]"
                  : "border-transparent text-[#6B8090] hover:text-[#EEEEEE]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div>
          {activeTab === "shap" && (
            shapData.length > 0 ? (
              <ShapContributionChart data={shapData} />
            ) : (
              <ExplainEmptyState 
                title="No SHAP Data Available" 
                description="SHAP contribution metrics are not calculated for this prediction model run." 
              />
            )
          )}
          {activeTab === "counterfactual" && (
            counterfactualData ? (
              <CounterfactualCard data={counterfactualData} />
            ) : (
              <ExplainEmptyState 
                title="No Counterfactual Scenarios" 
                description="No alternative scenarios were found that would alter the outcome for this record." 
              />
            )
          )}
          {activeTab === "pdp" && (
            pdpData.length > 0 ? (
              <PDPChart data={pdpData} />
            ) : (
              <ExplainEmptyState 
                title="No PDP Data Available" 
                description="Partial Dependence Plots are not computed for this assessment." 
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

