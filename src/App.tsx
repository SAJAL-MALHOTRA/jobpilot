import { useState } from 'react';
import type { CandidateProfile, JobListing, ApplicationCard, KanbanStatus } from './types';
import { initialProfile } from './lib/defaultProfile';
import { curatedJobs } from './lib/jobRadarEngine';
import { Navbar } from './components/Navbar';
import { JobRadar } from './components/JobRadar';
import { AtsResumeTailorModal } from './components/AtsResumeTailorModal';
import { OutreachModal } from './components/OutreachModal';
import { AutopilotTracker } from './components/AutopilotTracker';
import { ProfileVaultModal } from './components/ProfileVaultModal';
import { LiveAgentConsole } from './components/LiveAgentConsole';
import { PortfolioStudio } from './components/PortfolioStudio';
import { Sparkles, Bot, Zap, ShieldCheck, Mail, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export function App() {
  const [activeTab, setActiveTab] = useState<'RADAR' | 'ATS_LAB' | 'OUTREACH' | 'CRM' | 'PORTFOLIO'>('RADAR');
  const [candidate, setCandidate] = useState<CandidateProfile>(initialProfile);
  const [jobs] = useState<JobListing[]>(curatedJobs);
  const [autopilotEnabled, setAutopilotEnabled] = useState(true);

  // Modals state
  const [selectedJobForATS, setSelectedJobForATS] = useState<JobListing | null>(null);
  const [selectedJobForOutreach, setSelectedJobForOutreach] = useState<JobListing | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // CRM Cards state
  const [cards, setCards] = useState<ApplicationCard[]>([
    {
      id: 'app-01',
      job: curatedJobs[0], // CognitiveHQ
      status: 'OUTREACH_SENT',
      atsScore: 94,
      appliedDate: 'Yesterday',
      notes: 'Founder cold email sent to Siddharth Varma (CEO).',
    },
    {
      id: 'app-02',
      job: curatedJobs[1], // HyperScale
      status: 'TAILORED',
      atsScore: 91,
      notes: 'Resume tailored with Redis clustering & Kafka keywords.',
    },
    {
      id: 'app-03',
      job: curatedJobs[2], // Sarvam AI
      status: 'INTERVIEW_SCHEDULED',
      atsScore: 96,
      notes: 'Round 1 Technical Screening booked for Thursday.',
    },
  ]);

  const appliedJobIds = new Set(cards.map((c) => c.job.id));

  // Handlers
  const handleAddToPipeline = (job: JobListing) => {
    if (appliedJobIds.has(job.id)) return;
    const newCard: ApplicationCard = {
      id: `app-${Date.now()}`,
      job,
      status: 'DISCOVERED',
      atsScore: 92,
      notes: 'Discovered by autonomous radar agent.',
    };
    setCards([newCard, ...cards]);
    confetti({
      particleCount: 20,
      spread: 40,
      origin: { y: 0.8 },
      colors: ['#EDEDED', '#10B981']
    });
  };

  const handleUpdateCardStatus = (cardId: string, nextStatus: KanbanStatus) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, status: nextStatus } : c))
    );
  };

  const handleRemoveCard = (cardId: string) => {
    setCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  const handleLogOutreachSent = (job: JobListing, subject: string, body: string) => {
    setCards((prev) => {
      const existing = prev.find((c) => c.job.id === job.id);
      if (existing) {
        return prev.map((c) =>
          c.job.id === job.id
            ? { ...c, status: 'OUTREACH_SENT', outreachSubject: subject, outreachBody: body }
            : c
        );
      }
      return [
        {
          id: `app-${Date.now()}`,
          job,
          status: 'OUTREACH_SENT',
          atsScore: 94,
          outreachSubject: subject,
          outreachBody: body,
          notes: 'Outreach dispatched via JobPilot Copilot.',
        },
        ...prev,
      ];
    });
    setSelectedJobForOutreach(null);
  };

  return (
    <div className="min-h-screen bg-[#08090C] text-[#EDEDED] flex flex-col font-sans bg-grid-subtle">
      {/* Editorial Sticky Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        autopilotEnabled={autopilotEnabled}
        setAutopilotEnabled={setAutopilotEnabled}
        onOpenProfile={() => setIsProfileOpen(true)}
        applicationsCount={cards.length}
        interviewsCount={cards.filter((c) => c.status === 'INTERVIEW_SCHEDULED').length}
      />

      {/* Main App Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Editorial Hero Section (Aarivi / Vercel Aesthetic) */}
        <section className="text-center max-w-4xl mx-auto space-y-4 pt-4 pb-2">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-mono tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>YC W24/S24 & BANGALORE TECH RADAR</span>
            <span className="text-neutral-500">•</span>
            <span className="text-indigo-400">80% RESPONSE PLAYBOOK</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Find startup jobs. <br className="hidden sm:inline" />
            <span className="text-neutral-400">Pitch the founders directly.</span>
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-2xl mx-auto font-normal">
            Bypass the ATS black hole. JobPilot indexes open startup engineering roles, drafts 80% response rate cold pitches, auto-tailors resumes with Google X-Y-Z metrics, and syncs applications from Gmail.
          </p>

          {/* High-Impact Proof Metrics Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-3 text-xs font-mono text-neutral-400">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/60 border border-neutral-800">
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
              <span>Candidate: <strong className="text-white">{candidate.fullName}</strong></span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/60 border border-neutral-800">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Target CTC: <strong className="text-amber-300">₹{candidate.minTargetCtcLpa}L+ LPA</strong></span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/60 border border-neutral-800">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Verified Deliverability: <strong className="text-blue-300">99.6%</strong></span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/60 border border-neutral-800">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>Gmail Status: <strong className="text-emerald-400">Auto-Sync Active</strong></span>
            </div>
          </div>
        </section>

        {/* Tab Views */}
        <div>
          {activeTab === 'RADAR' && (
            <JobRadar
              jobs={jobs}
              candidate={candidate}
              onSelectJobForATS={(job) => setSelectedJobForATS(job)}
              onSelectJobForOutreach={(job) => setSelectedJobForOutreach(job)}
              onAddToPipeline={handleAddToPipeline}
              appliedJobIds={appliedJobIds}
            />
          )}

          {activeTab === 'ATS_LAB' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-[#111115] p-8 rounded-2xl border border-neutral-800 text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Google X-Y-Z Resume Tailoring Lab</span>
                </div>
                <h3 className="text-xl font-bold text-white">ATS Optimization & Metric Density Engine</h3>
                <p className="text-xs text-neutral-400 max-w-xl mx-auto leading-relaxed">
                  Every bullet point is systematically restructured to highlight quantifiable scale, latency metrics, and core architectural keywords matching target company tech stacks.
                </p>
                <div className="pt-3">
                  <button
                    onClick={() => setSelectedJobForATS(jobs[0])}
                    className="px-5 py-2.5 bg-white hover:bg-neutral-200 text-black rounded-xl text-xs font-bold transition-all shadow-md"
                  >
                    Open Live ATS Diff for {jobs[0].company} ({jobs[0].title})
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'OUTREACH' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-[#111115] p-8 rounded-2xl border border-neutral-800 text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>CrackColdEmail 80% Response Playbook</span>
                </div>
                <h3 className="text-xl font-bold text-white">Founder Multi-Channel Outreach Studio</h3>
                <p className="text-xs text-neutral-400 max-w-xl mx-auto leading-relaxed">
                  6 battle-tested cold outreach templates structured with Context, Relevance, Proof, and a Small Ask. Dispatches directly via Gmail, WhatsApp Web, or X (Twitter) DM.
                </p>
                <div className="pt-3">
                  <button
                    onClick={() => setSelectedJobForOutreach(jobs[0])}
                    className="px-5 py-2.5 bg-white hover:bg-neutral-200 text-black rounded-xl text-xs font-bold transition-all shadow-md"
                  >
                    Draft Outreach for {jobs[0].company} (Founder: {jobs[0].founderName})
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'CRM' && (
            <AutopilotTracker
              cards={cards}
              onUpdateCardStatus={handleUpdateCardStatus}
              onRemoveCard={handleRemoveCard}
              onOpenOutreachForCard={(job) => setSelectedJobForOutreach(job)}
            />
          )}

          {activeTab === 'PORTFOLIO' && (
            <PortfolioStudio
              candidate={candidate}
              onNavigateToOutreach={() => setActiveTab('OUTREACH')}
            />
          )}
        </div>

        {/* Live Autonomous Agent Telemetry Stream */}
        <LiveAgentConsole autopilotEnabled={autopilotEnabled} />
      </main>

      {/* Modals */}
      {selectedJobForATS && (
        <AtsResumeTailorModal
          job={selectedJobForATS}
          candidate={candidate}
          onClose={() => setSelectedJobForATS(null)}
          onProceedToOutreach={(job) => {
            setSelectedJobForATS(null);
            setSelectedJobForOutreach(job);
          }}
        />
      )}

      {selectedJobForOutreach && (
        <OutreachModal
          job={selectedJobForOutreach}
          candidate={candidate}
          onClose={() => setSelectedJobForOutreach(null)}
          onLogOutreachSent={handleLogOutreachSent}
        />
      )}

      {isProfileOpen && (
        <ProfileVaultModal
          candidate={candidate}
          onSave={(updated) => setCandidate(updated)}
          onClose={() => setIsProfileOpen(false)}
        />
      )}

      {/* World-Class Modern Footer */}
      <footer className="bg-[#050507] border-t border-neutral-900 mt-20 py-10 font-mono text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-neutral-900 pb-6 text-neutral-400">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-md bg-white flex items-center justify-center text-black font-black text-[10px]">
                JP
              </div>
              <span className="font-bold text-white font-sans text-sm">JobPilot</span>
              <span className="text-neutral-500">— Autonomous Career Agent</span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-[11px] text-neutral-400">
              <span className="hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1">YC W24 / S24 Radar <ArrowUpRight className="w-3 h-3 text-neutral-500" /></span>
              <span className="hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1">CrackColdEmail Playbook <ArrowUpRight className="w-3 h-3 text-neutral-500" /></span>
              <span className="hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1">Google X-Y-Z ATS Engine <ArrowUpRight className="w-3 h-3 text-neutral-500" /></span>
              <span className="hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1">Gmail Auto-Sync <ArrowUpRight className="w-3 h-3 text-neutral-500" /></span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500">
            <p>JobPilot AI © 2026 · Designed for high-urgency startup engineering hiring.</p>
            <div className="flex items-center gap-4">
              <span>Indiranagar · Koramangala · HSR Layout · Remote</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
