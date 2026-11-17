import React from 'react';
import type { JobListing, CandidateProfile } from '../types';
import { 
  Sparkles, 
  MapPin, 
  Send, 
  BookmarkPlus, 
  Flame, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface OpportunityCardProps {
  job: JobListing;
  candidate: CandidateProfile;
  isSelected: boolean;
  isTracked: boolean;
  onSelect: (job: JobListing) => void;
  onAddToPipeline: (job: JobListing) => void;
  onOpenPitch: (job: JobListing) => void;
  onDirectApply: (job: JobListing) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  job,
  candidate,
  isSelected,
  isTracked,
  onSelect,
  onAddToPipeline,
  onOpenPitch,
  onDirectApply,
}) => {
  // Compute matching skills for transparency & trust
  const candidateSkillsSet = new Set(
    [...candidate.primarySkills, ...candidate.secondarySkills].map((s) => s.toLowerCase().trim())
  );
  const matchedSkills = job.requiredSkills.filter((skill) =>
    candidateSkillsSet.has(skill.toLowerCase().trim())
  );
  const missingSkills = job.requiredSkills.filter(
    (skill) => !candidateSkillsSet.has(skill.toLowerCase().trim())
  );

  return (
    <div
      onClick={() => onSelect(job)}
      className={`rounded-2xl border p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4 ${
        isSelected
          ? 'bg-[#181B26] border-[#5E6AD2] shadow-lg shadow-[#5E6AD2]/10 ring-1 ring-[#5E6AD2]/40'
          : 'bg-[#13151F] border-[#222534] hover:border-[#353950] hover:bg-[#161824]'
      }`}
    >
      {/* 1. Header: Company Brand & Opportunity Badges */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-[#1D202E] border border-[#2E334A] flex items-center justify-center font-bold text-white text-sm shadow-sm shrink-0">
            {job.company.charAt(0)}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-base text-white tracking-tight leading-snug truncate group-hover:text-indigo-300">
              {job.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#8E92A8] mt-0.5">
              <span className="font-medium text-[#EDEDED]">{job.company}</span>
              <span>·</span>
              <span className="flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 text-[#71758A] shrink-0" />
                <span>{job.bangaloreCluster || job.location}</span>
              </span>
              <span>·</span>
              <span className="text-[#71758A]">{job.isRemote ? 'Remote Friendly' : 'In-Office'}</span>
            </div>
          </div>
        </div>

        {/* Opportunity Badges */}
        <div className="flex items-center gap-1.5 shrink-0">
          {job.atsMatchScore && job.atsMatchScore >= 80 && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-[11px] font-medium flex items-center gap-1 shadow-sm font-mono">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>{job.atsMatchScore}% Match</span>
            </span>
          )}
          {job.source.includes('YC') && (
            <span className="px-2 py-0.5 rounded-full bg-amber-950/40 border border-amber-700/50 text-amber-300 text-[11px] font-medium flex items-center gap-1 font-mono">
              <Flame className="w-3 h-3 text-amber-400" />
              <span>{job.source}</span>
            </span>
          )}
          {job.noticeBuyoutCovered && (
            <span className="px-2 py-0.5 rounded-full bg-purple-950/40 border border-purple-700/50 text-purple-300 text-[11px] font-medium font-mono">
              Notice Buyout
            </span>
          )}
        </div>
      </div>

      {/* 2. Middle: Compensation & Match Explanation (Trust & Intelligence) */}
      <div className="space-y-3 pt-1">
        {/* Compensation & Stage Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-[#161824] border border-[#222638]">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-[#686C80] font-medium">Compensation:</span>
            <span className="font-semibold text-sm text-[#F0F2F8] font-mono">
              {job.salaryDisplay || `₹${job.minCtcLpa}–${job.maxCtcLpa} LPA`}
            </span>
            {job.equityRange && !job.equityRange.includes('None') && (
              <span className="text-xs text-[#8E92A8] font-sans">
                ({job.equityRange} Equity)
              </span>
            )}
          </div>
          <span className="text-xs text-[#8E92A8] font-medium">
            {job.fundingRound}
          </span>
        </div>

        {/* Why Candidate Matches (Transparent Explanation) */}
        <div className="p-3 rounded-xl bg-[#151722]/60 border border-[#202334] space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-[#9CA0B6] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Why you match:</span>
            </span>
            <span className="text-[#6D7185] font-mono">
              {matchedSkills.length} of {job.requiredSkills.length} skills in your profile
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {matchedSkills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded-md bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-[11px] font-mono flex items-center gap-1"
              >
                <span>✓</span>
                <span>{skill}</span>
              </span>
            ))}
            {missingSkills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded-md bg-[#1B1D28] border border-[#292D3E] text-[#787D94] text-[11px] font-mono"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Founder Verification Contact Note */}
        <div className="flex items-center justify-between text-xs text-[#7B8096] pt-0.5">
          <span className="flex items-center gap-1.5 truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">Direct Founder Reach: <strong className="text-[#EDEDED] font-normal">{job.founderName}</strong> ({job.founderRole})</span>
          </span>
          <span className="text-[11px] font-mono text-[#5E6377] shrink-0">
            {job.postedDate}
          </span>
        </div>
      </div>

      {/* 3. Footer: Clear Human Action Buttons */}
      <div 
        className="pt-3 border-t border-[#202334] flex items-center justify-between gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenPitch(job)}
            className="px-3.5 py-1.5 rounded-lg bg-[#5E6AD2] hover:bg-[#6E7BEA] text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Contact Founder</span>
          </button>

          <button
            onClick={() => onAddToPipeline(job)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isTracked
                ? 'bg-indigo-950/40 border-indigo-800/60 text-indigo-300'
                : 'bg-[#181A24] hover:bg-[#202332] border-[#292D3E] text-[#D0D3E2]'
            }`}
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span>{isTracked ? 'Saved in Pipeline' : '+ Save'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onDirectApply(job)}
            className="p-1.5 rounded-lg text-[#8E92A8] hover:text-white hover:bg-[#1E2130] transition-colors"
            title="Open direct job posting or company careers"
          >
            <ExternalLink className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSelect(job)}
            className="text-xs font-medium text-[#8E92A8] hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-[#1E2130]"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
