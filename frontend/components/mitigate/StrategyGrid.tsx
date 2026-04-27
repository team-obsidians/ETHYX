"use client";

import React from "react";
import { Scale, ShieldAlert, Filter, ListChecks } from "lucide-react";

interface StrategyOption {
  id: string;
  title: string;
  description: string;
  latency: string;
  phase: "Pre-processing" | "In-processing" | "Post-processing";
  icon: React.ReactNode;
}

const STRATEGIES: StrategyOption[] = [
  {
    id: "reweighing",
    title: "Reweighing",
    description: "Weights training samples differently to ensure fairness across demographic groups before model training.",
    latency: "+12ms",
    phase: "Pre-processing",
    icon: <Scale className="w-5 h-5" />
  },
  {
    id: "adversarial",
    title: "Adversarial",
    description: "Trains a model to optimize for performance while minimizing the ability to predict sensitive attributes.",
    latency: "+85ms",
    phase: "In-processing",
    icon: <ShieldAlert className="w-5 h-5" />
  },
  {
    id: "dir",
    title: "DIR Filter",
    description: "Edits feature values so the ability to predict the label from the data is independent of group membership.",
    latency: "+5ms",
    phase: "Pre-processing",
    icon: <Filter className="w-5 h-5" />
  },
  {
    id: "equalized_odds",
    title: "Equalized Odds",
    description: "Modifies the predicted labels of the model to optimize for equal false positive and negative rates.",
    latency: "+2ms",
    phase: "Post-processing",
    icon: <ListChecks className="w-5 h-5" />
  }
];

interface StrategyGridProps {
  selectedStrategyId: string;
  onSelect: (strategyId: string) => void;
  targetAttribute?: string;
  fairnessMetric?: string;
}

export function StrategyGrid({
  selectedStrategyId,
  onSelect,
  targetAttribute = "Protected_Class_01",
  fairnessMetric = "Statistical Parity Difference"
}: StrategyGridProps) {
  return (
    <div className="flex flex-col gap-6 h-full pr-2">
      <div className="grid grid-cols-2 gap-4">
        {STRATEGIES.map((strategy) => {
          const isSelected = strategy.id === selectedStrategyId;

          return (
            <div
              key={strategy.id}
              onClick={() => onSelect(strategy.id)}
              className={`glass-card p-6 rounded-xl relative group transition-all duration-300 cursor-pointer ${
                isSelected ? "ring-2 ring-[#00ADB5] glow-teal" : "hover:bg-[#393e46]/40"
              }`}
            >
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-[#00ADB5] text-[#002022] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  SELECTED
                </div>
              )}
              
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    isSelected
                      ? "bg-[#00ADB5]/20 text-[#00ADB5]"
                      : "bg-[#EEEEEE]/10 text-[#EEEEEE]/60 group-hover:text-[#00ADB5]"
                  }`}
                >
                  {strategy.icon}
                </div>
                <span
                  className={`font-dm-mono text-xs ${
                    isSelected ? "text-[#00ADB5]" : "text-[#EEEEEE]/40"
                  }`}
                >
                  LATENCY: {strategy.latency}
                </span>
              </div>
              
              <h3 className="font-orbitron font-bold text-lg mb-2">{strategy.title}</h3>
              <p className="text-xs text-[#EEEEEE]/60 mb-4 h-[48px] overflow-hidden">{strategy.description}</p>
              
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-[#EEEEEE]/5 rounded text-[10px] text-[#EEEEEE]/40 uppercase tracking-tighter">
                  {strategy.phase}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Metrics Overview */}
      <div className="glass-card p-6 rounded-xl mt-auto">
        <h4 className="font-orbitron text-sm uppercase tracking-widest text-[#00ADB5] mb-4">
          Strategy Parameters
        </h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#EEEEEE]/60">Target Attribute</span>
            <span className="text-xs font-bold text-[#EEEEEE]">{targetAttribute}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#EEEEEE]/60">Fairness Metric</span>
            <span className="text-xs font-bold text-[#EEEEEE]">{fairnessMetric}</span>
          </div>
          
          <div className="w-full bg-[#393e46]/40 h-[1px]"></div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] text-[#EEEEEE]/40 mb-1 uppercase tracking-tighter">
              <span>Optimization Intensity</span>
              <span className="font-dm-mono text-[#00ADB5]">0.85</span>
            </div>
            <div className="h-1 w-full bg-[#EEEEEE]/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#00ADB5] w-[85%]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
