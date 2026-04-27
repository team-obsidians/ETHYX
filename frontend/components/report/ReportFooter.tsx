interface ReportFooterProps {
  onDownloadPdf: () => void;
  onShare: () => void;
  status: 'LOW RISK SIGNAL' | 'REVIEW NEEDED' | 'HIGH RISK SIGNAL' | 'AUDIT SIGNAL';
  isDownloading?: boolean;
}

export function ReportFooter({ onDownloadPdf, onShare, status, isDownloading }: ReportFooterProps) {
  const getRecommendation = () => {
    switch (status) {
      case 'LOW RISK SIGNAL':
        return 'The Target Model exhibits statistical parity within the established Obsidian Lens tolerance thresholds. No critical disparities detected. We recommend immediate live-deployment with a bi-weekly automated audit interval for sustained fairness verification.';
      case 'REVIEW NEEDED':
        return 'System verification complete with marginal variance detected in secondary feature clusters. While operational, we recommend immediate recalibration of the identified weighting vectors before proceeding to full-scale deployment.';
      case 'HIGH RISK SIGNAL':
        return 'CRITICAL DISPARITY DETECTED. The model architecture violates core fairness constraints. We strongly advise a total deployment halt and immediate application of the suggested mitigation strategies to avoid ethical liability.';
      default:
        return 'Audit is pending or in an indeterminate state. Please initiate a full deep-scan to generate a verified recommendation dossier.';
    }
  };

  return (
    <section className="bg-[#1C2128]/80 border border-[#00ADB5]/10 rounded-3xl p-12 mb-24 relative overflow-hidden">
      <div className="relative z-10">
        <h3 className="font-orbitron text-2xl text-[#EEEEEE] mb-6">
          Final Auditor Recommendation
        </h3>
        <p className="text-slate-400 font-light leading-relaxed mb-8 max-w-2xl">
          {getRecommendation()}
        </p>

        <p className="text-xs text-slate-500 font-dm-sans mb-8 max-w-2xl">
          This report is an analytical aid and not a legal certification.
        </p>

        <div className="flex gap-4">
          <button
            onClick={onDownloadPdf}
            disabled={isDownloading}
            className="bg-[#00ADB5] text-[#002022] px-8 py-3 rounded-lg font-dm-sans text-sm font-bold hover:scale-[0.98] active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isDownloading ? 'Generating PDF...' : 'Download PDF Report'}
          </button>
          <button
            onClick={onShare}
            className="border border-[#00ADB5]/40 text-[#00ADB5] px-8 py-3 rounded-lg font-dm-sans text-sm font-bold hover:bg-[#00ADB5]/5 transition-all"
          >
            Share Audit Link
          </button>
        </div>
      </div>
      <div className="absolute right-0 top-0 w-[240px] h-full bg-gradient-to-l from-[#00ADB5]/10 to-transparent pointer-events-none"></div>
    </section>
  );
}
