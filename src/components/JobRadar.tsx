import React, { useState } from 'react';
import type { JobListing, CandidateProfile } from '../types';
import { calculateQuickMatchScore } from '../lib/jobRadarEngine';
import { CompanySwipeDeck } from './CompanySwipeDeck';
import { 
  Search, 
  MapPin, 
  Send, 
  FileText, 
  Check, 
  Briefcase, 
  Inbox, 
  Globe, 
  ChevronDown,
  ExternalLink,
  Layers
} from 'lucide-react';

interface JobRadarProps {
  jobs: JobListing[];
  candidate: CandidateProfile;
  onSelectJobForATS: (job: JobListing) => void;
  onSelectJobForOutreach: (job: JobListing) => void;
  onAddToPipeline: (job: JobListing) => void;
  onRemoveFromPipeline?: (jobId: string) => void;
  onSimulateApply: (job: JobListing) => void;
  appliedJobIds: Set<string>;
  onOpenPortfolio: () => void;
  onOpenApplications: () => void;
  onOpenAtsLab: () => void;
}

const ROLE_CATEGORIES = [
  'All Roles',
  'Founding AI Engineer',
  'Full Stack Developer',
  'Distributed Systems',
  'Frontend & Canvas',
  'DevOps & SRE',
  'Data & Analytics',
  'Security Infrastructure',
  'Mobile Engineering'
];

export const JobRadar: React.FC<JobRadarProps> = ({
  jobs,
  candidate,
  onSelectJobForATS,
  onSelectJobForOutreach,
  onAddToPipeline,
  onRemoveFromPipeline,
  onSimulateApply,
  appliedJobIds,
  onOpenPortfolio,
  onOpenApplications,
  onOpenAtsLab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [sidebarTab, setSidebarTab] = useState<'JOBS' | 'CHAT' | 'APPLICATIONS' | 'PORTFOLIO' | 'ATS'>('JOBS');
  const [viewMode, setViewMode] = useState<'TABLE' | 'SWIPE'>('SWIPE');

  const filteredJobs = jobs.filter((job) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q) ||
      job.requiredSkills.some(s => s.toLowerCase().includes(q));

    const matchesRole =
      selectedRole === 'All Roles' ||
      job.roleCategory === selectedRole ||
      (selectedRole === 'Founding AI Engineer' && (job.title.toLowerCase().includes('ai') || job.title.toLowerCase().includes('machine learning'))) ||
      (selectedRole === 'Full Stack Developer' && job.title.toLowerCase().includes('full stack')) ||
      (selectedRole === 'Distributed Systems' && (job.title.toLowerCase().includes('backend') || job.title.toLowerCase().includes('systems'))) ||
      (selectedRole === 'Frontend & Canvas' && job.title.toLowerCase().includes('frontend')) ||
      (selectedRole === 'DevOps & SRE' && (job.title.toLowerCase().includes('reliability') || job.title.toLowerCase().includes('devops'))) ||
      (selectedRole === 'Data & Analytics' && job.title.toLowerCase().includes('data')) ||
      (selectedRole === 'Security Infrastructure' && job.title.toLowerCase().includes('security')) ||
      (selectedRole === 'Mobile Engineering' && job.title.toLowerCase().includes('mobile'));

    return matchesSearch && matchesRole;
  });
  const sourceCounts = jobs.reduce<Record<string, number>>((counts, job) => {
    counts[job.source] = (counts[job.source] || 0) + 1;
    return counts;
  }, {});

  return (
    <div className="space-y-12">
      {/* 1. JobPilot Studio Desktop Window (Pure Black Minimalist UI) */}
      <div className="rounded-xl border border-[#27272A] skeuo-surface shadow-2xl overflow-hidden">
        {/* Top Window Bar */}
        <div className="bg-[#0A0A0A] px-4 py-2.5 border-b border-[#1F1F1F] flex items-center justify-between text-xs text-[#888888]">
          <div className="flex items-center gap-2">
            <span className="skeuo-led-red" />
            <span className="skeuo-led-amber" />
            <span className="skeuo-led-green" />
            <span className="ml-2 font-mono text-[11px] text-[#A1A1A1]">Startup Role Directory — Example Listings</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#A1A1A1]">
            <span className="skeuo-led-blue" />
            <span>Sample catalog · verify source links</span>
          </div>
        </div>

        {/* Dual-Pane View */}
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[580px] bg-[#000000]">
          {/* Left Sidebar */}
          <aside className="md:col-span-3 border-r border-[#1F1F1F] bg-[#0A0A0A] p-4 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1F1F1F]">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md skeuo-btn-primary flex items-center justify-center font-bold text-[11px] shadow-sm">
                    JP
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white tracking-tight">JobPilot</h4>
                    <p className="text-[10px] text-[#888888] font-mono">Roles & Pitches</p>
                  </div>
                </div>
                <div className="text-[#666666] text-xs">
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* CAREER Navigation */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-semibold text-[#666666] uppercase tracking-wider block px-2 mb-1.5">
                  DISCOVERY
                </span>

                <button
                  onClick={() => {
                    setSidebarTab('JOBS');
                    setViewMode('SWIPE');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all active:translate-y-[2px] active:shadow-none ${
                    sidebarTab === 'JOBS' && viewMode === 'SWIPE'
                      ? 'skeuo-btn text-white font-semibold'
                      : 'text-[#888888] hover:bg-[#141414] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span>⚡</span>
                    <span>Swipe Deck</span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full skeuo-btn-primary font-bold">
                    HOT
                  </span>
                </button>

                <button
                  onClick={() => {
                    setSidebarTab('JOBS');
                    setViewMode('TABLE');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all active:translate-y-[2px] active:shadow-none ${
                    sidebarTab === 'JOBS' && viewMode === 'TABLE'
                      ? 'skeuo-btn text-white font-semibold'
                      : 'text-[#888888] hover:bg-[#141414] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-4 h-4 text-white" />
                    <span>Table Directory</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full skeuo-badge text-white font-bold">
                    {filteredJobs.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setSidebarTab('APPLICATIONS');
                    onOpenApplications();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all active:translate-y-[2px] active:shadow-none ${
                    sidebarTab === 'APPLICATIONS' ? 'skeuo-btn text-white font-semibold' : 'text-[#888888] hover:bg-[#141414] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Inbox className="w-4 h-4 text-[#888888]" />
                    <span>Applications</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full skeuo-badge text-[#888888]">
                    {appliedJobIds.size}
                  </span>
                </button>
              </div>

              {/* TOOLS Navigation */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-semibold text-[#666D82] uppercase tracking-wider block px-2 mb-1.5">
                  TOOLS
                </span>

                <button
                  onClick={() => {
                    setSidebarTab('PORTFOLIO');
                    onOpenPortfolio();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all active:translate-y-[2px] active:shadow-none ${
                    sidebarTab === 'PORTFOLIO' ? 'skeuo-btn text-white font-semibold' : 'text-[#8C93A8] hover:bg-[#151824] hover:text-white'
                  }`}
                >
                  <Globe className="w-4 h-4 text-[#71788E]" />
                  <span>Proof-of-Work</span>
                </button>

                <button
                  onClick={() => {
                    setSidebarTab('ATS');
                    onOpenAtsLab();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all active:translate-y-[2px] active:shadow-none ${
                    sidebarTab === 'ATS' ? 'skeuo-btn text-white font-semibold' : 'text-[#8C93A8] hover:bg-[#151824] hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4 text-[#71788E]" />
                  <span>ATS Resume Lab</span>
                </button>
              </div>
            </div>

            {/* Sidebar User Footer */}
            <div className="pt-3 border-t border-[#1B1E2B] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white text-black font-bold text-xs flex items-center justify-center shadow-sm">
                  {candidate.fullName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-xs text-white truncate max-w-[120px]">
                    {candidate.fullName}
                  </div>
                  <div className="text-[10px] text-[#71788E] truncate max-w-[120px] font-mono">
                    ₹{candidate.minTargetCtcLpa}L+ Target
                  </div>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#565C70]" />
            </div>
          </aside>

          {/* Right Main Table Content */}
          <main className="md:col-span-9 p-5 flex flex-col justify-between space-y-4 overflow-x-auto bg-[#000000]">
            <div className="space-y-4">
              {/* Top Search & Actions Bar with View Mode Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1F1F1F]">
                <div className="flex items-center gap-2">
                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-1 p-1 rounded-lg skeuo-well text-xs font-mono">
                    <button
                      onClick={() => setViewMode('SWIPE')}
                      className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 active:translate-y-[2px] active:shadow-none ${
                        viewMode === 'SWIPE'
                          ? 'skeuo-btn-primary font-bold text-black'
                          : 'text-[#888888] hover:text-white'
                      }`}
                    >
                      <span>⚡ Swipe Deck</span>
                      <span className={`text-[9px] px-1 rounded ${viewMode === 'SWIPE' ? 'bg-[#18181B] text-white shadow-inner' : 'bg-[#262626] text-white'}`}>CARD MODE</span>
                    </button>
                    <button
                      onClick={() => setViewMode('TABLE')}
                      className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 active:translate-y-[2px] active:shadow-none ${
                        viewMode === 'TABLE'
                          ? 'skeuo-btn-primary font-bold text-black'
                          : 'text-[#888888] hover:text-white'
                      }`}
                    >
                      <Layers className="w-3 h-3" />
                      <span>Table Directory ({filteredJobs.length})</span>
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#A1A1A1] absolute left-3 top-2.5 z-10" />
                  <input
                    type="text"
                    placeholder="Search role, stack (React, Python)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="skeuo-well pl-8 pr-3 py-1.5 rounded-lg text-xs text-white placeholder-[#888888] focus:outline-none focus:border-[#3F3F46] w-64 font-sans"
                  />
                </div>
              </div>

              {viewMode === 'SWIPE' ? (
                /* Addictive Interactive Company Card Swipe Deck */
                <div className="py-2">
                  <CompanySwipeDeck
                    jobs={filteredJobs}
                    candidate={candidate}
                    onPitch={onSelectJobForOutreach}
                    onTailorAts={onSelectJobForATS}
                    onAddToPipeline={onAddToPipeline}
                    onRemoveFromPipeline={onRemoveFromPipeline}
                    onClearFilters={() => {
                      setSearchQuery('');
                      setSelectedRole('All Roles');
                    }}
                    appliedJobIds={appliedJobIds}
                  />
                </div>
              ) : (
                /* Table View */
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[860px] text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#1F1F1F] text-[10px] font-mono uppercase tracking-wide text-[#737373]">
                        <th scope="col" className="py-2 pr-4 pl-1 font-medium">Role</th>
                        <th scope="col" className="px-3 py-2 font-medium">Location</th>
                        <th scope="col" className="px-3 py-2 font-medium">Experience & pay</th>
                        <th scope="col" className="px-3 py-2 font-medium">Skills</th>
                        <th scope="col" className="px-3 py-2 font-medium">Skill overlap</th>
                        <th scope="col" className="py-2 pl-3 pr-2 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredJobs.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-14 text-center">
                            <p className="text-sm font-medium text-white">No roles match those filters.</p>
                            <p className="mt-1 text-xs text-[#888888]">Try another search or reset the role category.</p>
                            <button
                              onClick={() => {
                                setSearchQuery('');
                                setSelectedRole('All Roles');
                              }}
                              className="mt-4 skeuo-btn-primary rounded-lg px-4 py-2 text-xs font-bold text-black active:translate-y-[2px] active:shadow-none"
                            >
                              Clear filters
                            </button>
                          </td>
                        </tr>
                      )}
                      {filteredJobs.map((job) => {
                        const isApplied = appliedJobIds.has(job.id);
                        const skillOverlap = calculateQuickMatchScore(candidate, job);
                        return (
                          <tr 
                            key={job.id} 
                            className="border-b border-[#171717] hover:bg-[#0A0A0A] transition-colors group cursor-pointer"
                          >
                            {/* 1. Icon + Title + Company */}
                            <td className="py-3.5 pr-4 pl-1">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg ${job.logoColor} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm font-mono`}>
                                  {job.company.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-semibold text-xs text-white group-hover:text-neutral-200 transition-colors">
                                    {job.title}
                                  </div>
                                  <div className="text-[11px] text-[#888888] flex items-center gap-1.5 mt-0.5">
                                    <span>{job.company}</span>
                                    {job.noticeBuyoutCovered && (
                                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-900/60">
                                        Notice Buyout
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* 2. Location */}
                            <td className="py-3.5 px-3 text-[#A1A1A1] text-[11px] whitespace-nowrap font-sans">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-[#666666]" />
                                {job.location}
                              </span>
                            </td>

                            {/* 3. Experience & Salary (Indian INR format) */}
                            <td className="py-3.5 px-3 whitespace-nowrap">
                              <div className="text-[11px] text-white font-medium">
                                {job.experienceDisplay || '2–4 years'}
                              </div>
                              <div className="text-[11px] text-[#888888] font-mono">
                                {job.salaryDisplay || `₹${job.minCtcLpa}L–₹${job.maxCtcLpa}L`}
                              </div>
                            </td>

                            {/* 4. Tech Stack Pills */}
                            <td className="py-3.5 px-3">
                              <div className="flex items-center gap-1">
                                {job.requiredSkills.slice(0, 2).map((sk) => (
                                  <span
                                    key={sk}
                                    className="px-2 py-0.5 rounded bg-[#111111] text-[#A1A1A1] text-[10px] font-mono font-medium border border-[#222222]"
                                  >
                                    {sk}
                                  </span>
                                ))}
                                {job.requiredSkills.length > 2 && (
                                  <span className="text-[10px] font-mono text-[#666666]">
                                    +{job.requiredSkills.length - 2}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* 5. Required skills present in the profile */}
                            <td className="py-3.5 px-3 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-[#1A1A1A] h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className="bg-white h-full rounded-full"
                                    style={{ width: `${skillOverlap}%` }}
                                  />
                                </div>
                                <span className="font-mono font-bold text-xs text-white">
                                  {skillOverlap}%
                                </span>
                              </div>
                            </td>

                            {/* 6. Action Buttons */}
                            <td className="py-3.5 pl-3 pr-2 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectJobForOutreach(job);
                                  }}
                                  className="skeuo-btn-primary px-2.5 py-1 text-[11px] font-bold rounded-md flex items-center gap-1 active:translate-y-[2px] active:shadow-none"
                                  title="Draft outreach for this role"
                                >
                                  <Send className="w-2.5 h-2.5" />
                                  <span>Pitch</span>
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectJobForATS(job);
                                  }}
                                  className="skeuo-btn px-2 py-1 text-[#A1A1A1] text-[11px] font-medium rounded-md active:translate-y-[2px] active:shadow-none"
                                  title="Tailor Resume (Google X-Y-Z)"
                                >
                                  <FileText className="w-2.5 h-2.5" />
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSimulateApply(job);
                                  }}
                                  className="skeuo-btn px-2.5 py-1 text-[#D4D4D4] hover:text-white text-[11px] font-medium rounded-md flex items-center gap-1 active:translate-y-[2px] active:shadow-none"
                                  title="Open the source listing"
                                >
                                  <ExternalLink className="w-2.5 h-2.5" />
                                  <span>Open listing</span>
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onAddToPipeline(job);
                                  }}
                                  className={`skeuo-btn px-2 py-1 text-[11px] font-medium rounded-md active:translate-y-[2px] active:shadow-none ${
                                    isApplied ? 'text-emerald-400 border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]' : 'text-[#A1A1A1]'
                                  }`}
                                  title={isApplied ? 'Tracked in Applications' : 'Track in Applications'}
                                >
                                  {isApplied ? 'Tracked' : '+ Track'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Table Footer */}
            <div className="pt-3 border-t border-[#1F1F1F] flex items-center justify-between text-[11px] text-[#A1A1A1] font-mono">
              <span>{viewMode === 'SWIPE' ? 'Swipe Mode: Keyboard ← (Pass) / → (Save) / Space (Pitch)' : `Showing ${filteredJobs.length} of ${jobs.length} sample roles`}</span>
              <span>Check listing and contact details before outreach</span>
            </div>
          </main>
        </div>
      </div>

      {/* 2. Listing provenance */}
      <section className="space-y-4 pt-2 text-center">
        <h3 className="text-[11px] font-mono font-medium uppercase tracking-wide text-[#737373]">
          Sources named in this example catalog
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {Object.entries(sourceCounts).map(([source, count]) => (
            <span key={source} className="rounded-full border border-[#1F1F1F] bg-[#0A0A0A] px-3 py-1.5 font-mono text-[11px] text-[#A1A1A1]">
              {source} <span className="text-[#737373]">· {count}</span>
            </span>
          ))}
        </div>
        <p className="text-xs text-[#737373]">Check each source link for current availability and contact details.</p>
      </section>

      {/* 3. Role Categories Pill Filter Section */}
      <section className="text-center space-y-6 pt-8 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full skeuo-well px-3 py-1 text-xs font-mono text-[#A1A1A1]">
          <span className="skeuo-led-green" />
          <span>Filter example roles</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Browse by engineering discipline
        </h2>

        <p className="text-sm text-[#8C93A8] leading-relaxed max-w-xl mx-auto font-sans">
          Narrow the example directory to the roles you want to review.
        </p>

        {/* Role Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {ROLE_CATEGORIES.map((role) => {
            const isSelected = selectedRole === role;
            return (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 active:translate-y-[2px] active:shadow-none ${
                  isSelected
                    ? 'skeuo-btn-primary font-bold text-black'
                    : 'skeuo-btn text-[#A1A1A1] hover:text-white'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-black" />}
                <span>{role}</span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
export default JobRadar;
