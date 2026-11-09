import { useState } from 'react';
import type { CandidateProfile, JobListing, ApplicationCard, KanbanStatus } from './types';
import { initialProfile } from './lib/defaultProfile';
import { curatedJobs } from './lib/jobRadarEngine';
import { JobRadar } from './components/JobRadar';
import { AariviBentoFeatures } from './components/AariviBentoFeatures';
import { AtsResumeTailorModal } from './components/AtsResumeTailorModal';
import { OutreachModal } from './components/OutreachModal';
import { AutopilotApplyModal } from './components/AutopilotApplyModal';
import { ProfileVaultModal } from './components/ProfileVaultModal';
import { AutopilotTracker } from './components/AutopilotTracker';
import { PortfolioStudio } from './components/PortfolioStudio';
import confetti from 'canvas-confetti';

export function App() {
  const [candidate, setCandidate] = useState<CandidateProfile>(initialProfile);
  const [jobs] = useState<JobListing[]>(curatedJobs);
  const [activeModal, setActiveModal] = useState<'NONE' | 'ATS' | 'OUTREACH' | 'SIMULATE' | 'PROFILE' | 'APPLICATIONS' | 'PORTFOLIO'>('NONE');
  const [selectedJob, setSelectedJob] = useState<JobListing>(curatedJobs[0]);

  // Track applied cards
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set(['job-01', 'job-02']));
  const [cards, setCards] = useState<ApplicationCard[]>([
    {
      id: 'app-01',
      job: curatedJobs[0],
      status: 'OUTREACH_SENT',
      atsScore: 82,
      appliedDate: 'Yesterday',
      notes: 'Founder cold email dispatched to Aarav Singhania (CEO).',
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
  ]);

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
    confetti({
      particleCount: 20,
      spread: 40,
      origin: { y: 0.8 },
      colors: ['#FFFFFF', '#10B981']
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
          notes: 'Outreach dispatched to founder.',
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
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] flex flex-col font-sans selection:bg-white/20 selection:text-white">
      {/* 1. Aarivi Top Navigation (Image 1) */}
      <header className="sticky top-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#1A1A1A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo (Triangle Glyph + Aarivi wordmark) */}
          <div className="flex items-center gap-2 text-white font-bold tracking-tight text-base cursor-pointer">
            <span className="text-sm">▲</span>
            <span>Aarivi</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#171717] border border-[#262626] text-[#A3A3A3] ml-1">
              JobPilot v2
            </span>
          </div>

          {/* Links (Image 1) */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#888888]">
            <a href="#dashboard-view" className="hover:text-white transition-colors">Features</a>
            <a href="#dashboard-view" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq-section" className="hover:text-white transition-colors">Faq</a>
            <a href="mailto:hi@aarivi.com" className="hover:text-white transition-colors">Contact</a>
          </nav>

          {/* Right CTA Button (Image 1) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveModal('PROFILE')}
              className="text-xs text-[#888888] hover:text-white transition-colors hidden sm:inline"
            >
              {candidate.fullName}
            </button>
            <button
              onClick={scrollToDashboard}
              className="px-4 py-2 rounded-full bg-white hover:bg-[#F0F0F0] text-black font-semibold text-xs transition-all shadow-sm"
            >
              Get started
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-20">
        {/* 2. Aarivi Landing Hero Section (Pixel Matched to Image 1) */}
        <section className="relative text-center max-w-4xl mx-auto space-y-6 pt-8 pb-4">
          {/* Subtle Halftone Pattern Accents on Left & Right */}
          <div className="absolute -left-20 top-0 bottom-0 w-32 aarivi-dots opacity-40 pointer-events-none hidden lg:block" />
          <div className="absolute -right-20 top-0 bottom-0 w-32 aarivi-dots opacity-40 pointer-events-none hidden lg:block" />

          {/* Eyebrow Pill (Image 1) */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#141414] border border-[#262626] text-xs font-sans text-neutral-300">
            <span className="px-1.5 py-0.2 rounded bg-[#262626] text-white text-[10px] font-bold">New</span>
            <span>Watch the demo</span>
            <span className="text-[#888888]">→</span>
          </div>

          {/* Headline (Exact Two-Line Stagger from Image 1) */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.08]">
            Your job hunt, on <br />
            autopilot
          </h1>

          {/* Subtitle with Dotted Underlines (Image 1) */}
          <p className="text-base sm:text-lg text-[#A3A3A3] max-w-2xl mx-auto font-sans leading-relaxed">
            Aarivi finds jobs, <span className="dotted-link text-white cursor-pointer" onClick={() => setActiveModal('OUTREACH')}>cold emails</span> your profile to <span className="dotted-link text-white cursor-pointer" onClick={() => setActiveModal('OUTREACH')}>founders</span>, tracks every application, and builds your resume and portfolio.
          </p>

          {/* CTA Button (Image 1) */}
          <div className="pt-2">
            <button
              onClick={scrollToDashboard}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-[#F0F0F0] text-black font-semibold text-sm transition-all shadow-md group"
            >
              <span>Get started</span>
              <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </button>
          </div>
        </section>

        {/* 3. The Central Embedded Dashboard (Exact Match to Image 2) */}
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
            onSimulateApply={(job) => {
              setSelectedJob(job);
              setActiveModal('SIMULATE');
            }}
            appliedJobIds={appliedJobIds}
            onOpenPortfolio={() => setActiveModal('PORTFOLIO')}
            onOpenApplications={() => setActiveModal('APPLICATIONS')}
          />
        </section>

        {/* 4. Aarivi Feature Bento Grid & Testimonials (Images 4, 5, 6, 7) */}
        <section>
          <AariviBentoFeatures
            onOpenOutreachModal={() => setActiveModal('OUTREACH')}
            onOpenPortfolioModal={() => setActiveModal('PORTFOLIO')}
            onOpenApplicationsTab={() => setActiveModal('APPLICATIONS')}
          />
        </section>
      </main>

      {/* 5. Modals (Overlays when user clicks actions) */}
      {/* Cold Email to Founder Modal (Image 5) */}
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

      {/* Autonomous Apply Simulator Modal */}
      {activeModal === 'SIMULATE' && (
        <AutopilotApplyModal
          job={selectedJob}
          candidate={candidate}
          onClose={() => setActiveModal('NONE')}
          onApplicationCompleted={(job) => {
            handleAddToPipeline(job);
            setActiveModal('NONE');
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#121212] border border-[#262626] rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 space-y-6 text-white font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
              <div className="flex items-center gap-2">
                <span className="text-base">⚡</span>
                <h3 className="font-bold text-sm text-white">Application Pipeline & Gmail Tracking</h3>
              </div>
              <button
                onClick={() => setActiveModal('NONE')}
                className="px-3 py-1 bg-[#1C1C1C] hover:bg-[#262626] rounded-md text-xs text-[#A3A3A3] hover:text-white"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#121212] border border-[#262626] rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 space-y-6 text-white font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
              <div className="flex items-center gap-2">
                <span className="text-base">💻</span>
                <h3 className="font-bold text-sm text-white">Developer Proof-of-Work Portfolio</h3>
              </div>
              <button
                onClick={() => setActiveModal('NONE')}
                className="px-3 py-1 bg-[#1C1C1C] hover:bg-[#262626] rounded-md text-xs text-[#A3A3A3] hover:text-white"
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

      {/* 6. Footer (Aarivi Style) */}
      <footer className="bg-[#050505] border-t border-[#1F1F1F] py-12 text-xs font-mono text-[#737373] mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <span>▲</span>
            <span>Aarivi</span>
            <span className="text-[#525252] font-normal">— find jobs & get hired faster</span>
          </div>

          <div className="flex items-center gap-6 text-[11px] text-[#A3A3A3]">
            <a href="mailto:hi@aarivi.com" className="hover:text-white transition-colors">hi@aarivi.com</a>
            <span className="text-[#333]">•</span>
            <span>Bengaluru · Remote · San Francisco</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
