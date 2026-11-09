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
import { Sparkles, Bot, Zap, ShieldCheck } from 'lucide-react';
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
      job: curatedJobs[4], // Sarvam AI
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
      colors: ['#6366F1', '#10B981']
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
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 flex flex-col font-sans">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        autopilotEnabled={autopilotEnabled}
        setAutopilotEnabled={setAutopilotEnabled}
        onOpenProfile={() => setIsProfileOpen(true)}
        applicationsCount={cards.length}
        interviewsCount={cards.filter((c) => c.status === 'INTERVIEW_SCHEDULED').length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-3 pt-2 pb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Reverse Recruiter</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Apply to top tech jobs while you sleep.
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            JobPilot aggregates vetted YC & Series A+ openings, tailors your resume for 95%+ ATS pass rates, and pitches founders directly with proof-of-work outreach.
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-indigo-400" />
              <span>Candidate: <strong className="text-slate-200">{candidate.fullName}</strong> ({candidate.headline.split('(')[0].trim()})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Target CTC: <strong className="text-emerald-400">₹{candidate.minTargetCtcLpa}L+ LPA</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Location: <strong className="text-slate-200">{candidate.locationPreference}</strong></span>
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
            <div className="space-y-6">
              <div className="bg-[#101625] p-6 rounded-2xl border border-slate-800 text-center space-y-2">
                <h3 className="text-base font-bold text-white">ATS Resume Optimization Lab</h3>
                <p className="text-xs text-slate-400 max-w-xl mx-auto">
                  Select any job from the Radar to open the full Before/After bullet point diff, keyword frequency analyzer, and Google XYZ metrics formatter.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setSelectedJobForATS(jobs[0])}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                  >
                    Inspect Sample: {jobs[0].company} ({jobs[0].title})
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'OUTREACH' && (
            <div className="space-y-6">
              <div className="bg-[#101625] p-6 rounded-2xl border border-slate-800 text-center space-y-2">
                <h3 className="text-base font-bold text-white">Founder Cold Outreach Studio</h3>
                <p className="text-xs text-slate-400 max-w-xl mx-auto">
                  Generate hyper-personalized 3-line cold emails, technical proof-of-work pitches, and LinkedIn DMs directly addressed to startup founders.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setSelectedJobForOutreach(jobs[0])}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                  >
                    Draft Outreach for: {jobs[0].company} (Founder: {jobs[0].founderName})
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

        {/* Live Agent Activity Terminal */}
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

      {/* Modern Dark Footer */}
      <footer className="bg-[#0B0F19] border-t border-slate-800/80 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold text-[10px]">
              JP
            </div>
            <span className="font-bold text-slate-300">JobPilot AI</span>
            <span>— Autonomous Career Agent</span>
          </div>

          <div className="flex items-center gap-5 text-slate-400">
            <span>Y Combinator W24/S24 Radar</span>
            <span>ATS Google XYZ Scoring</span>
            <span>Founder Direct Pitch</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
