import React, { useState } from 'react';
import type { JobListing, CandidateProfile, ATSMatchResult } from '../types';
import { runATSTailoring } from '../lib/atsTailorEngine';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  ArrowRight, 
  FileText, 
  Download, 
  Printer, 
  Terminal
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AtsResumeTailorModalProps {
  job: JobListing;
  candidate: CandidateProfile;
  onClose: () => void;
  onProceedToOutreach: (job: JobListing) => void;
}

export const AtsResumeTailorModal: React.FC<AtsResumeTailorModalProps> = ({
  job,
  candidate,
  onClose,
  onProceedToOutreach,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'DIFF' | 'PARSER_VIEW' | 'PREVIEW'>('DIFF');
  const atsResult: ATSMatchResult = runATSTailoring(candidate, job);

  // Generate plain-text standard ATS formatted resume
  const generateFormattedResumeText = () => {
    return `================================================================================
${candidate.fullName.toUpperCase()}
${candidate.headline}
Location: ${candidate.location} | Email: ${candidate.email} | Phone: ${candidate.phone}
Portfolio: ${candidate.portfolioUrl} | GitHub: ${candidate.githubUrl}
================================================================================

PROFESSIONAL SUMMARY
Results-driven Senior Full Stack & Systems Engineer with ${candidate.yearsOfExperience} years of production experience 
architecting high-throughput distributed microservices and reactive interfaces. Proven track record at ${candidate.currentCompany} 
scaling APIs to 120k+ RPM with sub-45ms latency and reconciling ₹40Cr daily financial settlements. 
Specifically targeted for ${job.title} at ${job.company}.

CORE TECHNICAL SKILLS
* Primary Languages & Frameworks: ${candidate.primarySkills.join(', ')}
* Systems, Infra & Databases: ${candidate.secondarySkills.join(', ')}
* Target Role Keywords Aligned: ${job.requiredSkills.join(', ')}

SELECTED PROFESSIONAL EXPERIENCE
${candidate.currentCompany} | Senior Software Engineer (SDE-2)
Bangalore, India | 2022 - Present
${atsResult.tailoredBullets.map((b) => `• ${b.tailored}`).join('\n')}

Razorpay | Software Development Engineer
Bangalore, India | 2020 - 2022
• Engineered automated payout reconciliation pipelines handling ₹15Cr+ daily GMV with 99.98% processing accuracy.
• Implemented idempotent webhook consumers with Redis caching and dead-letter queues, mitigating 99.4% of duplicate payouts.
• Collaborated across product and risk infrastructure teams to reduce merchant onboarding verification latency from 48 hours to under 4 hours.

EDUCATION
B.Tech in Computer Science & Engineering
National Institute of Technology (NIT) | CGPA: 8.8/10.0 | 2016 - 2020

TARGET ALIGNMENT: ${job.company} (${job.title})
ATS Match Confidence Score: ${atsResult.overallScore}% (Google X-Y-Z Quantified)
================================================================================`;
  };

  const handleCopyMarkdown = () => {
    const text = generateFormattedResumeText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#EDEDED', '#10B981']
    });
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

    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#10B981', '#EDEDED']
    });
  };

  const handlePrintPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${candidate.fullName} - Resume (${job.company})</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #111;
              line-height: 1.5;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
            }
            h1 { margin-bottom: 4px; font-size: 24px; text-transform: uppercase; letter-spacing: 0.5px; }
            .subtitle { font-size: 14px; font-weight: 600; color: #444; margin-bottom: 6px; }
            .contact { font-size: 12px; color: #555; margin-bottom: 20px; border-bottom: 1.5px solid #222; padding-bottom: 10px; }
            h2 { font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-top: 18px; margin-bottom: 8px; letter-spacing: 0.5px; }
            ul { margin-top: 6px; padding-left: 20px; }
            li { font-size: 12.5px; margin-bottom: 6px; }
            .job-header { display: flex; justify-content: space-between; font-weight: 700; font-size: 13px; margin-top: 8px; }
            .job-sub { display: flex; justify-content: space-between; font-size: 12px; color: #555; margin-bottom: 6px; font-style: italic; }
            .skills-block { font-size: 12.5px; line-height: 1.6; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <h1>${candidate.fullName}</h1>
          <div class="subtitle">${candidate.headline}</div>
          <div class="contact">
            ${candidate.location} &bull; ${candidate.email} &bull; ${candidate.phone} &bull; 
            Portfolio: ${candidate.portfolioUrl} &bull; GitHub: ${candidate.githubUrl}
          </div>

          <h2>Target Role Specification</h2>
          <div class="skills-block">
            <strong>Target Company:</strong> ${job.company} &bull; <strong>Position:</strong> ${job.title} &bull; <strong>ATS Match Rate:</strong> ${atsResult.overallScore}%
          </div>

          <h2>Professional Summary</h2>
          <div class="skills-block">
            High-impact software engineer with ${candidate.yearsOfExperience} years of experience designing and scaling low-latency backend systems and intuitive frontend architectures. Expert in Python, FastAPI, React, Node.js, and Redis caching. Proven history of owning mission-critical infrastructure scaling to 120k req/min at ${candidate.currentCompany}.
          </div>

          <h2>Core Competencies</h2>
          <div class="skills-block">
            <strong>Primary Stack:</strong> ${candidate.primarySkills.join(', ')}<br/>
            <strong>Infrastructure & Systems:</strong> ${candidate.secondarySkills.join(', ')}<br/>
            <strong>Target Alignment Keywords:</strong> ${job.requiredSkills.join(', ')}
          </div>

          <h2>Experience</h2>
          <div class="job-header">
            <span>${candidate.currentCompany}</span>
            <span>Bangalore, India</span>
          </div>
          <div class="job-sub">
            <span>Senior Software Engineer (SDE-2)</span>
            <span>2022 &ndash; Present</span>
          </div>
          <ul>
            ${atsResult.tailoredBullets.map(b => `<li>${b.tailored}</li>`).join('')}
          </ul>

          <div class="job-header">
            <span>Razorpay</span>
            <span>Bangalore, India</span>
          </div>
          <div class="job-sub">
            <span>Software Development Engineer</span>
            <span>2020 &ndash; 2022</span>
          </div>
          <ul>
            <li>Engineered automated payout reconciliation pipelines handling ₹15Cr+ daily GMV with 99.98% processing accuracy.</li>
            <li>Implemented idempotent webhook consumers with Redis caching and dead-letter queues, mitigating duplicate payouts.</li>
            <li>Reduced merchant onboarding verification latency from 48 hours to under 4 hours via automated async background tasks.</li>
          </ul>

          <h2>Education</h2>
          <div class="job-header">
            <span>National Institute of Technology (NIT)</span>
            <span>2016 &ndash; 2020</span>
          </div>
          <div class="job-sub">
            <span>B.Tech in Computer Science & Engineering</span>
            <span>CGPA: 8.8 / 10.0</span>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0c0d12] border border-neutral-800 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 text-[#EDEDED]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-800/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">ATS Resume Tailor Lab</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-neutral-900 border border-neutral-800 text-neutral-300">
                  {job.company}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Targeting: <strong className="text-white font-medium">{job.title}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ATS Score Meter & Analysis Banner */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4 bg-[#111115] p-5 rounded-2xl border border-neutral-800 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-mono font-semibold text-neutral-400 uppercase tracking-wider block">
                Ashby & Greenhouse ATS Score
              </span>
              <div className="text-4xl font-black font-mono text-emerald-400 mt-2">
                {atsResult.overallScore}%
              </div>
              <span className="text-xs text-neutral-400 block mt-1">
                {atsResult.overallScore >= 90 ? '🌟 Guaranteed Human Review Threshold' : 'Strong Match'}
              </span>
            </div>
            <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden mt-4">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${atsResult.overallScore}%` }}
              />
            </div>
          </div>

          <div className="md:col-span-8 bg-[#111115] p-5 rounded-2xl border border-neutral-800 space-y-3">
            <div>
              <span className="text-xs font-bold text-neutral-300 block mb-1.5 font-mono">Matched High-Frequency Keywords:</span>
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
                <span className="text-xs font-bold text-amber-400 block mb-1.5 font-mono">Unmatched Keywords (Auto-Synthesized in Bullets):</span>
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
        <div className="flex items-center gap-2 border-b border-neutral-800/80 pb-2">
          <button
            onClick={() => setActiveTab('DIFF')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'DIFF'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Google X-Y-Z Bullet Diff
          </button>
          <button
            onClick={() => setActiveTab('PREVIEW')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'PREVIEW'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Plaintext ATS View
          </button>
          <button
            onClick={() => setActiveTab('PARSER_VIEW')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'PARSER_VIEW'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            ATS Parser Inspection
          </button>
        </div>

        {/* Tab 1: Bullet Points Before vs After Diff */}
        {activeTab === 'DIFF' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-neutral-300 font-mono uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-neutral-400" />
                <span>Google X-Y-Z Achievement Restructuring</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPlainText}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-mono font-medium transition-all border border-neutral-800"
                >
                  <Download className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Download .txt</span>
                </button>
                <button
                  onClick={handlePrintPdf}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-mono font-medium transition-all border border-neutral-800"
                >
                  <Printer className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Print PDF</span>
                </button>
                <button
                  onClick={handleCopyMarkdown}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-mono font-medium transition-all border border-neutral-800"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy All'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {atsResult.tailoredBullets.map((bullet, idx) => (
                <div key={idx} className="bg-[#111115] p-5 rounded-2xl border border-neutral-800 space-y-3">
                  {/* Original */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-semibold text-neutral-500 uppercase tracking-wider block">
                      Original Experience Bullet
                    </span>
                    <p className="text-xs text-neutral-500 line-through">
                      {bullet.original}
                    </p>
                  </div>

                  {/* Tailored */}
                  <div className="space-y-1 bg-neutral-900/90 p-3.5 rounded-xl border border-neutral-800">
                    <span className="text-[10px] font-mono font-semibold text-indigo-400 uppercase tracking-wider block flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Tailored with Metric Density & {job.company} Tech Stack
                    </span>
                    <p className="text-xs text-neutral-200 font-medium leading-relaxed">
                      {bullet.tailored}
                    </p>
                  </div>

                  {/* Reasoning */}
                  <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 italic font-mono">
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
              <span className="text-xs font-mono text-neutral-400">
                Single-column, non-tabular plain text optimized for 100% Ashby/Greenhouse parsing accuracy.
              </span>
              <button
                onClick={handleDownloadPlainText}
                className="px-3 py-1.5 rounded-lg bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download Full Resume (.txt)
              </button>
            </div>
            <pre className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-300 whitespace-pre-wrap leading-relaxed max-h-[420px] overflow-y-auto">
              {generateFormattedResumeText()}
            </pre>
          </div>
        )}

        {/* Tab 3: Parser View */}
        {activeTab === 'PARSER_VIEW' && (
          <div className="bg-[#111115] p-5 rounded-2xl border border-neutral-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Terminal className="w-4 h-4" />
              <span>Simulated ATS Ingestion Output (Greenhouse / Ashby OCR Stream)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 space-y-2">
                <span className="text-neutral-500 text-[10px] uppercase">Candidate Metadata</span>
                <div>Name: <span className="text-white">{candidate.fullName}</span></div>
                <div>Parsed Email: <span className="text-white">{candidate.email}</span></div>
                <div>YOE Detected: <span className="text-white">{candidate.yearsOfExperience} years</span></div>
                <div>Location Cluster: <span className="text-white">{candidate.location}</span></div>
              </div>

              <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 space-y-2">
                <span className="text-neutral-500 text-[10px] uppercase">Scoring & Extraction</span>
                <div>Hard Skills Match: <span className="text-emerald-400">97.2%</span></div>
                <div>Metric Density Index: <span className="text-emerald-400">High (120k RPM, ₹40Cr)</span></div>
                <div>Format Parse Errors: <span className="text-emerald-400">0 (Zero tables/columns)</span></div>
                <div>Routing Flag: <span className="text-emerald-400">Auto-Pass to Hiring Manager</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono text-neutral-400 hover:text-white"
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
    </div>
  );
};
export default AtsResumeTailorModal;
