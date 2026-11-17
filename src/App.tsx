import { useState, useEffect } from 'react';
import type { CandidateProfile, JobListing, ApplicationCard, KanbanStatus } from './types';
import { initialProfile } from './lib/defaultProfile';
import { curatedJobs } from './lib/jobRadarEngine';
import { Navbar } from './components/Navbar';
import { JobRadar } from './components/JobRadar';
import { JobPilotFeatures } from './components/JobPilotFeatures';
import { WorkflowFAQ } from './components/WorkflowFAQ';
import { AtsResumeTailorModal } from './components/AtsResumeTailorModal';
import { OutreachModal } from './components/OutreachModal';
import { ProfileVaultModal } from './components/ProfileVaultModal';
import { AutopilotTracker } from './components/AutopilotTracker';
import { PortfolioStudio } from './components/PortfolioStudio';
import { PreFooterCTA } from './components/PreFooterCTA';
import { Footer } from './components/Footer';
import { ArrowDown, Mail, Code2 } from 'lucide-react';

const INITIAL_CARDS: ApplicationCard[] = [];

// --- Storage validation helpers ---
const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((i) => typeof i === 'string');

const isApplicationCardList = (v: unknown): v is ApplicationCard[] =>
  Array.isArray(v) &&
  v.every(
    (c) =>
      isRecord(c) &&
      typeof c.id === 'string' &&
      isRecord(c.job) &&
      typeof (c.job as Record<string, unknown>).id === 'string' &&
      typeof (c.job as Record<string, unknown>).title === 'string' &&
      typeof (c.job as Record<string, unknown>).company === 'string' &&
      typeof c.notes === 'string' &&
      typeof c.atsScore === 'number' &&
      ['DISCOVERED', 'TAILORED', 'OUTREACH_SENT', 'INTERVIEW_SCHEDULED', 'OFFER', 'REJECTED'].includes(
        String(c.status)
      )
  );

const isCandidateProfile = (v: unknown): v is CandidateProfile =>
  isRecord(v) &&
  typeof v.id === 'string' &&
  typeof v.fullName === 'string' &&
  typeof v.email === 'string' &&
  Array.isArray(v.primarySkills) &&
  Array.isArray(v.resumeBullets);

function readLocalJson<T>(key: string, isValid: (v: unknown) => v is T, fallback: T): T {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (isValid(parsed)) return parsed;
  } catch { /* fall through */ }
  // Backup corrupted data before discarding
  if (raw !== null) {
    try { localStorage.setItem(`${key}:invalid-backup`, raw); } catch { /* best-effort */ }
  }
  return fallback;
}

export function App() {
  const [storageError, setStorageError] = useState(false);

  const [candidate, setCandidate] = useState<CandidateProfile>(() =>
    readLocalJson('jobpilot_candidate', isCandidateProfile, initialProfile)
  );

  const [jobs] = useState<JobListing[]>(curatedJobs);
  const [activeModal, setActiveModal] = useState<'NONE' | 'ATS' | 'OUTREACH' | 'PROFILE' | 'APPLICATIONS' | 'PORTFOLIO'>('NONE');
  const [selectedJob, setSelectedJob] = useState<JobListing>(curatedJobs[0]);

  // Load persistent application pipeline from localStorage with shape validation
  const [cards, setCards] = useState<ApplicationCard[]>(() =>
    readLocalJson('jobpilot_cards', isApplicationCardList, INITIAL_CARDS)
  );

  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(() => {
    const arr = readLocalJson('jobpilot_applied_ids', isStringArray, []);
    return new Set(arr);
  });

  // Save changes to localStorage with visible error reporting
  useEffect(() => {
    let failed = false;
    const tryWrite = (key: string, value: string) => {
      try { localStorage.setItem(key, value); }
      catch { failed = true; }
    };
    tryWrite('jobpilot_cards', JSON.stringify(cards));
    tryWrite('jobpilot_applied_ids', JSON.stringify(Array.from(appliedJobIds)));
    tryWrite('jobpilot_candidate', JSON.stringify(candidate));
    setStorageError(failed);
  }, [cards, appliedJobIds, candidate]);

  const handleAddToPipeline = (job: JobListing) => {
    if (appliedJobIds.has(job.id)) return;
    setAppliedJobIds(new Set([...appliedJobIds, job.id]));
    const newCard: ApplicationCard = {
      id: `app-${Date.now()}`,
      job,
      status: 'DISCOVERED',
      atsScore: job.atsMatchScore || 80,
      notes: 'Added to tracking board.',
    };
    setCards([newCard, ...cards]);
  };

  const handleDirectApply = (job: JobListing) => {
    // Open career search or direct job URL — does NOT falsely mark as applied
    const destination = job.jobUrl || `https://www.google.com/search?q=${encodeURIComponent(job.company + ' ' + job.title + ' careers')}`;
    window.open(destination, '_blank', 'noopener,noreferrer');

    // Track in pipeline as DISCOVERED (not falsely as OUTREACH_SENT)
    if (!appliedJobIds.has(job.id)) {
      setAppliedJobIds(new Set([...appliedJobIds, job.id]));
      setCards((prev) => {
        const exists = prev.find(c => c.job.id === job.id);
        if (exists) return prev;
        return [{
          id: `app-${Date.now()}`,
          job,
          status: 'DISCOVERED',
          atsScore: job.atsMatchScore || 80,
          notes: 'Opened careers page for review.',
        }, ...prev];
      });
    }
  };

  const handleUpdateCardStatus = (cardId: string, nextStatus: KanbanStatus) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, status: nextStatus } : c))
    );
  };

  const handleUpdateCard = (updatedCard: ApplicationCard) => {
    setCards((prev) =>
      prev.map((c) => (c.id === updatedCard.id ? updatedCard : c))
    );
  };

  const handleAddCustomCard = (newCard: ApplicationCard) => {
    setCards((prev) => [newCard, ...prev]);
  };

  const handleRemoveCard = (cardId: string) => {
    setCards((prev) => {
      const card = prev.find((c) => c.id === cardId);
      if (card) {
        // Clean up appliedJobIds so the job can be re-added later
        setAppliedJobIds((ids) => {
          const next = new Set(ids);
          next.delete(card.job.id);
          return next;
        });
      }
      return prev.filter((c) => c.id !== cardId);
    });
  };

  const handleLogOutreachSent = (job: JobListing, subject: string, body: string) => {
    setAppliedJobIds(new Set([...appliedJobIds, job.id]));
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
          atsScore: job.atsMatchScore || 80,
          outreachSubject: subject,
          outreachBody: body,
          notes: 'Pitch dispatched to founder.',
        },
        ...prev,
      ];
    });
  };

  const scrollToDashboard = () => {
    const el = document.getElementById('dashboard-view');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToFaq = () => {
    const el = document.getElementById('faq');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#EDEDED] flex flex-col font-sans selection:bg-white/20 selection:text-white">
      {/* 1. JobPilot Clean Navigation */}
      <Navbar
        activeTab="RADAR"
        setActiveTab={(tab) => {
          if (tab === 'OUTREACH') setActiveModal('OUTREACH');
          else if (tab === 'ATS_LAB') setActiveModal('ATS');
          else if (tab === 'CRM') setActiveModal('APPLICATIONS');
          else if (tab === 'PORTFOLIO') setActiveModal('PORTFOLIO');
          else scrollToDashboard();
        }}
        onOpenProfile={() => setActiveModal('PROFILE')}
        candidateName={candidate.fullName}
        candidateYoe={candidate.yearsOfExperience}
        applicationsCount={cards.length}
        onOpenFaq={scrollToFaq}
      />

      {/* Storage Warning Banner */}
      {storageError && (
        <div
          role="status"
          className="bg-amber-950/60 border-b border-amber-900/60 text-amber-300 px-4 py-2 text-xs font-mono text-center flex items-center justify-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>Browser storage is unavailable or full; changes may not persist across sessions.</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* 2. Hero Section: Minimalist, Pure Black Engineering Aesthetic */}
        <section className="text-center max-w-3xl mx-auto space-y-6 pt-8 pb-4">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A0A0A] border border-[#222222] text-xs font-mono text-[#888888]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Example startup listings · Bangalore & YC</span>
            <span className="text-[#333333]">•</span>
            <span className="text-white">Sample data</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Find your next role. <br />
            <span className="text-[#888888]">Make your next move.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#888888] max-w-xl mx-auto font-sans leading-relaxed">
            Explore example startup listings, compare required skills, draft founder outreach, and keep your application pipeline in one browser-based workspace.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={scrollToDashboard}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-colors shadow-sm"
            >
              <span>Browse {jobs.length} Sample Roles</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveModal('OUTREACH')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#111111] hover:bg-[#1A1A1A] border border-[#262626] text-white font-medium text-xs transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#888888]" />
              <span>Open Pitch Composer</span>
            </button>

            <button
              onClick={() => setActiveModal('PORTFOLIO')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#111111] hover:bg-[#1A1A1A] border border-[#262626] text-[#AAAAAA] hover:text-white font-medium text-xs transition-colors"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Import GitHub Profile</span>
            </button>
          </div>
        </section>

        {/* 3. The Central Embedded Dashboard */}
        <section id="dashboard-view" className="scroll-mt-24">
          <JobRadar
            jobs={jobs}
            candidate={candidate}
            onSelectJobForATS={(job) => {
              setSelectedJob(job);
              setActiveModal('ATS');
            }}
            onSelectJobForOutreach={(job) => {
              setSelectedJob(job);
              setActiveModal('OUTREACH');
            }}
            onAddToPipeline={handleAddToPipeline}
            onSimulateApply={handleDirectApply}
            appliedJobIds={appliedJobIds}
            onOpenPortfolio={() => setActiveModal('PORTFOLIO')}
            onOpenApplications={() => setActiveModal('APPLICATIONS')}
            onOpenAtsLab={() => setActiveModal('ATS')}
          />
        </section>

        {/* 4. Feature Bento Grid & Engineering Stories */}
        <section>
          <JobPilotFeatures
            jobs={jobs}
            trackedCount={cards.length}
            onOpenOutreachModal={() => setActiveModal('OUTREACH')}
            onOpenPortfolioModal={() => setActiveModal('PORTFOLIO')}
            onOpenApplicationsTab={() => setActiveModal('APPLICATIONS')}
            onExploreRoles={scrollToDashboard}
          />
        </section>

        {/* 5. Clear Workflow FAQ */}
        <section id="faq">
          <WorkflowFAQ />
        </section>

        {/* 6. Pre-Footer Launchpad CTA */}
        <section>
          <PreFooterCTA
            roleCount={jobs.length}
            onLaunchRadar={scrollToDashboard}
            onOpenOutreach={() => setActiveModal('OUTREACH')}
            onOpenPortfolio={() => setActiveModal('PORTFOLIO')}
          />
        </section>
      </main>

      {/* 6. Modals */}
      {/* Cold Email to Founder Modal */}
      {activeModal === 'OUTREACH' && (
        <OutreachModal
          job={selectedJob}
          candidate={candidate}
          onClose={() => setActiveModal('NONE')}
          onLogOutreachSent={handleLogOutreachSent}
        />
      )}

      {/* ATS Resume Tailor Modal */}
      {activeModal === 'ATS' && (
        <AtsResumeTailorModal
          job={selectedJob}
          candidate={candidate}
          onClose={() => setActiveModal('NONE')}
          onProceedToOutreach={(job) => {
            setSelectedJob(job);
            setActiveModal('OUTREACH');
          }}
        />
      )}

      {/* Candidate Profile Vault Modal */}
      {activeModal === 'PROFILE' && (
        <ProfileVaultModal
          candidate={candidate}
          onSave={(updated) => {
            setCandidate(updated);
            setActiveModal('NONE');
          }}
          onClose={() => setActiveModal('NONE')}
        />
      )}

      {/* Applications Kanban Modal */}
      {activeModal === 'APPLICATIONS' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl max-w-6xl w-full max-h-[94vh] overflow-y-auto shadow-2xl p-5 sm:p-6 space-y-6 text-white font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F1F1F]">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">Application Pipeline Tracker</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141414] text-[#888888] border border-[#262626]">
                  {cards.length} Tracked
                </span>
              </div>
              <button
                onClick={() => setActiveModal('NONE')}
                className="px-3 py-1 bg-[#141414] hover:bg-[#1F1F1F] rounded-md text-xs text-[#888888] hover:text-white font-mono border border-[#262626]"
              >
                Close
              </button>
            </div>
            <AutopilotTracker
              cards={cards}
              onUpdateCardStatus={handleUpdateCardStatus}
              onUpdateCard={handleUpdateCard}
              onAddCustomCard={handleAddCustomCard}
              onRemoveCard={handleRemoveCard}
              onOpenOutreachForCard={(job) => {
                setSelectedJob(job);
                setActiveModal('OUTREACH');
              }}
            />
          </div>
        </div>
      )}

      {/* Proof of Work Portfolio Modal */}
      {activeModal === 'PORTFOLIO' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 space-y-6 text-white font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F1F1F]">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-white" />
                <h3 className="font-bold text-sm text-white">GitHub Proof-of-Work Fetcher</h3>
              </div>
              <button
                onClick={() => setActiveModal('NONE')}
                className="px-3 py-1 bg-[#141414] hover:bg-[#1F1F1F] rounded-md text-xs text-[#888888] hover:text-white font-mono border border-[#262626]"
              >
                Close
              </button>
            </div>
            <PortfolioStudio
              candidate={candidate}
              onNavigateToOutreach={() => {
                setActiveModal('OUTREACH');
              }}
            />
          </div>
        </div>
      )}

      {/* 7. Comprehensive Enterprise Tech Footer */}
      <Footer
        onOpenOutreach={() => setActiveModal('OUTREACH')}
        onOpenPortfolio={() => setActiveModal('PORTFOLIO')}
        onOpenAts={() => setActiveModal('ATS')}
        onOpenTracker={() => setActiveModal('APPLICATIONS')}
        onLaunchRadar={scrollToDashboard}
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />
    </div>
  );
}

export default App;
