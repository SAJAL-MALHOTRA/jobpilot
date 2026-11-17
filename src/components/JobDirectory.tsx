import React, { useState, useMemo } from 'react';
import type { JobListing, CandidateProfile } from '../types';
import { 
  Search, 
  MapPin, 
  Send, 
  Layers, 
  ExternalLink, 
  BookmarkPlus, 
  Table as TableIcon, 
  LayoutGrid 
} from 'lucide-react';
import { CompanySwipeDeck } from './CompanySwipeDeck';
import type { CorridorFilter } from './WorkspaceSidebar';

interface JobDirectoryProps {
  jobs: JobListing[];
  candidate: CandidateProfile;
  selectedJobId: string | null;
  onSelectJob: (job: JobListing) => void;
  onAddToPipeline: (job: JobListing) => void;
  onDirectApply: (job: JobListing) => void;
  appliedJobIds: Set<string>;
  corridorFilter: CorridorFilter;
  onSelectCorridorFilter: (filter: CorridorFilter) => void;
  onOpenPitch: (job: JobListing) => void;
  onOpenAts: (job: JobListing) => void;
}

const DISCIPLINES = [
  'All Disciplines',
  'Founding AI Engineer',
  'Full Stack Developer',
  'Distributed Systems',
  'Frontend & Canvas',
  'DevOps & SRE',
  'Mobile Engineering',
];

export const JobDirectory: React.FC<JobDirectoryProps> = ({
  jobs,
  candidate,
  selectedJobId,
  onSelectJob,
  onAddToPipeline,
  onDirectApply,
  appliedJobIds,
  corridorFilter,
  onSelectCorridorFilter,
  onOpenPitch,
  onOpenAts,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('All Disciplines');
  const [viewMode, setViewMode] = useState<'TABLE' | 'CARDS' | 'SWIPE'>('TABLE');
  const [sortBy, setSortBy] = useState<'MATCH' | 'SALARY' | 'RECENT'>('MATCH');

  // Filter and sort jobs
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
        selectedDiscipline === 'All Disciplines' ||
        job.roleCategory === selectedDiscipline ||
        (selectedDiscipline === 'Founding AI Engineer' && (job.title.toLowerCase().includes('ai') || job.title.toLowerCase().includes('machine learning'))) ||
        (selectedDiscipline === 'Full Stack Developer' && job.title.toLowerCase().includes('full stack')) ||
        (selectedDiscipline === 'Distributed Systems' && (job.title.toLowerCase().includes('backend') || job.title.toLowerCase().includes('systems'))) ||
        (selectedDiscipline === 'Frontend & Canvas' && job.title.toLowerCase().includes('frontend')) ||
        (selectedDiscipline === 'DevOps & SRE' && (job.title.toLowerCase().includes('devops') || job.title.toLowerCase().includes('reliability'))) ||
        (selectedDiscipline === 'Mobile Engineering' && job.title.toLowerCase().includes('mobile'));

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

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0D0E12] overflow-hidden text-[#EDEDED] font-sans">
      {/* Top Filter & Toolbar Bar */}
      <div className="p-3 sm:px-6 py-3 border-b border-[#21232D] bg-[#121318]/90 backdrop-blur-md flex flex-col gap-3 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search Input with quick key */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#787A88]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roles, skills, startups, corridors..."
              className="w-full pl-9 pr-8 py-1.5 rounded-lg bg-[#181922] border border-[#252734] hover:border-[#383B4E] focus:border-[#5E6AD2] text-xs text-[#EDEDED] placeholder-[#787A88] outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-xs text-[#787A88] hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* View Mode Toggle and Sorting */}
          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'MATCH' | 'SALARY' | 'RECENT')}
              className="px-2.5 py-1.5 rounded-lg bg-[#181922] border border-[#252734] text-xs text-[#9D9FA9] outline-none hover:text-white transition-colors cursor-pointer"
            >
              <option value="MATCH">Sort: Best Match</option>
              <option value="SALARY">Sort: Compensation</option>
              <option value="RECENT">Sort: Default</option>
            </select>

            {/* View Switchers */}
            <div className="flex items-center p-0.5 rounded-lg bg-[#181922] border border-[#252734]">
              <button
                onClick={() => setViewMode('TABLE')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'TABLE' ? 'bg-[#5E6AD2] text-white shadow-sm' : 'text-[#787A88] hover:text-white'
                }`}
                title="Table View (High Density)"
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('CARDS')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'CARDS' ? 'bg-[#5E6AD2] text-white shadow-sm' : 'text-[#787A88] hover:text-white'
                }`}
                title="Cards Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('SWIPE')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'SWIPE' ? 'bg-[#5E6AD2] text-white shadow-sm' : 'text-[#787A88] hover:text-white'
                }`}
                title="Swipe Triage Deck"
              >
                <Layers className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Discipline Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          {DISCIPLINES.map((discipline) => (
            <button
              key={discipline}
              onClick={() => setSelectedDiscipline(discipline)}
              className={`px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition-all ${
                selectedDiscipline === discipline
                  ? 'bg-[#222432] text-white font-medium border border-[#3A3D52]'
                  : 'text-[#848695] hover:text-[#EDEDED] hover:bg-[#181922]'
              }`}
            >
              {discipline}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Status Bar */}
      <div className="px-4 sm:px-6 py-2 border-b border-[#1E202B] bg-[#101116] flex items-center justify-between text-[11px] text-[#787A88]">
        <div className="flex items-center gap-2">
          <span className="text-[#EDEDED] font-medium font-mono">
            {filteredJobs.length} roles found
          </span>
          <span className="text-[#555767]">·</span>
          <span className="text-[#848695]">Bangalore Corridors & YC Startups</span>
          {corridorFilter !== 'ALL' && (
            <span className="px-1.5 py-0.5 rounded bg-[#181922] text-[#9D9FA9] border border-[#252734] font-mono text-[10px]">
              Filter: {corridorFilter}
            </span>
          )}
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[10px] text-[#636573]">
          <span>Click any role to inspect founder contacts & draft pitches</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* VIEW 1: HIGH-DENSITY LINEAR/NOTION TABLE */}
        {viewMode === 'TABLE' && (
          <div className="min-w-[760px]">
            {/* Table Header */}
            <div className="grid grid-cols-[minmax(220px,2fr)_minmax(140px,1.2fr)_minmax(180px,1.5fr)_minmax(120px,1fr)_90px_100px] px-4 sm:px-6 py-2.5 text-[11px] font-medium uppercase tracking-wider text-[#636573] border-b border-[#21232D] bg-[#121318]/70 sticky top-0 z-10 backdrop-blur-sm">
              <div>Role & Company</div>
              <div>Location / Cluster</div>
              <div>Required Skills</div>
              <div>Compensation</div>
              <div>Match</div>
              <div className="text-right">Action</div>
            </div>

            {/* Table Rows */}
            {filteredJobs.length === 0 ? (
              <div className="py-20 text-center text-[#787A88] text-sm">
                No roles match your search or filter criteria.
              </div>
            ) : (
              <div className="divide-y divide-[#1C1E27]">
                {filteredJobs.map((job) => {
                  const isSelected = job.id === selectedJobId;
                  const isTracked = appliedJobIds.has(job.id);
                  return (
                    <div
                      key={job.id}
                      onClick={() => onSelectJob(job)}
                      className={`grid grid-cols-[minmax(220px,2fr)_minmax(140px,1.2fr)_minmax(180px,1.5fr)_minmax(120px,1fr)_90px_100px] items-center px-4 sm:px-6 py-2.5 cursor-pointer text-xs transition-colors duration-150 ${
                        isSelected
                          ? 'bg-[#181A25] border-l-[3px] border-[#5E6AD2]'
                          : 'hover:bg-[#14151E]'
                      }`}
                    >
                      {/* Role & Company */}
                      <div className="flex items-center gap-3 min-w-0 pr-3">
                        <div className="w-8 h-8 rounded-lg bg-[#1C1E2A] border border-[#2B2E40] flex items-center justify-center font-bold text-[#D0D2E0] text-xs shrink-0 shadow-sm">
                          {job.company.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-white truncate hover:underline">{job.title}</span>
                            {job.noticeBuyoutCovered && (
                              <span className="px-1 py-0.2 rounded bg-purple-950/60 border border-purple-800/60 text-purple-300 text-[9px] font-mono shrink-0">
                                Buyout
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#8C8E9D] truncate mt-0.5">
                            {job.company} · <span className="text-[#636573] font-mono">{job.source}</span>
                          </div>
                        </div>
                      </div>

                      {/* Location / Cluster */}
                      <div className="text-[#B0B2C0] min-w-0 pr-2">
                        <div className="truncate flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#787A88] shrink-0" />
                          <span>{job.bangaloreCluster || job.location}</span>
                        </div>
                        <span className="text-[10px] text-[#636573] block mt-0.5">
                          {job.isRemote ? 'Remote' : 'In-Office'}
                        </span>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap items-center gap-1 pr-2">
                        {job.requiredSkills.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="px-1.5 py-0.5 rounded bg-[#181923] border border-[#252735] text-[10px] text-[#9D9FA9]"
                          >
                            {s}
                          </span>
                        ))}
                        {job.requiredSkills.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded bg-[#151620] border border-[#232534] text-[10px] text-[#636573] font-mono">
                            +{job.requiredSkills.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Compensation */}
                      <div className="font-mono text-[11px] text-[#D0D1DC] pr-2">
                        <span className="font-semibold">{job.salaryDisplay || `₹${job.minCtcLpa}–${job.maxCtcLpa} LPA`}</span>
                        <span className="block text-[10px] text-[#636573] font-sans">{job.equityRange}</span>
                      </div>

                      {/* Match Score */}
                      <div>
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/50 text-emerald-300">
                          {job.atsMatchScore}%
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onAddToPipeline(job)}
                          className={`p-1.5 rounded hover:bg-[#222432] transition-colors ${
                            isTracked ? 'text-indigo-400' : 'text-[#787A88] hover:text-white'
                          }`}
                          title={isTracked ? 'Tracked in Pipeline' : 'Add to Pipeline'}
                        >
                          <BookmarkPlus className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onOpenPitch(job)}
                          className="p-1.5 rounded hover:bg-[#222432] text-[#787A88] hover:text-white transition-colors"
                          title="Draft Founder Pitch"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onDirectApply(job)}
                          className="p-1.5 rounded hover:bg-[#222432] text-[#787A88] hover:text-white transition-colors"
                          title="Open Careers Page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: CARDS GRID */}
        {viewMode === 'CARDS' && (
          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJobs.map((job) => {
              const isSelected = job.id === selectedJobId;
              const isTracked = appliedJobIds.has(job.id);
              return (
                <div
                  key={job.id}
                  onClick={() => onSelectJob(job)}
                  className={`p-4 rounded-xl border bg-[#15161E] hover:border-[#383B4E] cursor-pointer transition-all duration-150 flex flex-col justify-between ${
                    isSelected ? 'border-[#5E6AD2] bg-[#181A25]' : 'border-[#232532]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#1C1E2A] border border-[#2B2E40] flex items-center justify-center font-bold text-[#D0D2E0] text-xs shrink-0">
                          {job.company.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm text-white truncate">{job.title}</h4>
                          <p className="text-[11px] text-[#8C8E9D] truncate">{job.company}</p>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 shrink-0">
                        {job.atsMatchScore}%
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-[#787A88]">
                      <MapPin className="w-3 h-3 text-[#787A88] shrink-0" />
                      <span className="truncate">{job.bangaloreCluster || job.location}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1">
                      {job.requiredSkills.slice(0, 3).map((s) => (
                        <span key={s} className="px-1.5 py-0.5 rounded bg-[#181923] border border-[#252735] text-[10px] text-[#9D9FA9]">
                          {s}
                        </span>
                      ))}
                      {job.requiredSkills.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded bg-[#151620] border border-[#232534] text-[10px] text-[#636573] font-mono">
                          +{job.requiredSkills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#20222D] flex items-center justify-between">
                    <span className="font-mono text-xs text-[#EDEDED] font-semibold">
                      {job.salaryDisplay || `₹${job.minCtcLpa}–${job.maxCtcLpa} LPA`}
                    </span>
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onAddToPipeline(job)}
                        className={`p-1.5 rounded hover:bg-[#222432] transition-colors ${
                          isTracked ? 'text-indigo-400' : 'text-[#787A88] hover:text-white'
                        }`}
                        title="Track in Pipeline"
                      >
                        <BookmarkPlus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onOpenPitch(job)}
                        className="p-1.5 rounded hover:bg-[#222432] text-[#787A88] hover:text-white transition-colors"
                        title="Draft Pitch"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW 3: SWIPE TRIAGE DECK */}
        {viewMode === 'SWIPE' && (
          <div className="p-4 sm:p-6 max-w-2xl mx-auto">
            <CompanySwipeDeck
              jobs={filteredJobs}
              candidate={candidate}
              onPitch={onOpenPitch}
              onTailorAts={onOpenAts}
              onAddToPipeline={onAddToPipeline}
              onClearFilters={() => {
                setSearchQuery('');
                setSelectedDiscipline('All Disciplines');
                onSelectCorridorFilter('ALL');
              }}
              appliedJobIds={appliedJobIds}
            />
          </div>
        )}
      </div>
    </div>
  );
};
