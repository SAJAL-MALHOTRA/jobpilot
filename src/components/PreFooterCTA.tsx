import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Mail, Zap, Terminal } from 'lucide-react';

interface PreFooterCTAProps {
  onLaunchRadar: () => void;
  onOpenOutreach: () => void;
  onOpenPortfolio: () => void;
}

export const PreFooterCTA: React.FC<PreFooterCTAProps> = ({
  onLaunchRadar,
  onOpenOutreach,
  onOpenPortfolio,
}) => {
  const [quickQuery, setQuickQuery] = useState('');

  const PROMPT_PILLS = [
    'Founding AI Engineer in Indiranagar',
    'Lead Backend with 60-day notice buyout',
    'YC W24 Full Stack ($130k+ / ₹60 LPA)',
    'Distributed Systems in Koramangala',
  ];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#22273B] bg-gradient-to-b from-[#121522] via-[#0D0F17] to-[#08090E] p-8 sm:p-12 text-center shadow-2xl">
      {/* Ambient Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-[#6366F1]/15 to-transparent blur-3xl pointer-events-none" />

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 jp-mesh-grid opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181C2C] border border-[#272E47] text-xs font-mono text-[#A3A8BD] shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>Autonomous Startup Reverse Recruiter</span>
          <span className="text-[#4E546C]">•</span>
          <span className="text-[#10B981] font-semibold">Ready for Deployment</span>
        </div>

        {/* Main Headline */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
          Stop applying into ATS voids. <br />
          <span className="bg-gradient-to-r from-white via-neutral-200 to-indigo-300 bg-clip-text text-transparent">
            Launch your autonomous recruiter.
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-[#8C93A8] max-w-xl mx-auto leading-relaxed font-sans">
          Index unadvertised seed roles across Indiranagar, Koramangala, and YC cohorts. Dispatch 4-part cold emails directly to founders and let our background agent track your pipeline via Gmail.
        </p>

        {/* Interactive Prompt Dispatch Bar */}
        <div className="pt-2 max-w-xl mx-auto">
          <div className="p-1.5 rounded-2xl bg-[#080A10] border border-[#22273B] shadow-inner flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 w-full text-left">
              <Terminal className="w-4 h-4 text-[#6366F1] shrink-0" />
              <input
                type="text"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="What role, startup, or tech stack are you looking for?"
                className="bg-transparent text-xs text-white placeholder-[#5A6178] focus:outline-none w-full font-mono"
              />
            </div>
            <button
              onClick={onLaunchRadar}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shrink-0 group"
            >
              <span>Explore Roles</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Quick Preset Pills */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-mono">
            <span className="text-[#646B82] mr-1">Trending queries:</span>
            {PROMPT_PILLS.map((pill) => (
              <button
                key={pill}
                onClick={() => {
                  setQuickQuery(pill);
                  onLaunchRadar();
                }}
                className="px-2.5 py-1 rounded-full bg-[#131624] hover:bg-[#1C2033] border border-[#21263A] text-[#A3A8BD] hover:text-white transition-colors"
              >
                {pill}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onLaunchRadar}
            className="px-6 py-3 rounded-full bg-white hover:bg-neutral-200 text-black font-bold text-sm transition-all shadow-xl flex items-center gap-2"
          >
            <span>Launch Live Radar</span>
            <span>→</span>
          </button>

          <button
            onClick={onOpenOutreach}
            className="px-6 py-3 rounded-full bg-[#161928] hover:bg-[#20253B] border border-[#272D45] text-white font-semibold text-sm transition-all flex items-center gap-2 shadow-md"
          >
            <Mail className="w-4 h-4 text-[#34D399]" />
            <span>Open Founder Composer</span>
          </button>

          <button
            onClick={onOpenPortfolio}
            className="px-6 py-3 rounded-full bg-[#161928] hover:bg-[#20253B] border border-[#272D45] text-[#A3A8BD] hover:text-white font-semibold text-sm transition-all flex items-center gap-2 shadow-md"
          >
            <Zap className="w-4 h-4 text-[#F59E0B]" />
            <span>View Proof-of-Work Studio</span>
          </button>
        </div>

        {/* Security & Reliability Badges */}
        <div className="pt-6 border-t border-[#1C2133] flex flex-wrap items-center justify-center gap-6 text-[11px] font-mono text-[#71788E]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Zero Data Retention Gmail Privacy</span>
          </div>
          <span className="text-[#2B3042]">•</span>
          <div className="flex items-center gap-1.5">
            <span>⚡</span>
            <span>Sumit Kesarwani 4-Part Cold Email Formula</span>
          </div>
          <span className="text-[#2B3042]">•</span>
          <div className="flex items-center gap-1.5">
            <span>🏹</span>
            <span>Direct Ashby & Lever ATS Scraping</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreFooterCTA;