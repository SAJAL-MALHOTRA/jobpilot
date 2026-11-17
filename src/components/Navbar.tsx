import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Briefcase, 
  Mail, 
  FileText, 
  Code2, 
  CheckSquare, 
  HelpCircle,
  User
} from 'lucide-react';

export interface NavbarProps {
  activeTab: 'RADAR' | 'ATS_LAB' | 'OUTREACH' | 'CRM' | 'PORTFOLIO';
  setActiveTab: (tab: 'RADAR' | 'ATS_LAB' | 'OUTREACH' | 'CRM' | 'PORTFOLIO') => void;
  onOpenProfile: () => void;
  candidateName: string;
  candidateYoe: number;
  applicationsCount: number;
  onOpenFaq?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenProfile,
  candidateName,
  candidateYoe,
  applicationsCount,
  onOpenFaq,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleNavClick = (tab: 'RADAR' | 'ATS_LAB' | 'OUTREACH' | 'CRM' | 'PORTFOLIO') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const handleFaqClick = () => {
    setMobileMenuOpen(false);
    if (onOpenFaq) {
      onOpenFaq();
    } else {
      const el = document.getElementById('faq');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#1F1F1F] bg-black/90 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('RADAR')}
              className="flex items-center gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-lg"
              aria-label="JobPilot Home"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-xs font-black text-black transition-transform group-hover:scale-105">
                JP
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold tracking-tight text-white">
                    JobPilot
                  </span>
                  <span className="rounded border border-[#262626] bg-[#141414] px-1.5 py-0.5 font-mono text-[10px] font-medium text-[#888888]">
                    WORKSPACE
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Pills */}
          <nav 
            aria-label="Main Navigation" 
            className="hidden md:flex items-center gap-1 rounded-full border border-[#222222] bg-[#0A0A0A] p-1 text-xs font-medium"
          >
            <button
              onClick={() => handleNavClick('RADAR')}
              className={`rounded-full px-3.5 py-1.5 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white ${
                activeTab === 'RADAR'
                  ? 'bg-white font-semibold text-black shadow-sm'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              Sample Roles
            </button>

            <button
              onClick={() => handleNavClick('OUTREACH')}
              className={`rounded-full px-3.5 py-1.5 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white ${
                activeTab === 'OUTREACH'
                  ? 'bg-white font-semibold text-black shadow-sm'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              Founder Pitches
            </button>

            <button
              onClick={() => handleNavClick('ATS_LAB')}
              className={`rounded-full px-3.5 py-1.5 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white ${
                activeTab === 'ATS_LAB'
                  ? 'bg-white font-semibold text-black shadow-sm'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              ATS Resume
            </button>

            <button
              onClick={() => handleNavClick('PORTFOLIO')}
              className={`rounded-full px-3.5 py-1.5 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white ${
                activeTab === 'PORTFOLIO'
                  ? 'bg-white font-semibold text-black shadow-sm'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              GitHub Importer
            </button>

            <button
              onClick={() => handleNavClick('CRM')}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white ${
                activeTab === 'CRM'
                  ? 'bg-white font-semibold text-black shadow-sm'
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              <span>Tracker</span>
              {applicationsCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black">
                  {applicationsCount}
                </span>
              )}
            </button>

            <button
              onClick={handleFaqClick}
              className="rounded-full px-3 py-1.5 text-[#888888] transition-all hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
            >
              FAQ
            </button>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            {/* Candidate Profile Button */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 rounded-full border border-[#222222] bg-[#0A0A0A] py-1.5 pl-2 pr-3 text-xs transition-all hover:bg-[#141414] hover:border-[#333333] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white shadow-sm"
              title="Open profile vault"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black">
                {candidateName ? candidateName.charAt(0).toUpperCase() : 'C'}
              </div>
              <div className="hidden sm:block text-left font-medium text-[#D4D4D4]">
                <span>{candidateName || 'Candidate'}</span>
                <span className="ml-1 text-[11px] text-[#888888]">({candidateYoe} YOE)</span>
              </div>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-[#222222] bg-[#0A0A0A] text-[#A1A1A1] transition-colors hover:bg-[#141414] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div 
          className="border-b border-[#1F1F1F] bg-[#0A0A0A] px-4 py-4 md:hidden animate-in slide-in-from-top-2 duration-150"
          role="dialog"
          aria-label="Mobile Navigation Menu"
        >
          <div className="flex flex-col gap-1.5 font-mono text-xs">
            <button
              onClick={() => handleNavClick('RADAR')}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-neutral-300 hover:bg-[#141414] hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <Briefcase className="h-3.5 w-3.5 text-[#888888]" />
                <span>Sample Roles</span>
              </span>
              <span className="text-[10px] text-neutral-500 font-sans">Browse</span>
            </button>

            <button
              onClick={() => handleNavClick('OUTREACH')}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-neutral-300 hover:bg-[#141414] hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <Mail className="h-3.5 w-3.5 text-[#888888]" />
                <span>Founder Pitches</span>
              </span>
              <span className="text-[10px] text-neutral-500 font-sans">Draft</span>
            </button>

            <button
              onClick={() => handleNavClick('ATS_LAB')}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-neutral-300 hover:bg-[#141414] hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <FileText className="h-3.5 w-3.5 text-[#888888]" />
                <span>ATS Resume</span>
              </span>
              <span className="text-[10px] text-neutral-500 font-sans">Format</span>
            </button>

            <button
              onClick={() => handleNavClick('PORTFOLIO')}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-neutral-300 hover:bg-[#141414] hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <Code2 className="h-3.5 w-3.5 text-[#888888]" />
                <span>GitHub Importer</span>
              </span>
              <span className="text-[10px] text-neutral-500 font-sans">Sync</span>
            </button>

            <button
              onClick={() => handleNavClick('CRM')}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-neutral-300 hover:bg-[#141414] hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <CheckSquare className="h-3.5 w-3.5 text-[#888888]" />
                <span>Application Tracker</span>
              </span>
              {applicationsCount > 0 ? (
                <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-bold text-black font-mono">
                  {applicationsCount}
                </span>
              ) : (
                <span className="text-[10px] text-neutral-500 font-sans">0 active</span>
              )}
            </button>

            <button
              onClick={handleFaqClick}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-neutral-300 hover:bg-[#141414] hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <HelpCircle className="h-3.5 w-3.5 text-[#888888]" />
                <span>Workflow FAQ</span>
              </span>
              <span className="text-[10px] text-neutral-500 font-sans">Info</span>
            </button>

            <div className="pt-2 border-t border-[#1C1C1C] mt-1">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenProfile();
                }}
                className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-neutral-200 bg-[#121212] hover:bg-[#1A1A1A] transition-colors"
              >
                <span className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-white" />
                  <span className="font-semibold text-white">{candidateName}</span>
                </span>
                <span className="text-[11px] text-[#888888] font-mono">Profile Vault</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
