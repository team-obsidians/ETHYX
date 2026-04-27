import { ChevronRight } from 'lucide-react';

interface AuditLogItem {
  time: string;
  check: string;
  status: 'PASS' | 'OPTIMIZED' | 'FAIL' | 'WARNING';
}

interface AuditLogsProps {
  logs: AuditLogItem[];
}

export function AuditLogs({ logs }: AuditLogsProps) {
  const getStatusColor = (status: AuditLogItem['status']) => {
    switch (status) {
      case 'PASS':
        return 'text-[#00ADB5]';
      case 'OPTIMIZED':
        return 'text-[#10B981]';
      case 'FAIL':
        return 'text-[#EF4444]';
      case 'WARNING':
        return 'text-[#F59E0B]';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <section className="mb-24">
      <div className="flex items-center gap-4 mb-8">
        <h3 className="font-dm-sans text-xs font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">
          Audit Log Details
        </h3>
        <div className="w-full h-[1px] bg-[#00ADB5]/20"></div>
      </div>

      <div className="space-y-1">
        {logs.map((log, i) => (
          <div
            key={i}
            className="group flex justify-between items-center py-4 px-6 rounded-lg hover:bg-[#1C2128] transition-all"
          >
            <div className="flex gap-12 items-center">
              <span className="font-dm-mono text-xs text-slate-500">{log.time}</span>
              <span className="text-sm font-dm-sans tracking-wide text-[#EEEEEE]">
                {log.check}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className={`font-dm-mono text-xs ${getStatusColor(log.status)}`}>
                {log.status}
              </span>
              <ChevronRight className="text-slate-700 group-hover:text-[#00ADB5] transition-colors w-5 h-5" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
