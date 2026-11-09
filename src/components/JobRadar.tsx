import React, { useState } from 'react';
import type { JobListing, CandidateProfile } from '../types';
import { 
  Search, 
  MapPin, 
  Send, 
  FileText, 
  Check, 
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
  onSimulateApply,
  appliedJobIds,
  onOpenPortfolio,
  onOpenApplications,
  onOpenAtsLab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [sidebarTab, setSidebarTab] = useState<'JOBS' | 'CHAT' | 'APPLICATIONS' | 'PORTFOLIO' | 'ATS'>('JOBS');

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

  return (
    <div className="space-y-12">
      {/* 1. JobPilot Studio Desktop Window (Pure Black Minimalist UI) */}
      <div className="rounded-xl border border-[#1F1F1F] bg-[#000000] shadow-2xl overflow-hidden">
        {/* Top Window Bar */}
        <div className="bg-[#0A0A0A] px-4 py-2.5 border-b border-[#1F1F1F] flex items-center justify-between text-xs text-[#888888]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#262626] inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#262626] inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#262626] inline-block" />
            <span className="ml-2 font-mono text-[11px] text-[#A1A1A1]">Startup Roles Radar — Direct Founder Outreach</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Bangalore & YC S24/W24 Feed</span>
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
                  <div className="w-6 h-6 rounded-md bg-white text-black flex items-center justify-center font-bold text-[11px] shadow-sm">
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
                <span className="text-[10px] font-mono font-semibold text-[#666D82] uppercase tracking-wider block px-2 mb-1.5">
                  CAREER
                </span>

                <button
                  onClick={() => setSidebarTab('CHAT')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    sidebarTab === 'CHAT' ? 'bg-[#1C2030] text-white font-semibold' : 'text-[#8C93A8] hover:bg-[#151824] hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-[#71788E]" />
                  <span>Copilot Chat</span>
                </button>

                <button
                  onClick={() => setSidebarTab('JOBS')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                    sidebarTab === 'JOBS' ? 'bg-[#1C2030] text-white font-semibold' : 'text-[#8C93A8] hover:bg-[#151824] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-4 h-4 text-white" />
                    <span>Open Roles</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white text-black font-bold">
                    {filteredJobs.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setSidebarTab('APPLICATIONS');
                    onOpenApplications();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                    sidebarTab === 'APPLICATIONS' ? 'bg-[#1C2030] text-white font-semibold' : 'text-[#8C93A8] hover:bg-[#151824] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Inbox className="w-4 h-4 text-[#71788E]" />
                    <span>Applications</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#1A1D2B] text-[#A3A8BD] border border-[#262B3D]">
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
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    sidebarTab === 'PORTFOLIO' ? 'bg-[#1C2030] text-white font-semibold' : 'text-[#8C93A8] hover:bg-[#151824] hover:text-white'
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
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    sidebarTab === 'ATS' ? 'bg-[#1C2030] text-white font-semibold' : 'text-[#8C93A8] hover:bg-[#151824] hover:text-white'
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
          <main className="md:col-span-9 p-5 flex flex-col justify-between space-y-4 overflow-x-auto bg-[#0E1017]">
            <div className="space-y-4">
              {/* Top Search & Actions Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1A1D2A]">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-white" />
                  <h3 className="font-bold text-sm text-white">Open Roles Directory</h3>
                  <span className="text-xs text-[#3A3F55]">•</span>
                  <span className="text-xs text-[#8C93A8] font-mono">Verified Founder Contacts</span>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#666D82] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search role, stack (React, Python), or city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-[#141724] border border-[#202538] rounded-lg text-xs text-white placeholder-[#666D82] focus:outline-none focus:border-white w-64 font-sans"
                  />
                </div>
              </div>

              {/* Table View */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <tbody>
                    {filteredJobs.map((job) => {
                      const isApplied = appliedJobIds.has(job.id);
                      return (
                        <tr 
                          key={job.id} 
                          className="border-b border-[#171926] hover:bg-[#141724] transition-colors group cursor-pointer"
                        >
                          {/* 1. Icon + Title + Company */}
                          <td className="py-3.5 pr-4 pl-1">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg ${job.logoColor} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm font-mono`}>
                                {job.company.charAt(0)}
                              </div>
                              <div>
                                <div className="font-semibold text-xs text-white group-hover:text-[#A5B4FC] transition-colors">
                                  {job.title}
                                </div>
                                <div className="text-[11px] text-[#8C93A8] flex items-center gap-1.5 mt-0.5">
                                  <span>{job.company}</span>
                                  {job.noticeBuyoutCovered && (
                                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#064E3B]/40 text-[#34D399] border border-[#059669]/40">
                                      Notice Buyout
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* 2. Location */}
                          <td className="py-3.5 px-3 text-[#A3A8BD] text-[11px] whitespace-nowrap font-sans">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#666D82]" />
                              {job.location}
                            </span>
                          </td>

                          {/* 3. Experience & Salary (Indian INR format) */}
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            <div className="text-[11px] text-white font-medium">
                              {job.experienceDisplay || '2–4 years'}
                            </div>
                            <div className="text-[11px] text-[#A3A8BD] font-mono">
                              {job.salaryDisplay || `₹${job.minCtcLpa}L–₹${job.maxCtcLpa}L`}
                            </div>
                          </td>

                          {/* 4. Tech Stack Pills */}
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-1">
                              {job.requiredSkills.slice(0, 2).map((sk) => (
                                <span
                                  key={sk}
                                  className="px-2 py-0.5 rounded bg-[#161926] text-[#A3A8BD] text-[10px] font-mono font-medium border border-[#23273B]"
                                >
                                  {sk}
                                </span>
                              ))}
                              {job.requiredSkills.length > 2 && (
                                <span className="text-[10px] font-mono text-[#666D82]">
                                  +{job.requiredSkills.length - 2}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* 5. Match Score Bar */}
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-[#1A1E2C] h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="bg-[#F59E0B] h-full rounded-full"
                                  style={{ width: `${job.atsMatchScore || 80}%` }}
                                />
                              </div>
                              <span className="font-mono font-bold text-xs text-[#F59E0B]">
                                {job.atsMatchScore || 80}%
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
                                className="px-2.5 py-1 bg-white hover:bg-[#EDEDED] text-black text-[11px] font-bold rounded-md shadow-sm transition-all flex items-center gap-1"
                                title="Draft Cold Email (80% formula)"
                              >
                                <Send className="w-2.5 h-2.5" />
                                <span>Pitch</span>
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectJobForATS(job);
                                }}
                                className="px-2 py-1 bg-[#161926] hover:bg-[#202538] text-[#C5CADB] border border-[#23273B] text-[11px] font-medium rounded-md transition-all"
                                title="Tailor Resume (Google X-Y-Z)"
                              >
                                <FileText className="w-2.5 h-2.5" />
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSimulateApply(job);
                                }}
                                className="px-2.5 py-1 bg-[#141414] hover:bg-[#222222] text-[#A1A1A1] hover:text-white border border-[#262626] text-[11px] font-medium rounded-md transition-all flex items-center gap-1"
                                title="Open Careers Page & Track"
                              >
                                <ExternalLink className="w-2.5 h-2.5" />
                                <span>Apply</span>
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onAddToPipeline(job);
                                }}
                                className={`px-2 py-1 text-[11px] font-medium rounded-md transition-all ${
                                  isApplied ? 'bg-[#161926] text-[#666D82]' : 'bg-[#161926] hover:bg-[#202538] text-[#C5CADB] border border-[#23273B]'
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

            {/* Table Footer */}
            <div className="pt-3 border-t border-[#1A1D2A] flex items-center justify-between text-[11px] text-[#71788E] font-mono">
              <span>Showing 1–{filteredJobs.length} of {jobs.length} open roles</span>
              <span>Direct verified founder routing</span>
            </div>
          </main>
        </div>
      </div>

      {/* 2. Startup Clusters Funded By */}
      <section className="text-center space-y-5 pt-4">
        <h3 className="text-xs font-mono font-medium text-[#71788E] tracking-wide uppercase">
          Startup clusters & portfolio companies backed by
        </h3>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-80 text-xs font-mono text-[#A3A8BD]">
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
            <span>lightspeed india</span>
          </div>

          <div className="font-mono text-xs text-white tracking-tight">
            andreessen. horowitz
          </div>

          <div className="font-bold tracking-tight text-xs text-white">
            PEAK XV SURGE
          </div>
        </div>
      </section>

      {/* 3. Role Categories Pill Filter Section */}
      <section className="text-center space-y-6 pt-8 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13151F] border border-[#1E2230] text-xs font-mono text-[#A3A8BD]">
          <span>◈</span>
          <span>Target Engineering Disciplines</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Find high-conviction roles across startup tiers
        </h2>

        <p className="text-sm text-[#8C93A8] leading-relaxed max-w-xl mx-auto font-sans">
          From seed-stage founding engineers in Indiranagar to Series B scale-ups in HSR Layout.
        </p>

        {/* Role Pills */}
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
                    : 'bg-[#12141E] text-[#8C93A8] border-[#1E2230] hover:text-white hover:border-[#31374C]'
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
