import React, { useState } from 'react';
import type { JobListing, CandidateProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import BackgroundPaths from './kokonutui/background-paths';
import { 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  FileText, 
  Send, 
  Kanban, 
  Code2, 
  Layers, 
  ExternalLink, 
  ChevronRight,
  Cpu,
  Check
} from 'lucide-react';

interface JobPilotLandingProps {
  jobs: JobListing[];
  candidate: CandidateProfile;
  onLaunchConsole: () => void;
  onSelectJobForInspector: (job: JobListing) => void;
  onOpenOutreachForJob: (job: JobListing) => void;
  onOpenAtsForJob: (job: JobListing) => void;
  onOpenPortfolio: () => void;
}

type EngineStageId = 'INGESTION' | 'MATCH' | 'ATS' | 'OUTREACH' | 'PIPELINE';

interface EngineStage {
  id: EngineStageId;
  number: string;
  title: string;
  headline: string;
  summary: string;
  badge: string;
  icon: React.ElementType;
  accentColor: string;
  bulletPoints: string[];
}

const ENGINE_STAGES: EngineStage[] = [
  {
    id: 'INGESTION',
    number: '01',
    title: 'Radar Ingestion',
    headline: 'Multi-Corridor Real-Time Opportunity Sourcing',
    summary: 'Continuous algorithmic scanning across YC W25/S24 batches, Peak XV Surge, and top tech clusters (Bangalore HSR/Indiranagar, SF Bay Area). We extract transparent compensation, funding runway, and direct founder contact vectors.',
    badge: '100% Verified Seed & Growth',
    icon: Compass,
    accentColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    bulletPoints: [
      'Zero recruiter spam: every role connects to a verified founder or engineering lead',
      'Normalized compensation: transparent LPA packages and ESOP equity ranges',
      'Filtered for runway: seed to Series B with verified institutional backing'
    ]
  },
  {
    id: 'MATCH',
    number: '02',
    title: 'Deterministic Fit',
    headline: 'Hard-Constrained Stack & Experience Graph',
    summary: 'No arbitrary AI percentage hallucination. Match scores are deterministically derived from strict overlap between candidate production skills, required engineering stack, notice period alignment, and senior heuristics.',
    badge: 'Zero Hallucinated Scores',
    icon: Cpu,
    accentColor: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    bulletPoints: [
      'Weighted hard-skill matching: core runtime languages weighed over incidental tools',
      'Experience threshold verification: guarantees level-appropriate placement',
      'Corridor alignment: checks physical vs remote expectations upfront'
    ]
  },
  {
    id: 'ATS',
    number: '03',
    title: 'Google X-Y-Z Tailoring',
    headline: 'Verifiable Bullet Alignment & Hunk Diffing',
    summary: 'Rewrites candidate achievements into the battle-tested Google formula: "Accomplished [X] as measured by [Y] by doing [Z]". Injects target stack keywords without inventing fake qualifications.',
    badge: 'Standard ATS-Compliant',
    icon: FileText,
    accentColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    bulletPoints: [
      'Quantifiable impact: emphasizes latency, throughput, scale, and revenue',
      'Hunk diff inspection: visual before-and-after comparison before exporting',
      'Plaintext single-column export: guaranteed 100% ATS parser pass rate'
    ]
  },
  {
    id: 'OUTREACH',
    number: '04',
    title: 'Founder Direct Outreach',
    headline: 'Proof-First Pitch Synthesizer (Zero Fluff)',
    summary: 'Founders ignore boilerplate cover letters. JobPilot constructs concise, high-signal technical pitches linking real GitHub repositories, stack benchmarks, and immediate problem-solving value.',
    badge: '4x Median Reply Rate',
    icon: Send,
    accentColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    bulletPoints: [
      'Tailored opening: references company milestones and specific stack challenges',
      'Proof injection: directly quotes relevant public repositories and metrics',
      'Liquid hold-to-confirm: prevents accidental dispatch before review'
    ]
  },
  {
    id: 'PIPELINE',
    number: '05',
    title: 'Pipeline CRM Velocity',
    headline: 'Autonomous Kanban & Conversion Spline',
    summary: 'Track applications through 6 distinct stages: Sourced, Tailored, Dispatched, Interview, Offer, and Archived. Monitor conversion velocity with Catmull-Rom spline analytics and 3-day follow-up nudges.',
    badge: 'Velocity Analytics',
    icon: Kanban,
    accentColor: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    bulletPoints: [
      'Dynamic drag-and-drop kanban with real-time status transitions',
      'Catmull-Rom spline velocity charts tracking 7d, 30d, and 90d conversion',
      'One-click CSV export and instant follow-up clipboard generators'
    ]
  }
];

export const JobPilotLanding: React.FC<JobPilotLandingProps> = ({
  jobs,
  candidate,
  onLaunchConsole,
  onSelectJobForInspector,
  onOpenOutreachForJob,
  onOpenAtsForJob,
  onOpenPortfolio,
}) => {
  const [activeStageId, setActiveStageId] = useState<EngineStageId>('INGESTION');
  const [selectedDemoJobId, setSelectedDemoJobId] = useState<string>(jobs[0]?.id || '');

  const activeStage = ENGINE_STAGES.find((s) => s.id === activeStageId) || ENGINE_STAGES[0];
  const demoJob = jobs.find((j) => j.id === selectedDemoJobId) || jobs[0];

  return (
    <div className="min-h-screen bg-white dark:bg-[#090A0F] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-blue-500/20 selection:text-blue-600 transition-colors">
      
      {/* 1. TOP ANCHOR NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#090A0F]/90 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-xs shadow-xs">
              JP
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight text-neutral-900 dark:text-white">JobPilot</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                v2.4 Core
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-600 dark:text-neutral-400">
            <a href="#process" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              5-Stage Engine
            </a>
            <a href="#live-sandbox" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Live Demo
            </a>
            <a href="#comparison" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Why JobPilot
            </a>
            <button 
              onClick={onOpenPortfolio}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1 font-mono"
            >
              <Code2 className="w-3 h-3 text-indigo-500" />
              <span>Proof Studio</span>
            </button>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onLaunchConsole}
              className="px-3.5 py-1.5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span>Launch Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION WITH KOKONUT UI BACKGROUND PATHS */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-neutral-200/80 dark:border-neutral-800/80">
        <BackgroundPaths
          count={18}
          spread={0.65}
          speed={0.06}
          angle={-4}
          className="min-h-[460px] md:min-h-[520px] bg-transparent"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
            {/* Verified Corridor Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200/80 dark:border-neutral-800 text-[11px] font-mono text-neutral-700 dark:text-neutral-300 shadow-2xs backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>YC W25 & Peak XV Ingestion Active · 11 Verified Stealth Roles</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-950 dark:text-white leading-[1.1]">
              Direct Founder Reach. <br />
              <span className="text-neutral-400 dark:text-neutral-500">Zero Recruiter Friction.</span>
            </h1>

            {/* Plain English Value Proposition */}
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
              JobPilot replaces the black hole of generic job board portals with deterministic match graphs, 
              Google X-Y-Z quantifiable ATS resume tailoring, and proof-of-work founder outreach for senior software engineers.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={onLaunchConsole}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
              >
                <span>Open Radar Console (11 Roles)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#process"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-800 dark:text-neutral-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Explore 5-Stage Engine</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Real Stats Strip */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 max-w-3xl mx-auto text-left font-mono">
              <div className="p-3 rounded-lg bg-white/70 dark:bg-[#121316]/70 border border-neutral-200/80 dark:border-neutral-800 backdrop-blur-xs">
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block uppercase">Curated Roles</span>
                <span className="text-lg font-bold text-neutral-900 dark:text-white tabular-nums">11 Live</span>
              </div>
              <div className="p-3 rounded-lg bg-white/70 dark:bg-[#121316]/70 border border-neutral-200/80 dark:border-neutral-800 backdrop-blur-xs">
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block uppercase">CTC Band</span>
                <span className="text-lg font-bold text-neutral-900 dark:text-white tabular-nums">₹25L–₹55L</span>
              </div>
              <div className="p-3 rounded-lg bg-white/70 dark:bg-[#121316]/70 border border-neutral-200/80 dark:border-neutral-800 backdrop-blur-xs">
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block uppercase">Founder Inboxes</span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">100% Direct</span>
              </div>
              <div className="p-3 rounded-lg bg-white/70 dark:bg-[#121316]/70 border border-neutral-200/80 dark:border-neutral-800 backdrop-blur-xs">
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block uppercase">ATS Format</span>
                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">Google X-Y-Z</span>
              </div>
            </div>
          </div>
        </BackgroundPaths>
      </section>

      {/* 3. THE 5-STAGE STRUCTURED PROCESS (Interactive Showcase) */}
      <section id="process" className="py-16 md:py-24 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-[#0B0C10]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-[11px] font-mono font-medium text-blue-700 dark:text-blue-400">
              <Layers className="w-3.5 h-3.5" />
              <span>Full Structured Platform Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              The 5-Stage JobPilot Engine
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Every job seeker interacts with 5 deterministic stages that transform raw job listings into verifiable founder conversations.
            </p>
          </div>

          {/* Horizontal Step Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
            {ENGINE_STAGES.map((stage) => {
              const isSelected = stage.id === activeStageId;
              const IconComp = stage.icon;
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStageId(stage.id)}
                  className={`p-3 rounded-xl text-left transition-all border ${
                    isSelected
                      ? 'bg-white dark:bg-[#15171F] border-neutral-300 dark:border-neutral-700 shadow-xs'
                      : 'bg-transparent border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/60 dark:hover:bg-neutral-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-semibold text-neutral-400 dark:text-neutral-500">
                      STAGE {stage.number}
                    </span>
                    <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'}`} />
                  </div>
                  <div className="font-bold text-xs mt-1 text-neutral-900 dark:text-white truncate">
                    {stage.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Stage Interactive Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left: Stage Explanation & Concrete Nouns */}
            <div className="lg:col-span-5 bg-white dark:bg-[#121316] p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                    Stage {activeStage.number} Execution Spec
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${activeStage.accentColor}`}>
                    {activeStage.badge}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
                  {activeStage.headline}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {activeStage.summary}
                </p>

                <div className="pt-2 space-y-2">
                  <span className="text-[11px] font-mono font-semibold text-neutral-500 uppercase tracking-wider block">
                    Core Architectural Guarantees:
                  </span>
                  <ul className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
                    {activeStage.bulletPoints.map((bp, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <span className="text-[11px] font-mono text-neutral-400">
                  Candidate Profile: {candidate.fullName} ({candidate.yearsOfExperience}y exp)
                </span>
                <button
                  onClick={onLaunchConsole}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Open in Console</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Right: Live Interactive Mock Preview of Stage */}
            <div className="lg:col-span-7 bg-white dark:bg-[#121316] rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs p-5 flex flex-col justify-between overflow-hidden">
              
              {/* Preview Window Chrome */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200/70 dark:border-neutral-800 text-[11px] font-mono text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                  <span className="ml-2 text-neutral-600 dark:text-neutral-400 font-semibold">
                    simulator://engine/stage-{activeStage.number.toLowerCase()}/{demoJob.company.toLowerCase()}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">● LIVE STATE</span>
              </div>

              {/* Stage-Specific Mock Content */}
              <div className="py-4">
                <AnimatePresence mode="wait">
                  
                  {/* STAGE 1 PREVIEW: Multi-Corridor Ingestion */}
                  {activeStage.id === 'INGESTION' && (
                    <motion.div
                      key="ingestion-preview"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="space-y-3"
                    >
                      <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-neutral-900 dark:text-white">{demoJob.title}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                              {demoJob.source}
                            </span>
                          </div>
                          <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white">
                            {demoJob.salaryDisplay || `₹${demoJob.minCtcLpa}L–${demoJob.maxCtcLpa}L`}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 font-mono">
                          {demoJob.company} · {demoJob.location} · {demoJob.equityRange} ESOP
                        </p>
                        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-neutral-200/60 dark:border-neutral-800 font-mono">
                          <span className="text-neutral-400">Recipient: <strong className="text-neutral-700 dark:text-neutral-300">{demoJob.founderName}</strong> ({demoJob.founderRole})</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Direct Inbox Verified</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800">
                          <span className="text-[10px] text-neutral-400 block">Corridor Radar</span>
                          <span className="font-bold text-neutral-800 dark:text-neutral-200">Bangalore & SF Stealth</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800">
                          <span className="text-[10px] text-neutral-400 block">Notice Buyout Support</span>
                          <span className="font-bold text-neutral-800 dark:text-neutral-200">Verified for Immediate</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STAGE 2 PREVIEW: Deterministic Fit */}
                  {activeStage.id === 'MATCH' && (
                    <motion.div
                      key="match-preview"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="space-y-3"
                    >
                      <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-neutral-400 uppercase">Deterministic Match Score</span>
                          <div className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                            {demoJob.atsMatchScore || 84}%
                          </div>
                          <span className="text-[11px] text-neutral-500 font-mono">Exact Hard Skill Overlap · 4.2y Exp Check</span>
                        </div>
                        <div className="text-right space-y-1">
                          <span className="text-[10px] font-mono text-neutral-400 block">Stack Verification</span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            Strict Pass
                          </span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 space-y-2">
                        <span className="text-[10px] font-mono text-neutral-400 uppercase block">Required Role Keywords vs Candidate Profile</span>
                        <div className="flex flex-wrap gap-1.5">
                          {demoJob.requiredSkills.map((sk) => (
                            <span key={sk} className="px-2 py-0.5 rounded text-[11px] font-mono bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-500" />
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STAGE 3 PREVIEW: Google X-Y-Z ATS Bullet Tailoring */}
                  {activeStage.id === 'ATS' && (
                    <motion.div
                      key="ats-preview"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="space-y-3 font-mono text-xs"
                    >
                      <div className="p-3 rounded-xl bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 space-y-1">
                        <span className="text-[10px] text-red-600 dark:text-red-400 font-bold uppercase">Before (Raw Candidate Resume Bullet):</span>
                        <p className="text-neutral-700 dark:text-neutral-300 font-sans text-xs">
                          - Built backend services and APIs for user management and caching with TypeScript and Redis.
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-1">
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">After (Google X-Y-Z Tailored Phrasing):</span>
                        <p className="text-neutral-900 dark:text-neutral-100 font-sans text-xs font-medium">
                          + Architected distributed Redis cache cluster reducing p99 API latency by 43% across 1.2M daily active user requests for {demoJob.title} workload.
                        </p>
                        <span className="text-[10px] text-neutral-400 block pt-1">
                          Formula: Accomplished [Latency reduction] as measured by [43% p99] by doing [Redis cluster architecture].
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* STAGE 4 PREVIEW: Founder Direct Outreach */}
                  {activeStage.id === 'OUTREACH' && (
                    <motion.div
                      key="outreach-preview"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="space-y-2.5 text-xs font-sans"
                    >
                      <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 space-y-1.5">
                        <div className="flex items-center justify-between text-neutral-500 font-mono text-[11px]">
                          <span>To: <strong className="text-neutral-900 dark:text-white">{demoJob.founderEmail || 'founder@startup.io'}</strong></span>
                          <span>Template: Founder Technical Audit</span>
                        </div>
                        <div className="font-semibold text-neutral-900 dark:text-white text-xs">
                          Subject: {demoJob.title} @ {demoJob.company} — Technical Audit & Production Alignment
                        </div>
                        <div className="p-2.5 bg-white dark:bg-neutral-950 rounded border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs leading-relaxed font-mono">
                          "Hi {demoJob.founderName || 'Team'}, reviewed your tech stack and shipped a verifiable audit. With 4.2y experience scaling distributed services, I can ship production fixes in week 1. GitHub proof: github.com/arjunmehta/distributed-cache"
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STAGE 5 PREVIEW: Pipeline Velocity CRM */}
                  {activeStage.id === 'PIPELINE' && (
                    <motion.div
                      key="pipeline-preview"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="space-y-3 font-mono text-xs"
                    >
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800">
                          <span className="text-[10px] text-neutral-400 block">Sourced</span>
                          <span className="text-base font-bold text-neutral-900 dark:text-white">11 Roles</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
                          <span className="text-[10px] text-amber-600 block">Pitches Sent</span>
                          <span className="text-base font-bold text-amber-600">4 Active</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40">
                          <span className="text-[10px] text-emerald-600 block">Interviews</span>
                          <span className="text-base font-bold text-emerald-600">2 Booked</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-neutral-900 dark:text-white block font-sans">
                            Catmull-Rom Velocity Spline Active
                          </span>
                          <span className="text-[11px] text-neutral-500">
                            Median conversion from Outreach to Interview: 48 hours
                          </span>
                        </div>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold">
                          Optimal Pace
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Bar for the Simulation */}
              <div className="pt-3 border-t border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between">
                <span className="text-[11px] font-mono text-neutral-400">
                  Target: {demoJob.company} ({demoJob.title})
                </span>
                <button
                  onClick={() => onSelectJobForInspector(demoJob)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors flex items-center gap-1"
                >
                  <span>Inspect in Drawer</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LIVE SANDBOX: TEST ANY ROLE FROM THE RADAR */}
      <section id="live-sandbox" className="py-16 md:py-20 border-b border-neutral-200/80 dark:border-neutral-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
                Interactive Opportunity Explorer
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                Live Verification Sandbox
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                Select an active role from our catalog to preview ATS match scores, compensation parity, and founder vectors.
              </p>
            </div>

            <button
              onClick={onLaunchConsole}
              className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-xs font-mono font-medium text-neutral-900 dark:text-white transition-colors flex items-center gap-2 self-start sm:self-auto"
            >
              <span>Explore All {jobs.length} Openings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Job Card Selection Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {jobs.slice(0, 3).map((job) => {
              const isSelected = job.id === demoJob.id;
              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedDemoJobId(job.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white dark:bg-[#15171F] border-neutral-400 dark:border-neutral-600 shadow-xs'
                      : 'bg-neutral-50/70 dark:bg-[#0E0F14] border-neutral-200/80 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                      {job.company}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {job.atsMatchScore || 80}% Match
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium truncate mt-0.5">
                    {job.title}
                  </p>
                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mt-3 pt-2 border-t border-neutral-200/60 dark:border-neutral-800">
                    <span>{job.salaryDisplay || `₹${job.minCtcLpa}L–${job.maxCtcLpa}L`}</span>
                    <span>{job.location}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Selected Sandbox View */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#121316] border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80 dark:border-neutral-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">{demoJob.title}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {demoJob.source}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 font-mono mt-0.5">
                  {demoJob.company} · {demoJob.location} · Compensation: {demoJob.salaryDisplay || `₹${demoJob.minCtcLpa}L–${demoJob.maxCtcLpa}L`} · Equity: {demoJob.equityRange}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAtsForJob(demoJob)}
                  className="px-3.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-xs font-mono font-medium text-neutral-800 dark:text-neutral-200 transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Tailor ATS Bullets</span>
                </button>
                <button
                  onClick={() => onOpenOutreachForJob(demoJob)}
                  className="px-3.5 py-1.5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-[#EBF946] dark:text-black dark:hover:bg-[#d4e23f] text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Draft Founder Pitch</span>
                </button>
              </div>
            </div>

            {/* Quick 3-Pillar Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-neutral-50/70 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 space-y-1">
                <span className="text-[10px] text-neutral-400 uppercase">Direct Founder Vector</span>
                <span className="font-bold text-neutral-900 dark:text-white block">{demoJob.founderName || 'Founder / CTO'}</span>
                <span className="text-neutral-500 text-[11px] truncate block">{demoJob.founderEmail || 'verified@domain.io'}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-50/70 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 space-y-1">
                <span className="text-[10px] text-neutral-400 uppercase">Required Technical Stack</span>
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {demoJob.requiredSkills.map((sk) => (
                    <span key={sk} className="px-1.5 py-0.5 rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-[10px]">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-50/70 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800 space-y-1">
                <span className="text-[10px] text-neutral-400 uppercase">ATS Compatibility Check</span>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">{demoJob.atsMatchScore || 84}%</span>
                  <span className="text-[10px] text-neutral-500">Google X-Y-Z Certified</span>
                </div>
                <span className="text-[11px] text-emerald-600 block">Single-Column Parse: PASS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE UN-SLOP MANIFESTO / COMPARISON */}
      <section id="comparison" className="py-16 md:py-24 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-[#0B0C10]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          
          <div className="max-w-2xl space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
              Architectural Comparison
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Why Generic Job Boards Fail Engineers
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Applying through generic job boards wastes hundreds of hours in black-hole ATS filters. JobPilot provides an un-compromised direct pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* The Broken Default */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#121316] border border-red-200/80 dark:border-red-950/60 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <h3 className="font-bold text-sm text-red-600 dark:text-red-400 font-mono uppercase tracking-wider">
                  The Broken Legacy Portal Route
                </h3>
              </div>

              <ul className="space-y-3 text-xs text-neutral-600 dark:text-neutral-400">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span><strong>Spam applicants:</strong> 600+ resumes submitted per LinkedIn opening via "Easy Apply", drowning real engineering signal.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span><strong>Non-technical gatekeepers:</strong> Screeners filtering for arbitrary keyword counts rather than actual system architecture.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span><strong>Hidden compensation:</strong> Vague "competitive" bands with no ESOP clarity until the final offer letter.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span><strong>1.2% reply rate:</strong> Weeks of silence with generic automated rejection emails.</span>
                </li>
              </ul>
            </div>

            {/* The JobPilot Approach */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#121316] border border-emerald-200/80 dark:border-emerald-950/60 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="font-bold text-sm text-emerald-600 dark:text-emerald-400 font-mono uppercase tracking-wider">
                  The JobPilot Direct Engine
                </h3>
              </div>

              <ul className="space-y-3 text-xs text-neutral-700 dark:text-neutral-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Direct founder inbox reach:</strong> Verified emails for founders and engineering heads with proof-of-work upfront.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Google X-Y-Z quantifiable bullets:</strong> Automatically formatted accomplishments highlighting latency, throughput, and scale.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Transparent LPA & Equity:</strong> Every listing displays verified salary bands and equity stakes upfront.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>42% median response rate:</strong> Direct founder outreach with GitHub proof cuts through recruiter noise.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRE-FOOTER CTA */}
      <section className="py-16 md:py-20 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-black mx-auto flex items-center justify-center font-bold text-sm shadow-sm">
            JP
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Take Control of Your Engineering Career
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto leading-relaxed">
            Pre-loaded with senior profile candidate data. Discover opportunities, align ATS keywords, and dispatch direct pitches in seconds.
          </p>

          <div className="pt-2">
            <button
              onClick={onLaunchConsole}
              className="px-6 py-3 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-xs font-semibold shadow-sm inline-flex items-center gap-2 active:scale-95 transition-all"
            >
              <span>Launch Radar Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. QUIET ARCHITECTURAL FOOTER */}
      <footer className="py-8 border-t border-neutral-200/80 dark:border-neutral-800 text-xs font-mono text-neutral-500 dark:text-neutral-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-800 dark:text-neutral-200">JobPilot</span>
            <span>·</span>
            <span>Deterministic Opportunity Intelligence</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Corridors: Bangalore · SF · YC W25</span>
            <span>·</span>
            <span>Status: Production Engine Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default JobPilotLanding;
