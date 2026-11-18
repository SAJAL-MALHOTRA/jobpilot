import React, { useState, useMemo } from 'react';
import type { JobListing, CandidateProfile, ApplicationCard } from '../types';
import { OpportunityCard } from './OpportunityCard';
import { getCompanyBrandStyle } from '../lib/jobRadarEngine';
import { analyzeJobMatch } from '../lib/matchReasoning';
import { 
  Search, 
  MapPin, 
  Table as TableIcon, 
  LayoutGrid, 
  Building2,
  Bookmark, 
  SlidersHorizontal, 
  Check, 
  Send,
  ShieldCheck,
  Download,
  Copy,
  Sun,
  Moon,
  ChevronDown,
  UploadCloud,
  ExternalLink,
  FileText,
  CheckCircle2,
  Info
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
  onOpenResumeScanner?: () => void;
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
  onOpenAts,
  onOpenResumeScanner,
  theme = 'light',
  onToggleTheme,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('All Roles');
  const [viewMode, setViewMode] = useState<'STARTUPS' | 'TABLE' | 'CARDS'>('STARTUPS');
  const [sortBy, setSortBy] = useState<'MATCH' | 'SALARY' | 'RECENT'>('MATCH');
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [hoveredFounderEmail, setHoveredFounderEmail] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Filter and sort opportunities
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q) ||
        job.requiredSkills.some((s) => s.toLowerCase().includes(q));

      const matchesDiscipline =
        selectedDiscipline === 'All Roles' ||
        job.roleCategory === selectedDiscipline ||
        (selectedDiscipline === 'Founding AI' && (job.title.toLowerCase().includes('ai') || job.title.toLowerCase().includes('machine learning'))) ||
        (selectedDiscipline === 'Full Stack' && job.title.toLowerCase().includes('full stack')) ||
        (selectedDiscipline === 'Backend & Systems' && (job.title.toLowerCase().includes('backend') || job.title.toLowerCase().includes('systems'))) ||
        (selectedDiscipline === 'Frontend' && job.title.toLowerCase().includes('frontend')) ||
        (selectedDiscipline === 'DevOps & SRE' && (job.title.toLowerCase().includes('devops') || job.title.toLowerCase().includes('reliability'))) ||
        (selectedDiscipline === 'Mobile' && job.title.toLowerCase().includes('mobile'));

      let matchesCorridor = true;
      if (corridorFilter === 'BLR') {
        matchesCorridor = job.location.toLowerCase().includes('bangalore') || job.location.toLowerCase().includes('bengaluru');
      } else if (corridorFilter === 'PUNE') {
        matchesCorridor = job.location.toLowerCase().includes('pune') || Boolean(job.bangaloreCluster?.toLowerCase().includes('pune'));
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

  // Ramp-style Metric shortcuts
  const topFitCount = jobs.filter((j) => (j.atsMatchScore || 0) >= 80).length;
  const ycCount = jobs.filter((j) => j.source.includes('YC')).length;
  const highEquityCount = jobs.filter((j) => j.equityRange && (j.equityRange.includes('0.') || j.equityRange.includes('1.'))).length;
  const noticeCount = jobs.filter((j) => j.noticeBuyoutCovered).length;
  const blrCount = jobs.filter((j) => j.location.toLowerCase().includes('bangalore') || j.location.toLowerCase().includes('bengaluru')).length;
  const puneCount = jobs.filter((j) => j.location.toLowerCase().includes('pune') || Boolean(j.bangaloreCluster?.toLowerCase().includes('pune'))).length;

  // Grouped by Startup (Startup-Finder format)
  const groupedByStartup = useMemo(() => {
    const map = new Map<string, JobListing[]>();
    for (const job of filteredJobs) {
      const list = map.get(job.company) || [];
      list.push(job);
      map.set(job.company, list);
    }
    return Array.from(map.entries()).map(([company, openings]) => {
      const sample = openings[0];
      const bestAnalysis = openings.reduce((best, cur) => {
        const a = analyzeJobMatch(cur, candidate);
        return a.matchScore > best.matchScore ? a : best;
      }, analyzeJobMatch(sample, candidate));

      return {
        company,
        openings,
        sample,
        fundingRound: sample.fundingRound,
        location: sample.bangaloreCluster || sample.location,
        founderName: sample.founderName,
        founderRole: sample.founderRole,
        founderEmail: sample.founderEmail,
        careersEmail: `careers@${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        bestMatchScore: bestAnalysis.matchScore,
        bestBadge: bestAnalysis.badgeLabel,
        bestRelevance: bestAnalysis.relevance,
      };
    }).sort((a, b) => b.bestMatchScore - a.bestMatchScore);
  }, [filteredJobs, candidate]);

  // Toggle selection for batch actions
  const handleToggleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRowIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedRowIds.size === filteredJobs.length) {
      setSelectedRowIds(new Set());
    } else {
      setSelectedRowIds(new Set(filteredJobs.map((j) => j.id)));
    }
  };

  const handleBatchSync = () => {
    const targetJobs = filteredJobs.filter((j) => selectedRowIds.has(j.id));
    const toAdd = targetJobs.length > 0 ? targetJobs : filteredJobs;
    toAdd.forEach((job) => onAddToPipeline(job));
  };

  const handleExportCsv = () => {
    const headers = ['Company', 'Role Title', 'Location', 'Compensation', 'Equity', 'Founder', 'Email', 'Match Score'];
    const rows = filteredJobs.map((j) => [
      `"${j.company}"`,
      `"${j.title}"`,
      `"${j.location}"`,
      `"${j.salaryDisplay || j.minCtcLpa + '-' + j.maxCtcLpa + ' LPA'}"`,
      `"${j.equityRange}"`,
      `"${j.founderName}"`,
      `"${j.founderEmail}"`,
      `"${j.atsMatchScore || 75}%"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jobpilot_opportunities_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyEmail = (email: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopy = (text: string, key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FFFFFF] dark:bg-[#0F1117] text-slate-900 dark:text-[#F3F4F6] overflow-y-auto selection:bg-[#EBF946] selection:text-black">
      <div className="max-w-[1400px] w-full mx-auto px-6 py-6 sm:px-8 sm:py-8 space-y-6">
        
        {/* ========================================================
            1. RAMP HUGE TITLE & METRIC SHORTCUTS HEADER
        ======================================================== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-[#F3F4F6]">
              Opportunities
            </h1>

            {/* Quick Actions & Integration Logos (Ramp style) */}
            <div className="flex items-center gap-3">
              {onOpenResumeScanner && (
                <button
                  onClick={onOpenResumeScanner}
                  className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  title="Upload resume or paste text to auto-detect skills and re-score startups"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-blue-400 dark:text-blue-600" />
                  <span>Scan Resume</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 dark:bg-neutral-200 text-neutral-300 dark:text-neutral-700 font-mono">
                    {candidate.primarySkills.length} skills
                  </span>
                </button>
              )}

              <button
                onClick={handleExportCsv}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-[#969BA6] dark:hover:text-[#F3F4F6] hover:bg-slate-100 dark:hover:bg-[#1F2228] transition-colors flex items-center gap-1.5 text-xs font-semibold"
                title="Export verified listings to CSV"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>

              {onToggleTheme && (
                <button
                  onClick={onToggleTheme}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-[#969BA6] dark:hover:text-[#F3F4F6] hover:bg-slate-100 dark:hover:bg-[#1F2228] transition-colors"
                  title="Toggle theme"
                >
                  {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
                </button>
              )}

              {/* Verified badge */}
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-black text-xs text-emerald-600 dark:text-emerald-400" title="YC & Wellfound Verified Data Pipeline">
                ✓
              </div>
            </div>
          </div>

          {/* Ramp Metric Shortcuts Row (clickable filter chips with arrow ↗) */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium border-b border-slate-200/80 dark:border-[#292C33] pb-4">
            <button
              onClick={() => onSelectCorridorFilter(corridorFilter === 'ALL' && selectedDiscipline === 'All Roles' ? 'ALL' : 'ALL')}
              className={`hover:text-black dark:hover:text-white transition-colors flex items-center gap-1 ${
                corridorFilter === 'ALL' && selectedDiscipline === 'All Roles' ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-600 dark:text-[#969BA6]'
              }`}
            >
              <span>All Active</span>
              <span className="font-bold text-slate-900 dark:text-white ml-0.5">{jobs.length}</span>
              <span className="text-slate-400 ml-0.5">↗</span>
            </button>

            <button
              onClick={() => onSelectCorridorFilter(corridorFilter === 'YC' ? 'ALL' : 'YC')}
              className={`hover:text-black dark:hover:text-white transition-colors flex items-center gap-1 ${
                corridorFilter === 'YC' ? 'text-orange-600 font-bold' : 'text-slate-600 dark:text-[#969BA6]'
              }`}
            >
              <span>YC Verified</span>
              <span className="font-bold text-orange-600 ml-0.5">{ycCount}</span>
              <span className="text-slate-400 ml-0.5">↗</span>
            </button>

            <button
              onClick={() => {
                setSortBy('MATCH');
                onSelectCorridorFilter('ALL');
              }}
              className="text-slate-600 dark:text-[#969BA6] hover:text-black dark:hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Top Fit (&gt;80%)</span>
              <span className="font-bold text-slate-900 dark:text-white ml-0.5">{topFitCount}</span>
              <span className="text-slate-400 ml-0.5">↗</span>
            </button>

            <button
              onClick={() => onSelectCorridorFilter(corridorFilter === 'BLR' ? 'ALL' : 'BLR')}
              className={`hover:text-black dark:hover:text-white transition-colors flex items-center gap-1 ${
                corridorFilter === 'BLR' ? 'text-blue-600 font-bold' : 'text-slate-600 dark:text-[#969BA6]'
              }`}
            >
              <span>Bangalore Corridors</span>
              <span className="font-bold text-slate-900 dark:text-white ml-0.5">{blrCount}</span>
              <span className="text-slate-400 ml-0.5">↗</span>
            </button>

            <button
              onClick={() => onSelectCorridorFilter(corridorFilter === 'PUNE' ? 'ALL' : 'PUNE')}
              className={`hover:text-black dark:hover:text-white transition-colors flex items-center gap-1 ${
                corridorFilter === 'PUNE' ? 'text-teal-600 font-bold' : 'text-slate-600 dark:text-[#969BA6]'
              }`}
            >
              <span>Pune Startups</span>
              <span className="font-bold text-slate-900 dark:text-white ml-0.5">{puneCount}</span>
              <span className="text-slate-400 ml-0.5">↗</span>
            </button>

            <button
              onClick={() => onSelectCorridorFilter(corridorFilter === 'NOTICE' ? 'ALL' : 'NOTICE')}
              className={`hover:text-black dark:hover:text-white transition-colors flex items-center gap-1 ${
                corridorFilter === 'NOTICE' ? 'text-emerald-600 font-bold' : 'text-slate-600 dark:text-[#969BA6]'
              }`}
            >
              <span>Notice Buyout Covered</span>
              <span className="font-bold text-slate-900 dark:text-white ml-0.5">{noticeCount}</span>
              <span className="text-slate-400 ml-0.5">↗</span>
            </button>

            <button
              onClick={() => onSelectCorridorFilter(corridorFilter === 'REMOTE' ? 'ALL' : 'REMOTE')}
              className={`hover:text-black dark:hover:text-white transition-colors flex items-center gap-1 ${
                corridorFilter === 'REMOTE' ? 'text-purple-600 font-bold' : 'text-slate-600 dark:text-[#969BA6]'
              }`}
            >
              <span>Remote Friendly</span>
              <span className="font-bold text-slate-900 dark:text-white ml-0.5">6</span>
              <span className="text-slate-400 ml-0.5">↗</span>
            </button>

            <button
              onClick={() => setSortBy('SALARY')}
              className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1 text-slate-600 dark:text-[#969BA6]"
            >
              <span>High Equity</span>
              <span className="font-bold text-slate-900 dark:text-white ml-0.5">{highEquityCount}</span>
              <span className="text-slate-400 ml-0.5">↗</span>
            </button>

            <div className="text-slate-400 dark:text-[#737C90] flex items-center gap-1">
              <span>Saved in CRM:</span>
              <span className="font-bold text-slate-900 dark:text-white">{cards.length}</span>
            </div>
          </div>
        </div>

        {/* ========================================================
            2. RAMP SEARCH BAR & NEON YELLOW ACTION BUTTON
        ======================================================== */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search Input (Underlined Ramp Style) */}
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="absolute left-0 top-2.5 w-4 h-4 text-slate-400 dark:text-[#737C90]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Opportunities, Startups, or Tech Stacks..."
                className="w-full pl-6 pr-8 py-2 bg-transparent border-b border-slate-300 dark:border-[#292C33] focus:border-black dark:focus:border-white text-xs text-slate-900 dark:text-[#F3F4F6] placeholder-slate-400 dark:placeholder-[#737C90] outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-0 top-2.5 text-xs text-slate-400 hover:text-black"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Discipline Filter */}
            <div className="relative">
              <select
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value)}
                className="appearance-none pl-3 pr-7 py-1.5 rounded-lg border border-slate-200 dark:border-[#292C33] bg-transparent text-xs font-semibold text-slate-700 dark:text-[#A1A8B8] hover:border-slate-300 outline-none cursor-pointer"
              >
                {DISCIPLINES.map((d) => (
                  <option key={d} value={d} className="bg-white dark:bg-[#17191E] text-slate-900 dark:text-white">
                    {d}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Sort Sorter */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'MATCH' | 'SALARY' | 'RECENT')}
                className="appearance-none pl-3 pr-7 py-1.5 rounded-lg border border-slate-200 dark:border-[#292C33] bg-transparent text-xs font-semibold text-slate-700 dark:text-[#A1A8B8] hover:border-slate-300 outline-none cursor-pointer"
              >
                <option value="MATCH" className="bg-white dark:bg-[#17191E] text-slate-900 dark:text-white">Sort: Best Fit</option>
                <option value="SALARY" className="bg-white dark:bg-[#17191E] text-slate-900 dark:text-white">Sort: Salary</option>
                <option value="RECENT" className="bg-white dark:bg-[#17191E] text-slate-900 dark:text-white">Sort: Recent</option>
              </select>
              <SlidersHorizontal className="absolute right-2 top-2 w-3 h-3 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Right Toolbar: Pagination, View Toggle, and RAMP NEON BUTTON */}
          <div className="flex items-center gap-3 justify-between sm:justify-end">
            <span className="text-xs text-slate-500 font-mono">
              1–{filteredJobs.length} of {jobs.length}
            </span>

            {/* View Switcher */}
            <div className="flex items-center p-0.5 rounded-lg border border-slate-200 dark:border-[#292C33]">
              <button
                onClick={() => setViewMode('STARTUPS')}
                className={`px-2.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  viewMode === 'STARTUPS' ? 'bg-slate-100 dark:bg-[#1D2230] text-black dark:text-white shadow-xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                title="Startups grouped view (Startup-Finder format)"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">By Startups</span>
              </button>
              <button
                onClick={() => setViewMode('TABLE')}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  viewMode === 'TABLE' ? 'bg-slate-100 dark:bg-[#1D2230] text-black dark:text-white shadow-xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                title="Table view"
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('CARDS')}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  viewMode === 'CARDS' ? 'bg-slate-100 dark:bg-[#1D2230] text-black dark:text-white shadow-xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                title="Cards view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* RAMP FAMOUS HIGHLIGHTER YELLOW ACTION BUTTON */}
            <button
              onClick={handleBatchSync}
              className="px-4 py-2 rounded-lg bg-[#EBF946] hover:bg-[#E4F535] text-black text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              title="Sync selected opportunities to pipeline CRM"
            >
              <span>Sync ({selectedRowIds.size > 0 ? selectedRowIds.size : filteredJobs.length})</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            3. STARTUPS VIEW (Startup-Finder Grouped Format)
        ======================================================== */}
        {viewMode === 'STARTUPS' && (
          <div className="space-y-6">
            {groupedByStartup.map((group) => {
              const brand = getCompanyBrandStyle(group.company);
              const sample = group.sample;

              return (
                <div
                  key={group.company}
                  className="rounded-2xl bg-white dark:bg-[#15171E] border border-slate-200/90 dark:border-[#242833] shadow-xs overflow-hidden transition-all hover:border-slate-300 dark:hover:border-neutral-700"
                >
                  {/* Startup Header Banner */}
                  <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-[#21242E] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 dark:bg-[#121419]">
                    <div className="flex items-start sm:items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${brand.gradient} flex items-center justify-center font-black text-white text-base shrink-0 shadow-sm`}>
                        {group.company.charAt(0)}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-bold text-slate-900 dark:text-[#F3F4F6] tracking-tight">
                            {group.company}
                          </h2>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-700">
                            {group.fundingRound}
                          </span>
                          {sample.source.includes('YC') && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                              YC Backed
                            </span>
                          )}
                          {sample.source.includes('Surge') && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                              Peak XV Surge
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500 dark:text-neutral-400">
                          <span className="flex items-center gap-1 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {group.location}
                          </span>
                          <span>·</span>
                          <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            {group.openings.length} Active {group.openings.length === 1 ? 'Opening' : 'Openings'}
                          </span>
                          <span>·</span>
                          <span className="text-[11px] font-mono text-slate-400">
                            Verified {sample.postedDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Direct Verified Contact Vectors */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {/* Careers Vector */}
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1A1D25] border border-slate-200/80 dark:border-[#292D38]">
                        <span className="text-[11px] font-medium text-slate-500 dark:text-neutral-400">Careers:</span>
                        <span className="font-mono text-[11px] text-slate-800 dark:text-neutral-200 truncate max-w-[150px]">
                          {group.careersEmail}
                        </span>
                        <button
                          onClick={(e) => handleCopy(group.careersEmail, `careers-${group.company}`, e)}
                          className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                          title="Copy careers inbox"
                        >
                          {copiedKey === `careers-${group.company}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Founder / Engineering Direct Reach */}
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1A1D25] border border-slate-200/80 dark:border-[#292D38]">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="text-[11px] font-medium text-slate-800 dark:text-neutral-200">
                          {group.founderName} ({group.founderRole})
                        </span>
                        <button
                          onClick={(e) => handleCopy(group.founderEmail, `founder-${group.company}`, e)}
                          className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                          title="Copy direct inbox"
                        >
                          {copiedKey === `founder-${group.company}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => onOpenPitch(sample)}
                          className="px-2 py-0.5 rounded-md bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-[10px] hover:bg-neutral-800 transition-colors ml-1"
                        >
                          Pitch
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Startup Nested Job Listings */}
                  <div className="divide-y divide-slate-100 dark:divide-[#21242E]">
                    {group.openings.map((job) => {
                      const matchAnalysis = analyzeJobMatch(job, candidate);
                      const isTracked = appliedJobIds.has(job.id);
                      const isSelected = job.id === selectedJobId;

                      return (
                        <div
                          key={job.id}
                          onClick={() => onSelectJob(job)}
                          className={`p-4 sm:p-5 transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50/40 dark:bg-[#181B24]'
                              : 'hover:bg-slate-50/70 dark:hover:bg-[#14161D]'
                          }`}
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            {/* Role Title, Category, Compensation */}
                            <div className="space-y-1.5 min-w-0 max-w-2xl">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-[#F3F4F6] hover:text-blue-600 transition-colors">
                                  {job.title}
                                </h3>
                                <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300 font-medium">
                                  {job.roleCategory}
                                </span>
                                {job.noticeBuyoutCovered && (
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                    Notice Buyout Covered
                                  </span>
                                )}
                              </div>

                              {/* Prominent Compensation & Equity */}
                              <div className="flex flex-wrap items-center gap-3 text-xs">
                                <span className="font-extrabold text-slate-900 dark:text-white tabular-nums text-sm">
                                  {job.salaryDisplay || `₹${job.minCtcLpa}–${job.maxCtcLpa} LPA`}
                                </span>
                                <span className="text-slate-300 dark:text-neutral-600">|</span>
                                <span className="text-slate-600 dark:text-neutral-400 font-medium">
                                  Equity: {job.equityRange && !job.equityRange.toLowerCase().includes('none') ? job.equityRange : 'Standard ESOP'}
                                </span>
                                <span className="text-slate-300 dark:text-neutral-600">|</span>
                                <span className="text-slate-500 dark:text-neutral-400">
                                  Exp: {job.experienceDisplay}
                                </span>
                              </div>

                              {/* Transparent Match Reason Line */}
                              <div className={`text-xs font-mono flex items-start gap-1.5 pt-1 ${
                                matchAnalysis.capReason ? 'text-amber-700 dark:text-amber-400' : 'text-neutral-600 dark:text-neutral-400'
                              }`}>
                                {matchAnalysis.capReason ? (
                                  <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-500" />
                                ) : (
                                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-500" />
                                )}
                                <span>{matchAnalysis.summaryLine}</span>
                              </div>

                              {/* Matched vs Missing Skills Chips */}
                              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                {matchAnalysis.matchedSkills.map((s) => (
                                  <span
                                    key={s}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold border border-emerald-200 dark:border-emerald-800/40"
                                  >
                                    ✓ {s}
                                  </span>
                                ))}
                                {matchAnalysis.missingSkills.map((s) => (
                                  <span
                                    key={s}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 dark:bg-neutral-800/50 text-slate-500 dark:text-neutral-400 text-[11px] border border-dashed border-slate-300 dark:border-neutral-700"
                                    title="Missing requirement according to your profile"
                                  >
                                    + {s}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Right Action Stack */}
                            <div className="flex flex-row lg:flex-col items-end justify-between lg:justify-center gap-2 shrink-0 pt-2 lg:pt-0" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                                  matchAnalysis.relevance === 'strong'
                                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${matchAnalysis.relevance === 'strong' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                  <span>{matchAnalysis.badgeLabel}</span>
                                  <span className="tabular-nums font-black">{matchAnalysis.matchScore}%</span>
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => onOpenPitch(job)}
                                  className="px-3 py-1.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-black font-semibold text-xs transition-colors flex items-center gap-1 shadow-xs"
                                  title="Generate custom cold pitch for founder"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>Pitch</span>
                                </button>

                                <button
                                  onClick={() => onOpenAts(job)}
                                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-neutral-700 hover:border-slate-300 dark:hover:border-neutral-600 text-slate-700 dark:text-neutral-300 font-semibold text-xs transition-colors flex items-center gap-1"
                                  title="Tailor Google X-Y-Z ATS resume"
                                >
                                  <FileText className="w-3 h-3 text-slate-400" />
                                  <span>Tailor</span>
                                </button>

                                <button
                                  onClick={() => onDirectApply(job)}
                                  className="p-1.5 rounded-lg border border-slate-200 dark:border-neutral-700 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
                                  title="Open original posting"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => onAddToPipeline(job)}
                                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                                    isTracked
                                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                                      : 'border border-slate-200 dark:border-neutral-700 text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800'
                                  }`}
                                  title="Save to Applications CRM"
                                >
                                  <Bookmark className={`w-3.5 h-3.5 ${isTracked ? 'fill-current' : ''}`} />
                                  <span>{isTracked ? 'Saved' : 'Save'}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================
            4. RAMP HIGH-DENSITY TABLE (SECONDARY WORKSPACE)
        ======================================================== */}
        {viewMode === 'TABLE' && (
          <div className="border-t border-b border-slate-200/80 dark:border-[#292C33] overflow-x-auto">
            <div className="min-w-[960px]">
              {/* Table Column Headers */}
              <div className="grid grid-cols-[40px_minmax(240px,2fr)_minmax(140px,1fr)_minmax(180px,1.2fr)_minmax(200px,1.5fr)_minmax(160px,1.2fr)_130px] px-2 py-2 text-xs font-medium text-slate-500 dark:text-[#8E8E93] border-b border-slate-200/80 dark:border-[#292C33]">
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={selectedRowIds.size === filteredJobs.length && filteredJobs.length > 0}
                    onChange={handleSelectAll}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-black cursor-pointer"
                  />
                </div>
                <div>Company & Role</div>
                <div>Compensation</div>
                <div>Location & Corridor</div>
                <div>Match & Skills</div>
                <div>Direct Reach</div>
                <div className="text-right pr-2">Action</div>
              </div>

              {/* Date Group Heading (Ramp Style: "Yesterday" / "Verified Today") */}
              <div className="px-3 py-1.5 bg-slate-50/70 dark:bg-[#121418] text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-[#23262E]">
                Verified Opportunities ({filteredJobs.length})
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-slate-100 dark:divide-[#23262E]">
                {filteredJobs.map((job) => {
                  const isSelected = job.id === selectedJobId;
                  const isChecked = selectedRowIds.has(job.id);
                  const isTracked = appliedJobIds.has(job.id);
                  const brand = getCompanyBrandStyle(job.company);
                  const matchAnalysis = analyzeJobMatch(job, candidate);

                  return (
                    <div
                      key={job.id}
                      onClick={() => onSelectJob(job)}
                      className={`grid grid-cols-[40px_minmax(240px,2fr)_minmax(140px,1fr)_minmax(180px,1.2fr)_minmax(200px,1.5fr)_minmax(160px,1.2fr)_130px] items-center px-2 py-3.5 cursor-pointer text-xs transition-all duration-150 group ${
                        isSelected
                          ? 'bg-blue-50/70 dark:bg-[#1F2228] border-l-4 border-blue-600'
                          : 'hover:bg-slate-50 dark:hover:bg-[#17191E]'
                      }`}
                    >
                      {/* Checkbox */}
                      <div className="flex items-center justify-center" onClick={(e) => handleToggleSelectRow(job.id, e)}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-3.5 h-3.5 rounded border-slate-300 text-black cursor-pointer"
                        />
                      </div>

                      {/* Company & Role (Ramp 1Password / SaaS Software style) */}
                      <div className="flex items-center gap-3 min-w-0 pr-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${brand.gradient} flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-xs`}>
                          {job.company.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 dark:text-[#F3F4F6] truncate group-hover:text-blue-600 transition-colors">
                              {job.title}
                            </span>
                            {job.source.includes('YC') && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-bold text-[10px] shrink-0 border border-amber-200 dark:border-amber-800/40">
                                YC
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-[#969BA6] truncate mt-0.5">
                            {job.company} · {job.roleCategory || 'Engineering'}
                          </div>
                        </div>
                      </div>

                      {/* Compensation (Ramp Amount style: $50.16) */}
                      <div className="pr-3">
                        <div className="font-bold text-slate-900 dark:text-[#F3F4F6] tabular-nums">
                          {job.salaryDisplay || `₹${job.minCtcLpa}–${job.maxCtcLpa} LPA`}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-[#969BA6] truncate">
                          {job.equityRange && !job.equityRange.toLowerCase().includes('none') ? job.equityRange : 'Standard ESOP'}
                        </div>
                      </div>

                      {/* Location & Corridor (Ramp Cardholder style: Ramona Peters / Engineering NYC) */}
                      <div className="pr-3 text-slate-700 dark:text-[#969BA6]">
                        <div className="font-medium text-slate-900 dark:text-[#F3F4F6] truncate flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{job.bangaloreCluster || job.location}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {job.isRemote ? 'Remote First' : 'In-Office'}
                        </div>
                      </div>

                      {/* Match & Skills (Explainable Startup-Finder Format) */}
                      <div className="pr-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            matchAnalysis.relevance === 'strong'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${matchAnalysis.relevance === 'strong' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            <span>{matchAnalysis.badgeLabel}</span>
                            <span className="tabular-nums font-extrabold">{matchAnalysis.matchScore}%</span>
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1 mt-1">
                          {matchAnalysis.matchedSkills.slice(0, 2).map((s) => (
                            <span key={s} className="px-1.5 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold border border-emerald-200 dark:border-emerald-800/40">
                              ✓ {s}
                            </span>
                          ))}
                          {matchAnalysis.missingSkills.slice(0, 1).map((s) => (
                            <span key={s} className="px-1.5 py-0.2 rounded bg-slate-50 dark:bg-neutral-800/50 text-slate-500 dark:text-neutral-400 text-[10px] border border-dashed border-slate-300 dark:border-neutral-700">
                              + {s}
                            </span>
                          ))}
                        </div>
                        <div className="text-[10px] font-mono text-neutral-500 truncate mt-0.5 max-w-[200px]" title={matchAnalysis.summaryLine}>
                          {matchAnalysis.summaryLine}
                        </div>
                      </div>

                      {/* Direct Reach / Founder (Ramp Receipt Hover Preview style) */}
                      <div className="pr-3 relative" onMouseEnter={() => setHoveredFounderEmail(job.id)} onMouseLeave={() => setHoveredFounderEmail(null)}>
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="font-semibold text-slate-900 dark:text-[#F3F4F6] truncate">
                            {job.founderName}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {job.founderRole}
                        </div>

                        {/* Ramp Hover Card showing Verified Founder Email */}
                        {hoveredFounderEmail === job.id && (
                          <div className="absolute left-0 bottom-full mb-2 w-64 p-3 rounded-xl bg-white dark:bg-[#1D2230] border border-slate-200 dark:border-[#292C33] shadow-xl z-50 text-xs space-y-2 pointer-events-auto">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 dark:text-white">{job.founderName}</span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">Verified</span>
                            </div>
                            <div className="flex items-center justify-between p-1.5 rounded bg-slate-50 dark:bg-[#121418] border border-slate-200 dark:border-[#292C33]">
                              <span className="font-mono text-[11px] truncate text-slate-700 dark:text-slate-300">{job.founderEmail}</span>
                              <button onClick={(e) => handleCopyEmail(job.founderEmail, e)} className="text-blue-600 hover:text-blue-700 p-0.5">
                                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenPitch(job);
                              }}
                              className="w-full py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-[11px] flex items-center justify-center gap-1"
                            >
                              <Send className="w-3 h-3" />
                              <span>Draft Cold Pitch</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Action Button (Ramp style: "Mark Ready" or green "Ready ✓") */}
                      <div className="text-right pr-2" onClick={(e) => e.stopPropagation()}>
                        {isTracked ? (
                          <button
                            onClick={() => onAddToPipeline(job)}
                            className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-bold text-xs inline-flex items-center gap-1"
                          >
                            <span>Saved ✓</span>
                          </button>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onOpenPitch(job)}
                              className="px-3 py-1 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-black dark:hover:bg-slate-100 font-semibold text-xs shadow-xs transition-colors"
                            >
                              Pitch
                            </button>
                            <button
                              onClick={() => onAddToPipeline(job)}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-[#292C33] text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                              title="Save to pipeline"
                            >
                              <Bookmark className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            4. OPTIONAL CARDS VIEW (WHEN TOGGLED)
        ======================================================== */}
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

      </div>
    </div>
  );
};
