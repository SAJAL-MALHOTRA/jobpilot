import React, { useState, useMemo } from 'react';
import type { JobListing, CandidateProfile, ApplicationCard } from '../types';
import { OpportunityCard } from './OpportunityCard';
import { 
  Search, 
  MapPin, 
  Flame, 
  Table as TableIcon, 
  LayoutGrid, 
  Bookmark, 
  BookmarkCheck,
  ExternalLink, 
  Briefcase, 
  SlidersHorizontal, 
  Sparkles, 
  TrendingUp, 
  Clock,
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

  // Filter and sort opportunities
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

      // 3. Location & Ecosystem Filter
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
      if (sortBy === 'SALARY') return (b.maxCtcLpa || 0) - (a.maxCtcLpa || 0);
      if (sortBy === 'RECENT') return a.id.localeCompare(b.id);
      return (b.atsMatchScore || 0) - (a.atsMatchScore || 0);
    });
  }, [jobs, searchQuery, selectedDiscipline, corridorFilter, sortBy]);

  // High-signal stats
  const highFitCount = jobs.filter((j) => (j.atsMatchScore || 0) >= 80).length;
  const foundingCount = jobs.filter((j) => j.equityRange && (j.equityRange.includes('0.') || j.equityRange.includes('1.'))).length;
  const isAnyFilterActive = selectedDiscipline !== 'All Roles' || corridorFilter !== 'ALL' || searchQuery.trim().length > 0;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F4F6F9] dark:bg-[#0F1117] text-slate-900 dark:text-[#F3F4F6] overflow-y-auto transition-colors duration-300">
      <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-5">
        
        {/* 1. Header with Dynamic Island pill & Theme Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-[#17191E] border border-slate-200/80 dark:border-[#292C33] shadow-xs text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-700 dark:text-[#A1A8B8]">Dynamic Intelligence Radar</span>
              <span className="text-slate-300 dark:text-[#3E4558]">|</span>
              <span className="text-blue-600 dark:text-[#818CF8] font-bold">{filteredJobs.length} Live Openings</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-[#F3F4F6]">
              Discover Opportunities
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#969BA6] mt-1">
              Curated startup engineering roles evaluated deterministically against your verified proficiencies.
            </p>
          </div>

          {/* Quick Header Actions: Theme Toggle & View Mode */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="p-2 rounded-xl bg-white dark:bg-[#17191E] border border-slate-200/80 dark:border-[#292C33] hover:border-blue-400 dark:hover:border-[#3A3E47] text-slate-700 dark:text-[#F3F4F6] shadow-xs active:scale-95 transition-all"
                title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              >
                {theme === 'light' ? (
                  <Moon className="w-4 h-4 text-indigo-600" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-400" />
                )}
              </button>
            )}

            {/* Apple Segmented Control View Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-white dark:bg-[#17191E] border border-slate-200/80 dark:border-[#292C33] shadow-xs">
              <button
                onClick={() => setViewMode('CARDS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'CARDS'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-500 dark:text-[#737C90] hover:text-slate-900 dark:hover:text-[#F3F4F6]'
                }`}
                title="Grid cards view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cards</span>
              </button>

              <button
                onClick={() => setViewMode('TABLE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === 'TABLE'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-500 dark:text-[#737C90] hover:text-slate-900 dark:hover:text-[#F3F4F6]'
                }`}
                title="Table view"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Apple Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#17191E] border border-slate-200/80 dark:border-[#292C33] shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-[#6B7280] uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              <span>Fresh Today</span>
            </span>
            <span className="text-lg font-black text-slate-900 dark:text-[#F3F4F6] mt-1 block">
              3 Openings
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#17191E] border border-slate-200/80 dark:border-[#292C33] shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-[#6B7280] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Top Fit</span>
            </span>
            <span className="text-lg font-black text-blue-600 dark:text-[#34D399] mt-1 block">
              {highFitCount} Roles (&gt;80%)
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#17191E] border border-slate-200/80 dark:border-[#292C33] shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-[#6B7280] uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
              <span>High Equity</span>
            </span>
            <span className="text-lg font-black text-indigo-600 dark:text-[#818CF8] mt-1 block">
              {foundingCount} Startups
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#17191E] border border-slate-200/80 dark:border-[#292C33] shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-[#6B7280] uppercase tracking-wider flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-amber-500" />
              <span>Saved in CRM</span>
            </span>
            <span className="text-lg font-black text-slate-900 dark:text-[#F3F4F6] mt-1 block">
              {cards.length} Active
            </span>
          </div>
        </div>

        {/* 3. Discovery Controls: Apple Glass Filter Console */}
        <div className="rounded-2xl bg-white/95 dark:bg-[#171A23] border border-slate-200/80 dark:border-[#292C33] shadow-sm p-4 space-y-3.5">
          {/* Row A: Search Input & Sorter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 dark:text-[#737C90]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by role title, startup name, or tech stack..."
                className="w-full pl-10 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-[#0F1117] border border-slate-200 dark:border-[#292C33] focus:border-blue-500 dark:focus:border-[#818CF8] text-xs text-slate-900 dark:text-[#F3F4F6] placeholder-slate-400 dark:placeholder-[#737C90] outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-700 dark:text-[#737C90] dark:hover:text-[#F3F4F6]"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="relative w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'MATCH' | 'SALARY' | 'RECENT')}
                className="appearance-none w-full sm:w-auto pl-3.5 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-[#0F1117] border border-slate-200 dark:border-[#292C33] text-xs font-semibold text-slate-700 dark:text-[#A1A8B8] hover:border-slate-300 dark:hover:border-[#3E4558] outline-none transition-colors cursor-pointer"
                title="Sort opportunities"
              >
                <option value="MATCH">Sort: Best Match Score</option>
                <option value="SALARY">Sort: Compensation (Highest)</option>
                <option value="RECENT">Sort: Most Recently Added</option>
              </select>
              <SlidersHorizontal className="absolute right-3 top-2.5 w-3.5 h-3.5 text-slate-400 dark:text-[#737C90] pointer-events-none" />
            </div>
          </div>

          {/* Row B: Discipline Chips (Apple Rounded-Full Pills) */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#292C33]">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
              <span className="text-xs font-bold text-slate-400 dark:text-[#6B7280] uppercase tracking-wider shrink-0 mr-1">Discipline:</span>
              {DISCIPLINES.map((discipline) => {
                const isActive = selectedDiscipline === discipline;
                return (
                  <button
                    key={discipline}
                    onClick={() => setSelectedDiscipline(isActive && discipline !== 'All Roles' ? 'All Roles' : discipline)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap active:scale-95 transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                        : 'bg-slate-100 dark:bg-[#0F1117] text-slate-700 dark:text-[#A1A8B8] hover:bg-slate-200/80 dark:hover:bg-[#1D2230] border border-slate-200/60 dark:border-[#292C33]'
                    }`}
                  >
                    {discipline}
                    {isActive && discipline !== 'All Roles' && (
                      <span className="ml-1.5 text-[10px] text-blue-200 hover:text-white">✕</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Ecosystem & Corridors */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
              <span className="text-xs font-bold text-slate-400 dark:text-[#6B7280] uppercase tracking-wider shrink-0 mr-1">Ecosystem:</span>

              <button
                onClick={() => onSelectCorridorFilter(corridorFilter === 'BLR' ? 'ALL' : 'BLR')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 active:scale-95 transition-all ${
                  corridorFilter === 'BLR'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-[#0F1117] text-slate-700 dark:text-[#A1A8B8] hover:bg-slate-200/80 dark:hover:bg-[#1D2230] border border-slate-200/60 dark:border-[#292C33]'
                }`}
              >
                <MapPin className="w-3 h-3 text-emerald-500" />
                <span>Bangalore Tech Hubs</span>
                {corridorFilter === 'BLR' && <span className="ml-1 text-[10px]">✕</span>}
              </button>

              <button
                onClick={() => onSelectCorridorFilter(corridorFilter === 'YC' ? 'ALL' : 'YC')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 active:scale-95 transition-all ${
                  corridorFilter === 'YC'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-[#0F1117] text-slate-700 dark:text-[#A1A8B8] hover:bg-slate-200/80 dark:hover:bg-[#1D2230] border border-slate-200/60 dark:border-[#292C33]'
                }`}
              >
                <Flame className="w-3 h-3 text-orange-500" />
                <span>YC Startups</span>
                {corridorFilter === 'YC' && <span className="ml-1 text-[10px]">✕</span>}
              </button>

              <button
                onClick={() => onSelectCorridorFilter(corridorFilter === 'REMOTE' ? 'ALL' : 'REMOTE')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 active:scale-95 transition-all ${
                  corridorFilter === 'REMOTE'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-[#0F1117] text-slate-700 dark:text-[#A1A8B8] hover:bg-slate-200/80 dark:hover:bg-[#1D2230] border border-slate-200/60 dark:border-[#292C33]'
                }`}
              >
                <span>Remote First</span>
                {corridorFilter === 'REMOTE' && <span className="ml-1 text-[10px]">✕</span>}
              </button>

              <button
                onClick={() => onSelectCorridorFilter(corridorFilter === 'NOTICE' ? 'ALL' : 'NOTICE')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 active:scale-95 transition-all ${
                  corridorFilter === 'NOTICE'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-[#0F1117] text-slate-700 dark:text-[#A1A8B8] hover:bg-slate-200/80 dark:hover:bg-[#1D2230] border border-slate-200/60 dark:border-[#292C33]'
                }`}
              >
                <span>Notice Buyout Covered</span>
                {corridorFilter === 'NOTICE' && <span className="ml-1 text-[10px]">✕</span>}
              </button>

              {isAnyFilterActive && (
                <button
                  onClick={() => {
                    setSelectedDiscipline('All Roles');
                    onSelectCorridorFilter('ALL');
                    setSearchQuery('');
                  }}
                  className="ml-auto text-xs font-bold text-blue-600 dark:text-[#818CF8] hover:underline whitespace-nowrap"
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 4. Main Opportunities Display */}
        {filteredJobs.length === 0 ? (
          <div className="py-20 text-center space-y-3 rounded-2xl bg-white dark:bg-[#171A23] border border-slate-200/80 dark:border-[#292C33] p-8 shadow-xs">
            <Briefcase className="w-8 h-8 text-slate-400 dark:text-[#737C90] mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F3F4F6]">No matching opportunities found</h3>
            <p className="text-xs text-slate-500 dark:text-[#A1A8B8] max-w-sm mx-auto">
              Try adjusting your search query, location, or discipline filter to view active roles.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDiscipline('All Roles');
                onSelectCorridorFilter('ALL');
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            {/* VIEW MODE A: APPLE-GRADE OPPORTUNITY CARDS */}
            {viewMode === 'CARDS' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
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

            {/* VIEW MODE B: APPLE NUMBERS-GRADE STRUCTURED TABLE */}
            {viewMode === 'TABLE' && (
              <div className="rounded-2xl border border-slate-200/80 dark:border-[#292C33] bg-white dark:bg-[#171A23] overflow-hidden shadow-sm">
                <div className="min-w-[760px]">
                  {/* Table Header */}
                  <div className="grid grid-cols-[minmax(220px,2fr)_minmax(130px,1.2fr)_minmax(180px,1.5fr)_minmax(130px,1fr)_90px_150px] px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#A1A8B8] border-b border-slate-200/80 dark:border-[#292C33] bg-slate-50/80 dark:bg-[#1D2230]/70">
                    <div>Opportunity & Startup</div>
                    <div>Location</div>
                    <div>Match Factor</div>
                    <div>Compensation</div>
                    <div>Fit</div>
                    <div className="text-right">Action</div>
                  </div>

                  {/* Table Rows */}
                  <div className="divide-y divide-slate-100 dark:divide-[#292C33]">
                    {filteredJobs.map((job) => {
                      const isSelected = job.id === selectedJobId;
                      const isTracked = appliedJobIds.has(job.id);
                      return (
                        <div
                          key={job.id}
                          onClick={() => onSelectJob(job)}
                          className={`grid grid-cols-[minmax(220px,2fr)_minmax(130px,1.2fr)_minmax(180px,1.5fr)_minmax(130px,1fr)_90px_150px] items-center px-4 py-3.5 cursor-pointer text-xs transition-colors duration-150 ${
                            isSelected
                              ? 'bg-blue-50/60 dark:bg-[#1D2230] border-l-4 border-blue-600 dark:border-[#818CF8]'
                              : 'hover:bg-slate-50 dark:hover:bg-[#1D2230]'
                          }`}
                        >
                          {/* Role & Company */}
                          <div className="flex items-center gap-3 min-w-0 pr-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#1D2230] border border-slate-200 dark:border-[#292C33] flex items-center justify-center font-bold text-slate-800 dark:text-[#F3F4F6] text-xs shrink-0">
                              {job.company.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900 dark:text-[#F3F4F6] truncate">{job.title}</span>
                                {job.source.includes('YC') && (
                                  <span className="px-1.5 py-0.2 rounded-full bg-amber-50 dark:bg-[#FBBF24]/10 border border-amber-200 dark:border-[#FBBF24]/30 text-amber-700 dark:text-[#FBBF24] text-[10px] font-semibold shrink-0">
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
                            <div className="truncate flex items-center gap-1 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-[#737C90] shrink-0" />
                              <span>{job.bangaloreCluster || job.location}</span>
                            </div>
                            <span className="text-[11px] text-slate-400 dark:text-[#737C90] block mt-0.5">
                              {job.isRemote ? 'Remote First' : 'In-Office'}
                            </span>
                          </div>

                          {/* Matched Skills */}
                          <div className="flex flex-wrap items-center gap-1 pr-2">
                            {job.requiredSkills.slice(0, 3).map((s) => (
                              <span
                                key={s}
                                className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-emerald-700 dark:text-[#34D399] bg-emerald-50 dark:bg-[#34D399]/10 border border-emerald-200/80 dark:border-[#34D399]/20"
                              >
                                {s}
                              </span>
                            ))}
                          </div>

                          {/* Compensation */}
                          <div className="text-xs text-slate-900 dark:text-[#F3F4F6] pr-2">
                            <span className="font-bold">{job.salaryDisplay || `₹${job.minCtcLpa}–${job.maxCtcLpa} LPA`}</span>
                            {job.equityRange && !job.equityRange.toLowerCase().includes('none') && (
                              <span className="block text-[11px] font-medium text-blue-600 dark:text-[#A1A8B8]">{job.equityRange}</span>
                            )}
                          </div>

                          {/* Match */}
                          <div>
                            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-[#34D399]/10 border border-emerald-200 dark:border-[#34D399]/30 text-emerald-700 dark:text-[#34D399] font-bold">
                              {job.atsMatchScore}%
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => onOpenPitch(job)}
                              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs"
                              title="Compose cold email to founder"
                            >
                              Pitch
                            </button>

                            <button
                              onClick={() => onAddToPipeline(job)}
                              className={`p-1.5 rounded-xl border transition-colors ${
                                isTracked
                                  ? 'bg-blue-50 dark:bg-[#1D2230] border-blue-400 dark:border-[#818CF8] text-blue-600 dark:text-[#818CF8]'
                                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-[#171A23] dark:hover:bg-[#1D2230] border-slate-200 dark:border-[#292C33] text-slate-700 dark:text-[#A1A8B8]'
                              }`}
                              title={isTracked ? 'Saved in Pipeline' : 'Save to Pipeline'}
                            >
                              {isTracked ? <BookmarkCheck className="w-3.5 h-3.5 text-blue-600 dark:text-[#818CF8]" /> : <Bookmark className="w-3.5 h-3.5" />}
                            </button>

                            <button
                              onClick={() => onDirectApply(job)}
                              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 dark:text-[#737C90] dark:hover:text-[#F3F4F6] hover:bg-slate-100 dark:hover:bg-[#1D2230] transition-colors"
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
