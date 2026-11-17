import React, { useState, useMemo } from 'react';
import type { JobListing, CandidateProfile, ApplicationCard } from '../types';
import { OpportunityCard } from './OpportunityCard';
import { 
  Search, 
  MapPin, 
  Flame, 
  ShieldCheck, 
  Table as TableIcon, 
  LayoutGrid, 
  BookmarkPlus, 
  ExternalLink,
  Briefcase
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
      // 1. Search Query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.requiredSkills.some((s) => s.toLowerCase().includes(q));

      // 2. Discipline
      const matchesDiscipline =
        selectedDiscipline === 'All Roles' ||
        job.roleCategory === selectedDiscipline ||
        (selectedDiscipline === 'Founding AI' && (job.title.toLowerCase().includes('ai') || job.title.toLowerCase().includes('machine learning'))) ||
        (selectedDiscipline === 'Full Stack' && job.title.toLowerCase().includes('full stack')) ||
        (selectedDiscipline === 'Backend & Systems' && (job.title.toLowerCase().includes('backend') || job.title.toLowerCase().includes('systems'))) ||
        (selectedDiscipline === 'Frontend' && job.title.toLowerCase().includes('frontend')) ||
        (selectedDiscipline === 'DevOps & SRE' && (job.title.toLowerCase().includes('devops') || job.title.toLowerCase().includes('reliability'))) ||
        (selectedDiscipline === 'Mobile' && job.title.toLowerCase().includes('mobile'));

      // 3. Corridor Filter
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

  // High-signal intelligence metrics
  const highFitCount = jobs.filter((j) => (j.atsMatchScore || 0) >= 80).length;
  const foundingCount = jobs.filter((j) => j.equityRange && j.equityRange.includes('%')).length;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0C0D13] text-[#EDEDED] overflow-y-auto selection:bg-[#5E6AD2]/30 selection:text-white">
      <div className="max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* 1. Header & Metric Highlights (Ramp & Mercury Style) */}
        <div className="space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
                Discover opportunities
              </h1>
              <p className="text-sm text-[#8E92A8] mt-1 max-w-2xl">
                Curated high-conviction startup roles across Bangalore & YC networks, matched to your engineering background.
              </p>
            </div>

            {/* Quick Action Badges */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#181A26] border border-[#262A3C] text-xs text-[#9CA0B6] font-mono">
                Candidate: <strong className="text-white font-medium">{candidate.fullName}</strong> ({candidate.yearsOfExperience}y)
              </span>
            </div>
          </div>

          {/* Ramp-style Intelligence Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[#141622] border border-[#222538] flex flex-col justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#6F7388]">High Skill Match</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-emerald-400 font-mono">{highFitCount} Roles</span>
                <span className="text-[11px] text-[#8E92A8]">≥ 80% Fit</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#141622] border border-[#222538] flex flex-col justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#6F7388]">High Equity Roles</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-indigo-300 font-mono">{foundingCount} Startups</span>
                <span className="text-[11px] text-[#8E92A8]">Up to 1.5% Eq</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#141622] border border-[#222538] flex flex-col justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#6F7388]">Direct Reach</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-white font-mono">100%</span>
                <span className="text-[11px] text-emerald-400">Verified Inboxes</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#141622] border border-[#222538] flex flex-col justify-between">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#6F7388]">Your Pipeline</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-[#E0E2EC] font-mono">{cards.length} Tracked</span>
                <span className="text-[11px] text-[#8E92A8]">In active CRM</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Ashby-style Filter & Search Command Bar */}
        <div className="p-3 sm:p-4 rounded-2xl bg-[#13151F] border border-[#222536] space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#757990]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by role title, startup name, or tech stack..."
                className="w-full pl-10 pr-9 py-2 rounded-xl bg-[#181B28] border border-[#282C40] hover:border-[#3D425E] focus:border-[#5E6AD2] text-xs text-[#EDEDED] placeholder-[#757990] outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-[#757990] hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort & View Controls */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'MATCH' | 'SALARY' | 'RECENT')}
                className="px-3 py-2 rounded-xl bg-[#181B28] border border-[#282C40] text-xs text-[#9CA0B6] outline-none hover:text-white transition-colors cursor-pointer"
              >
                <option value="MATCH">Sort: Highest Match</option>
                <option value="SALARY">Sort: Compensation</option>
                <option value="RECENT">Sort: Most Recent</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center p-0.5 rounded-xl bg-[#181B28] border border-[#282C40]">
                <button
                  onClick={() => setViewMode('CARDS')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                    viewMode === 'CARDS'
                      ? 'bg-[#5E6AD2] text-white shadow-sm'
                      : 'text-[#8E92A8] hover:text-white'
                  }`}
                  title="Opportunity Cards"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Cards</span>
                </button>

                <button
                  onClick={() => setViewMode('TABLE')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                    viewMode === 'TABLE'
                      ? 'bg-[#5E6AD2] text-white shadow-sm'
                      : 'text-[#8E92A8] hover:text-white'
                  }`}
                  title="Structured Table"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>Table</span>
                </button>
              </div>
            </div>
          </div>

          {/* Contextual Filter Pills (Ashby Style) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none pt-1">
            {DISCIPLINES.map((discipline) => (
              <button
                key={discipline}
                onClick={() => setSelectedDiscipline(discipline)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedDiscipline === discipline
                    ? 'bg-[#5E6AD2] text-white shadow-sm'
                    : 'bg-[#181A26] border border-[#25283A] text-[#8E92A8] hover:text-white hover:bg-[#202334]'
                }`}
              >
                {discipline}
              </button>
            ))}

            <div className="h-4 w-[1px] bg-[#282C40] mx-1 shrink-0" />

            {/* Curated Corridor Shortcut Pills */}
            <button
              onClick={() => onSelectCorridorFilter(corridorFilter === 'BLR' ? 'ALL' : 'BLR')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex items-center gap-1 transition-all ${
                corridorFilter === 'BLR'
                  ? 'bg-emerald-950/70 border border-emerald-600 text-emerald-300'
                  : 'bg-[#181A26] border border-[#25283A] text-[#8E92A8] hover:text-white'
              }`}
            >
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>Bangalore Corridors</span>
            </button>

            <button
              onClick={() => onSelectCorridorFilter(corridorFilter === 'YC' ? 'ALL' : 'YC')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex items-center gap-1 transition-all ${
                corridorFilter === 'YC'
                  ? 'bg-amber-950/70 border border-amber-600 text-amber-300'
                  : 'bg-[#181A26] border border-[#25283A] text-[#8E92A8] hover:text-white'
              }`}
            >
              <Flame className="w-3 h-3 text-amber-400" />
              <span>YC Founders</span>
            </button>

            <button
              onClick={() => onSelectCorridorFilter(corridorFilter === 'NOTICE' ? 'ALL' : 'NOTICE')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex items-center gap-1 transition-all ${
                corridorFilter === 'NOTICE'
                  ? 'bg-purple-950/70 border border-purple-600 text-purple-300'
                  : 'bg-[#181A26] border border-[#25283A] text-[#8E92A8] hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-purple-400" />
              <span>Notice Buyout</span>
            </button>
          </div>
        </div>

        {/* 3. Opportunities Presentation Area */}
        {filteredJobs.length === 0 ? (
          <div className="py-24 text-center space-y-3 rounded-2xl bg-[#13151F] border border-[#222534] p-8">
            <Briefcase className="w-8 h-8 text-[#5E6377] mx-auto" />
            <h3 className="text-base font-semibold text-white">No matching opportunities found</h3>
            <p className="text-xs text-[#8E92A8] max-w-sm mx-auto">
              Try resetting your search query or discipline filter to see all active startup roles.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDiscipline('All Roles');
                onSelectCorridorFilter('ALL');
              }}
              className="px-4 py-2 rounded-lg bg-[#5E6AD2] hover:bg-[#6E7BEA] text-white text-xs font-medium transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* VIEW MODE A: ASHBY-STYLE OPPORTUNITY CARDS */}
            {viewMode === 'CARDS' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* VIEW MODE B: REFINED LINEAR TABLE */}
            {viewMode === 'TABLE' && (
              <div className="rounded-2xl border border-[#222536] bg-[#13151F] overflow-hidden shadow-lg">
                <div className="min-w-[760px]">
                  {/* Table Header */}
                  <div className="grid grid-cols-[minmax(240px,2fr)_minmax(140px,1.2fr)_minmax(180px,1.5fr)_minmax(130px,1fr)_100px_160px] px-5 py-3 text-xs font-medium uppercase tracking-wider text-[#6F7388] border-b border-[#222536] bg-[#161824]/60">
                    <div>Opportunity & Startup</div>
                    <div>Location</div>
                    <div>Why You Match</div>
                    <div>Compensation</div>
                    <div>Score</div>
                    <div className="text-right">Action</div>
                  </div>

                  {/* Table Rows */}
                  <div className="divide-y divide-[#1D202E]">
                    {filteredJobs.map((job) => {
                      const isSelected = job.id === selectedJobId;
                      const isTracked = appliedJobIds.has(job.id);
                      return (
                        <div
                          key={job.id}
                          onClick={() => onSelectJob(job)}
                          className={`grid grid-cols-[minmax(240px,2fr)_minmax(140px,1.2fr)_minmax(180px,1.5fr)_minmax(130px,1fr)_100px_160px] items-center px-5 py-3.5 cursor-pointer text-xs transition-colors duration-150 ${
                            isSelected
                              ? 'bg-[#181B26] border-l-[3px] border-[#5E6AD2]'
                              : 'hover:bg-[#161824]'
                          }`}
                        >
                          {/* Role & Company */}
                          <div className="flex items-center gap-3 min-w-0 pr-3">
                            <div className="w-9 h-9 rounded-xl bg-[#1C1F2E] border border-[#2C3146] flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm">
                              {job.company.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-white truncate hover:underline">{job.title}</span>
                                {job.source.includes('YC') && (
                                  <span className="px-1.5 py-0.2 rounded bg-amber-950/60 border border-amber-800/60 text-amber-300 text-[10px] font-mono shrink-0">
                                    YC
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-[#8E92A8] truncate mt-0.5">
                                {job.company} · <span className="text-[#686C80]">{job.fundingRound}</span>
                              </div>
                            </div>
                          </div>

                          {/* Location */}
                          <div className="text-[#C0C3D4] min-w-0 pr-2">
                            <div className="truncate flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#6D7185] shrink-0" />
                              <span>{job.bangaloreCluster || job.location}</span>
                            </div>
                            <span className="text-[11px] text-[#6D7185] block mt-0.5">
                              {job.isRemote ? 'Remote Friendly' : 'In-Office'}
                            </span>
                          </div>

                          {/* Matched Skills */}
                          <div className="flex flex-wrap items-center gap-1 pr-2">
                            {job.requiredSkills.slice(0, 3).map((s) => (
                              <span
                                key={s}
                                className="px-2 py-0.5 rounded-md bg-[#181A26] border border-[#262A3C] text-[11px] text-[#A6AABF] font-mono"
                              >
                                {s}
                              </span>
                            ))}
                            {job.requiredSkills.length > 3 && (
                              <span className="px-1.5 py-0.5 rounded bg-[#161824] border border-[#222536] text-[10px] text-[#6D7185] font-mono">
                                +{job.requiredSkills.length - 3}
                              </span>
                            )}
                          </div>

                          {/* Compensation */}
                          <div className="font-mono text-xs text-[#EDEDED] pr-2">
                            <span className="font-semibold">{job.salaryDisplay || `₹${job.minCtcLpa}–${job.maxCtcLpa} LPA`}</span>
                            <span className="block text-[11px] text-[#71758A] font-sans">{job.equityRange}</span>
                          </div>

                          {/* Match */}
                          <div>
                            <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-emerald-950/50 border border-emerald-700/60 text-emerald-300 font-medium">
                              {job.atsMatchScore}%
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => onOpenPitch(job)}
                              className="px-2.5 py-1 rounded-lg bg-[#5E6AD2] hover:bg-[#6E7BEA] text-white text-xs font-medium transition-colors"
                            >
                              Pitch
                            </button>

                            <button
                              onClick={() => onAddToPipeline(job)}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                isTracked
                                  ? 'bg-indigo-950/40 border-indigo-800 text-indigo-300'
                                  : 'bg-[#181A26] hover:bg-[#202334] border-[#282C40] text-[#8E92A8] hover:text-white'
                              }`}
                              title={isTracked ? 'Saved in Pipeline' : 'Save to Pipeline'}
                            >
                              <BookmarkPlus className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => onDirectApply(job)}
                              className="p-1.5 rounded-lg hover:bg-[#202334] text-[#8E92A8] hover:text-white transition-colors"
                              title="Direct Apply URL"
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
