import React from 'react';
import type { JobListing, CandidateProfile } from '../types';
import { 
  MapPin, 
  Send, 
  BookmarkPlus, 
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Check
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
      className={`group rounded-xl border p-4 text-left transition-all duration-150 flex flex-col justify-between gap-3 cursor-pointer outline-none ${
        isSelected
          ? 'bg-[#1D2230] border-[#818CF8] ring-1 ring-[#818CF8]/40 shadow-md'
          : 'bg-[#171A23] border-[#292E3B] hover:bg-[#1D2230] hover:border-[#3E4558]'
      }`}
    >
      <div className="space-y-2.5">
        {/* 1. Role title and company */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-start gap-2.5 min-w-0">
            <div 
              className="w-8 h-8 rounded-lg bg-[#1D2230] border border-[#292E3B] flex items-center justify-center font-bold text-xs text-[#F3F4F6] shrink-0 group-hover:border-[#3E4558] transition-colors"
              title={`${job.company} logo`}
            >
              {job.company.charAt(0)}
            </div>
            <div className="min-w-0">
              {/* Never truncate role titles */}
              <h3 className="font-semibold text-sm sm:text-[15px] text-[#F3F4F6] leading-snug break-words">
                {job.title}
              </h3>
              <p className="text-xs font-medium text-[#A1A8B8] mt-0.5">
                {job.company}
              </p>
            </div>
          </div>

          {/* 2. Company stage or YC batch (when verified) */}
          {stageDisplay && (
            <span 
              className={`px-2 py-0.5 rounded text-[11px] font-mono shrink-0 border ${
                isYcVerified
                  ? 'bg-[#FBBF24]/10 border-[#FBBF24]/30 text-[#FBBF24]'
                  : 'bg-[#1D2230] border-[#292E3B] text-[#A1A8B8]'
              }`}
              title={isYcVerified ? 'Verified Y Combinator Batch' : 'Verified Funding Stage'}
            >
              {stageDisplay}
            </span>
          )}
        </div>

        {/* 3. Location and working arrangement */}
        <div className="flex items-center gap-1.5 text-xs text-[#737C90]">
          <MapPin className="w-3.5 h-3.5 text-[#737C90] shrink-0" />
          <span className="truncate">{job.bangaloreCluster || job.location}</span>
          <span className="text-[#737C90]/60">·</span>
          <span className="shrink-0">{job.isRemote ? 'Remote Friendly' : 'In-Office'}</span>
        </div>

        {/* 4. Compensation and equity (Consolidated compact row) */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono font-semibold text-[#F3F4F6]">
            {compensationDisplay}
          </span>
          {hasEquity && (
            <>
              <span className="text-[#737C90]">·</span>
              <span className="font-mono text-[#A1A8B8]">
                {job.equityRange} Equity
              </span>
            </>
          )}
        </div>

        {/* 5. Candidate match score with explanation */}
        <div className="flex items-center gap-2 text-xs">
          <span 
            className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#34D399]/10 border border-[#34D399]/30 text-[#34D399]"
            title="Deterministic ATS skill match score"
          >
            {job.atsMatchScore || 70}% match
          </span>
          <span className="text-[11px] text-[#737C90] truncate">
            {matchedSkills.length} of {job.requiredSkills.length} required skills matched
          </span>
        </div>

        {/* 6. Two or three strongest matching skills as lightweight chips */}
        {topMatchedSkills.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {topMatchedSkills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded text-[11px] font-mono text-[#34D399] bg-[#34D399]/10 border border-[#34D399]/20 flex items-center gap-1"
              >
                <Check className="w-2.5 h-2.5" />
                <span>{skill}</span>
              </span>
            ))}
            {remainingSkillsCount > 0 && (
              <span className="text-[11px] font-mono text-[#737C90] px-1">
                +{remainingSkillsCount} more
              </span>
            )}
          </div>
        )}

        {/* 7. Founder contact availability */}
        <div className="flex items-center justify-between gap-2 text-xs text-[#737C90] pt-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <ShieldCheck className="w-3.5 h-3.5 text-[#818CF8] shrink-0" />
            <span className="truncate">
              Direct Reach: <strong className="font-medium text-[#F3F4F6]">{job.founderName || 'Founding Team'}</strong> ({job.founderRole || 'Direct Channel'})
            </span>
          </div>
          {job.contactConfidence && (
            <span 
              className="text-[10px] font-mono text-[#34D399] shrink-0 hidden sm:inline"
              title="Verified outreach channel"
            >
              Verified
            </span>
          )}
        </div>
      </div>

      {/* 8. Save, Contact and Details actions */}
      <div 
        className="pt-2.5 border-t border-[#292E3B] flex items-center justify-between gap-2 mt-1"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenPitch(job)}
            className="px-3 py-1.5 rounded-lg bg-[#818CF8] hover:bg-[#9FA8FF] text-[#0F1117] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            title="Compose direct pitch to founder"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Contact</span>
          </button>

          <button
            onClick={() => onAddToPipeline(job)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isTracked
                ? 'bg-[#1D2230] border-[#818CF8] text-[#818CF8]'
                : 'bg-[#171A23] hover:bg-[#1D2230] border-[#292E3B] text-[#A1A8B8] hover:text-[#F3F4F6]'
            }`}
            title={isTracked ? 'Tracked in your pipeline CRM' : 'Save to pipeline'}
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span>{isTracked ? 'Saved' : '+ Save'}</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onDirectApply(job)}
            className="p-1.5 rounded-lg text-[#737C90] hover:text-[#F3F4F6] hover:bg-[#1D2230] transition-colors"
            title="Open company application or careers page"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onSelect(job)}
            className="text-xs font-medium text-[#A1A8B8] hover:text-[#F3F4F6] flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-[#1D2230]"
            title="Open opportunity inspector drawer"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
