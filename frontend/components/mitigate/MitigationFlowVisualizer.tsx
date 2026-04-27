// c:\Obsidian\Ethyx\frontend\components\mitigate\MitigationFlowVisualizer.tsx
export function MitigationFlowVisualizer() {
  return (
    <div className="flex-1 glass-card p-6 rounded-xl flex flex-col min-h-[250px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-orbitron text-sm uppercase tracking-widest font-bold">Mitigation Impact Flow</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-error"></div>
            <span className="text-[10px] text-[#EEEEEE]/40 uppercase tracking-tighter">Negative Impact</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className="text-[10px] text-[#EEEEEE]/40 uppercase tracking-tighter">Positive Impact</span>
          </div>
        </div>
      </div>
      
      {/* Abstract Data Visualization */}
      <div className="flex-1 flex gap-8">
        <div className="flex-1 relative flex flex-col justify-around py-4">
          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#EEEEEE]/20 to-transparent"></div>
          
          {/* Row 1: GRP_A */}
          <div className="flex justify-between items-center relative z-10">
            <span className="text-[10px] font-dm-mono text-[#EEEEEE]/40 bg-[#0e141c]/50 pr-2">GRP_A</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded-sm bg-error/40 animate-pulse"></div>
              <div className="w-4 h-4 rounded-sm bg-error/40"></div>
              <div className="w-4 h-4 rounded-sm bg-error/40"></div>
              <div className="w-4 h-4 rounded-sm bg-primary/40"></div>
            </div>
            
            <div className="w-12 h-[1px] bg-primary/20 relative">
              <div className="absolute inset-0 bg-primary/40 shadow-[0_0_8px_rgba(85,216,225,0.6)] w-1/2 animate-ping"></div>
            </div>
            
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded-sm bg-error/20 border border-error/50"></div>
              <div className="w-4 h-4 rounded-sm bg-primary/40"></div>
              <div className="w-4 h-4 rounded-sm bg-primary/40"></div>
              <div className="w-4 h-4 rounded-sm bg-primary/40"></div>
            </div>
          </div>
          
          {/* Row 2: GRP_B */}
          <div className="flex justify-between items-center relative z-10">
            <span className="text-[10px] font-dm-mono text-[#EEEEEE]/40 bg-[#0e141c]/50 pr-2">GRP_B</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded-sm bg-primary/40"></div>
              <div className="w-4 h-4 rounded-sm bg-primary/40"></div>
              <div className="w-4 h-4 rounded-sm bg-primary/40"></div>
              <div className="w-4 h-4 rounded-sm bg-primary/40"></div>
            </div>
            
            <div className="w-12 h-[1px] bg-primary/20"></div>
            
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded-sm bg-primary/40"></div>
              <div className="w-4 h-4 rounded-sm bg-primary/40"></div>
              <div className="w-4 h-4 rounded-sm bg-primary/40"></div>
              <div className="w-4 h-4 rounded-sm bg-primary/40"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
