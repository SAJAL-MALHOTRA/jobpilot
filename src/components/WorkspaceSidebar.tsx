import React from 'react';
import type { CandidateProfile } from '../types';
import { 
  Command, 
  Kanban, 
  FileText, 
  Send, 
  Code2, 
  HelpCircle, 
  PanelLeftClose, 
  PanelLeft,
  Compass,
  Layers,
  Sun,
  Moon,
  UploadCloud,
  Sparkles
} from 'lucide-react';
import type { WorkspaceTab } from './CommandPalette';

export type CorridorFilter = 'ALL' | 'BLR' | 'PUNE' | 'YC' | 'REMOTE' | 'NOTICE';

interface WorkspaceSidebarProps {
  activeTab: WorkspaceTab;
  onSelectTab: (tab: WorkspaceTab) => void;
  pipelineCount: number;
  candidate: CandidateProfile;
  onOpenCommandPalette: () => void;
  onOpenProfile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const WorkspaceSidebar: React.FC<WorkspaceSidebarProps> = ({
  activeTab,
  onSelectTab,
  pipelineCount,
  candidate,
  onOpenCommandPalette,
  onOpenProfile,
  isCollapsed,
  onToggleCollapse,
  theme = 'light',
  onToggleTheme,
}) => {
  return (
    <aside 
      className={`h-screen flex flex-col bg-white/95 dark:bg-[#0F1117] border-r border-slate-200/80 dark:border-[#292C33] text-slate-900 dark:text-[#F3F4F6] select-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] z-30 shrink-0 ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* 1. Brand Header (Apple squircle app icon) */}
      <div className="h-14 px-4 border-b border-slate-200/80 dark:border-[#292C33] flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-[12px] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white shadow-md shadow-blue-500/25 shrink-0 text-xs">
              JP
            </div>
            <div className="min-w-0">
              <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-[#F3F4F6] block truncate">JobPilot</span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-[#737C90] block truncate">Opportunity Radar</span>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="mx-auto w-8 h-8 rounded-[12px] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white shadow-md text-xs">
            JP
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:text-[#737C90] dark:hover:text-[#F3F4F6] hover:bg-slate-100 dark:hover:bg-[#1D2230] transition-colors"
        >
          {isCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* 2. Apple / Linear-style Command Trigger */}
      <div className="p-3 border-b border-slate-200/80 dark:border-[#292C33]">
        <button
          onClick={onOpenCommandPalette}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-[#171A23] border border-slate-200/80 dark:border-[#292C33] hover:border-blue-400 dark:hover:border-[#818CF8]/50 hover:bg-slate-100 dark:hover:bg-[#1D2230] text-xs transition-all group shadow-xs active:scale-95 ${
            isCollapsed ? 'justify-center px-1' : ''
          }`}
          title="Open Command Palette (⌘K)"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Command className="w-3.5 h-3.5 text-slate-500 dark:text-[#A1A8B8] shrink-0" />
            {!isCollapsed && <span className="font-semibold text-slate-700 dark:text-[#A1A8B8] group-hover:text-slate-900 dark:group-hover:text-[#F3F4F6] truncate">Command Menu</span>}
          </div>
          {!isCollapsed && (
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-white dark:bg-[#1D2230] text-slate-500 dark:text-[#737C90] border border-slate-200/80 dark:border-[#292C33] shadow-2xs">
              ⌘K
            </kbd>
          )}
        </button>
      </div>

      {/* 3. Navigation with Apple iOS-style Squircle Badges */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 text-xs font-sans">
        <div className="space-y-1">
          {/* Platform Landing & Structured Process */}
          <button
            onClick={() => onSelectTab('LANDING')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
              activeTab === 'LANDING'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black font-bold shadow-xs'
                : 'text-slate-600 dark:text-[#A1A8B8] hover:text-slate-900 dark:hover:text-[#F3F4F6] hover:bg-slate-50 dark:hover:bg-[#171A23]'
            } ${isCollapsed ? 'justify-center px-1' : ''}`}
            title="Platform Overview & 5-Stage Process"
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-xs ${
              activeTab === 'LANDING'
                ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
            }`}>
              <Layers className="w-3.5 h-3.5" />
            </div>
            {!isCollapsed && <span>Engine & Process</span>}
          </button>

          {/* Discover Opportunities */}
          <button
            onClick={() => onSelectTab('DIRECTORY')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
              activeTab === 'DIRECTORY'
                ? 'bg-blue-50 dark:bg-[#1D2230] text-blue-700 dark:text-[#F3F4F6] font-bold shadow-xs border border-blue-200/80 dark:border-[#292C33]'
                : 'text-slate-600 dark:text-[#A1A8B8] hover:text-slate-900 dark:hover:text-[#F3F4F6] hover:bg-slate-50 dark:hover:bg-[#171A23]'
            } ${isCollapsed ? 'justify-center px-1' : ''}`}
            title="Discover Opportunities"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-xs">
              <Compass className="w-3.5 h-3.5" />
            </div>
            {!isCollapsed && <span>Discover</span>}
          </button>

          {/* Resume Matching (CV in 5s) */}
          <button
            onClick={() => onSelectTab('MATCHING')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
              activeTab === 'MATCHING'
                ? 'bg-blue-50 dark:bg-[#1D2230] text-blue-700 dark:text-[#F3F4F6] font-bold shadow-xs border border-blue-200/80 dark:border-[#292C33]'
                : 'text-slate-600 dark:text-[#A1A8B8] hover:text-slate-900 dark:hover:text-[#F3F4F6] hover:bg-slate-50 dark:hover:bg-[#171A23]'
            } ${isCollapsed ? 'justify-center px-1' : ''}`}
            title="Resume Matching (Drop CV · Instant Fit in 5s)"
          >
            <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 shadow-xs">
              <UploadCloud className="w-3.5 h-3.5" />
            </div>
            {!isCollapsed && <span>Matching</span>}
          </button>

          {/* JobPilot Application Agent */}
          <button
            onClick={() => onSelectTab('AGENT')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
              activeTab === 'AGENT'
                ? 'bg-indigo-50 dark:bg-[#1D2230] text-indigo-700 dark:text-[#F3F4F6] font-bold shadow-xs border border-indigo-200/80 dark:border-[#292C33]'
                : 'text-slate-600 dark:text-[#A1A8B8] hover:text-slate-900 dark:hover:text-[#F3F4F6] hover:bg-slate-50 dark:hover:bg-[#171A23]'
            } ${isCollapsed ? 'justify-center px-1' : ''}`}
            title="JobPilot Application Agent (Form Auto-Fill)"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            {!isCollapsed && <span>Agent</span>}
          </button>

          {/* Applications Pipeline CRM */}
          <button
            onClick={() => onSelectTab('PIPELINE')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
              activeTab === 'PIPELINE'
                ? 'bg-emerald-50 dark:bg-[#1D2230] text-emerald-800 dark:text-[#F3F4F6] font-bold shadow-xs border border-emerald-200/80 dark:border-[#292C33]'
                : 'text-slate-600 dark:text-[#A1A8B8] hover:text-slate-900 dark:hover:text-[#F3F4F6] hover:bg-slate-50 dark:hover:bg-[#171A23]'
            } ${isCollapsed ? 'justify-center px-1' : ''}`}
            title="Applications Pipeline"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-[#34D399] flex items-center justify-center shrink-0 shadow-xs">
                <Kanban className="w-3.5 h-3.5" />
              </div>
              {!isCollapsed && <span>Pipeline CRM</span>}
            </div>
            {!isCollapsed && pipelineCount > 0 && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-[#34D399] border border-emerald-200 dark:border-emerald-800/40">
                {pipelineCount}
              </span>
            )}
          </button>

          {/* ATS Keyword Match Lab */}
          <button
            onClick={() => onSelectTab('ATS_LAB')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
              activeTab === 'ATS_LAB'
                ? 'bg-purple-50 dark:bg-[#1D2230] text-purple-700 dark:text-[#F3F4F6] font-bold shadow-xs border border-purple-200/80 dark:border-[#292C33]'
                : 'text-slate-600 dark:text-[#A1A8B8] hover:text-slate-900 dark:hover:text-[#F3F4F6] hover:bg-slate-50 dark:hover:bg-[#171A23]'
            } ${isCollapsed ? 'justify-center px-1' : ''}`}
            title="ATS Keyword Match Lab"
          >
            <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 shadow-xs">
              <FileText className="w-3.5 h-3.5" />
            </div>
            {!isCollapsed && <span>ATS Lab</span>}
          </button>

          {/* Founder Pitch Outreach */}
          <button
            onClick={() => onSelectTab('OUTREACH')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
              activeTab === 'OUTREACH'
                ? 'bg-amber-50 dark:bg-[#1D2230] text-amber-800 dark:text-[#F3F4F6] font-bold shadow-xs border border-amber-200/80 dark:border-[#292C33]'
                : 'text-slate-600 dark:text-[#A1A8B8] hover:text-slate-900 dark:hover:text-[#F3F4F6] hover:bg-slate-50 dark:hover:bg-[#171A23]'
            } ${isCollapsed ? 'justify-center px-1' : ''}`}
            title="Founder Outreach Composer"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-[#FBBF24] flex items-center justify-center shrink-0 shadow-xs">
              <Send className="w-3.5 h-3.5" />
            </div>
            {!isCollapsed && <span>Outreach</span>}
          </button>

          {/* GitHub Proof Studio */}
          <button
            onClick={() => onSelectTab('PORTFOLIO')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
              activeTab === 'PORTFOLIO'
                ? 'bg-slate-100 dark:bg-[#1D2230] text-slate-900 dark:text-[#F3F4F6] font-bold shadow-xs border border-slate-200/80 dark:border-[#292C33]'
                : 'text-slate-600 dark:text-[#A1A8B8] hover:text-slate-900 dark:hover:text-[#F3F4F6] hover:bg-slate-50 dark:hover:bg-[#171A23]'
            } ${isCollapsed ? 'justify-center px-1' : ''}`}
            title="GitHub Proof Studio"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-[#1D2230] text-slate-700 dark:text-[#F3F4F6] flex items-center justify-center shrink-0 shadow-xs">
              <Code2 className="w-3.5 h-3.5" />
            </div>
            {!isCollapsed && <span>GitHub Studio</span>}
          </button>
        </div>

        {/* Methodology & Theme Controls */}
        <div className="pt-2 border-t border-slate-200/80 dark:border-[#292C33] space-y-1">
          <button
            onClick={() => onSelectTab('FAQ')}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
              activeTab === 'FAQ'
                ? 'text-slate-900 dark:text-[#F3F4F6] font-bold bg-slate-100 dark:bg-[#1D2230]'
                : 'text-slate-500 dark:text-[#737C90] hover:text-slate-900 dark:hover:text-[#F3F4F6] hover:bg-slate-50 dark:hover:bg-[#171A23]'
            } ${isCollapsed ? 'justify-center px-1' : ''}`}
            title="Architecture & Methodology"
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Methodology & FAQ</span>}
          </button>

          {/* Theme Switcher Button */}
          {onToggleTheme && !isCollapsed && (
            <button
              onClick={onToggleTheme}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-slate-600 dark:text-[#A1A8B8] hover:bg-slate-100 dark:hover:bg-[#1D2230] transition-colors"
              title="Toggle Appearance"
            >
              <div className="flex items-center gap-2">
                {theme === 'light' ? (
                  <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-400 shrink-0" />
                )}
                <span>Appearance</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-200/70 dark:bg-[#0F1117] text-slate-800 dark:text-slate-300">
                {theme === 'light' ? 'Light' : 'Dark'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* 4. Candidate Profile Footer */}
      <div className="p-3 border-t border-slate-200/80 dark:border-[#292C33] bg-slate-50/50 dark:bg-[#0F1117]">
        <button
          onClick={onOpenProfile}
          className={`w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-white dark:hover:bg-[#171A23] transition-colors text-left shadow-2xs border border-transparent hover:border-slate-200/80 dark:hover:border-[#292C33] ${
            isCollapsed ? 'justify-center p-1' : ''
          }`}
          title="Edit candidate profile & target skills"
        >
          <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-[#1D2230] border border-slate-300/50 dark:border-[#292C33] flex items-center justify-center font-bold text-xs text-slate-800 dark:text-[#F3F4F6] shrink-0">
            {candidate.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2) || 'CA'}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-[#F3F4F6] truncate">{candidate.fullName}</span>
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-[#34D399]">{candidate.yearsOfExperience}y</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-[#737C90] truncate">{candidate.headline.split('(')[0]}</p>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
