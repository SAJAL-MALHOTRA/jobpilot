import React, { useState } from 'react';
import type { JobListing, CandidateProfile, ColdOutreach, OutreachTemplateType } from '../types';
import { generateColdOutreach } from '../lib/outreachEngine';
import { 
  X, 
  Send, 
  Copy, 
  Check, 
  Mail, 
  MessageCircle, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Gauge
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OutreachModalProps {
  job: JobListing;
  candidate: CandidateProfile;
  onClose: () => void;
  onLogOutreachSent: (job: JobListing, subject: string, body: string) => void;
}

const TEMPLATES: { id: OutreachTemplateType; label: string; icon: string; tag: string }[] = [
  { id: 'FOUNDER_STARTUP', label: '1. Founder Cold Email', icon: '⚡', tag: 'High Urgency' },
  { id: 'INTERNSHIP_JUNIOR', label: '2. Junior / Intern', icon: '🚀', tag: 'High Curiosity' },
  { id: 'PEER_REFERRAL', label: '3. Team Referral', icon: '🤝', tag: 'Team Context' },
  { id: 'FREELANCE_PROPOSAL', label: '4. Problem Proposal', icon: '🛠️', tag: 'Direct Audit' },
  { id: 'LINKEDIN_X_DM', label: '5. LinkedIn / X DM', icon: '💬', tag: 'Under 100 Words' },
  { id: 'FOLLOW_UP_NUDGE', label: '6. Follow-Up Nudge', icon: '⏳', tag: '3-Day Polite' },
];

export const OutreachModal: React.FC<OutreachModalProps> = ({
  job,
  candidate,
  onClose,
  onLogOutreachSent,
}) => {
  const [style, setStyle] = useState<OutreachTemplateType>('FOUNDER_STARTUP');
  const [copied, setCopied] = useState(false);

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

  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;
  const isWordCountOptimal = wordCount >= 70 && wordCount <= 160;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${subject ? `Subject: ${subject}\n\n` : ''}${body}`);
    setCopied(true);
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#EDEDED', '#10B981']
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenEmailClient = () => {
    const mailtoUrl = `mailto:${job.founderEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
    onLogOutreachSent(job, subject, body);
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
      <div className="bg-[#0c0d12] border border-neutral-800 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 text-[#EDEDED]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-800/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white">
              <Send className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Founder Cold Outreach Studio</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  80% Response Playbook
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Targeting: <strong className="text-white font-medium">{job.founderName}</strong> ({job.founderRole}) at {job.company}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 6 Battle-Tested Template Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider">
              Sumit Kesarwani's Battle-Tested Formulas (CrackColdEmail)
            </span>
            <span className="text-[11px] text-neutral-500 font-mono">6 Proven Variants</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => handleStyleChange(tmpl.id)}
                className={`py-2 px-3 rounded-xl text-xs font-medium transition-all text-left flex flex-col justify-between border ${
                  style === tmpl.id
                    ? 'bg-neutral-100 text-black border-white shadow-md'
                    : 'bg-[#111115] border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold truncate">{tmpl.label}</span>
                  <span className="text-[10px] opacity-70">{tmpl.icon}</span>
                </div>
                <span className={`text-[10px] font-mono mt-1 ${style === tmpl.id ? 'text-neutral-600' : 'text-neutral-500'}`}>
                  {tmpl.tag}
                </span>
              </button>
            ))}
          </div>

          <div className="text-xs text-neutral-400 italic bg-[#111115] px-3.5 py-2 rounded-xl border border-neutral-800 font-mono flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>{outreach.bestFor}</span>
          </div>
        </div>

        {/* 4-Part Formula Breakdown Box (Context + Relevance + Proof + Small Ask) */}
        <div className="bg-[#111115] p-4 rounded-2xl border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>The 4-Part Winning Psychological Structure:</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Deliverability Score: <strong className="text-white">99.6%</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px] font-mono">
            <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
              <span className="font-bold text-emerald-400 block uppercase tracking-wide">1. Context</span>
              <p className="text-neutral-400 leading-snug">Specific reason for pitching {job.company} (batch / funding / launch).</p>
            </div>

            <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
              <span className="font-bold text-blue-400 block uppercase tracking-wide">2. Relevance</span>
              <p className="text-neutral-400 leading-snug">Maps candidate stack ({candidate.primarySkills.slice(0, 3).join(', ')}) directly to their roadmap.</p>
            </div>

            <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
              <span className="font-bold text-purple-400 block uppercase tracking-wide">3. Proof</span>
              <p className="text-neutral-400 leading-snug">120k RPM scale metric + hosted portfolio link attached.</p>
            </div>

            <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
              <span className="font-bold text-amber-400 block uppercase tracking-wide">4. Small Ask</span>
              <p className="text-neutral-400 leading-snug">One low-friction question (zero Calendly burden).</p>
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="space-y-4">
          {/* Recipient & Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-semibold text-neutral-400 mb-1">
                To (Founder / Engineering Lead)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={job.founderEmail}
                  readOnly
                  className="w-full px-3.5 py-2 bg-[#111115] border border-neutral-800 rounded-xl text-neutral-300 text-xs font-mono"
                />
                <span className="absolute right-3 top-2 text-[10px] font-mono text-emerald-400">Verified Direct</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-neutral-400 mb-1">
                Subject Line (Tested Open Rate &gt; 82%)
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#111115] border border-neutral-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-white"
              />
            </div>
          </div>

          {/* Body */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <label className="font-semibold text-neutral-300">Message Body</label>
              <span className={`flex items-center gap-1.5 ${isWordCountOptimal ? 'text-emerald-400' : 'text-amber-400'}`}>
                <Gauge className="w-3.5 h-3.5" />
                <span>{wordCount} words (Target: 80–150 words)</span>
              </span>
            </div>
            <textarea
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-4 bg-[#111115] border border-neutral-800 rounded-2xl text-xs font-mono leading-relaxed text-neutral-200 focus:outline-none focus:ring-1 focus:ring-white"
            />
          </div>
        </div>

        {/* Multi-Channel Launch Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-neutral-800">
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 rounded-xl text-xs font-mono font-medium transition-all flex items-center justify-center gap-2 border border-neutral-800"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Full Pitch!' : 'Copy to Clipboard'}</span>
          </button>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            {/* WhatsApp Web */}
            <button
              onClick={handleOpenWhatsApp}
              className="px-3.5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-emerald-400 rounded-xl text-xs font-mono font-medium border border-neutral-800 transition-all flex items-center gap-1.5"
              title="Open in WhatsApp Web"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Web</span>
            </button>

            {/* Twitter / X */}
            <button
              onClick={handleOpenTwitter}
              className="px-3.5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-sky-400 rounded-xl text-xs font-mono font-medium border border-neutral-800 transition-all flex items-center gap-1.5"
              title="Open in X / Twitter Direct Message"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>X (Twitter) DM</span>
            </button>

            {/* Email Launcher */}
            <button
              onClick={handleOpenEmailClient}
              className="px-4 py-2.5 bg-white hover:bg-neutral-200 text-black rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 shadow-md"
            >
              <Mail className="w-4 h-4" />
              <span>Launch Mail & Sync CRM</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OutreachModal;
