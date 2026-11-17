import React from 'react';
import type { JobListing } from '../types';
import { ArrowRight, Briefcase, Code2, FileText, Mail } from 'lucide-react';

interface JobPilotFeaturesProps {
  jobs: JobListing[];
  trackedCount: number;
  onOpenOutreachModal: () => void;
  onOpenPortfolioModal: () => void;
  onOpenApplicationsTab: () => void;
  onExploreRoles: () => void;
}

export const JobPilotFeatures: React.FC<JobPilotFeaturesProps> = ({
  jobs,
  trackedCount,
  onOpenOutreachModal,
  onOpenPortfolioModal,
  onOpenApplicationsTab,
  onExploreRoles,
}) => {
  const previewJobs = jobs.slice(0, 2);

  return (
    <section className="space-y-10 py-8">
      <header className="mx-auto max-w-2xl space-y-3 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#1F1F1F] bg-[#0A0A0A] px-3 py-1.5 font-mono text-[11px] text-[#A1A1A1]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>One focused job-search workspace</span>
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Find a role. Make your case. Keep track.
        </h2>
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-[#A1A1A1] sm:text-base">
          Browse example startup listings, draft founder outreach, and keep your applications together in one browser-based workspace.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <article className="jp-card flex flex-col gap-5 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#A1A1A1]">
              <Briefcase className="h-4 w-4 text-white" />
              <span>ROLE DIRECTORY</span>
            </div>
            <span className="rounded-full border border-[#262626] bg-[#111111] px-2 py-1 text-[10px] font-mono text-[#A1A1A1]">
              {jobs.length} example {jobs.length === 1 ? 'role' : 'roles'}
            </span>
          </div>

          <div className="min-h-24 space-y-2 rounded-xl border border-[#1F1F1F] bg-[#050505] p-3">
            {previewJobs.length ? previewJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between gap-3 rounded-lg bg-[#0A0A0A] px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-white">{job.title}</p>
                  <p className="truncate text-[11px] text-[#888888]">{job.company} · {job.location}</p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#737373]" />
              </div>
            )) : (
              <p className="py-6 text-center text-xs text-[#888888]">No example roles are available.</p>
            )}
          </div>

          <p className="text-xs leading-relaxed text-[#A1A1A1]">
            Search by company, title, location, or skill. Check each source link for current availability.
          </p>
          <button onClick={onExploreRoles} className="mt-auto inline-flex min-h-10 items-center gap-2 self-start rounded-lg bg-white px-3.5 text-xs font-semibold text-black transition-colors hover:bg-neutral-200">
            Browse roles <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </article>

        <article className="jp-card flex flex-col gap-5 p-5 sm:p-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[#A1A1A1]">
            <Mail className="h-4 w-4 text-white" />
            <span>FOUNDER OUTREACH</span>
          </div>
          <div className="flex min-h-24 items-center gap-2 rounded-xl border border-[#1F1F1F] bg-[#050505] p-3">
            {['Context', 'Relevance', 'Proof', 'Small ask'].map((part, index) => (
              <React.Fragment key={part}>
                <span className="flex-1 rounded-lg border border-[#262626] bg-[#0A0A0A] px-2 py-2 text-center text-[10px] font-mono text-[#D4D4D4] sm:text-xs">
                  {part}
                </span>
                {index < 3 && <span aria-hidden="true" className="text-[#555555]">·</span>}
              </React.Fragment>
            ))}
          </div>
          <p className="text-xs leading-relaxed text-[#A1A1A1]">
            Build a draft from your profile and a selected role, then copy it or open it in your email client. Nothing is sent automatically.
          </p>
          <button onClick={onOpenOutreachModal} className="mt-auto inline-flex min-h-10 items-center gap-2 self-start rounded-lg border border-[#2A2A2A] bg-[#111111] px-3.5 text-xs font-semibold text-white transition-colors hover:bg-[#1A1A1A]">
            Open pitch composer <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </article>

        <article className="jp-card flex flex-col gap-5 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#A1A1A1]">
              <FileText className="h-4 w-4 text-white" />
              <span>APPLICATION TRACKER</span>
            </div>
            <span className="font-mono text-xs text-white">{trackedCount} saved</span>
          </div>
          <div className="grid min-h-24 grid-cols-3 gap-2 rounded-xl border border-[#1F1F1F] bg-[#050505] p-3">
            {['To review', 'Tailoring', 'Outreach'].map((stage) => (
              <div key={stage} className="flex flex-col justify-between rounded-lg border border-[#1F1F1F] bg-[#0A0A0A] p-2">
                <span className="h-1 w-5 rounded-full bg-[#737373]" />
                <span className="text-[10px] leading-tight text-[#A1A1A1]">{stage}</span>
              </div>
            ))}
          </div>
          <p className="text-xs leading-relaxed text-[#A1A1A1]">
            Save roles, update their stages, and export your tracker as CSV. Your profile and tracker stay in this browser.
          </p>
          <button onClick={onOpenApplicationsTab} className="mt-auto inline-flex min-h-10 items-center gap-2 self-start rounded-lg border border-[#2A2A2A] bg-[#111111] px-3.5 text-xs font-semibold text-white transition-colors hover:bg-[#1A1A1A]">
            Open tracker <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </article>

        <article className="jp-card flex flex-col gap-5 p-5 sm:p-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[#A1A1A1]">
            <Code2 className="h-4 w-4 text-white" />
            <span>GITHUB PROOF</span>
          </div>
          <div className="flex min-h-24 flex-col justify-center gap-2 rounded-xl border border-[#1F1F1F] bg-[#050505] p-3 font-mono">
            <span className="text-xs text-[#737373]">github.com/<span className="text-[#D4D4D4]">your-username</span></span>
            <div className="flex gap-2 text-[10px] text-[#A1A1A1]">
              <span className="rounded border border-[#262626] px-2 py-1">Public repos</span>
              <span className="rounded border border-[#262626] px-2 py-1">Copy proof block</span>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-[#A1A1A1]">
            Fetch public repository details on request and copy a short project summary to add to your pitch.
          </p>
          <button onClick={onOpenPortfolioModal} className="mt-auto inline-flex min-h-10 items-center gap-2 self-start rounded-lg border border-[#2A2A2A] bg-[#111111] px-3.5 text-xs font-semibold text-white transition-colors hover:bg-[#1A1A1A]">
            Open GitHub importer <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </article>
      </div>
    </section>
  );
};

export default JobPilotFeatures;
