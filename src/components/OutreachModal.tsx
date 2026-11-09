import React, { useState } from 'react';
import type { JobListing, CandidateProfile, ColdOutreach } from '../types';
import { generateColdOutreach } from '../lib/outreachEngine';
import { X, Send, Copy, Check, Mail, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OutreachModalProps {
  job: JobListing;
  candidate: CandidateProfile;
  onClose: () => void;
  onLogOutreachSent: (job: JobListing, subject: string, body: string) => void;
}

export const OutreachModal: React.FC<OutreachModalProps> = ({
  job,
  candidate,
  onClose,
  onLogOutreachSent,
}) => {
  const [style, setStyle] = useState<'FOUNDER_PUNCHY' | 'PROOF_OF_WORK' | 'LINKEDIN_INMAIL'>('FOUNDER_PUNCHY');
  const [copied, setCopied] = useState(false);

  const initialOutreach: ColdOutreach = generateColdOutreach(candidate, job, style);
  const [subject, setSubject] = useState(initialOutreach.subject);
  const [body, setBody] = useState(initialOutreach.body);

  const handleStyleChange = (newStyle: 'FOUNDER_PUNCHY' | 'PROOF_OF_WORK' | 'LINKEDIN_INMAIL') => {
    setStyle(newStyle);
    const updated = generateColdOutreach(candidate, job, newStyle);
    setSubject(updated.subject);
    setBody(updated.body);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${subject}\n\n${body}`);
    setCopied(true);
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#6366F1', '#38BDF8']
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenEmailClient = () => {
    const mailtoUrl = `mailto:${job.founderEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
    onLogOutreachSent(job, subject, body);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#101625] border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Founder Cold Outreach Copilot</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Verified Contact
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

        {/* Style Preset Selector */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-900/90 rounded-2xl border border-slate-800">
          <button
            onClick={() => handleStyleChange('FOUNDER_PUNCHY')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              style === 'FOUNDER_PUNCHY'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ Founder 3-Liner
          </button>
          <button
            onClick={() => handleStyleChange('PROOF_OF_WORK')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              style === 'PROOF_OF_WORK'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🛠️ Proof-of-Work
          </button>
          <button
            onClick={() => handleStyleChange('LINKEDIN_INMAIL')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              style === 'LINKEDIN_INMAIL'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            💬 LinkedIn DM
          </button>
        </div>

        {/* Recipient Bar */}
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <Mail className="w-4 h-4 text-slate-500" />
            <span>To:</span>
            <span className="font-mono text-slate-200 font-semibold">{job.founderEmail}</span>
          </div>
          {job.founderLinkedin && (
            <a
              href={job.founderLinkedin}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 hover:underline flex items-center gap-1 text-[11px]"
            >
              <span>LinkedIn Profile</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Subject Line Editor */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Subject Line</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Message Body Editor */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-slate-300">Personalized Message</label>
            <span className="text-[11px] font-mono text-slate-500">
              {body.split(/\s+/).filter(Boolean).length} words · {body.length} characters
            </span>
          </div>
          <textarea
            rows={10}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full p-4 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs font-sans leading-relaxed text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-700"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Full Message'}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onLogOutreachSent(job, subject, body)}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition-all"
            >
              Log Sent (Skip Mail App)
            </button>

            <button
              onClick={handleOpenEmailClient}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Launch Mail & Log CRM</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
