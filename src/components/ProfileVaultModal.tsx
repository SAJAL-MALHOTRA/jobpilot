import React, { useState } from 'react';
import type { CandidateProfile } from '../types';
import { X, User, Check, Globe, Link } from 'lucide-react';

interface ProfileVaultModalProps {
  candidate: CandidateProfile;
  onSave: (updated: CandidateProfile) => void;
  onClose: () => void;
}

export const ProfileVaultModal: React.FC<ProfileVaultModalProps> = ({
  candidate,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<CandidateProfile>(candidate);
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (!newSkill.trim() || formData.primarySkills.includes(newSkill.trim())) return;
    setFormData({
      ...formData,
      primarySkills: [...formData.primarySkills, newSkill.trim()]
    });
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      primarySkills: formData.primarySkills.filter(s => s !== skillToRemove)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#101625] border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Candidate Profile Vault</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                The agent references this data to calculate ATS match scores and write personalized cold outreach.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 text-xs">
          {/* Name & Email */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Professional Headline */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Professional Headline</label>
            <input
              type="text"
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Years of Experience & Min Target CTC */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-300 font-semibold">Years of Experience</label>
                <span className="font-mono font-bold text-indigo-400">{formData.yearsOfExperience} YOE</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="0.5"
                value={formData.yearsOfExperience}
                onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 mt-2"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-300 font-semibold">Min Target CTC</label>
                <span className="font-mono font-bold text-indigo-400">₹ {formData.minTargetCtcLpa} LPA</span>
              </div>
              <input
                type="range"
                min="12"
                max="60"
                step="2"
                value={formData.minTargetCtcLpa}
                onChange={(e) => setFormData({ ...formData, minTargetCtcLpa: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 mt-2"
              />
            </div>
          </div>

          {/* Skills Management */}
          <div className="space-y-2">
            <label className="block text-slate-300 font-semibold">Primary Tech Stack & Skills</label>
            <div className="flex flex-wrap gap-1.5 pb-2">
              {formData.primarySkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 flex items-center gap-1.5"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-indigo-400 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add skill (e.g. Kubernetes, Redis, Next.js)..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleAddSkill}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl"
              >
                Add
              </button>
            </div>
          </div>

          {/* Links (GitHub, LinkedIn, Portfolio) */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <Link className="w-3.5 h-3.5" /> GitHub URL
              </label>
              <input
                type="text"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-blue-400" /> LinkedIn URL
              </label>
              <input
                type="text"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onSave(formData);
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Save Profile Vault</span>
          </button>
        </div>
      </div>
    </div>
  );
};
