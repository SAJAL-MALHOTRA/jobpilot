import React, { useState } from 'react';
import { Mail, Check, Send, Globe, Zap, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

interface JobPilotFeaturesProps {
  onOpenOutreachModal: () => void;
  onOpenPortfolioModal: () => void;
  onOpenApplicationsTab: () => void;
}

export const JobPilotFeatures: React.FC<JobPilotFeaturesProps> = ({
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
      {/* Section Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13151F] border border-[#1E2230] text-xs font-mono text-[#A3A8BD]">
          <span>◈</span>
          <span>Autonomous Copilot Capabilities</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Everything you need to bypass ATS and close offers
        </h2>

        <p className="text-sm text-[#8C93A8] leading-relaxed max-w-xl mx-auto font-sans">
          Gmail auto-tracking, an interactive proof-of-work portfolio, 80% response cold emails to founders, and Bangalore startup intelligence.
        </p>
      </div>

      {/* 2x2 Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Bento Card 1: Gmail Tracking */}
        <div 
          onClick={onOpenApplicationsTab}
          className="jp-card p-6 flex flex-col justify-between space-y-6 cursor-pointer group"
        >
          {/* Visual: Simulated Dark Mode 4-Column Board */}
          <div className="bg-[#0C0E14] rounded-xl border border-[#1E2230] p-3 text-[10px] font-mono space-y-2">
            <div className="grid grid-cols-4 gap-2 text-[#687087] pb-2 border-b border-[#1E2230]">
              <div className="flex items-center gap-1 text-white font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Applied (3)
              </div>
              <div className="flex items-center gap-1 text-[#8C93A8]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1]" /> Interview (2)
              </div>
              <div className="flex items-center gap-1 text-[#8C93A8]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" /> Offer (1)
              </div>
              <div className="flex items-center gap-1 text-[#8C93A8]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" /> Rejected
              </div>
            </div>

            {/* Kanban Columns Preview */}
            <div className="grid grid-cols-4 gap-2">
              <div className="space-y-1.5">
                <div className="p-2 rounded bg-[#131622] border border-[#1E2230] space-y-0.5">
                  <div className="font-bold text-white text-[9px] truncate">Machine Learning Intern</div>
                  <div className="text-[8px] text-[#8C93A8]">Prayog AI</div>
                  <div className="text-[8px] text-[#52576B] truncate">"We received your application"</div>
                </div>
                <div className="p-2 rounded bg-[#131622] border border-[#1E2230] space-y-0.5">
                  <div className="font-bold text-white text-[9px] truncate">Senior Data Engineer</div>
                  <div className="text-[8px] text-[#8C93A8]">Mosaic Retail</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="p-2 rounded bg-[#131622] border border-[#6366F1]/40 space-y-0.5">
                  <div className="font-bold text-[#818CF8] text-[9px] truncate">Senior Frontend Eng.</div>
                  <div className="text-[8px] text-[#8C93A8]">Meridian Retail</div>
                  <div className="text-[8px] text-[#10B981] truncate">"Interview booked: Thu 4pm"</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="p-2 rounded bg-[#131622] border border-[#F59E0B]/40 space-y-0.5">
                  <div className="font-bold text-[#F59E0B] text-[9px] truncate">Founding AI Engineer</div>
                  <div className="text-[8px] text-[#8C93A8]">CognitiveHQ</div>
                  <div className="text-[8px] text-[#F59E0B] truncate">"Your offer from CognitiveHQ"</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="p-2 rounded bg-[#131622] border border-[#1E2230] space-y-0.5 opacity-60">
                  <div className="font-bold text-white text-[9px] truncate">Security Engineer</div>
                  <div className="text-[8px] text-[#8C93A8]">Ironvale</div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-base font-bold text-white">
              <Zap className="w-4 h-4 text-[#F59E0B]" />
              <span>Gmail Inbound Tracking</span>
            </div>
            <p className="text-xs text-[#8C93A8] leading-relaxed">
              Every day our background agent scans Gmail and updates Applied, Interview, Offer, and Rejected on your board.
            </p>
          </div>
        </div>

        {/* Bento Card 2: Resume to Portfolio */}
        <div 
          onClick={onOpenPortfolioModal}
          className="jp-card p-6 flex flex-col justify-between space-y-6 cursor-pointer group"
        >
          {/* Visual: Browser Frame Preview */}
          <div className="bg-[#0C0E14] rounded-xl border border-[#1E2230] p-4 text-xs font-mono space-y-3">
            <div className="flex items-center justify-between text-[10px] text-[#687087] pb-2 border-b border-[#1E2230]">
              <span className="px-1.5 py-0.5 rounded bg-[#161926] border border-[#23273B] text-white">Live URL</span>
              <span className="text-[#A3A8BD]">jobpilot.dev/p/arjunmehta</span>
              <ExternalLink className="w-3 h-3 text-[#687087]" />
            </div>

            <div className="bg-[#121522] rounded-lg p-5 border border-[#1E2230] text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 mx-auto text-white flex items-center justify-center font-bold text-xs shadow-md">
                AM
              </div>
              <h4 className="text-sm font-bold text-white font-sans">Your proof-of-work portfolio from GitHub</h4>
              <p className="text-[11px] text-[#8C93A8] max-w-sm mx-auto font-sans">
                Sub-45ms latency benchmarks, verified GitHub commits, and shipped production code ready to share with founders.
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-base font-bold text-white">
              <Globe className="w-4 h-4 text-[#60A5FA]" />
              <span>Resume to Proof-of-Work</span>
            </div>
            <p className="text-xs text-[#8C93A8] leading-relaxed">
              Drop in your resume and GitHub. You get an interactive portfolio out of it with live latency benchmarks, without building a site yourself.
            </p>
          </div>
        </div>

        {/* Bento Card 3: Cold Email to Founders */}
        <div className="jp-card p-6 flex flex-col justify-between space-y-6">
          {/* Visual: Exact Cold Email Composer Preview */}
          <div className="bg-[#0C0E14] rounded-xl border border-[#1E2230] p-4 text-xs font-mono space-y-3">
            <div className="space-y-1 pb-2 border-b border-[#1E2230] text-[11px]">
              <div className="text-[#8C93A8]">
                <strong className="text-white">To:</strong> Siddharth Varma at CognitiveHQ (YC W24)
              </div>
              <div className="text-[#8C93A8]">
                <strong className="text-white">Subject:</strong> high-throughput order dispatch at 120k RPM
              </div>
            </div>

            <div className="text-[11px] text-[#D4D4D4] leading-relaxed space-y-2 font-mono">
              <p>Hey Siddharth,</p>
              <p className="text-[#8C93A8]">Full stack & AI platform engineer, low-latency backends mostly.</p>
              <p>CognitiveHQ building autonomous supply chain agents is the problem space I spent 2 years optimizing at Swiggy.</p>
              <div className="p-2 rounded bg-[#131622] border border-[#1E2230] text-[10px] text-[#8C93A8] space-y-0.5">
                <span className="text-white font-bold block">things I've shipped:</span>
                <div>• Order dispatch engine: scaled to 120k req/min with sub-45ms p99.</div>
                <div>• Reconciliation pipeline: ₹40Cr daily GMV with 99.99% accuracy via Celery/SQS.</div>
                <div>• Reactive UI: WebSockets state streaming in React 18, cutting render thrash by 34%.</div>
              </div>
              <p>would love to build the agent core with you. Open to a 10 minute chat this Thursday?</p>
              <p className="text-[#8C93A8]">Arjun • github.com/arjunmehta-dev</p>
              <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#161926] border border-[#23273B] text-[10px] text-white">
                <span>📄</span>
                <span>arjun-mehta-resume.pdf</span>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-2 border-t border-[#1E2230] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px]">
              <span className="text-[#687087]">Sends from arjun@demo.jobpilot.com</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={onOpenOutreachModal}
                  className="px-2.5 py-1 text-[#8C93A8] hover:text-white"
                >
                  Edit draft
                </button>
                <button
                  onClick={handleSendSimulatedEmail}
                  className="px-3 py-1 bg-white hover:bg-[#EDEDED] text-black font-bold rounded-md transition-all flex items-center gap-1"
                >
                  {emailSent ? <Check className="w-3 h-3 text-[#10B981]" /> : <Send className="w-3 h-3" />}
                  <span>{emailSent ? 'Sent to Siddharth!' : 'Send email'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-base font-bold text-white">
              <Mail className="w-4 h-4 text-[#34D399]" />
              <span>CrackColdEmail 80% Playbook</span>
            </div>
            <p className="text-xs text-[#8C93A8] leading-relaxed">
              The agent crafts 4-part cold emails (Context + Relevance + Proof + Small Ask) with your resume attached, and dispatches directly from your Gmail once you approve.
            </p>
          </div>
        </div>

        {/* Bento Card 4: 10,000+ Startups */}
        <div className="jp-card p-6 flex flex-col justify-between space-y-6">
          {/* Visual: Logo Grid of Startups */}
          <div className="bg-[#0C0E14] rounded-xl border border-[#1E2230] p-5 text-xs font-mono">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#131622] border border-[#1E2230] flex items-center justify-center font-bold text-xs text-white">
                perplexity
              </div>
              <div className="p-3 rounded-xl bg-[#131622] border border-[#1E2230] flex items-center justify-center font-bold text-xs text-white">
                🤗 Hugging Face
              </div>
              <div className="p-3 rounded-xl bg-[#131622] border border-[#1E2230] flex items-center justify-center font-bold text-xs text-white">
                Resend
              </div>
              <div className="p-3 rounded-xl bg-[#131622] border border-[#1E2230] flex items-center justify-center font-bold text-xs text-white">
                mintlify
              </div>
              <div className="p-3 rounded-xl bg-[#131622] border border-[#1E2230] flex items-center justify-center font-bold text-xs text-white">
                ⚡ Supabase
              </div>
              <div className="p-3 rounded-xl bg-[#131622] border border-[#1E2230] flex items-center justify-center font-bold text-xs text-white">
                Linear
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-base font-bold text-white">
              <span>🏹</span>
              <span>10,000+ Tech Startups Indexed</span>
            </div>
            <p className="text-xs text-[#8C93A8] leading-relaxed">
              Updated every 24 hours across Bangalore clusters (Indiranagar, HSR, Koramangala) and YC W24/S24 cohorts with verified founder contacts.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Real JobPilot Customer Stories */}
      <section className="space-y-8 pt-8 max-w-5xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Built for startup velocity
          </h2>
          <p className="text-xs text-[#71788E] font-mono">
            How engineers are closing offers across top Bangalore & YC teams.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="jp-card p-5 space-y-4">
            <p className="text-xs text-[#D4D4D4] leading-relaxed font-sans">
              "Landed a Founding Engineer role at a YC W24 AI startup in Indiranagar in 8 days. The cold email formula got me 3 founder replies in 24 hours."
            </p>
            <div className="flex items-center gap-2.5 pt-2 border-t border-[#1E2230]">
              <div className="w-6 h-6 rounded-full bg-[#1A1D2B] text-white flex items-center justify-center text-[10px] font-bold font-mono">
                RS
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Rishabh Singhal</span>
                <span className="text-[10px] text-[#687087]">Founding Engineer, Ex-Swiggy</span>
              </div>
            </div>
          </div>

          <div className="jp-card p-5 space-y-4">
            <p className="text-xs text-[#D4D4D4] leading-relaxed font-sans">
              "Most job boards are black holes. JobPilot found 4 seed startups in HSR Layout that bought out my 60-day notice period. Offer signed."
            </p>
            <div className="flex items-center gap-2.5 pt-2 border-t border-[#1E2230]">
              <div className="w-6 h-6 rounded-full bg-[#1A1D2B] text-white flex items-center justify-center text-[10px] font-bold font-mono">
                KR
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Karthik Raja</span>
                <span className="text-[10px] text-[#687087]">Backend Systems Engineer</span>
              </div>
            </div>
          </div>

          <div className="jp-card p-5 space-y-4">
            <p className="text-xs text-[#D4D4D4] leading-relaxed font-sans">
              "The Google X-Y-Z resume rewriter bumped my Ashby ATS match to 94%. Dispatched the pitch and had a technical screening scheduled by Thursday."
            </p>
            <div className="flex items-center gap-2.5 pt-2 border-t border-[#1E2230]">
              <div className="w-6 h-6 rounded-full bg-[#1A1D2B] text-white flex items-center justify-center text-[10px] font-bold font-mono">
                TD
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Tanvi Deshmukh</span>
                <span className="text-[10px] text-[#687087]">Full Stack Developer</span>
              </div>
            </div>
          </div>

          <div className="jp-card p-5 space-y-4">
            <p className="text-xs text-[#D4D4D4] leading-relaxed font-sans">
              "Connected my Gmail and the agent detected an inbound interview invitation from Sarvam AI automatically. Game changer."
            </p>
            <div className="flex items-center gap-2.5 pt-2 border-t border-[#1E2230]">
              <div className="w-6 h-6 rounded-full bg-[#1A1D2B] text-white flex items-center justify-center text-[10px] font-bold font-mono">
                DN
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Devika Nair</span>
                <span className="text-[10px] text-[#687087]">Senior Frontend Lead</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Community Illustration Banner */}
      <div className="pt-10 max-w-6xl mx-auto overflow-hidden">
        <img
          src="/crowd-illustration.png"
          alt="Tech startup engineering community"
          className="w-full h-auto object-cover opacity-80 rounded-2xl border border-[#1E2230]"
        />
      </div>
    </div>
  );
};
export default JobPilotFeatures;
