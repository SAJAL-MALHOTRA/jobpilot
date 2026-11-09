import React, { useState } from 'react';
import { Mail, Check, Send, Globe, Zap, ExternalLink, Activity, ShieldCheck } from 'lucide-react';
import { TiltCard3D } from './TiltCard3D';
import { SupersonicMissionControl } from './SupersonicMissionControl';
import confetti from 'canvas-confetti';

interface JobPilotFeaturesProps {
  onOpenOutreachModal: () => void;
  onOpenPortfolioModal: () => void;
  onOpenApplicationsTab: () => void;
  onExploreCluster?: (clusterName: string) => void;
}

export const JobPilotFeatures: React.FC<JobPilotFeaturesProps> = ({
  onOpenOutreachModal,
  onOpenPortfolioModal,
  onOpenApplicationsTab,
  onExploreCluster,
}) => {
  const [emailSent, setEmailSent] = useState(false);

  const handleSendSimulatedEmail = () => {
    setEmailSent(true);
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.8 },
      colors: ['#FFFFFF', '#10B981'],
    });
    setTimeout(() => setEmailSent(false), 3000);
  };

  return (
    <div className="space-y-20 pt-12">
      {/* 1. Section Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#131522] border border-[#202538] text-xs font-mono text-[#A3A8BD] shadow-sm">
          <span className="text-[#38BDF8]">◈</span>
          <span>JobPilot Core Systems</span>
          <span className="text-[#3E455E]">•</span>
          <span className="text-[#10B981] font-semibold">Autonomous Architecture</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Engineered for speed, unadvertised roles, and founder access
        </h2>

        <p className="text-sm text-[#8C93A8] leading-relaxed max-w-xl mx-auto font-sans">
          Four interconnected engines engineered to eliminate ATS rejection, prove production caliber, and put your tech career on autopilot.
        </p>
      </div>

      {/* 2. 2x2 Bento Grid with 3D Interactive Tilting */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Bento Card 1: Autonomous Inbound Telemetry */}
        <TiltCard3D
          onClick={onOpenApplicationsTab}
          className="jp-card p-6 flex flex-col justify-between space-y-6 cursor-pointer group rounded-2xl"
        >
          {/* Visual: Live Telemetry & Pipeline Console */}
          <div className="bg-[#0A0C13] rounded-xl border border-[#1E2335] p-3.5 text-xs font-mono space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1A1F30] text-[10px] text-[#71788E]">
              <div className="flex items-center gap-1.5 text-white font-bold">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                <span>INBOUND GMAIL STREAM</span>
              </div>
              <span className="text-[#10B981] font-semibold">Auto-Sync Active</span>
            </div>

            {/* Inbound Packet Stream */}
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-[#111420] border border-[#1E2438] space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#38BDF8] font-bold">Sarvam AI · Technical Founder</span>
                  <span className="text-[#646B82]">14 mins ago</span>
                </div>
                <div className="text-[11px] text-white truncate">
                  "Reviewed your sub-45ms order dispatch code. Can we chat Thursday 4 PM?"
                </div>
                <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] text-[9px]">
                  <span>⚡ Interview Auto-Moved to Calendar</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#111420] border border-[#1E2438] space-y-1 opacity-80">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-[#A3A8BD] font-bold">CognitiveHQ (YC W24)</span>
                  <span className="text-[#646B82]">2 hrs ago</span>
                </div>
                <div className="text-[11px] text-[#A3A8BD] truncate">
                  "Application received via Sumit Kesarwani pitch formula."
                </div>
                <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#6366F1]/15 text-[#818CF8] text-[9px]">
                  <span>Stage: Under Founder Review</span>
                </div>
              </div>
            </div>

            {/* Bottom Status Ticker */}
            <div className="pt-2 border-t border-[#1A1F30] flex items-center justify-between text-[10px] text-[#71788E]">
              <span>Avg Reply Velocity: 14.2 hrs</span>
              <span className="text-[#10B981]">100% Inbound Capture</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-base font-bold text-white">
              <Zap className="w-4 h-4 text-[#F59E0B]" />
              <span>Autonomous Inbound Telemetry</span>
            </div>
            <p className="text-xs text-[#8C93A8] leading-relaxed">
              JobPilot monitors your email in the background, parses founder replies and Ashby invites via OCR & regex, and automatically syncs your recruitment pipeline.
            </p>
          </div>
        </TiltCard3D>

        {/* Bento Card 2: Interactive Proof-of-Work Studio */}
        <TiltCard3D
          onClick={onOpenPortfolioModal}
          className="jp-card p-6 flex flex-col justify-between space-y-6 cursor-pointer group rounded-2xl"
        >
          {/* Visual: Code & Latency Benchmark Preview */}
          <div className="bg-[#0A0C13] rounded-xl border border-[#1E2335] p-3.5 text-xs font-mono space-y-3">
            <div className="flex items-center justify-between text-[10px] text-[#71788E] pb-2 border-b border-[#1A1F30]">
              <div className="flex items-center gap-1.5 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1]" />
                <span className="font-bold">PROVING PRODUCTION CALIBER</span>
              </div>
              <span className="text-[#38BDF8]">jobpilot.dev/p/arjunmehta</span>
            </div>

            {/* Live Microservice Telemetry */}
            <div className="bg-[#111420] rounded-lg p-3 border border-[#1E2438] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-[#10B981]" />
                  <span className="text-xs font-bold text-white">Order Dispatch Microservice</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] text-[10px] font-bold">
                  p99: 42.4ms
                </span>
              </div>

              {/* Simulated Latency Bars */}
              <div className="grid grid-cols-4 gap-1.5 pt-1 text-[9px] text-[#8C93A8]">
                <div className="p-1.5 rounded bg-[#0A0C13] border border-[#1A1F30] text-center">
                  <div className="text-white font-bold">120k</div>
                  <div className="text-[8px] text-[#646B82]">RPM</div>
                </div>
                <div className="p-1.5 rounded bg-[#0A0C13] border border-[#1A1F30] text-center">
                  <div className="text-white font-bold">99.99%</div>
                  <div className="text-[8px] text-[#646B82]">Accuracy</div>
                </div>
                <div className="p-1.5 rounded bg-[#0A0C13] border border-[#1A1F30] text-center">
                  <div className="text-white font-bold">2,410</div>
                  <div className="text-[8px] text-[#646B82]">Commits</div>
                </div>
                <div className="p-1.5 rounded bg-[#0A0C13] border border-[#1A1F30] text-center">
                  <div className="text-[#10B981] font-bold">Passed</div>
                  <div className="text-[8px] text-[#646B82]">Benchmarks</div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1A1F30] flex items-center justify-between text-[10px] text-[#71788E]">
              <span>Verified GitHub Proof-of-Work</span>
              <ExternalLink className="w-3 h-3 text-[#A3A8BD]" />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-base font-bold text-white">
              <Globe className="w-4 h-4 text-[#60A5FA]" />
              <span>Resume to Proof-of-Work Studio</span>
            </div>
            <p className="text-xs text-[#8C93A8] leading-relaxed">
              Founders don't read static PDFs. JobPilot generates an interactive engineering showcase with live sub-45ms latency benchmarks, system architecture diagrams, and GitHub commit heatmaps.
            </p>
          </div>
        </TiltCard3D>

        {/* Bento Card 3: CrackColdEmail™ Formula Engine */}
        <TiltCard3D className="jp-card p-6 flex flex-col justify-between space-y-6 rounded-2xl">
          {/* Visual: Pitch Composer Preview */}
          <div className="bg-[#0A0C13] rounded-xl border border-[#1E2335] p-3.5 text-xs font-mono space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1A1F30] text-[10px]">
              <div className="flex items-center gap-1.5 text-white font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                <span>SUMIT KESARWANI 4-PART FORMULA</span>
              </div>
              <span className="text-[#10B981] font-bold">81.6% Reply Rate</span>
            </div>

            <div className="text-[11px] text-[#D4D4D4] leading-relaxed space-y-2 font-mono bg-[#111420] p-3 rounded-lg border border-[#1E2438]">
              <div className="text-[#8C93A8] text-[10px] flex items-center justify-between pb-1 border-b border-[#1A1F30]">
                <span>To: founder@cognitivehq.ai</span>
                <span className="text-[#10B981]">Ashby Scraped</span>
              </div>
              <p>Hey Siddharth,</p>
              <p className="text-[#8C93A8]">
                <span className="text-[#38BDF8]">[Relevance]</span> Building autonomous supply chain agents is the problem space I spent 2 years optimizing at Swiggy.
              </p>
              <div className="p-2 rounded bg-[#0A0C13] border border-[#1A1F30] text-[10px] text-[#A3A8BD] space-y-0.5">
                <span className="text-white font-bold block">[Proof]:</span>
                <div>• Order dispatch engine: scaled to 120k req/min with sub-45ms p99.</div>
                <div>• Reconciliation pipeline: ₹40Cr daily GMV with 99.99% accuracy.</div>
              </div>
              <p className="text-[#10B981]">
                <span className="text-[#F59E0B]">[Small Ask]:</span> Would love to build the agent core with you. Open to a 10 min chat this Thursday?
              </p>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-2 border-t border-[#1A1F30] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px]">
              <span className="text-[#687087]">Primary Inbox Deliverability: 99.4%</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenOutreachModal}
                  className="px-2.5 py-1 text-[#8C93A8] hover:text-white"
                >
                  Edit draft
                </button>
                <button
                  onClick={handleSendSimulatedEmail}
                  className="px-3 py-1 bg-white hover:bg-[#EDEDED] text-black font-bold rounded-md transition-all flex items-center gap-1 shadow-sm"
                >
                  {emailSent ? <Check className="w-3 h-3 text-[#10B981]" /> : <Send className="w-3 h-3" />}
                  <span>{emailSent ? 'Dispatched to Founder!' : 'Dispatch Pitch'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-base font-bold text-white">
              <Mail className="w-4 h-4 text-[#34D399]" />
              <span>CrackColdEmail™ Founder Engine</span>
            </div>
            <p className="text-xs text-[#8C93A8] leading-relaxed">
              Auto-compiles battle-tested pitches with Context, Relevance, Proof, and a low-friction Small Ask. Launches directly into Gmail, WhatsApp Web, or X DM in one click.
            </p>
          </div>
        </TiltCard3D>

        {/* Bento Card 4: Bangalore & YC Startup Cluster Radar */}
        <TiltCard3D className="jp-card p-6 flex flex-col justify-between space-y-6 rounded-2xl">
          {/* Visual: Startup Cluster Matrix */}
          <div className="bg-[#0A0C13] rounded-xl border border-[#1E2335] p-3.5 text-xs font-mono space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1A1F30] text-[10px] text-[#71788E]">
              <div className="flex items-center gap-1.5 text-white font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                <span>UNADVERTISED STARTUP RADAR</span>
              </div>
              <span className="text-[#38BDF8]">Live Feed</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-[#111420] border border-[#1E2438] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">Indiranagar</span>
                  <span className="text-[#10B981] font-bold">48 Roles</span>
                </div>
                <div className="text-[10px] text-[#71788E]">AI & Foundation Models</div>
                <div className="text-[9px] text-[#38BDF8]">Avg: ₹28-65 LPA</div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#111420] border border-[#1E2438] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">Koramangala</span>
                  <span className="text-[#10B981] font-bold">62 Roles</span>
                </div>
                <div className="text-[10px] text-[#71788E]">High-Throughput Fintech</div>
                <div className="text-[9px] text-[#38BDF8]">Avg: ₹32-75 LPA</div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#111420] border border-[#1E2438] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">HSR Layout</span>
                  <span className="text-[#10B981] font-bold">54 Roles</span>
                </div>
                <div className="text-[10px] text-[#71788E]">DevTools & Cloud Infra</div>
                <div className="text-[9px] text-[#38BDF8]">Avg: ₹26-55 LPA</div>
              </div>

              <div className="p-2.5 rounded-lg bg-[#111420] border border-[#1E2438] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">YC W24 / S24</span>
                  <span className="text-[#10B981] font-bold">38 Roles</span>
                </div>
                <div className="text-[10px] text-[#71788E]">Seed to Series A</div>
                <div className="text-[9px] text-[#38BDF8]">$110k-160k (₹50-85L)</div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1A1F30] flex items-center justify-between text-[10px] text-[#71788E]">
              <span className="text-[#10B981]">34 Teams Financing Notice Buyouts</span>
              <span>10,000+ Startups Indexed</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-base font-bold text-white">
              <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
              <span>Bangalore & YC Startup Cluster Radar</span>
            </div>
            <p className="text-xs text-[#8C93A8] leading-relaxed">
              Scrapes unadvertised seed roles across Indiranagar, Koramangala, and HSR Layout directly through founder LinkedIn, Ashby APIs, and YC job boards.
            </p>
          </div>
        </TiltCard3D>
      </div>

      {/* 3. Real JobPilot Customer Stories */}
      <section className="space-y-8 pt-6 max-w-5xl mx-auto">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#131522] border border-[#202538] text-xs font-mono text-[#A3A8BD]">
            <span>⚡</span>
            <span>Startup Velocity Case Studies</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            How engineers are closing offers across top startup teams
          </h3>
          <p className="text-xs text-[#71788E] font-mono">
            Direct founder outreach and proof-of-work benchmarks replacing traditional resumes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TiltCard3D className="jp-card p-5 space-y-4 rounded-2xl">
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
          </TiltCard3D>

          <TiltCard3D className="jp-card p-5 space-y-4 rounded-2xl">
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
          </TiltCard3D>

          <TiltCard3D className="jp-card p-5 space-y-4 rounded-2xl">
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
          </TiltCard3D>

          <TiltCard3D className="jp-card p-5 space-y-4 rounded-2xl">
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
          </TiltCard3D>
        </div>
      </section>

      {/* 4. Supersonic Mission Control Visualizer (Replacing the old crowd illustration completely) */}
      <section className="pt-6">
        <SupersonicMissionControl onExploreCluster={onExploreCluster} />
      </section>
    </div>
  );
};

export default JobPilotFeatures;