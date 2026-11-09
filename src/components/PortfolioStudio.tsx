import React, { useState } from 'react';
import type { CandidateProfile } from '../types';
import { Globe, Copy, Check, ExternalLink, Code2, Cpu, Zap, Shield, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PortfolioStudioProps {
  candidate: CandidateProfile;
  onNavigateToOutreach: () => void;
}

export const PortfolioStudio: React.FC<PortfolioStudioProps> = ({
  candidate,
  onNavigateToOutreach,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const portfolioUrl = `https://jobpilot.dev/p/${candidate.fullName.toLowerCase().replace(/\s+/g, '')}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(portfolioUrl);
    setCopiedLink(true);
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#6366F1', '#10B981']
    });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="bg-[#101625] p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Live Developer Portfolio & Proof-of-Work Studio</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              Aarivi Match & Exceed
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automatically generated from your GitHub and production experience. Send this custom URL directly to startup founders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-slate-700"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied Custom Link!' : 'Copy Portfolio URL'}</span>
          </button>

          <button
            onClick={onNavigateToOutreach}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Attach to Founder Pitch</span>
          </button>
        </div>
      </div>

      {/* Portfolio Public Preview Window (Simulated Browser Frame) */}
      <div className="bg-[#0B0F19] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
        {/* Browser Top Chrome */}
        <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-slate-950/80 rounded-lg text-slate-400 font-mono text-[11px] border border-slate-800/80">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>{portfolioUrl}</span>
          </div>

          <a
            href={candidate.portfolioUrl}
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
          >
            <span>Preview External</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Live Portfolio Canvas */}
        <div className="p-8 sm:p-12 space-y-10 max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-500/20">
                {candidate.fullName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {candidate.fullName}
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Available for Immediate Hire
                  </span>
                </div>
                <p className="text-sm text-slate-400 mt-1 font-medium">
                  {candidate.headline}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Specialized in low-latency backend architectures, distributed event streaming, and reactive frontend experiences. Previously shipped critical infrastructure at <strong>{candidate.currentCompany}</strong>.
            </p>
          </div>

          {/* Key Production Metrics (Proof-of-Work) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Throughput Scale
              </span>
              <div className="text-xl font-black font-mono text-white">120k req/min</div>
              <p className="text-[10px] text-slate-400">Sub-45ms p99 latency in Node.js & Redis</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Financial Reconciliation
              </span>
              <div className="text-xl font-black font-mono text-white">₹40Cr / day</div>
              <p className="text-[10px] text-slate-400">99.99% accuracy via Celery & AWS SQS</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-emerald-400" /> Frontend Rendering
              </span>
              <div className="text-xl font-black font-mono text-white">-34% overhead</div>
              <p className="text-[10px] text-slate-400">WebSockets state optimization in React 18</p>
            </div>
          </div>

          {/* Featured Architecture Projects */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Production Case Studies & Shipped Code
              </h3>
              <span className="text-xs font-mono text-slate-500">Verified GitHub Projects</span>
            </div>

            <div className="space-y-3">
              {candidate.resumeBullets.map((bullet) => (
                <div
                  key={bullet.id}
                  className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-200">{bullet.role} · {bullet.company}</span>
                    <span className="font-mono text-[10px] text-indigo-400">{bullet.keywords.slice(0, 2).join(' / ')}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {bullet.text}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {bullet.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700/60"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Matrix */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Core Technical Competencies
            </h3>
            <div className="flex flex-wrap gap-2">
              {candidate.primarySkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono"
                >
                  {skill}
                </span>
              ))}
              {candidate.secondarySkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 border border-slate-700 text-slate-300 font-mono"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
