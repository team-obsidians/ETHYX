"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, UploadCloud, Eye, Wand2, FileBarChart, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { EthyxLogo } from "./EthyxLogo";

const navItems = [
  { name: "Upload", href: "/upload", icon: UploadCloud },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Explain", href: "/explain", icon: Eye },
  { name: "Mitigate", href: "/mitigate", icon: Wand2 },
  { name: "Report", href: "/report", icon: FileBarChart },
  { name: "Profile", href: "/profile", icon: UserCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-[240px] h-full fixed left-0 top-0 bg-[#1C2128] flex-col justify-between py-6 z-50 border-r border-[#1a2029]">
      <div className="px-6">
        <div className="mb-10">
          <EthyxLogo className="text-xl" />
          <p className="text-[10px] text-[#00ADB5]/60 tracking-[0.3em] font-dm-mono mt-1 uppercase">Obsidian Lens</p>
        </div>
        
        <nav className="space-y-1 relative">
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 transition-colors duration-300 rounded-lg group relative",
                  isActive ? "text-[#00ADB5] font-bold" : "text-[#EEEEEE]/60 hover:text-[#EEEEEE] hover:bg-[#393e46]/30"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute inset-0 bg-[#393e46]/30 rounded-l-lg border-l-2 border-[#00ADB5]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className="w-5 h-5 relative z-10" />
                <span className="font-medium text-sm relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* System Integrity moved to AppFooter */}
    </aside>
  );
}
