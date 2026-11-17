import React, { useState, useEffect, useRef } from 'react';
import type { JobListing, CandidateProfile } from '../types';
import { 
  X, 
  Send, 
  RotateCcw, 
  FileText, 
  MapPin, 
  Mail,
  ExternalLink,
  Keyboard,
  BookmarkPlus,
  Search,
  CheckCircle2
} from 'lucide-react';
import { calculateQuickMatchScore } from '../lib/jobRadarEngine';

interface SwipeHistoryEntry {
  index: number;
  direction: 'LEFT' | 'RIGHT';
  job: JobListing;
}

interface CompanySwipeDeckProps {
  jobs: JobListing[];
  candidate: CandidateProfile;
  onPitch: (job: JobListing) => void;
  onTailorAts: (job: JobListing) => void;
  onAddToPipeline: (job: JobListing) => void;
  onRemoveFromPipeline?: (jobId: string) => void;
  onClearFilters: () => void;
  appliedJobIds: Set<string>;
}

export const CompanySwipeDeck: React.FC<CompanySwipeDeckProps> = ({
  jobs,
  candidate,
  onPitch,
  onTailorAts,
  onAddToPipeline,
  onRemoveFromPipeline,
  onClearFilters,
  appliedJobIds,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<SwipeHistoryEntry[]>([]);
  const [swipeDirection, setSwipeDirection] = useState<'LEFT' | 'RIGHT' | null>(null);
  const [streak, setStreak] = useState(0);
  const [clusterFilter, setClusterFilter] = useState<'ALL' | 'BLR' | 'YC' | 'NOTICE'>('ALL');

  // Drag physics state
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const activeCardRef = useRef<HTMLDivElement>(null);

  // Filtered jobs pool
  const filteredDeck = jobs.filter((job) => {
    if (clusterFilter === 'BLR') return job.location.toLowerCase().includes('bengaluru') || job.location.toLowerCase().includes('bangalore');
    if (clusterFilter === 'YC') return job.source.includes('YC');
    if (clusterFilter === 'NOTICE') return !!job.noticeBuyoutCovered;
    return true;
  });

  const validIndex = filteredDeck.length > 0 && currentIndex >= filteredDeck.length ? 0 : currentIndex;
  const activeJob = filteredDeck[validIndex];
  const nextJob = filteredDeck[validIndex + 1];
  const thirdJob = filteredDeck[validIndex + 2];

  const handleFilterSelect = (filter: 'ALL' | 'BLR' | 'YC' | 'NOTICE') => {
    setClusterFilter(filter);
    setCurrentIndex(0);
    setDragOffset({ x: 0, y: 0 });
  };

  const executeSwipe = (direction: 'LEFT' | 'RIGHT') => {
    if (!activeJob) return;

    setSwipeDirection(direction);

    if (direction === 'RIGHT') {
      onAddToPipeline(activeJob);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    const currentEntry: SwipeHistoryEntry = {
      index: validIndex,
      direction,
      job: activeJob,
    };

    setTimeout(() => {
      setHistory((prev) => [...prev, currentEntry]);
      setCurrentIndex((prev) => prev + 1);
      setSwipeDirection(null);
      setDragOffset({ x: 0, y: 0 });
    }, 220);
  };

  // Undo restores card index AND reverses pipeline / applied ID change
  const handleUndo = () => {
    if (history.length === 0) return;
    const lastEntry = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setCurrentIndex(lastEntry.index);
    setDragOffset({ x: 0, y: 0 });
    setSwipeDirection(null);

    if (lastEntry.direction === 'RIGHT' && onRemoveFromPipeline) {
      onRemoveFromPipeline(lastEntry.job.id);
      setStreak((prev) => Math.max(0, prev - 1));
    }
  };

  // Keyboard controls with modal boundary protection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
      if (document.querySelector('[role="dialog"]')) return;

      if (e.key === 'ArrowRight' || e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        executeSwipe('RIGHT');
      } else if (e.key === 'ArrowLeft' || e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        executeSwipe('LEFT');
      } else if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault();
        handleUndo();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (activeJob) onPitch(activeJob);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Pointer drag event handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('a, button')) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setDragOffset({ x: dx, y: dy * 0.4 });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch { /* ignore */ }

    const threshold = 110;
    if (dragOffset.x > threshold) {
      executeSwipe('RIGHT');
    } else if (dragOffset.x < -threshold) {
      executeSwipe('LEFT');
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch { /* ignore */ }
    setDragOffset({ x: 0, y: 0 });
  };

  const rotation = dragOffset.x * 0.08;
  const isRightVote = dragOffset.x > 40;
  const isLeftVote = dragOffset.x < -40;

  return (
    <div className="space-y-5 max-w-xl mx-auto select-none font-sans">
      {/* Top Deck Stats & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5 font-mono">
            <span>Opportunity Deck</span>
          </span>
          <span className="text-xs text-neutral-400">•</span>
          <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 tabular-nums">
            {filteredDeck.length > 0 ? Math.min(validIndex + 1, filteredDeck.length) : 0} of {filteredDeck.length}
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 text-[11px] font-mono bg-neutral-100 dark:bg-neutral-900 p-1 rounded-lg border border-neutral-200 dark:border-neutral-800">
          {(['ALL', 'BLR', 'YC', 'NOTICE'] as const).map((filter) => {
            const labels = {
              ALL: 'All',
              BLR: 'Bangalore',
              YC: 'YC Batch',
              NOTICE: 'Notice Buyout'
            };
            const active = clusterFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => handleFilterSelect(filter)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  active
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {labels[filter]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1 rounded-full overflow-hidden">
        <div
          className="bg-neutral-900 dark:bg-neutral-200 h-full transition-all duration-300"
          style={{ width: `${Math.min(100, (validIndex / Math.max(filteredDeck.length, 1)) * 100)}%` }}
        />
      </div>

      {/* Interactive Card Stage Container */}
      <div className="relative h-[430px] w-full flex items-center justify-center sm:h-[450px]">
        {activeJob ? (
          <div className="relative w-full h-full">
            {/* Third Card in Stack (Bottom) */}
            {thirdJob && (
              <div
                className="absolute inset-0 rounded-2xl bg-neutral-100 dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-neutral-800/60 pointer-events-none transition-transform duration-300"
                style={{
                  transform: 'scale(0.92) translateY(20px)',
                  zIndex: 1,
                  opacity: 0.5,
                }}
              />
            )}

            {/* Second Card in Stack (Middle) */}
            {nextJob && (
              <div
                className="absolute inset-0 rounded-2xl bg-white dark:bg-[#121316] border border-neutral-200 dark:border-neutral-800 pointer-events-none transition-transform duration-300 p-6 flex flex-col justify-between shadow-xs"
                style={{
                  transform: 'scale(0.96) translateY(10px)',
                  opacity: 0.85,
                  zIndex: 2,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${nextJob.logoColor} text-white font-bold flex items-center justify-center font-mono opacity-80 text-sm`}>
                    {nextJob.company.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">{nextJob.company}</h3>
                    <p className="text-xs text-neutral-500 font-mono">{nextJob.title}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Top Interactive Card */}
            <div
              ref={activeCardRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              className={`absolute inset-0 rounded-2xl bg-white dark:bg-[#121316] border border-neutral-200 dark:border-neutral-800 p-6 flex flex-col justify-between cursor-grab active:cursor-grabbing transition-transform shadow-md ${
                isDragging ? 'duration-0' : 'duration-300 ease-out'
              }`}
              style={{
                transform: swipeDirection === 'RIGHT'
                  ? 'translateX(120%) rotate(25deg)'
                  : swipeDirection === 'LEFT'
                  ? 'translateX(-120%) rotate(-25deg)'
                  : `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0px) rotate(${rotation}deg)`,
                zIndex: 10,
                touchAction: 'none',
              }}
            >
              {/* Clean Stamp Overlay when Swiping */}
              {(isRightVote || swipeDirection === 'RIGHT') && (
                <div 
                  className="absolute top-6 left-6 px-3.5 py-1 rounded-md border-2 border-emerald-600 dark:border-emerald-400 text-emerald-700 dark:text-emerald-400 font-bold text-xs tracking-wider uppercase rotate-[-8deg] pointer-events-none z-20 bg-emerald-50/90 dark:bg-emerald-950/80 backdrop-blur-xs"
                  style={{ opacity: swipeDirection === 'RIGHT' ? 1 : Math.min(1, Math.abs(dragOffset.x) / 70) }}
                >
                  SAVE TO PIPELINE
                </div>
              )}
              {(isLeftVote || swipeDirection === 'LEFT') && (
                <div 
                  className="absolute top-6 right-6 px-3.5 py-1 rounded-md border-2 border-rose-600 dark:border-rose-400 text-rose-700 dark:text-rose-400 font-bold text-xs tracking-wider uppercase rotate-[8deg] pointer-events-none z-20 bg-rose-50/90 dark:bg-rose-950/80 backdrop-blur-xs"
                  style={{ opacity: swipeDirection === 'LEFT' ? 1 : Math.min(1, Math.abs(dragOffset.x) / 70) }}
                >
                  PASS
                </div>
              )}

              {/* Card Top: Company Header & Tags */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-lg ${activeJob.logoColor} text-white font-bold text-base flex items-center justify-center font-mono shadow-xs`}>
                      {activeJob.company.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">{activeJob.company}</h3>
                        <a
                          href={activeJob.jobUrl || `https://www.google.com/search?q=${encodeURIComponent(activeJob.company + ' careers')}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                          title="Open source listing"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 font-mono mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-neutral-400" />
                          {activeJob.location}
                        </span>
                        {activeJob.fundingRound && (
                          <>
                            <span>•</span>
                            <span className="text-neutral-700 dark:text-neutral-300 font-medium">{activeJob.fundingRound}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Match Score Badge */}
                  <div
                    className="rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-1 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5"
                    title="Required skills matched with your profile"
                  >
                    <span>{calculateQuickMatchScore(candidate, activeJob)}% match</span>
                  </div>
                </div>

                {/* Role Title & Compensation Bar */}
                <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                  <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 tracking-tight leading-snug">
                    {activeJob.title}
                  </h2>
                  <div className="flex items-center gap-2 text-xs font-mono text-neutral-700 dark:text-neutral-300 tabular-nums">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">
                      {activeJob.salaryDisplay || `₹${activeJob.minCtcLpa}L–₹${activeJob.maxCtcLpa}L`}
                    </span>
                    <span className="text-neutral-300 dark:text-neutral-600">•</span>
                    <span className="text-neutral-600 dark:text-neutral-400">{activeJob.experienceDisplay || '2-4 YOE'}</span>
                    <span className="text-neutral-300 dark:text-neutral-600">•</span>
                    <span className="text-neutral-600 dark:text-neutral-400">{activeJob.equityRange}</span>
                  </div>
                </div>

                {/* Description Snippet */}
                <p className="text-xs text-neutral-600 dark:text-neutral-300 font-sans line-clamp-3 leading-relaxed">
                  {activeJob.description}
                </p>

                {/* Tech Stack Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeJob.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[11px] font-mono border border-neutral-200/60 dark:border-neutral-700/60"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Bottom: Contact Details */}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs font-mono text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-neutral-800 dark:text-neutral-200 font-medium">{activeJob.founderName}</span>
                  <span className="text-[10px] text-neutral-400">({activeJob.founderRole})</span>
                </div>

                <div
                  className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400"
                  title="Contact details listed on company radar"
                >
                  <Mail className="h-3.5 w-3.5 text-neutral-400" />
                  <span>Verified outreach channel</span>
                </div>
              </div>
            </div>
          </div>
        ) : filteredDeck.length === 0 ? (
          <div className="max-w-sm space-y-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 text-center font-mono">
            <Search className="mx-auto h-5 w-5 text-neutral-400" />
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">No roles match these filters</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-sans">
              Clear the cluster filter to explore active openings.
            </p>
            <button
              onClick={() => {
                setClusterFilter('ALL');
                setCurrentIndex(0);
                setHistory([]);
                onClearFilters();
              }}
              className="mt-2 px-3.5 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-md text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="text-center p-8 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-sm space-y-3 font-mono">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">All roles in deck reviewed</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-sans">
              You've triaged all roles under this stream. Switch filters or reset the deck to review again.
            </p>
            <button
              onClick={() => {
                setCurrentIndex(0);
                setHistory([]);
              }}
              className="mt-2 px-4 py-1.5 bg-neutral-900 dark:bg-white text-white dark:text-black text-xs font-semibold rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
            >
              Reset Deck
            </button>
          </div>
        )}
      </div>

      {/* Action Controls Bar */}
      <div className="flex items-center justify-center gap-3 pt-2">
        {/* Pass Button */}
        <button
          onClick={() => executeSwipe('LEFT')}
          disabled={!activeJob}
          className="w-11 h-11 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-rose-600 dark:hover:text-rose-400 flex items-center justify-center transition-colors shadow-xs disabled:opacity-40"
          title="Pass (Left Arrow or H)"
          aria-label="Pass card"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Undo Button */}
        <button
          onClick={handleUndo}
          disabled={history.length === 0}
          className="w-9 h-9 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center justify-center transition-colors shadow-xs disabled:opacity-30"
          title="Undo Last Action (Z)"
          aria-label="Undo last action"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Tailor ATS Resume */}
        <button
          onClick={() => activeJob && onTailorAts(activeJob)}
          disabled={!activeJob}
          className="w-9 h-9 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center justify-center transition-colors shadow-xs disabled:opacity-40"
          title="Tailor ATS Resume"
          aria-label="Tailor ATS resume"
        >
          <FileText className="w-4 h-4" />
        </button>

        {/* Save to Pipeline */}
        <button
          onClick={() => executeSwipe('RIGHT')}
          disabled={!activeJob || appliedJobIds.has(activeJob.id)}
          className={`w-11 h-11 rounded-full flex items-center justify-center border transition-colors shadow-xs disabled:opacity-40 ${
            activeJob && appliedJobIds.has(activeJob.id)
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-600 text-emerald-700 dark:text-emerald-400'
              : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-emerald-600 dark:hover:text-emerald-400'
          }`}
          title="Save to Pipeline (Right Arrow or L)"
          aria-label="Save role to pipeline"
        >
          <BookmarkPlus className="w-5 h-5" />
        </button>

        {/* Pitch Founder Direct Action */}
        <button
          onClick={() => {
            if (!activeJob) return;
            onPitch(activeJob);
          }}
          disabled={!activeJob}
          className="w-11 h-11 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-[#EBF946] dark:text-black dark:hover:bg-[#d4e23f] flex items-center justify-center transition-colors shadow-xs disabled:opacity-40"
          title="Compose Founder Pitch (Space or Enter)"
          aria-label="Compose founder pitch"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </div>

      {/* Keyboard Controls Hint */}
      <div className="flex items-center justify-center gap-3 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 pt-1">
        <span className="flex items-center gap-1">
          <Keyboard className="w-3 h-3 text-neutral-400" />
          <span>← Pass</span>
        </span>
        <span>•</span>
        <span>→ Save</span>
        <span>•</span>
        <span>Space: Pitch</span>
        <span>•</span>
        <span>Z: Undo</span>
        {streak > 1 && (
          <>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">{streak} saved</span>
          </>
        )}
      </div>
    </div>
  );
};

export default CompanySwipeDeck;
