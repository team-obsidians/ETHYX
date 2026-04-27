import { Maximize2, Verified } from 'lucide-react';

interface ParityDistributionProps {
  maxVariance: number;
  sampleSize: string;
}

export function ParityDistribution({ maxVariance, sampleSize }: ParityDistributionProps) {
  return (
    <section className="mb-24">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:h-[500px]">
        {/* Primary Visualization */}
        <div className="md:col-span-8 bg-[#1C2128]/50 rounded-2xl p-8 relative overflow-hidden group">
          <div className="flex justify-between items-center mb-10">
            <h4 className="font-orbitron text-xs tracking-widest text-[#EEEEEE]">
              Demographic Parity Distribution
            </h4>
            <Maximize2 className="text-[#00ADB5] w-4 h-4" />
          </div>

          {/* Mockup Graph */}
          <div className="flex items-end gap-2 h-48 mb-8 relative z-10">
            <div className="bg-[#00ADB5]/20 w-full h-[80%] rounded-t-sm transition-all group-hover:bg-[#00ADB5]/40"></div>
            <div className="bg-[#00ADB5]/20 w-full h-[65%] rounded-t-sm transition-all group-hover:bg-[#00ADB5]/40"></div>
            <div className="bg-[#00ADB5]/20 w-full h-[95%] rounded-t-sm transition-all group-hover:bg-[#00ADB5]/40"></div>
            <div className="bg-[#00ADB5] w-full h-[90%] rounded-t-sm transition-all shadow-[0_0_15px_rgba(0,173,181,0.3)]"></div>
            <div className="bg-[#00ADB5]/20 w-full h-[70%] rounded-t-sm transition-all group-hover:bg-[#00ADB5]/40"></div>
            <div className="bg-[#00ADB5]/20 w-full h-[85%] rounded-t-sm transition-all group-hover:bg-[#00ADB5]/40"></div>
            <div className="bg-[#00ADB5]/20 w-full h-[55%] rounded-t-sm transition-all group-hover:bg-[#00ADB5]/40"></div>
          </div>

          <div className="grid grid-cols-3 gap-4 relative z-10">
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-dm-sans mb-1">
                Max Variance
              </p>
              <p className="font-dm-mono text-sm text-[#00ADB5]">{maxVariance.toFixed(3)}%</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-dm-sans mb-1">
                Sample Size
              </p>
              <p className="font-dm-mono text-sm text-[#00ADB5]">{sampleSize}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-dm-sans mb-1">
                Audit Type
              </p>
              <p className="font-dm-mono text-sm text-[#00ADB5]">Deep Scan</p>
            </div>
          </div>

          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#00ADB5]/5 blur-3xl rounded-full"></div>
        </div>

        {/* Secondary Insights */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="flex-grow bg-[rgba(57,62,70,0.3)] backdrop-blur-[14px] rounded-2xl p-6 border border-white/5">
            <h4 className="font-orbitron text-[10px] tracking-widest text-[#EEEEEE] mb-6">
              Heatmap Index
            </h4>
            <div className="w-full h-32 rounded-lg relative overflow-hidden bg-gradient-to-br from-[#1C2128] to-[#00ADB5]/20">
              {/* SVG Placeholder replacing the image */}
              <svg
                className="w-full h-full opacity-40 text-[#00ADB5]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
              </svg>
            </div>
            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              Spatial distribution of decision density across the neural nodes.
            </p>
          </div>

          <div className="h-24 bg-[#00ADB5] text-[#002022] rounded-2xl p-6 flex items-center justify-between">
            <div>
              <p className="font-dm-sans text-[10px] uppercase font-black tracking-widest">
                Risk Signal
              </p>
              <p className="font-dm-mono text-xl">Low Risk Signal</p>
            </div>
            <Verified className="w-8 h-8" />
          </div>
        </div>
      </div>
    </section>
  );
}
