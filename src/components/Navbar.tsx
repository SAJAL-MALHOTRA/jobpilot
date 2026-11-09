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
    <header className="sticky top-0 z-40 bg-[#FAFAFA]/90 backdrop-blur-md border-b border-[#E5E7EB] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Brand - Clean Minimalist Wordmark (Aarivi Style) */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('RADAR')}
              className="flex items-center gap-2 text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#111827] text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-sm">
                JP
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base text-[#111827] tracking-tight group-hover:text-black">
                    JobPilot
                  </span>
                  <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]">
                    YC / Bangalore
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Clean Segmented Navigation (Aarivi / Linear Style) */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-[#F3F4F6] border border-[#E5E7EB] text-xs font-medium">
            <button
              onClick={() => setActiveTab('RADAR')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                activeTab === 'RADAR'
                  ? 'bg-white text-[#111827] shadow-sm font-semibold'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              Startup Roles
            </button>

            <button
              onClick={() => setActiveTab('OUTREACH')}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'OUTREACH'
                  ? 'bg-white text-[#111827] shadow-sm font-semibold'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              <span>Cold Email Playbook</span>
              <span className="text-[10px] font-mono px-1 rounded bg-[#E5E7EB] text-[#374151]">80%</span>
            </button>

            <button
              onClick={() => setActiveTab('ATS_LAB')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                activeTab === 'ATS_LAB'
                  ? 'bg-white text-[#111827] shadow-sm font-semibold'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              ATS Resume Lab
            </button>

            <button
              onClick={() => setActiveTab('CRM')}
              className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeTab === 'CRM'
                  ? 'bg-white text-[#111827] shadow-sm font-semibold'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              <span>Applications</span>
              {applicationsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#111827] text-white text-[10px] flex items-center justify-center font-bold">
                  {applicationsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('PORTFOLIO')}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                activeTab === 'PORTFOLIO'
                  ? 'bg-white text-[#111827] shadow-sm font-semibold'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              Proof-of-Work
            </button>
          </nav>

          {/* Right Action: Candidate Profile Vault (Aarivi Style) */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white hover:bg-[#F9FAFB] border border-[#E5E7EB] text-xs transition-all shadow-sm group"
            >
              <div className="w-5 h-5 rounded-full bg-[#111827] text-white flex items-center justify-center text-[10px] font-bold">
                {candidateName.charAt(0)}
              </div>
              <div className="text-left font-medium text-[#374151] group-hover:text-[#111827]">
                <span>{candidateName}</span>
                <span className="text-[#9CA3AF] ml-1 text-[11px]">({candidateYoe} YOE)</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
