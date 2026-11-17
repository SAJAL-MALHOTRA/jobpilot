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
      className="fixed inset-y-0 right-0 z-40 w-full max-w-xl bg-white/95 dark:bg-[#17191E] backdrop-blur-2xl border-l border-slate-200/80 dark:border-[#292C33] shadow-2xl flex flex-col text-slate-900 dark:text-[#F3F4F6] font-sans animate-slide-in-right"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-role-title"
    >
      {/* 1. Header Bar */}
      <div className="p-4 border-b border-slate-200/80 dark:border-[#292C33] bg-white dark:bg-[#17191E] flex items-center justify-between">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className={`w-11 h-11 rounded-[14px] bg-gradient-to-br ${brand.gradient} flex items-center justify-center font-bold text-white shadow-md text-base shrink-0`}>
            {job.company.charAt(0)}
          </div>
          <div className="min-w-0">
            <h2 id="drawer-role-title" className="font-extrabold text-base text-slate-900 dark:text-[#F3F4F6] truncate leading-tight">
              {job.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#969BA6] mt-0.5">
              <span className="font-semibold text-slate-800 dark:text-[#F3F4F6] truncate">{job.company}</span>
              <span>·</span>
              <span className="truncate">{job.location}</span>
              <span>·</span>
              <span className="font-mono text-[11px] text-blue-600 dark:text-[#818CF8] font-semibold">{job.fundingRound || 'Funded'}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 dark:text-[#969BA6] dark:hover:text-[#F3F4F6] hover:bg-slate-100 dark:hover:bg-[#1F2228] transition-colors"
          title="Close drawer (ESC)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex border-b border-slate-200/80 dark:border-[#292C33] bg-slate-50/80 dark:bg-[#101114] px-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-3.5 py-2.5 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'OVERVIEW'
              ? 'border-blue-600 dark:border-[#6366F1] text-blue-600 dark:text-[#F3F4F6] font-bold'
              : 'border-transparent text-slate-500 dark:text-[#969BA6] hover:text-slate-900 dark:hover:text-[#F3F4F6]'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Dossier & Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('ATS')}
          className={`px-3.5 py-2.5 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'ATS'
              ? 'border-blue-600 dark:border-[#6366F1] text-blue-600 dark:text-[#F3F4F6] font-bold'
              : 'border-transparent text-slate-500 dark:text-[#969BA6] hover:text-slate-900 dark:hover:text-[#F3F4F6]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Explainable Fit</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-[#10B981]/15 text-emerald-700 dark:text-[#34D399] font-bold">
            {fitReport.overallScore}%
          </span>
        </button>

        <button
          onClick={() => setActiveTab('PITCH')}
          className={`px-3.5 py-2.5 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'PITCH'
              ? 'border-blue-600 dark:border-[#6366F1] text-blue-600 dark:text-[#F3F4F6] font-bold'
              : 'border-transparent text-slate-500 dark:text-[#969BA6] hover:text-slate-900 dark:hover:text-[#F3F4F6]'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Founder Outreach</span>
          {isOutreachDispatched && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#34D399]" />}
        </button>
      </div>

      {/* 3. Main Drawer Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
        {/* TAB 1: COMPANY DOSSIER & ROLE OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-4">
            {/* Primary Opportunity Anchor Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-[#1F2228] border border-slate-200/80 dark:border-[#292C33]">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-[#6B7280] font-bold flex items-center gap-1">
                  <Banknote className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Compensation & Equity</span>
                </span>
                <span className="font-extrabold text-sm text-slate-900 dark:text-[#F3F4F6] mt-1 block">
                  {job.salaryDisplay || `₹${job.minCtcLpa}–${job.maxCtcLpa} LPA`}
                </span>
                <span className="text-[11px] font-medium text-blue-600 dark:text-[#818CF8] mt-0.5 block">{job.equityRange}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-[#1F2228] border border-slate-200/80 dark:border-[#292C33]">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-[#6B7280] font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  <span>Corridor & Setup</span>
                </span>
                <span className="font-bold text-xs text-slate-900 dark:text-[#F3F4F6] mt-1 block truncate">
                  {job.bangaloreCluster || job.location}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-[#969BA6] mt-0.5 block">
                  {job.isRemote ? 'Remote First' : 'In-Office Collaboration'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-[#1F2228] border border-slate-200/80 dark:border-[#292C33]">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-[#6B7280] font-bold flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Funding & Backers</span>
                </span>
                <span className="font-bold text-xs text-slate-900 dark:text-[#F3F4F6] mt-1 block">
                  {dossier.stageRound}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-[#969BA6] mt-0.5 block truncate">
                  {dossier.backers.slice(0, 2).join(', ')}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-[#1F2228] border border-slate-200/80 dark:border-[#292C33]">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-[#6B7280] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Notice Buyout</span>
                </span>
                <span className={`font-bold text-xs mt-1 block ${job.noticeBuyoutCovered ? 'text-emerald-600 dark:text-[#34D399]' : 'text-slate-600 dark:text-[#969BA6]'}`}>
                  {job.noticeBuyoutCovered ? 'Covered by Startup' : 'Standard 30–60d Notice'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-[#969BA6] mt-0.5 block">Urgency: {job.hiringUrgency}</span>
              </div>
            </div>

            {/* Verified Company Intelligence Dossier */}
            <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#1F2228] border border-slate-200/80 dark:border-[#292C33] space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-[#292C33] pb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#969BA6] flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-[#6366F1]" />
                  <span>Company Intelligence Dossier</span>
                </span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white dark:bg-[#101114] border border-slate-200 dark:border-[#292C33] text-slate-600 dark:text-[#969BA6]">
                  {dossier.glassdoorTrustRating || 'Verified Entity'}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-[#6B7280] font-bold block mb-1">
                  Product Mission & Problem Space
                </span>
                <p className="text-xs text-slate-700 dark:text-[#E5E7EB] leading-relaxed">
                  {dossier.problemSpace}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-[#6B7280] font-bold block mb-1.5">
                  Institutional Backers
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {dossier.backers.map((backer) => (
                    <span 
                      key={backer} 
                      className="px-2.5 py-0.5 rounded-full bg-white dark:bg-[#101114] border border-slate-200 dark:border-[#292C33] text-xs text-slate-800 dark:text-[#F3F4F6] font-semibold"
                    >
                      {backer}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-[#6B7280] font-bold flex items-center gap-1 mb-1.5">
                  <Cpu className="w-3.5 h-3.5 text-blue-600 dark:text-[#6366F1]" />
                  <span>Architecture Highlights</span>
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-[#969BA6]">
                  {dossier.architectureHighlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-blue-600 dark:text-[#6366F1] font-bold text-xs">›</span>
                      <span className="leading-snug">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 text-xs text-slate-500 dark:text-[#6B7280] flex items-center justify-between border-t border-slate-200/80 dark:border-[#292C33]">
                <span>Team: <strong className="text-slate-800 dark:text-[#F3F4F6] font-semibold">{dossier.teamSize}</strong></span>
                {dossier.foundedYear && <span>Founded {dossier.foundedYear}</span>}
              </div>
            </div>

            {/* Verified Founder Reach Card */}
            <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#1F2228] border border-slate-200/80 dark:border-[#292C33] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#6B7280] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Verified Founder Reach</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-[#10B981]/15 text-emerald-700 dark:text-[#34D399]">
                  {job.contactConfidence || 'Verified Founder Inbox'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-[#F3F4F6]">{job.founderName}</h4>
                  <p className="text-xs text-slate-500 dark:text-[#969BA6]">{job.founderRole} · {job.company}</p>
                </div>
                <button
                  onClick={() => setActiveTab('PITCH')}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 active:scale-95 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Draft Outreach</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#101114] border border-slate-200 dark:border-[#292C33]">
                <div className="flex items-center gap-2 min-w-0">
                  <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-[#6B7280] shrink-0" />
                  <span className="font-mono text-xs text-slate-800 dark:text-[#F3F4F6] truncate">{job.founderEmail}</span>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold px-2 py-0.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1F2228] transition-colors flex items-center gap-1"
                >
                  {copiedEmail ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Role Overview */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#6B7280]">
                Role Focus & Expectations
              </h3>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-[#969BA6] whitespace-pre-line bg-slate-50/80 dark:bg-[#1F2228] p-3.5 rounded-2xl border border-slate-200/80 dark:border-[#292C33]">
                {job.description}
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: EXPLAINABLE FIT */}
        {activeTab === 'ATS' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#1F2228] border border-slate-200/80 dark:border-[#292C33] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#6B7280] block">
                  Deterministic Match Ledger
                </span>
                <span className="text-xl font-black text-slate-900 dark:text-[#F3F4F6] mt-0.5 block">
                  {fitReport.alignmentTier}
                </span>
                <span className="text-xs text-slate-500 dark:text-[#969BA6] mt-0.5 block">
                  {fitReport.matchedProficiencies.length} of {job.requiredSkills.length} required proficiencies verified
                </span>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-white dark:bg-[#101114] border border-slate-200 dark:border-[#292C33] shadow-xs flex flex-col items-center justify-center font-mono">
                <span className="text-base font-black text-emerald-600 dark:text-[#10B981]">{fitReport.overallScore}%</span>
                <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-[#6B7280]">Fit</span>
              </div>
            </div>

            {/* 3 Vectors */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-[#1F2228] border border-slate-200/80 dark:border-[#292C33] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800 dark:text-[#F3F4F6] flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-blue-600 dark:text-[#6366F1]" />
                    <span>Technical Proficiency</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-[#10B981]">
                    {fitReport.technicalFit.score}%
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-[#969BA6] leading-relaxed">
                  {fitReport.technicalFit.summary}
                </p>
                <div className="pt-1 flex flex-wrap gap-1.5">
                  {fitReport.matchedProficiencies.map((skill) => (
                    <span key={skill} className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-[#10B981]/15 border border-emerald-200/80 dark:border-[#10B981]/30 text-emerald-700 dark:text-[#34D399] text-xs font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                      <span>{skill}</span>
                    </span>
                  ))}
                  {fitReport.missingRequirements.map((skill) => (
                    <span key={skill} className="px-2.5 py-1 rounded-full border border-dashed border-amber-300 dark:border-[#F59E0B]/50 text-amber-700 dark:text-[#FBBF24] text-xs font-semibold">
                      + {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-[#1F2228] border border-slate-200/80 dark:border-[#292C33] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800 dark:text-[#F3F4F6] flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-600 dark:text-[#818CF8]" />
                    <span>Seniority & Experience Fit</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-[#10B981]">
                    {fitReport.experienceFit.score}%
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-[#969BA6]">
                  {fitReport.experienceFit.summary}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-[#1F2228] border border-slate-200/80 dark:border-[#292C33] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800 dark:text-[#F3F4F6] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-[#10B981]" />
                    <span>Corridor & Setup Fit</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-[#10B981]">
                    {fitReport.locationFit.score}%
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-[#969BA6]">
                  {fitReport.locationFit.summary}
                </p>
              </div>
            </div>

            {/* Tailored Resume Bullets */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#6B7280]">
                  Tailored Resume Bullets
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Click to copy</span>
              </div>

              <div className="space-y-2">
                {atsResult.tailoredBullets.slice(0, 2).map((bullet) => (
                  <div
                    key={bullet.id}
                    onClick={() => handleCopyBullet(bullet.id, bullet.tailored)}
                    className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#1F2228] border border-slate-200/80 dark:border-[#292C33] hover:border-blue-400 dark:hover:border-[#3A3E47] transition-all cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs leading-relaxed text-slate-800 dark:text-[#E5E7EB]">{bullet.tailored}</p>
                      <button className="text-slate-400 group-hover:text-blue-600 transition-colors shrink-0 mt-0.5">
                        {copiedBulletId === bullet.id ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-[#969BA6]">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">Rationale:</span>
                      <span>{bullet.reasoning}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Launch Full ATS Lab */}
            <button
              onClick={() => onOpenFullAtsModal(job)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-[#1F2228] dark:hover:bg-[#262932] border border-slate-200 dark:border-[#292C33] text-slate-800 dark:text-[#F3F4F6] font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Open Full ATS Lab (Formatted PDF Export)</span>
            </button>
          </div>
        )}

        {/* TAB 3: FOUNDER OUTREACH */}
        {activeTab === 'PITCH' && (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#6B7280] block mb-1.5">
                Outreach Strategy
              </label>
              <select
                value={pitchTemplate}
                onChange={(e) => setPitchTemplate(e.target.value as OutreachTemplateType)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1F2228] border border-slate-200 dark:border-[#292C33] text-xs font-semibold text-slate-800 dark:text-[#F3F4F6] outline-none focus:border-blue-500"
              >
                <option value="FOUNDER_STARTUP">Startup Founder Pitch (High-response)</option>
                <option value="PEER_REFERRAL">Engineering Peer Referral</option>
                <option value="INTERNSHIP_JUNIOR">Junior / Intern Pitch (Proof-first)</option>
                <option value="FREELANCE_PROPOSAL">Problem Proposal (Audit & fix)</option>
                <option value="LINKEDIN_X_DM">LinkedIn / X Short DM (&lt;100 words)</option>
                <option value="FOLLOW_UP_NUDGE">3-Day Polite Follow-Up</option>
              </select>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1F2228] border border-slate-200 dark:border-[#292C33] flex items-center justify-between">
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 dark:text-[#6B7280] block font-semibold">Recipient:</span>
                <span className="font-bold text-xs text-slate-800 dark:text-[#F3F4F6] truncate block">{job.founderName} ({job.founderEmail})</span>
              </div>
              <button
                onClick={handleCopyEmail}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:text-[#969BA6] hover:bg-slate-200/60 dark:hover:bg-[#292C33] transition-colors"
                title="Copy email"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#6B7280] block mb-1">
                Subject Line
              </label>
              <input
                type="text"
                value={pitchSubject}
                onChange={(e) => setUserEditedSubject({ key: currentOutreachKey, val: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1F2228] border border-slate-200 dark:border-[#292C33] text-xs text-slate-900 dark:text-[#F3F4F6] font-mono outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#6B7280] block mb-1">
                Pitch Message
              </label>
              <textarea
                rows={9}
                value={pitchBody}
                onChange={(e) => setUserEditedBody({ key: currentOutreachKey, val: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1F2228] border border-slate-200 dark:border-[#292C33] text-xs text-slate-800 dark:text-[#E5E7EB] leading-relaxed outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex gap-2">
                <button
                  onClick={handleCopyPitch}
                  className="flex-1 py-2 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-[#1F2228] dark:hover:bg-[#262932] border border-slate-200 dark:border-[#292C33] text-slate-800 dark:text-[#F3F4F6] font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  {copiedPitch ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPitch ? 'Copied' : 'Copy Pitch'}</span>
                </button>

                <button
                  onClick={handleOpenMailClient}
                  className="flex-1 py-2 px-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/25 active:scale-95 transition-all"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Open in Mail App</span>
                </button>
              </div>

              <button
                onClick={handleConfirmDispatched}
                className={`w-full py-2.5 px-3.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all ${
                  isOutreachDispatched
                    ? 'bg-emerald-50 dark:bg-[#10B981]/15 border-emerald-300 dark:border-[#10B981]/40 text-emerald-700 dark:text-[#34D399]'
                    : 'bg-slate-50 hover:bg-slate-100 dark:bg-[#1F2228] dark:hover:bg-[#262932] border-slate-200 dark:border-[#292C33] text-slate-600 dark:text-[#969BA6]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isOutreachDispatched ? 'Logged in Pipeline CRM' : 'Confirm Sent (Update Pipeline)'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Bottom Action Footer */}
      <div className="p-3.5 border-t border-slate-200/80 dark:border-[#292C33] bg-white dark:bg-[#17191E] flex items-center gap-2.5">
        <button
          onClick={() => setActiveTab('PITCH')}
          className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/25 active:scale-95 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Contact Founder</span>
        </button>

        <button
          onClick={() => onAddToPipeline(job)}
          className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all ${
            isApplied
              ? 'bg-blue-50 dark:bg-[#1F2228] border-blue-500 dark:border-[#6366F1] text-blue-600 dark:text-[#818CF8]'
              : 'bg-slate-100 hover:bg-slate-200/80 dark:bg-[#1F2228] dark:hover:bg-[#262932] border-slate-200 dark:border-[#292C33] text-slate-700 dark:text-[#969BA6]'
          }`}
        >
          <BookmarkPlus className="w-3.5 h-3.5" />
          <span>{isApplied ? `Saved (${applicationCard?.status || 'SAVED'})` : '+ Save to Pipeline'}</span>
        </button>

        <button
          onClick={() => onDirectApply(job)}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-[#1F2228] dark:hover:bg-[#262932] border border-slate-200 dark:border-[#292C33] text-slate-500 dark:text-[#969BA6] hover:text-slate-900 transition-colors"
          title="Open application link"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
