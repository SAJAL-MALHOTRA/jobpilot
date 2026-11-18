import React, { useState } from 'react';
import type { CandidateProfile } from '../types';
import { parseResumeText, ROLE_OPTIONS } from '../lib/resumeDetector';
import { Modal } from './Modal';
import HoldButton from './kokonutui/hold-button';
import { 
  UploadCloud, 
  X, 
  CheckCircle2
} from 'lucide-react';

interface ResumeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidateProfile;
  onSaveProfile: (updated: CandidateProfile) => void;
}

const ALL_ROLES = ROLE_OPTIONS.map((r) => r.role);

export const ResumeScannerModal: React.FC<ResumeScannerModalProps> = ({
  isOpen,
  onClose,
  candidate,
  onSaveProfile,
}) => {
  const [pasteText, setPasteText] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  // Editable candidate suggestions
  const [skills, setSkills] = useState<string[]>(candidate.primarySkills || []);
  const [roles, setRoles] = useState<string[]>(candidate.targetRoles || ['Full Stack Developer']);
  const [locations, setLocations] = useState<string[]>([candidate.location || 'Bangalore']);
  const [yoe, setYoe] = useState<number>(candidate.yearsOfExperience || 4);
  const [newSkillText, setNewSkillText] = useState('');

  if (!isOpen) return null;

  const handleScanText = () => {
    if (!pasteText.trim()) return;
    setIsScanning(true);
    setTimeout(() => {
      const res = parseResumeText(pasteText);
      if (res.detectedSkills.length > 0) {
        setSkills(res.detectedSkills);
      }
      if (res.detectedRoles.length > 0) {
        setRoles(res.detectedRoles);
      }
      if (res.detectedLocations.length > 0) {
        setLocations(res.detectedLocations);
      }
      if (res.detectedYearsOfExperience !== null) {
        setYoe(res.detectedYearsOfExperience);
      }
      setIsScanning(false);
    }, 400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setPasteText(content);
        const res = parseResumeText(content);
        if (res.detectedSkills.length > 0) setSkills(res.detectedSkills);
        if (res.detectedRoles.length > 0) setRoles(res.detectedRoles);
        if (res.detectedLocations.length > 0) setLocations(res.detectedLocations);
        if (res.detectedYearsOfExperience !== null) setYoe(res.detectedYearsOfExperience);
      }
    };
    reader.readAsText(file);
  };

  const handleAddSkill = (skill: string) => {
    const s = skill.trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
    }
    setNewSkillText('');
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((sk) => sk !== skill));
  };

  const handleToggleRole = (role: string) => {
    if (roles.includes(role)) {
      if (roles.length > 1) setRoles(roles.filter((r) => r !== role));
    } else {
      setRoles([...roles, role]);
    }
  };

  const handleSaveAndRescore = () => {
    const updated: CandidateProfile = {
      ...candidate,
      primarySkills: skills.slice(0, 8),
      secondarySkills: skills.slice(8),
      targetRoles: roles,
      yearsOfExperience: yoe,
      location: locations[0] || 'Bangalore',
    };
    onSaveProfile(updated);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Resume Skill Scanner & Onboarding"
      subtitle="Paste resume text or upload to auto-detect skills and re-score startup matches"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6 text-neutral-900 dark:text-neutral-100 font-sans">
        
        {/* Paste or Upload Area */}
        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#121316] border border-neutral-200/80 dark:border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Step 1: Paste Resume Text or Upload</span>
            </span>

            <label className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
              Upload file (.txt / .md)
              <input
                type="file"
                accept=".txt,.md,.json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            rows={4}
            placeholder="Paste your resume text here (experience bullets, skills section, education)... We'll deterministically extract your technical profile."
            className="w-full p-3 rounded-lg bg-white dark:bg-black/60 border border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-white transition-colors"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-mono text-neutral-400">
              No files are stored on any server. Detection runs 100% in your browser.
            </span>
            <button
              onClick={handleScanText}
              disabled={isScanning || !pasteText.trim()}
              className="px-4 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black text-xs font-mono font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
            >
              <span>{isScanning ? 'Scanning...' : 'Detect Skills & Roles'}</span>
            </button>
          </div>
        </div>

        {/* Step 2: Review Detected Skills */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Step 2: Review Technical Skills ({skills.length})</span>
            </span>
            <span className="text-[11px] font-mono text-neutral-400">Click x to remove</span>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-3 rounded-xl bg-neutral-50/70 dark:bg-[#121316] border border-neutral-200/80 dark:border-neutral-800">
            {skills.map((sk) => (
              <span
                key={sk}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-mono font-medium text-neutral-800 dark:text-neutral-200 shadow-2xs"
              >
                <span>{sk}</span>
                <button
                  onClick={() => handleRemoveSkill(sk)}
                  className="hover:text-red-500 text-neutral-400 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {skills.length === 0 && (
              <span className="text-xs text-neutral-400 font-mono">No skills added yet. Type below or paste resume.</span>
            )}
          </div>

          {/* Quick Add Skill Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newSkillText}
              onChange={(e) => setNewSkillText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill(newSkillText);
                }
              }}
              placeholder="Add skill (e.g. Docker, Go, Redis, PyTorch)..."
              className="flex-1 px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-mono text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-white"
            />
            <button
              onClick={() => handleAddSkill(newSkillText)}
              disabled={!newSkillText.trim()}
              className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-mono font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>

        {/* Step 3: Target Roles & Experience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider block">
              Target Engineering Roles:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {ALL_ROLES.slice(0, 6).map((role) => {
                const isSelected = roles.includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleToggleRole(role)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors border ${
                      isSelected
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-transparent font-semibold shadow-2xs'
                        : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                    }`}
                  >
                    {role}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider block">
              Years of Production Experience:
            </span>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={0}
                max={30}
                step={0.5}
                value={yoe}
                onChange={(e) => setYoe(parseFloat(e.target.value) || 0)}
                className="w-24 px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-mono font-bold text-neutral-900 dark:text-white"
              />
              <span className="text-xs font-mono text-neutral-500">
                {yoe >= 5 ? 'Senior / Lead IC' : yoe >= 2 ? 'Mid-Level IC' : 'Junior / Intern'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Confirmation */}
        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-mono text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>

          <HoldButton
            variant="blue"
            holdDuration={800}
            onHoldComplete={handleSaveAndRescore}
            holdingLabel="Re-scoring Radar..."
            completeLabel="Radar Updated!"
            className="h-9 px-4 text-xs font-semibold"
          >
            Hold to Save & Re-score All Startups
          </HoldButton>
        </div>
      </div>
    </Modal>
  );
};

export default ResumeScannerModal;
