// c:\Obsidian\Ethyx\frontend\components\mitigate\CodeGenerator.tsx
interface CodeGeneratorProps {
  pythonCode: string | null;
  strategyId: string | null;
}

export function CodeGenerator({ pythonCode, strategyId }: CodeGeneratorProps) {
  const filename = strategyId ? `${strategyId}_processor.py` : 'strategy_processor.py';
  
  // Use a default placeholder if no code is provided yet
  const displayCode = pythonCode || 
`# Select a mitigation strategy to view implementation code.
# The code snippet will demonstrate how to apply the chosen
# debiasing technique to your model pipeline.
`;

  return (
    <div className="h-48 glass-card bg-[#0e141c] rounded-xl border border-[#55d8e1]/10 overflow-hidden flex flex-col">
      <div className="px-4 py-2 bg-[#1a2029] border-b border-[#55d8e1]/5 flex justify-between items-center">
        <span className="text-[10px] font-dm-mono text-primary uppercase tracking-widest">{filename}</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-error/40"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-400/40"></div>
          <div className="w-2 h-2 rounded-full bg-primary/40"></div>
        </div>
      </div>
      <div className="p-4 font-dm-mono text-[11px] leading-relaxed overflow-y-auto whitespace-pre text-[#EEEEEE]">
        {displayCode}
      </div>
    </div>
  );
}
