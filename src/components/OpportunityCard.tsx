import React from 'react';
import type { JobListing, CandidateProfile } from '../types';
import { 
  MapPin, 
  Send, 
  BookmarkPlus, 
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Check,
  Flame,
  CheckCircle2
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
  // Deterministic matching against candidate skills
  const candidateSkillsSet = new Set(
    [...candidate.primarySkills, ...candidate.secondarySkills].map((s) => s.toLowerCase().trim())
  );
  
  const matchedSkills = job.requiredSkills.filter((skill) =>
    candidateSkillsSet.has(skill.toLowerCase().trim())
  );
  
  // Show 2 or 3 strongest matching skills
  const topMatchedSkills = matchedSkills.slice(0, 3);
  const remainingSkillsCount = matchedSkills.length > 3 ? matchedSkills.length - 3 : 0;

  // Verified stage or YC batch
  const isYcVerified = job.source.includes('YC');
  const stageDisplay = isYcVerified 
    ? job.source 
    : (job.fundingRound && job.fundingRound !== 'Undisclosed' ? job.fundingRound : null);

  // Consolidated compensation & equity
  const compensationDisplay = job.salaryDisplay || (job.minCtcLpa && job.maxCtcLpa ? `₹${job.minCtcLpa}–${job.maxCtcLpa} LPA` : 'Undisclosed');
  const hasEquity = job.equityRange && !job.equityRange.toLowerCase().includes('none');

  // Handle keyboard activation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(job);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(job)}
      onKeyDown={handleKeyDown}
      className={`group rounded-2xl border p-4 sm:p-4.5 text-left transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between gap-3 cursor-pointer outline-none active:scale-[0.99] ${
        isSelected
          ? 'bg-white dark:bg-[#1D2230] border-indigo-500 dark:border-[#818CF8] ring-2 ring-indigo-500/20 dark:ring-[#818CF8]/40 shadow-lg shadow-indigo-500/5'
          : 'bg-white dark:bg-[#171A23] border-slate-200/80 dark:border-[#292E3B] shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] hover:border-slate-300 dark:hover:border-[#3E4558] hover:-translate-y-0.5'
      }`}
    >
      <div className="space-y-2.5">
        {/* 1. Role title and company (iPhone squircle icon style) */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-start gap-3 min-w-0">
            <div 
              className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-blue-500/10 border border-slate-200/80 dark:border-[#292E3B] flex items-center justify-center font-bold text-sm text-indigo-600 dark:text-[#818CF8] shadow-xs shrink-0 group-hover:scale-105 transition-transform duration-200"
              title={`${job.company} logo`}
            >
              {job.company.charAt(0)}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-[15px] sm:text-base text-slate-900 dark:text-[#F3F4F6] leading-snug break-words tracking-tight">
                {job.title}
              </h3>
              <p className="text-xs font-medium text-slate-500 dark:text-[#A1A8B8] mt-0.5">
                {job.company}
              </p>
            </div>
          </div>

          {/* 2. Company stage or YC batch (when verified) */}
          {stageDisplay && (
            <span 
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium shrink-0 border flex items-center gap-1 shadow-xs ${
                isYcVerified
                  ? 'bg-amber-50 dark:bg-[#FBBF24]/10 border-amber-200/80 dark:border-[#FBBF24]/30 text-amber-700 dark:text-[#FBBF24]'
                  : 'bg-slate-100 dark:bg-[#1D2230] border-slate-200/80 dark:border-[#292E3B] text-slate-600 dark:text-[#A1A8B8]'
              }`}
              title={isYcVerified ? 'Verified Y Combinator Batch' : 'Verified Funding Stage'}
            >
              {isYcVerified && <Flame className="w-3 h-3 text-amber-500 shrink-0" />}
              <span>{stageDisplay}</span>
            </span>
          )}
        </div>

        {/* 3. Location and working arrangement */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#737C90]">
          <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-[#737C90] shrink-0" strokeWidth={2.2} />
          <span className="truncate">{job.bangaloreCluster || job.location}</span>
          <span className="text-slate-300 dark:text-[#737C90]/60">·</span>
          <span className="shrink-0">{job.isRemote ? 'Remote Friendly' : 'In-Office'}</span>
        </div>

        {/* 4. Compensation and equity (Consolidated compact row) */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono font-bold text-slate-900 dark:text-[#F3F4F6]">
            {compensationDisplay}
          </span>
          {hasEquity && (
            <>
              <span className="text-slate-300 dark:text-[#737C90]">·</span>
              <span className="font-mono text-slate-600 dark:text-[#A1A8B8] font-medium">
                {job.equityRange} Equity
              </span>
            </>
          )}
        </div>

        {/* 5. Candidate match score with explanation */}
        <div className="flex items-center gap-2 text-xs">
          <span 
            className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-emerald-50 dark:bg-[#34D399]/10 border border-emerald-200/80 dark:border-[#34D399]/30 text-emerald-700 dark:text-[#34D399] flex items-center gap-1 shadow-xs"
            title="Deterministic ATS skill match score"
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-[#34D399]" />
            <span>{job.atsMatchScore || 70}% match</span>
          </span>
          <span className="text-[11px] text-slate-500 dark:text-[#737C90] truncate">
            {matchedSkills.length} of {job.requiredSkills.length} required skills matched
          </span>
        </div>

        {/* 6. Two or three strongest matching skills as lightweight chips */}
        {topMatchedSkills.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {topMatchedSkills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium text-emerald-700 dark:text-[#34D399] bg-emerald-50/80 dark:bg-[#34D399]/10 border border-emerald-200/60 dark:border-[#34D399]/20 flex items-center gap-1 shadow-xs"
              >
                <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                <span>{skill}</span>
              </span>
            ))}
            {remainingSkillsCount > 0 && (
              <span className="text-[11px] font-mono text-slate-400 dark:text-[#737C90] px-1">
                +{remainingSkillsCount} more
              </span>
            )}
          </div>
        )}

        {/* 7. Founder contact availability (iPhone Control Center mini icon) */}
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-[#737C90] pt-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-5 h-5 rounded-md bg-indigo-50 dark:bg-[#818CF8]/10 text-indigo-600 dark:text-[#818CF8] flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 stroke-[2.2]" />
            </div>
            <span className="truncate">
              Direct Reach: <strong className="font-semibold text-slate-900 dark:text-[#F3F4F6]">{job.founderName || 'Founding Team'}</strong> ({job.founderRole || 'Direct Channel'})
            </span>
          </div>
          {job.contactConfidence && (
            <span 
              className="text-[10px] font-mono font-medium text-emerald-600 dark:text-[#34D399] shrink-0 hidden sm:inline"
              title="Verified outreach channel"
            >
              Verified
            </span>
          )}
        </div>
      </div>

      {/* 8. Save, Contact and Details actions (Smooth tactile buttons) */}
      <div 
        className="pt-2.5 border-t border-slate-100 dark:border-[#292E3B] flex items-center justify-between gap-2 mt-1"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenPitch(job)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:scale-[0.96] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-indigo-500/25 transition-all duration-150"
            title="Compose direct pitch to founder"
          >
            <Send className="w-3.5 h-3.5" strokeWidth={2.2} />
            <span>Contact</span>
          </button>

          <button
            onClick={() => onAddToPipeline(job)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all duration-150 active:scale-[0.96] ${
              isTracked
                ? 'bg-indigo-50 dark:bg-[#1D2230] border-indigo-200 dark:border-[#818CF8] text-indigo-600 dark:text-[#818CF8] font-semibold'
                : 'bg-slate-100 hover:bg-slate-200/70 dark:bg-[#171A23] dark:hover:bg-[#1D2230] border-slate-200/80 dark:border-[#292E3B] text-slate-700 dark:text-[#A1A8B8] hover:text-slate-900 dark:hover:text-[#F3F4F6]'
            }`}
            title={isTracked ? 'Tracked in your pipeline CRM' : 'Save to pipeline'}
          >
            <BookmarkPlus className="w-3.5 h-3.5" strokeWidth={2.2} />
            <span>{isTracked ? 'Saved' : '+ Save'}</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onDirectApply(job)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 dark:text-[#737C90] dark:hover:text-[#F3F4F6] dark:hover:bg-[#1D2230] transition-colors"
            title="Open company application or careers page"
          >
            <ExternalLink className="w-3.5 h-3.5" strokeWidth={2.2} />
          </button>

          <button
            onClick={() => onSelect(job)}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-[#A1A8B8] dark:hover:text-[#F3F4F6] flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1D2230]"
            title="Open opportunity inspector drawer"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </div>
  );
};
