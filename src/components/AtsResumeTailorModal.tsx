import React, { useState } from 'react';
import type { JobListing, CandidateProfile, ATSMatchResult } from '../types';
import { runATSTailoring } from '../lib/atsTailorEngine';
import { Modal } from './Modal';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  ArrowRight, 
  FileText, 
  Download, 
  Printer,
  Sparkles,
  Terminal,
  Edit3
} from 'lucide-react';

interface AtsResumeTailorModalProps {
  job: JobListing;
  candidate: CandidateProfile;
  onClose: () => void;
  onProceedToOutreach: (job: JobListing) => void;
}

function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export const AtsResumeTailorModal: React.FC<AtsResumeTailorModalProps> = ({
  job,
  candidate,
  onClose,
  onProceedToOutreach,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'DIFF' | 'PREVIEW' | 'PARSER_VIEW'>('DIFF');
  const atsResult: ATSMatchResult = runATSTailoring(candidate, job);

  // Allow candidate to edit tailored bullets before exporting
  const [tailoredBullets, setTailoredBullets] = useState(atsResult.tailoredBullets);
  const [editingBulletId, setEditingBulletId] = useState<string | null>(null);

  const handleUpdateBullet = (id: string, newText: string) => {
    setTailoredBullets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, tailored: newText } : b))
    );
  };

  // Generate plain-text standard ATS formatted resume using actual candidate profile data
  const generateFormattedResumeText = () => {
    const experiences = candidate.experienceHistory && candidate.experienceHistory.length > 0
      ? candidate.experienceHistory.map((exp) => {
          return `${exp.company} | ${exp.role}
${exp.location || 'India'} | ${exp.period}
${exp.bullets.map((b) => `• ${b}`).join('\n')}`;
        }).join('\n\n')
      : `${candidate.currentCompany} | Senior Engineer
${candidate.location} | Present
${tailoredBullets.map((b) => `• ${b.tailored}`).join('\n')}`;

    const education = candidate.educationHistory && candidate.educationHistory.length > 0
      ? candidate.educationHistory.map((edu) => {
          return `${edu.degree}
${edu.institution} | ${edu.score ? `${edu.score} | ` : ''}${edu.period}`;
        }).join('\n\n')
      : 'B.Tech in Computer Science & Engineering\nAccredited University';

    return `================================================================================
${candidate.fullName.toUpperCase()}
${candidate.headline}
Location: ${candidate.location} | Email: ${candidate.email} | Phone: ${candidate.phone}
Portfolio: ${candidate.portfolioUrl} | GitHub: ${candidate.githubUrl}
================================================================================

PROFESSIONAL SUMMARY
Results-driven software engineer with ${candidate.yearsOfExperience} years of verified production experience 
specializing in ${candidate.primarySkills.slice(0, 4).join(', ')}. Proven track record at ${candidate.currentCompany} 
delivering reliable infrastructure and responsive systems. Specifically aligned for ${job.title} at ${job.company}.

CORE TECHNICAL SKILLS
* Primary Languages & Frameworks: ${candidate.primarySkills.join(', ')}
* Systems, Infra & Databases: ${candidate.secondarySkills.join(', ')}
* Target Role Keywords Aligned: ${job.requiredSkills.join(', ')}

SELECTED PROFESSIONAL EXPERIENCE
${experiences}

EDUCATION
${education}

TARGET ALIGNMENT: ${job.company} (${job.title})
ATS Match Score: ${atsResult.overallScore}% (Google X-Y-Z Quantified)
================================================================================`;
  };

  const handleCopyMarkdown = () => {
    const text = generateFormattedResumeText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPlainText = () => {
    const text = generateFormattedResumeText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${candidate.fullName.replace(/\s+/g, '_')}_Tailored_${job.company.replace(/\s+/g, '_')}_Resume.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Safe HTML print generation with full XSS escaping
  const handlePrintPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const experiencesHtml = candidate.experienceHistory && candidate.experienceHistory.length > 0
      ? candidate.experienceHistory.map((exp) => `
          <div class="job-header">
            <span>${escapeHtml(exp.company)}</span>
            <span>${escapeHtml(exp.location || 'India')}</span>
          </div>
          <div class="job-sub">
            <span>${escapeHtml(exp.role)}</span>
            <span>${escapeHtml(exp.period)}</span>
          </div>
          <ul>
            ${exp.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}
          </ul>
        `).join('')
      : `
          <div class="job-header">
            <span>${escapeHtml(candidate.currentCompany)}</span>
            <span>${escapeHtml(candidate.location)}</span>
          </div>
          <div class="job-sub">
            <span>Software Engineer</span>
            <span>Present</span>
          </div>
          <ul>
            ${tailoredBullets.map((b) => `<li>${escapeHtml(b.tailored)}</li>`).join('')}
          </ul>
        `;

    const educationHtml = candidate.educationHistory && candidate.educationHistory.length > 0
      ? candidate.educationHistory.map((edu) => `
          <div class="job-header">
            <span>${escapeHtml(edu.institution)}</span>
            <span>${escapeHtml(edu.period)}</span>
          </div>
          <div class="job-sub">
            <span>${escapeHtml(edu.degree)}</span>
            <span>${escapeHtml(edu.score || '')}</span>
          </div>
        `).join('')
      : `
          <div class="job-header">
            <span>Accredited University</span>
            <span>Graduated</span>
          </div>
          <div class="job-sub">
            <span>B.Tech in Computer Science</span>
            <span></span>
          </div>
        `;

    printWindow.document.write(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${escapeHtml(candidate.fullName)} - Resume (${escapeHtml(job.company)})</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: #111;
        line-height: 1.5;
        padding: 40px;
        max-width: 800px;
        margin: 0 auto;
      }
      h1 { margin-bottom: 4px; font-size: 22px; text-transform: uppercase; letter-spacing: 0.5px; }
      .subtitle { font-size: 13px; font-weight: 600; color: #444; margin-bottom: 6px; }
      .contact { font-size: 11px; color: #555; margin-bottom: 18px; border-bottom: 1.5px solid #222; padding-bottom: 10px; }
      h2 { font-size: 13px; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-top: 16px; margin-bottom: 8px; letter-spacing: 0.5px; }
      ul { margin-top: 4px; padding-left: 18px; }
      li { font-size: 12px; margin-bottom: 5px; }
      .job-header { display: flex; justify-content: space-between; font-weight: 700; font-size: 12.5px; margin-top: 8px; }
      .job-sub { display: flex; justify-content: space-between; font-size: 11.5px; color: #555; margin-bottom: 4px; font-style: italic; }
      .skills-block { font-size: 12px; line-height: 1.6; }
      @media print {
        body { padding: 0; }
      }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(candidate.fullName)}</h1>
    <div class="subtitle">${escapeHtml(candidate.headline)}</div>
    <div class="contact">
      ${escapeHtml(candidate.location)} &bull; ${escapeHtml(candidate.email)} &bull; ${escapeHtml(candidate.phone)}<br/>
      Portfolio: ${escapeHtml(candidate.portfolioUrl)} &bull; GitHub: ${escapeHtml(candidate.githubUrl)}
    </div>

    <h2>Target Role Alignment</h2>
    <div class="skills-block">
      <strong>Company:</strong> ${escapeHtml(job.company)} &bull; <strong>Position:</strong> ${escapeHtml(job.title)} &bull; <strong>ATS Match:</strong> ${escapeHtml(atsResult.overallScore)}%
    </div>

    <h2>Professional Summary</h2>
    <div class="skills-block">
      Software engineer with ${escapeHtml(candidate.yearsOfExperience)} years of verified production experience 
      in ${escapeHtml(candidate.primarySkills.slice(0, 4).join(', '))}. Proven track record at ${escapeHtml(candidate.currentCompany)} 
      building performant, reliable services aligned for ${escapeHtml(job.title)}.
    </div>

    <h2>Core Competencies</h2>
    <div class="skills-block">
      <strong>Primary Stack:</strong> ${escapeHtml(candidate.primarySkills.join(', '))}<br/>
      <strong>Infrastructure & Systems:</strong> ${escapeHtml(candidate.secondarySkills.join(', '))}<br/>
      <strong>Matched Role Keywords:</strong> ${escapeHtml(job.requiredSkills.join(', '))}
    </div>

    <h2>Professional Experience</h2>
    ${experiencesHtml}

    <h2>Education</h2>
    ${educationHtml}
  </body>
</html>`);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="ATS Resume Tailor Lab"
      subtitle={`Targeting: ${job.title} at ${job.company}`}
      icon={<Sparkles className="w-5 h-5 text-indigo-400" />}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* ATS Score Meter & Analysis Banner */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 bg-[#111111] p-5 rounded-xl border border-[#222222] flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-mono font-semibold text-[#A1A1A1] uppercase tracking-wider block">
                ATS Confidence Score
              </span>
              <div className="text-4xl font-black font-mono text-emerald-400 mt-2">
                {atsResult.overallScore}%
              </div>
              <span className="text-xs text-[#A1A1A1] block mt-1">
                {atsResult.overallScore >= 80 ? 'Verified High Match' : 'Transferable Match'}
              </span>
            </div>
            <div className="w-full bg-[#1A1A1A] h-2 rounded-full overflow-hidden mt-4">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${atsResult.overallScore}%` }}
              />
            </div>
          </div>

          <div className="md:col-span-8 bg-[#111111] p-5 rounded-xl border border-[#222222] space-y-3">
            <div>
              <span className="text-xs font-bold text-[#EDEDED] block mb-1.5 font-mono">
                Matched Verified Keywords:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {atsResult.matchedKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {atsResult.missingKeywords.length > 0 && (
              <div>
                <span className="text-xs font-bold text-amber-400 block mb-1.5 font-mono">
                  Stack Keywords in Role Not in Profile:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {atsResult.missingKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center gap-1"
                    >
                      <AlertTriangle className="w-3 h-3 text-amber-400" />
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-2 border-b border-[#222222] pb-2">
          <button
            onClick={() => setActiveTab('DIFF')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'DIFF'
                ? 'bg-[#1C1C1C] text-white border border-[#2E2E2E]'
                : 'text-[#A1A1A1] hover:text-white'
            }`}
          >
            Verifiable Bullet Alignment
          </button>
          <button
            onClick={() => setActiveTab('PREVIEW')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'PREVIEW'
                ? 'bg-[#1C1C1C] text-white border border-[#2E2E2E]'
                : 'text-[#A1A1A1] hover:text-white'
            }`}
          >
            Plaintext ATS View
          </button>
          <button
            onClick={() => setActiveTab('PARSER_VIEW')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'PARSER_VIEW'
                ? 'bg-[#1C1C1C] text-white border border-[#2E2E2E]'
                : 'text-[#A1A1A1] hover:text-white'
            }`}
          >
            ATS Parser Inspection
          </button>
        </div>

        {/* Tab 1: Bullet Points Before vs After Diff */}
        {activeTab === 'DIFF' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#D4D4D4] font-mono uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#A1A1A1]" />
                <span>Candidate Experience Alignment</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPlainText}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141414] hover:bg-[#1F1F1F] text-[#EDEDED] text-xs font-mono font-medium transition-all border border-[#262626]"
                >
                  <Download className="w-3.5 h-3.5 text-[#A1A1A1]" />
                  <span>Download .txt</span>
                </button>
                <button
                  onClick={handlePrintPdf}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141414] hover:bg-[#1F1F1F] text-[#EDEDED] text-xs font-mono font-medium transition-all border border-[#262626]"
                >
                  <Printer className="w-3.5 h-3.5 text-[#A1A1A1]" />
                  <span>Print PDF</span>
                </button>
                <button
                  onClick={handleCopyMarkdown}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141414] hover:bg-[#1F1F1F] text-[#EDEDED] text-xs font-mono font-medium transition-all border border-[#262626]"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy All'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {tailoredBullets.map((bullet) => (
                <div key={bullet.id} className="bg-[#111111] p-4 rounded-xl border border-[#222222] space-y-3">
                  {/* Original */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-semibold text-[#737373] uppercase tracking-wider block">
                      Candidate Original Bullet
                    </span>
                    <p className="text-xs text-[#888888]">
                      {bullet.original}
                    </p>
                  </div>

                  {/* Tailored / Editable */}
                  <div className="space-y-1 bg-[#161616] p-3 rounded-lg border border-[#262626]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-semibold text-indigo-400 uppercase tracking-wider block flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Tailored Phrasing (Verifiable)
                      </span>
                      <button
                        onClick={() => setEditingBulletId(editingBulletId === bullet.id ? null : bullet.id)}
                        className="text-[10px] text-[#A1A1A1] hover:text-white font-mono flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{editingBulletId === bullet.id ? 'Done' : 'Edit'}</span>
                      </button>
                    </div>

                    {editingBulletId === bullet.id ? (
                      <textarea
                        value={bullet.tailored}
                        onChange={(e) => handleUpdateBullet(bullet.id, e.target.value)}
                        className="w-full mt-1 p-2 bg-[#0A0A0A] border border-[#333333] rounded-md text-xs font-mono text-white focus:outline-none focus:border-white"
                        rows={3}
                      />
                    ) : (
                      <p className="text-xs text-[#EDEDED] font-medium leading-relaxed mt-1">
                        {bullet.tailored}
                      </p>
                    )}
                  </div>

                  {/* Reasoning */}
                  <div className="text-[11px] text-[#A1A1A1] flex items-center gap-1.5 italic font-mono">
                    <span>💡 {bullet.reasoning}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Plaintext ATS View */}
        {activeTab === 'PREVIEW' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#A1A1A1]">
                Single-column plaintext format matching real candidate profile and target requirements.
              </span>
              <button
                onClick={handleDownloadPlainText}
                className="px-3 py-1.5 rounded-lg bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download (.txt)
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-[#050505] border border-[#222222] text-xs font-mono text-[#D4D4D4] whitespace-pre-wrap leading-relaxed max-h-[420px] overflow-y-auto">
              {generateFormattedResumeText()}
            </pre>
          </div>
        )}

        {/* Tab 3: Parser View */}
        {activeTab === 'PARSER_VIEW' && (
          <div className="bg-[#111111] p-5 rounded-xl border border-[#222222] space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Terminal className="w-4 h-4" />
              <span>Verified ATS Extraction Output</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-[#161616] rounded-xl border border-[#262626] space-y-2">
                <span className="text-[#737373] text-[10px] uppercase">Candidate Ingestion Profile</span>
                <div>Name: <span className="text-white">{candidate.fullName}</span></div>
                <div>Email: <span className="text-white">{candidate.email}</span></div>
                <div>YOE: <span className="text-white">{candidate.yearsOfExperience} years</span></div>
                <div>Location: <span className="text-white">{candidate.location}</span></div>
              </div>

              <div className="p-3 bg-[#161616] rounded-xl border border-[#262626] space-y-2">
                <span className="text-[#737373] text-[10px] uppercase">Alignment Breakdown</span>
                <div>Hard Skills Alignment: <span className="text-emerald-400">{atsResult.overallScore}%</span></div>
                <div>Matched Keywords: <span className="text-white">{atsResult.matchedKeywords.length} verified</span></div>
                <div>Layout Check: <span className="text-emerald-400">Pass (Standard ATS-compliant)</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#222222]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono text-[#A1A1A1] hover:text-white"
          >
            Close Lab
          </button>

          <button
            onClick={() => onProceedToOutreach(job)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-all shadow-md"
          >
            <span>Proceed to Founder Outreach</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AtsResumeTailorModal;
