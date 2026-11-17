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
  Clock
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
      if (sortBy === 'MATCH') return (b.atsMatchScore || 0) - (a.atsMatchScore || 0);
      if (sortBy === 'SALARY') return b.maxCtcLpa - a.maxCtcLpa;
      return 0;
    });
  }, [jobs, searchQuery, selectedDiscipline, corridorFilter, sortBy]);

  // Actionable high-signal metrics
  const highFitCount = jobs.filter((j) => (j.atsMatchScore || 0) >= 80).length;
  const foundingCount = jobs.filter((j) => j.equityRange && j.equityRange.includes('%') && !j.equityRange.includes('0.1%')).length;
  const isAnyFilterActive = selectedDiscipline !== 'All Roles' || corridorFilter !== 'ALL' || searchQuery.trim().length > 0;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0F1117] text-[#F3F4F6] overflow-y-auto">
      <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-4">
        
        {/* 1. Page Header (Clean, un-cluttered, natural copy) */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F3F4F6] font-sans">
              Discover Opportunities
            </h1>
            <p className="text-xs sm:text-sm text-[#A1A8B8] mt-1">
              Curated startup roles evaluated against your technical background and experience.
            </p>
          </div>
        </div>

        {/* 2. Actionable Statistics Strip */}
        <div className="flex flex-wrap items-center divide-y sm:divide-y-0 sm:divide-x divide-[#292E3B] rounded-xl bg-[#171A23] border border-[#292E3B] text-xs py-1 px-1">
          <div className="flex items-center gap-2 px-3 py-1.5 w-full sm:w-auto">
            <Clock className="w-3.5 h-3.5 text-[#34D399] shrink-0" />
            <span className="text-[#A1A8B8]">Fresh Openings:</span>
            <span className="font-semibold text-[#F3F4F6]">3 New Roles Today</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 w-full sm:w-auto">
            <Sparkles className="w-3.5 h-3.5 text-[#34D399] shrink-0" />
            <span className="text-[#A1A8B8]">Top Matches:</span>
            <span className="font-semibold text-[#34D399]">{highFitCount} Roles (&gt;80% Fit)</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 w-full sm:w-auto">
            <TrendingUp className="w-3.5 h-3.5 text-[#818CF8] shrink-0" />
            <span className="text-[#A1A8B8]">High Equity:</span>
            <span className="font-semibold text-[#818CF8]">{foundingCount} Startups (≥1.0%)</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 w-full sm:w-auto">
            <span className="text-[#A1A8B8]">Pipeline:</span>
            <span className="font-semibold text-[#F3F4F6]">{cards.length} Tracked in CRM</span>
          </div>
        </div>

        {/* 3. Discovery Controls: Search, Sort, View, and Clean Filter Groups */}
        <div className="rounded-xl bg-[#171A23] border border-[#292E3B] p-3 sm:p-4 space-y-3">
          {/* Row A: Prominent Search + Sort + View Switcher */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#737C90]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by role title, startup name, or tech stack..."
                className="w-full pl-9 pr-8 py-1.5 rounded-lg bg-[#0F1117] border border-[#292E3B] hover:border-[#3E4558] focus:border-[#818CF8] text-xs text-[#F3F4F6] placeholder-[#737C90] outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-xs text-[#737C90] hover:text-[#F3F4F6]"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort & View Mode */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'MATCH' | 'SALARY' | 'RECENT')}
                  className="appearance-none pl-3 pr-8 py-1.5 rounded-lg bg-[#0F1117] border border-[#292E3B] text-xs font-medium text-[#A1A8B8] hover:text-[#F3F4F6] hover:border-[#3E4558] outline-none transition-colors cursor-pointer"
                  title="Sort opportunities"
                >
                  <option value="MATCH">Sort: Highest Match</option>
                  <option value="SALARY">Sort: Compensation</option>
                  <option value="RECENT">Sort: Most Recent</option>
                </select>
                <SlidersHorizontal className="absolute right-2.5 top-2.5 w-3 h-3 text-[#737C90] pointer-events-none" />
              </div>

              {/* View Toggle */}
              <div className="flex items-center p-0.5 rounded-lg bg-[#0F1117] border border-[#292E3B]">
                <button
                  onClick={() => setViewMode('CARDS')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
                    viewMode === 'CARDS'
                      ? 'bg-[#1D2230] text-[#F3F4F6] border border-[#3E4558]'
                      : 'text-[#737C90] hover:text-[#A1A8B8]'
                  }`}
                  title="Grid view"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Cards</span>
                </button>

                <button
                  onClick={() => setViewMode('TABLE')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
                    viewMode === 'TABLE'
                      ? 'bg-[#1D2230] text-[#F3F4F6] border border-[#3E4558]'
                      : 'text-[#737C90] hover:text-[#A1A8B8]'
                  }`}
                  title="Structured table view"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Table</span>
                </button>
              </div>
            </div>
          </div>

          {/* Row B: Clear, Human Filter Groups */}
          <div className="space-y-2 pt-2 border-t border-[#292E3B]">
            {/* Group 1: Role Discipline */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
              <span className="text-xs font-semibold text-[#A1A8B8] shrink-0 mr-1">Role:</span>
              {DISCIPLINES.map((discipline) => {
                const isActive = selectedDiscipline === discipline;
                return (
                  <button
                    key={discipline}
                    onClick={() => setSelectedDiscipline(isActive && discipline !== 'All Roles' ? 'All Roles' : discipline)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-[#1D2230] border border-[#818CF8] text-[#F3F4F6] shadow-sm'
                        : 'bg-[#0F1117] border border-[#292E3B] text-[#A1A8B8] hover:text-[#F3F4F6] hover:border-[#3E4558]'
                    }`}
                  >
                    {discipline}
                    {isActive && discipline !== 'All Roles' && (
                      <span className="ml-1.5 text-[10px] text-[#A1A8B8] hover:text-white">✕</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Group 2: Location & Ecosystem */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
              <span className="text-xs font-semibold text-[#A1A8B8] shrink-0 mr-1">Location & Ecosystem:</span>

              {/* Bangalore Corridors */}
              <button
                onClick={() => onSelectCorridorFilter(corridorFilter === 'BLR' ? 'ALL' : 'BLR')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  corridorFilter === 'BLR'
                    ? 'bg-[#1D2230] border border-[#818CF8] text-[#F3F4F6]'
                    : 'bg-[#0F1117] border border-[#292E3B] text-[#A1A8B8] hover:text-[#F3F4F6]'
                }`}
              >
                <MapPin className="w-3 h-3 text-[#34D399]" />
                <span>Bangalore Tech Hubs</span>
                {corridorFilter === 'BLR' && <span className="ml-1 text-[10px] text-[#A1A8B8]">✕</span>}
              </button>

              {/* YC Startups */}
              <button
                onClick={() => onSelectCorridorFilter(corridorFilter === 'YC' ? 'ALL' : 'YC')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  corridorFilter === 'YC'
                    ? 'bg-[#1D2230] border border-[#818CF8] text-[#F3F4F6]'
                    : 'bg-[#0F1117] border border-[#292E3B] text-[#A1A8B8] hover:text-[#F3F4F6]'
                }`}
              >
                <Flame className="w-3 h-3 text-[#FBBF24]" />
                <span>YC Startups</span>
                {corridorFilter === 'YC' && <span className="ml-1 text-[10px] text-[#A1A8B8]">✕</span>}
              </button>

              {/* Remote Friendly */}
              <button
                onClick={() => onSelectCorridorFilter(corridorFilter === 'REMOTE' ? 'ALL' : 'REMOTE')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  corridorFilter === 'REMOTE'
                    ? 'bg-[#1D2230] border border-[#818CF8] text-[#F3F4F6]'
                    : 'bg-[#0F1117] border border-[#292E3B] text-[#A1A8B8] hover:text-[#F3F4F6]'
                }`}
              >
                <span>Remote Friendly</span>
                {corridorFilter === 'REMOTE' && <span className="ml-1 text-[10px] text-[#A1A8B8]">✕</span>}
              </button>

              {/* Notice Buyout */}
              <button
                onClick={() => onSelectCorridorFilter(corridorFilter === 'NOTICE' ? 'ALL' : 'NOTICE')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  corridorFilter === 'NOTICE'
                    ? 'bg-[#1D2230] border border-[#818CF8] text-[#F3F4F6]'
                    : 'bg-[#0F1117] border border-[#292E3B] text-[#A1A8B8] hover:text-[#F3F4F6]'
                }`}
              >
                <span>Notice Buyout Supported</span>
                {corridorFilter === 'NOTICE' && <span className="ml-1 text-[10px] text-[#A1A8B8]">✕</span>}
              </button>

              {/* Reset all active filters shortcut */}
              {isAnyFilterActive && (
                <button
                  onClick={() => {
                    setSelectedDiscipline('All Roles');
                    onSelectCorridorFilter('ALL');
                    setSearchQuery('');
                  }}
                  className="ml-auto text-xs font-medium text-[#818CF8] hover:underline whitespace-nowrap"
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
          <div className="py-20 text-center space-y-3 rounded-xl bg-[#171A23] border border-[#292E3B] p-8">
            <Briefcase className="w-8 h-8 text-[#737C90] mx-auto" />
            <h3 className="text-sm font-semibold text-[#F3F4F6]">No matching opportunities found</h3>
            <p className="text-xs text-[#A1A8B8] max-w-sm mx-auto">
              Try adjusting your search query, location, or discipline filter to view active roles.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDiscipline('All Roles');
                onSelectCorridorFilter('ALL');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-[#818CF8] hover:bg-[#9FA8FF] text-[#0F1117] text-xs font-semibold transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            {/* VIEW MODE A: COMPACT OPPORTUNITY CARDS (3 columns on xl, 2 on md, 1 on sm) */}
            {viewMode === 'CARDS' && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
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
              <div className="rounded-xl border border-[#292E3B] bg-[#171A23] overflow-hidden shadow-sm">
                <div className="min-w-[760px]">
                  {/* Table Header */}
                  <div className="grid grid-cols-[minmax(220px,2fr)_minmax(130px,1.2fr)_minmax(180px,1.5fr)_minmax(130px,1fr)_90px_150px] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#A1A8B8] border-b border-[#292E3B] bg-[#1D2230]/70">
                    <div>Opportunity & Startup</div>
                    <div>Location</div>
                    <div>Why You Match</div>
                    <div>Compensation</div>
                    <div>Score</div>
                    <div className="text-right">Action</div>
                  </div>

                  {/* Table Rows */}
                  <div className="divide-y divide-[#292E3B]">
                    {filteredJobs.map((job) => {
                      const isSelected = job.id === selectedJobId;
                      const isTracked = appliedJobIds.has(job.id);
                      return (
                        <div
                          key={job.id}
                          onClick={() => onSelectJob(job)}
                          className={`grid grid-cols-[minmax(220px,2fr)_minmax(130px,1.2fr)_minmax(180px,1.5fr)_minmax(130px,1fr)_90px_150px] items-center px-4 py-3 cursor-pointer text-xs transition-colors duration-150 ${
                            isSelected
                              ? 'bg-[#1D2230] border-l-[3px] border-[#818CF8]'
                              : 'hover:bg-[#1D2230]'
                          }`}
                        >
                          {/* Role & Company */}
                          <div className="flex items-center gap-2.5 min-w-0 pr-3">
                            <div className="w-8 h-8 rounded-lg bg-[#1D2230] border border-[#292E3B] flex items-center justify-center font-bold text-[#F3F4F6] text-xs shrink-0">
                              {job.company.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-[#F3F4F6] truncate">{job.title}</span>
                                {job.source.includes('YC') && (
                                  <span className="px-1.5 py-0.2 rounded bg-[#FBBF24]/10 border border-[#FBBF24]/30 text-[#FBBF24] text-[10px] font-medium shrink-0">
                                    YC
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-[#A1A8B8] truncate mt-0.5">
                                {job.company} {job.fundingRound ? `· ${job.fundingRound}` : ''}
                              </div>
                            </div>
                          </div>

                          {/* Location */}
                          <div className="text-[#A1A8B8] min-w-0 pr-2">
                            <div className="truncate flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#737C90] shrink-0" />
                              <span>{job.bangaloreCluster || job.location}</span>
                            </div>
                            <span className="text-[11px] text-[#737C90] block mt-0.5">
                              {job.isRemote ? 'Remote Friendly' : 'In-Office'}
                            </span>
                          </div>

                          {/* Matched Skills */}
                          <div className="flex flex-wrap items-center gap-1 pr-2">
                            {job.requiredSkills.slice(0, 3).map((s) => (
                              <span
                                key={s}
                                className="px-1.5 py-0.5 rounded text-[10px] font-medium text-[#34D399] bg-[#34D399]/10 border border-[#34D399]/20"
                              >
                                {s}
                              </span>
                            ))}
                            {job.requiredSkills.length > 3 && (
                              <span className="text-[10px] text-[#A1A8B8] font-medium">
                                +{job.requiredSkills.length - 3}
                              </span>
                            )}
                          </div>

                          {/* Compensation */}
                          <div className="text-xs text-[#F3F4F6] pr-2">
                            <span className="font-bold">{job.salaryDisplay || `₹${job.minCtcLpa}–${job.maxCtcLpa} LPA`}</span>
                            {job.equityRange && !job.equityRange.toLowerCase().includes('none') && (
                              <span className="block text-[11px] text-[#A1A8B8]">{job.equityRange}</span>
                            )}
                          </div>

                          {/* Match */}
                          <div>
                            <span className="text-xs px-2 py-0.5 rounded bg-[#34D399]/10 border border-[#34D399]/30 text-[#34D399] font-bold">
                              {job.atsMatchScore}%
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => onOpenPitch(job)}
                              className="px-2.5 py-1 rounded-md bg-[#818CF8] hover:bg-[#9FA8FF] text-[#0F1117] text-xs font-semibold transition-colors"
                              title="Compose cold email to founder"
                            >
                              Pitch
                            </button>

                            <button
                              onClick={() => onAddToPipeline(job)}
                              className={`p-1.5 rounded-md border transition-colors ${
                                isTracked
                                  ? 'bg-[#1D2230] border-[#818CF8] text-[#818CF8]'
                                  : 'bg-[#171A23] hover:bg-[#1D2230] border-[#292E3B] text-[#A1A8B8] hover:text-[#F3F4F6]'
                              }`}
                              title={isTracked ? 'Saved in Pipeline' : 'Save to Pipeline'}
                            >
                              {isTracked ? <BookmarkCheck className="w-3.5 h-3.5 text-[#818CF8]" /> : <Bookmark className="w-3.5 h-3.5" />}
                            </button>

                            <button
                              onClick={() => onDirectApply(job)}
                              className="p-1.5 rounded-md text-[#737C90] hover:text-[#F3F4F6] hover:bg-[#1D2230] transition-colors"
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
