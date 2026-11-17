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
  Flame,
  Sparkles
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
  
  const displayMatched = matchedSkills.slice(0, 2);
  const displayMissing = missingSkills.slice(0, 2);

  // Match confidence classification based on coverage
  const matchRatio = job.requiredSkills.length > 0 ? matchedSkills.length / job.requiredSkills.length : 0;
  const matchPercent = Math.round(matchRatio * 100);
  const isHighMatch = matchRatio >= 0.75;

  // Company Brand Color & Gradient
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
      className={`group relative rounded-2xl border p-5 text-left transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between gap-4 cursor-pointer outline-none ${
        isSelected
          ? 'bg-blue-50/40 dark:bg-[#1F2228] border-blue-500 dark:border-[#6366F1] ring-2 ring-blue-500/20 dark:ring-[#6366F1]/30 shadow-lg -translate-y-0.5'
          : 'bg-white dark:bg-[#17191E] border-slate-200/80 dark:border-[#292C33] hover:border-blue-400/60 dark:hover:border-[#3A3E47] shadow-xs hover:shadow-xl hover:-translate-y-1'
      }`}
    >
      <div className="space-y-3.5">
        {/* 1. Header: Apple Squircle Avatar & Role Identity */}
        <div className="flex items-start gap-3.5 min-w-0">
          <div 
            className={`w-11 h-11 rounded-[14px] bg-gradient-to-br ${brand.gradient} flex items-center justify-center font-bold text-white shadow-md text-base shrink-0 transition-transform duration-300 group-hover:scale-105`}
            title={`${job.company} avatar`}
          >
            {job.company.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-[15px] sm:text-base text-slate-900 dark:text-[#F3F4F6] leading-snug break-words group-hover:text-blue-600 dark:group-hover:text-indigo-400 transition-colors">
              {job.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-[#969BA6] mt-0.5">
              <span className="font-semibold text-slate-800 dark:text-[#E5E7EB]">{job.company}</span>
              {stageDisplay && (
                <>
                  <span className="text-slate-300 dark:text-[#4B5262]">·</span>
                  <span className="inline-flex items-center gap-1 font-medium text-slate-600 dark:text-[#969BA6]">
                    {isYcVerified && <Flame className="w-3 h-3 text-orange-500 shrink-0" />}
                    <span>{stageDisplay}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 2. Visual Anchor: High-Legibility Bold Salary & Location */}
        <div className="flex items-baseline justify-between gap-2 py-2 px-3 rounded-xl bg-slate-50/80 dark:bg-[#121418] border border-slate-100 dark:border-[#23262E]">
          <div>
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-[#F3F4F6] tracking-tight">
              {job.salaryDisplay || `₹${job.minCtcLpa}–${job.maxCtcLpa} LPA`}
            </span>
            {job.equityRange && !job.equityRange.toLowerCase().includes('none') && (
              <span className="ml-1.5 text-xs font-semibold text-blue-600 dark:text-[#818CF8]">
                · {job.equityRange}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-[#969BA6] shrink-0 font-medium">
            <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-[#6B7280] shrink-0" />
            <span className="truncate max-w-[120px]">{job.bangaloreCluster || job.location}</span>
          </div>
        </div>

        {/* 3. Explainable Candidate Fit: Apple Pill Gauge + Skills */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 font-bold text-xs ${isHighMatch ? 'text-emerald-600 dark:text-[#34D399]' : 'text-blue-600 dark:text-[#818CF8]'}`}>
                <Sparkles className="w-3 h-3" />
                <span>{matchPercent}% Fit</span>
              </span>
              <span className="text-[11px] text-slate-400 dark:text-[#6B7280]">
                ({matchedSkills.length}/{job.requiredSkills.length} verified)
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-[#969BA6] bg-slate-100 dark:bg-[#1D2230] px-2 py-0.5 rounded-full">
              {job.experienceDisplay || 'Mid Level'}
            </span>
          </div>

          {/* Transparent Skill Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {displayMatched.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-full text-xs font-semibold text-emerald-700 dark:text-[#34D399] bg-emerald-50 dark:bg-[#10B981]/15 border border-emerald-200/80 dark:border-[#10B981]/30 flex items-center gap-1 transition-transform duration-200 hover:scale-105"
                title="Matched skill verified in candidate profile"
              >
                <Check className="w-3 h-3 stroke-[2.5]" />
                <span>{skill}</span>
              </span>
            ))}

            {displayMissing.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-full text-xs font-semibold text-amber-700 dark:text-[#FBBF24] bg-amber-50/60 dark:bg-transparent border border-dashed border-amber-300 dark:border-[#F59E0B]/50 flex items-center gap-1"
                title="Requirement missing from candidate profile"
              >
                <span>+</span>
                <span>{skill}</span>
              </span>
            ))}

            {job.requiredSkills.length > 4 && (
              <span className="text-[11px] text-slate-400 dark:text-[#6B7280] px-1 font-medium">
                +{job.requiredSkills.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* 4. Founder Reach Banner */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#969BA6] pt-1 border-t border-slate-100 dark:border-[#23262E]">
          <div className="flex items-center gap-1.5 truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-[#6366F1] shrink-0" />
            <span className="truncate">
              Direct Reach: <strong className="font-semibold text-slate-800 dark:text-[#F3F4F6]">{job.founderName || 'Founding Team'}</strong>
            </span>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-[#6B7280] shrink-0 font-medium">
            {job.postedDate}
          </span>
        </div>
      </div>

      {/* 5. Restrained Tactile Actions */}
      <div 
        className="pt-3 border-t border-slate-100 dark:border-[#23262E] flex items-center justify-between gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          {/* Primary Action */}
          <button
            onClick={() => onOpenPitch(job)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-500/25 active:scale-95 transition-all"
            title="Compose personalized outreach to founder"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Contact Founder</span>
          </button>

          {/* Secondary Action: Save */}
          <button
            onClick={() => onAddToPipeline(job)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all ${
              isTracked
                ? 'bg-blue-50 dark:bg-[#1F2228] border-blue-500 dark:border-[#6366F1] text-blue-600 dark:text-[#818CF8]'
                : 'bg-slate-100 hover:bg-slate-200/80 dark:bg-[#17191E] dark:hover:bg-[#1F2228] border-slate-200/80 dark:border-[#292C33] text-slate-700 dark:text-[#969BA6] hover:text-slate-900 dark:hover:text-[#F3F4F6]'
            }`}
            title={isTracked ? 'Saved in pipeline CRM' : 'Save opportunity to pipeline'}
          >
            {isTracked ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5 text-blue-600 dark:text-[#818CF8]" />
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
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-[#969BA6] dark:hover:text-[#F3F4F6] flex items-center gap-1 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1F2228]"
          title="Open complete opportunity dossier"
        >
          <span>Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
