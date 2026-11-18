import React, { useState } from 'react';
import type { JobListing, CandidateProfile } from '../types';
import { 
  CheckCircle2, 
  Send, 
  Sparkles
} from 'lucide-react';

interface JobAgentViewProps {
  job: JobListing;
  candidate: CandidateProfile;
  jobs: JobListing[];
  onSelectJob: (job: JobListing) => void;
  onSubmitApplication: (job: JobListing, notes: string) => void;
  onNavigateToJobs?: () => void;
}

export const JobAgentView: React.FC<JobAgentViewProps> = ({
  job,
  candidate,
  jobs,
  onSelectJob,
  onSubmitApplication,
  onNavigateToJobs: _onNavigateToJobs,
}) => {
  // Form state
  const [fullName, setFullName] = useState(candidate.fullName || 'Arjun Mehta');
  const [email, setEmail] = useState(candidate.email || 'arjun.mehta@devmail.io');
  const [skills, setSkills] = useState(
    [...candidate.primarySkills, ...job.requiredSkills.slice(0, 3)].filter((v, i, a) => a.indexOf(v) === i).join(', ')
  );
  const [portfolioUrl, setPortfolioUrl] = useState('https://github.com/arjunmehta/proof-dossier');
  const [pitchNote, setPitchNote] = useState(
    `Excited to apply for the ${job.title} at ${job.company}. Built distributed telemetry ingestion pipelines handling 50k+ req/sec in TypeScript and FastAPI.`
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Agent fill simulation state
  const [agentStep, setAgentStep] = useState<number>(2); // 1 = reading, 2 = profile details, 3 = filling skills, 4 = ready
  const [isSimulating, setIsSimulating] = useState(false);

  const handleRunAgent = () => {
    setIsSimulating(true);
    setAgentStep(1);

    setTimeout(() => {
      setAgentStep(2);
      setFullName(candidate.fullName);
      setEmail(candidate.email);
    }, 700);

    setTimeout(() => {
      setAgentStep(3);
      setSkills(job.requiredSkills.join(', '));
      setPitchNote(`Aligned with ${job.company}'s engineering stack (${job.requiredSkills.slice(0, 3).join(', ')}). Ready to deploy week 1.`);
    }, 1500);

    setTimeout(() => {
      setAgentStep(4);
      setIsSimulating(false);
    }, 2200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    onSubmitApplication(job, pitchNote);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAFAFC] dark:bg-[#0D0F15] text-slate-900 dark:text-[#F3F4F6] overflow-y-auto font-sans">
      
      {/* 1. Header bar matching Careerlift browser mockup */}
      <div className="border-b border-slate-200/80 dark:border-[#222634] bg-white dark:bg-[#121520] px-6 py-2.5 flex items-center justify-between text-xs text-slate-500 font-mono">
        <span className="uppercase tracking-wider font-semibold text-[11px] text-slate-400">
          Sample Google Form · Illustrative Application
        </span>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Target Role:</span>
          <select
            value={job.id}
            onChange={(e) => {
              const found = jobs.find((j) => j.id === e.target.value);
              if (found) onSelectJob(found);
            }}
            className="bg-transparent border border-slate-200 dark:border-neutral-700 rounded px-2 py-0.5 text-xs text-slate-800 dark:text-neutral-200 outline-none"
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.id} className="bg-white dark:bg-neutral-900">
                {j.title} · {j.company}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="max-w-5xl w-full mx-auto px-6 py-8 sm:py-12 space-y-8">
        
        {/* 2. Headline matching Image 4 */}
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {job.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-neutral-400">
            {job.company} · Sample application form
          </p>
        </div>

        {/* 3. Two-Column Split Layout matching Image 4 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: The actual form preview */}
          <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-[#151824] border border-slate-200/80 dark:border-[#242838] p-6 sm:p-8 shadow-xs">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#262B3A] bg-slate-50/50 dark:bg-[#10121A] text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                  placeholder="e.g. Alex Sharma"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#262B3A] bg-slate-50/50 dark:bg-[#10121A] text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                  placeholder="e.g. alex.sharma@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
                  Relevant skills
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#262B3A] bg-slate-50/50 dark:bg-[#10121A] text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                  placeholder="e.g. React, TypeScript, Python"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
                  Portfolio / GitHub proof link
                </label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#262B3A] bg-slate-50/50 dark:bg-[#10121A] text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                  placeholder="https://github.com/..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
                  Candidate Note / Why {job.company}?
                </label>
                <textarea
                  rows={3}
                  value={pitchNote}
                  onChange={(e) => setPitchNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-[#262B3A] bg-slate-50/50 dark:bg-[#10121A] text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm shadow-sm active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitted ? 'Submitted to Application CRM ✓' : 'Submit application'}</span>
                </button>
              </div>

            </form>
          </div>

          {/* RIGHT COLUMN: The CAREERLIFT / JOBPILOT AGENT card (Exact Image 4 match) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="rounded-2xl bg-white dark:bg-[#151824] border border-slate-200/80 dark:border-[#242838] p-6 shadow-xs space-y-6">
              
              {/* Agent Pill Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-extrabold text-[11px] tracking-wider uppercase border border-blue-200 dark:border-blue-900/40">
                <span>JobPilot Agent</span>
              </div>

              {/* Title & Sub */}
              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Your profile. Less typing.
                </h2>
                <p className="text-xs text-slate-500 dark:text-neutral-400">
                  Google Forms · desktop Chrome / Edge
                </p>
              </div>

              {/* Stepper / Checklist from Image 4 */}
              <div className="space-y-3.5 text-xs font-medium">
                
                {/* Step 1 */}
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-slate-800 dark:text-neutral-200">
                    Reading the form
                  </span>
                </div>

                {/* Step 2 */}
                <div className="flex items-center gap-3">
                  {agentStep >= 2 ? (
                    <span className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </span>
                  ) : (
                    <span className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-neutral-600 shrink-0" />
                  )}
                  <span className={agentStep >= 2 ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400'}>
                    Adding your profile details
                  </span>
                </div>

                {/* Step 3 */}
                <div className="flex items-center gap-3">
                  {agentStep >= 3 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-neutral-600 shrink-0" />
                  )}
                  <span className={agentStep >= 3 ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400'}>
                    Filling relevant skills
                  </span>
                </div>

                {/* Step 4 */}
                <div className="flex items-center gap-3">
                  {agentStep >= 4 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-neutral-600 shrink-0" />
                  )}
                  <span className={agentStep >= 4 ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-400'}>
                    Ready for your review
                  </span>
                </div>

              </div>

              {/* Run Simulation Trigger */}
              <button
                type="button"
                onClick={handleRunAgent}
                disabled={isSimulating}
                className="w-full py-2.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-bold text-xs hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isSimulating ? 'Agent is typing...' : 'Run Agent Auto-Fill'}</span>
              </button>

              {/* Blue Banner matching Image 4 */}
              <div className="p-3.5 rounded-xl bg-[#EFF6FF] dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30 text-center">
                <span className="text-xs font-bold text-[#1E40AF] dark:text-blue-300">
                  Review every field. You submit.
                </span>
              </div>

            </div>

            {/* Bottom Caption matching Image 4 */}
            <p className="text-xs text-center text-slate-400 dark:text-neutral-500">
              The Agent fills supported Google Forms and startup portals from your profile.
            </p>

          </div>

        </div>

      </div>
    </div>
  );
};
