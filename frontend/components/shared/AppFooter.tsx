// c:\Obsidian\Ethyx\frontend\components\shared\AppFooter.tsx
export function AppFooter() {
  return (
    <footer className="mt-auto py-6 px-8 border-t border-[#1a2029] bg-[#0e141c]/50 backdrop-blur-sm z-20">
      <div className="flex flex-wrap justify-between items-center gap-4 text-[10px] text-[#AABBC4]/40 font-dm-mono uppercase tracking-widest leading-relaxed">
        <div>
          System Integrity: <span className="text-[#10B981]">Verified</span>
        </div>
        <div className="hidden md:block">
          Audit Hash: <span className="text-[#00ADB5]">0x8F9A...3B2C</span>
        </div>
        <div>
          Engine: V2.4.1
        </div>
      </div>
    </footer>
  );
}
