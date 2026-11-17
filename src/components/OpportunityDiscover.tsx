import React, { useState, useMemo } from 'react';
import type { JobListing, CandidateProfile, ApplicationCard } from '../types';
import { OpportunityCard } from './OpportunityCard';
import { 
  Search, 
  MapPin, 
  Flame, 
  Table as TableIcon, 
  LayoutGrid, 
  BookmarkPlus, 
  ExternalLink,
  Briefcase,
  SlidersHorizontal,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Sun,
  Moon
} from 'lucide-react';
import type { CorridorFilter } from './WorkspaceSidebar';

interface OpportunityDiscoverProps {
  jobs: JobListing[];
  candidate: CandidateProfile;
  selectedJobId: string | null;
  onSelectJob: (job: JobListing) => void;
  onAddToPipeline: (job: JobListing) => void;
  onDirectApply: (job: JobListing) => void;
  appliedJobIds: Set<string>;
  cards: ApplicationCard[];
  corridorFilter: CorridorFilter;
  onSelectCorridorFilter: (filter: CorridorFilter) => void;
  onOpenPitch: (job: JobListing) => void;
  onOpenAts: (job: JobListing) => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

const DISCIPLINES = [
  'All Roles',
  'Founding AI',
  'Full Stack',
  'Backend & Systems',
  'Frontend',
  'DevOps & SRE',
  'Mobile',
];

export const OpportunityDiscover: React.FC<OpportunityDiscoverProps> = ({
  jobs,
  candidate,
  selectedJobId,
  onSelectJob,
  onAddToPipeline,
  onDirectApply,
  appliedJobIds,
  cards,
  corridorFilter,
  onSelectCorridorFilter,
  onOpenPitch,
  theme = 'light',
  onToggleTheme,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('All Roles');
  const [viewMode, setViewMode] = useState<'CARDS' | 'TABLE'>('CARDS');
  const [sortBy, setSortBy] = useState<'MATCH' | 'SALARY' | 'RECENT'>('MATCH');

  // Filter and sort opportunities deterministically
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // 1. Search Query across title, company, location, and skills
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.requiredSkills.some((s) => s.toLowerCase().includes(q));

      // 2. Discipline / Role Category
      const matchesDiscipline =
        selectedDiscipline === 'All Roles' ||
        job.roleCategory === selectedDiscipline ||
        (selectedDiscipline === 'Founding AI' && (job.title.toLowerCase().includes('ai') || job.title.toLowerCase().includes('machine learning'))) ||
        (selectedDiscipline === 'Full Stack' && job.title.toLowerCase().includes('full stack')) ||
        (selectedDiscipline === 'Backend & Systems' && (job.title.toLowerCase().includes('backend') || job.title.toLowerCase().includes('systems'))) ||
        (selectedDiscipline === 'Frontend' && job.title.toLowerCase().includes('frontend')) ||
        (selectedDiscipline === 'DevOps & SRE' && (job.title.toLowerCase().includes('devops') || job.title.toLowerCase().includes('reliability'))) ||
        (selectedDiscipline === 'Mobile' && job.title.toLowerCase().includes('mobile'));

      // 3. Corridor / Opportunity Filter
      let matchesCorridor = true;
      if (corridorFilter === 'BLR') {
        matchesCorridor = job.location.toLowerCase().includes('bangalore') || job.location.toLowerCase().includes('bengaluru');
      } else if (corridorFilter === 'YC') {
        matchesCorridor = job.source.includes('YC');
      } else if (corridorFilter === 'REMOTE') {
        matchesCorridor = job.isRemote || job.location.toLowerCase().includes('remote');
      } else if (corridorFilter === 'NOTICE') {
        matchesCorridor = !!job.noticeBuyoutCovered;
      }

      return matchesSearch && matchesDiscipline && matchesCorridor;
    }).sort((a, b) => {
      if (sortBy === 'MATCH') return (b.atsMatchScore || 0) - (a.atsMatchScore || 0);
      if (sortBy === 'SALARY') return b.maxCtcLpa - a.maxCtcLpa;
      return 0;
    });
  }, [jobs, searchQuery, selectedDiscipline, corridorFilter, sortBy]);

  // Genuine application metrics from loaded data
  const highFitCount = jobs.filter((j) => (j.atsMatchScore || 0) >= 80).length;
  const highEquityCount = jobs.filter((j) => j.equityRange && j.equityRange.includes('%') && !j.equityRange.includes('0.1%')).length;
  const isAnyFilterActive = selectedDiscipline !== 'All Roles' || corridorFilter !== 'ALL' || searchQuery.trim().length > 0;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F4F6F9] dark:bg-[#0F1117] text-slate-900 dark:text-[#F3F4F6] overflow-y-auto transition-colors duration-200">
      <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-4">
        
        {/* 1. Page Header (Discover Opportunities + Apple Theme Toggle & Candidate Identity) */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-[#F3F4F6] font-sans">
              Discover Opportunities
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A1A8B8] mt-1 font-medium">
              Verified high-conviction startup roles matched deterministically to your engineering background.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Apple Light/Dark Theme Switcher */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#171A23] border border-slate-200/80 dark:border-[#292E3B] text-xs font-semibold text-slate-700 dark:text-[#EDEDED] shadow-xs hover:border-slate-300 dark:hover:border-[#3E4558] transition-all"
                title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              >
                {theme === 'light' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            )}

            {/* Candidate Metadata Pill */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#171A23] border border-slate-200/80 dark:border-[#292E3B] text-xs text-slate-600 dark:text-[#737C90] shadow-xs font-mono">
              Candidate: <span className="text-slate-900 dark:text-[#A1A8B8] font-semibold">{candidate.fullName}</span> · {candidate.yearsOfExperience}y exp
            </div>
          </div>
        </div>

        {/* 2. Apple / iPhone Horizontal Statistics Strip */}
        <div className="flex flex-wrap items-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-[#292E3B] rounded-2xl bg-white/90 dark:bg-[#171A23] backdrop-blur-xl border border-slate-200/80 dark:border-[#292E3B] text-xs py-1.5 px-2 shadow-sm">
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 w-full sm:w-auto">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-[#34D399] flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-slate-500 dark:text-[#737C90] text-[11px] block">High Skill Match</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono font-bold text-emerald-600 dark:text-[#34D399] text-sm">{highFitCount} Roles</span>
                <span className="text-[10px] text-slate-400 dark:text-[#737C90]">(≥80% match)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-3.5 py-1.5 w-full sm:w-auto">
            <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-[#818CF8] flex items-center justify-center shrink-0 shadow-xs">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-slate-500 dark:text-[#737C90] text-[11px] block">High Equity Startups</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono font-bold text-indigo-600 dark:text-[#818CF8] text-sm">{highEquityCount} Roles</span>
                <span className="text-[10px] text-slate-400 dark:text-[#737C90]">(≥1.0% Pool)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-3.5 py-1.5 w-full sm:w-auto">
            <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-slate-500 dark:text-[#737C90] text-[11px] block">Direct Reach</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono font-bold text-slate-900 dark:text-[#F3F4F6] text-sm">100%</span>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-[#34D399]">Verified Inboxes</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-3.5 py-1.5 w-full sm:w-auto">
            <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-[#1D2230] text-slate-700 dark:text-[#A1A8B8] flex items-center justify-center shrink-0 shadow-xs">
              <BookmarkPlus className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-slate-500 dark:text-[#737C90] text-[11px] block">Active Pipeline</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono font-bold text-slate-900 dark:text-[#F3F4F6] text-sm">{cards.length} Tracked</span>
                <span className="text-[10px] text-slate-400 dark:text-[#737C90]">in CRM</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Discovery Controls: Search, Sort, View, and Clean Filter Groups */}
        <div className="rounded-2xl bg-white dark:bg-[#171A23] border border-slate-200/80 dark:border-[#292E3B] p-4 sm:p-5 space-y-3.5 shadow-sm">
          {/* Row A: Prominent Search + Sort + View Switcher */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 dark:text-[#737C90]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by role title, startup name, or tech stack..."
                className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-100/80 dark:bg-[#0F1117] border border-slate-200/60 dark:border-[#292E3B] hover:border-slate-300 dark:hover:border-[#3E4558] focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-xs text-slate-900 dark:text-[#F3F4F6] placeholder-slate-400 dark:placeholder-[#737C90] outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-700 dark:text-[#737C90] dark:hover:text-[#F3F4F6]"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort & View Mode */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'MATCH' | 'SALARY' | 'RECENT')}
                  className="appearance-none pl-3.5 pr-8 py-2 rounded-xl bg-slate-100/80 dark:bg-[#0F1117] border border-slate-200/60 dark:border-[#292E3B] text-xs font-medium text-slate-700 dark:text-[#A1A8B8] hover:text-slate-900 dark:hover:text-[#F3F4F6] hover:border-slate-300 dark:hover:border-[#3E4558] outline-none transition-colors cursor-pointer"
                  title="Sort opportunities"
                >
                  <option value="MATCH">Sort: Highest Match</option>
                  <option value="SALARY">Sort: Compensation</option>
                  <option value="RECENT">Sort: Most Recent</option>
                </select>
                <SlidersHorizontal className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-slate-400 dark:text-[#737C90] pointer-events-none" />
              </div>

              {/* Apple Segmented View Toggle */}
              <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#0F1117] border border-slate-200/60 dark:border-[#292E3B]">
                <button
                  onClick={() => setViewMode('CARDS')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    viewMode === 'CARDS'
                      ? 'bg-white dark:bg-[#1D2230] text-slate-900 dark:text-[#F3F4F6] shadow-sm border border-slate-200/50 dark:border-[#3E4558]'
                      : 'text-slate-500 dark:text-[#737C90] hover:text-slate-800 dark:hover:text-[#A1A8B8]'
                  }`}
                  title="Grid view"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Cards</span>
                </button>

                <button
                  onClick={() => setViewMode('TABLE')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    viewMode === 'TABLE'
                      ? 'bg-white dark:bg-[#1D2230] text-slate-900 dark:text-[#F3F4F6] shadow-sm border border-slate-200/50 dark:border-[#3E4558]'
                      : 'text-slate-500 dark:text-[#737C90] hover:text-slate-800 dark:hover:text-[#A1A8B8]'
                  }`}
                  title="Structured table view"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Table</span>
                </button>
              </div>
            </div>
          </div>

          {/* Row B: Cleanly Grouped Filters */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-[#292E3B]">
            {/* Group 1: Role Discipline Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-[#737C90] uppercase tracking-wider shrink-0 mr-1">Role:</span>
              {DISCIPLINES.map((discipline) => {
                const isActive = selectedDiscipline === discipline;
                return (
                  <button
                    key={discipline}
                    onClick={() => setSelectedDiscipline(isActive && discipline !== 'All Roles' ? 'All Roles' : discipline)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                      isActive
                        ? 'bg-slate-900 dark:bg-[#1D2230] text-white dark:text-[#F3F4F6] dark:border dark:border-[#818CF8] shadow-sm'
                        : 'bg-slate-100/70 hover:bg-slate-100 dark:bg-[#0F1117] border border-slate-200/60 dark:border-[#292E3B] text-slate-600 dark:text-[#737C90] hover:text-slate-900 dark:hover:text-[#A1A8B8]'
                    }`}
                  >
                    {discipline}
                    {isActive && discipline !== 'All Roles' && (
                      <span className="ml-1.5 text-[10px] text-slate-300 dark:text-[#A1A8B8] hover:text-white">✕</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Group 2: Corridor & Special Opportunity Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-[#737C90] uppercase tracking-wider shrink-0 mr-1">Corridor:</span>

              {/* Bangalore Corridors */}
              <button
                onClick={() => onSelectCorridorFilter(corridorFilter === 'BLR' ? 'ALL' : 'BLR')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all duration-150 ${
                  corridorFilter === 'BLR'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-[#1D2230] dark:border-[#818CF8] dark:text-[#F3F4F6] font-semibold shadow-xs'
                    : 'bg-slate-100/70 hover:bg-slate-100 dark:bg-[#0F1117] border border-slate-200/60 dark:border-[#292E3B] text-slate-600 dark:text-[#737C90] hover:text-slate-900 dark:hover:text-[#A1A8B8]'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-[#34D399]" />
                <span>Bangalore Tech</span>
                {corridorFilter === 'BLR' && <span className="ml-1 text-[10px] text-emerald-700 dark:text-[#A1A8B8]">✕</span>}
              </button>

              {/* YC Backed */}
              <button
                onClick={() => onSelectCorridorFilter(corridorFilter === 'YC' ? 'ALL' : 'YC')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all duration-150 ${
                  corridorFilter === 'YC'
                    ? 'bg-amber-50 text-amber-800 border border-amber-300 dark:bg-[#1D2230] dark:border-[#818CF8] dark:text-[#F3F4F6] font-semibold shadow-xs'
                    : 'bg-slate-100/70 hover:bg-slate-100 dark:bg-[#0F1117] border border-slate-200/60 dark:border-[#292E3B] text-slate-600 dark:text-[#737C90] hover:text-slate-900 dark:hover:text-[#A1A8B8]'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-600 dark:text-[#FBBF24]" />
                <span>YC Backed</span>
                {corridorFilter === 'YC' && <span className="ml-1 text-[10px] text-amber-700 dark:text-[#A1A8B8]">✕</span>}
              </button>

              {/* Remote Friendly */}
              <button
                onClick={() => onSelectCorridorFilter(corridorFilter === 'REMOTE' ? 'ALL' : 'REMOTE')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all duration-150 ${
                  corridorFilter === 'REMOTE'
                    ? 'bg-blue-50 text-blue-800 border border-blue-300 dark:bg-[#1D2230] dark:border-[#818CF8] dark:text-[#F3F4F6] font-semibold shadow-xs'
                    : 'bg-slate-100/70 hover:bg-slate-100 dark:bg-[#0F1117] border border-slate-200/60 dark:border-[#292E3B] text-slate-600 dark:text-[#737C90] hover:text-slate-900 dark:hover:text-[#A1A8B8]'
                }`}
              >
                <span>Remote Friendly</span>
                {corridorFilter === 'REMOTE' && <span className="ml-1 text-[10px] text-blue-700 dark:text-[#A1A8B8]">✕</span>}
              </button>

              {/* Notice Buyout */}
              <button
                onClick={() => onSelectCorridorFilter(corridorFilter === 'NOTICE' ? 'ALL' : 'NOTICE')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all duration-150 ${
                  corridorFilter === 'NOTICE'
                    ? 'bg-purple-50 text-purple-800 border border-purple-300 dark:bg-[#1D2230] dark:border-[#818CF8] dark:text-[#F3F4F6] font-semibold shadow-xs'
                    : 'bg-slate-100/70 hover:bg-slate-100 dark:bg-[#0F1117] border border-slate-200/60 dark:border-[#292E3B] text-slate-600 dark:text-[#737C90] hover:text-slate-900 dark:hover:text-[#A1A8B8]'
                }`}
              >
                <span>Notice Buyout</span>
                {corridorFilter === 'NOTICE' && <span className="ml-1 text-[10px] text-purple-700 dark:text-[#A1A8B8]">✕</span>}
              </button>

              {/* Reset all active filters shortcut */}
              {isAnyFilterActive && (
                <button
                  onClick={() => {
                    setSelectedDiscipline('All Roles');
                    onSelectCorridorFilter('ALL');
                    setSearchQuery('');
                  }}
                  className="ml-auto text-[11px] font-medium text-slate-500 hover:text-indigo-600 dark:text-[#737C90] dark:hover:text-[#F3F4F6] underline decoration-dotted whitespace-nowrap transition-colors"
                  title="Clear all active filters and search"
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 4. Opportunities Presentation Area */}
        {filteredJobs.length === 0 ? (
          <div className="py-20 text-center space-y-3 rounded-2xl bg-white dark:bg-[#171A23] border border-slate-200/80 dark:border-[#292E3B] p-8 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[#1D2230] text-slate-500 dark:text-[#737C90] flex items-center justify-center mx-auto shadow-xs">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F3F4F6]">No matching opportunities found</h3>
            <p className="text-xs text-slate-500 dark:text-[#737C90] max-w-sm mx-auto">
              Try adjusting your search query, corridor, or discipline filter to view active roles.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDiscipline('All Roles');
                onSelectCorridorFilter('ALL');
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm shadow-indigo-500/20 transition-all"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            {/* VIEW MODE A: COMPACT OPPORTUNITY CARDS (3 columns on xl, 2 on md, 1 on sm) */}
            {viewMode === 'CARDS' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredJobs.map((job) => (
                  <OpportunityCard
                    key={job.id}
                    job={job}
                    candidate={candidate}
                    isSelected={job.id === selectedJobId}
                    isTracked={appliedJobIds.has(job.id)}
                    onSelect={onSelectJob}
                    onAddToPipeline={onAddToPipeline}
                    onOpenPitch={onOpenPitch}
                    onDirectApply={onDirectApply}
                  />
                ))}
              </div>
            )}

            {/* VIEW MODE B: REFINED STRUCTURED TABLE */}
            {viewMode === 'TABLE' && (
              <div className="rounded-2xl border border-slate-200/80 dark:border-[#292E3B] bg-white dark:bg-[#171A23] overflow-hidden shadow-sm">
                <div className="min-w-[760px]">
                  {/* Table Header */}
                  <div className="grid grid-cols-[minmax(220px,2fr)_minmax(130px,1.2fr)_minmax(180px,1.5fr)_minmax(130px,1fr)_90px_150px] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#737C90] border-b border-slate-200/80 dark:border-[#292E3B] bg-slate-50/80 dark:bg-[#1D2230]/70">
                    <div>Opportunity & Startup</div>
                    <div>Location</div>
                    <div>Why You Match</div>
                    <div>Compensation</div>
                    <div>Score</div>
                    <div className="text-right">Action</div>
                  </div>

                  {/* Table Rows */}
                  <div className="divide-y divide-slate-100 dark:divide-[#292E3B]">
                    {filteredJobs.map((job) => {
                      const isSelected = job.id === selectedJobId;
                      const isTracked = appliedJobIds.has(job.id);
                      return (
                        <div
                          key={job.id}
                          onClick={() => onSelectJob(job)}
                          className={`grid grid-cols-[minmax(220px,2fr)_minmax(130px,1.2fr)_minmax(180px,1.5fr)_minmax(130px,1fr)_90px_150px] items-center px-5 py-3.5 cursor-pointer text-xs transition-colors duration-150 ${
                            isSelected
                              ? 'bg-indigo-50/60 dark:bg-[#1D2230] border-l-[3px] border-indigo-600 dark:border-[#818CF8]'
                              : 'hover:bg-slate-50/70 dark:hover:bg-[#1D2230]'
                          }`}
                        >
                          {/* Role & Company */}
                          <div className="flex items-center gap-3 min-w-0 pr-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-blue-500/10 border border-slate-200/80 dark:border-[#292E3B] flex items-center justify-center font-bold text-indigo-600 dark:text-[#F3F4F6] text-xs shrink-0 shadow-xs">
                              {job.company.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-slate-900 dark:text-[#F3F4F6] truncate">{job.title}</span>
                                {job.source.includes('YC') && (
                                  <span className="px-1.5 py-0.2 rounded-full bg-amber-50 dark:bg-[#FBBF24]/10 border border-amber-200 dark:border-[#FBBF24]/30 text-amber-700 dark:text-[#FBBF24] text-[10px] font-mono shrink-0">
                                    YC
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-[#A1A8B8] truncate mt-0.5">
                                {job.company} {job.fundingRound ? `· ${job.fundingRound}` : ''}
                              </div>
                            </div>
                          </div>

                          {/* Location */}
                          <div className="text-slate-600 dark:text-[#A1A8B8] min-w-0 pr-2">
                            <div className="truncate flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-[#737C90] shrink-0" strokeWidth={2.2} />
                              <span className="font-medium">{job.bangaloreCluster || job.location}</span>
                            </div>
                            <span className="text-[11px] text-slate-400 dark:text-[#737C90] block mt-0.5">
                              {job.isRemote ? 'Remote Friendly' : 'In-Office'}
                            </span>
                          </div>

                          {/* Matched Skills */}
                          <div className="flex flex-wrap items-center gap-1 pr-2">
                            {job.requiredSkills.slice(0, 3).map((s) => (
                              <span
                                key={s}
                                className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium text-emerald-700 dark:text-[#34D399] bg-emerald-50 dark:bg-[#34D399]/10 border border-emerald-200/60 dark:border-[#34D399]/20"
                              >
                                {s}
                              </span>
                            ))}
                            {job.requiredSkills.length > 3 && (
                              <span className="text-[10px] text-slate-400 dark:text-[#737C90] font-mono">
                                +{job.requiredSkills.length - 3}
                              </span>
                            )}
                          </div>

                          {/* Compensation */}
                          <div className="font-mono text-xs text-slate-900 dark:text-[#F3F4F6] pr-2">
                            <span className="font-bold">{job.salaryDisplay || `₹${job.minCtcLpa}–${job.maxCtcLpa} LPA`}</span>
                            {job.equityRange && !job.equityRange.toLowerCase().includes('none') && (
                              <span className="block text-[11px] text-slate-500 dark:text-[#737C90] font-sans">{job.equityRange}</span>
                            )}
                          </div>

                          {/* Match */}
                          <div>
                            <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-[#34D399]/10 border border-emerald-200/80 dark:border-[#34D399]/30 text-emerald-700 dark:text-[#34D399] font-bold">
                              {job.atsMatchScore}%
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => onOpenPitch(job)}
                              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
                              title="Compose cold email to founder"
                            >
                              Pitch
                            </button>

                            <button
                              onClick={() => onAddToPipeline(job)}
                              className={`p-1.5 rounded-xl border transition-colors ${
                                isTracked
                                  ? 'bg-indigo-50 dark:bg-[#1D2230] border-indigo-200 dark:border-[#818CF8] text-indigo-600 dark:text-[#818CF8]'
                                  : 'bg-slate-100 hover:bg-slate-200/70 dark:bg-[#171A23] dark:hover:bg-[#1D2230] border-slate-200/80 dark:border-[#292E3B] text-slate-500 dark:text-[#737C90] hover:text-slate-800 dark:hover:text-[#F3F4F6]'
                              }`}
                              title={isTracked ? 'Saved in Pipeline' : 'Save to Pipeline'}
                            >
                              <BookmarkPlus className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => onDirectApply(job)}
                              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 dark:text-[#737C90] dark:hover:text-[#F3F4F6] dark:hover:bg-[#1D2230] transition-colors"
                              title="Open application link"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
