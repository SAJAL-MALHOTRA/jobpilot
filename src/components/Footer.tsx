import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onOpenOutreach?: () => void;
  onOpenPortfolio?: () => void;
  onOpenAts?: () => void;
  onOpenTracker?: () => void;
  onLaunchRadar?: () => void;
  onScrollToTop?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenOutreach,
  onOpenPortfolio,
  onOpenAts,
  onOpenTracker,
  onLaunchRadar,
  onScrollToTop,
}) => (
  <footer className="border-t border-[#1F1F1F] bg-black py-12 text-xs text-[#A1A1A1]">
    <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-black text-black">JP</span>
            <span className="text-base font-extrabold tracking-tight text-white">JobPilot</span>
          </div>
          <p className="max-w-sm leading-relaxed text-[#A1A1A1]">
            A browser-based workspace for exploring example roles, preparing outreach, tailoring resumes, and tracking applications.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1F1F1F] bg-[#0A0A0A] px-3 py-1.5 font-mono text-[10px] text-[#A1A1A1]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#737373]" />
            <span>Example role catalog</span>
          </div>
        </div>

        <nav aria-label="Role directory" className="space-y-3">
          <h2 className="font-mono text-[11px] font-bold uppercase tracking-wider text-white">Explore</h2>
          <button onClick={onLaunchRadar} className="flex items-center gap-1 text-left transition-colors hover:text-white">
            Browse role directory <ArrowUpRight className="h-3 w-3" />
          </button>
          <button onClick={onOpenTracker} className="flex items-center gap-1 text-left transition-colors hover:text-white">
            Application tracker <ArrowUpRight className="h-3 w-3" />
          </button>
        </nav>

        <nav aria-label="Job search tools" className="space-y-3">
          <h2 className="font-mono text-[11px] font-bold uppercase tracking-wider text-white">Tools</h2>
          <button onClick={onOpenOutreach} className="flex items-center gap-1 text-left transition-colors hover:text-white">
            Founder pitch composer <ArrowUpRight className="h-3 w-3" />
          </button>
          <button onClick={onOpenAts} className="flex items-center gap-1 text-left transition-colors hover:text-white">
            Resume tailoring <ArrowUpRight className="h-3 w-3" />
          </button>
          <button onClick={onOpenPortfolio} className="flex items-center gap-1 text-left transition-colors hover:text-white">
            GitHub profile importer <ArrowUpRight className="h-3 w-3" />
          </button>
        </nav>
      </div>

      <div className="flex flex-col gap-4 border-t border-[#1F1F1F] pt-6 font-mono text-[10px] text-[#737373] sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl leading-relaxed">
          Profile and tracker data are stored in this browser. Example listings and contact details may be outdated; verify them before outreach.
        </p>
        <button
          onClick={onScrollToTop}
          className="shrink-0 rounded-md border border-[#262626] bg-[#0A0A0A] px-2.5 py-1.5 text-[#A1A1A1] transition-colors hover:bg-[#141414] hover:text-white"
        >
          Back to top ↑
        </button>
      </div>
    </div>
  </footer>
);

export default Footer;
