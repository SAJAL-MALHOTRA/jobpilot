import React from 'react';
import type { JobListing, CandidateProfile } from '../types';
import { getCompanyBrandStyle } from '../lib/jobRadarEngine';
import { analyzeJobMatch } from '../lib/matchReasoning';
import { 
  MapPin, 
  Send, 
  Bookmark, 
  BookmarkCheck,
  ArrowRight,
  ShieldCheck,
  Check,
  CheckCircle2,
  Info
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
  // Deterministic matching & Startup-Finder style reasoning
  const matchAnalysis = analyzeJobMatch(job, candidate);

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

  // Company Brand Color
  const brand = getCompanyBrandStyle(job.company);

  // Verified stage display
  const isYcVerified = job.source.includes('YC');
  const stageDisplay = isYcVerified ? job.source : job.fundingRound;

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
      className={`group relative rounded-xl border p-4 sm:p-5 text-left transition-colors flex flex-col justify-between gap-4 cursor-pointer outline-none ${
        isSelected
          ? 'bg-blue-50/50 dark:bg-[#161a24] border-blue-600 dark:border-blue-500 ring-1 ring-blue-600/30'
          : 'bg-white dark:bg-[#121316] border-neutral-200/90 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-xs'
      }`}
    >
      <div className="space-y-3.5">
        {/* 1. Header: Avatar & Role Identity */}
        <div className="flex items-start gap-3 min-w-0">
          <div 
            className={`w-10 h-10 rounded-lg ${brand.bg || 'bg-neutral-900'} flex items-center justify-center font-semibold text-white text-sm shrink-0 font-mono`}
            title={`${job.company} avatar`}
          >
            {job.company.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-neutral-100 leading-snug break-words group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {job.title}
            </h3>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              <span className="font-medium text-neutral-800 dark:text-neutral-200">{job.company}</span>
              {stageDisplay && (
                <>
                  <span className="text-neutral-300 dark:text-neutral-600">•</span>
                  <span className="font-mono text-neutral-600 dark:text-neutral-400">
                    {stageDisplay}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 2. Visual Anchor: Salary & Location */}
        <div className="flex items-baseline justify-between gap-2 py-2 px-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800">
          <div className="font-mono tabular-nums">
            <span className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100">
              {job.salaryDisplay || `₹${job.minCtcLpa}–${job.maxCtcLpa} LPA`}
            </span>
            {job.equityRange && !job.equityRange.toLowerCase().includes('none') && (
              <span className="ml-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                · {job.equityRange}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 shrink-0 font-mono">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate max-w-[120px]">{job.bangaloreCluster || job.location}</span>
          </div>
        </div>

        {/* 3. Explainable Candidate Fit & Skills (startup-finder format) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                matchAnalysis.relevance === 'strong'
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${matchAnalysis.relevance === 'strong' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span>{matchAnalysis.badgeLabel}</span>
                <span className="tabular-nums font-bold">{matchAnalysis.matchScore}%</span>
              </span>

              <span className="text-[11px] text-neutral-400">
                ({matchedSkills.length}/{job.requiredSkills.length} matched)
              </span>
            </div>
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
              {job.experienceDisplay || 'Mid Level'}
            </span>
          </div>

          {/* Skill Chips */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono">
            {displayMatched.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1"
                title="Matched skill verified in candidate profile"
              >
                <Check className="w-3 h-3 stroke-[2.5]" />
                <span>{skill}</span>
              </span>
            ))}

            {displayMissing.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded text-[11px] font-medium text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 border border-dashed border-neutral-300 dark:border-neutral-700 flex items-center gap-1"
                title="Requirement missing from candidate profile"
              >
                <span>+</span>
                <span>{skill}</span>
              </span>
            ))}

            {job.requiredSkills.length > 4 && (
              <span className="text-[11px] text-neutral-400 px-1">
                +{job.requiredSkills.length - 4} more
              </span>
            )}
          </div>

          {/* Transparent Match Reason Line */}
          <div className={`text-[11px] font-mono leading-relaxed flex items-start gap-1.5 pt-0.5 ${
            matchAnalysis.capReason ? 'text-amber-700 dark:text-amber-400' : 'text-neutral-600 dark:text-neutral-400'
          }`}>
            {matchAnalysis.capReason ? (
              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-80 text-amber-500" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-80 text-emerald-500" />
            )}
            <span className="line-clamp-2">{matchAnalysis.summaryLine}</span>
          </div>
        </div>

        {/* 4. Founder Reach Banner */}
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 pt-1 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-1.5 truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">
              Direct: <strong className="font-semibold text-neutral-800 dark:text-neutral-200">{job.founderName || 'Founding Team'}</strong>
            </span>
          </div>
          <span className="text-[11px] text-neutral-400 shrink-0 font-mono">
            {job.postedDate}
          </span>
        </div>
      </div>

      {/* 5. Restrained Tactile Actions */}
      <div 
        className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          {/* Primary Action */}
          <button
            onClick={() => onOpenPitch(job)}
            className="px-3.5 py-1.5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-[#EBF946] dark:text-black dark:hover:bg-[#d4e23f] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            title="Compose personalized outreach to founder"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Contact Founder</span>
          </button>

          {/* Secondary Action: Save */}
          <button
            onClick={() => onAddToPipeline(job)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isTracked
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400'
                : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
            }`}
            title={isTracked ? 'Saved in pipeline CRM' : 'Save opportunity to pipeline'}
          >
            {isTracked ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
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
          className="text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
          title="Open complete opportunity dossier"
        >
          <span>Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
