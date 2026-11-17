import React, { useState, useEffect, useRef } from 'react';
import type { JobListing } from '../types';
import { 
  Search, 
  Briefcase, 
  FileText, 
  Send, 
  Kanban, 
  Code2, 
  User, 
  HelpCircle, 
  Layers, 
  ArrowRight
} from 'lucide-react';

export type WorkspaceTab = 
  | 'DIRECTORY' 
  | 'PIPELINE' 
  | 'SWIPE' 
  | 'ATS_LAB' 
  | 'OUTREACH' 
  | 'PORTFOLIO' 
  | 'PROFILE' 
  | 'FAQ';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: JobListing[];
  onSelectJob: (job: JobListing) => void;
  onNavigateTab: (tab: WorkspaceTab) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  jobs,
  onSelectJob,
  onNavigateTab,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input whenever opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle global keyboard escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Navigation commands
  const navCommands = [
    { id: 'nav-dir', title: 'Go to Jobs Directory', category: 'Navigation', icon: Briefcase, action: () => onNavigateTab('DIRECTORY'), shortcut: '⌘1' },
    { id: 'nav-pipeline', title: 'Go to Applications Pipeline (Kanban)', category: 'Navigation', icon: Kanban, action: () => onNavigateTab('PIPELINE'), shortcut: '⌘2' },
    { id: 'nav-swipe', title: 'Go to Swipe Triage Deck', category: 'Navigation', icon: Layers, action: () => onNavigateTab('SWIPE'), shortcut: '⌘3' },
    { id: 'nav-ats', title: 'Open ATS Keyword Lab', category: 'Tools', icon: FileText, action: () => onNavigateTab('ATS_LAB'), shortcut: '⌘4' },
    { id: 'nav-outreach', title: 'Open Founder Pitch Composer', category: 'Tools', icon: Send, action: () => onNavigateTab('OUTREACH'), shortcut: '⌘5' },
    { id: 'nav-github', title: 'Open GitHub Proof Studio', category: 'Tools', icon: Code2, action: () => onNavigateTab('PORTFOLIO'), shortcut: '⌘6' },
    { id: 'nav-profile', title: 'Open Candidate Profile Vault', category: 'Profile', icon: User, action: () => onNavigateTab('PROFILE'), shortcut: '⌘P' },
    { id: 'nav-faq', title: 'View Workflow FAQ & Architecture', category: 'System', icon: HelpCircle, action: () => onNavigateTab('FAQ'), shortcut: '?' },
  ];

  const matchingNavs = navCommands.filter((cmd) => 
    !q || cmd.title.toLowerCase().includes(q) || cmd.category.toLowerCase().includes(q)
  );

  // Matching jobs
  const matchingJobs = jobs.filter((job) =>
    !q ||
    job.title.toLowerCase().includes(q) ||
    job.company.toLowerCase().includes(q) ||
    job.location.toLowerCase().includes(q) ||
    job.requiredSkills.some((s) => s.toLowerCase().includes(q))
  ).slice(0, 10);

  // Combine items for keyboard navigation
  const allItems: Array<
    | { type: 'NAV'; item: (typeof navCommands)[0] }
    | { type: 'JOB'; item: JobListing }
  > = [
    ...matchingNavs.map((cmd) => ({ type: 'NAV' as const, item: cmd })),
    ...matchingJobs.map((job) => ({ type: 'JOB' as const, item: job })),
  ];

  const handleSelect = (idx: number) => {
    const entry = allItems[idx];
    if (!entry) return;
    if (entry.type === 'NAV') {
      entry.item.action();
    } else {
      onSelectJob(entry.item);
    }
    onClose();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (allItems.length ? (prev + 1) % allItems.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (allItems.length ? (prev - 1 + allItems.length) % allItems.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(selectedIndex);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-neutral-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#121316] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col text-neutral-900 dark:text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-neutral-200/80 dark:border-neutral-800 bg-neutral-50 dark:bg-[#15171e]">
          <Search className="w-4 h-4 text-neutral-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Type a command or search roles, skills, startups..."
            className="flex-1 bg-transparent text-sm text-neutral-900 dark:text-white placeholder-neutral-400 outline-none font-sans"
          />
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-500 bg-white dark:bg-neutral-800 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">
            <kbd className="font-sans">ESC</kbd>
            <span>to close</span>
          </div>
        </div>

        {/* Command & Job List */}
        <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-2 space-y-4 text-xs font-sans">
          {allItems.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 text-sm">
              No matching commands or jobs found for "{query}"
            </div>
          ) : (
            <>
              {/* Navigation Section */}
              {matchingNavs.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    Actions & Views
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {matchingNavs.map((cmd) => {
                      const itemIdx = allItems.findIndex((it) => it.type === 'NAV' && it.item.id === cmd.id);
                      const isSelected = itemIdx === selectedIndex;
                      const Icon = cmd.icon;
                      return (
                        <div
                          key={cmd.id}
                          onMouseEnter={() => setSelectedIndex(itemIdx)}
                          onClick={() => handleSelect(itemIdx)}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                            isSelected 
                              ? 'bg-neutral-900 text-white dark:bg-neutral-800 dark:text-white font-medium shadow-xs' 
                              : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-neutral-400'}`} />
                            <span>{cmd.title}</span>
                          </div>
                          {cmd.shortcut && (
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border border-neutral-200 dark:border-neutral-700'
                            }`}>
                              {cmd.shortcut}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Jobs Section */}
              {matchingJobs.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                    Startup Roles ({matchingJobs.length})
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {matchingJobs.map((job) => {
                      const itemIdx = allItems.findIndex((it) => it.type === 'JOB' && it.item.id === job.id);
                      const isSelected = itemIdx === selectedIndex;
                      return (
                        <div
                          key={job.id}
                          onMouseEnter={() => setSelectedIndex(itemIdx)}
                          onClick={() => handleSelect(itemIdx)}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                            isSelected 
                              ? 'bg-neutral-900 text-white dark:bg-neutral-800 dark:text-white font-medium shadow-xs' 
                              : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-6 h-6 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-xs font-bold shrink-0 font-mono">
                              {job.company.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold truncate">{job.title}</span>
                                <span className={`text-[11px] ${isSelected ? 'text-white/80' : 'text-neutral-500'}`}>
                                  {job.company}
                                </span>
                              </div>
                              <div className={`flex items-center gap-2 text-[10px] font-mono truncate ${
                                isSelected ? 'text-white/70' : 'text-neutral-400'
                              }`}>
                                <span>{job.location}</span>
                                <span>•</span>
                                <span>{job.salaryDisplay || `₹${job.minCtcLpa}–${job.maxCtcLpa}L`}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 ml-3">
                            {job.atsMatchScore && (
                              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded tabular-nums ${
                                isSelected 
                                  ? 'bg-white/20 text-white' 
                                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60'
                              }`}>
                                {job.atsMatchScore}% match
                              </span>
                            )}
                            <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-neutral-400'}`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-neutral-50 dark:bg-[#15171e] border-t border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-[10px]">↑</kbd>
              <kbd className="px-1 py-0.5 rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-[10px]">↓</kbd>
              <span>navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-[10px]">↵</kbd>
              <span>select</span>
            </span>
          </div>
          <span className="text-[10px] text-neutral-400">Keyboard quick navigation</span>
        </div>
      </div>
    </div>
  );
};
