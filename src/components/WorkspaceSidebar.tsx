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
      className={`h-screen flex flex-col bg-[#0F1117] border-r border-[#292E3B] text-[#F3F4F6] select-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] z-30 shrink-0 ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* 1. Brand Header */}
      <div className="h-14 px-4 border-b border-[#292E3B] flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#818CF8] flex items-center justify-center font-bold text-[#0F1117] shadow-sm shrink-0 text-xs">
              JP
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-sm tracking-tight text-[#F3F4F6] block truncate">JobPilot</span>
              <span className="text-[10px] text-[#A1A8B8] block truncate">Opportunity Intelligence</span>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="mx-auto w-8 h-8 rounded-lg bg-[#818CF8] flex items-center justify-center font-bold text-[#0F1117] shadow-sm text-xs">
            JP
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1 rounded text-[#737C90] hover:text-[#F3F4F6] hover:bg-[#171A23] transition-colors"
        >
          {isCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* 2. Linear-style Command Trigger */}
      <div className="p-3 border-b border-[#292E3B]">
        <button
          onClick={onOpenCommandPalette}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#171A23] border border-[#292E3B] hover:border-[#818CF8]/50 hover:bg-[#1D2230] text-xs transition-all group ${
            isCollapsed ? 'justify-center px-1' : ''
          }`}
          title="Open Command Palette (⌘K)"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="w-3.5 h-3.5 text-[#818CF8] group-hover:text-[#9FA8FF] shrink-0" />
            {!isCollapsed && <span className="font-medium text-[#A1A8B8] group-hover:text-[#F3F4F6] truncate">Command Menu</span>}
          </div>
          {!isCollapsed && (
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1D2230] text-[#737C90] border border-[#292E3B] group-hover:text-[#F3F4F6]">
              ⌘K
            </kbd>
          )}
        </button>
      </div>

      {/* 3. Essential Navigation */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 text-xs font-sans">
        <div className="space-y-1">
          {/* Discover Opportunities */}
          <button
            onClick={() => onSelectTab('DIRECTORY')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all ${
              activeTab === 'DIRECTORY'
                ? 'bg-[#1D2230] text-[#F3F4F6] font-semibold shadow-sm border border-[#292E3B]'
                : 'text-[#A1A8B8] hover:text-[#F3F4F6] hover:bg-[#171A23]'
            } ${isCollapsed ? 'justify-center px-1' : ''}`}
            title="Discover Opportunities"
          >
            <Compass className={`w-4 h-4 shrink-0 ${activeTab === 'DIRECTORY' ? 'text-[#818CF8]' : 'text-[#737C90]'}`} />
            {!isCollapsed && <span>Discover</span>}
          </button>

          {/* Applications Pipeline CRM */}
          <button
            onClick={() => onSelectTab('PIPELINE')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
              activeTab === 'PIPELINE'
                ? 'bg-[#1D2230] text-[#F3F4F6] font-semibold shadow-sm border border-[#292E3B]'
                : 'text-[#A1A8B8] hover:text-[#F3F4F6] hover:bg-[#171A23]'
            } ${isCollapsed ? 'justify-center px-1' : ''}`}
            title="Applications Pipeline"
          >
            <div className="flex items-center gap-2.5">
              <Kanban className={`w-4 h-4 shrink-0 ${activeTab === 'PIPELINE' ? 'text-[#818CF8]' : 'text-[#737C90]'}`} />
              {!isCollapsed && <span>Pipeline CRM</span>}
            </div>
            {!isCollapsed && pipelineCount > 0 && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#818CF8]/10 text-[#818CF8] border border-[#818CF8]/30">
                {pipelineCount}
              </span>
            )}
          </button>

          {/* ATS Keyword Match Lab */}
          <button
            onClick={() => onSelectTab('ATS_LAB')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all ${
              activeTab === 'ATS_LAB'
                ? 'bg-[#1D2230] text-[#F3F4F6] font-semibold shadow-sm border border-[#292E3B]'
                : 'text-[#A1A8B8] hover:text-[#F3F4F6] hover:bg-[#171A23]'
            } ${isCollapsed ? 'justify-center px-1' : ''}`}
            title="ATS Keyword Lab"
          >
            <FileText className={`w-4 h-4 shrink-0 ${activeTab === 'ATS_LAB' ? 'text-[#818CF8]' : 'text-[#737C90]'}`} />
            {!isCollapsed && <span>Match Lab</span>}
          </button>

          {/* Founder Pitch Composer */}
          <button
            onClick={() => onSelectTab('OUTREACH')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all ${
              activeTab === 'OUTREACH'
                ? 'bg-[#1D2230] text-[#F3F4F6] font-semibold shadow-sm border border-[#292E3B]'
                : 'text-[#A1A8B8] hover:text-[#F3F4F6] hover:bg-[#171A23]'
            } ${isCollapsed ? 'justify-center px-1' : ''}`}
            title="Founder Outreach Composer"
          >
            <Send className={`w-4 h-4 shrink-0 ${activeTab === 'OUTREACH' ? 'text-[#818CF8]' : 'text-[#737C90]'}`} />
            {!isCollapsed && <span>Outreach</span>}
          </button>

          {/* GitHub Proof Studio */}
          <button
            onClick={() => onSelectTab('PORTFOLIO')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all ${
              activeTab === 'PORTFOLIO'
                ? 'bg-[#1D2230] text-[#F3F4F6] font-semibold shadow-sm border border-[#292E3B]'
                : 'text-[#A1A8B8] hover:text-[#F3F4F6] hover:bg-[#171A23]'
            } ${isCollapsed ? 'justify-center px-1' : ''}`}
            title="GitHub Proof Studio"
          >
            <Code2 className={`w-4 h-4 shrink-0 ${activeTab === 'PORTFOLIO' ? 'text-[#818CF8]' : 'text-[#737C90]'}`} />
            {!isCollapsed && <span>GitHub Studio</span>}
          </button>
        </div>

        {/* System Reference */}
        <div className="pt-2 border-t border-[#292E3B]">
          <button
            onClick={() => onSelectTab('FAQ')}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
              activeTab === 'FAQ'
                ? 'text-[#F3F4F6] font-semibold bg-[#1D2230]'
                : 'text-[#A1A8B8] hover:text-[#F3F4F6] hover:bg-[#171A23]'
            } ${isCollapsed ? 'justify-center px-1' : ''}`}
            title="Architecture & Trust Methodology"
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Methodology & FAQ</span>}
          </button>
        </div>
      </div>

      {/* 4. Candidate Profile Footer */}
      <div className="p-3 border-t border-[#292E3B] bg-[#0F1117]">
        <button
          onClick={onOpenProfile}
          className={`w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#171A23] transition-colors text-left ${
            isCollapsed ? 'justify-center p-1' : ''
          }`}
          title="Edit candidate profile & target skills"
        >
          <div className="w-8 h-8 rounded-lg bg-[#1D2230] border border-[#292E3B] flex items-center justify-center font-bold text-xs text-[#F3F4F6] shrink-0">
            {candidate.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2) || 'CA'}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-[#F3F4F6] truncate">{candidate.fullName}</span>
                <span className="text-[11px] font-medium text-[#34D399]">{candidate.yearsOfExperience}y exp</span>
              </div>
              <p className="text-[10px] text-[#A1A8B8] truncate">{candidate.headline.split('(')[0]}</p>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
