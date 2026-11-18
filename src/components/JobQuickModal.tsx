import React from 'react';
import type { JobListing } from '../types';
import { X, Sparkles } from 'lucide-react';

interface JobQuickModalProps {
  job: JobListing | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyWithAgent: (job: JobListing) => void;
}

export const JobQuickModal: React.FC<JobQuickModalProps> = ({
  job,
  isOpen,
  onClose,
  onApplyWithAgent,
}) => {
  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-xs transition-opacity" 
      />

      {/* Modal Card matching Image 3 */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#151824] rounded-3xl shadow-2xl border border-slate-200/90 dark:border-[#242838] p-6 sm:p-8 z-10 space-y-6 text-slate-900 dark:text-white font-sans animate-in fade-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Sample Badge from Image 3 */}
        <div>
          <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
            Sample Listing
          </span>
        </div>

        {/* Role Title & Metadata */}
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {job.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400">
            {job.company} · {job.location} · {job.isRemote ? 'Remote First' : 'Hybrid'}
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 dark:border-[#222636]" />

        {/* Headline & Requirements from Image 3 */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Build useful products. Learn with a team.
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-300 leading-relaxed">
            {job.description || `${job.requiredSkills.slice(0, 3).map((s) => s.toUpperCase()).join(', ')} and a demonstrated portfolio of shipped projects.`}
          </p>
          <p className="text-[11px] font-mono text-slate-400">
            Google Forms application · Premium desktop Agent
          </p>
        </div>

        {/* Action Button from Image 3 */}
        <div className="pt-2">
          <button
            onClick={() => {
              onClose();
              onApplyWithAgent(job);
            }}
            className="w-full py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Apply with Agent</span>
          </button>
        </div>

      </div>
    </div>
  );
};
