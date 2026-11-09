import React, { useState } from 'react';
import type { JobListing, CandidateProfile } from '../types';
import { calculateQuickMatchScore } from '../lib/jobRadarEngine';
import { Search, MapPin, DollarSign, Sparkles, Send, FileCheck, Plus, Check, Flame } from 'lucide-react';

interface JobRadarProps {
  jobs: JobListing[];
  candidate: CandidateProfile;
  onSelectJobForATS: (job: JobListing) => void;
  onSelectJobForOutreach: (job: JobListing) => void;
  onAddToPipeline: (job: JobListing) => void;
  appliedJobIds: Set<string>;
}

export const JobRadar: React.FC<JobRadarProps> = ({
  jobs,
  candidate,
  onSelectJobForATS,
  onSelectJobForOutreach,
  onAddToPipeline,
  appliedJobIds,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [sourceFilter, setSourceFilter] = useState<'ALL' | 'YC' | 'WELLFOUND' | 'LINKEDIN'>('ALL');
  const [minCtc, setMinCtc] = useState<number>(25);

  const candidateSkills = new Set(
    [...candidate.primarySkills, ...candidate.secondarySkills].map((s) => s.toLowerCase())
  );

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRemote = !remoteOnly || job.isRemote;

    const matchesSource =
      sourceFilter === 'ALL' ||
      (sourceFilter === 'YC' && (job.source === 'YC W24' || job.source === 'YC S24')) ||
      (sourceFilter === 'WELLFOUND' && job.source === 'Wellfound') ||
      (sourceFilter === 'LINKEDIN' && job.source === 'LinkedIn');

    const matchesCtc = job.maxCtcLpa >= minCtc;

    return matchesSearch && matchesRemote && matchesSource && matchesCtc;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filters Bar */}
      <div className="bg-[#101625] p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by role, company, or tech stack (e.g., React, Python, FastAPI)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setRemoteOnly(!remoteOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                remoteOnly
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              Remote Only
            </button>

            <select
              value={sourceFilter}
              onChange={(e: any) => setSourceFilter(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Sources</option>
              <option value="YC">Y Combinator (W24/S24)</option>
              <option value="WELLFOUND">Wellfound</option>
              <option value="LINKEDIN">LinkedIn</option>
            </select>
          </div>
        </div>

        {/* Min CTC Slider & Matching Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-300">Min Target CTC:</span>
            <input
              type="range"
              min="20"
              max="50"
              step="2"
              value={minCtc}
              onChange={(e) => setMinCtc(parseInt(e.target.value))}
              className="w-32 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <span className="font-mono font-bold text-indigo-400">₹ {minCtc} LPA</span>
          </div>

          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold text-slate-300">
              {filteredJobs.length} Live Openings Match Your Profile
            </span>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.map((job) => {
          const matchScore = calculateQuickMatchScore(candidate, job);
          const isApplied = appliedJobIds.has(job.id);

          return (
            <div
              key={job.id}
              className="bg-[#101625] rounded-2xl border border-slate-800/80 hover:border-slate-700 p-6 flex flex-col justify-between space-y-5 transition-all shadow-lg hover:shadow-indigo-500/5 group"
            >
              {/* Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${job.logoColor} flex items-center justify-center text-white font-black text-sm shadow-md`}>
                      {job.company.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base group-hover:text-indigo-400 transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="font-semibold text-slate-300">{job.company}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {job.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Match Score Badge */}
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black font-mono">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>{matchScore}% ATS Match</span>
                    </div>
                    <span className="block text-[10px] text-slate-500 font-mono mt-0.5">{job.source}</span>
                  </div>
                </div>

                {/* Compensation & Urgency Banner */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5 font-mono font-bold text-slate-200">
                    <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
                    <span>₹ {job.minCtcLpa} – ₹ {job.maxCtcLpa} LPA</span>
                    <span className="text-[11px] font-normal text-slate-400 font-sans">({job.equityRange})</span>
                  </div>

                  {job.hiringUrgency === 'Immediate' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      <Flame className="w-3 h-3 text-rose-500" /> Urgently Hiring
                    </span>
                  )}
                </div>

                {/* Job Description Excerpt */}
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {job.description}
                </p>

                {/* Required Skills with Candidate Match Highlighting */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.requiredSkills.map((skill) => {
                    const isMatched = candidateSkills.has(skill.toLowerCase());
                    return (
                      <span
                        key={skill}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                          isMatched
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : 'bg-slate-800/80 border-slate-700/60 text-slate-400'
                        }`}
                      >
                        {isMatched ? '✓ ' : ''}{skill}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Founder/Recruiter Contact & Actions */}
              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>
                    Direct contact: <strong className="text-slate-200">{job.founderName}</strong> ({job.founderRole})
                  </span>
                  <span className="text-[11px] text-slate-500">{job.postedDate}</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => onSelectJobForATS(job)}
                    className="py-2 px-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Auto-Tailor</span>
                  </button>

                  <button
                    onClick={() => onSelectJobForOutreach(job)}
                    className="py-2 px-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold text-white shadow-sm shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Outreach</span>
                  </button>

                  <button
                    onClick={() => onAddToPipeline(job)}
                    disabled={isApplied}
                    className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
                      isApplied
                        ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    {isApplied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{isApplied ? 'In CRM' : 'Queue CRM'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
