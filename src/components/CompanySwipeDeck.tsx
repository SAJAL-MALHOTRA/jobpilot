import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { JobListing, CandidateProfile } from '../types';
import { 
  X, 
  Send, 
  RotateCcw, 
  FileText, 
  MapPin, 
  ShieldCheck, 
  ExternalLink,
  Keyboard
} from 'lucide-react';

interface CompanySwipeDeckProps {
  jobs: JobListing[];
  candidate: CandidateProfile;
  onPitch: (job: JobListing) => void;
  onTailorAts: (job: JobListing) => void;
  onAddToPipeline: (job: JobListing) => void;
  appliedJobIds: Set<string>;
}

export const CompanySwipeDeck: React.FC<CompanySwipeDeckProps> = ({
  jobs,
  onPitch,
  onTailorAts,
  onAddToPipeline,
  appliedJobIds,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
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

    setTimeout(() => {
      setHistory((prev) => [...prev, currentIndex]);
      setCurrentIndex((prev) => prev + 1);
      setSwipeDirection(null);
      setDragOffset({ x: 0, y: 0 });
    }, 220);
  }, [activeJob, currentIndex, onAddToPipeline]);

  const handleUndo = () => {
    if (history.length === 0) return;
    const lastIndex = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setCurrentIndex(lastIndex);
    setDragOffset({ x: 0, y: 0 });
    setSwipeDirection(null);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

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
  }, [handleSwipe, activeJob, onPitch]);

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
          <span className="text-xs text-[#444444]">•</span>
          <span className="text-xs font-mono text-[#888888]">
            Card {Math.min(currentIndex + 1, filteredDeck.length)} of {filteredDeck.length}
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 text-[11px] font-mono">
          <button
            onClick={() => { setClusterFilter('ALL'); setCurrentIndex(0); }}
            className={`px-2 py-0.5 rounded transition-colors ${
              clusterFilter === 'ALL' ? 'bg-white text-black font-bold' : 'bg-[#141414] text-[#888888] hover:text-white border border-[#222222]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => { setClusterFilter('BLR'); setCurrentIndex(0); }}
            className={`px-2 py-0.5 rounded transition-colors ${
              clusterFilter === 'BLR' ? 'bg-white text-black font-bold' : 'bg-[#141414] text-[#888888] hover:text-white border border-[#222222]'
            }`}
          >
            Bangalore
          </button>
          <button
            onClick={() => { setClusterFilter('YC'); setCurrentIndex(0); }}
            className={`px-2 py-0.5 rounded transition-colors ${
              clusterFilter === 'YC' ? 'bg-white text-black font-bold' : 'bg-[#141414] text-[#888888] hover:text-white border border-[#222222]'
            }`}
          >
            YC
          </button>
          <button
            onClick={() => { setClusterFilter('NOTICE'); setCurrentIndex(0); }}
            className={`px-2 py-0.5 rounded transition-colors ${
              clusterFilter === 'NOTICE' ? 'bg-white text-black font-bold' : 'bg-[#141414] text-[#888888] hover:text-white border border-[#222222]'
            }`}
          >
            Buyout
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#141414] h-1 rounded-full overflow-hidden border border-[#1F1F1F]">
        <div
          className="bg-white h-full transition-all duration-300"
          style={{ width: `${Math.min(100, (currentIndex / Math.max(filteredDeck.length, 1)) * 100)}%` }}
        />
      </div>

      {/* Interactive Card Stage Container */}
      <div className="relative h-[480px] w-full flex items-center justify-center">
        {activeJob ? (
          <div className="relative w-full h-full">
            {/* Third Card in Stack (Bottom) */}
            {thirdJob && (
              <div
                className="absolute inset-0 rounded-2xl bg-[#070707] border border-[#181818] pointer-events-none transition-transform duration-300"
                style={{
                  transform: 'scale(0.90) translateY(24px)',
                  opacity: 0.5,
                  zIndex: 1,
                }}
              />
            )}

            {/* Second Card in Stack (Middle) */}
            {nextJob && (
              <div
                className="absolute inset-0 rounded-2xl bg-[#0A0A0A] border border-[#1E1E1E] pointer-events-none transition-transform duration-300 p-6 flex flex-col justify-between"
                style={{
                  transform: 'scale(0.95) translateY(12px)',
                  opacity: 0.85,
                  zIndex: 2,
                }}
              >
                <div className="flex items-center justify-between text-xs font-mono text-[#666666]">
                  <span className="font-bold text-white">{nextJob.company}</span>
                  <span>{nextJob.location}</span>
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-bold text-[#AAAAAA]">{nextJob.title}</h4>
                  <p className="text-xs text-[#666666] font-mono mt-1">{nextJob.salaryDisplay || `₹${nextJob.minCtcLpa}-${nextJob.maxCtcLpa} LPA`}</p>
                </div>
                <div className="h-6" />
              </div>
            )}

            {/* Active Card (Top) with Drag Physics */}
            <div
              ref={activeCardRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className={`absolute inset-0 rounded-2xl bg-[#0A0A0A] border border-[#262626] shadow-2xl p-6 flex flex-col justify-between cursor-grab active:cursor-grabbing transition-transform ${
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
              {/* Dynamic Stamp Overlay when Swiping */}
              {isRightVote && (
                <div 
                  className="absolute top-6 left-6 px-4 py-1.5 rounded-lg border-2 border-emerald-400 text-emerald-400 font-black text-sm tracking-widest uppercase rotate-[-12deg] pointer-events-none z-20 bg-emerald-950/40"
                  style={{ opacity: Math.min(1, Math.abs(dragOffset.x) / 80) }}
                >
                  PITCH / SAVE
                </div>
              )}
              {isLeftVote && (
                <div 
                  className="absolute top-6 right-6 px-4 py-1.5 rounded-lg border-2 border-neutral-400 text-neutral-400 font-black text-sm tracking-widest uppercase rotate-[12deg] pointer-events-none z-20 bg-neutral-900/60"
                  style={{ opacity: Math.min(1, Math.abs(dragOffset.x) / 80) }}
                >
                  PASS
                </div>
              )}

              {/* Card Top: Company Header & Tags */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl ${activeJob.logoColor} text-white font-bold text-base flex items-center justify-center font-mono shadow-md`}>
                      {activeJob.company.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-base text-white">{activeJob.company}</h3>
                        <a
                          href={`https://www.google.com/search?q=${encodeURIComponent(activeJob.company + ' careers')}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[#666666] hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#888888] font-mono mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#666666]" />
                          {activeJob.location}
                        </span>
                        {activeJob.fundingRound && (
                          <>
                            <span>•</span>
                            <span className="text-[#AAAAAA]">{activeJob.fundingRound}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Match Score Badge */}
                  <div className="px-2.5 py-1 rounded-full bg-[#141414] border border-[#262626] text-xs font-mono font-bold text-white">
                    {activeJob.atsMatchScore || 82}% ATS
                  </div>
                </div>

                {/* Role Title & Compensation Bar */}
                <div className="space-y-2 pt-2 border-t border-[#1A1A1A]">
                  <h2 className="text-xl font-black text-white tracking-tight leading-snug">
                    {activeJob.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="px-2.5 py-1 rounded bg-[#141414] text-white font-bold border border-[#262626]">
                      {activeJob.salaryDisplay || `₹${activeJob.minCtcLpa}L–₹${activeJob.maxCtcLpa}L`}
                    </span>
                    {activeJob.equityRange && (
                      <span className="px-2 py-1 rounded bg-[#141414] text-[#888888] border border-[#222222]">
                        {activeJob.equityRange}
                      </span>
                    )}
                    {activeJob.noticeBuyoutCovered && (
                      <span className="px-2 py-1 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Notice Buyout Covered</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#AAAAAA] leading-relaxed line-clamp-3 font-sans">
                  {activeJob.description}
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeJob.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded bg-[#111111] border border-[#222222] text-[11px] font-mono text-[#D4D4D4]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Bottom: Verified Founder Hook */}
              <div className="pt-3 border-t border-[#1A1A1A] flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[10px] text-[#666666] block">Direct Founder Inbox:</span>
                  <span className="text-white font-bold">{activeJob.founderName}</span>
                  <span className="text-[#888888] ml-1">({activeJob.founderRole})</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#666666] block">Status:</span>
                  <span className={appliedJobIds.has(activeJob.id) ? 'text-emerald-400 font-bold' : 'text-[#888888]'}>
                    {appliedJobIds.has(activeJob.id) ? '✓ In Pipeline' : 'Unreached'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Deck State */
          <div className="w-full h-full rounded-2xl bg-[#0A0A0A] border border-[#1F1F1F] p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#141414] border border-[#262626] flex items-center justify-center text-xl">
              🎯
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Deck Completed!</h3>
              <p className="text-xs text-[#888888] max-w-sm">
                You've reviewed all curated startup roles for this category. Check your applications pipeline to track dispatched pitches.
              </p>
            </div>
            <button
              onClick={() => {
                setCurrentIndex(0);
                setHistory([]);
              }}
              className="px-4 py-2 bg-white hover:bg-neutral-200 text-black font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Deck</span>
            </button>
          </div>
        )}
      </div>

      {/* Floating Action Controls Bar */}
      <div className="flex items-center justify-center gap-4 pt-2">
        {/* Pass Button (Swipe Left) */}
        <button
          onClick={() => handleSwipe('LEFT')}
          disabled={!activeJob}
          className="w-12 h-12 rounded-full bg-[#111111] hover:bg-[#1A1A1A] border border-[#262626] text-[#888888] hover:text-red-400 flex items-center justify-center transition-all shadow-md active:scale-95 disabled:opacity-40"
          title="Pass (Left Arrow)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Undo Button */}
        <button
          onClick={handleUndo}
          disabled={history.length === 0}
          className="w-10 h-10 rounded-full bg-[#111111] hover:bg-[#1A1A1A] border border-[#262626] text-[#888888] hover:text-white flex items-center justify-center transition-all shadow-md active:scale-95 disabled:opacity-30"
          title="Undo Last Swipe (Z)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Tailor ATS Resume Button */}
        <button
          onClick={() => activeJob && onTailorAts(activeJob)}
          disabled={!activeJob}
          className="w-10 h-10 rounded-full bg-[#111111] hover:bg-[#1A1A1A] border border-[#262626] text-[#888888] hover:text-white flex items-center justify-center transition-all shadow-md active:scale-95 disabled:opacity-40"
          title="Tailor ATS Resume"
        >
          <FileText className="w-4 h-4" />
        </button>

        {/* Pitch Founder / Swipe Right Button */}
        <button
          onClick={() => {
            if (!activeJob) return;
            handleSwipe('RIGHT');
            onPitch(activeJob);
          }}
          disabled={!activeJob}
          className="w-14 h-14 rounded-full bg-white hover:bg-neutral-200 text-black flex items-center justify-center transition-all shadow-lg active:scale-95 disabled:opacity-40"
          title="Pitch Founder (Right Arrow)"
        >
          <Send className="w-6 h-6 ml-0.5" />
        </button>
      </div>

      {/* Keyboard Hint */}
      <div className="flex items-center justify-center gap-4 text-[11px] font-mono text-[#666666] pt-1">
        <span className="flex items-center gap-1">
          <Keyboard className="w-3 h-3" />
          <span>← Pass</span>
        </span>
        <span>•</span>
        <span>→ Pitch Founder</span>
        <span>•</span>
        <span>Z Undo</span>
        {streak > 1 && (
          <>
            <span>•</span>
            <span className="text-emerald-400 font-bold">🔥 {streak} Streak</span>
          </>
        )}
      </div>
    </div>
  );
};

export default CompanySwipeDeck;