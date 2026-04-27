// c:\Obsidian\Ethyx\frontend\components\profile\ProfileHero.tsx
import { User, ShieldCheck, MapPin } from "lucide-react";
import type { AuthProfile } from "@/types/profile";

interface ProfileHeroProps {
  profile: AuthProfile | null;
}

export function ProfileHero({ profile }: ProfileHeroProps) {
  const displayName = profile?.fullName || "Ethyx User";
  const orgName = profile?.organization || "Independent Auditor";

  return (
    <section className="mb-12 relative overflow-hidden rounded-2xl bg-surface-container-low/50 backdrop-blur-xl p-10 border border-[#00ADB5]/10">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#00ADB5]/5 to-transparent" />

      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        <div className="relative">
          <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-[#00ADB5]/20 shadow-[0_0_30px_rgba(0,173,181,0.1)] flex items-center justify-center bg-surface-container-highest">
            <User className="w-16 h-16 text-[#00ADB5]/50" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-[#00ADB5] text-[#002022] text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-tighter">
            Verified
          </div>
        </div>

        <div className="text-center md:text-left">
          <h3 className="font-orbitron text-3xl font-black text-[#dde3ef] mb-2">
            {displayName}
          </h3>
          <p className="font-dm-mono text-[#00ADB5] text-sm mb-4 tracking-wide">
            {orgName} • {profile?.email}
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="flex items-center gap-2 bg-surface-container-highest px-3 py-1.5 rounded-lg border border-[#3c494a]/30 text-xs">
              <ShieldCheck className="w-4 h-4 text-[#00ADB5]" />
              <span className="font-dm-mono text-slate-300">
                {profile?.plan ?? "FREE PLAN"}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-surface-container-highest px-3 py-1.5 rounded-lg border border-[#3c494a]/30 text-xs">
              <MapPin className="w-4 h-4 text-[#00ADB5]" />
              <span className="font-dm-mono text-slate-300">Remote</span>
            </div>
          </div>
        </div>

        <div className="md:ml-auto flex gap-3">
          <button className="bg-surface-container-highest border border-[#00ADB5]/20 px-6 py-2.5 rounded-lg text-[#00ADB5] text-sm font-bold hover:bg-[#00ADB5]/5 transition-all active:scale-98">
            Edit Profile
          </button>
        </div>
      </div>
    </section>
  );
}
