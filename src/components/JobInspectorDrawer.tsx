import React, { useState, useEffect } from 'react';
import type { JobListing, CandidateProfile, ApplicationCard, OutreachTemplateType, ATSMatchResult } from '../types';
import { generateColdOutreach } from '../lib/outreachEngine';
import { runATSTailoring } from '../lib/atsTailorEngine';
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
  BookmarkPlus 
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
  const [pitchSubject, setPitchSubject] = useState('');
  const [pitchBody, setPitchBody] = useState('');
  const [outreachLogged, setOutreachLogged] = useState(false);

  // Generate outreach & ATS tailoring whenever job or template changes
  useEffect(() => {
    if (job) {
      const generated = generateColdOutreach(candidate, job, pitchTemplate);
      setPitchSubject(generated.subject);
      setPitchBody(generated.body);
      setOutreachLogged(applicationCard?.status === 'OUTREACH_SENT');
    }
  }, [job, candidate, pitchTemplate, applicationCard?.status]);

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
    <div className="fixed inset-y-0 right-0 z-40 w-full max-w-lg bg-[#14151D] border-l border-[#242634] shadow-2xl flex flex-col text-[#EDEDED] font-sans animate-slide-in-right">
      {/* Drawer Top Header */}
      <div className="p-4 border-b border-[#212330] bg-[#171822] flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-[#1C1E2A] border border-[#2B2E40] flex items-center justify-center font-bold text-[#EDEDED] text-base shadow-sm shrink-0">
            {job.company.charAt(0)}
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold text-sm text-white truncate leading-tight">{job.title}</h2>
            <div className="flex items-center gap-2 text-xs text-[#8E909F] mt-0.5">
              <span className="font-medium text-[#EDEDED] truncate">{job.company}</span>
              <span>·</span>
              <span className="truncate">{job.location}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-[#7C7E8D] hover:text-white hover:bg-[#202230] transition-colors"
          title="Close drawer (ESC)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#212330] bg-[#121319] px-2 text-xs font-medium">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-3 py-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'OVERVIEW'
              ? 'border-[#5E6AD2] text-white font-semibold'
              : 'border-transparent text-[#7C7E8D] hover:text-[#EDEDED]'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Role & Founder</span>
        </button>

        <button
          onClick={() => setActiveTab('PITCH')}
          className={`px-3 py-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'PITCH'
              ? 'border-[#5E6AD2] text-white font-semibold'
              : 'border-transparent text-[#7C7E8D] hover:text-[#EDEDED]'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Pitch Founder</span>
          {outreachLogged && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
        </button>

        <button
          onClick={() => setActiveTab('ATS')}
          className={`px-3 py-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'ATS'
              ? 'border-[#5E6AD2] text-white font-semibold'
              : 'border-transparent text-[#7C7E8D] hover:text-[#EDEDED]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>ATS Match</span>
          <span className="text-[10px] font-mono px-1 rounded bg-[#1E202B] text-emerald-400">
            {atsResult.overallScore}%
          </span>
        </button>
      </div>

      {/* Tab Content Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {/* TAB 1: OVERVIEW & FOUNDER CONTACTS */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-5">
            {/* Metadata Pills Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg bg-[#181923] border border-[#232534]">
                <span className="text-[10px] uppercase tracking-wider text-[#686A78] font-semibold block">
                  Compensation
                </span>
                <span className="font-mono text-xs text-[#EDEDED] font-medium mt-0.5 block">
                  {job.salaryDisplay || `₹${job.minCtcLpa}–${job.maxCtcLpa} LPA`}
                </span>
                <span className="text-[10px] text-[#888A98]">Equity: {job.equityRange}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#181923] border border-[#232534]">
                <span className="text-[10px] uppercase tracking-wider text-[#686A78] font-semibold block">
                  Location & Cluster
                </span>
                <span className="text-xs text-[#EDEDED] font-medium mt-0.5 block truncate">
                  {job.bangaloreCluster || job.location}
                </span>
                <span className="text-[10px] text-[#888A98]">{job.isRemote ? 'Remote Friendly' : 'In-Office'}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#181923] border border-[#232534]">
                <span className="text-[10px] uppercase tracking-wider text-[#686A78] font-semibold block">
                  Source & Cohort
                </span>
                <span className="text-xs text-[#EDEDED] font-medium mt-0.5 block">
                  {job.source}
                </span>
                <span className="text-[10px] text-[#888A98]">{job.fundingRound || 'Funded'}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#181923] border border-[#232534]">
                <span className="text-[10px] uppercase tracking-wider text-[#686A78] font-semibold block">
                  Notice Buyout
                </span>
                <span className={`text-xs font-medium mt-0.5 block ${job.noticeBuyoutCovered ? 'text-emerald-400' : 'text-[#888A98]'}`}>
                  {job.noticeBuyoutCovered ? 'Covered by Startup' : 'Standard Notice'}
                </span>
                <span className="text-[10px] text-[#888A98]">Urgency: {job.hiringUrgency}</span>
              </div>
            </div>

            {/* Founder & Hiring Contact Card */}
            <div className="p-3.5 rounded-xl bg-[#181923] border border-[#262838] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#686A78] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Founder Contact</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300">
                  {job.contactConfidence || 'Direct Founder'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <h4 className="font-semibold text-sm text-white">{job.founderName}</h4>
                  <p className="text-[11px] text-[#8C8E9D]">{job.founderRole} at {job.company}</p>
                </div>
                <button
                  onClick={() => setActiveTab('PITCH')}
                  className="px-2.5 py-1 rounded-md bg-[#5E6AD2] hover:bg-[#6E7BEA] text-white text-[11px] font-medium transition-colors flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Draft Pitch</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#12131B] border border-[#202230]">
                <div className="flex items-center gap-2 min-w-0">
                  <Mail className="w-3.5 h-3.5 text-[#7C7E8D] shrink-0" />
                  <span className="font-mono text-[11px] text-[#D0D1D8] truncate">{job.founderEmail}</span>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="text-[11px] text-[#5E6AD2] hover:text-[#8E99F5] px-1.5 py-0.5 rounded hover:bg-[#1E2030] transition-colors flex items-center gap-1"
                >
                  {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Role Description */}
            <div className="space-y-1.5">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#686A78]">
                Role Overview
              </h3>
              <p className="text-xs leading-relaxed text-[#C0C1CD] whitespace-pre-line bg-[#161720] p-3 rounded-lg border border-[#212330]">
                {job.description}
              </p>
            </div>

            {/* Required Skills & Technologies */}
            <div className="space-y-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#686A78]">
                Required Tech Stack
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {job.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 rounded bg-[#1A1C28] border border-[#27293A] text-[11px] text-[#D0D1D8]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PITCH FOUNDER COMPOSER */}
        {activeTab === 'PITCH' && (
          <div className="space-y-4">
            {/* Template Selector */}
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[#686A78] block mb-1.5">
                Outreach Strategy
              </label>
              <select
                value={pitchTemplate}
                onChange={(e) => setPitchTemplate(e.target.value as OutreachTemplateType)}
                className="w-full px-3 py-2 rounded-lg bg-[#181923] border border-[#282A3A] text-xs text-[#EDEDED] outline-none font-sans"
              >
                <option value="FOUNDER_STARTUP">Startup Founder Pitch (High-response)</option>
                <option value="PEER_REFERRAL">Engineering Peer Referral</option>
                <option value="INTERNSHIP_JUNIOR">Junior / Intern Pitch (Proof-first)</option>
                <option value="FREELANCE_PROPOSAL">Problem Proposal (Audit & fix)</option>
                <option value="LINKEDIN_X_DM">LinkedIn / X Short DM (&lt;100 words)</option>
                <option value="FOLLOW_UP_NUDGE">3-Day Polite Follow-Up</option>
              </select>
            </div>

            {/* Recipient */}
            <div className="p-2.5 rounded-lg bg-[#181923] border border-[#232534] flex items-center justify-between">
              <div className="min-w-0">
                <span className="text-[10px] text-[#7C7E8D] block">To Recipient:</span>
                <span className="font-medium text-white truncate block">{job.founderName} ({job.founderEmail})</span>
              </div>
              <button
                onClick={handleCopyEmail}
                className="p-1.5 rounded text-[#7C7E8D] hover:text-white hover:bg-[#202230] transition-colors"
                title="Copy email"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Subject Line */}
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[#686A78] block mb-1">
                Subject
              </label>
              <input
                type="text"
                value={pitchSubject}
                onChange={(e) => setPitchSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#181923] border border-[#282A3A] text-xs text-[#EDEDED] font-mono outline-none"
              />
            </div>

            {/* Body */}
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-[#686A78] block mb-1">
                Pitch Message
              </label>
              <textarea
                rows={9}
                value={pitchBody}
                onChange={(e) => setPitchBody(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#181923] border border-[#282A3A] text-xs text-[#C6C8D4] leading-relaxed outline-none font-sans"
              />
            </div>

            {/* Dispatch Actions */}
            <div className="space-y-2 pt-1">
              <div className="flex gap-2">
                <button
                  onClick={handleCopyPitch}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#1F212D] hover:bg-[#282A3A] border border-[#2F3245] text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedPitch ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPitch ? 'Copied to Clipboard' : 'Copy Full Pitch'}</span>
                </button>

                <button
                  onClick={handleOpenMailClient}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#5E6AD2] hover:bg-[#6E7BEA] text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Open in Mail App</span>
                </button>
              </div>

              <button
                onClick={handleConfirmDispatched}
                className={`w-full py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                  outreachLogged
                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                    : 'bg-[#181923] hover:bg-[#202230] border-[#2C2E3E] text-[#D0D1DC]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{outreachLogged ? 'Marked as Outreach Dispatched' : 'Confirm Sent (Update Pipeline)'}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: ATS KEYWORD MATCH & TAILORING */}
        {activeTab === 'ATS' && (
          <div className="space-y-4">
            {/* Score Ring / Bar */}
            <div className="p-3.5 rounded-xl bg-[#181923] border border-[#262838] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#686A78] block">
                  Candidate Fit
                </span>
                <span className="text-xl font-bold text-white font-mono mt-0.5 block">
                  {atsResult.overallScore}% ATS Match
                </span>
                <span className="text-[10px] text-[#8C8E9D]">
                  {atsResult.matchedKeywords.length} of {job.requiredSkills.length} core keywords matched
                </span>
              </div>

              <div className="w-14 h-14 rounded-full bg-[#12131B] border-2 border-[#5E6AD2] flex items-center justify-center font-bold text-sm text-indigo-300 font-mono">
                {atsResult.overallScore}%
              </div>
            </div>

            {/* Methodology & Transparency */}
            <div className="p-3 rounded-xl bg-[#131520] border border-[#202334] text-[11px] text-[#8E92A8] space-y-1.5">
              <span className="font-semibold text-[#D0D3E2] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Fit Score Methodology</span>
              </span>
              <p className="leading-relaxed">
                Evaluated deterministically by comparing {job.requiredSkills.length} required technical proficiencies against your verified profile skills ({candidate.primarySkills.slice(0, 4).join(', ')}).
              </p>
              <div className="pt-1 text-[10px] text-[#63677D] font-mono">
                Source: {job.verificationSource || 'Verified Founder Direct Reach'}
              </div>
            </div>

            {/* Keyword Breakdown */}
            <div className="space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#686A78] block">
                Matched Keywords
              </span>
              <div className="flex flex-wrap gap-1.5">
                {atsResult.matchedKeywords.map((kw) => (
                  <span key={kw} className="px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-[10px] font-mono flex items-center gap-1">
                    <Check className="w-2.5 h-2.5" />
                    <span>{kw}</span>
                  </span>
                ))}
              </div>
            </div>

            {atsResult.missingKeywords.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#686A78] block">
                  Missing / Recommended to Highlight
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {atsResult.missingKeywords.map((kw) => (
                    <span key={kw} className="px-2 py-0.5 rounded bg-amber-950/30 border border-amber-800/50 text-amber-300 text-[10px] font-mono">
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tailored Bullet Suggestions */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#686A78]">
                  Tailored Resume Bullets
                </span>
                <span className="text-[10px] text-[#7C7E8D]">Click to copy</span>
              </div>

              <div className="space-y-2">
                {atsResult.tailoredBullets.slice(0, 3).map((bullet) => (
                  <div
                    key={bullet.id}
                    onClick={() => handleCopyBullet(bullet.id, bullet.tailored)}
                    className="p-3 rounded-lg bg-[#161721] border border-[#262838] hover:border-[#3D4058] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[11px] leading-relaxed text-[#D0D1DC]">{bullet.tailored}</p>
                      <button className="text-[#686A78] group-hover:text-white transition-colors shrink-0 mt-0.5">
                        {copiedBulletId === bullet.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-[9px] text-[#787A8A]">
                      <Sparkles className="w-2.5 h-2.5 text-[#5E6AD2]" />
                      <span>{bullet.reasoning}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Full Lab Launcher */}
            <button
              onClick={() => onOpenFullAtsModal(job)}
              className="w-full py-2 px-3 rounded-lg bg-[#1F212D] hover:bg-[#282A3A] border border-[#2F3245] text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-[#5E6AD2]" />
              <span>Open Complete ATS Lab (Print / PDF)</span>
            </button>
          </div>
        )}
      </div>

      {/* Drawer Bottom Action Bar */}
      <div className="p-3 border-t border-[#212330] bg-[#121319] flex items-center gap-2">
        <button
          onClick={() => setActiveTab('PITCH')}
          className="flex-1 py-2 px-3 rounded-lg bg-[#5E6AD2] hover:bg-[#6E7BEA] text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Contact Founder</span>
        </button>

        <button
          onClick={() => onAddToPipeline(job)}
          className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
            isApplied
              ? 'bg-[#1A1C26] border-[#2D3042] text-indigo-300'
              : 'bg-[#1C1E29] hover:bg-[#242636] border-[#2E3144] text-white'
          }`}
        >
          <BookmarkPlus className="w-3.5 h-3.5" />
          <span>{isApplied ? `Tracked (${applicationCard?.status || 'SAVED'})` : '+ Save'}</span>
        </button>

        <button
          onClick={() => onDirectApply(job)}
          className="p-2 rounded-lg bg-[#1C1E29] hover:bg-[#242636] border border-[#2E3144] text-[#8E92A8] hover:text-white transition-colors"
          title="Open career page or Google search"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
