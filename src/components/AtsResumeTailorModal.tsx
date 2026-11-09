import React, { useState } from 'react';
import type { JobListing, CandidateProfile, ATSMatchResult } from '../types';
import { runATSTailoring } from '../lib/atsTailorEngine';
import { X, Sparkles, CheckCircle2, AlertTriangle, Copy, Check, ArrowRight, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AtsResumeTailorModalProps {
  job: JobListing;
  candidate: CandidateProfile;
  onClose: () => void;
  onProceedToOutreach: (job: JobListing) => void;
}

export const AtsResumeTailorModal: React.FC<AtsResumeTailorModalProps> = ({
  job,
  candidate,
  onClose,
  onProceedToOutreach,
}) => {
  const [copied, setCopied] = useState(false);
  const atsResult: ATSMatchResult = runATSTailoring(candidate, job);

  const handleCopyMarkdown = () => {
    const markdown = `# Tailored Resume Experience for ${job.company} (${job.title})
Candidate: ${candidate.fullName} | ${candidate.email}

## Highlighted Achievements (ATS Optimized - ${atsResult.overallScore}% Match):
${atsResult.tailoredBullets.map((b) => `* ${b.tailored}`).join('\n\n')}

### Target Keywords Embedded:
${job.requiredSkills.join(', ')}`;

    navigator.clipboard.writeText(markdown);
    setCopied(true);
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#6366F1', '#10B981']
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#101625] border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">ATS Resume Tailor Lab</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  {job.company}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Targeting: <strong className="text-slate-200">{job.title}</strong>
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

        {/* ATS Score Meter & Analysis Banner */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Overall ATS Match Score</span>
              <div className="text-4xl font-black font-mono text-emerald-400 mt-2">
                {atsResult.overallScore}%
              </div>
              <span className="text-xs text-slate-400 block mt-1">
                {atsResult.overallScore >= 90 ? '🌟 Tier-1 Pass Rate (Top 5% of Applicants)' : 'Strong Match'}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-4">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${atsResult.overallScore}%` }}
              />
            </div>
          </div>

          <div className="md:col-span-8 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div>
              <span className="text-xs font-bold text-slate-300 block mb-1.5">Matched Keywords:</span>
              <div className="flex flex-wrap gap-1.5">
                {atsResult.matchedKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {atsResult.missingKeywords.length > 0 && (
              <div>
                <span className="text-xs font-bold text-amber-400 block mb-1.5">Missing Required Keywords:</span>
                <div className="flex flex-wrap gap-1.5">
                  {atsResult.missingKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-1"
                    >
                      <AlertTriangle className="w-3 h-3 text-amber-400" />
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tailored Bullets (Before vs After Diff) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Auto-Tailored Resume Bullet Points (Google XYZ Impact Format)</span>
            </h3>
            <button
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Markdown' : 'Copy All Bullets'}</span>
            </button>
          </div>

          <div className="space-y-4">
            {atsResult.tailoredBullets.map((bullet, idx) => (
              <div key={idx} className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800/90 space-y-3">
                {/* Original */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Original Experience Bullet
                  </span>
                  <p className="text-xs text-slate-400 line-through opacity-75">
                    {bullet.original}
                  </p>
                </div>

                {/* Tailored */}
                <div className="space-y-1 bg-indigo-950/20 p-3.5 rounded-xl border border-indigo-500/20">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                    Tailored with JD Context & Metrics
                  </span>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    {bullet.tailored}
                  </p>
                </div>

                {/* Reasoning */}
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 italic">
                  <span>💡 {bullet.reasoning}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            onClick={() => onProceedToOutreach(job)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <span>Proceed to Founder Outreach</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
