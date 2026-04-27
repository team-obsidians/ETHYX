// c:\Obsidian\Ethyx\frontend\components\profile\ProfileTabs.tsx
interface ProfileTabsProps {
  activeTab: "account" | "history";
  onTabChange: (tab: "account" | "history") => void;
}

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <div className="flex border-b border-[#3c494a]/20 bg-surface-container-low px-6">
      <button 
        onClick={() => onTabChange("account")}
        className={`px-8 py-5 font-orbitron text-sm transition-all ${
          activeTab === "account" 
            ? "text-[#00ADB5] border-b-2 border-[#00ADB5] font-bold" 
            : "text-slate-500 hover:text-slate-300"
        }`}
      >
        Account
      </button>
      <button 
        onClick={() => onTabChange("history")}
        className={`px-8 py-5 font-orbitron text-sm transition-all ${
          activeTab === "history" 
            ? "text-[#00ADB5] border-b-2 border-[#00ADB5] font-bold" 
            : "text-slate-500 hover:text-slate-300"
        }`}
      >
        History
      </button>
      <button 
        disabled
        className="px-8 py-5 text-slate-600 font-orbitron text-sm cursor-not-allowed hidden md:block"
      >
        Billing
      </button>
      <button 
        disabled
        className="px-8 py-5 text-slate-600 font-orbitron text-sm cursor-not-allowed hidden md:block"
      >
        Integrations
      </button>
    </div>
  );
}
