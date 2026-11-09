import React, { useState } from 'react';
import type { JobListing, CandidateProfile, ColdOutreach, OutreachTemplateType } from '../types';
import { generateColdOutreach } from '../lib/outreachEngine';
import { X, Send, Copy, Check, Mail, MessageCircle, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OutreachModalProps {
  job: JobListing;
  candidate: CandidateProfile;
  onClose: () => void;
  onLogOutreachSent: (job: JobListing, subject: string, body: string) => void;
}

const TEMPLATES: { id: OutreachTemplateType; label: string; icon: string }[] = [
  { id: 'FOUNDER_STARTUP', label: '1. Founder Cold Email', icon: '⚡' },
  { id: 'INTERNSHIP_JUNIOR', label: '2. Junior / Intern', icon: '🚀' },
  { id: 'PEER_REFERRAL', label: '3. Team Referral', icon: '🤝' },
  { id: 'FREELANCE_PROPOSAL', label: '4. Problem Proposal', icon: '🛠️' },
  { id: 'LINKEDIN_X_DM', label: '5. LinkedIn / X DM', icon: '💬' },
  { id: 'FOLLOW_UP_NUDGE', label: '6. Follow-Up Nudge', icon: '⏳' },
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

  const handleCopy = () => {
    navigator.clipboard.writeText(`${subject ? `Subject: ${subject}\n\n` : ''}${body}`);
    setCopied(true);
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#6366F1', '#10B981', '#38BDF8']
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#101625] border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Founder Cold Outreach Studio</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  80% Response Playbook
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Targeting: <strong className="text-slate-200">{job.founderName}</strong> ({job.founderRole}) at {job.company}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 6 Battle-Tested Template Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Battle-Tested Outreach Templates (Works 8 Out of 10 Times)
            </span>
            <span className="text-[11px] text-slate-500 font-mono">6 Proven Variants</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => handleStyleChange(tmpl.id)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-left flex items-center gap-2 border ${
                  style === tmpl.id
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                    : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>{tmpl.icon}</span>
                <span className="truncate">{tmpl.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-2 text-xs text-indigo-300 italic bg-indigo-950/20 px-3 py-1.5 rounded-lg border border-indigo-500/20">
            {outreach.bestFor}
          </div>
        </div>

        {/* 4-Part Formula Breakdown Box (Context + Relevance + Proof + Small Ask) */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>The 4-Part Winning Structure:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="font-bold text-emerald-400 block uppercase tracking-wide">1. Context</span>
              <p className="text-slate-400 leading-snug">Specific reason for choosing {job.company}.</p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="font-bold text-blue-400 block uppercase tracking-wide">2. Relevance</span>
              <p className="text-slate-400 leading-snug">Matching candidate tech stack to their roadmap.</p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="font-bold text-purple-400 block uppercase tracking-wide">3. Proof</span>
              <p className="text-slate-400 leading-snug">Live GitHub repo & production metrics.</p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="font-bold text-amber-400 block uppercase tracking-wide">4. Small Ask</span>
              <p className="text-slate-400 leading-snug">One low-friction question.</p>
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="space-y-4">
          {/* Recipient & Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">To (Founder / Recruiter)</label>
              <input
                type="text"
                value={job.founderEmail}
                readOnly
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Subject Line</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Body */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-300">Message Body</label>
              <span className="text-[11px] font-mono text-slate-500">
                {body.split(/\s+/).filter(Boolean).length} words · {body.length} characters (Optimal: 80–150 words)
              </span>
            </div>
            <textarea
              rows={9}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full p-4 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs font-mono leading-relaxed text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Multi-Channel Launch Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-700"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Full Pitch!' : 'Copy to Clipboard'}</span>
          </button>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            {/* WhatsApp */}
            <button
              onClick={handleOpenWhatsApp}
              className="px-3.5 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 rounded-xl text-xs font-bold border border-emerald-500/30 transition-all flex items-center gap-1.5"
              title="Open in WhatsApp Web"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp</span>
            </button>

            {/* Twitter / X */}
            <button
              onClick={handleOpenTwitter}
              className="px-3.5 py-2.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 rounded-xl text-xs font-bold border border-sky-500/30 transition-all flex items-center gap-1.5"
              title="Open in X / Twitter Web"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>X (Twitter) DM</span>
            </button>

            {/* Email Launcher */}
            <button
              onClick={handleOpenEmailClient}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Launch Email & Log CRM</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
