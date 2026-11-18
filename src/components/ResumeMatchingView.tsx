import React, { useState } from 'react';
import type { JobListing, CandidateProfile } from '../types';
import { parseResumeText } from '../lib/resumeDetector';
import { analyzeJobMatch } from '../lib/matchReasoning';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  ArrowRight, 
  MapPin
} from 'lucide-react';

interface ResumeMatchingViewProps {
  candidate: CandidateProfile;
  jobs: JobListing[];
  onUpdateCandidate: (updated: CandidateProfile) => void;
  onSelectJob: (job: JobListing) => void;
  onNavigateToJobs: () => void;
  onNavigateToAgent: (job: JobListing) => void;
}

export const ResumeMatchingView: React.FC<ResumeMatchingViewProps> = ({
  candidate,
  jobs,
  onUpdateCandidate,
  onSelectJob,
  onNavigateToJobs,
  onNavigateToAgent,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedFeedback, setParsedFeedback] = useState<string | null>(null);

  const handleProcessText = (rawText: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      const res = parseResumeText(rawText);
      const updated: CandidateProfile = {
        ...candidate,
        primarySkills: res.detectedSkills.length > 0 ? res.detectedSkills : candidate.primarySkills,
        targetRoles: res.detectedRoles.length > 0 ? res.detectedRoles : candidate.targetRoles,
        location: res.detectedLocations[0] || candidate.location,
        yearsOfExperience: res.detectedYearsOfExperience ?? candidate.yearsOfExperience,
      };
      onUpdateCandidate(updated);
      setIsProcessing(false);
      setParsedFeedback(`Parsed ${res.detectedSkills.length} skills & matched ${res.detectedRoles.join(', ')}`);
    }, 450);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) handleProcessText(text);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) handleProcessText(text);
      };
      reader.readAsText(file);
    }
  };

  // Quick sample profile click
  const handleLoadSample = (name: string, role: string, skills: string[], yoe: number) => {
    const updated: CandidateProfile = {
      ...candidate,
      fullName: name,
      targetRoles: [role],
      primarySkills: skills,
      yearsOfExperience: yoe,
    };
    onUpdateCandidate(updated);
    setParsedFeedback(`Loaded sample profile for ${name} (${role})`);
  };

  // Top matching jobs for current profile
  const scoredJobs = jobs
    .map((j) => ({ job: j, match: analyzeJobMatch(j, candidate) }))
    .sort((a, b) => b.match.matchScore - a.match.matchScore);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAFAFC] dark:bg-[#0D0F15] text-slate-900 dark:text-[#F3F4F6] overflow-y-auto font-sans">
      
      {/* 1. Subtle Sub-header matching Careerlift browser mockup */}
      <div className="border-b border-slate-200/80 dark:border-[#222634] bg-white dark:bg-[#121520] px-6 py-2.5 flex items-center justify-between text-xs text-slate-500 font-mono">
        <span className="uppercase tracking-wider font-semibold text-[11px] text-slate-400">
          From Search to Shortlist · Matching Engine
        </span>
        <span className="text-slate-400">
          Illustrative demo · sample profile and results
        </span>
      </div>

      <div className="max-w-4xl w-full mx-auto px-6 py-10 sm:py-14 space-y-8">
        
        {/* 2. Hero Headline matching Image 5 */}
        <div className="space-y-2 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Find the roles that fit your resume.
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-neutral-400">
            Upload a CV. Understand your skills, eligibility and experience fit.
          </p>
        </div>

        {/* 3. The Careerlift CV Dropzone Card (Exact Image 5 match) */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative rounded-3xl border-2 border-dashed p-10 sm:p-14 text-center transition-all bg-white dark:bg-[#151824] ${
            isDragging
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
              : 'border-slate-200 dark:border-[#242838] hover:border-slate-300 dark:hover:border-neutral-600 shadow-xs'
          }`}
        >
          {/* PDF Pill Badge */}
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm shadow-xs border border-blue-100 dark:border-blue-900/40 mb-5">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Drop your resume here
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-2 mb-6 font-medium">
            PDF · TXT · Sample profile for this walkthrough
          </p>

          <label className="inline-block cursor-pointer">
            <input
              type="file"
              accept=".pdf,.txt,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
            <span className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm shadow-sm inline-flex items-center gap-2 active:scale-95 transition-all">
              <UploadCloud className="w-4 h-4" />
              <span>{isProcessing ? 'Analyzing Resume...' : 'Choose CV'}</span>
            </span>
          </label>

          {parsedFeedback && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{parsedFeedback}</span>
            </div>
          )}

          {/* Quick-Pick Sample Profiles */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-[#212433] flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 mr-1">Or test with verified sample:</span>
            <button
              onClick={() => handleLoadSample('Arjun Mehta', 'Full Stack Developer', ['react', 'typescript', 'python', 'fastapi', 'docker'], 4)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#1E2230] text-slate-700 dark:text-neutral-300 hover:bg-slate-200 transition-colors font-medium"
            >
              Arjun · Full Stack (4y)
            </button>
            <button
              onClick={() => handleLoadSample('Priya Rao', 'AI Engineer', ['python', 'pytorch', 'huggingface', 'fastapi'], 2)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#1E2230] text-slate-700 dark:text-neutral-300 hover:bg-slate-200 transition-colors font-medium"
            >
              Priya · ML/AI (2y)
            </button>
            <button
              onClick={() => handleLoadSample('Tanvi Shah', 'Product Designer', ['figma', 'ux', 'prototyping', 'design systems'], 3)}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#1E2230] text-slate-700 dark:text-neutral-300 hover:bg-slate-200 transition-colors font-medium"
            >
              Tanvi · Product Design (3y)
            </button>
          </div>
        </div>

        {/* 4. Instant Fit Results Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Best Matches for Your Profile
              </h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Skills detected: {candidate.primarySkills.slice(0, 6).join(', ')} · Target role: {candidate.targetRoles?.[0] || 'Software Engineer'}
              </p>
            </div>
            <button
              onClick={onNavigateToJobs}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
            >
              <span>Explore all {jobs.length} opportunities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {scoredJobs.slice(0, 4).map(({ job, match }) => (
              <div
                key={job.id}
                onClick={() => onSelectJob(job)}
                className="p-5 rounded-2xl bg-white dark:bg-[#151824] border border-slate-200/80 dark:border-[#242838] hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer shadow-xs space-y-3 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">
                      {job.company}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-neutral-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {job.location} · {job.isRemote ? 'Remote Friendly' : 'In-Office'}
                    </span>
                  </div>

                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${
                    match.relevance === 'strong'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  }`}>
                    <span>{match.badgeLabel}</span>
                    <span className="tabular-nums font-black">{match.matchScore}%</span>
                  </span>
                </div>

                {/* Compensation */}
                <div className="text-xs font-extrabold text-slate-900 dark:text-white tabular-nums">
                  {job.salaryDisplay || `₹${job.minCtcLpa}–${job.maxCtcLpa} LPA`}
                  <span className="text-slate-400 font-normal ml-2">
                    {job.equityRange && !job.equityRange.toLowerCase().includes('none') ? job.equityRange : 'Standard ESOP'}
                  </span>
                </div>

                {/* Plain-English Transparent Match Line */}
                <p className="text-[11px] font-mono text-slate-600 dark:text-neutral-400 line-clamp-2 bg-slate-50 dark:bg-[#10121A] p-2 rounded-lg border border-slate-100 dark:border-[#1E2230]">
                  {match.summaryLine}
                </p>

                {/* Action Buttons */}
                <div className="pt-1 flex items-center justify-between border-t border-slate-100 dark:border-[#212433]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigateToAgent(job);
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>Apply with Agent</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => onSelectJob(job)}
                    className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  >
                    View details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
