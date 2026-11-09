import React from 'react';
import { ArrowRight, ShieldCheck, Mail } from 'lucide-react';

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

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#1F1F1F] bg-[#0A0A0A] p-8 sm:p-12 text-center shadow-xl">
      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111111] border border-[#262626] text-xs font-mono text-[#888888] shadow-sm">
          <span>◈</span>
          <span>Startup Founder Directory</span>
          <span className="text-[#333333]">•</span>
          <span className="text-white font-medium">14 Active Startups</span>
        </div>

        {/* Main Headline */}
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Stop applying into ATS voids. <br />
          <span className="text-[#888888]">Pitch founders directly.</span>
        </h2>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-[#888888] max-w-xl mx-auto leading-relaxed font-sans">
          Index unadvertised seed roles across Indiranagar, Koramangala, and YC cohorts. Dispatch 4-part pitches directly to founders with working Gmail links and local pipeline tracking.
        </p>

        {/* Action Buttons Row */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onLaunchRadar}
            className="px-5 py-2.5 rounded-lg bg-white hover:bg-neutral-200 text-black font-bold text-xs transition-colors shadow-sm flex items-center gap-2"
          >
            <span>Explore 14 Startup Roles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenOutreach}
            className="px-5 py-2.5 rounded-lg bg-[#141414] hover:bg-[#1F1F1F] border border-[#262626] text-white font-medium text-xs transition-colors flex items-center gap-2"
          >
            <Mail className="w-3.5 h-3.5 text-[#888888]" />
            <span>Open Pitch Composer</span>
          </button>

          <button
            onClick={onOpenPortfolio}
            className="px-5 py-2.5 rounded-lg bg-[#141414] hover:bg-[#1F1F1F] border border-[#262626] text-[#A1A1A1] hover:text-white font-medium text-xs transition-colors flex items-center gap-2"
          >
            <span>Import GitHub Profile</span>
          </button>
        </div>

        {/* Security & Reliability Badges */}
        <div className="pt-6 border-t border-[#1F1F1F] flex flex-wrap items-center justify-center gap-6 text-[11px] font-mono text-[#666666]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
            <span>Local Storage Persistence (No Tracking)</span>
          </div>
          <span className="text-[#333333]">•</span>
          <div className="flex items-center gap-1.5">
            <span>Direct mailto: Dispatch to Founders</span>
          </div>
          <span className="text-[#333333]">•</span>
          <div className="flex items-center gap-1.5">
            <span>ATS-Compliant Plain-text / Print Export</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreFooterCTA;