import React from 'react';
import { ArrowRight, ShieldCheck, Mail } from 'lucide-react';

interface PreFooterCTAProps {
  roleCount: number;
  onLaunchRadar: () => void;
  onOpenOutreach: () => void;
  onOpenPortfolio: () => void;
}

export const PreFooterCTA: React.FC<PreFooterCTAProps> = ({
  roleCount,
  onLaunchRadar,
  onOpenOutreach,
  onOpenPortfolio,
}) => {

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#27272A] skeuo-surface p-8 sm:p-12 text-center shadow-xl">
      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full skeuo-well text-xs font-mono text-[#888888]">
          <span className="skeuo-led-green" />
          <span>Example role directory</span>
          <span className="text-[#333333]">•</span>
          <span className="text-white font-medium">{roleCount} sample {roleCount === 1 ? 'role' : 'roles'}</span>
        </div>

        {/* Main Headline */}
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Make your next move <br />
          <span className="text-[#888888]">with a clearer workflow.</span>
        </h2>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-[#888888] max-w-xl mx-auto leading-relaxed font-sans">
          Browse example listings, tailor your resume, draft founder outreach, and keep your search organized in a local application tracker. Confirm each listing and contact before reaching out.
        </p>

        {/* Action Buttons Row */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onLaunchRadar}
            className="skeuo-btn-primary px-5 py-2.5 rounded-lg text-black font-bold text-xs flex items-center gap-2 active:translate-y-[2px] active:shadow-none"
          >
            <span>Browse {roleCount} Sample {roleCount === 1 ? 'Role' : 'Roles'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenOutreach}
            className="skeuo-btn px-5 py-2.5 rounded-lg text-white font-medium text-xs flex items-center gap-2 active:translate-y-[2px] active:shadow-none"
          >
            <Mail className="w-3.5 h-3.5 text-[#888888]" />
            <span>Open Pitch Composer</span>
          </button>

          <button
            onClick={onOpenPortfolio}
            className="skeuo-btn px-5 py-2.5 rounded-lg text-[#A1A1A1] hover:text-white font-medium text-xs flex items-center gap-2 active:translate-y-[2px] active:shadow-none"
          >
            <span>Import GitHub Profile</span>
          </button>
        </div>

        {/* Security & Reliability Badges */}
        <div className="pt-6 border-t border-[#1F1F1F] flex flex-wrap items-center justify-center gap-6 text-[11px] font-mono text-[#666666]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
            <span>Profile and tracker saved in this browser</span>
          </div>
          <span className="text-[#333333]">•</span>
          <div className="flex items-center gap-1.5">
            <span>Outreach opens a draft for you to review</span>
          </div>
          <span className="text-[#333333]">•</span>
          <div className="flex items-center gap-1.5">
            <span>CSV export for your application tracker</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreFooterCTA;
