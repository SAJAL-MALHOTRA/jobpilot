import type { CandidateProfile, JobListing, ColdOutreach } from '../types';

export function generateColdOutreach(
  candidate: CandidateProfile,
  job: JobListing,
  style: 'FOUNDER_PUNCHY' | 'PROOF_OF_WORK' | 'LINKEDIN_INMAIL'
): ColdOutreach {
  const firstName = job.founderName.split(' ')[0] || 'there';

  if (style === 'FOUNDER_PUNCHY') {
    const subject = `Building ${job.company.split(' ')[0]} / ${candidate.headline.split('(')[0].trim()} [${candidate.fullName}]`;
    const body = `Hi ${firstName},

I’ve been tracking what ${job.company} is building around ${job.title.toLowerCase()}. 

At ${candidate.currentCompany}, I scaled our core dispatch systems to 120k req/min with sub-45ms p99 latency in ${candidate.primarySkills.slice(0, 3).join(', ')}. 

I noticed you're hiring for ${job.title} — I'd love to contribute immediately without onboarding ramp-up.

Here is my work: ${candidate.githubUrl}
Would you be open to a 10-minute technical chat this week?

Best,
${candidate.fullName}
${candidate.phone}`;

    return {
      id: `outreach-${Date.now()}`,
      jobId: job.id,
      style,
      subject,
      body,
      recipient: job.founderEmail,
    };
  }

  if (style === 'PROOF_OF_WORK') {
    const subject = `Quick thoughts on ${job.company}'s engineering stack + relevant proof-of-work`;
    const body = `Hi ${firstName},

Congratulations on ${job.company}'s recent momentum. I read through your requirements for the ${job.title} opening and noticed your focus on ${job.requiredSkills.slice(0, 3).join(' and ')}.

Two relevant production systems I recently architected that map directly to your roadmap:
1. Low-latency distributed architecture handling high-throughput concurrency (Node.js/Python + Redis + PostgreSQL).
2. Automated deployment containerization with Docker & Kubernetes, cutting CI/CD deploy cycles by 85%.

I've shared a breakdown of my open-source code and architecture write-ups here: ${candidate.portfolioUrl}

If you have 10 minutes, I’d love to share how I can ship features for ${job.company} from Day 1.

Best regards,
${candidate.fullName}
${candidate.email}`;

    return {
      id: `outreach-${Date.now()}`,
      jobId: job.id,
      style,
      subject,
      body,
      recipient: job.founderEmail,
    };
  }

  // LINKEDIN_INMAIL
  const subject = `Excited about ${job.company} / ${job.title} role`;
  const body = `Hi ${firstName},

Hope you're having a productive week! I came across ${job.company}'s open ${job.title} role and love the problem you're tackling.

I’m currently a ${candidate.headline} at ${candidate.currentCompany}, specializing in ${candidate.primarySkills.slice(0, 4).join(', ')}. Given our shared focus on high-scale systems, I’d love to connect and explore if my background could be helpful to your engineering team.

Open to connecting?

Cheers,
${candidate.fullName}`;

  return {
    id: `outreach-${Date.now()}`,
    jobId: job.id,
    style,
    subject,
    body,
    recipient: job.founderLinkedin || job.founderEmail,
  };
}
