import { format } from 'date-fns';

interface ReportHeaderProps {
  auditId: string;
  status: 'LOW RISK SIGNAL' | 'REVIEW NEEDED' | 'HIGH RISK SIGNAL' | 'AUDIT SIGNAL';
  date?: Date;
}

export function ReportHeader({ auditId, status, date = new Date() }: ReportHeaderProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'LOW RISK SIGNAL':
        return 'text-[#00ADB5]';
      case 'REVIEW NEEDED':
        return 'text-amber-500';
      case 'HIGH RISK SIGNAL':
        return 'text-red-500';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="mb-20">
      <div className="flex justify-between items-start mb-12">
        <div className="space-y-4">
          <span className="font-dm-mono text-[#00ADB5] text-xs tracking-tighter uppercase">
            Audit Identity: #{auditId.substring(0, 12).toUpperCase()}
          </span>
          <h1 className="font-orbitron text-5xl font-black text-[#EEEEEE] leading-tight tracking-tight">
            System Integrity &amp; <br />
            Bias Assessment
          </h1>
          <p className="text-slate-500 font-dm-sans font-light text-xl max-w-xl">
            A comprehensive editorial audit of the Model Neural Architecture&apos;s fairness metrics and fairness profile.
          </p>
        </div>
        <div className="text-right space-y-1">
          <p className="font-dm-mono text-[10px] text-slate-500">VERSION 3.2.0-REPOR</p>
          <p className="font-dm-mono text-[10px] text-slate-500 uppercase">
            {format(date, 'MMMM d, yyyy')}
          </p>
          <p className={`font-dm-mono text-[10px] uppercase ${getStatusColor()}`}>
            STATUS: {status}
          </p>
        </div>
      </div>
    </div>
  );
}
