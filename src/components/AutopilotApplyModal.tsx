import React, { useState, useEffect } from 'react';
import type { JobListing, CandidateProfile } from '../types';
import { 
  X, 
  Terminal, 
  CheckCircle2, 
  ShieldCheck, 
  Bot, 
  Check, 
  Loader2 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AutopilotApplyModalProps {
  job: JobListing;
  candidate: CandidateProfile;
  onClose: () => void;
  onApplicationCompleted: (job: JobListing) => void;
}

interface StepInfo {
  id: number;
  label: string;
  detail: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED';
}

export const AutopilotApplyModal: React.FC<AutopilotApplyModalProps> = ({
  job,
  candidate,
  onClose,
  onApplicationCompleted,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    `[00:00:01] [SYSTEM] Initiating Autonomous Reverse Recruiter agent for ${job.company}...`,
  ]);

  const [steps, setSteps] = useState<StepInfo[]>([
    {
      id: 1,
      label: 'Ashby / Greenhouse DOM Inspection',
      detail: 'Extracting application form schema & mandatory fields',
      status: 'RUNNING',
    },
    {
      id: 2,
      label: 'Google X-Y-Z ATS Resume Synthesis',
      detail: `Embedding ${job.requiredSkills.slice(0, 3).join(', ')} & 120k RPM metrics`,
      status: 'PENDING',
    },
    {
      id: 3,
      label: 'Headless Chromium Form Auto-Fill',
      detail: `Submitting profile, 15-day notice, and ₹${candidate.minTargetCtcLpa}L target CTC`,
      status: 'PENDING',
    },
    {
      id: 4,
      label: 'CrackColdEmail Founder Outreach',
      detail: `Dispatching 80% response pitch to ${job.founderName} (${job.founderEmail})`,
      status: 'PENDING',
    },
    {
      id: 5,
      label: 'Telemetry & Inbound CRM Synchronization',
      detail: 'Application ID captured and 3-day follow-up countdown initiated',
      status: 'PENDING',
    },
  ]);

  useEffect(() => {
    // Step 1 -> 2
    const timer1 = setTimeout(() => {
      setSteps(prev => prev.map(s => s.id === 1 ? { ...s, status: 'COMPLETED' } : s.id === 2 ? { ...s, status: 'RUNNING' } : s));
      setCurrentStep(2);
      setLogs(prev => [
        ...prev,
        `[00:00:02] [ASHBY] Form target identified: 8 input fields verified (name, email, phone, resume, notice, salary, portfolio).`,
        `[00:00:02] [ATS_ENGINE] Evaluating candidate resume against ${job.title} JD keywords...`,
        `[00:00:03] [ATS_ENGINE] Semantic match: 94.6%. Generating tailored single-column PDF...`,
      ]);
    }, 1200);

    // Step 2 -> 3
    const timer2 = setTimeout(() => {
      setSteps(prev => prev.map(s => s.id === 2 ? { ...s, status: 'COMPLETED' } : s.id === 3 ? { ...s, status: 'RUNNING' } : s));
      setCurrentStep(3);
      setLogs(prev => [
        ...prev,
        `[00:00:04] [PLAYWRIGHT] Headless browser session launched (Chromium 124.0).`,
        `[00:00:04] [PLAYWRIGHT] page.fill('input[name="fullName"]', '${candidate.fullName}')`,
        `[00:00:04] [PLAYWRIGHT] page.fill('input[name="email"]', '${candidate.email}')`,
        `[00:00:05] [PLAYWRIGHT] page.setInputFiles('input[type="file"]', 'Arjun_Mehta_Tailored.pdf')`,
        `[00:00:05] [PLAYWRIGHT] page.fill('input[name="noticePeriod"]', '15 Days (Buyout Eligible)')`,
      ]);
    }, 2800);

    // Step 3 -> 4
    const timer3 = setTimeout(() => {
      setSteps(prev => prev.map(s => s.id === 3 ? { ...s, status: 'COMPLETED' } : s.id === 4 ? { ...s, status: 'RUNNING' } : s));
      setCurrentStep(4);
      setLogs(prev => [
        ...prev,
        `[00:00:06] [ASHBY] Form submitted! HTTP 201 Created. Application confirmation ID: #ASH-${Math.floor(100000 + Math.random() * 900000)}`,
        `[00:00:06] [OUTREACH] Constructing 4-part pitch for founder ${job.founderName}...`,
        `[00:00:07] [OUTREACH] Dispatched via Gmail webhook with read-receipt telemetry.`,
      ]);
    }, 4500);

    // Step 4 -> 5
    const timer4 = setTimeout(() => {
      setSteps(prev => prev.map(s => s.id === 4 ? { ...s, status: 'COMPLETED' } : s.id === 5 ? { ...s, status: 'RUNNING' } : s));
      setCurrentStep(5);
      setLogs(prev => [
        ...prev,
        `[00:00:08] [CRM] Card moved to 'OUTREACH_SENT' column.`,
        `[00:00:08] [CRM] 3-Day follow-up timer scheduled for Thursday 10:00 AM IST.`,
        `[00:00:09] [AGENT] Autonomous execution complete with 100% success rate.`,
      ]);
    }, 6200);

    // Finished
    const timer5 = setTimeout(() => {
      setSteps(prev => prev.map(s => ({ ...s, status: 'COMPLETED' })));
      setIsFinished(true);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10B981', '#EDEDED', '#6366F1']
      });
      onApplicationCompleted(job);
    }, 7400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [job, candidate]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0c0d12] border border-neutral-800 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 text-[#EDEDED]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-800/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white">
              <Bot className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Autonomous Apply Simulator</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-neutral-900 border border-neutral-800 text-neutral-300">
                  {job.company}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5 font-mono">
                Executing headless Playwright application + CrackColdEmail founder dispatch
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

        {/* Stepper Progress Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-400">Agent Pipeline Execution</span>
            <span className="text-emerald-400 font-bold">
              {isFinished ? 'Completed (100%)' : `Step ${currentStep} of 5`}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5">
            {steps.map((s) => (
              <div
                key={s.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s.status === 'COMPLETED'
                    ? 'bg-emerald-400'
                    : s.status === 'RUNNING'
                    ? 'bg-indigo-400 animate-pulse'
                    : 'bg-neutral-800'
                }`}
              />
            ))}
          </div>

          <div className="space-y-2 pt-2">
            {steps.map((s) => (
              <div
                key={s.id}
                className={`p-3 rounded-xl border text-xs font-mono flex items-center justify-between transition-all ${
                  s.status === 'RUNNING'
                    ? 'bg-neutral-900 border-neutral-700 text-white'
                    : s.status === 'COMPLETED'
                    ? 'bg-[#111115] border-neutral-800/80 text-neutral-400'
                    : 'bg-[#0c0d12] border-neutral-900 text-neutral-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  {s.status === 'COMPLETED' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : s.status === 'RUNNING' ? (
                    <Loader2 className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-neutral-700 shrink-0" />
                  )}
                  <div>
                    <span className="font-bold text-white block">{s.label}</span>
                    <span className="text-[11px] text-neutral-400">{s.detail}</span>
                  </div>
                </div>

                <span className="text-[10px] uppercase font-bold tracking-wider">
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Real-Time Terminal Logs Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-neutral-400" />
              <span>Headless Chromium & Dispatch Telemetry</span>
            </span>
            <span className="text-[10px] text-neutral-500">Live Socket Feed</span>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 font-mono text-[11px] text-neutral-300 space-y-1.5 max-h-[160px] overflow-y-auto">
            {logs.map((log, index) => (
              <div
                key={index}
                className={
                  log.includes('Ashby') || log.includes('ASHBY')
                    ? 'text-indigo-300'
                    : log.includes('PLAYWRIGHT')
                    ? 'text-cyan-300'
                    : log.includes('OUTREACH')
                    ? 'text-amber-300'
                    : log.includes('CRM') || log.includes('AGENT')
                    ? 'text-emerald-400'
                    : 'text-neutral-400'
                }
              >
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-800 font-mono">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Targeting Founder: <strong className="text-white">{job.founderName}</strong></span>
          </div>

          {isFinished ? (
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-white hover:bg-neutral-200 text-black text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>View in Application CRM</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              <span>Simulating Autonomous Application...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AutopilotApplyModal;
