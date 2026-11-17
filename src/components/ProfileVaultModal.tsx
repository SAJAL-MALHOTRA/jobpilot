import React, { useState } from 'react';
import type { CandidateProfile, ResumeBullet } from '../types';
import { Modal } from './Modal';
import { User, Check, Globe, Link, Plus, Trash2, FileText, Briefcase, GraduationCap } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'BULLETS' | 'EXPERIENCE'>('DETAILS');
  const [newSkill, setNewSkill] = useState('');

  // Add new bullet state
  const [newBulletText, setNewBulletText] = useState('');
  const [newBulletRole, setNewBulletRole] = useState(candidate.headline.split('(')[0].trim() || 'Software Engineer');
  const [newBulletCompany, setNewBulletCompany] = useState(candidate.currentCompany || 'Tech Corp');

  const handleAddSkill = () => {
    if (!newSkill.trim() || formData.primarySkills.includes(newSkill.trim())) return;
    setFormData({
      ...formData,
      primarySkills: [...formData.primarySkills, newSkill.trim()],
    });
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      primarySkills: formData.primarySkills.filter((s) => s !== skillToRemove),
    });
  };

  const handleUpdateBulletText = (id: string, text: string) => {
    setFormData({
      ...formData,
      resumeBullets: formData.resumeBullets.map((b) => (b.id === id ? { ...b, text } : b)),
    });
  };

  const handleRemoveBullet = (id: string) => {
    setFormData({
      ...formData,
      resumeBullets: formData.resumeBullets.filter((b) => b.id !== id),
    });
  };

  const handleAddBullet = () => {
    if (!newBulletText.trim()) return;
    const newBullet: ResumeBullet = {
      id: `b-${Date.now()}`,
      role: newBulletRole.trim() || 'Software Engineer',
      company: newBulletCompany.trim() || candidate.currentCompany,
      text: newBulletText.trim(),
      keywords: ['Engineering', 'Production'],
    };
    setFormData({
      ...formData,
      resumeBullets: [...formData.resumeBullets, newBullet],
    });
    setNewBulletText('');
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Candidate Profile Vault"
      subtitle="The autonomous radar references this verified data to calculate ATS matches and personalize pitches."
      icon={<User className="w-5 h-5 text-indigo-400" />}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-5 text-[#EDEDED] font-sans">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#222222] pb-2">
          <button
            onClick={() => setActiveTab('DETAILS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${
              activeTab === 'DETAILS'
                ? 'bg-[#1C1C1C] text-white border border-[#2E2E2E]'
                : 'text-[#A1A1A1] hover:text-white'
            }`}
          >
            Basic Info & Stack
          </button>
          <button
            onClick={() => setActiveTab('BULLETS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors flex items-center gap-1.5 ${
              activeTab === 'BULLETS'
                ? 'bg-[#1C1C1C] text-white border border-[#2E2E2E]'
                : 'text-[#A1A1A1] hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Resume Bullets ({formData.resumeBullets.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('EXPERIENCE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors flex items-center gap-1.5 ${
              activeTab === 'EXPERIENCE'
                ? 'bg-[#1C1C1C] text-white border border-[#2E2E2E]'
                : 'text-[#A1A1A1] hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>History & Education</span>
          </button>
        </div>

        {/* Tab 1: Details */}
        {activeTab === 'DETAILS' && (
          <div className="space-y-4 text-xs font-mono">
            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#A1A1A1] font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#141414] border border-[#262626] rounded-xl text-white focus:outline-none focus:border-white"
                />
              </div>
              <div>
                <label className="block text-[#A1A1A1] font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#141414] border border-[#262626] rounded-xl text-white focus:outline-none focus:border-white"
                />
              </div>
            </div>

            {/* Current Company & Headline */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[#A1A1A1] font-semibold mb-1">Current Company</label>
                <input
                  type="text"
                  value={formData.currentCompany}
                  onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#141414] border border-[#262626] rounded-xl text-white focus:outline-none focus:border-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[#A1A1A1] font-semibold mb-1">Professional Headline</label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#141414] border border-[#262626] rounded-xl text-white focus:outline-none focus:border-white"
                />
              </div>
            </div>

            {/* Experience Level & Min Target CTC */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#111111] p-4 rounded-xl border border-[#222222]">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[#A1A1A1] font-semibold">Experience Level</label>
                  <span className="font-bold text-white">{formData.yearsOfExperience} YOE</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="15"
                  step="0.5"
                  value={formData.yearsOfExperience}
                  onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-[#262626] rounded-lg appearance-none cursor-pointer accent-white mt-2"
                />
              </div>

              <div className="bg-[#111111] p-4 rounded-xl border border-[#222222]">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[#A1A1A1] font-semibold">Target Minimum CTC</label>
                  <span className="font-bold text-amber-300">₹{formData.minTargetCtcLpa} LPA</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="80"
                  step="2"
                  value={formData.minTargetCtcLpa}
                  onChange={(e) => setFormData({ ...formData, minTargetCtcLpa: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-[#262626] rounded-lg appearance-none cursor-pointer accent-amber-400 mt-2"
                />
              </div>
            </div>

            {/* Primary Skills */}
            <div className="space-y-2">
              <label className="block text-[#A1A1A1] font-semibold">Primary Core Tech Stack</label>
              <div className="flex flex-wrap gap-1.5 pb-1">
                {formData.primarySkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#141414] border border-[#262626] text-[#D4D4D4] flex items-center gap-1.5"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-[#737373] hover:text-white"
                      aria-label={`Remove skill ${skill}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add skill (e.g. Kafka, Redis, FastAPI)..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                  className="flex-1 px-3.5 py-2 bg-[#141414] border border-[#262626] rounded-xl text-white focus:outline-none focus:border-white"
                />
                <button
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#262626] text-white font-bold rounded-xl border border-[#2E2E2E] transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#222222]">
              <div>
                <label className="block text-[#A1A1A1] font-semibold mb-1 flex items-center gap-1">
                  <Link className="w-3.5 h-3.5" /> GitHub Profile
                </label>
                <input
                  type="text"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#141414] border border-[#262626] rounded-xl text-white focus:outline-none text-[11px]"
                />
              </div>
              <div>
                <label className="block text-[#A1A1A1] font-semibold mb-1 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-blue-400" /> LinkedIn Profile
                </label>
                <input
                  type="text"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#141414] border border-[#262626] rounded-xl text-white focus:outline-none text-[11px]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Resume Bullets Editor */}
        {activeTab === 'BULLETS' && (
          <div className="space-y-4">
            <p className="text-xs text-[#A1A1A1] font-mono">
              These verified accomplishment bullets feed the ATS tailoring engine and founder cold outreach. Edit them directly:
            </p>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {formData.resumeBullets.map((bullet) => (
                <div key={bullet.id} className="p-3.5 rounded-xl bg-[#111111] border border-[#222222] space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between text-[11px] text-[#A1A1A1]">
                    <span className="font-semibold text-white">
                      {bullet.role} &bull; {bullet.company}
                    </span>
                    <button
                      onClick={() => handleRemoveBullet(bullet.id)}
                      className="text-rose-400 hover:text-rose-300 p-1"
                      aria-label="Remove bullet"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={bullet.text}
                    onChange={(e) => handleUpdateBulletText(bullet.id, e.target.value)}
                    className="w-full p-2 bg-[#161616] border border-[#262626] rounded-lg text-white text-xs font-mono focus:outline-none focus:border-white leading-relaxed resize-none"
                  />
                </div>
              ))}
            </div>

            {/* Add New Bullet */}
            <div className="p-3.5 rounded-xl bg-[#111111] border border-[#262626] space-y-2 text-xs font-mono">
              <span className="font-bold text-white block">Add Verifiable Bullet Point:</span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Company"
                  value={newBulletCompany}
                  onChange={(e) => setNewBulletCompany(e.target.value)}
                  className="p-2 bg-[#161616] border border-[#262626] rounded-lg text-white text-xs font-mono"
                />
                <input
                  type="text"
                  placeholder="Role"
                  value={newBulletRole}
                  onChange={(e) => setNewBulletRole(e.target.value)}
                  className="p-2 bg-[#161616] border border-[#262626] rounded-lg text-white text-xs font-mono"
                />
              </div>
              <textarea
                rows={2}
                placeholder="Enter measurable engineering achievement..."
                value={newBulletText}
                onChange={(e) => setNewBulletText(e.target.value)}
                className="w-full p-2 bg-[#161616] border border-[#262626] rounded-lg text-white text-xs font-mono resize-none"
              />
              <button
                onClick={handleAddBullet}
                className="px-3 py-1.5 bg-[#1F1F1F] hover:bg-[#2A2A2A] text-white rounded-lg font-bold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Bullet</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: History & Education */}
        {activeTab === 'EXPERIENCE' && (
          <div className="space-y-4 text-xs font-mono">
            <div className="space-y-2">
              <h3 className="font-bold text-white flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                <span>Work Experience Timeline</span>
              </h3>
              <div className="space-y-2">
                {formData.experienceHistory?.map((exp) => (
                  <div key={exp.id} className="p-3 rounded-xl bg-[#111111] border border-[#222222] space-y-1">
                    <div className="flex justify-between font-bold text-white">
                      <span>{exp.company} - {exp.role}</span>
                      <span className="text-[#A1A1A1]">{exp.period}</span>
                    </div>
                    <p className="text-[11px] text-[#A1A1A1]">{exp.location}</p>
                  </div>
                )) || (
                  <div className="text-[#A1A1A1]">Using active resume bullets for work history.</div>
                )}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#222222]">
              <h3 className="font-bold text-white flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <span>Education Background</span>
              </h3>
              <div className="space-y-2">
                {formData.educationHistory?.map((edu) => (
                  <div key={edu.id} className="p-3 rounded-xl bg-[#111111] border border-[#222222] space-y-1">
                    <div className="flex justify-between font-bold text-white">
                      <span>{edu.institution}</span>
                      <span className="text-[#A1A1A1]">{edu.period}</span>
                    </div>
                    <div className="text-[11px] text-[#D4D4D4]">
                      {edu.degree} {edu.score ? `(${edu.score})` : ''}
                    </div>
                  </div>
                )) || (
                  <div className="text-[#A1A1A1]">Computer Science background registered.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-[#222222] font-mono">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-[#A1A1A1] hover:text-white transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onSave(formData);
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-all flex items-center gap-2 shadow-md"
          >
            <Check className="w-4 h-4" />
            <span>Save Profile Vault</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ProfileVaultModal;
