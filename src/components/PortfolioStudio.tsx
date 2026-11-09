import React, { useState } from 'react';
import type { CandidateProfile } from '../types';
import { 
  Globe, 
  Copy, 
  Check, 
  ExternalLink, 
  Code2, 
  Cpu, 
  Zap, 
  Shield, 
  Share2, 
  Activity, 
  CheckCircle2, 
  Play
} from 'lucide-react';
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
  const [benchmarking, setBenchmarking] = useState(false);
  const [benchmarkResult, setBenchmarkResult] = useState<string | null>(null);

  const portfolioUrl = `https://jobpilot.dev/p/${candidate.fullName.toLowerCase().replace(/\s+/g, '')}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(portfolioUrl);
    setCopiedLink(true);
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#EDEDED', '#10B981']
    });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleRunBenchmark = () => {
    setBenchmarking(true);
    setBenchmarkResult(null);
    setTimeout(() => {
      setBenchmarking(false);
      setBenchmarkResult('✓ Benchmark Verified: 120,450 req/min · p99 latency 38.4ms · Zero memory leaks detected across 100k Redis keys.');
      confetti({
        particleCount: 20,
        spread: 40,
        origin: { y: 0.6 },
        colors: ['#10B981', '#EDEDED']
      });
    }, 1000);
  };

  return (
    <div className="space-y-6 text-[#EDEDED]">
      {/* Studio Header */}
      <div className="bg-[#111115] p-6 rounded-2xl border border-neutral-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Hosted Proof-of-Work Developer Portfolio</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-neutral-900 text-neutral-300 border border-neutral-800">
              Aarivi Parity & Exceeded
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            Generated directly from verified git commits and production metrics. Share with founders to prove capability beyond a generic CV.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 border border-neutral-800"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied Custom Link!' : 'Copy Public URL'}</span>
          </button>

          <button
            onClick={onNavigateToOutreach}
            className="px-4 py-2 bg-white hover:bg-neutral-200 text-black rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 shadow-md"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Attach to Founder Pitch</span>
          </button>
        </div>
      </div>

      {/* Portfolio Public Preview Window (Simulated Browser Frame) */}
      <div className="bg-[#0c0d12] rounded-3xl border border-neutral-800 shadow-2xl overflow-hidden">
        {/* Browser Top Chrome */}
        <div className="px-5 py-3 bg-[#111115] border-b border-neutral-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-neutral-700" />
            <span className="w-3 h-3 rounded-full bg-neutral-700" />
            <span className="w-3 h-3 rounded-full bg-neutral-700" />
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1 bg-[#0c0d12] rounded-lg text-neutral-300 font-mono text-[11px] border border-neutral-800">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>{portfolioUrl}</span>
          </div>

          <a
            href={candidate.portfolioUrl}
            target="_blank"
            rel="noreferrer"
            className="text-neutral-400 hover:text-white flex items-center gap-1 text-[11px] font-mono"
          >
            <span>Live Web</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Live Portfolio Canvas */}
        <div className="p-8 sm:p-12 space-y-10 max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white font-black text-2xl font-mono shrink-0">
                {candidate.fullName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {candidate.fullName}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Active on Market · 15-Day Notice
                  </span>
                </div>
                <p className="text-sm text-neutral-400 mt-1 font-mono">
                  {candidate.headline}
                </p>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed max-w-2xl font-sans">
              Specialized in high-throughput backend architectures, distributed event streaming, and reactive client interfaces. Built core order dispatch and reconciliation infrastructure at <strong>{candidate.currentCompany}</strong> and <strong>Razorpay</strong>.
            </p>
          </div>

          {/* Key Production Metrics (Proof-of-Work) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#111115] border border-neutral-800 space-y-1.5">
              <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Throughput Benchmark
              </span>
              <div className="text-2xl font-black font-mono text-white">120k req/min</div>
              <p className="text-[11px] text-neutral-400 font-mono">Sub-45ms p99 in Node.js & Redis</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111115] border border-neutral-800 space-y-1.5">
              <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Daily Financial Volume
              </span>
              <div className="text-2xl font-black font-mono text-white">₹40Cr / day</div>
              <p className="text-[11px] text-neutral-400 font-mono">99.99% accuracy via Celery & SQS</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111115] border border-neutral-800 space-y-1.5">
              <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-emerald-400" /> Client Rendering Speed
              </span>
              <div className="text-2xl font-black font-mono text-white">-34% overhead</div>
              <p className="text-[11px] text-neutral-400 font-mono">WebSockets telemetry in React 18</p>
            </div>
          </div>

          {/* Live Interactive Benchmark Runner */}
          <div className="p-5 rounded-2xl bg-[#111115] border border-neutral-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-neutral-300">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="font-bold">Live Microservice Latency Tester</span>
              </div>
              <button
                onClick={handleRunBenchmark}
                disabled={benchmarking}
                className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-bold border border-neutral-800 transition-all flex items-center gap-1.5"
              >
                <Play className={`w-3 h-3 text-emerald-400 ${benchmarking ? 'animate-spin' : ''}`} />
                <span>{benchmarking ? 'Testing Redis Clustered Latency...' : 'Trigger Latency Test'}</span>
              </button>
            </div>

            {benchmarkResult ? (
              <div className="p-3 bg-neutral-900 rounded-xl border border-emerald-500/20 text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{benchmarkResult}</span>
              </div>
            ) : (
              <p className="text-[11px] text-neutral-500">
                Click to execute simulated p99 latency test against candidate's open-source order dispatch cluster benchmark repo.
              </p>
            )}
          </div>

          {/* Featured Production Case Studies */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <h3 className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider">
                Production Case Studies & Shipped Code
              </h3>
              <span className="text-xs font-mono text-neutral-500">Verified Git Repos</span>
            </div>

            <div className="space-y-3">
              {candidate.resumeBullets.map((bullet) => (
                <div
                  key={bullet.id}
                  className="p-5 rounded-2xl bg-[#111115] border border-neutral-800 space-y-2 hover:border-neutral-700 transition-colors"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white font-mono">{bullet.role} · {bullet.company}</span>
                    <span className="font-mono text-[10px] text-neutral-400">{bullet.keywords.slice(0, 2).join(' / ')}</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                    {bullet.text}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {bullet.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-900 text-neutral-400 border border-neutral-800"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Engineering Recommendations */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <h3 className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider">
                Founder & Engineering Manager Endorsements
              </h3>
              <span className="text-xs font-mono text-emerald-400">2 Verified References</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#111115] rounded-2xl border border-neutral-800 space-y-2 font-mono">
                <p className="text-neutral-300 italic text-[11px] leading-relaxed">
                  "Arjun owned our hardest database bottleneck during IPL peak hours. Handled 3x traffic spikes without a single minute of downtime."
                </p>
                <div className="text-[10px] text-neutral-400 pt-1 border-t border-neutral-800">
                  <span className="font-bold text-white block">Rohan Deshmukh</span>
                  <span>Ex-Staff Engineer, Swiggy Infrastructure</span>
                </div>
              </div>

              <div className="p-4 bg-[#111115] rounded-2xl border border-neutral-800 space-y-2 font-mono">
                <p className="text-neutral-300 italic text-[11px] leading-relaxed">
                  "Exceptional full-stack velocity. Wrote fault-tolerant webhook workers that recovered over ₹15Cr in reconciliation disputes."
                </p>
                <div className="text-[10px] text-neutral-400 pt-1 border-t border-neutral-800">
                  <span className="font-bold text-white block">Priya Nambiar</span>
                  <span>Engineering Manager, Razorpay Payouts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack Matrix */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider">
              Core Technical Competencies
            </h3>
            <div className="flex flex-wrap gap-2">
              {candidate.primarySkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-neutral-900 border border-neutral-800 text-neutral-200 font-mono"
                >
                  {skill}
                </span>
              ))}
              {candidate.secondarySkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-900/60 border border-neutral-800 text-neutral-400 font-mono"
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
export default PortfolioStudio;
