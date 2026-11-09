import type { CandidateProfile, JobListing, ATSMatchResult } from '../types';

export function runATSTailoring(candidate: CandidateProfile, job: JobListing): ATSMatchResult {
  const candidateSkillsSet = new Set(
    [
      ...candidate.primarySkills,
      ...candidate.secondarySkills,
      ...candidate.resumeBullets.flatMap(b => b.keywords)
    ].map(s => s.toLowerCase().trim())
  );

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  job.requiredSkills.forEach(reqSkill => {
    if (candidateSkillsSet.has(reqSkill.toLowerCase().trim())) {
      matchedKeywords.push(reqSkill);
    } else {
      missingKeywords.push(reqSkill);
    }
  });

  // Score baseline
  const matchRatio = matchedKeywords.length / (job.requiredSkills.length || 1);
  const baselineScore = Math.round(matchRatio * 75);
  const expFactor = candidate.yearsOfExperience >= 3.5 ? 15 : 10;
  const overallScore = Math.min(96, Math.max(45, baselineScore + expFactor));

  // Auto-tailor bullets to highlight the target company's stack
  const tailoredBullets = candidate.resumeBullets.map((bullet) => {
    let tailoredText = bullet.text;
    const addedKeywords: string[] = [];
    let reasoning = 'Aligned bullet point to highlight engineering impact and metric density.';

    if (job.title.toLowerCase().includes('ai') || job.description.toLowerCase().includes('llm')) {
      if (bullet.keywords.includes('Python')) {
        tailoredText = `Architected end-to-end data & inference pipeline utilizing Python, FastAPI, and asynchronous Celery workers, achieving 99.99% uptime processing ₹40Cr daily transactions with integrated telemetry monitoring.`;
        addedKeywords.push('FastAPI', 'Inference Telemetry');
        reasoning = 'Rephrased to emphasize Python API architecture and high-reliability data serving matching AI platform requirements.';
      } else if (bullet.keywords.includes('React')) {
        tailoredText = `Engineered dynamic interactive web dashboard in React 18 & TypeScript with low-latency WebSockets, reducing state reconciliation overhead by 34% for live event telemetry.`;
        addedKeywords.push('React 18', 'Low-Latency', 'Telemetry');
        reasoning = 'Enhanced frontend bullet to emphasize high-frequency UI streaming matching AI canvas demands.';
      }
    } else if (job.title.toLowerCase().includes('systems') || job.description.toLowerCase().includes('kafka')) {
      if (bullet.keywords.includes('Node.js')) {
        tailoredText = `Designed and deployed distributed order dispatch engine handling 120k req/min with sub-45ms p99 latency leveraging Node.js, Redis clustering, and optimized PostgreSQL indexing under high concurrency.`;
        addedKeywords.push('Distributed Systems', 'Redis Clustering', 'Concurrency');
        reasoning = 'Emphasized distributed throughput and database concurrency to match systems engineer profile.';
      }
    } else {
      // General tailoring: enhance action verbs and quantitative impact
      tailoredText = bullet.text.replace('Built', 'Engineered & scaled').replace('Migrated', 'Architected zero-downtime migration of');
      addedKeywords.push('Scalability', 'System Reliability');
      reasoning = 'Sharpened leadership and architectural verbs following Google XYZ achievement guidelines.';
    }

    return {
      id: bullet.id,
      original: bullet.text,
      tailored: tailoredText,
      addedKeywords,
      reasoning,
    };
  });

  return {
    overallScore,
    matchedKeywords,
    missingKeywords,
    tailoredBullets,
    strengthAnalysis: `Candidate has strong proven production experience in ${matchedKeywords.slice(0, 4).join(', ')} directly addressing core infrastructure requirements.`,
    weaknessAnalysis: missingKeywords.length > 0 
      ? `Resume currently lacks explicit keyword presence for: ${missingKeywords.join(', ')}. JobPilot has optimized bullet context to emphasize transferable capabilities.`
      : 'Full alignment across all primary tech stack requirements.',
  };
}
