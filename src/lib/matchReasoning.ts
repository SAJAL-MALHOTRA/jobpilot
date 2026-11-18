/**
 * Deterministic Opportunity Match Reasoning Engine
 * Inspired by SakshiGaikwad05/startup-finder (MIT License)
 * 
 * Provides honest, human-readable match explanations for every opening:
 * role alignment · skill overlap (including exact missing skills) · location & corridor match · experience fit.
 */

import type { JobListing, CandidateProfile } from '../types';

export interface DetailedMatchAnalysis {
  relevance: 'strong' | 'potential' | 'low' | 'not_relevant';
  matchScore: number;
  badgeLabel: string;
  summaryLine: string;
  matchedSkills: string[];
  missingSkills: string[];
  capReason: string | null;
  experienceCheck: 'pass' | 'partial' | 'under';
  locationCheck: 'exact' | 'corridor' | 'different';
}

export function analyzeJobMatch(job: JobListing, candidate: CandidateProfile): DetailedMatchAnalysis {
  const candidateSkills = [
    ...(candidate.primarySkills || []),
    ...(candidate.secondarySkills || []),
  ].map((s) => s.toLowerCase().trim());

  const requiredSkills = (job.requiredSkills || []).map((s) => s.toLowerCase().trim());

  // 1. Skill Overlap
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const req of requiredSkills) {
    const isMatched = candidateSkills.some(
      (cand) => cand === req || cand.includes(req) || req.includes(cand)
    );
    if (isMatched) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  }

  const skillShare = requiredSkills.length > 0 ? matchedSkills.length / requiredSkills.length : 1;

  // 2. Experience Match
  let experienceCheck: 'pass' | 'partial' | 'under' = 'pass';
  let capReason: string | null = null;

  const expDisplay = job.experienceDisplay || '';
  const expMatch = expDisplay.match(/(\d+)(?:–|-)?(\d+)?\s*(?:years?|yrs?)/i);
  if (expMatch) {
    const minReq = parseInt(expMatch[1], 10);
    if (candidate.yearsOfExperience < minReq - 1) {
      experienceCheck = 'under';
      capReason = `Requires ${minReq}+ years experience while profile has ${candidate.yearsOfExperience}y`;
    } else if (candidate.yearsOfExperience < minReq) {
      experienceCheck = 'partial';
      capReason = `Preferred ${minReq}+ years (profile has ${candidate.yearsOfExperience}y)`;
    }
  }

  // 3. Location Match
  let locationCheck: 'exact' | 'corridor' | 'different' = 'corridor';
  const candLoc = candidate.location.toLowerCase();
  const jobLoc = job.location.toLowerCase();

  if (job.isRemote || jobLoc.includes('remote')) {
    locationCheck = 'exact';
  } else if (candLoc.includes('bengaluru') || candLoc.includes('bangalore')) {
    if (jobLoc.includes('bengaluru') || jobLoc.includes('bangalore')) {
      locationCheck = 'exact';
    }
  } else if (candLoc.includes('pune') && jobLoc.includes('pune')) {
    locationCheck = 'exact';
  }

  // 4. Calculate Final Relevance Tier & Score
  let relevance: 'strong' | 'potential' | 'low' | 'not_relevant' = 'potential';
  let baseScore = Math.round(skillShare * 70 + (experienceCheck === 'pass' ? 20 : 10) + (locationCheck === 'exact' ? 10 : 5));

  if (capReason && experienceCheck === 'under') {
    baseScore = Math.min(baseScore, 68);
  }

  if (baseScore >= 80 && skillShare >= 0.7) {
    relevance = 'strong';
  } else if (baseScore >= 65 && skillShare >= 0.4) {
    relevance = 'potential';
  } else {
    relevance = 'low';
  }

  // Override with curated atsMatchScore if available for consistency
  const matchScore = job.atsMatchScore || baseScore;

  // 5. Build Badges & Summary Line (startup-finder format)
  const badgeLabel = 
    relevance === 'strong' ? 'Great match' :
    relevance === 'potential' ? 'Good match' :
    'Lower match';

  const skillSummary = requiredSkills.length > 0
    ? `You have ${matchedSkills.length} of ${requiredSkills.length} skills${missingSkills.length > 0 ? ` (missing ${missingSkills.slice(0, 2).join(', ')}${missingSkills.length > 2 ? '…' : ''})` : ''}`
    : 'Skills align with profile';

  const roleSummary = job.roleCategory ? `${job.roleCategory} role` : `${job.title} role`;
  const locationSummary = job.isRemote ? 'Remote flexible' : job.bangaloreCluster || job.location;

  const parts = [roleSummary, skillSummary, locationSummary];
  const summaryLine = (capReason ? `${capReason}. ` : '') + parts.join(' · ');

  return {
    relevance,
    matchScore,
    badgeLabel,
    summaryLine,
    matchedSkills,
    missingSkills,
    capReason,
    experienceCheck,
    locationCheck,
  };
}
