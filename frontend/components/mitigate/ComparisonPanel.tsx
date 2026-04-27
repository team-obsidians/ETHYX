import { MitigatedMetrics } from "@/types/mitigate";
import { History, Wand2 } from "lucide-react";

interface ComparisonPanelProps {
  baselineMetrics: MitigatedMetrics | null;
  mitigatedMetrics: MitigatedMetrics | null;
}

export function ComparisonPanel({ baselineMetrics, mitigatedMetrics }: ComparisonPanelProps) {
  // Use mock values if nothing is selected or still loading,
  // or return a placeholder state. For now, we'll display what we have,
  // or a default empty state if null.

  const displayBaseline = baselineMetrics || { bias_score: 0.18, accuracy: 94.2 };
  const displayMitigated = mitigatedMetrics || { bias_score: 0.0, accuracy: 0.0 };

  const isMitigated = mitigatedMetrics !== null;
  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Before / Baseline */}
      <div className="glass-card p-5 rounded-xl border-l-4 border-error/50">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold text-error uppercase tracking-widest">Baseline</span>
          <History className="text-error w-5 h-5" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black font-dm-mono">
            {displayBaseline.bias_score.toFixed(2)}
          </span>
          <span className="text-[10px] text-[#EEEEEE]/40 uppercase">Bias Score</span>
        </div>
        <div className="mt-4 pt-4 border-t border-[#EEEEEE]/5 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-[#EEEEEE]/40">Accuracy</span>
            <span className="font-dm-mono">{formatPercent(displayBaseline.accuracy)}</span>
          </div>
        </div>
      </div>

      {/* After / Mitigated */}
      <div className={`glass-card p-5 rounded-xl border-l-4 transition-all duration-300 ${isMitigated ? 'border-primary/50 bg-gradient-to-br from-[#00adb5]/5 to-transparent' : 'border-[#EEEEEE]/20 opacity-60'}`}>
        <div className="flex items-center justify-between mb-4">
          <span className={`text-[10px] font-bold uppercase tracking-widest ${isMitigated ? 'text-primary' : 'text-[#EEEEEE]/60'}`}>
            {isMitigated ? 'Mitigated' : 'Pending Selection'}
          </span>
          <Wand2 className={`w-5 h-5 ${isMitigated ? 'text-primary' : 'text-[#EEEEEE]/40'}`} />
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-black font-dm-mono ${isMitigated ? 'text-primary' : 'text-[#EEEEEE]/40'}`}>
            {isMitigated ? displayMitigated.bias_score.toFixed(2) : '--'}
          </span>
          <span className={`text-[10px] uppercase ${isMitigated ? 'text-primary/60' : 'text-[#EEEEEE]/40'}`}>
            Bias Score
          </span>
        </div>
        <div className="mt-4 pt-4 border-t border-[#EEEEEE]/5 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-[#EEEEEE]/40">Accuracy</span>
            <span className={`font-dm-mono ${isMitigated ? 'text-[#EEEEEE]' : 'text-[#EEEEEE]/40'}`}>
              {isMitigated ? formatPercent(displayMitigated.accuracy) : '--'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
