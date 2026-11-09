import React, { useState } from 'react';
import type { JobListing, CandidateProfile } from '../types';
import { 
  Search, 
  MapPin, 
  Send, 
  FileText, 
  Check, 
  Bot, 
  MessageSquare, 
  Briefcase, 
  Inbox, 
  Globe, 
  ChevronDown,
  ExternalLink
} from 'lucide-react';

interface JobRadarProps {
  jobs: JobListing[];
  candidate: CandidateProfile;
  onSelectJobForATS: (job: JobListing) => void;
  onSelectJobForOutreach: (job: JobListing) => void;
  onAddToPipeline: (job: JobListing) => void;
  onSimulateApply: (job: JobListing) => void;
  appliedJobIds: Set<string>;
  onOpenPortfolio: () => void;
  onOpenApplications: () => void;
}

const ROLE_CATEGORIES = [
  'All Roles',
  'Full Stack Developer',
  'AI Engineer',
  'Frontend Engineer',
  'Backend Engineer',
  'DevOps Engineer',
  'Data Scientist',
  'Security Engineer',
  'Mobile Engineer'
];

export const JobRadar: React.FC<JobRadarProps> = ({
  jobs,
  candidate,
  onSelectJobForATS,
  onSelectJobForOutreach,
  onAddToPipeline,
  onSimulateApply,
  appliedJobIds,
  onOpenPortfolio,
  onOpenApplications,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [sidebarTab, setSidebarTab] = useState<'JOBS' | 'CHAT' | 'APPLICATIONS' | 'PORTFOLIO'>('JOBS');

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
      (selectedRole === 'Full Stack Developer' && job.title.toLowerCase().includes('full stack')) ||
      (selectedRole === 'AI Engineer' && (job.title.toLowerCase().includes('ai') || job.title.toLowerCase().includes('machine learning'))) ||
      (selectedRole === 'Frontend Engineer' && job.title.toLowerCase().includes('frontend')) ||
      (selectedRole === 'Backend Engineer' && job.title.toLowerCase().includes('backend')) ||
      (selectedRole === 'DevOps Engineer' && (job.title.toLowerCase().includes('reliability') || job.title.toLowerCase().includes('devops')));

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-12">
      {/* 1. The Central Aarivi Desktop Dashboard Frame (Pixel-Matched to User's Uploaded Screenshot) */}
      <div className="rounded-2xl border border-[#262626] bg-[#111111] shadow-2xl overflow-hidden">
        {/* Top Window Bar */}
        <div className="bg-[#1A1A1A] px-4 py-2.5 border-b border-[#262626] flex items-center justify-between text-xs text-[#888888]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#333333] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#333333] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#333333] inline-block" />
            <span className="ml-2 font-mono text-[11px] text-[#A3A3A3]">JobPilot Studio — Live YC & Bangalore Startup Radar</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#10B981]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>Connected to verified founder direct inbox pipeline</span>
          </div>
        </div>

        {/* Inner Dual-Pane Desktop View (Image 2) */}
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[580px] bg-white text-[#111827]">
          {/* Left Sidebar (Aarivi Style) */}
          <aside className="md:col-span-3 border-r border-[#E5E7EB] bg-[#FAFAFA] p-4 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-[#111827] text-white flex items-center justify-center font-black text-[10px]">
                    ▲
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#111827] tracking-tight">JobPilot</h4>
                    <p className="text-[10px] text-[#6B7280]">Dashboard</p>
                  </div>
                </div>
                <div className="text-[#9CA3AF] text-xs">
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* CAREER Navigation */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-semibold text-[#9CA3AF] uppercase tracking-wider block px-2 mb-1.5">
                  CAREER
                </span>

                <button
                  onClick={() => setSidebarTab('CHAT')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    sidebarTab === 'CHAT' ? 'bg-[#E5E7EB] text-[#111827] font-semibold' : 'text-[#4B5563] hover:bg-[#F3F4F6]'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-[#6B7280]" />
                  <span>New Chat</span>
                </button>

                <button
                  onClick={() => setSidebarTab('JOBS')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                    sidebarTab === 'JOBS' ? 'bg-[#E5E7EB] text-[#111827] font-semibold' : 'text-[#4B5563] hover:bg-[#F3F4F6]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-4 h-4 text-[#111827]" />
                    <span>Jobs</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#D1D5DB] text-[#111827] font-bold">
                    {filteredJobs.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setSidebarTab('APPLICATIONS');
                    onOpenApplications();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                    sidebarTab === 'APPLICATIONS' ? 'bg-[#E5E7EB] text-[#111827] font-semibold' : 'text-[#4B5563] hover:bg-[#F3F4F6]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Inbox className="w-4 h-4 text-[#6B7280]" />
                    <span>Applications</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#E5E7EB] text-[#4B5563]">
                    {appliedJobIds.size}
                  </span>
                </button>
              </div>

              {/* TOOLS Navigation */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-semibold text-[#9CA3AF] uppercase tracking-wider block px-2 mb-1.5">
                  TOOLS
                </span>

                <button
                  onClick={() => {
                    setSidebarTab('PORTFOLIO');
                    onOpenPortfolio();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    sidebarTab === 'PORTFOLIO' ? 'bg-[#E5E7EB] text-[#111827] font-semibold' : 'text-[#4B5563] hover:bg-[#F3F4F6]'
                  }`}
                >
                  <Globe className="w-4 h-4 text-[#6B7280]" />
                  <span>Portfolio</span>
                </button>
              </div>
            </div>

            {/* Sidebar Footer User Pill (Aarivi Image 2) */}
            <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#E5E7EB] text-[#374151] font-bold text-xs flex items-center justify-center">
                  {candidate.fullName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-xs text-[#111827] truncate max-w-[120px]">
                    {candidate.fullName}
                  </div>
                  <div className="text-[10px] text-[#6B7280] truncate max-w-[120px]">
                    {candidate.email}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
            </div>
          </aside>

          {/* Right Main Table Content (Exact Aarivi Layout) */}
          <main className="md:col-span-9 p-5 flex flex-col justify-between space-y-4 overflow-x-auto">
            <div className="space-y-4">
              {/* Top Search & Actions Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F3F4F6]">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#111827]" />
                  <h3 className="font-bold text-sm text-[#111827]">Jobs</h3>
                  <span className="text-xs text-[#9CA3AF]">•</span>
                  <span className="text-xs text-[#6B7280]">Verified Direct Founder Listings</span>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by role, company, stack, or city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#111827] w-64"
                  />
                </div>
              </div>

              {/* Aarivi Table View */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <tbody>
                    {filteredJobs.map((job) => {
                      const isApplied = appliedJobIds.has(job.id);
                      return (
                        <tr 
                          key={job.id} 
                          className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors group cursor-pointer"
                        >
                          {/* 1. Icon + Title + Company */}
                          <td className="py-3.5 pr-4 pl-1">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg ${job.logoColor} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm`}>
                                {job.company.charAt(0)}
                              </div>
                              <div>
                                <div className="font-semibold text-xs text-[#111827] group-hover:text-black">
                                  {job.title}
                                </div>
                                <div className="text-[11px] text-[#6B7280] flex items-center gap-1.5 mt-0.5">
                                  <span>{job.company}</span>
                                  {job.noticeBuyoutCovered && (
                                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                                      Notice Buyout
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* 2. Location */}
                          <td className="py-3.5 px-3 text-[#4B5563] text-[11px] whitespace-nowrap">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#9CA3AF]" />
                              {job.location}
                            </span>
                          </td>

                          {/* 3. Experience & Salary (Indian INR format) */}
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            <div className="text-[11px] text-[#374151] font-medium">
                              {job.experienceDisplay || '2–4 years'}
                            </div>
                            <div className="text-[11px] text-[#6B7280] font-mono">
                              {job.salaryDisplay || `₹${job.minCtcLpa}L–₹${job.maxCtcLpa}L`}
                            </div>
                          </td>

                          {/* 4. Tech Stack Pills */}
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-1">
                              {job.requiredSkills.slice(0, 2).map((sk) => (
                                <span
                                  key={sk}
                                  className="px-2 py-0.5 rounded bg-[#F3F4F6] text-[#4B5563] text-[10px] font-mono font-medium border border-[#E5E7EB]"
                                >
                                  {sk}
                                </span>
                              ))}
                              {job.requiredSkills.length > 2 && (
                                <span className="text-[10px] font-mono text-[#9CA3AF]">
                                  +{job.requiredSkills.length - 2}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* 5. Match Score Bar (Aarivi Style) */}
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="bg-[#F59E0B] h-full rounded-full"
                                  style={{ width: `${job.atsMatchScore || 80}%` }}
                                />
                              </div>
                              <span className="font-mono font-bold text-xs text-[#374151]">
                                {job.atsMatchScore || 80}%
                              </span>
                            </div>
                          </td>

                          {/* 6. Quick Action Buttons on Hover */}
                          <td className="py-3.5 pl-3 pr-2 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectJobForOutreach(job);
                                }}
                                className="px-2.5 py-1 bg-[#111827] hover:bg-black text-white text-[11px] font-medium rounded-md shadow-sm transition-all flex items-center gap-1"
                                title="Draft Cold Email (80% formula)"
                              >
                                <Send className="w-2.5 h-2.5" />
                                <span>Email</span>
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectJobForATS(job);
                                }}
                                className="px-2 py-1 bg-white hover:bg-[#F3F4F6] text-[#374151] border border-[#D1D5DB] text-[11px] font-medium rounded-md transition-all"
                                title="Tailor Resume"
                              >
                                <FileText className="w-2.5 h-2.5" />
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSimulateApply(job);
                                }}
                                className="px-2 py-1 bg-white hover:bg-[#F3F4F6] text-[#374151] border border-[#D1D5DB] text-[11px] font-medium rounded-md transition-all"
                                title="Autopilot Apply"
                              >
                                <Bot className="w-2.5 h-2.5 text-[#6366F1]" />
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onAddToPipeline(job);
                                }}
                                className={`px-2 py-1 text-[11px] font-medium rounded-md transition-all ${
                                  isApplied ? 'bg-[#F3F4F6] text-[#9CA3AF]' : 'bg-white hover:bg-[#F3F4F6] text-[#374151] border border-[#D1D5DB]'
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
            </div>

            {/* Table Footer (Image 2) */}
            <div className="pt-3 border-t border-[#F3F4F6] flex items-center justify-between text-[11px] text-[#6B7280] font-mono">
              <span>Showing 1–{filteredJobs.length} of {jobs.length} matched roles</span>
              <span>Updated live from startup directories</span>
            </div>
          </main>
        </div>
      </div>

      {/* 2. "Companies you'll see, funded by" (Aarivi Image 3) */}
      <section className="text-center space-y-5 pt-4">
        <h3 className="text-xs font-mono font-medium text-[#737373] tracking-wide uppercase">
          Companies you'll see, funded by
        </h3>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-80 grayscale hover:grayscale-0 transition-all text-xs font-mono text-[#A3A3A3]">
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-sm text-white">
            <span className="w-5 h-5 rounded bg-[#F97316] text-white flex items-center justify-center font-black text-xs font-mono">
              Y
            </span>
            <span>Y Combinator</span>
          </div>

          <div className="font-bold tracking-wider text-xs text-white">
            FOUNDERS FUND
          </div>

          <div className="flex items-center gap-1 font-semibold text-xs text-white">
            <span className="text-red-500">🔥</span>
            <span>lightspeed</span>
          </div>

          <div className="font-mono text-xs text-white tracking-tight">
            andreessen. horowitz
          </div>

          <div className="font-bold tracking-tight text-xs text-white">
            PEAK XV SURGE
          </div>
        </div>
      </section>

      {/* 3. "All kinds of roles" Pill Filter Section (Aarivi Image 3) */}
      <section className="text-center space-y-6 pt-8 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171717] border border-[#262626] text-xs font-mono text-[#A3A3A3]">
          <span>🌐</span>
          <span>All kinds of roles</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Find every kind of role in one place
        </h2>

        <p className="text-sm text-[#A3A3A3] leading-relaxed max-w-xl mx-auto font-sans">
          Engineering, design, data, product, internships. If people are hiring for it, you can look for it here.
        </p>

        {/* Role Pills with Checkmarks (Image 3) */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {ROLE_CATEGORIES.map((role) => {
            const isSelected = selectedRole === role;
            return (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-white text-black border-white shadow-sm font-semibold'
                    : 'bg-[#171717] text-[#A3A3A3] border-[#262626] hover:text-white hover:border-[#404040]'
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
