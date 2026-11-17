import React, { useState, useEffect, useRef, useCallback } from 'react';
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

  // Clamp index when filteredDeck changes
  useEffect(() => {
    if (currentIndex >= filteredDeck.length && filteredDeck.length > 0) {
      setCurrentIndex(0);
    }
  }, [jobs, filteredDeck.length, currentIndex]);

  const activeJob = filteredDeck[currentIndex];
  const nextJob = filteredDeck[currentIndex + 1];
  const thirdJob = filteredDeck[currentIndex + 2];

  const handleSwipe = useCallback((direction: 'LEFT' | 'RIGHT') => {
    if (!activeJob) return;

    setSwipeDirection(direction);

    if (direction === 'RIGHT') {
      onAddToPipeline(activeJob);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    const currentEntry: SwipeHistoryEntry = {
      index: currentIndex,
      direction,
      job: activeJob,
    };

    setTimeout(() => {
      setHistory((prev) => [...prev, currentEntry]);
      setCurrentIndex((prev) => prev + 1);
      setSwipeDirection(null);
      setDragOffset({ x: 0, y: 0 });
    }, 220);
  }, [activeJob, currentIndex, onAddToPipeline]);

  // True undo: restores card index AND reverses pipeline / applied ID change
  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const lastEntry = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setCurrentIndex(lastEntry.index);
    setDragOffset({ x: 0, y: 0 });
    setSwipeDirection(null);

    // If undone action added card to pipeline, remove it
    if (lastEntry.direction === 'RIGHT' && onRemoveFromPipeline) {
      onRemoveFromPipeline(lastEntry.job.id);
      setStreak((prev) => Math.max(0, prev - 1));
    }
  }, [history, onRemoveFromPipeline]);

  // Keyboard controls with modal boundary protection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input, textarea, or select
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;

      // Don't trigger if any accessible modal dialog is open
      if (document.querySelector('[role="dialog"]')) return;

      if (e.key === 'ArrowRight' || e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        handleSwipe('RIGHT');
      } else if (e.key === 'ArrowLeft' || e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        handleSwipe('LEFT');
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
  }, [handleSwipe, handleUndo, activeJob, onPitch]);

  // Pointer drag event handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setDragOffset({ x: dx, y: dy * 0.4 });
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 110;
    if (dragOffset.x > threshold) {
      handleSwipe('RIGHT');
    } else if (dragOffset.x < -threshold) {
      handleSwipe('LEFT');
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Safe cancel gesture: resets card position without committing a swipe
  const handlePointerCancel = () => {
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  const rotation = dragOffset.x * 0.08;
  const isRightVote = dragOffset.x > 40;
  const isLeftVote = dragOffset.x < -40;

  return (
    <div className="space-y-6 max-w-xl mx-auto select-none">
      {/* Top Deck Stats & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#1F1F1F]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-white flex items-center gap-1.5 font-mono">
            <span>⚡</span>
            <span>Discovery Deck</span>
          </span>
          <span className="text-xs text-[#555555]">•</span>
          <span className="text-xs font-mono text-[#A1A1A1]">
            Card {filteredDeck.length > 0 ? Math.min(currentIndex + 1, filteredDeck.length) : 0} of {filteredDeck.length}
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 text-[11px] font-mono skeuo-well p-1 rounded-lg">
          <button
            onClick={() => { setClusterFilter('ALL'); setCurrentIndex(0); }}
            className={`px-2.5 py-1 rounded transition-all active:translate-y-[1px] ${
              clusterFilter === 'ALL' ? 'skeuo-btn-primary font-bold' : 'text-[#A1A1A1] hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => { setClusterFilter('BLR'); setCurrentIndex(0); }}
            className={`px-2.5 py-1 rounded transition-all active:translate-y-[1px] ${
              clusterFilter === 'BLR' ? 'skeuo-btn-primary font-bold' : 'text-[#A1A1A1] hover:text-white'
            }`}
          >
            Bangalore
          </button>
          <button
            onClick={() => { setClusterFilter('YC'); setCurrentIndex(0); }}
            className={`px-2.5 py-1 rounded transition-all active:translate-y-[1px] ${
              clusterFilter === 'YC' ? 'skeuo-btn-primary font-bold' : 'text-[#A1A1A1] hover:text-white'
            }`}
          >
            YC
          </button>
          <button
            onClick={() => { setClusterFilter('NOTICE'); setCurrentIndex(0); }}
            className={`px-2.5 py-1 rounded transition-all active:translate-y-[1px] ${
              clusterFilter === 'NOTICE' ? 'skeuo-btn-primary font-bold' : 'text-[#A1A1A1] hover:text-white'
            }`}
          >
            Buyout
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full skeuo-well h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-white h-full transition-all duration-300 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          style={{ width: `${Math.min(100, (currentIndex / Math.max(filteredDeck.length, 1)) * 100)}%` }}
        />
      </div>

      {/* Interactive Card Stage Container */}
      <div className="relative h-[420px] w-full flex items-center justify-center sm:h-[440px]">
        {activeJob ? (
          <div className="relative w-full h-full">
            {/* Third Card in Stack (Bottom) */}
            {thirdJob && (
              <div
                className="absolute inset-0 rounded-2xl skeuo-surface pointer-events-none transition-transform duration-300 opacity-40"
                style={{
                  transform: 'scale(0.90) translateY(24px)',
                  zIndex: 1,
                }}
              />
            )}

            {/* Second Card in Stack (Middle) */}
            {nextJob && (
              <div
                className="absolute inset-0 rounded-2xl skeuo-card pointer-events-none transition-transform duration-300 p-6 flex flex-col justify-between"
                style={{
                  transform: 'scale(0.95) translateY(12px)',
                  opacity: 0.75,
                  zIndex: 2,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${nextJob.logoColor} text-white font-bold flex items-center justify-center font-mono opacity-60 shadow-inner`}>
                    {nextJob.company.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white opacity-70">{nextJob.company}</h3>
                    <p className="text-xs text-[#888888] font-mono">{nextJob.title}</p>
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
              className={`absolute inset-0 rounded-2xl skeuo-card p-6 flex flex-col justify-between cursor-grab active:cursor-grabbing transition-transform ${
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
              {/* Dynamic Rubber Ink Stamp Overlay when Swiping */}
              {isRightVote && (
                <div 
                  className="absolute top-6 left-6 px-4 py-1.5 skeuo-stamp-save font-black text-sm tracking-widest uppercase rotate-[-12deg] pointer-events-none z-20"
                  style={{ opacity: Math.min(1, Math.abs(dragOffset.x) / 80) }}
                >
                  SAVE TO PIPELINE
                </div>
              )}
              {isLeftVote && (
                <div 
                  className="absolute top-6 right-6 px-4 py-1.5 skeuo-stamp-pass font-black text-sm tracking-widest uppercase rotate-[12deg] pointer-events-none z-20"
                  style={{ opacity: Math.min(1, Math.abs(dragOffset.x) / 80) }}
                >
                  PASS
                </div>
              )}

              {/* Card Top: Company Header & Tags */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl ${activeJob.logoColor} text-white font-bold text-base flex items-center justify-center font-mono shadow-md border border-white/10`}>
                      {activeJob.company.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-base text-white">{activeJob.company}</h3>
                        <a
                          href={activeJob.jobUrl || `https://www.google.com/search?q=${encodeURIComponent(activeJob.company + ' careers')}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[#A1A1A1] hover:text-white transition-colors"
                          title="Open source listing"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#A1A1A1] font-mono mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#A1A1A1]" />
                          {activeJob.location}
                        </span>
                        {activeJob.fundingRound && (
                          <>
                            <span>•</span>
                            <span className="text-[#D4D4D4]">{activeJob.fundingRound}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Match Score Badge */}
                  <div
                    className="rounded-full skeuo-badge px-2.5 py-1 text-xs font-mono font-bold text-white flex items-center gap-1.5"
                    title="Percentage of required skills found in your profile"
                  >
                    <span className="skeuo-led-green" />
                    <span>{calculateQuickMatchScore(candidate, activeJob)}% skills</span>
                  </div>
                </div>

                {/* Role Title & Compensation Bar */}
                <div className="space-y-2 pt-2 border-t border-[#202028]">
                  <h2 className="text-xl font-black text-white tracking-tight leading-snug">
                    {activeJob.title}
                  </h2>
                  <div className="flex items-center gap-3 text-xs font-mono text-white">
                    <span className="font-bold text-emerald-400">
                      {activeJob.salaryDisplay || `₹${activeJob.minCtcLpa}L–₹${activeJob.maxCtcLpa}L`}
                    </span>
                    <span className="text-[#555555]">•</span>
                    <span className="text-[#A1A1A1]">{activeJob.experienceDisplay || '2-4 YOE'}</span>
                    <span className="text-[#555555]">•</span>
                    <span className="text-[#A1A1A1]">{activeJob.equityRange}</span>
                  </div>
                </div>

                {/* Description Snippet */}
                <p className="text-xs text-[#D4D4D4] font-sans line-clamp-3 leading-relaxed">
                  {activeJob.description}
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeJob.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg skeuo-badge text-[#D4D4D4] text-[11px] font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Bottom: Contact Details */}
              <div className="pt-3 border-t border-[#202028] flex items-center justify-between text-xs font-mono text-[#A1A1A1]">
                <div className="flex items-center gap-2">
                  <span className="skeuo-led-green" />
                  <span className="text-white font-medium">{activeJob.founderName}</span>
                  <span className="text-[10px] text-[#A1A1A1]">({activeJob.founderRole})</span>
                </div>

                <div
                  className="flex items-center gap-1.5 text-[11px] text-[#A1A1A1]"
                  title="Contact details are part of the example listing. Verify them before outreach."
                >
                  <Mail className="h-3.5 w-3.5 text-[#737373]" />
                  <span>Contact listed · verify first</span>
                </div>
              </div>
            </div>
          </div>
        ) : filteredDeck.length === 0 ? (
          <div className="max-w-sm space-y-3 rounded-2xl skeuo-well p-8 text-center font-mono">
            <Search className="mx-auto h-5 w-5 text-[#737373]" />
            <h3 className="text-base font-bold text-white">No roles match these filters.</h3>
            <p className="text-xs text-[#A1A1A1]">
              Clear the search and role filters to return to the example directory.
            </p>
            <button
              onClick={() => {
                setClusterFilter('ALL');
                setCurrentIndex(0);
                setHistory([]);
                onClearFilters();
              }}
              className="skeuo-btn-primary rounded-lg px-4 py-2 text-xs font-bold active:translate-y-[2px] active:shadow-none"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="text-center p-8 skeuo-well rounded-2xl max-w-sm space-y-3 font-mono">
            <span className="text-3xl">🎉</span>
            <h3 className="font-bold text-white text-base">You've reached the end of the deck!</h3>
            <p className="text-xs text-[#A1A1A1]">
              All roles in this filter have been reviewed. Switch filters or reset the deck to review again.
            </p>
            <button
              onClick={() => {
                setCurrentIndex(0);
                setHistory([]);
              }}
              className="skeuo-btn-primary px-4 py-2 text-xs font-bold rounded-lg active:translate-y-[2px] active:shadow-none"
            >
              Reset Deck
            </button>
          </div>
        )}
      </div>

      {/* Floating Action Controls Bar */}
      <div className="flex items-center justify-center gap-3 pt-2">
        {/* Pass Button (Swipe Left) */}
        <button
          onClick={() => handleSwipe('LEFT')}
          disabled={!activeJob}
          className="w-12 h-12 rounded-full skeuo-keycap text-[#A1A1A1] hover:text-red-400 flex items-center justify-center active:translate-y-[2px] active:shadow-none disabled:opacity-40"
          title="Pass (Left Arrow or H)"
          aria-label="Pass card"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Undo Button */}
        <button
          onClick={handleUndo}
          disabled={history.length === 0}
          className="w-10 h-10 rounded-full skeuo-keycap text-[#A1A1A1] hover:text-white flex items-center justify-center active:translate-y-[2px] active:shadow-none disabled:opacity-30"
          title="Undo Last Swipe & Reverse (Z)"
          aria-label="Undo last action"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Tailor ATS Resume Button */}
        <button
          onClick={() => activeJob && onTailorAts(activeJob)}
          disabled={!activeJob}
          className="w-10 h-10 rounded-full skeuo-keycap text-[#A1A1A1] hover:text-white flex items-center justify-center active:translate-y-[2px] active:shadow-none disabled:opacity-40"
          title="Tailor ATS Resume"
          aria-label="Tailor ATS resume"
        >
          <FileText className="w-4 h-4" />
        </button>

        {/* Save to Pipeline (Swipe Right) */}
        <button
          onClick={() => handleSwipe('RIGHT')}
          disabled={!activeJob || appliedJobIds.has(activeJob.id)}
          className={`w-11 h-11 rounded-full flex items-center justify-center active:translate-y-[2px] active:shadow-none disabled:opacity-40 ${
            activeJob && appliedJobIds.has(activeJob.id)
              ? 'skeuo-keycap text-emerald-400 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
              : 'skeuo-keycap text-[#A1A1A1] hover:text-emerald-400'
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
          className="w-12 h-12 rounded-full skeuo-keycap-primary flex items-center justify-center active:translate-y-[2px] active:shadow-none disabled:opacity-40"
          title="Compose Founder Pitch (Space or Enter)"
          aria-label="Compose founder pitch"
        >
          <Send className="w-5 h-5 ml-0.5" />
        </button>
      </div>

      {/* Keyboard Controls Hint */}
      <div className="flex items-center justify-center gap-3 text-[11px] font-mono text-[#A1A1A1] pt-1">
        <span className="flex items-center gap-1">
          <Keyboard className="w-3 h-3" />
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
            <span className="text-emerald-400 font-bold">🔥 {streak} Saved</span>
          </>
        )}
      </div>
    </div>
  );
};

export default CompanySwipeDeck;
