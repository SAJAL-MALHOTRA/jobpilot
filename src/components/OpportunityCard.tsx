import React from 'react';
import type { JobListing, CandidateProfile } from '../types';
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

// Distinct, purposeful dark badge colors for each startup brand
function getCompanyBrandStyle(company: string): { bg: string; text: string; border: string } {
  const c = company.toLowerCase();
  if (c.includes('cognitive') || c.includes('prayog')) return { bg: 'bg-orange-950/40', text: 'text-orange-400', border: 'border-orange-800/40' };
  if (c.includes('mosaic') || c.includes('kestrel')) return { bg: 'bg-indigo-950/40', text: 'text-indigo-400', border: 'border-indigo-800/40' };
  if (c.includes('meridian') || c.includes('aarna')) return { bg: 'bg-rose-950/40', text: 'text-rose-400', border: 'border-rose-800/40' };
  if (c.includes('vidyut')) return { bg: 'bg-amber-950/40', text: 'text-amber-400', border: 'border-amber-800/40' };
  if (c.includes('willow') || c.includes('kavach')) return { bg: 'bg-emerald-950/40', text: 'text-emerald-400', border: 'border-emerald-800/40' };
  if (c.includes('ironvale')) return { bg: 'bg-red-950/40', text: 'text-red-400', border: 'border-red-800/40' };
  return { bg: 'bg-blue-950/40', text: 'text-blue-400', border: 'border-blue-800/40' };
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
  // Deterministic matching against candidate skills
  const candidateSkillsSet = new Set(
    [...candidate.primarySkills, ...candidate.secondarySkills].map((s) => s.toLowerCase().trim())
  );
  
  const matchedSkills = job.requiredSkills.filter((skill) =>
    candidateSkillsSet.has(skill.toLowerCase().trim())
  );
  const missingSkills = job.requiredSkills.filter(
    (skill) => !candidateSkillsSet.has(skill.toLowerCase().trim())
  );
  
  // Show up to 2 matched and 2 missing skills for actionable gap analysis
  const displayMatched = matchedSkills.slice(0, 2);
  const displayMissing = missingSkills.slice(0, 2);

  // Score Tier & Visual Gauge
  const score = job.atsMatchScore || 70;
  const matchTierLabel = score >= 85 ? 'Exceptional Match' : score >= 80 ? 'Strong Match' : 'Good Match';
  const matchColor = score >= 80 ? '#34D399' : '#818CF8';

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
          ? 'bg-[#1D2230] border-[#818CF8] ring-1 ring-[#818CF8]/40 shadow-md'
          : 'bg-[#171A23] border-[#292E3B] hover:bg-[#1A1E29] hover:border-[#3E4558]'
      }`}
    >
      <div className="space-y-3">
        {/* 1. Header: Role Title & Distinct Company Brand */}
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
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#A1A8B8] mt-0.5">
              <span className="font-medium text-[#D1D5DB]">{job.company}</span>
              {stageDisplay && (
                <>
                  <span className="text-[#4B5563]">·</span>
                  <span className="flex items-center gap-1 text-[#9CA3AF]">
                    {isYcVerified && <Flame className="w-3 h-3 text-[#FBBF24] shrink-0" />}
                    <span>{stageDisplay}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 2. Primary Visual Anchor: Prominent Salary & Equity */}
        <div className="flex items-baseline justify-between gap-2 pt-0.5 pb-0.5 border-y border-[#222634]">
          <div>
            <span className="text-base sm:text-lg font-bold text-[#F3F4F6] tracking-tight">
              {job.salaryDisplay || `₹${job.minCtcLpa}–${job.maxCtcLpa} LPA`}
            </span>
            {job.equityRange && !job.equityRange.toLowerCase().includes('none') && (
              <span className="ml-2 text-xs font-medium text-[#A1A8B8]">
                · {job.equityRange} Equity
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-[#8E95A5] shrink-0">
            <MapPin className="w-3.5 h-3.5 text-[#737C90] shrink-0" />
            <span className="truncate max-w-[130px]">{job.bangaloreCluster || job.location}</span>
          </div>
        </div>

        {/* 3. Match Intelligence: Visual Score Gauge & Explanation */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span 
                className="font-bold text-sm"
                style={{ color: matchColor }}
              >
                {score}%
              </span>
              <span className="text-xs font-medium text-[#D1D5DB]">
                {matchTierLabel}
              </span>
            </div>
            <span className="text-[11px] text-[#8E95A5]">
              {matchedSkills.length} of {job.requiredSkills.length} skills matched
            </span>
          </div>

          {/* Progress Bar Gauge */}
          <div className="w-full h-1.5 rounded-full bg-[#1F2432] overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min(100, Math.max(10, score))}%`,
                backgroundColor: matchColor
              }}
            />
          </div>
        </div>

        {/* 4. Actionable Skill Analysis: Matched vs Missing Gaps */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          {displayMatched.map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 rounded text-xs font-medium text-[#34D399] bg-[#34D399]/10 border border-[#34D399]/20 flex items-center gap-1"
              title="Matched skill in your profile"
            >
              <Check className="w-2.5 h-2.5 stroke-[2.5]" />
              <span>{skill}</span>
            </span>
          ))}

          {displayMissing.map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 rounded text-xs font-medium text-[#8E95A5] bg-[#141722] border border-[#292E3B] border-dashed flex items-center gap-1"
              title="Skill gap: missing from profile"
            >
              <span>+</span>
              <span>{skill}</span>
            </span>
          ))}

          {job.requiredSkills.length > 4 && (
            <span className="text-[11px] text-[#737C90] px-1 font-medium">
              +{job.requiredSkills.length - 4} more
            </span>
          )}
        </div>

        {/* 5. Direct Founder Reach */}
        <div className="flex items-center justify-between text-xs text-[#8E95A5] pt-0.5">
          <div className="flex items-center gap-1.5 truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-[#818CF8] shrink-0" />
            <span className="truncate">
              Direct Reach: <strong className="font-semibold text-[#F3F4F6]">{job.founderName || 'Founding Team'}</strong>
            </span>
          </div>
          <span className="text-[11px] text-[#6B7280] shrink-0">
            {job.postedDate}
          </span>
        </div>
      </div>

      {/* 6. Clean Actions: 1 Primary, 1 Secondary, Subtle Details */}
      <div 
        className="pt-2.5 border-t border-[#222634] flex items-center justify-between gap-2 mt-1"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          {/* Primary Action */}
          <button
            onClick={() => onOpenPitch(job)}
            className="px-3.5 py-1.5 rounded-lg bg-[#818CF8] hover:bg-[#9FA8FF] text-[#0F1117] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            title="Compose direct cold email to founder"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Contact Founder</span>
          </button>

          {/* Secondary Action: Save / Saved */}
          <button
            onClick={() => onAddToPipeline(job)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isTracked
                ? 'bg-[#1D2230] border-[#818CF8] text-[#818CF8] font-semibold'
                : 'bg-[#171A23] hover:bg-[#1D2230] border-[#292E3B] text-[#A1A8B8] hover:text-[#F3F4F6]'
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
          className="text-xs font-medium text-[#A1A8B8] hover:text-[#F3F4F6] flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-[#1D2230]"
          title="Open complete opportunity drawer"
        >
          <span>Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
