export function ExecutiveSummary() {
  return (
    <section className="mb-24 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">
      <div className="md:col-span-4">
        <h3 className="font-dm-sans text-xs font-bold uppercase tracking-widest text-slate-500 border-l-2 border-[#00ADB5] pl-4 py-1">
          Executive Summary
        </h3>
      </div>
      <div className="md:col-span-8">
        <div className="prose prose-invert max-w-none">
          <p className="text-[#EEEEEE] leading-relaxed font-light text-lg mb-6">
            This dossier presents a rigorous verification of the &quot;Obsidian Lens&quot; audit protocol as applied to the core AI reasoning engine. Our analysis objective was the exhaustive identification of latent demographic disparities and statistical anomalies within the underlying decision-making framework, ensuring maximum bias-neutrality and data integrity.
          </p>
          <p className="text-[#00ADB5] leading-relaxed font-dm-mono text-sm border-l-2 border-[#00ADB5]/30 pl-4 mb-6">
            Audit ID: AUTH-{Math.random().toString(36).substring(7).toUpperCase()} // Integrity Checksum Verified
          </p>
          <p className="text-slate-400 leading-relaxed font-light text-base italic">
            &quot;In the pursuit of digital neutrality, the silence of data is often where the loudest biases reside. Our mission is to amplify that silence into actionable trust.&quot;
          </p>
        </div>
      </div>
    </section>
  );
}
