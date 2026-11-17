import React from 'react';
import type { CandidateProfile } from '../types';
import { 
  Briefcase, 
  Kanban, 
  Layers, 
  FileText, 
  Send, 
  Code2, 
  User, 
  HelpCircle, 
  Search, 
  MapPin, 
  ShieldCheck, 
  PanelLeftClose, 
  PanelLeft, 
  Globe, 
  Flame 
} from 'lucide-react';
import type { WorkspaceTab } from './CommandPalette';

export type CorridorFilter = 'ALL' | 'BLR' | 'YC' | 'REMOTE' | 'NOTICE';

interface WorkspaceSidebarProps {
  activeTab: WorkspaceTab;
  onSelectTab: (tab: WorkspaceTab) => void;
  activeFilter: CorridorFilter;
  onSelectFilter: (filter: CorridorFilter) => void;
  roleCount: number;
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
  activeFilter,
  onSelectFilter,
  roleCount,
  pipelineCount,
  candidate,
  onOpenCommandPalette,
  onOpenProfile,
  isCollapsed,
  onToggleCollapse,
}) => {
  return (
    <aside 
      className={`h-screen flex flex-col bg-[#121318] border-r border-[#21232D] text-[#EDEDED] select-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] z-30 shrink-0 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-14 px-4 border-b border-[#21232D] flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#5E6AD2] to-[#3B46A3] flex items-center justify-center font-bold text-white shadow-sm shrink-0 text-sm">
              JP
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm tracking-tight text-white truncate">JobPilot</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              </div>
              <p className="text-[10px] text-[#787A88] truncate font-sans">Bangalore & YC Radar</p>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="mx-auto w-8 h-8 rounded-lg bg-gradient-to-br from-[#5E6AD2] to-[#3B46A3] flex items-center justify-center font-bold text-white shadow-sm text-sm">
            JP
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1 rounded text-[#787A88] hover:text-[#EDEDED] hover:bg-[#1A1C24] transition-colors"
        >
          {isCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Global Search / Command Bar Trigger */}
      <div className="p-3 border-b border-[#21232D]">
        <button
          onClick={onOpenCommandPalette}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#181922] border border-[#252734] hover:border-[#383B4E] hover:bg-[#1E202B] text-xs text-[#787A88] transition-all group ${
            isCollapsed ? 'justify-center px-1' : ''
          }`}
          title="Search or commands (⌘K)"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Search className="w-3.5 h-3.5 text-[#787A88] group-hover:text-[#EDEDED] shrink-0" />
            {!isCollapsed && <span className="truncate">Search or jump to...</span>}
          </div>
          {!isCollapsed && (
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#222432] text-[#9D9FA9] border border-[#2D3042]">
              ⌘K
            </kbd>
          )}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-5 text-xs font-sans">
        {/* Section 1: Core Views */}
        <div>
          {!isCollapsed && (
            <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#636573]">
              Workspace
            </div>
          )}
          <div className="space-y-0.5">
            {/* Directory */}
            <button
              onClick={() => onSelectTab('DIRECTORY')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-all ${
                activeTab === 'DIRECTORY'
                  ? 'bg-[#1F212D] text-white font-medium shadow-sm border-l-2 border-[#5E6AD2]'
                  : 'text-[#9D9FA9] hover:text-[#EDEDED] hover:bg-[#171821]'
              } ${isCollapsed ? 'justify-center px-1' : ''}`}
              title="Jobs Directory"
            >
              <div className="flex items-center gap-2.5">
                <Briefcase className={`w-4 h-4 shrink-0 ${activeTab === 'DIRECTORY' ? 'text-[#5E6AD2]' : 'text-[#787A88]'}`} />
                {!isCollapsed && <span>Jobs Directory</span>}
              </div>
              {!isCollapsed && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#181922] text-[#8C8E9C] border border-[#232533]">
                  {roleCount}
                </span>
              )}
            </button>

            {/* Pipeline Tracker */}
            <button
              onClick={() => onSelectTab('PIPELINE')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-all ${
                activeTab === 'PIPELINE'
                  ? 'bg-[#1F212D] text-white font-medium shadow-sm border-l-2 border-[#5E6AD2]'
                  : 'text-[#9D9FA9] hover:text-[#EDEDED] hover:bg-[#171821]'
              } ${isCollapsed ? 'justify-center px-1' : ''}`}
              title="Applications Pipeline"
            >
              <div className="flex items-center gap-2.5">
                <Kanban className={`w-4 h-4 shrink-0 ${activeTab === 'PIPELINE' ? 'text-[#5E6AD2]' : 'text-[#787A88]'}`} />
                {!isCollapsed && <span>Pipeline CRM</span>}
              </div>
              {!isCollapsed && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#181922] text-indigo-400 border border-[#232533]">
                  {pipelineCount}
                </span>
              )}
            </button>

            {/* Swipe Deck */}
            <button
              onClick={() => onSelectTab('SWIPE')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-all ${
                activeTab === 'SWIPE'
                  ? 'bg-[#1F212D] text-white font-medium shadow-sm border-l-2 border-[#5E6AD2]'
                  : 'text-[#9D9FA9] hover:text-[#EDEDED] hover:bg-[#171821]'
              } ${isCollapsed ? 'justify-center px-1' : ''}`}
              title="Swipe Triage Deck"
            >
              <div className="flex items-center gap-2.5">
                <Layers className={`w-4 h-4 shrink-0 ${activeTab === 'SWIPE' ? 'text-[#5E6AD2]' : 'text-[#787A88]'}`} />
                {!isCollapsed && <span>Swipe Triage</span>}
              </div>
              {!isCollapsed && (
                <span className="text-[9px] uppercase tracking-wider text-[#636573] font-mono">
                  Deck
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Section 2: Curated Filters */}
        {!isCollapsed && (
          <div>
            <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#636573]">
              Curated Streams
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => {
                  onSelectFilter('ALL');
                  if (activeTab !== 'DIRECTORY') onSelectTab('DIRECTORY');
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] transition-colors ${
                  activeFilter === 'ALL' && activeTab === 'DIRECTORY'
                    ? 'text-white bg-[#1A1C26] font-medium'
                    : 'text-[#858796] hover:text-[#EDEDED] hover:bg-[#161720]'
                }`}
              >
                <span>All Roles</span>
                <span className="text-[10px] font-mono text-[#636573]">{roleCount}</span>
              </button>

              <button
                onClick={() => {
                  onSelectFilter('BLR');
                  if (activeTab !== 'DIRECTORY') onSelectTab('DIRECTORY');
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] transition-colors ${
                  activeFilter === 'BLR' && activeTab === 'DIRECTORY'
                    ? 'text-white bg-[#1A1C26] font-medium'
                    : 'text-[#858796] hover:text-[#EDEDED] hover:bg-[#161720]'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>Bangalore Corridors</span>
                </span>
                <span className="text-[9px] text-[#636573]">HSR/Indira</span>
              </button>

              <button
                onClick={() => {
                  onSelectFilter('YC');
                  if (activeTab !== 'DIRECTORY') onSelectTab('DIRECTORY');
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] transition-colors ${
                  activeFilter === 'YC' && activeTab === 'DIRECTORY'
                    ? 'text-white bg-[#1A1C26] font-medium'
                    : 'text-[#858796] hover:text-[#EDEDED] hover:bg-[#161720]'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span>YC Founders</span>
                </span>
                <span className="text-[9px] text-[#636573]">W24/S24</span>
              </button>

              <button
                onClick={() => {
                  onSelectFilter('REMOTE');
                  if (activeTab !== 'DIRECTORY') onSelectTab('DIRECTORY');
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] transition-colors ${
                  activeFilter === 'REMOTE' && activeTab === 'DIRECTORY'
                    ? 'text-white bg-[#1A1C26] font-medium'
                    : 'text-[#858796] hover:text-[#EDEDED] hover:bg-[#161720]'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-sky-400" />
                  <span>Remote / Global</span>
                </span>
                <span className="text-[9px] text-[#636573]">Anywhere</span>
              </button>

              <button
                onClick={() => {
                  onSelectFilter('NOTICE');
                  if (activeTab !== 'DIRECTORY') onSelectTab('DIRECTORY');
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] transition-colors ${
                  activeFilter === 'NOTICE' && activeTab === 'DIRECTORY'
                    ? 'text-white bg-[#1A1C26] font-medium'
                    : 'text-[#858796] hover:text-[#EDEDED] hover:bg-[#161720]'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-purple-400" />
                  <span>Notice Buyout Covered</span>
                </span>
                <span className="text-[9px] text-purple-400 font-mono">Immediate</span>
              </button>
            </div>
          </div>
        )}

        {/* Section 3: Tools & Workflows */}
        <div>
          {!isCollapsed && (
            <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#636573]">
              Workflow Tools
            </div>
          )}
          <div className="space-y-0.5">
            <button
              onClick={() => onSelectTab('ATS_LAB')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all ${
                activeTab === 'ATS_LAB'
                  ? 'bg-[#1F212D] text-white font-medium shadow-sm border-l-2 border-[#5E6AD2]'
                  : 'text-[#9D9FA9] hover:text-[#EDEDED] hover:bg-[#171821]'
              } ${isCollapsed ? 'justify-center px-1' : ''}`}
              title="ATS Keyword Lab"
            >
              <FileText className={`w-4 h-4 shrink-0 ${activeTab === 'ATS_LAB' ? 'text-[#5E6AD2]' : 'text-[#787A88]'}`} />
              {!isCollapsed && <span>ATS Keyword Lab</span>}
            </button>

            <button
              onClick={() => onSelectTab('OUTREACH')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all ${
                activeTab === 'OUTREACH'
                  ? 'bg-[#1F212D] text-white font-medium shadow-sm border-l-2 border-[#5E6AD2]'
                  : 'text-[#9D9FA9] hover:text-[#EDEDED] hover:bg-[#171821]'
              } ${isCollapsed ? 'justify-center px-1' : ''}`}
              title="Founder Pitch Composer"
            >
              <Send className={`w-4 h-4 shrink-0 ${activeTab === 'OUTREACH' ? 'text-[#5E6AD2]' : 'text-[#787A88]'}`} />
              {!isCollapsed && <span>Founder Pitch Composer</span>}
            </button>

            <button
              onClick={() => onSelectTab('PORTFOLIO')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all ${
                activeTab === 'PORTFOLIO'
                  ? 'bg-[#1F212D] text-white font-medium shadow-sm border-l-2 border-[#5E6AD2]'
                  : 'text-[#9D9FA9] hover:text-[#EDEDED] hover:bg-[#171821]'
              } ${isCollapsed ? 'justify-center px-1' : ''}`}
              title="GitHub Proof Studio"
            >
              <Code2 className={`w-4 h-4 shrink-0 ${activeTab === 'PORTFOLIO' ? 'text-[#5E6AD2]' : 'text-[#787A88]'}`} />
              {!isCollapsed && <span>GitHub Proof Studio</span>}
            </button>

            <button
              onClick={() => onSelectTab('PROFILE')}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all ${
                activeTab === 'PROFILE'
                  ? 'bg-[#1F212D] text-white font-medium shadow-sm border-l-2 border-[#5E6AD2]'
                  : 'text-[#9D9FA9] hover:text-[#EDEDED] hover:bg-[#171821]'
              } ${isCollapsed ? 'justify-center px-1' : ''}`}
              title="Candidate Profile Vault"
            >
              <User className={`w-4 h-4 shrink-0 ${activeTab === 'PROFILE' ? 'text-[#5E6AD2]' : 'text-[#787A88]'}`} />
              {!isCollapsed && <span>Profile & Skills Vault</span>}
            </button>
          </div>
        </div>

        {/* Section 4: System */}
        <div>
          <button
            onClick={() => onSelectTab('FAQ')}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all ${
              activeTab === 'FAQ'
                ? 'bg-[#1F212D] text-white font-medium shadow-sm border-l-2 border-[#5E6AD2]'
                : 'text-[#787A88] hover:text-[#EDEDED] hover:bg-[#171821]'
            } ${isCollapsed ? 'justify-center px-1' : ''}`}
            title="Workflow Architecture & FAQ"
          >
            <HelpCircle className="w-4 h-4 shrink-0 text-[#787A88]" />
            {!isCollapsed && <span>Architecture & FAQ</span>}
          </button>
        </div>
      </div>

      {/* Bottom Profile Pill */}
      <div className="p-3 border-t border-[#21232D] bg-[#101116]">
        <button
          onClick={onOpenProfile}
          className={`w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#181922] transition-colors text-left ${
            isCollapsed ? 'justify-center p-1' : ''
          }`}
          title="Edit profile & skills"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-700 border border-[#2D2F3E] flex items-center justify-center font-semibold text-xs text-white shrink-0">
            {candidate.fullName.split(' ').map(n => n[0]).join('').slice(0, 2) || 'CA'}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-xs text-[#EDEDED] truncate">{candidate.fullName}</span>
                <span className="text-[10px] font-mono text-emerald-400">{candidate.yearsOfExperience}y</span>
              </div>
              <p className="text-[10px] text-[#787A88] truncate">{candidate.headline.split('(')[0]}</p>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
