import { useState, useEffect, useMemo } from 'react';
import type { CandidateProfile, JobListing, ApplicationCard, KanbanStatus } from './types';
import { initialProfile } from './lib/defaultProfile';
import { curatedJobs } from './lib/jobRadarEngine';
import { WorkspaceSidebar, type CorridorFilter } from './components/WorkspaceSidebar';
import { OpportunityDiscover } from './components/OpportunityDiscover';
import { JobInspectorDrawer } from './components/JobInspectorDrawer';
import { CommandPalette, type WorkspaceTab } from './components/CommandPalette';
import { AutopilotTracker } from './components/AutopilotTracker';
import { AtsResumeTailorModal } from './components/AtsResumeTailorModal';
import { OutreachModal } from './components/OutreachModal';
import { ProfileVaultModal } from './components/ProfileVaultModal';
import { PortfolioStudio } from './components/PortfolioStudio';
import { WorkflowFAQ } from './components/WorkflowFAQ';
import { CompanySwipeDeck } from './components/CompanySwipeDeck';
import { JobPilotLanding } from './components/JobPilotLanding';
import { ResumeScannerModal } from './components/ResumeScannerModal';
import StatusIsland, { type IslandTask } from './components/kokonutui/status-island';
import { 
  FileText, 
  Send, 
  Menu
} from 'lucide-react';

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
  if (raw !== null) {
    try { localStorage.setItem(`${key}:invalid-backup`, raw); } catch { /* best-effort */ }
  }
  return fallback;
}

export function App() {
  const [storageError, setStorageError] = useState(false);

  // Core Candidate Profile
  const [candidate, setCandidate] = useState<CandidateProfile>(() =>
    readLocalJson('jobpilot_candidate', isCandidateProfile, initialProfile)
  );

  // Jobs Catalog
  const [jobs] = useState<JobListing[]>(curatedJobs);

  // Applications Pipeline State
  const [cards, setCards] = useState<ApplicationCard[]>(() =>
    readLocalJson('jobpilot_cards', isApplicationCardList, INITIAL_CARDS)
  );

  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(() => {
    const arr = readLocalJson('jobpilot_applied_ids', isStringArray, []);
    return new Set(arr);
  });

  // Navigation State (defaults to LANDING to present the structured process)
  const [activeTab, setActiveTab] = useState<WorkspaceTab>(() => {
    const saved = localStorage.getItem('jobpilot_active_tab');
    return (saved && ['LANDING', 'DIRECTORY', 'PIPELINE', 'SWIPE', 'ATS_LAB', 'OUTREACH', 'PORTFOLIO', 'PROFILE', 'FAQ'].includes(saved))
      ? (saved as WorkspaceTab)
      : 'LANDING';
  });

  useEffect(() => {
    localStorage.setItem('jobpilot_active_tab', activeTab);
  }, [activeTab]);
  const [corridorFilter, setCorridorFilter] = useState<CorridorFilter>('ALL');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Inspector & Command Palette State
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isResumeScannerOpen, setIsResumeScannerOpen] = useState(false);

  // Standalone Modals
  const [modalMode, setModalMode] = useState<'NONE' | 'ATS_MODAL' | 'OUTREACH_MODAL' | 'PROFILE_MODAL'>('NONE');

  // Apple Light / Dark Theme State (Light Mode default)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('jobpilot_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  // Kokonut UI Dynamic Island Tasks
  const [islandTasks, setIslandTasks] = useState<IslandTask[]>([
    {
      id: 'init-sync',
      label: 'Opportunity Radar',
      detail: `${curatedJobs.length} verified startup listings active`,
      status: 'done',
    },
  ]);

  useEffect(() => {
    localStorage.setItem('jobpilot_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Persistence to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('jobpilot_cards', JSON.stringify(cards));
      localStorage.setItem('jobpilot_applied_ids', JSON.stringify(Array.from(appliedJobIds)));
      localStorage.setItem('jobpilot_candidate', JSON.stringify(candidate));
    } catch {
      queueMicrotask(() => {
        setStorageError(true);
      });
    }
  }, [cards, appliedJobIds, candidate]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs/textareas
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === '1') {
        setActiveTab('DIRECTORY');
      } else if (e.key === '2') {
        setActiveTab('PIPELINE');
      } else if (e.key === '3') {
        setActiveTab('SWIPE');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Pipeline Management
  const handleAddToPipeline = (job: JobListing) => {
    if (appliedJobIds.has(job.id)) return;
    setAppliedJobIds((prev) => new Set([...prev, job.id]));
    const newCard: ApplicationCard = {
      id: `app-${Date.now()}`,
      job,
      status: 'DISCOVERED',
      atsScore: job.atsMatchScore || 80,
      notes: 'Added to tracking board.',
    };
    setCards((prev) => [newCard, ...prev]);
    setIslandTasks((prev) => [
      ...prev,
      {
        id: `pipeline-${job.id}-${Date.now()}`,
        label: job.company,
        detail: 'Saved to Pipeline CRM',
        status: 'done',
        action: {
          label: 'Undo',
          onClick: () => handleRemoveCard(newCard.id),
        },
      },
    ]);
  };

  const handleDirectApply = (job: JobListing) => {
    const destination = job.jobUrl || `https://www.google.com/search?q=${encodeURIComponent(job.company + ' ' + job.title + ' careers')}`;
    window.open(destination, '_blank', 'noopener,noreferrer');

    if (!appliedJobIds.has(job.id)) {
      setAppliedJobIds((prev) => new Set([...prev, job.id]));
      setCards((prev) => {
        const exists = prev.find((c) => c.job.id === job.id);
        if (exists) return prev;
        return [
          {
            id: `app-${Date.now()}`,
            job,
            status: 'DISCOVERED',
            atsScore: job.atsMatchScore || 80,
            notes: 'Opened careers page for review.',
          },
          ...prev,
        ];
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
    setAppliedJobIds((prev) => new Set([...prev, job.id]));
    setIslandTasks((prev) => [
      ...prev,
      {
        id: `pitch-${job.id}-${Date.now()}`,
        label: `Pitch sent to ${job.founderName || job.company}`,
        detail: 'Pipeline status: Outreach Sent',
        status: 'done',
        action: {
          label: 'View CRM',
          onClick: () => setActiveTab('PIPELINE'),
        },
      },
    ]);
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

  // Job selection opens right inspector
  const handleSelectJob = (job: JobListing) => {
    setSelectedJob(job);
    setIsDrawerOpen(true);
  };

  const activeApplicationCard = useMemo(() => {
    if (!selectedJob) return undefined;
    return cards.find((c) => c.job.id === selectedJob.id);
  }, [cards, selectedJob]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F4F6F9] dark:bg-[#0F1117] text-slate-900 dark:text-[#F3F4F6] font-sans transition-colors duration-300 selection:bg-blue-500/20 selection:text-blue-900 dark:selection:bg-[#818CF8]/30 dark:selection:text-white">
      {/* 1. Left Workspace Sidebar (Desktop) */}
      <div className="hidden md:flex shrink-0">
        <WorkspaceSidebar
          activeTab={activeTab}
          onSelectTab={(tab: WorkspaceTab) => {
            setActiveTab(tab);
            if (tab === 'PROFILE') setModalMode('PROFILE_MODAL');
          }}
          pipelineCount={cards.length}
          candidate={candidate}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenProfile={() => setModalMode('PROFILE_MODAL')}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
      </div>

      {/* 2. Main Workspace Stage */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Mobile Header Bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[#21232D] bg-[#121318]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1 rounded text-[#9D9FA9] hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="w-6 h-6 rounded bg-[#5E6AD2] flex items-center justify-center font-bold text-xs text-white">
              JP
            </div>
            <span className="font-semibold text-sm">JobPilot</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="px-2 py-1 rounded bg-[#181922] border border-[#252734] text-xs text-[#9D9FA9]"
            >
              ⌘K
            </button>
            <button
              onClick={() => setModalMode('PROFILE_MODAL')}
              className="w-7 h-7 rounded-full bg-neutral-800 text-xs font-bold text-white flex items-center justify-center border border-[#2B2D3C]"
            >
              {candidate.fullName.charAt(0)}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden p-3 border-b border-[#21232D] bg-[#151620] space-y-1 text-xs">
            <button
              onClick={() => { setActiveTab('LANDING'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === 'LANDING' ? 'bg-[#5E6AD2] text-white font-medium' : 'text-[#9D9FA9]'}`}
            >
              Engine & Process (Landing)
            </button>
            <button
              onClick={() => { setActiveTab('DIRECTORY'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === 'DIRECTORY' ? 'bg-[#5E6AD2] text-white font-medium' : 'text-[#9D9FA9]'}`}
            >
              Jobs Directory ({jobs.length})
            </button>
            <button
              onClick={() => { setActiveTab('PIPELINE'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === 'PIPELINE' ? 'bg-[#5E6AD2] text-white font-medium' : 'text-[#9D9FA9]'}`}
            >
              Pipeline CRM ({cards.length})
            </button>
            <button
              onClick={() => { setActiveTab('SWIPE'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === 'SWIPE' ? 'bg-[#5E6AD2] text-white font-medium' : 'text-[#9D9FA9]'}`}
            >
              Swipe Triage
            </button>
            <button
              onClick={() => { setActiveTab('ATS_LAB'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === 'ATS_LAB' ? 'bg-[#5E6AD2] text-white font-medium' : 'text-[#9D9FA9]'}`}
            >
              ATS Keyword Lab
            </button>
            <button
              onClick={() => { setActiveTab('OUTREACH'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === 'OUTREACH' ? 'bg-[#5E6AD2] text-white font-medium' : 'text-[#9D9FA9]'}`}
            >
              Founder Pitch Composer
            </button>
            <button
              onClick={() => { setActiveTab('PORTFOLIO'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === 'PORTFOLIO' ? 'bg-[#5E6AD2] text-white font-medium' : 'text-[#9D9FA9]'}`}
            >
              GitHub Proof Studio
            </button>
            <button
              onClick={() => { setActiveTab('FAQ'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === 'FAQ' ? 'bg-[#5E6AD2] text-white font-medium' : 'text-[#9D9FA9]'}`}
            >
              FAQ & Architecture
            </button>
          </div>
        )}

        {/* Storage Error Warning */}
        {storageError && (
          <div className="bg-amber-950/60 border-b border-amber-900/60 text-amber-300 px-4 py-1.5 text-xs font-mono text-center shrink-0">
            Browser storage is full or disabled; changes will not persist.
          </div>
        )}

        {/* Dynamic Center Canvas View */}
        <div className="flex-1 flex overflow-hidden">
          {/* TAB: LANDING PAGE & 5-STAGE PROCESS */}
          {activeTab === 'LANDING' && (
            <div className="flex-1 overflow-y-auto">
              <JobPilotLanding
                jobs={jobs}
                candidate={candidate}
                onLaunchConsole={() => setActiveTab('DIRECTORY')}
                onSelectJobForInspector={(job: JobListing) => {
                  setSelectedJob(job);
                  setIsDrawerOpen(true);
                }}
                onOpenOutreachForJob={(job: JobListing) => {
                  setSelectedJob(job);
                  setModalMode('OUTREACH_MODAL');
                }}
                onOpenAtsForJob={(job: JobListing) => {
                  setSelectedJob(job);
                  setModalMode('ATS_MODAL');
                }}
                onOpenPortfolio={() => setActiveTab('PORTFOLIO')}
              />
            </div>
          )}

          {/* TAB: DIRECTORY */}
          {activeTab === 'DIRECTORY' && (
            <OpportunityDiscover
              jobs={jobs}
              candidate={candidate}
              selectedJobId={selectedJob?.id || null}
              onSelectJob={handleSelectJob}
              onAddToPipeline={handleAddToPipeline}
              onDirectApply={handleDirectApply}
              appliedJobIds={appliedJobIds}
              cards={cards}
              corridorFilter={corridorFilter}
              onSelectCorridorFilter={setCorridorFilter}
              onOpenPitch={(job: JobListing) => {
                setSelectedJob(job);
                setIsDrawerOpen(true);
              }}
              onOpenAts={(job: JobListing) => {
                setSelectedJob(job);
                setIsDrawerOpen(true);
              }}
              onOpenResumeScanner={() => setIsResumeScannerOpen(true)}
              theme={theme}
              onToggleTheme={handleToggleTheme}
            />
          )}

          {/* TAB: PIPELINE CRM */}
          {activeTab === 'PIPELINE' && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F4F6F9] dark:bg-[#0F1117] transition-colors">
              <div className="max-w-7xl mx-auto space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-[#21232D]">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">Application Pipeline CRM</h2>
                    <p className="text-xs text-slate-500 dark:text-[#8C8E9D]">
                      Move cards across interview stages, record outreach, and export CSV logs.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-[#181922] border border-blue-200 dark:border-[#252734] text-blue-600 dark:text-indigo-400">
                      {cards.length} Tracked
                    </span>
                  </div>
                </div>

                <AutopilotTracker
                  cards={cards}
                  onUpdateCardStatus={handleUpdateCardStatus}
                  onUpdateCard={handleUpdateCard}
                  onAddCustomCard={handleAddCustomCard}
                  onRemoveCard={handleRemoveCard}
                  onOpenOutreachForCard={(job) => {
                    setSelectedJob(job);
                    setIsDrawerOpen(true);
                  }}
                />
              </div>
            </div>
          )}

          {/* TAB: SWIPE TRIAGE */}
          {activeTab === 'SWIPE' && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F4F6F9] dark:bg-[#0D0E12] flex flex-col items-center justify-center transition-colors">
              <div className="w-full max-w-xl">
                <CompanySwipeDeck
                  jobs={jobs}
                  candidate={candidate}
                  onPitch={(job: JobListing) => {
                    setSelectedJob(job);
                    setIsDrawerOpen(true);
                  }}
                  onTailorAts={(job: JobListing) => {
                    setSelectedJob(job);
                    setIsDrawerOpen(true);
                  }}
                  onAddToPipeline={handleAddToPipeline}
                  onClearFilters={() => setCorridorFilter('ALL')}
                  appliedJobIds={appliedJobIds}
                />
              </div>
            </div>
          )}

          {/* TAB: ATS KEYWORD LAB */}
          {activeTab === 'ATS_LAB' && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F4F6F9] dark:bg-[#0D0E12] transition-colors">
              <div className="max-w-4xl mx-auto space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-[#21232D]">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">ATS Keyword Lab & Matcher</h2>
                    <p className="text-xs text-slate-500 dark:text-[#8C8E9D]">
                      Active Job: <strong className="text-slate-800 dark:text-white">{selectedJob?.title || jobs[0]?.title}</strong> at{' '}
                      <strong className="text-slate-800 dark:text-white">{selectedJob?.company || jobs[0]?.company}</strong>
                    </p>
                  </div>
                  <button
                    onClick={() => setModalMode('ATS_MODAL')}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    Launch PDF / Print Mode
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#14151D] border border-slate-200/80 dark:border-[#232532] shadow-xs">
                  <p className="text-xs text-slate-600 dark:text-[#B5B7C4] leading-relaxed mb-4">
                    Audit resume keywords against job requirements, preview tailored action verbs, and generate printable PDF resumes.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedJob(selectedJob || jobs[0]);
                      setModalMode('ATS_MODAL');
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs inline-flex items-center gap-2 active:scale-95 transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Open Interactive ATS Tailor Studio</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: OUTREACH COMPOSER */}
          {activeTab === 'OUTREACH' && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F4F6F9] dark:bg-[#0D0E12] transition-colors">
              <div className="max-w-4xl mx-auto space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-[#21232D]">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">Founder Pitch Composer</h2>
                    <p className="text-xs text-slate-500 dark:text-[#8C8E9D]">
                      Cold email templates tailored for startup founders and engineering leads.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#14151D] border border-slate-200/80 dark:border-[#232532] shadow-xs space-y-3">
                  <p className="text-xs text-slate-600 dark:text-[#B5B7C4]">
                    Select any job in the Directory to open the dedicated pitch composer with verified contact emails and custom formulas.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedJob(selectedJob || jobs[0]);
                      setModalMode('OUTREACH_MODAL');
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs inline-flex items-center gap-2 active:scale-95 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Compose Pitch for {selectedJob?.company || jobs[0]?.company}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: GITHUB PROOF STUDIO */}
          {activeTab === 'PORTFOLIO' && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F4F6F9] dark:bg-[#0D0E12] transition-colors">
              <div className="max-w-4xl mx-auto space-y-4">
                <div className="pb-3 border-b border-slate-200/80 dark:border-[#21232D]">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">GitHub Proof-of-Work Fetcher</h2>
                  <p className="text-xs text-slate-500 dark:text-[#8C8E9D]">
                    Inspect live public repositories, commit histories, and tech stacks via GitHub REST API.
                  </p>
                </div>

                <PortfolioStudio
                  candidate={candidate}
                  onNavigateToOutreach={() => {
                    setActiveTab('OUTREACH');
                  }}
                />
              </div>
            </div>
          )}

          {/* TAB: FAQ & ARCHITECTURE */}
          {activeTab === 'FAQ' && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F4F6F9] dark:bg-[#0D0E12] transition-colors">
              <div className="max-w-3xl mx-auto">
                <WorkflowFAQ />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Integrated Slide-Over Job Inspector Drawer */}
      {isDrawerOpen && selectedJob && (
        <JobInspectorDrawer
          job={selectedJob}
          candidate={candidate}
          onClose={() => setIsDrawerOpen(false)}
          onAddToPipeline={handleAddToPipeline}
          onDirectApply={handleDirectApply}
          onLogOutreachSent={handleLogOutreachSent}
          isApplied={appliedJobIds.has(selectedJob.id)}
          applicationCard={activeApplicationCard}
          onOpenFullAtsModal={(job: JobListing) => {
            setSelectedJob(job);
            setModalMode('ATS_MODAL');
          }}
        />
      )}

      {/* 4. Raycast-Grade Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        jobs={jobs}
        onSelectJob={(job: JobListing) => {
          setSelectedJob(job);
          setIsDrawerOpen(true);
        }}
        onNavigateTab={(tab: WorkspaceTab) => {
          setActiveTab(tab);
          if (tab === 'PROFILE') setModalMode('PROFILE_MODAL');
        }}
        onOpenScanner={() => setIsResumeScannerOpen(true)}
      />

      {/* 5. Modals (when explicit full dialog is opened) */}
      {modalMode === 'ATS_MODAL' && selectedJob && (
        <AtsResumeTailorModal
          job={selectedJob}
          candidate={candidate}
          onClose={() => setModalMode('NONE')}
          onProceedToOutreach={(job: JobListing) => {
            setSelectedJob(job);
            setModalMode('OUTREACH_MODAL');
          }}
        />
      )}

      {modalMode === 'OUTREACH_MODAL' && selectedJob && (
        <OutreachModal
          job={selectedJob}
          candidate={candidate}
          onClose={() => setModalMode('NONE')}
          onLogOutreachSent={handleLogOutreachSent}
        />
      )}

      {modalMode === 'PROFILE_MODAL' && (
        <ProfileVaultModal
          candidate={candidate}
          onSave={(updated: CandidateProfile) => {
            setCandidate(updated);
            setModalMode('NONE');
          }}
          onClose={() => setModalMode('NONE')}
        />
      )}

      {/* 6. Client-Side Resume & Skill Scanner (Startup-Finder Auto-Detector) */}
      {isResumeScannerOpen && (
        <ResumeScannerModal
          isOpen={isResumeScannerOpen}
          onClose={() => setIsResumeScannerOpen(false)}
          candidate={candidate}
          onSaveProfile={(updated: CandidateProfile) => {
            setCandidate(updated);
            setIsResumeScannerOpen(false);
            setIslandTasks((prev) => [
              {
                id: `profile-${Date.now()}`,
                label: 'Candidate Profile Synchronized',
                detail: `${updated.primarySkills.length} skills parsed · Startups re-scored`,
                status: 'done',
              },
              ...prev,
            ]);
          }}
        />
      )}

      {/* Kokonut UI Dynamic Status Island */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <StatusIsland
          tasks={islandTasks}
          onDismiss={(id) => setIslandTasks((prev) => prev.filter((t) => t.id !== id))}
          dismissAfter={4000}
        />
      </div>
    </div>
  );
}

export default App;
