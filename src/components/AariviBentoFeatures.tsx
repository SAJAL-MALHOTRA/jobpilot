import React, { useState } from 'react';
import { Mail, Check, Send, Globe, Zap, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AariviBentoFeaturesProps {
  onOpenOutreachModal: () => void;
  onOpenPortfolioModal: () => void;
  onOpenApplicationsTab: () => void;
}

export const AariviBentoFeatures: React.FC<AariviBentoFeaturesProps> = ({
  onOpenOutreachModal,
  onOpenPortfolioModal,
  onOpenApplicationsTab,
}) => {
  const [emailSent, setEmailSent] = useState(false);

  const handleSendSimulatedEmail = () => {
    setEmailSent(true);
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.8 },
      colors: ['#FFFFFF', '#10B981']
    });
    setTimeout(() => setEmailSent(false), 3000);
  };

  return (
    <div className="space-y-16 pt-12">
      {/* Section Header (Aarivi Image 4) */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171717] border border-[#262626] text-xs font-mono text-[#A3A3A3]">
          <span>🚀</span>
          <span>Also included</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Everything you need to find roles and get hired
        </h2>

        <p className="text-sm text-[#A3A3A3] leading-relaxed max-w-xl mx-auto font-sans">
          Gmail tracking, a portfolio from your resume, cold emails to founders, and a startup list that we keep adding to.
        </p>
      </div>

      {/* 2x2 Bento Grid (Aarivi Images 4 & 5) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Bento Card 1: Gmail Tracking (Image 4 Left) */}
        <div 
          onClick={onOpenApplicationsTab}
          className="bento-card p-6 flex flex-col justify-between space-y-6 cursor-pointer group"
        >
          {/* Visual: Simulated Dark Mode 4-Column Board */}
          <div className="bg-[#0C0C0C] rounded-xl border border-[#262626] p-3 text-[10px] font-mono space-y-2">
            <div className="grid grid-cols-4 gap-2 text-[#737373] pb-2 border-b border-[#262626]">
              <div className="flex items-center gap-1 text-white font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Applied (3)
              </div>
              <div className="flex items-center gap-1 text-[#A3A3A3]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" /> Interview (2)
              </div>
              <div className="flex items-center gap-1 text-[#A3A3A3]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" /> Offer (1)
              </div>
              <div className="flex items-center gap-1 text-[#A3A3A3]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" /> Rejected
              </div>
            </div>

            {/* Kanban Columns Preview */}
            <div className="grid grid-cols-4 gap-2">
              <div className="space-y-1.5">
                <div className="p-2 rounded bg-[#171717] border border-[#262626] space-y-0.5">
                  <div className="font-bold text-white text-[9px] truncate">Machine Learning Intern</div>
                  <div className="text-[8px] text-[#A3A3A3]">Prayog AI</div>
                  <div className="text-[8px] text-[#525252] truncate">"We received your application"</div>
                </div>
                <div className="p-2 rounded bg-[#171717] border border-[#262626] space-y-0.5">
                  <div className="font-bold text-white text-[9px] truncate">Senior Data Engineer</div>
                  <div className="text-[8px] text-[#A3A3A3]">Mosaic Retail</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="p-2 rounded bg-[#171717] border border-[#3B82F6]/30 space-y-0.5">
                  <div className="font-bold text-[#3B82F6] text-[9px] truncate">Senior Frontend Eng.</div>
                  <div className="text-[8px] text-[#A3A3A3]">Meridian Retail</div>
                  <div className="text-[8px] text-[#10B981] truncate">"Interview booked: Thu 4pm"</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="p-2 rounded bg-[#171717] border border-[#F59E0B]/30 space-y-0.5">
                  <div className="font-bold text-[#F59E0B] text-[9px] truncate">Full Stack Engineer</div>
                  <div className="text-[8px] text-[#A3A3A3]">CognitiveHQ</div>
                  <div className="text-[8px] text-[#F59E0B] truncate">"Your offer from CognitiveHQ"</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="p-2 rounded bg-[#171717] border border-[#262626] space-y-0.5 opacity-60">
                  <div className="font-bold text-white text-[9px] truncate">Security Engineer</div>
                  <div className="text-[8px] text-[#A3A3A3]">Ironvale</div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-base font-bold text-white">
              <Zap className="w-4 h-4 text-[#F59E0B]" />
              <span>Gmail tracking</span>
            </div>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              Every day we scan Gmail and update Applied, Interview, Offer, and Rejected on your board.
            </p>
          </div>
        </div>

        {/* Bento Card 2: Resume to Portfolio (Image 4 Right) */}
        <div 
          onClick={onOpenPortfolioModal}
          className="bento-card p-6 flex flex-col justify-between space-y-6 cursor-pointer group"
        >
          {/* Visual: Browser Frame Preview */}
          <div className="bg-[#0C0C0C] rounded-xl border border-[#262626] p-4 text-xs font-mono space-y-3">
            <div className="flex items-center justify-between text-[10px] text-[#737373] pb-2 border-b border-[#262626]">
              <span className="px-1.5 py-0.5 rounded bg-[#171717] border border-[#262626] text-white">Desktop</span>
              <span className="text-[#A3A3A3]">portfolio.dev/arjunmehta</span>
              <ExternalLink className="w-3 h-3 text-[#737373]" />
            </div>

            <div className="bg-[#171717] rounded-lg p-5 border border-[#262626] text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 mx-auto text-white flex items-center justify-center font-bold text-xs">
                AM
              </div>
              <h4 className="text-sm font-bold text-white font-sans">Your portfolio from resume and GitHub</h4>
              <p className="text-[11px] text-[#A3A3A3] max-w-sm mx-auto font-sans">
                Sub-45ms latency benchmarks, verified GitHub commits, and shipped production code ready to share.
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-base font-bold text-white">
              <Globe className="w-4 h-4 text-[#60A5FA]" />
              <span>Resume to portfolio</span>
            </div>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              Drop in your resume and GitHub. You get a portfolio out of it, without building a site yourself.
            </p>
          </div>
        </div>

        {/* Bento Card 3: Cold Email to Founders (Image 5 Left) */}
        <div className="bento-card p-6 flex flex-col justify-between space-y-6">
          {/* Visual: Exact Aarivi Cold Email Composer Preview (Image 5) */}
          <div className="bg-[#0C0C0C] rounded-xl border border-[#262626] p-4 text-xs font-mono space-y-3">
            <div className="space-y-1 pb-2 border-b border-[#262626] text-[11px]">
              <div className="text-[#A3A3A3]">
                <strong className="text-white">To:</strong> Maya Iyer at Ledgerline
              </div>
              <div className="text-[#A3A3A3]">
                <strong className="text-white">Subject:</strong> payouts in 30 currencies, 4M entries a month
              </div>
            </div>

            <div className="text-[11px] text-[#D4D4D4] leading-relaxed space-y-2 font-mono">
              <p>Hey Maya,</p>
              <p className="text-[#A3A3A3]">backend engineer, payments and ledgers mostly.</p>
              <p>Ledgerline turning double-entry into an API is the piece I kept rebuilding by hand at every job.</p>
              <div className="p-2 rounded bg-[#171717] border border-[#262626] text-[10px] text-[#A3A3A3] space-y-0.5">
                <span className="text-white font-bold block">things I've shipped:</span>
                <div>• Payout rails: multi-currency payouts across 30 currencies.</div>
                <div>• Reconciliation service: roughly 4M ledger entries a month, matched nightly.</div>
                <div>• Search pipeline: cut p95 latency from 840ms to 310ms.</div>
              </div>
              <p>would love to build the ledger core with you. Open to a 15 minute chat next week?</p>
              <p className="text-[#A3A3A3]">Arjun • github.com/arjunmehta-dev</p>
              <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#171717] border border-[#262626] text-[10px] text-white">
                <span>📄</span>
                <span>arjun-mehta-resume.pdf</span>
              </div>
            </div>

            {/* Bottom Actions Bar (Image 5) */}
            <div className="pt-2 border-t border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px]">
              <span className="text-[#737373]">Sends from arjun@demo.jobpilot.com</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={onOpenOutreachModal}
                  className="px-2.5 py-1 text-[#A3A3A3] hover:text-white"
                >
                  Edit draft
                </button>
                <button
                  onClick={handleSendSimulatedEmail}
                  className="px-3 py-1 bg-white hover:bg-[#F3F4F6] text-black font-bold rounded-md transition-all flex items-center gap-1"
                >
                  {emailSent ? <Check className="w-3 h-3 text-[#10B981]" /> : <Send className="w-3 h-3" />}
                  <span>{emailSent ? 'Sent to Maya!' : 'Send email'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-base font-bold text-white">
              <Mail className="w-4 h-4 text-[#34D399]" />
              <span>Cold email to founders</span>
            </div>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              The agent finds founders who fit your profile, drafts the email with your resume attached, and sends it from your Gmail once you approve.
            </p>
          </div>
        </div>

        {/* Bento Card 4: 10,000+ Startups (Image 5 Right) */}
        <div className="bento-card p-6 flex flex-col justify-between space-y-6">
          {/* Visual: Logo Grid of Startups */}
          <div className="bg-[#0C0C0C] rounded-xl border border-[#262626] p-5 text-xs font-mono">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#171717] border border-[#262626] flex items-center justify-center font-bold text-xs text-white">
                perplexity
              </div>
              <div className="p-3 rounded-xl bg-[#171717] border border-[#262626] flex items-center justify-center font-bold text-xs text-white">
                🤗 Hugging Face
              </div>
              <div className="p-3 rounded-xl bg-[#171717] border border-[#262626] flex items-center justify-center font-bold text-xs text-white">
                Resend
              </div>
              <div className="p-3 rounded-xl bg-[#171717] border border-[#262626] flex items-center justify-center font-bold text-xs text-white">
                mintlify
              </div>
              <div className="p-3 rounded-xl bg-[#171717] border border-[#262626] flex items-center justify-center font-bold text-xs text-white">
                ⚡ Supabase
              </div>
              <div className="p-3 rounded-xl bg-[#171717] border border-[#262626] flex items-center justify-center font-bold text-xs text-white">
                Linear
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-base font-bold text-white">
              <span>🏹</span>
              <span>10,000+ startups</span>
            </div>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              10000+ startups in one place, updated every day. We add new ones each week as we find them.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Testimonials: "What customers are saying" (Aarivi Image 6) */}
      <section className="space-y-8 pt-8 max-w-5xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            What customers are saying
          </h2>
          <p className="text-xs text-[#737373] font-mono">
            A few notes from people using it during job searching.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bento-card p-5 space-y-4">
            <p className="text-xs text-[#D4D4D4] leading-relaxed font-sans">
              "I got beta access of an agent that does cold emails to founders and I beg you to use it."
            </p>
            <div className="flex items-center gap-2.5 pt-2 border-t border-[#262626]">
              <div className="w-6 h-6 rounded-full bg-[#262626] flex items-center justify-center text-[10px]">
                🧔
              </div>
              <span className="text-xs font-bold text-white">Jagapathi</span>
            </div>
          </div>

          <div className="bento-card p-5 space-y-4">
            <p className="text-xs text-[#D4D4D4] leading-relaxed font-sans">
              "JobPilot is pretty good and I don't want to shit track all my applied jobs."
            </p>
            <div className="flex items-center gap-2.5 pt-2 border-t border-[#262626]">
              <div className="w-6 h-6 rounded-full bg-[#262626] flex items-center justify-center text-[10px]">
                👩
              </div>
              <span className="text-xs font-bold text-white">Sanju</span>
            </div>
          </div>

          <div className="bento-card p-5 space-y-4">
            <p className="text-xs text-[#D4D4D4] leading-relaxed font-sans">
              "Thought it was just a scraper, but honestly I found some quality startups in the US and Bangalore with solid pay. Nice platform."
            </p>
            <div className="flex items-center gap-2.5 pt-2 border-t border-[#262626]">
              <div className="w-6 h-6 rounded-full bg-[#262626] flex items-center justify-center text-[10px]">
                🧔
              </div>
              <span className="text-xs font-bold text-white">Jose</span>
            </div>
          </div>

          <div className="bento-card p-5 space-y-4">
            <p className="text-xs text-[#D4D4D4] leading-relaxed font-sans">
              "Connected Gmail and saw there's an interview tomorrow bro. wtf."
            </p>
            <div className="flex items-center gap-2.5 pt-2 border-t border-[#262626]">
              <div className="w-6 h-6 rounded-full bg-[#262626] flex items-center justify-center text-[10px]">
                👱
              </div>
              <span className="text-xs font-bold text-white">Aditya</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The Hand-Drawn Crowd Illustration Banner (Aarivi Image 7) */}
      <div className="pt-10 max-w-6xl mx-auto overflow-hidden">
        <img
          src="/crowd-illustration.png"
          alt="Job seekers and engineers in the tech community"
          className="w-full h-auto object-cover opacity-90 rounded-2xl border border-[#262626]"
        />
      </div>
    </div>
  );
};
export default AariviBentoFeatures;
