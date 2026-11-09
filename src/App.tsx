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
import { AutopilotApplyModal } from './components/AutopilotApplyModal';
import { 
  Sparkles, 
  Bot, 
  Zap, 
  ShieldCheck, 
  Mail, 
  ArrowUpRight, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  FileCheck,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function App() {
  const [activeTab, setActiveTab] = useState<'RADAR' | 'ATS_LAB' | 'OUTREACH' | 'CRM' | 'PORTFOLIO'>('RADAR');
  const [candidate, setCandidate] = useState<CandidateProfile>(initialProfile);
  const [jobs] = useState<JobListing[]>(curatedJobs);
  const [autopilotEnabled, setAutopilotEnabled] = useState(true);

  // Modals state
  const [selectedJobForATS, setSelectedJobForATS] = useState<JobListing | null>(null);
  const [selectedJobForOutreach, setSelectedJobForOutreach] = useState<JobListing | null>(null);
  const [selectedJobForSimulate, setSelectedJobForSimulate] = useState<JobListing | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

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

  const handleSimulationComplete = (job: JobListing) => {
    setCards((prev) => {
      const existing = prev.find((c) => c.job.id === job.id);
      if (existing) {
        return prev.map((c) =>
          c.job.id === job.id
            ? { ...c, status: 'OUTREACH_SENT', notes: 'Autonomous Playwright application & founder pitch dispatched.' }
            : c
        );
      }
      return [
        {
          id: `app-${Date.now()}`,
          job,
          status: 'OUTREACH_SENT',
          atsScore: 96,
          notes: 'Autonomous Playwright application & founder pitch dispatched.',
        },
        ...prev,
      ];
    });
  };

  // Structured FAQ Items (matching Schema.org in index.html)
  const FAQS = [
    {
      q: 'How does JobPilot bypass the ATS black hole for Indian startups?',
      a: 'Traditional job boards dump thousands of resumes into automated parsing filters (Ashby/Greenhouse). JobPilot circumvents this through a dual strategy: (1) It rewrites your resume using the Google X-Y-Z formula to guarantee high semantic relevance, and (2) It extracts verified founder and hiring manager contacts, empowering you to dispatch an 80% response rate cold pitch directly to the decision maker.',
    },
    {
      q: 'What is the CrackColdEmail 4-part winning formula?',
      a: 'Developed by Sumit Kesarwani, the formula structures cold outreach into 4 psychological components: (1) Context (the specific reason you are reaching out, like their recent YC launch or Series A), (2) Relevance (mapping your exact stack to their roadmap), (3) Proof (quantifiable metrics, such as scaling to 120k RPM or handling ₹40Cr daily volume), and (4) Small Ask (a frictionless question without a demanding 30-minute calendar link). All under 150 words.',
    },
    {
      q: 'How does JobPilot handle 60/90-day notice periods and buyouts in Bangalore startups?',
      a: 'The Indian tech ecosystem often faces strict 60 to 90-day notice periods. JobPilot tags startup openings that explicitly offer notice buyout assistance and pre-populates your pitch to highlight immediate onboarding readiness and notice buyout eligibility, preventing your application from being discarded for long notice durations.',
    },
    {
      q: 'How does the Aarivi-grade Gmail Inbound Auto-Tracker operate?',
      a: 'JobPilot monitors inbound interview invitations and Calendly links directly from hiring managers. When a founder replies or schedules a technical screening, the CRM card automatically advances from "Pitch Dispatched" to "Interview Booked", updating follow-up schedules in real time.',
    },
    {
      q: 'What is the hosted developer proof-of-work portfolio?',
      a: 'Instead of an unverified PDF resume, JobPilot creates a dedicated, responsive developer portfolio URL (e.g. jobpilot.dev/p/arjunmehta) featuring live throughput benchmarks, verified case studies, and engineering manager endorsements that founders can interact with directly in their browser.',
    },
  ];

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
        {/* Editorial Hero Section (Aarivi / Vercel / Explee Aesthetic) */}
        <section className="text-center max-w-4xl mx-auto space-y-4 pt-4 pb-2">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-mono tracking-wider">
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
              onSimulateApply={(job) => setSelectedJobForSimulate(job)}
              appliedJobIds={appliedJobIds}
            />
          )}

          {activeTab === 'ATS_LAB' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="bg-[#111115] p-8 rounded-2xl border border-neutral-800 text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-indigo-400 text-xs font-mono font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Google X-Y-Z Resume Tailoring Lab</span>
                </div>
                <h3 className="text-xl font-bold text-white">ATS Optimization & Metric Density Engine</h3>
                <p className="text-xs text-neutral-400 max-w-xl mx-auto leading-relaxed font-mono">
                  Every bullet point is systematically restructured to highlight quantifiable scale, latency metrics, and core architectural keywords matching target company tech stacks.
                </p>
              </div>

              {/* Quick Select Job Card Matrix for ATS */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
                  Select Target Startup to Tailor Resume:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {jobs.map((j) => (
                    <button
                      key={j.id}
                      onClick={() => setSelectedJobForATS(j)}
                      className="p-4 rounded-xl bg-[#111115] border border-neutral-800 hover:border-neutral-700 text-left space-y-2 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs group-hover:text-neutral-200">{j.company}</span>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          {j.source}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 truncate">{j.title}</p>
                      <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-400">
                        <FileCheck className="w-3 h-3 text-neutral-400" />
                        <span>Launch Diff & Download</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'OUTREACH' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="bg-[#111115] p-8 rounded-2xl border border-neutral-800 text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-emerald-400 text-xs font-mono font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>CrackColdEmail 80% Response Playbook</span>
                </div>
                <h3 className="text-xl font-bold text-white">Founder Multi-Channel Outreach Studio</h3>
                <p className="text-xs text-neutral-400 max-w-xl mx-auto leading-relaxed font-mono">
                  6 battle-tested cold outreach templates structured with Context, Relevance, Proof, and a Small Ask. Dispatches directly via Gmail, WhatsApp Web, or X (Twitter) DM.
                </p>
              </div>

              {/* Quick Select Founder Card Matrix for Outreach */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">
                  Select Founder to Draft Pitch:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {jobs.map((j) => (
                    <button
                      key={j.id}
                      onClick={() => setSelectedJobForOutreach(j)}
                      className="p-4 rounded-xl bg-[#111115] border border-neutral-800 hover:border-neutral-700 text-left space-y-2 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs group-hover:text-neutral-200">{j.company}</span>
                        <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                          {j.emailDeliverabilityPct}% Valid
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 truncate">{j.founderName} ({j.founderRole})</p>
                      <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-400">
                        <Send className="w-3 h-3 text-neutral-400" />
                        <span>Draft 80% Formula</span>
                      </div>
                    </button>
                  ))}
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

        {/* Interactive SEO Knowledge Base & FAQ Accordion (Opus 5.5 Level) */}
        <section className="bg-[#111115] p-6 sm:p-8 rounded-3xl border border-neutral-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white">
              <HelpCircle className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Engineering Playbook & Startup Reverse-Recruiter FAQ
              </h2>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">
                Everything you need to know about cracking startup engineering hiring in India.
              </p>
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {FAQS.map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-neutral-800 bg-[#0c0d12] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between text-neutral-200 hover:text-white transition-colors"
                  >
                    <span className="font-bold text-xs sm:text-sm font-sans">{faq.q}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 text-neutral-400 text-xs font-sans leading-relaxed border-t border-neutral-800/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
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

      {selectedJobForSimulate && (
        <AutopilotApplyModal
          job={selectedJobForSimulate}
          candidate={candidate}
          onClose={() => setSelectedJobForSimulate(null)}
          onApplicationCompleted={(job) => {
            handleSimulationComplete(job);
            setSelectedJobForSimulate(null);
          }}
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
