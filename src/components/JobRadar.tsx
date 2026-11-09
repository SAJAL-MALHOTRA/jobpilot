import React, { useState } from 'react';
import type { JobListing, CandidateProfile } from '../types';
import { calculateQuickMatchScore } from '../lib/jobRadarEngine';
import { 
  MapPin, 
  DollarSign, 
  Sparkles, 
  Send, 
  FileCheck, 
  Plus, 
  Check, 
  ShieldCheck, 
  CheckCircle2, 
  Zap, 
  Bot, 
  LayoutGrid, 
  Layers
} from 'lucide-react';

interface JobRadarProps {
  jobs: JobListing[];
  candidate: CandidateProfile;
  onSelectJobForATS: (job: JobListing) => void;
  onSelectJobForOutreach: (job: JobListing) => void;
  onAddToPipeline: (job: JobListing) => void;
  onSimulateApply: (job: JobListing) => void;
  appliedJobIds: Set<string>;
}

export const JobRadar: React.FC<JobRadarProps> = ({
  jobs,
  candidate,
  onSelectJobForATS,
  onSelectJobForOutreach,
  onAddToPipeline,
  onSimulateApply,
  appliedJobIds,
}) => {
  const [naturalQuery, setNaturalQuery] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [sourceFilter, setSourceFilter] = useState<'ALL' | 'YC' | 'WELLFOUND' | 'LINKEDIN'>('ALL');
  const [minCtc, setMinCtc] = useState<number>(25);
  const [onlyNoticeBuyout, setOnlyNoticeBuyout] = useState(false);
  const [viewMode, setViewMode] = useState<'GRID' | 'CORRIDORS'>('GRID');

  const candidateSkills = new Set(
    [...candidate.primarySkills, ...candidate.secondarySkills].map((s) => s.toLowerCase())
  );

  // Explee Natural Language Quick Presets
  const applyPreset = (promptText: string, minCtcVal: number, sourceVal: 'ALL' | 'YC' | 'WELLFOUND' | 'LINKEDIN', remote: boolean, buyout: boolean) => {
    setNaturalQuery(promptText);
    setMinCtc(minCtcVal);
    setSourceFilter(sourceVal);
    setRemoteOnly(remote);
    setOnlyNoticeBuyout(buyout);
  };

  const filteredJobs = jobs.filter((job) => {
    const q = naturalQuery.toLowerCase();
    const matchesPrompt =
      !q ||
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q) ||
      job.bangaloreCluster?.toLowerCase().includes(q) ||
      job.requiredSkills.some((s) => s.toLowerCase().includes(q));

    const matchesRemote = !remoteOnly || job.isRemote;

    const matchesSource =
      sourceFilter === 'ALL' ||
      (sourceFilter === 'YC' && (job.source === 'YC W24' || job.source === 'YC S24')) ||
      (sourceFilter === 'WELLFOUND' && job.source === 'Wellfound') ||
      (sourceFilter === 'LINKEDIN' && job.source === 'LinkedIn');

    const matchesCtc = job.maxCtcLpa >= minCtc;
    const matchesBuyout = !onlyNoticeBuyout || job.noticeBuyoutCovered;

    return matchesPrompt && matchesRemote && matchesSource && matchesCtc && matchesBuyout;
  });

  // Bangalore Corridor Clusters
  const corridorClusters = [
    {
      name: 'Indiranagar & Koramangala Hub',
      tagline: 'High-density YC / Seed startups & rapid engineering sprints',
      medianCtc: '₹38 LPA',
      clusterJobs: filteredJobs.filter(j => j.bangaloreCluster?.includes('Indiranagar') || j.bangaloreCluster?.includes('Koramangala')),
    },
    {
      name: 'HSR Layout & Bellandur Tech Belt',
      tagline: 'Scale-ups, AI research labs & logistics giants',
      medianCtc: '₹42 LPA',
      clusterJobs: filteredJobs.filter(j => j.bangaloreCluster?.includes('HSR') || j.bangaloreCluster?.includes('Bellandur') || j.bangaloreCluster?.includes('Ring Road')),
    },
    {
      name: 'Remote First (Global / India)',
      tagline: 'Async culture, US equity grants & top-of-market base',
      medianCtc: '₹45 LPA',
      clusterJobs: filteredJobs.filter(j => j.isRemote || j.bangaloreCluster?.includes('Remote')),
    },
  ];

  return (
    <div className="space-y-6 text-[#EDEDED]">
      {/* Explee-Style Natural Language Prompt Search Bar */}
      <div className="bg-[#111115] p-5 sm:p-6 rounded-2xl border border-neutral-800 shadow-2xl space-y-4">
        {/* Natural Language Search Input */}
        <div className="relative">
          <div className="absolute left-4 top-3.5 flex items-center gap-1.5 text-indigo-400">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <input
            type="text"
            placeholder="Explee Prompt Search: 'Find YC W24 AI startups in Indiranagar paying >₹35L with verified CEO emails'..."
            value={naturalQuery}
            onChange={(e) => setNaturalQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#0c0d12] border border-neutral-800 rounded-xl text-xs sm:text-sm font-mono text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-white shadow-inner"
          />
        </div>

        {/* Explee 1-Click Prompt Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono">
          <span className="text-[11px] text-neutral-400 uppercase tracking-wider flex items-center gap-1">
            ⚡ Quick Prompts:
          </span>
          <button
            onClick={() => applyPreset('AI', 32, 'YC', false, false)}
            className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-neutral-300 text-[11px] transition-all"
          >
            &quot;YC W24 AI Startups (₹32L+)&quot;
          </button>
          <button
            onClick={() => applyPreset('Indiranagar', 30, 'ALL', false, true)}
            className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-neutral-300 text-[11px] transition-all"
          >
            &quot;Indiranagar Hub + Notice Buyout&quot;
          </button>
          <button
            onClick={() => applyPreset('Remote', 35, 'YC', true, false)}
            className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-neutral-300 text-[11px] transition-all"
          >
            &quot;Remote US/India Tech (High Equity)&quot;
          </button>
          <button
            onClick={() => { setNaturalQuery(''); setMinCtc(20); setSourceFilter('ALL'); setRemoteOnly(false); setOnlyNoticeBuyout(false); }}
            className="text-[11px] text-neutral-400 hover:text-white underline ml-auto"
          >
            Reset Filters
          </button>
        </div>

        {/* Multi-Parameter Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-neutral-800/80 text-xs font-mono text-neutral-400">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setRemoteOnly(!remoteOnly)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                remoteOnly
                  ? 'bg-white text-black border-white'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
              }`}
            >
              Remote Only
            </button>

            <button
              onClick={() => setOnlyNoticeBuyout(!onlyNoticeBuyout)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                onlyNoticeBuyout
                  ? 'bg-emerald-400 text-black border-emerald-400'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
              }`}
            >
              ⚡ Notice Buyout Covered
            </button>

            <select
              value={sourceFilter}
              onChange={(e: any) => setSourceFilter(e.target.value)}
              className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-neutral-300 focus:outline-none"
            >
              <option value="ALL">All Sources (YC + Bangalore)</option>
              <option value="YC">YC W24 / S24 Batches</option>
              <option value="WELLFOUND">Wellfound Seed Startups</option>
              <option value="LINKEDIN">LinkedIn Direct</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Min CTC:</span>
              <input
                type="range"
                min="20"
                max="50"
                step="2"
                value={minCtc}
                onChange={(e) => setMinCtc(parseInt(e.target.value))}
                className="w-24 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <span className="font-bold text-white">₹{minCtc}L+</span>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
              <button
                onClick={() => setViewMode('GRID')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'GRID' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('CORRIDORS')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'CORRIDORS' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-white'
                }`}
                title="Bangalore Corridor Clusters"
              >
                <Layers className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Matching Count Banner */}
      <div className="flex items-center justify-between text-xs text-neutral-400 px-1 font-mono">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Explee Semantic Engine matched <strong>{filteredJobs.length} active opportunities</strong></span>
        </span>
        <span className="text-[11px] text-neutral-500">Real-time SMTP Verified Founder Emails</span>
      </div>

      {/* Corridors Grouped View Mode */}
      {viewMode === 'CORRIDORS' ? (
        <div className="space-y-8">
          {corridorClusters.map((cluster, idx) => (
            <div key={idx} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-800 pb-3 gap-2">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>{cluster.name}</span>
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5">{cluster.tagline}</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-neutral-400">Cluster Median: <strong className="text-emerald-400">{cluster.medianCtc}</strong></span>
                  <span className="px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-white">
                    {cluster.clusterJobs.length} roles
                  </span>
                </div>
              </div>

              {cluster.clusterJobs.length === 0 ? (
                <div className="p-6 rounded-2xl bg-[#111115] border border-neutral-800 text-center text-xs font-mono text-neutral-500">
                  No roles in this cluster matching current query filters.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cluster.clusterJobs.map((job) => renderJobCard(job))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Standard Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job) => renderJobCard(job))}
        </div>
      )}
    </div>
  );

  function renderJobCard(job: JobListing) {
    const matchScore = calculateQuickMatchScore(candidate, job);
    const isApplied = appliedJobIds.has(job.id);

    return (
      <div
        key={job.id}
        className="bg-[#111115] rounded-2xl border border-neutral-800 hover:border-neutral-700 p-6 flex flex-col justify-between space-y-5 transition-all shadow-xl hover:shadow-indigo-500/5 group"
      >
        <div className="space-y-3.5">
          {/* Header Badge Row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${job.logoColor} flex items-center justify-center text-white font-black text-sm shadow-md font-mono`}>
                {job.company.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-white text-base group-hover:text-neutral-200 transition-colors">
                  {job.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                  <span className="font-semibold text-neutral-200">{job.company}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-[11px] font-mono">
                    <MapPin className="w-3 h-3 text-neutral-500" />
                    {job.bangaloreCluster || job.location}
                  </span>
                </div>
              </div>
            </div>

            {/* ATS Match Score */}
            <div className="text-right">
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black font-mono">
                <span>{matchScore}% Match</span>
              </div>
              <span className="block text-[10px] text-neutral-500 font-mono mt-0.5">{job.source}</span>
            </div>
          </div>

          {/* Explee Prospecting & Data-Enrichment Matrix */}
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-neutral-900/90 p-3 rounded-xl border border-neutral-800">
            <div className="space-y-0.5">
              <span className="text-neutral-500 uppercase tracking-wider text-[10px] block">Compensation</span>
              <span className="font-bold text-white flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-emerald-400" />
                ₹{job.minCtcLpa}–{job.maxCtcLpa} LPA
              </span>
              <span className="text-neutral-400 text-[10px] block">Equity: {job.equityRange}</span>
            </div>

            <div className="space-y-0.5">
              <span className="text-neutral-500 uppercase tracking-wider text-[10px] block">Backer & Stage</span>
              <span className="font-bold text-neutral-200 block truncate">{job.fundingRound || 'Venture Backed'}</span>
              <span className="text-emerald-400 text-[10px] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> {job.emailDeliverabilityPct}% Email Validity
              </span>
            </div>
          </div>

          {/* Notice Buyout & Urgency Banner */}
          {job.noticeBuyoutCovered && (
            <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-900 rounded-lg border border-neutral-800 text-xs font-mono">
              <span className="text-emerald-400 font-medium flex items-center gap-1.5 text-[11px]">
                <Zap className="w-3.5 h-3.5 text-emerald-400" /> Covers 60/90-Day Notice Buyout
              </span>
              {job.hiringUrgency === 'Immediate' && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-neutral-800 text-white border border-neutral-700">
                  Immediate
                </span>
              )}
            </div>
          )}

          {/* Job Excerpt */}
          <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
            {job.description}
          </p>

          {/* Skills Match */}
          <div className="flex flex-wrap gap-1.5">
            {job.requiredSkills.map((skill) => {
              const isMatched = candidateSkills.has(skill.toLowerCase());
              return (
                <span
                  key={skill}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-mono border ${
                    isMatched
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                  }`}
                >
                  {isMatched ? '✓ ' : ''}{skill}
                </span>
              );
            })}
          </div>
        </div>

        {/* Direct Founder Contact & Action Bar */}
        <div className="pt-4 border-t border-neutral-800 space-y-3 font-mono">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>
              Direct: <strong className="text-neutral-200">{job.founderName}</strong> ({job.founderRole})
            </span>
            <span className="text-[11px] text-neutral-500">{job.founderEmail}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Autonomous Apply Simulator Button */}
            <button
              onClick={() => onSimulateApply(job)}
              className="py-2 px-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all shadow-sm group/btn"
              title="Run Autonomous Headless Apply + Founder Dispatch"
            >
              <Bot className="w-3.5 h-3.5 text-indigo-400 group-hover/btn:animate-spin" />
              <span>Autopilot</span>
            </button>

            {/* CrackColdEmail Studio Pitch Button */}
            <button
              onClick={() => onSelectJobForOutreach(job)}
              className="py-2 px-2 bg-white hover:bg-neutral-200 rounded-xl text-xs font-bold text-black shadow-md flex items-center justify-center gap-1.5 transition-all"
            >
              <Send className="w-3.5 h-3.5 text-black" />
              <span>Pitch</span>
            </button>

            {/* ATS Resume Tailor */}
            <button
              onClick={() => onSelectJobForATS(job)}
              className="py-2 px-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-xs font-semibold text-neutral-300 flex items-center justify-center gap-1.5 transition-all"
            >
              <FileCheck className="w-3.5 h-3.5 text-neutral-400" />
              <span>Tailor</span>
            </button>

            {/* Queue in CRM */}
            <button
              onClick={() => onAddToPipeline(job)}
              disabled={isApplied}
              className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
                isApplied
                  ? 'bg-neutral-900 border-neutral-800 text-neutral-500 cursor-not-allowed'
                  : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300 hover:text-white'
              }`}
            >
              {isApplied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{isApplied ? 'In CRM' : 'Queue'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
};
export default JobRadar;
