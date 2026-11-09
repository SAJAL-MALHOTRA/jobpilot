import React from 'react';

interface NavbarProps {
  activeTab: 'RADAR' | 'ATS_LAB' | 'OUTREACH' | 'CRM' | 'PORTFOLIO';
  setActiveTab: (tab: 'RADAR' | 'ATS_LAB' | 'OUTREACH' | 'CRM' | 'PORTFOLIO') => void;
  onOpenProfile: () => void;
  candidateName: string;
  candidateYoe: number;
  applicationsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenProfile,
  candidateName,
  candidateYoe,
  applicationsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#000000]/95 backdrop-blur-md border-b border-[#1A1A1A] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Brand - JobPilot Minimalist Vector Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('RADAR')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#111111] border border-[#262626] text-white flex items-center justify-center font-bold text-xs group-hover:border-white transition-colors">
                JP
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base text-white tracking-tight">
                    JobPilot
                  </span>
                  <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-[#141414] text-[#888888] border border-[#262626]">
                    RADAR
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Clean Segmented Navigation */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-[#0A0A0A] border border-[#222222] text-xs font-medium">
            <button
              onClick={() => setActiveTab('RADAR')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                activeTab === 'RADAR'
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              Startup Roles
            </button>

            <button
              onClick={() => setActiveTab('OUTREACH')}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'OUTREACH'
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              <span>Founder Pitches</span>
            </button>

            <button
              onClick={() => setActiveTab('ATS_LAB')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                activeTab === 'ATS_LAB'
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              ATS Resume Lab
            </button>

            <button
              onClick={() => setActiveTab('PORTFOLIO')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                activeTab === 'PORTFOLIO'
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              GitHub Importer
            </button>

            <button
              onClick={() => setActiveTab('CRM')}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'CRM'
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              <span>Tracker</span>
              {applicationsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-black text-[10px] flex items-center justify-center font-bold">
                  {applicationsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action: Candidate Profile Vault */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-[#0A0A0A] hover:bg-[#141414] border border-[#222222] text-xs transition-all shadow-sm group"
            >
              <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-[10px] font-bold">
                {candidateName.charAt(0)}
              </div>
              <div className="text-left font-medium text-[#C5CADB] group-hover:text-white">
                <span>{candidateName}</span>
                <span className="text-[#888888] ml-1 text-[11px]">({candidateYoe} YOE)</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
