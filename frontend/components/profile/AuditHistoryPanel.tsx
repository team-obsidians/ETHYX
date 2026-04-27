// c:\Obsidian\Ethyx\frontend\components\profile\AuditHistoryPanel.tsx
import {
  ArrowRight,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";

import type { Audit, AuditStatus } from "@/types/dashboard";

interface AuditHistoryPanelProps {
  recentAudits: Audit[];
}

export function AuditHistoryPanel({ recentAudits }: AuditHistoryPanelProps) {
  const getStatusIcon = (status: AuditStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-[#10B981]" />;
      case "failed":
      case "timeout":
        return <AlertCircle className="w-4 h-4 text-[#EF4444]" />;
      case "analyzing":
        return <Activity className="w-4 h-4 text-[#00ADB5]" />;
      default:
        return <Clock className="w-4 h-4 text-[#F59E0B]" />;
    }
  };

  const getRiskColor = (score: number | null) => {
    if (score === null) return "text-slate-500";
    if (score < 30) return "text-[#10B981]";
    if (score < 70) return "text-[#F59E0B]";
    return "text-[#EF4444]";
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h4 className="font-orbitron text-sm text-[#00ADB5] uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#00ADB5] rounded-full" /> Recent
          Activity
        </h4>
        <Link
          href="/upload"
          className="bg-[#00ADB5]/10 border border-[#00ADB5]/20 text-[#00ADB5] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#00ADB5]/20 transition-all active:scale-98"
        >
          New Audit
        </Link>
      </div>

      {recentAudits.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-highest/30 rounded-xl border border-dashed border-[#3c494a]/30">
          <Activity className="w-8 h-8 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 font-dm-mono text-sm">
            No audit history found.
          </p>
          <Link
            href="/upload"
            className="inline-block mt-4 text-[#00ADB5] text-sm hover:underline"
          >
            Start your first analysis
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#3c494a]/30">
                <th className="pb-4 pl-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  ID / Date
                </th>
                <th className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Domain
                </th>
                <th className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Status
                </th>
                <th className="pb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Risk Score
                </th>
                <th className="pb-4 pr-4 text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3c494a]/10">
              {recentAudits.map((audit) => (
                <tr
                  key={audit.id}
                  className="hover:bg-surface-container-highest/20 transition-colors group"
                >
                  <td className="py-4 pl-4">
                    <p className="text-sm font-dm-mono text-[#dde3ef]">
                      {audit.id.slice(0, 8)}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {new Date(audit.created_at).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="py-4">
                    <span className="bg-surface-container-highest px-2 py-1 rounded text-xs text-slate-300 capitalize border border-[#3c494a]/20">
                      {audit.domain}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(audit.status)}
                      <span className="text-xs text-slate-300 capitalize">
                        {audit.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4">
                    {audit.status === "completed" &&
                    audit.risk_score !== null ? (
                      <span
                        className={`font-dm-mono text-sm font-bold ${getRiskColor(audit.risk_score)}`}
                      >
                        {Math.round(audit.risk_score)}
                      </span>
                    ) : (
                      <span className="text-slate-600 text-sm">—</span>
                    )}
                  </td>
                  <td className="py-4 pr-4 text-right">
                    {audit.status === "completed" ? (
                      <Link
                        href={`/dashboard?auditId=${audit.id}`}
                        className="inline-flex items-center gap-1 text-[#00ADB5] text-xs font-bold hover:text-cyan-300 transition-colors"
                      >
                        View{" "}
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ) : (
                      <span className="text-slate-600 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
