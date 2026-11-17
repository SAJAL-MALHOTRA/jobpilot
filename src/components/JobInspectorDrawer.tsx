import React, { useState, useEffect, useMemo } from 'react';
import type { 
  JobListing, 
  CandidateProfile, 
  ApplicationCard, 
  OutreachTemplateType, 
  ATSMatchResult,
  MultiFactorFitReport,
  CompanyDossier
} from '../types';
import { generateColdOutreach } from '../lib/outreachEngine';
import { runATSTailoring } from '../lib/atsTailorEngine';
import { getCompanyDossier, evaluateMultiFactorFit, getCompanyBrandStyle } from '../lib/jobRadarEngine';
import { 
  X, 
  Briefcase, 
  Send, 
  FileText, 
  Copy, 
  Check, 
  ExternalLink, 
  Mail, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  BookmarkPlus,
  Building2,
  Cpu,
  MapPin,
  Banknote
} from 'lucide-react';

interface JobInspectorDrawerProps {
  job: JobListing | null;
  candidate: CandidateProfile;
  onClose: () => void;
  onAddToPipeline: (job: JobListing) => void;
  onDirectApply: (job: JobListing) => void;
  onLogOutreachSent: (job: JobListing, subject: string, body: string) => void;
  isApplied: boolean;
  applicationCard?: ApplicationCard;
  onOpenFullAtsModal: (job: JobListing) => void;
}

export const JobInspectorDrawer: React.FC<JobInspectorDrawerProps> = ({
  job,
  candidate,
  onClose,
  onAddToPipeline,
  onDirectApply,
  onLogOutreachSent,
  isApplied,
  applicationCard,
  onOpenFullAtsModal,
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PITCH' | 'ATS'>('OVERVIEW');
  const [pitchTemplate, setPitchTemplate] = useState<OutreachTemplateType>('FOUNDER_STARTUP');
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedBulletId, setCopiedBulletId] = useState<string | null>(null);
  const [userEditedSubject, setUserEditedSubject] = useState<{ key: string; val: string } | null>(null);
  const [userEditedBody, setUserEditedBody] = useState<{ key: string; val: string } | null>(null);
  const [outreachLogged, setOutreachLogged] = useState(false);

  // Derived company dossier and multi-factor fit report
  const dossier: CompanyDossier = useMemo(() => {
    if (!job) return getCompanyDossier('');
    return job.dossier || getCompanyDossier(job.company);
  }, [job]);

  const fitReport: MultiFactorFitReport = useMemo(() => {
    if (!job) {
      return {
        overallScore: 0,
        alignmentTier: 'Partial Fit',
        technicalFit: { label: '', score: 0, status: 'partial', summary: '', details: [] },
        experienceFit: { label: '', score: 0, status: 'partial', summary: '', details: [] },
        locationFit: { label: '', score: 0, status: 'partial', summary: '', details: [] },
        matchedProficiencies: [],
        missingRequirements: [],
      };
    }
    return evaluateMultiFactorFit(candidate, job);
  }, [candidate, job]);

  // Derived baseline cold outreach
  const generatedPitch = useMemo(() => {
    if (!job) return { subject: '', body: '' };
    return generateColdOutreach(candidate, job, pitchTemplate);
  }, [candidate, job, pitchTemplate]);

  // Active subject and body keyed by job and template
  const currentOutreachKey = `${job?.id || ''}-${pitchTemplate}`;
  const pitchSubject = userEditedSubject?.key === currentOutreachKey ? userEditedSubject.val : generatedPitch.subject;
  const pitchBody = userEditedBody?.key === currentOutreachKey ? userEditedBody.val : generatedPitch.body;
  const isOutreachDispatched = applicationCard?.status === 'OUTREACH_SENT' || outreachLogged;

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && job) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [job, onClose]);

  if (!job) return null;

  const atsResult: ATSMatchResult = runATSTailoring(candidate, job);
  const brand = getCompanyBrandStyle(job.company);

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(`Subject: ${pitchSubject}\n\n${pitchBody}`);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(job.founderEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyBullet = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBulletId(id);
    setTimeout(() => setCopiedBulletId(null), 2000);
  };

  const handleOpenMailClient = () => {
    const mailtoUrl = `mailto:${encodeURIComponent(job.founderEmail)}?subject=${encodeURIComponent(
      pitchSubject
    )}&body=${encodeURIComponent(pitchBody)}`;
    window.open(mailtoUrl, '_blank');
  };

  const handleConfirmDispatched = () => {
    onLogOutreachSent(job, pitchSubject, pitchBody);
    setOutreachLogged(true);
  };

  return (
    <div 
      className="fixed inset-y-0 right-0 z-40 w-full max-w-xl bg-[#17191E] border-l border-[#292C33] shadow-2xl flex flex-col text-[#F3F4F6] font-sans animate-slide-in-right"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-role-title"
    >
      {/* 1. Header Bar */}
      <div className="p-4 border-b border-[#292C33] bg-[#17191E] flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 border ${brand.bg} ${brand.text} ${brand.border}`}>
            {job.company.charAt(0)}
          </div>
          <div className="min-w-0">
            <h2 id="drawer-role-title" className="font-semibold text-sm text-[#F3F4F6] truncate leading-tight">
              {job.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-[#969BA6] mt-0.5">
              <span className="font-medium text-[#F3F4F6] truncate">{job.company}</span>
              <span>·</span>
              <span className="truncate">{job.location}</span>
              <span>·</span>
              <span className="font-mono text-[11px] text-[#818CF8]">{job.fundingRound || 'Funded'}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-[#969BA6] hover:text-[#F3F4F6] hover:bg-[#1F2228] transition-colors"
          title="Close drawer (ESC)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex border-b border-[#292C33] bg-[#101114] px-3 text-xs font-medium">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-3.5 py-2.5 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'OVERVIEW'
              ? 'border-[#6366F1] text-[#F3F4F6] font-semibold'
              : 'border-transparent text-[#969BA6] hover:text-[#F3F4F6]'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Dossier & Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('ATS')}
          className={`px-3.5 py-2.5 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'ATS'
              ? 'border-[#6366F1] text-[#F3F4F6] font-semibold'
              : 'border-transparent text-[#969BA6] hover:text-[#F3F4F6]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Explainable Fit</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#10B981]/15 text-[#34D399] font-semibold border border-[#10B981]/20">
            {fitReport.overallScore}%
          </span>
        </button>

        <button
          onClick={() => setActiveTab('PITCH')}
          className={`px-3.5 py-2.5 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'PITCH'
              ? 'border-[#6366F1] text-[#F3F4F6] font-semibold'
              : 'border-transparent text-[#969BA6] hover:text-[#F3F4F6]'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Founder Outreach</span>
          {isOutreachDispatched && <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />}
        </button>
      </div>

      {/* 3. Main Drawer Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {/* TAB 1: COMPANY DOSSIER & ROLE OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-4">
            {/* Primary Opportunity Anchor Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-lg bg-[#1F2228] border border-[#292C33]">
                <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-semibold flex items-center gap-1">
                  <Banknote className="w-3 h-3 text-[#10B981]" />
                  <span>Compensation & Equity</span>
                </span>
                <span className="font-semibold text-sm text-[#F3F4F6] mt-1 block">
                  {job.salaryDisplay || `₹${job.minCtcLpa}–${job.maxCtcLpa} LPA`}
                </span>
                <span className="text-[11px] text-[#969BA6] mt-0.5 block">{job.equityRange}</span>
              </div>

              <div className="p-3 rounded-lg bg-[#1F2228] border border-[#292C33]">
                <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-semibold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#818CF8]" />
                  <span>Corridor & Setup</span>
                </span>
                <span className="font-medium text-xs text-[#F3F4F6] mt-1 block truncate">
                  {job.bangaloreCluster || job.location}
                </span>
                <span className="text-[11px] text-[#969BA6] mt-0.5 block">
                  {job.isRemote ? 'Remote First' : 'In-Office Collaboration'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#1F2228] border border-[#292C33]">
                <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-semibold flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-[#6366F1]" />
                  <span>Funding & Backers</span>
                </span>
                <span className="font-medium text-xs text-[#F3F4F6] mt-1 block">
                  {dossier.stageRound}
                </span>
                <span className="text-[11px] text-[#969BA6] mt-0.5 block truncate">
                  {dossier.backers.slice(0, 2).join(', ')}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#1F2228] border border-[#292C33]">
                <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#10B981]" />
                  <span>Notice Buyout</span>
                </span>
                <span className={`font-medium text-xs mt-1 block ${job.noticeBuyoutCovered ? 'text-[#34D399]' : 'text-[#969BA6]'}`}>
                  {job.noticeBuyoutCovered ? 'Covered by Startup' : 'Standard 30–60d Notice'}
                </span>
                <span className="text-[11px] text-[#969BA6] mt-0.5 block">Urgency: {job.hiringUrgency}</span>
              </div>
            </div>

            {/* Verified Company Intelligence Dossier */}
            <div className="p-4 rounded-xl bg-[#1F2228] border border-[#292C33] space-y-3.5">
              <div className="flex items-center justify-between border-b border-[#292C33] pb-2.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#969BA6] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#6366F1]" />
                  <span>Company Intelligence Dossier</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101114] border border-[#292C33] text-[#969BA6]">
                  {dossier.glassdoorTrustRating || 'Verified Entity'}
                </span>
              </div>

              {/* Problem Space */}
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-semibold block mb-1">
                  Product Mission & Problem Space
                </span>
                <p className="text-xs text-[#E5E7EB] leading-relaxed">
                  {dossier.problemSpace}
                </p>
              </div>

              {/* Verified Backers */}
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-semibold block mb-1.5">
                  Key Backers & Institutional Capital
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {dossier.backers.map((backer) => (
                    <span 
                      key={backer} 
                      className="px-2 py-0.5 rounded bg-[#101114] border border-[#292C33] text-[11px] text-[#F3F4F6] font-medium"
                    >
                      {backer}
                    </span>
                  ))}
                </div>
              </div>

              {/* Architecture Highlights */}
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#6B7280] font-semibold flex items-center gap-1 mb-1.5">
                  <Cpu className="w-3 h-3 text-[#6366F1]" />
                  <span>Engineering Architecture Highlights</span>
                </span>
                <ul className="space-y-1 text-xs text-[#969BA6]">
                  {dossier.architectureHighlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#6366F1] font-mono text-xs">›</span>
                      <span className="leading-snug">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Engineering Team Scale */}
              <div className="pt-1 text-[11px] text-[#6B7280] flex items-center justify-between border-t border-[#292C33]">
                <span>Engineering Organization: <strong className="text-[#F3F4F6] font-medium">{dossier.teamSize}</strong></span>
                {dossier.foundedYear && <span>Founded: {dossier.foundedYear}</span>}
              </div>
            </div>

            {/* Verified Founder Direct Reach Card */}
            <div className="p-3.5 rounded-xl bg-[#1F2228] border border-[#292C33] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Verified Founder Reach</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10B981]/15 border border-[#10B981]/30 text-[#34D399]">
                  {job.contactConfidence || 'Verified Founder Inbox'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <div>
                  <h4 className="font-semibold text-sm text-[#F3F4F6]">{job.founderName}</h4>
                  <p className="text-[11px] text-[#969BA6]">{job.founderRole} · {job.company}</p>
                </div>
                <button
                  onClick={() => setActiveTab('PITCH')}
                  className="px-3 py-1.5 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3 h-3" />
                  <span>Draft Outreach</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#101114] border border-[#292C33]">
                <div className="flex items-center gap-2 min-w-0">
                  <Mail className="w-3.5 h-3.5 text-[#6B7280] shrink-0" />
                  <span className="font-mono text-xs text-[#F3F4F6] truncate">{job.founderEmail}</span>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="text-xs text-[#818CF8] hover:text-[#9FA8FF] px-2 py-0.5 rounded hover:bg-[#1F2228] transition-colors flex items-center gap-1"
                >
                  {copiedEmail ? <Check className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Role Overview & Tech Stack */}
            <div className="space-y-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                Role Focus & Expectations
              </h3>
              <p className="text-xs leading-relaxed text-[#969BA6] whitespace-pre-line bg-[#1F2228] p-3 rounded-lg border border-[#292C33]">
                {job.description}
              </p>
            </div>

            {/* Required Skills Chips */}
            <div className="space-y-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                Core Technical Stack
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {job.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded bg-[#101114] border border-[#292C33] text-xs text-[#F3F4F6] font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EXPLAINABLE FIT & ATS MATCH */}
        {activeTab === 'ATS' && (
          <div className="space-y-4">
            {/* Top Score Banner */}
            <div className="p-4 rounded-xl bg-[#1F2228] border border-[#292C33] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] block">
                  Deterministic Match Ledger
                </span>
                <span className="text-xl font-bold text-[#F3F4F6] mt-0.5 block">
                  {fitReport.alignmentTier}
                </span>
                <span className="text-xs text-[#969BA6] mt-0.5 block">
                  {fitReport.matchedProficiencies.length} of {job.requiredSkills.length} required proficiencies verified
                </span>
              </div>

              <div className="w-14 h-14 rounded-xl bg-[#101114] border border-[#292C33] flex flex-col items-center justify-center font-mono">
                <span className="text-base font-bold text-[#10B981]">{fitReport.overallScore}%</span>
                <span className="text-[9px] uppercase tracking-wider text-[#6B7280]">Fit</span>
              </div>
            </div>

            {/* 3-Vector Explainable Breakdown */}
            <div className="space-y-2.5">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                3-Factor Alignment Breakdown
              </h3>

              {/* Vector 1: Technical */}
              <div className="p-3 rounded-xl bg-[#1F2228] border border-[#292C33] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-xs text-[#F3F4F6] flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-[#6366F1]" />
                    <span>Technical Proficiency</span>
                  </span>
                  <span className={`text-[11px] font-mono font-medium ${fitReport.technicalFit.status === 'aligned' ? 'text-[#10B981]' : 'text-[#818CF8]'}`}>
                    {fitReport.technicalFit.score}% Match
                  </span>
                </div>
                <p className="text-xs text-[#969BA6] leading-relaxed">
                  {fitReport.technicalFit.summary}
                </p>

                {/* Skill Chips Comparison */}
                <div className="pt-1 flex flex-wrap gap-1.5">
                  {fitReport.matchedProficiencies.map((skill) => (
                    <span key={skill} className="px-2 py-0.5 rounded bg-[#10B981]/15 border border-[#10B981]/30 text-[#34D399] text-xs font-mono flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>{skill}</span>
                    </span>
                  ))}
                  {fitReport.missingRequirements.map((skill) => (
                    <span key={skill} className="px-2 py-0.5 rounded bg-transparent border border-dashed border-[#F59E0B]/50 text-[#FBBF24] text-xs font-mono">
                      + {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Vector 2: Seniority */}
              <div className="p-3 rounded-xl bg-[#1F2228] border border-[#292C33] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-xs text-[#F3F4F6] flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#818CF8]" />
                    <span>Seniority & Experience Fit</span>
                  </span>
                  <span className="text-[11px] font-mono text-[#10B981] font-medium">
                    {fitReport.experienceFit.score}% Alignment
                  </span>
                </div>
                <p className="text-xs text-[#969BA6] leading-relaxed">
                  {fitReport.experienceFit.summary}
                </p>
                <div className="text-[11px] text-[#6B7280] font-mono pt-0.5">
                  Candidate profile: {candidate.yearsOfExperience || 3.5} yrs · Role mandate: {job.experienceDisplay || 'Target window'}
                </div>
              </div>

              {/* Vector 3: Location */}
              <div className="p-3 rounded-xl bg-[#1F2228] border border-[#292C33] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-xs text-[#F3F4F6] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Corridor & Setup Fit</span>
                  </span>
                  <span className="text-[11px] font-mono text-[#10B981] font-medium">
                    {fitReport.locationFit.score}% Alignment
                  </span>
                </div>
                <p className="text-xs text-[#969BA6] leading-relaxed">
                  {fitReport.locationFit.summary}
                </p>
              </div>
            </div>

            {/* Tailored Resume Bullets */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                  Tailored Resume Bullets
                </span>
                <span className="text-[11px] text-[#6B7280]">Click to copy</span>
              </div>

              <div className="space-y-2">
                {atsResult.tailoredBullets.slice(0, 3).map((bullet) => (
                  <div
                    key={bullet.id}
                    onClick={() => handleCopyBullet(bullet.id, bullet.tailored)}
                    className="p-3 rounded-lg bg-[#1F2228] border border-[#292C33] hover:border-[#3A3E47] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs leading-relaxed text-[#E5E7EB]">{bullet.tailored}</p>
                      <button className="text-[#6B7280] group-hover:text-white transition-colors shrink-0 mt-0.5">
                        {copiedBulletId === bullet.id ? (
                          <Check className="w-3.5 h-3.5 text-[#10B981]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#969BA6]">
                      <Sparkles className="w-3 h-3 text-[#6366F1]" />
                      <span>{bullet.reasoning}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Launch Full ATS Lab */}
            <button
              onClick={() => onOpenFullAtsModal(job)}
              className="w-full py-2.5 px-3 rounded-lg bg-[#1F2228] hover:bg-[#262932] border border-[#292C33] text-[#F3F4F6] font-medium text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-[#6366F1]" />
              <span>Open Full ATS Lab (Formatted PDF Export)</span>
            </button>
          </div>
        )}

        {/* TAB 3: FOUNDER OUTREACH COMPOSER */}
        {activeTab === 'PITCH' && (
          <div className="space-y-4">
            {/* Template Selector */}
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] block mb-1.5">
                Outreach Strategy
              </label>
              <select
                value={pitchTemplate}
                onChange={(e) => setPitchTemplate(e.target.value as OutreachTemplateType)}
                className="w-full px-3 py-2 rounded-lg bg-[#1F2228] border border-[#292C33] text-xs text-[#F3F4F6] outline-none font-sans focus:border-[#6366F1]"
              >
                <option value="FOUNDER_STARTUP">Startup Founder Pitch (High-response)</option>
                <option value="PEER_REFERRAL">Engineering Peer Referral</option>
                <option value="INTERNSHIP_JUNIOR">Junior / Intern Pitch (Proof-first)</option>
                <option value="FREELANCE_PROPOSAL">Problem Proposal (Audit & fix)</option>
                <option value="LINKEDIN_X_DM">LinkedIn / X Short DM (&lt;100 words)</option>
                <option value="FOLLOW_UP_NUDGE">3-Day Polite Follow-Up</option>
              </select>
            </div>

            {/* Recipient Indicator */}
            <div className="p-2.5 rounded-lg bg-[#1F2228] border border-[#292C33] flex items-center justify-between">
              <div className="min-w-0">
                <span className="text-[10px] text-[#6B7280] block">To Founder:</span>
                <span className="font-medium text-xs text-[#F3F4F6] truncate block">{job.founderName} ({job.founderEmail})</span>
              </div>
              <button
                onClick={handleCopyEmail}
                className="p-1.5 rounded text-[#969BA6] hover:text-white hover:bg-[#292C33] transition-colors"
                title="Copy email"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Subject Line */}
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] block mb-1">
                Subject Line
              </label>
              <input
                type="text"
                value={pitchSubject}
                onChange={(e) => setUserEditedSubject({ key: currentOutreachKey, val: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#1F2228] border border-[#292C33] text-xs text-[#F3F4F6] font-mono outline-none focus:border-[#6366F1]"
              />
            </div>

            {/* Pitch Body */}
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[#6B7280] block mb-1">
                Pitch Message
              </label>
              <textarea
                rows={9}
                value={pitchBody}
                onChange={(e) => setUserEditedBody({ key: currentOutreachKey, val: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#1F2228] border border-[#292C33] text-xs text-[#E5E7EB] leading-relaxed outline-none font-sans focus:border-[#6366F1]"
              />
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <div className="flex gap-2">
                <button
                  onClick={handleCopyPitch}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#1F2228] hover:bg-[#262932] border border-[#292C33] text-[#F3F4F6] font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedPitch ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPitch ? 'Copied' : 'Copy Pitch'}</span>
                </button>

                <button
                  onClick={handleOpenMailClient}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Open in Mail App</span>
                </button>
              </div>

              <button
                onClick={handleConfirmDispatched}
                className={`w-full py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                  isOutreachDispatched
                    ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#34D399]'
                    : 'bg-[#1F2228] hover:bg-[#262932] border-[#292C33] text-[#969BA6] hover:text-[#F3F4F6]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span>{isOutreachDispatched ? 'Logged in Pipeline as Outreach Dispatched' : 'Confirm Sent (Update Pipeline CRM)'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Bottom Action Footer */}
      <div className="p-3 border-t border-[#292C33] bg-[#17191E] flex items-center gap-2">
        <button
          onClick={() => setActiveTab('PITCH')}
          className="flex-1 py-2 px-3 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Contact Founder</span>
        </button>

        <button
          onClick={() => onAddToPipeline(job)}
          className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
            isApplied
              ? 'bg-[#1F2228] border-[#6366F1] text-[#818CF8] font-semibold'
              : 'bg-[#1F2228] hover:bg-[#262932] border-[#292C33] text-[#969BA6] hover:text-[#F3F4F6]'
          }`}
        >
          <BookmarkPlus className="w-3.5 h-3.5" />
          <span>{isApplied ? `Saved (${applicationCard?.status || 'SAVED'})` : '+ Save to Pipeline'}</span>
        </button>

        <button
          onClick={() => onDirectApply(job)}
          className="p-2 rounded-lg bg-[#1F2228] hover:bg-[#262932] border border-[#292C33] text-[#969BA6] hover:text-[#F3F4F6] transition-colors"
          title="Open career page or Google search"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
