import { useState, useEffect } from 'react';
import type { CandidateProfile, JobListing, ApplicationCard, KanbanStatus } from './types';
import { initialProfile } from './lib/defaultProfile';
import { curatedJobs } from './lib/jobRadarEngine';
import { Navbar } from './components/Navbar';
import { JobRadar } from './components/JobRadar';
import { JobPilotFeatures } from './components/JobPilotFeatures';
import { AtsResumeTailorModal } from './components/AtsResumeTailorModal';
import { OutreachModal } from './components/OutreachModal';
import { ProfileVaultModal } from './components/ProfileVaultModal';
import { AutopilotTracker } from './components/AutopilotTracker';
import { PortfolioStudio } from './components/PortfolioStudio';
import { PreFooterCTA } from './components/PreFooterCTA';
import { Footer } from './components/Footer';
import { ArrowDown, Mail, Code2 } from 'lucide-react';

const INITIAL_CARDS: ApplicationCard[] = [
  {
    id: 'app-01',
    job: curatedJobs[0],
    status: 'OUTREACH_SENT',
    atsScore: 82,
    appliedDate: 'Yesterday',
    notes: 'Pitch dispatched to Aarav Singhania (CEO).',
  },
  {
    id: 'app-02',
    job: curatedJobs[1],
    status: 'TAILORED',
    atsScore: 82,
    notes: 'Resume tailored for Spark streaming and ClickHouse architecture.',
  },
  {
    id: 'app-03',
    job: curatedJobs[2],
    status: 'INTERVIEW_SCHEDULED',
    atsScore: 81,
    notes: 'Technical screening booked with Maya Iyer for Thursday 4:00 PM.',
  },
];

export function App() {
  const [candidate, setCandidate] = useState<CandidateProfile>(() => {
    try {
      const saved = localStorage.getItem('jobpilot_candidate');
      return saved ? JSON.parse(saved) : initialProfile;
    } catch {
      return initialProfile;
    }
  });

  const [jobs] = useState<JobListing[]>(curatedJobs);
  const [activeModal, setActiveModal] = useState<'NONE' | 'ATS' | 'OUTREACH' | 'PROFILE' | 'APPLICATIONS' | 'PORTFOLIO'>('NONE');
  const [selectedJob, setSelectedJob] = useState<JobListing>(curatedJobs[0]);

  // Load persistent application pipeline from localStorage
  const [cards, setCards] = useState<ApplicationCard[]>(() => {
    try {
      const saved = localStorage.getItem('jobpilot_cards');
      return saved ? JSON.parse(saved) : INITIAL_CARDS;
    } catch {
      return INITIAL_CARDS;
    }
  });

  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('jobpilot_applied_ids');
      return saved ? new Set(JSON.parse(saved)) : new Set(['job-01', 'job-02', 'job-03']);
    } catch {
      return new Set(['job-01', 'job-02', 'job-03']);
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('jobpilot_cards', JSON.stringify(cards));
      localStorage.setItem('jobpilot_applied_ids', JSON.stringify(Array.from(appliedJobIds)));
      localStorage.setItem('jobpilot_candidate', JSON.stringify(candidate));
    } catch {
      // Storage unavailable or quota exceeded
    }
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
    // Real action: Open company careers / website URL and track in pipeline
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(job.company + ' ' + job.title + ' careers')}`;
    window.open(searchUrl, '_blank');

    // Add to applied cards
    setAppliedJobIds(new Set([...appliedJobIds, job.id]));
    setCards((prev) => {
      const exists = prev.find(c => c.job.id === job.id);
      if (exists) {
        return prev.map(c => c.job.id === job.id ? { ...c, status: 'OUTREACH_SENT', notes: 'Opened careers page.' } : c);
      }
      return [{
        id: `app-${Date.now()}`,
        job,
        status: 'OUTREACH_SENT',
        atsScore: job.atsMatchScore || 80,
        notes: 'Opened company careers page.',
      }, ...prev];
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
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* 2. Hero Section: Minimalist, Pure Black Engineering Aesthetic */}
        <section className="text-center max-w-3xl mx-auto space-y-6 pt-8 pb-4">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A0A0A] border border-[#222222] text-xs font-mono text-[#888888]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Bangalore Tech Corridors · YC W24/S24 Startups</span>
            <span className="text-[#333333]">•</span>
            <span className="text-white">Verified Founder Inboxes</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Pitch founders directly. <br />
            <span className="text-[#888888]">Skip the ATS void.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#888888] max-w-xl mx-auto font-sans leading-relaxed">
            Index unadvertised seed roles across Indiranagar, Koramangala, and HSR Layout. Generate verified 4-part pitches with working Gmail links and real GitHub proof over generic CVs.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={scrollToDashboard}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-colors shadow-sm"
            >
              <span>Explore 14 Verified Roles</span>
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
              <span>Import GitHub Proof</span>
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
            onOpenOutreachModal={() => setActiveModal('OUTREACH')}
            onOpenPortfolioModal={() => setActiveModal('PORTFOLIO')}
            onOpenApplicationsTab={() => setActiveModal('APPLICATIONS')}
            onExploreCluster={() => scrollToDashboard()}
          />
        </section>

        {/* 5. Pre-Footer Launchpad CTA */}
        <section>
          <PreFooterCTA
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#0A0A0A] border border-[#222222] rounded-xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 space-y-6 text-white font-sans">
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
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />
    </div>
  );
}

export default App;