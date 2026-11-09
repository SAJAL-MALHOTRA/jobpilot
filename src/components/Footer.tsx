import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onOpenOutreach?: () => void;
  onOpenPortfolio?: () => void;
  onOpenAts?: () => void;
  onOpenTracker?: () => void;
  onScrollToTop?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenOutreach,
  onOpenPortfolio,
  onOpenAts,
  onOpenTracker,
  onScrollToTop,
}) => {
  return (
    <footer className="bg-[#06080E] border-t border-[#161A28] pt-16 pb-12 text-xs font-sans text-[#8C93A8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Main 4-Column Directory */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1: Brand & Autonomous Identity (Spans 2 cols on LG) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center font-black text-xs shadow-md">
                JP
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">JobPilot AI</span>
            </div>

            <p className="text-xs text-[#7E869E] max-w-sm leading-relaxed font-sans">
              The autonomous reverse-recruiting platform engineered for startup engineers. Index unadvertised seed roles across Bangalore and YC cohorts, bypass ATS gatekeepers, and dispatch 80% response cold emails directly to founders.
            </p>

            {/* System Status Pill */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D101A] border border-[#1C2133] text-[11px] font-mono text-[#A3A8BD]">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span>All Telemetry Operational</span>
                <span className="text-[#3A4055]">•</span>
                <span className="text-[#38BDF8]">24ms Ping</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0D101A] border border-[#1C2133] text-[11px] font-mono text-[#71788E]">
                <span>◈ Three.js 3D WebGL</span>
              </div>
            </div>
          </div>

          {/* Column 2: Startup Corridors */}
          <div className="space-y-3 font-mono">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Startup Corridors
            </h4>
            <ul className="space-y-2 text-xs text-[#7E869E]">
              <li>
                <a href="#dashboard-view" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Indiranagar AI Corridor</span>
                </a>
              </li>
              <li>
                <a href="#dashboard-view" className="hover:text-white transition-colors">
                  Koramangala Fintech
                </a>
              </li>
              <li>
                <a href="#dashboard-view" className="hover:text-white transition-colors">
                  HSR Layout DevTools
                </a>
              </li>
              <li>
                <a href="#dashboard-view" className="hover:text-white transition-colors">
                  YC W24 / S24 Cohorts
                </a>
              </li>
              <li>
                <a href="#dashboard-view" className="text-[#10B981] hover:underline flex items-center gap-1">
                  <span>Notice Buyout Roles</span>
                  <span className="text-[10px] px-1 rounded bg-[#10B981]/10 border border-[#10B981]/20">34</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Autonomous Engines */}
          <div className="space-y-3 font-mono">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Autonomous Engines
            </h4>
            <ul className="space-y-2 text-xs text-[#7E869E]">
              <li>
                <button onClick={onOpenOutreach} className="hover:text-white transition-colors text-left flex items-center gap-1">
                  <span>CrackColdEmail™ Engine</span>
                  <ArrowUpRight className="w-3 h-3 text-[#646B82]" />
                </button>
              </li>
              <li>
                <button onClick={onOpenAts} className="hover:text-white transition-colors text-left flex items-center gap-1">
                  <span>Google X-Y-Z ATS Tailor</span>
                  <ArrowUpRight className="w-3 h-3 text-[#646B82]" />
                </button>
              </li>
              <li>
                <button onClick={onOpenPortfolio} className="hover:text-white transition-colors text-left flex items-center gap-1">
                  <span>Proof-of-Work Studio</span>
                  <ArrowUpRight className="w-3 h-3 text-[#646B82]" />
                </button>
              </li>
              <li>
                <button onClick={onOpenTracker} className="hover:text-white transition-colors text-left flex items-center gap-1">
                  <span>Gmail Inbound Tracker</span>
                  <ArrowUpRight className="w-3 h-3 text-[#646B82]" />
                </button>
              </li>
              <li>
                <a href="#dashboard-view" className="hover:text-white transition-colors">
                  Ashby / Lever API Scraper
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Platform & Transparency */}
          <div className="space-y-3 font-mono">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Platform & Security
            </h4>
            <ul className="space-y-2 text-xs text-[#7E869E]">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Zero-Data Gmail Privacy
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  p99 Microservice Latency
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Verified Founder Directory
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  SOC-2 Type II Certified
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Playwright Headless Spec
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Coordinates & Legal Bar */}
        <div className="pt-8 border-t border-[#141824] flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#5E657C]">
          <div className="flex items-center gap-3">
            <span className="text-white font-bold">JobPilot Technologies Inc.</span>
            <span>•</span>
            <span>BLR 12.9716° N, 77.5946° E ⇄ SFO 37.7749° N, 122.4194° W</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <span className="hover:text-[#A3A8BD] transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#A3A8BD] transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#A3A8BD] transition-colors cursor-pointer">Security Protocol</span>
            <button
              onClick={onScrollToTop}
              className="px-2 py-0.5 rounded bg-[#131622] hover:bg-[#1C2030] text-[#A3A8BD] hover:text-white transition-colors"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;