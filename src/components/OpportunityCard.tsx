import React from 'react';
import type { JobListing, CandidateProfile } from '../types';
import { getCompanyBrandStyle } from '../lib/jobRadarEngine';
import { 
  MapPin, 
  Send, 
  Bookmark, 
  BookmarkCheck,
  ArrowRight,
  ShieldCheck,
  Check,
  Flame
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
}) => {
  // Deterministic matching against candidate profile
  const candidateSkillsSet = new Set(
    [...candidate.primarySkills, ...candidate.secondarySkills].map((s) => s.toLowerCase().trim())
  );
  
  const matchedSkills = job.requiredSkills.filter((skill) =>
    candidateSkillsSet.has(skill.toLowerCase().trim())
  );
  const missingSkills = job.requiredSkills.filter(
    (skill) => !candidateSkillsSet.has(skill.toLowerCase().trim())
  );
  
  // High-signal display: up to 2 matched proficiencies and 2 missing requirements
  const displayMatched = matchedSkills.slice(0, 2);
  const displayMissing = missingSkills.slice(0, 2);

  // Match confidence classification based on coverage
  const matchRatio = job.requiredSkills.length > 0 ? matchedSkills.length / job.requiredSkills.length : 0;
  const matchTierLabel = matchRatio >= 0.8 ? 'Strong Alignment' : matchRatio >= 0.6 ? 'Partial Match' : 'Potential Pivot';
  const matchTierColor = matchRatio >= 0.8 ? 'text-[#10B981]' : matchRatio >= 0.6 ? 'text-[#6366F1]' : 'text-[#969BA6]';

  // Company Brand Color
  const brand = getCompanyBrandStyle(job.company);

  // Verified stage display
  const isYcVerified = job.source.includes('YC');
  const stageDisplay = isYcVerified ? job.source : job.fundingRound;

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
      className={`group rounded-xl border p-4 text-left transition-all duration-150 flex flex-col justify-between gap-3.5 cursor-pointer outline-none ${
        isSelected
          ? 'bg-[#1F2228] border-[#6366F1] ring-1 ring-[#6366F1]/30 shadow-md'
          : 'bg-[#17191E] border-[#292C33] hover:bg-[#1B1E24] hover:border-[#3A3E47]'
      }`}
    >
      <div className="space-y-3">
        {/* 1. Header: Role Title & Distinct Startup Identity */}
        <div className="flex items-start gap-3 min-w-0">
          <div 
            className={`w-9 h-9 rounded-lg border ${brand.bg} ${brand.border} ${brand.text} flex items-center justify-center font-bold text-sm shrink-0`}
            title={`${job.company} avatar`}
          >
            {job.company.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-[15px] sm:text-base text-[#F3F4F6] leading-snug break-words group-hover:text-white transition-colors">
              {job.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#969BA6] mt-0.5">
              <span className="font-medium text-[#E5E7EB]">{job.company}</span>
              {stageDisplay && (
                <>
                  <span className="text-[#4B5262]">·</span>
                  <span className="flex items-center gap-1 text-[#969BA6]">
                    {isYcVerified && <Flame className="w-3 h-3 text-[#F59E0B] shrink-0" />}
                    <span>{stageDisplay}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 2. Primary Anchor: High-legibility Salary & Location */}
        <div className="flex items-baseline justify-between gap-2 pt-0.5 pb-0.5 border-y border-[#23262E]">
          <div>
            <span className="text-base sm:text-lg font-bold text-[#F3F4F6] tracking-tight">
              {job.salaryDisplay || `₹${job.minCtcLpa}–${job.maxCtcLpa} LPA`}
            </span>
            {job.equityRange && !job.equityRange.toLowerCase().includes('none') && (
              <span className="ml-2 text-xs font-normal text-[#969BA6]">
                · {job.equityRange} Equity
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-[#969BA6] shrink-0">
            <MapPin className="w-3.5 h-3.5 text-[#6B7280] shrink-0" />
            <span className="truncate max-w-[130px]">{job.bangaloreCluster || job.location}</span>
          </div>
        </div>

        {/* 3. Explainable Candidate Fit (No fake progress bars) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className={`font-semibold ${matchTierColor}`}>
                {matchTierLabel}
              </span>
              <span className="text-[11px] text-[#6B7280]">
                ({matchedSkills.length}/{job.requiredSkills.length} requirements)
              </span>
            </div>
            <span className="text-[11px] text-[#969BA6]">
              {job.experienceDisplay || `${job.minCtcLpa ? '3–6y' : 'Mid'} Exp`}
            </span>
          </div>

          {/* Transparent Skill Ledger: Matched vs Missing Gaps */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {displayMatched.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded text-xs font-medium text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20 flex items-center gap-1"
                title="Matched skill verified in candidate profile"
              >
                <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                <span>{skill}</span>
              </span>
            ))}

            {displayMissing.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded text-xs font-medium text-[#969BA6] bg-[#101114] border border-[#292C33] border-dashed flex items-center gap-1"
                title="Requirement missing from candidate profile"
              >
                <span>+</span>
                <span>{skill}</span>
              </span>
            ))}

            {job.requiredSkills.length > 4 && (
              <span className="text-[11px] text-[#6B7280] px-1 font-medium">
                +{job.requiredSkills.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* 4. Direct Founder Reach */}
        <div className="flex items-center justify-between text-xs text-[#969BA6] pt-0.5">
          <div className="flex items-center gap-1.5 truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-[#6366F1] shrink-0" />
            <span className="truncate">
              Direct Reach: <strong className="font-semibold text-[#F3F4F6]">{job.founderName || 'Founding Team'}</strong>
            </span>
          </div>
          <span className="text-[11px] text-[#6B7280] shrink-0">
            {job.postedDate}
          </span>
        </div>
      </div>

      {/* 5. Restrained Actions: 1 Primary, 1 Secondary, Unobtrusive Details */}
      <div 
        className="pt-2.5 border-t border-[#23262E] flex items-center justify-between gap-2 mt-1"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          {/* Primary Action */}
          <button
            onClick={() => onOpenPitch(job)}
            className="px-3.5 py-1.5 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
            title="Compose personalized outreach to founder"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Contact Founder</span>
          </button>

          {/* Secondary Action: Save / Saved */}
          <button
            onClick={() => onAddToPipeline(job)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isTracked
                ? 'bg-[#1F2228] border-[#6366F1] text-[#818CF8] font-semibold'
                : 'bg-[#17191E] hover:bg-[#1F2228] border-[#292C33] text-[#969BA6] hover:text-[#F3F4F6]'
            }`}
            title={isTracked ? 'Saved in pipeline CRM' : 'Save opportunity to pipeline'}
          >
            {isTracked ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5 text-[#818CF8]" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save</span>
              </>
            )}
          </button>
        </div>

        {/* Details Link */}
        <button
          onClick={() => onSelect(job)}
          className="text-xs font-medium text-[#969BA6] hover:text-[#F3F4F6] flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-[#1F2228]"
          title="Open complete opportunity dossier"
        >
          <span>Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
