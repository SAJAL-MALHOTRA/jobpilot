export interface CandidateProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  headline: string;
  yearsOfExperience: number;
  currentCompany: string;
  targetRoles: string[];
  primarySkills: string[];
  secondarySkills: string[];
  minTargetCtcLpa: number;
  locationPreference: 'Remote' | 'Bangalore' | 'Hybrid / Flexible' | 'Delhi-NCR';
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  resumeBullets: {
    id: string;
    role: string;
    company: string;
    text: string;
    keywords: string[];
  }[];
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  logoColor: string;
  location: string;
  isRemote: boolean;
  source: 'YC W24' | 'YC S24' | 'Wellfound' | 'LinkedIn' | 'Instahyre';
  minCtcLpa: number;
  maxCtcLpa: number;
  equityRange: string;
  requiredSkills: string[];
  description: string;
  postedDate: string;
  founderName: string;
  founderRole: string;
  founderEmail: string;
  founderLinkedin?: string;
  founderTwitter?: string;
  hiringUrgency: 'Immediate' | 'High' | 'Normal';
  atsMatchScore?: number;
  // Explee-grade prospecting & enrichment attributes
  emailDeliverabilityPct?: number;
  fundingRound?: string;
  bangaloreCluster?: string;
  noticeBuyoutCovered?: boolean;
}

export interface ATSMatchResult {
  overallScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  tailoredBullets: {
    id: string;
    original: string;
    tailored: string;
    addedKeywords: string[];
    reasoning: string;
  }[];
  strengthAnalysis: string;
  weaknessAnalysis: string;
}

export type OutreachTemplateType =
  | 'FOUNDER_STARTUP'
  | 'INTERNSHIP_JUNIOR'
  | 'PEER_REFERRAL'
  | 'FREELANCE_PROPOSAL'
  | 'LINKEDIN_X_DM'
  | 'FOLLOW_UP_NUDGE';

export interface ColdOutreach {
  id: string;
  jobId: string;
  style: OutreachTemplateType;
  templateTitle: string;
  bestFor: string;
  subject: string;
  body: string;
  recipient: string;
  formulaBreakdown: {
    context: string;
    relevance: string;
    proof: string;
    smallAsk: string;
  };
}

export type KanbanStatus =
  | 'DISCOVERED'
  | 'TAILORED'
  | 'OUTREACH_SENT'
  | 'INTERVIEW_SCHEDULED'
  | 'OFFER';

export interface ApplicationCard {
  id: string;
  job: JobListing;
  status: KanbanStatus;
  atsScore: number;
  appliedDate?: string;
  followUpDueDate?: string;
  outreachSubject?: string;
  outreachBody?: string;
  notes: string;
}

export interface AgentActivityLog {
  id: string;
  timestamp: string;
  action: string;
  target: string;
  type: 'SCAN' | 'ATS_TAILOR' | 'OUTREACH' | 'CRM_SYNC';
}
