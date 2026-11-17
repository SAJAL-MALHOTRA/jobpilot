import React, { useState } from 'react';
import type { JobListing, CandidateProfile, ColdOutreach, OutreachTemplateType } from '../types';
import { generateColdOutreach } from '../lib/outreachEngine';
import { Modal } from './Modal';
import HoldButton from './kokonutui/hold-button';
import { 
  Copy, 
  Check, 
  MessageCircle, 
  FileText,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Mail
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
      title="Founder Pitch Composer"
      subtitle={`${job.founderName} (${job.founderRole}) at ${job.company}`}
      icon={<Mail className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5 text-neutral-900 dark:text-neutral-100 font-sans">
        {/* Template Selector Pills */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
            <span>Template formula (Direct outreach playbook):</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Structured 4-Part Pitch</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => handleStyleChange(tmpl.id)}
                className={`px-3 py-1 rounded-md text-xs transition-colors font-mono border ${
                  style === tmpl.id
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-neutral-900 dark:border-white font-semibold'
                    : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {tmpl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Alert if external draft opened */}
        {draftOpened && !isMarkedSent && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 rounded-lg flex items-center justify-between gap-3 text-xs font-mono text-emerald-800 dark:text-emerald-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Draft opened in external client. Did you dispatch the message?</span>
            </div>
            <button
              onClick={handleConfirmSent}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md text-xs transition-colors shrink-0"
            >
              Confirm Sent
            </button>
          </div>
        )}

        {isMarkedSent && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/50 rounded-lg flex items-center gap-2 text-xs font-mono text-emerald-800 dark:text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Outreach recorded in pipeline tracker. Closing composer...</span>
          </div>
        )}

        {/* Email Window */}
        <div className="bg-neutral-50 dark:bg-[#0c0d10] rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 text-xs font-mono space-y-3">
          {/* Metadata Rows */}
          <div className="space-y-2 pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-neutral-500 dark:text-neutral-400 w-14 font-mono">To:</span>
              <span className="font-semibold text-neutral-900 dark:text-white">{job.founderName} at {job.company}</span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 ml-auto font-mono">({job.founderEmail})</span>
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-neutral-500 dark:text-neutral-400 w-14 font-mono">Subject:</span>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="flex-1 bg-transparent border-b border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 focus:border-neutral-900 dark:focus:border-white text-neutral-900 dark:text-white focus:outline-none text-[11px] font-mono py-0.5"
              />
            </div>
          </div>

          {/* Email Body */}
          <textarea
            rows={10}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full bg-transparent text-neutral-800 dark:text-neutral-200 text-xs font-mono leading-relaxed focus:outline-none resize-none"
          />

          {/* Attachment Note */}
          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-400 font-mono">
              <FileText className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
              <span>Resume attachment:</span>
              <span className="text-neutral-700 dark:text-neutral-300 font-medium">Attach in your email app</span>
            </div>
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono tabular-nums">
              {body.trim().split(/\s+/).filter(Boolean).length} words
            </div>
          </div>
        </div>

        {/* Sender Disclosure */}
        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span>
            External drafts dispatch directly from your mail account ({candidate.email}).
          </span>
        </div>

        {/* Bottom Actions Bar */}
        <div className="pt-3 border-t border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenWhatsApp}
              className="p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-emerald-600 dark:text-emerald-400 border border-neutral-200 dark:border-neutral-700 transition-colors"
              title="Open WhatsApp Web Draft"
              aria-label="Open WhatsApp Draft"
            >
              <MessageCircle className="w-4 h-4" />
            </button>

            <button
              onClick={handleOpenTwitter}
              className="p-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-sky-600 dark:text-sky-400 border border-neutral-200 dark:border-neutral-700 transition-colors"
              title="Open X / Twitter DM Draft"
              aria-label="Open X DM Draft"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </button>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 text-xs font-medium transition-colors flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-neutral-500" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleOpenEmailDraft}
              className="px-3.5 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 font-medium rounded-lg transition-colors flex items-center gap-1.5 text-xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
              <span>Launch Mail Client</span>
            </button>

            <HoldButton
              variant="blue"
              holdDuration={800}
              onHoldComplete={handleConfirmSent}
              holdingLabel="Dispatched..."
              completeLabel="Sent to Pipeline!"
              className="h-9 px-4 text-xs font-semibold"
            >
              Hold to Confirm Sent
            </HoldButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OutreachModal;
