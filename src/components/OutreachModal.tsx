import React, { useState } from 'react';
import type { JobListing, CandidateProfile, ColdOutreach, OutreachTemplateType } from '../types';
import { generateColdOutreach } from '../lib/outreachEngine';
import { 
  X, 
  Send, 
  Copy, 
  Check, 
  MessageCircle, 
  FileText
} from 'lucide-react';

interface OutreachModalProps {
  job: JobListing;
  candidate: CandidateProfile;
  onClose: () => void;
  onLogOutreachSent: (job: JobListing, subject: string, body: string) => void;
}

const TEMPLATES: { id: OutreachTemplateType; label: string; tag: string }[] = [
  { id: 'FOUNDER_STARTUP', label: 'Founder Startup Pitch', tag: '80% reply rate' },
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
  const [isSending, setIsSending] = useState(false);

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

  const handleSendEmail = () => {
    setIsSending(true);
    const mailtoUrl = `mailto:${job.founderEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
    onLogOutreachSent(job, subject, body);
    setTimeout(() => {
      setIsSending(false);
      onClose();
    }, 1000);
  };

  const handleOpenWhatsApp = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(body)}`;
    window.open(waUrl, '_blank');
    onLogOutreachSent(job, subject, body);
  };

  const handleOpenTwitter = () => {
    const twitterUrl = `https://twitter.com/messages/compose?text=${encodeURIComponent(body)}`;
    window.open(twitterUrl, '_blank');
    onLogOutreachSent(job, subject, body);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#121212] border border-[#262626] rounded-2xl max-w-2xl w-full max-h-[94vh] overflow-y-auto shadow-2xl p-6 space-y-5 text-white font-sans">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
          <div className="flex items-center gap-2">
            <span className="text-base">✉️</span>
            <div>
              <h3 className="font-bold text-sm text-white">Cold email to founder</h3>
              <p className="text-[11px] text-[#A3A3A3] font-mono">
                {job.founderName} ({job.founderRole}) at {job.company}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#A3A3A3] hover:text-white hover:bg-[#262626] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 6 Template Selector Pills (CrackColdEmail Playbook) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-[#A3A3A3] font-mono">
            <span>Template formula (Sumit Kesarwani Playbook):</span>
            <span className="text-[#10B981]">80% response rate</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => handleStyleChange(tmpl.id)}
                className={`px-3 py-1 rounded-full text-xs transition-all font-mono border ${
                  style === tmpl.id
                    ? 'bg-white text-black border-white font-bold'
                    : 'bg-[#1C1C1C] text-[#A3A3A3] border-[#2E2E2E] hover:text-white'
                }`}
              >
                {tmpl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Email Window (Exact Aarivi Image 5 Design) */}
        <div className="bg-[#0A0A0A] rounded-xl border border-[#262626] p-4 text-xs font-mono space-y-3 shadow-inner">
          {/* Metadata Rows */}
          <div className="space-y-2 pb-3 border-b border-[#262626]">
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-[#737373] w-14 font-mono">To:</span>
              <span className="font-semibold text-white">{job.founderName} at {job.company}</span>
              <span className="text-[10px] text-[#A3A3A3] ml-auto font-mono">({job.founderEmail})</span>
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-[#737373] w-14 font-mono">Subject:</span>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="flex-1 bg-transparent border-b border-transparent hover:border-[#333] focus:border-white text-white focus:outline-none text-[11px] font-mono"
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

          {/* Resume Attachment Chip (Aarivi Image 5) */}
          <div className="pt-2 border-t border-[#1F1F1F] flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#171717] border border-[#2E2E2E] text-[11px] text-white font-mono">
              <FileText className="w-3.5 h-3.5 text-[#A3A3A3]" />
              <span>{candidate.fullName.toLowerCase().replace(/\s+/g, '-')}-resume.pdf</span>
              <span className="text-[#737373] text-[10px]">(attached)</span>
            </div>
            <div className="text-[10px] text-[#737373] font-mono">
              {body.trim().split(/\s+/).filter(Boolean).length} words
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar (Aarivi Image 5) */}
        <div className="pt-3 border-t border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <span className="text-[#737373] text-[11px]">
            Sends from {candidate.email}. Edit it or reply below to change it.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenWhatsApp}
              className="p-1.5 rounded-lg bg-[#1C1C1C] hover:bg-[#262626] text-[#34D399] border border-[#2E2E2E] transition-colors"
              title="Open WhatsApp Web"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleOpenTwitter}
              className="p-1.5 rounded-lg bg-[#1C1C1C] hover:bg-[#262626] text-[#38BDF8] border border-[#2E2E2E] transition-colors"
              title="Open X / Twitter DM"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </button>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-[#1C1C1C] hover:bg-[#262626] text-[#D4D4D4] border border-[#2E2E2E] text-xs font-medium transition-colors flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-3 py-1.5 text-[#A3A3A3] hover:text-white transition-colors"
            >
              Don't send
            </button>

            <button
              onClick={handleSendEmail}
              disabled={isSending}
              className="px-4 py-1.5 bg-white hover:bg-[#F3F4F6] text-black font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-3 h-3" />
              <span>{isSending ? 'Launching...' : 'Send email'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OutreachModal;
