interface HighlightMetricsProps {
  biasIndex: number;
  parityScore: number;
  latency: number;
  riskFactor: 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';
}

export function HighlightMetrics({
  biasIndex,
  parityScore,
  latency,
  riskFactor,
}: HighlightMetricsProps) {
  const getRiskColor = () => {
    switch (riskFactor) {
      case 'LOW':
        return 'text-[#10B981]'; // success
      case 'MEDIUM':
        return 'text-[#F59E0B]'; // warning
      case 'HIGH':
        return 'text-[#EF4444]'; // danger
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
      <div className="bg-[#1C2128]/50 p-6 rounded-xl border border-[#00ADB5]/10">
        <p className="font-dm-sans text-[10px] uppercase tracking-widest text-slate-500 mb-2">
          Bias Index
        </p>
        <p className="font-dm-mono text-3xl text-[#00ADB5]">
          {biasIndex.toFixed(2)}
          <span className="text-xs ml-1 text-slate-500">μ</span>
        </p>
      </div>

      <div className="bg-[#1C2128]/50 p-6 rounded-xl border border-[#00ADB5]/10">
        <p className="font-dm-sans text-[10px] uppercase tracking-widest text-slate-500 mb-2">
          Parity Score
        </p>
        <p className="font-dm-mono text-3xl text-[#00ADB5]">
          {parityScore.toFixed(1)}
          <span className="text-xs ml-1 text-slate-500">%</span>
        </p>
      </div>

      <div className="bg-[#1C2128]/50 p-6 rounded-xl border border-[#00ADB5]/10">
        <p className="font-dm-sans text-[10px] uppercase tracking-widest text-slate-500 mb-2">
          Audit Latency
        </p>
        <p className="font-dm-mono text-3xl text-[#00ADB5]">
          {latency}
          <span className="text-xs ml-1 text-slate-500">ms</span>
        </p>
      </div>

      <div className="bg-[#1C2128]/50 p-6 rounded-xl border border-[#00ADB5]/10">
        <p className="font-dm-sans text-[10px] uppercase tracking-widest text-slate-500 mb-2">
          Risk Factor
        </p>
        <p className={`font-dm-mono text-3xl ${getRiskColor()}`}>{riskFactor}</p>
      </div>
    </div>
  );
}
