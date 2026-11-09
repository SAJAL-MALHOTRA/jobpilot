import { useState } from 'react';
import type { CandidateProfile, JobListing, ApplicationCard, KanbanStatus } from './types';
import { initialProfile } from './lib/defaultProfile';
import { curatedJobs } from './lib/jobRadarEngine';
import { Navbar } from './components/Navbar';
import { JobRadar } from './components/JobRadar';
import { JobPilotFeatures } from './components/JobPilotFeatures';
import { AtsResumeTailorModal } from './components/AtsResumeTailorModal';
import { OutreachModal } from './components/OutreachModal';
import { AutopilotApplyModal } from './components/AutopilotApplyModal';
import { ProfileVaultModal } from './components/ProfileVaultModal';
import { AutopilotTracker } from './components/AutopilotTracker';
import { PortfolioStudio } from './components/PortfolioStudio';
import { RadarGlobe3D } from './components/RadarGlobe3D';
import { TiltCard3D } from './components/TiltCard3D';
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
    <div className="min-h-screen bg-[#090A0F] text-[#EDEDED] flex flex-col font-sans selection:bg-white/20 selection:text-white jp-radar-glow">
      {/* 1. JobPilot Top Navigation */}
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
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-20">
        {/* 2. Hero Section with 3D Radar Globe */}
        <section className="relative text-center max-w-4xl mx-auto space-y-6 pt-12 pb-8 overflow-visible">
          {/* Interactive 3D WebGL Radar Canvas */}
          <RadarGlobe3D />

          {/* Subtle Ambient Mesh Accents */}
          <div className="absolute -left-20 top-0 bottom-0 w-32 jp-mesh-grid opacity-30 pointer-events-none hidden lg:block" />
          <div className="absolute -right-20 top-0 bottom-0 w-32 jp-mesh-grid opacity-30 pointer-events-none hidden lg:block" />

          {/* Content Wrapper to sit crisp above 3D WebGL canvas */}
          <div className="relative z-10 space-y-6">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#131520]/80 backdrop-blur-md border border-[#202436] text-xs font-mono text-[#A3A8BD] shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span>YC W24/S24 & Bangalore Startup Radar</span>
              <span className="text-[#4E546C]">•</span>
              <span className="text-white font-medium">80% Response Playbook</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.08] drop-shadow-sm">
              Your career search, on <br />
              <span className="bg-gradient-to-r from-white via-neutral-200 to-indigo-300 bg-clip-text text-transparent">
                autopilot.
              </span>
            </h1>

            {/* Subtitle with Dotted Underlines */}
            <p className="text-base sm:text-lg text-[#8C93A8] max-w-2xl mx-auto font-sans leading-relaxed">
              JobPilot reverse-engineers startup hiring: indexes unadvertised roles, <span className="jp-dotted-link text-white cursor-pointer" onClick={() => setActiveModal('OUTREACH')}>cold emails</span> founders directly, tracks every application via Gmail, and builds your <span className="jp-dotted-link text-white cursor-pointer" onClick={() => setActiveModal('PORTFOLIO')}>proof-of-work</span> portfolio.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={scrollToDashboard}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-[#EDEDED] text-black font-semibold text-sm transition-all shadow-xl group"
              >
                <span>Explore Open Roles</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </button>

              <button
                onClick={() => setActiveModal('OUTREACH')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#141622]/90 backdrop-blur-md hover:bg-[#1C1F30] border border-[#23273B] text-white font-semibold text-sm transition-all shadow-md"
              >
                <span>CrackColdEmail Playbook</span>
              </button>
            </div>
          </div>
        </section>

        {/* 3. The Central Embedded Dashboard with 3D Specular Tilt */}
        <section id="dashboard-view" className="scroll-mt-24">
          <TiltCard3D maxTilt={2} className="rounded-2xl">
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
              onOpenAtsLab={() => setActiveModal('ATS')}
            />
          </TiltCard3D>
        </section>

        {/* 4. Feature Bento Grid & Engineering Stories */}
        <section>
          <JobPilotFeatures
            onOpenOutreachModal={() => setActiveModal('OUTREACH')}
            onOpenPortfolioModal={() => setActiveModal('PORTFOLIO')}
            onOpenApplicationsTab={() => setActiveModal('APPLICATIONS')}
          />
        </section>
      </main>

      {/* 5. Modals */}
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
          <div className="bg-[#10121A] border border-[#1E2230] rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 space-y-6 text-white font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2230]">
              <div className="flex items-center gap-2">
                <span className="text-base">⚡</span>
                <h3 className="font-bold text-sm text-white">Application Pipeline & Gmail Inbound Sync</h3>
              </div>
              <button
                onClick={() => setActiveModal('NONE')}
                className="px-3 py-1 bg-[#1A1D2B] hover:bg-[#252A3D] rounded-md text-xs text-[#A3A8BD] hover:text-white font-mono"
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
          <div className="bg-[#10121A] border border-[#1E2230] rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 space-y-6 text-white font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2230]">
              <div className="flex items-center gap-2">
                <span className="text-base">💻</span>
                <h3 className="font-bold text-sm text-white">Developer Proof-of-Work Portfolio Studio</h3>
              </div>
              <button
                onClick={() => setActiveModal('NONE')}
                className="px-3 py-1 bg-[#1A1D2B] hover:bg-[#252A3D] rounded-md text-xs text-[#A3A8BD] hover:text-white font-mono"
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

      {/* 6. JobPilot Footer */}
      <footer className="bg-[#07080C] border-t border-[#161822] py-12 text-xs font-mono text-[#687087] mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold">
            <div className="w-5 h-5 rounded bg-white text-black flex items-center justify-center font-bold text-[10px]">
              JP
            </div>
            <span>JobPilot</span>
            <span className="text-[#4E546C] font-normal">— Autonomous Reverse Recruiter for Tech Startups</span>
          </div>

          <div className="flex items-center gap-6 text-[11px] text-[#A3A8BD]">
            <span className="hover:text-white transition-colors cursor-pointer">Indiranagar · Koramangala · HSR Layout · Remote</span>
            <span className="text-[#2B3042]">•</span>
            <span>JobPilot AI © 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
