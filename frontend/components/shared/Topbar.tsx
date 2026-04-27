"use client";

import { usePathname } from "next/navigation";
import { Bell, HelpCircle } from "lucide-react";
import Link from "next/link";

const routeNames: Record<string, string> = {
  "/dashboard": "Technical Dashboard",
  "/upload": "Upload Wizard",
  "/explain": "Model Explanations",
  "/mitigate": "Mitigation Strategies",
  "/report": "Audit Report",
  "/profile": "User Profile",
};

export function Topbar() {
  const pathname = usePathname();
  const basePath = "/" + (pathname?.split("/")[1] || "dashboard");
  const title = routeNames[basePath] || "Overview";

  return (
    <header className="fixed top-0 right-0 w-full lg:w-[calc(100%-240px)] h-[56px] bg-[#0e141c]/80 backdrop-blur-md flex justify-between items-center px-4 lg:px-8 z-40 border-b border-[#1a2029]">
      <div className="flex items-center gap-4 lg:gap-6">
        <span className="text-[#00ADB5] font-medium text-sm font-dm-sans">{title}</span>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="text-[#EEEEEE]/70 hover:text-[#00ADB5] transition-colors flex items-center gap-2 text-sm font-medium">
          <HelpCircle className="w-5 h-5" />
          Need help?
        </button>
        <button className="text-[#EEEEEE]/70 hover:text-[#00ADB5] transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <Link href="/profile" className="h-8 w-8 rounded-full bg-[#00ADB5]/20 border border-[#00ADB5]/30 flex items-center justify-center hover:scale-105 transition-transform">
          <span className="text-[10px] font-bold text-[#00ADB5]">EX</span>
        </Link>
      </div>
    </header>
  );
}
