import React, { useState } from 'react';
import type { JobListing, CandidateProfile, ColdOutreach, OutreachTemplateType } from '../types';
import { generateColdOutreach } from '../lib/outreachEngine';
import { Modal } from './Modal';
import { 
  Send, 
  Copy, 
  Check, 
  MessageCircle, 
  FileText,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface OutreachModalProps {
  job: JobListing;
  candidate: CandidateProfile;
  onClose: () => void;
  onLogOutreachSent: (job: JobListing, subject: string, body: string) => void;
}

const TEMPLATES: { id: OutreachTemplateType; label: string; tag: string }[] = [
  { id: 'FOUNDER_STARTUP', label: 'Founder Startup Pitch', tag: 'High-Response' },
  { id: 'INTERNSHIP_JUNIOR', label: 'Junior / Intern Pitch', tag: 'Proof-first' },
  { id: 'PEER_REFERRAL', label: 'Team Referral', tag: 'Direct engineering' },
  { id: 'FREELANCE_PROPOSAL', label: 'Problem Proposal', tag: 'Audit & fix' },
  { id: 'LINKEDIN_X_DM', label: 'LinkedIn / X DM', tag: '<100 words' },
  { id: 'FOLLOW_UP_NUDGE', label: '3-Day Follow-Up', tag: 'Polite reminder' },
];

export const OutreachModal: React.FC<OutreachModalProps> = ({
  job,
  candidate,
  onClose,
  onLogOutreachSent,
}) => {
  const [style, setStyle] = useState<OutreachTemplateType>('FOUNDER_STARTUP');
  const [copied, setCopied] = useState(false);
  const [draftOpened, setDraftOpened] = useState(false);
  const [isMarkedSent, setIsMarkedSent] = useState(false);

  const [outreach, setOutreach] = useState<ColdOutreach>(() =>
    generateColdOutreach(candidate, job, 'FOUNDER_STARTUP')
  );

  const [subject, setSubject] = useState(outreach.subject);
  const [body, setBody] = useState(outreach.body);

  const handleStyleChange = (newStyle: OutreachTemplateType) => {
    setStyle(newStyle);
    const updated = generateColdOutreach(candidate, job, newStyle);
    setOutreach(updated);
    setSubject(updated.subject);
    setBody(updated.body);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${subject ? `Subject: ${subject}\n\n` : ''}${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Launch external mail client without falsely recording as sent
  const handleOpenEmailDraft = () => {
    const mailtoUrl = `mailto:${job.founderEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
    setDraftOpened(true);
  };

  const handleOpenWhatsApp = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(body)}`;
    window.open(waUrl, '_blank');
    setDraftOpened(true);
  };

  const handleOpenTwitter = () => {
    const twitterUrl = `https://twitter.com/messages/compose?text=${encodeURIComponent(body)}`;
    window.open(twitterUrl, '_blank');
    setDraftOpened(true);
  };

  // Explicit user confirmation after actually dispatching the email/message
  const handleConfirmSent = () => {
    onLogOutreachSent(job, subject, body);
    setIsMarkedSent(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Direct Founder Pitch Composer"
      subtitle={`${job.founderName} (${job.founderRole}) at ${job.company}`}
      icon={<span className="text-base">✉️</span>}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5 text-[#EDEDED] font-sans">
        {/* Template Selector Pills */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-[#A1A1A1] font-mono">
            <span>Template formula (Direct outreach playbook):</span>
            <span className="text-emerald-400 font-semibold">Structured 4-Part Pitch</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => handleStyleChange(tmpl.id)}
                className={`px-3 py-1 rounded-full text-xs transition-all font-mono border ${
                  style === tmpl.id
                    ? 'bg-white text-black border-white font-bold'
                    : 'bg-[#141414] text-[#A1A1A1] border-[#262626] hover:text-white'
                }`}
              >
                {tmpl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Alert if external draft opened */}
        {draftOpened && !isMarkedSent && (
          <div className="p-3 bg-[#111A15] border border-emerald-500/30 rounded-xl flex items-center justify-between gap-3 text-xs font-mono text-emerald-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Draft opened in external client. Did you send the pitch?</span>
            </div>
            <button
              onClick={handleConfirmSent}
              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg text-xs transition-colors shrink-0"
            >
              Confirm Sent
            </button>
          </div>
        )}

        {isMarkedSent && (
          <div className="p-3 bg-[#0B2014] border border-emerald-500/50 rounded-xl flex items-center gap-2 text-xs font-mono text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Outreach recorded in pipeline tracker! Closing composer...</span>
          </div>
        )}

        {/* Email Window */}
        <div className="bg-[#050505] rounded-xl border border-[#222222] p-4 text-xs font-mono space-y-3 shadow-inner">
          {/* Metadata Rows */}
          <div className="space-y-2 pb-3 border-b border-[#1F1F1F]">
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-[#737373] w-14 font-mono">To:</span>
              <span className="font-semibold text-white">{job.founderName} at {job.company}</span>
              <span className="text-[10px] text-[#A1A1A1] ml-auto font-mono">({job.founderEmail})</span>
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-[#737373] w-14 font-mono">Subject:</span>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="flex-1 bg-transparent border-b border-transparent hover:border-[#333333] focus:border-white text-white focus:outline-none text-[11px] font-mono"
              />
            </div>
          </div>

          {/* Email Body */}
          <textarea
            rows={10}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full bg-transparent text-[#D4D4D4] text-xs font-mono leading-relaxed focus:outline-none resize-none"
          />

          {/* Truthful Attachment Note */}
          <div className="pt-2 border-t border-[#1F1F1F] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#111111] border border-[#262626] text-[11px] text-[#A1A1A1] font-mono">
              <FileText className="w-3.5 h-3.5 text-[#737373]" />
              <span>Resume attachment:</span>
              <span className="text-amber-400/90 text-[10px]">Attach manually in your email app</span>
            </div>
            <div className="text-[10px] text-[#737373] font-mono">
              {body.trim().split(/\s+/).filter(Boolean).length} words
            </div>
          </div>
        </div>

        {/* Sender Disclosure */}
        <div className="text-[11px] text-[#A1A1A1] font-mono flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-[#737373]" />
          <span>
            Opening an external draft sends via your mail client account ({candidate.email}).
          </span>
        </div>

        {/* Bottom Actions Bar */}
        <div className="pt-3 border-t border-[#1F1F1F] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenWhatsApp}
              className="p-1.5 rounded-lg bg-[#141414] hover:bg-[#1F1F1F] text-[#34D399] border border-[#262626] transition-colors"
              title="Open WhatsApp Web Draft"
              aria-label="Open WhatsApp Draft"
            >
              <MessageCircle className="w-4 h-4" />
            </button>

            <button
              onClick={handleOpenTwitter}
              className="p-1.5 rounded-lg bg-[#141414] hover:bg-[#1F1F1F] text-[#38BDF8] border border-[#262626] transition-colors"
              title="Open X / Twitter DM Draft"
              aria-label="Open X DM Draft"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </button>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-[#141414] hover:bg-[#1F1F1F] text-[#D4D4D4] border border-[#262626] text-xs font-medium transition-colors flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-[#A1A1A1] hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleOpenEmailDraft}
              className="px-3.5 py-1.5 bg-[#141414] hover:bg-[#1F1F1F] text-white border border-[#2E2E2E] font-medium rounded-lg transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#A1A1A1]" />
              <span>Launch Mail Client</span>
            </button>

            <button
              onClick={handleConfirmSent}
              className="px-4 py-1.5 bg-white hover:bg-neutral-200 text-black font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Mark as Sent</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OutreachModal;
