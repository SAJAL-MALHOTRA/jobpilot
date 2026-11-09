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
    <header className="sticky top-0 z-40 bg-[#090A0F]/90 backdrop-blur-md border-b border-[#1A1D27] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Brand - JobPilot Supersonic Vector Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('RADAR')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#161824] border border-[#262B3D] text-white flex items-center justify-center shadow-md group-hover:border-white transition-colors">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 19 21 12 17 5 21 12 2" fill="currentColor" fillOpacity="0.2" />
                  <circle cx="12" cy="10" r="2" fill="currentColor" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base text-white tracking-tight">
                    JobPilot
                  </span>
                  <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-[#161824] text-[#A3A8BD] border border-[#262B3D]">
                    v2.5
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Clean Segmented Navigation */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-[#12141D] border border-[#1E2230] text-xs font-medium">
            <button
              onClick={() => setActiveTab('RADAR')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                activeTab === 'RADAR'
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'text-[#8C93A8] hover:text-white'
              }`}
            >
              Startup Roles
            </button>

            <button
              onClick={() => setActiveTab('OUTREACH')}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'OUTREACH'
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'text-[#8C93A8] hover:text-white'
              }`}
            >
              <span>Cold Email Playbook</span>
              <span className="text-[10px] font-mono px-1 rounded bg-[#202434] text-[#A3A8BD]">80%</span>
            </button>

            <button
              onClick={() => setActiveTab('ATS_LAB')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                activeTab === 'ATS_LAB'
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'text-[#8C93A8] hover:text-white'
              }`}
            >
              ATS Resume Lab
            </button>

            <button
              onClick={() => setActiveTab('CRM')}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'CRM'
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'text-[#8C93A8] hover:text-white'
              }`}
            >
              <span>Applications</span>
              {applicationsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-black text-[10px] flex items-center justify-center font-bold">
                  {applicationsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('PORTFOLIO')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                activeTab === 'PORTFOLIO'
                  ? 'bg-white text-black shadow-sm font-semibold'
                  : 'text-[#8C93A8] hover:text-white'
              }`}
            >
              Proof-of-Work
            </button>
          </nav>

          {/* Right Action: Candidate Profile Vault */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-[#13151F] hover:bg-[#1A1D2B] border border-[#222638] text-xs transition-all shadow-sm group"
            >
              <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center text-[10px] font-bold">
                {candidateName.charAt(0)}
              </div>
              <div className="text-left font-medium text-[#C5CADB] group-hover:text-white">
                <span>{candidateName}</span>
                <span className="text-[#687087] ml-1 text-[11px]">({candidateYoe} YOE)</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
