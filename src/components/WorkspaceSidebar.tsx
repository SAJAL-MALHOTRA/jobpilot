import React from 'react';
import type { CandidateProfile } from '../types';
import { 
  Sparkles, 
  Kanban, 
  FileText, 
  Send, 
  Code2, 
  HelpCircle, 
  PanelLeftClose, 
  PanelLeft,
  Compass
} from 'lucide-react';
import type { WorkspaceTab } from './CommandPalette';

export type CorridorFilter = 'ALL' | 'BLR' | 'YC' | 'REMOTE' | 'NOTICE';

interface WorkspaceSidebarProps {
  activeTab: WorkspaceTab;
  onSelectTab: (tab: WorkspaceTab) => void;
  pipelineCount: number;
  candidate: CandidateProfile;
  onOpenCommandPalette: () => void;
  onOpenProfile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
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
}) => {
  return (
    <aside 
      className={`h-screen flex flex-col bg-[#10121A] border-r border-[#1E212E] text-[#EDEDED] select-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] z-30 shrink-0 ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* 1. Brand Header */}
      <div className="h-14 px-4 border-b border-[#1E212E] flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#5E6AD2] to-[#3B46A3] flex items-center justify-center font-bold text-white shadow-sm shrink-0 text-xs">
              JP
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-sm tracking-tight text-white block truncate">JobPilot</span>
              <span className="text-[10px] text-[#787D94] block truncate">Opportunity Intelligence</span>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="mx-auto w-8 h-8 rounded-lg bg-gradient-to-br from-[#5E6AD2] to-[#3B46A3] flex items-center justify-center font-bold text-white shadow-sm text-xs">
            JP
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1 rounded text-[#787D94] hover:text-[#EDEDED] hover:bg-[#1A1D2A] transition-colors"
        >
          {isCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* 2. Linear-style Command Trigger */}
      <div className="p-3 border-b border-[#1E212E]">
        <button
          onClick={onOpenCommandPalette}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#151722] border border-[#232636] hover:border-[#5E6AD2]/50 hover:bg-[#1A1D2B] text-xs transition-all group ${
            isCollapsed ? 'justify-center px-1' : ''
          }`}
          title="Open Command Palette (⌘K)"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="w-3.5 h-3.5 text-[#5E6AD2] group-hover:text-[#8E99F5] shrink-0" />
            {!isCollapsed && <span className="font-medium text-[#A6AABF] group-hover:text-white truncate">Command Menu</span>}
          </div>
          {!isCollapsed && (
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1C1F2E] text-[#7E839A] border border-[#292D3E] group-hover:text-white">
              ⌘K
            </kbd>
          )}
        </button>
      </div>

      {/* 3. Essential Navigation (Linear Style) */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 text-xs font-sans">
        <div className="space-y-1">
          {/* Discover Opportunities */}
          <button
            onClick={() => onSelectTab('DIRECTORY')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
              activeTab === 'DIRECTORY'
                ? 'bg-[#1C1F2E] text-white font-medium shadow-sm border border-[#2E334A]'
                : 'text-[#8E92A8] hover:text-[#EDEDED] hover:bg-[#161824]'
            } ${isCollapsed ? 'justify-center px-1' : ''}`}
            title="Discover Opportunities"
          >
            <div className="flex items-center gap-2.5">
              <Compass className={`w-4 h-4 shrink-0 ${activeTab === 'DIRECTORY' ? 'text-[#5E6AD2]' : 'text-[#72778E]'}`} />
              {!isCollapsed && <span>Discover</span>}
            </div>
            {!isCollapsed && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            )}
          </button>

          {/* Applications Pipeline CRM */}
          <button
            onClick={() => onSelectTab('PIPELINE')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
              activeTab === 'PIPELINE'
                ? 'bg-[#1C1F2E] text-white font-medium shadow-sm border border-[#2E334A]'
                : 'text-[#8E92A8] hover:text-[#EDEDED] hover:bg-[#161824]'
            } ${isCollapsed ? 'justify-center px-1' : ''}`}
            title="Applications Pipeline"
          >
            <div className="flex items-center gap-2.5">
              <Kanban className={`w-4 h-4 shrink-0 ${activeTab === 'PIPELINE' ? 'text-[#5E6AD2]' : 'text-[#72778E]'}`} />
              {!isCollapsed && <span>Pipeline CRM</span>}
            </div>
            {!isCollapsed && pipelineCount > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-800/50">
                {pipelineCount}
              </span>
            )}
          </button>

          {/* ATS Keyword Match Lab */}
          <button
            onClick={() => onSelectTab('ATS_LAB')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
              activeTab === 'ATS_LAB'
                ? 'bg-[#1C1F2E] text-white font-medium shadow-sm border border-[#2E334A]'
                : 'text-[#8E92A8] hover:text-[#EDEDED] hover:bg-[#161824]'
            } ${isCollapsed ? 'justify-center px-1' : ''}`}
            title="ATS Keyword Lab"
          >
            <FileText className={`w-4 h-4 shrink-0 ${activeTab === 'ATS_LAB' ? 'text-[#5E6AD2]' : 'text-[#72778E]'}`} />
            {!isCollapsed && <span>Match Lab</span>}
          </button>

          {/* Founder Pitch Composer */}
          <button
            onClick={() => onSelectTab('OUTREACH')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
              activeTab === 'OUTREACH'
                ? 'bg-[#1C1F2E] text-white font-medium shadow-sm border border-[#2E334A]'
                : 'text-[#8E92A8] hover:text-[#EDEDED] hover:bg-[#161824]'
            } ${isCollapsed ? 'justify-center px-1' : ''}`}
            title="Founder Outreach Composer"
          >
            <Send className={`w-4 h-4 shrink-0 ${activeTab === 'OUTREACH' ? 'text-[#5E6AD2]' : 'text-[#72778E]'}`} />
            {!isCollapsed && <span>Outreach</span>}
          </button>

          {/* GitHub Proof Studio */}
          <button
            onClick={() => onSelectTab('PORTFOLIO')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
              activeTab === 'PORTFOLIO'
                ? 'bg-[#1C1F2E] text-white font-medium shadow-sm border border-[#2E334A]'
                : 'text-[#8E92A8] hover:text-[#EDEDED] hover:bg-[#161824]'
            } ${isCollapsed ? 'justify-center px-1' : ''}`}
            title="GitHub Proof Studio"
          >
            <Code2 className={`w-4 h-4 shrink-0 ${activeTab === 'PORTFOLIO' ? 'text-[#5E6AD2]' : 'text-[#72778E]'}`} />
            {!isCollapsed && <span>GitHub Studio</span>}
          </button>
        </div>

        {/* System Reference */}
        <div className="pt-2 border-t border-[#1E212E]">
          <button
            onClick={() => onSelectTab('FAQ')}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
              activeTab === 'FAQ'
                ? 'text-white font-medium bg-[#1C1F2E]'
                : 'text-[#72778E] hover:text-[#EDEDED] hover:bg-[#161824]'
            } ${isCollapsed ? 'justify-center px-1' : ''}`}
            title="Architecture & Trust Methodology"
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Methodology & FAQ</span>}
          </button>
        </div>
      </div>

      {/* 4. Candidate Profile Footer */}
      <div className="p-3 border-t border-[#1E212E] bg-[#0E1017]">
        <button
          onClick={onOpenProfile}
          className={`w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#161824] transition-colors text-left ${
            isCollapsed ? 'justify-center p-1' : ''
          }`}
          title="Edit candidate profile & target skills"
        >
          <div className="w-8 h-8 rounded-lg bg-[#1C1F2E] border border-[#2E334A] flex items-center justify-center font-bold text-xs text-white shrink-0">
            {candidate.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2) || 'CA'}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-[#EDEDED] truncate">{candidate.fullName}</span>
                <span className="text-[10px] font-mono text-emerald-400">{candidate.yearsOfExperience}y exp</span>
              </div>
              <p className="text-[10px] text-[#787D94] truncate">{candidate.headline.split('(')[0]}</p>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
