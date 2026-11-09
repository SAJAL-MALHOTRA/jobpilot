import type { CandidateProfile, JobListing, ColdOutreach, OutreachTemplateType } from '../types';

export function generateColdOutreach(
  candidate: CandidateProfile,
  job: JobListing,
  style: OutreachTemplateType
): ColdOutreach {
  const firstName = job.founderName.split(' ')[0] || 'there';
  const companyShort = job.company.split(' ')[0];
  const primarySkillsList = candidate.primarySkills.slice(0, 3).join(', ');

  switch (style) {
    case 'FOUNDER_STARTUP': {
      // Template 1: Cold Email to a Startup Founder
      const subject = `Interested in building with ${companyShort}`;
      const context = `I came across ${job.company} and found your work on ${job.title.toLowerCase()} very interesting.`;
      const relevance = `I'm a full stack engineer with experience scaling production systems in ${primarySkillsList} at ${candidate.currentCompany}. I've recently architected high-throughput pipelines handling 120k req/min with sub-45ms p99 latency, and I believe my background directly matches what your team is building.`;
      const smallAsk = `I'd love to explore whether I could contribute to your engineering roadmap. Are you currently open to bringing on developers?`;
      const proof = `Portfolio: ${candidate.portfolioUrl}\nGitHub: ${candidate.githubUrl}`;

      const body = `Hi ${firstName},

${context}

${relevance}

${smallAsk}

${proof}

Thanks,
${candidate.fullName}`;

      return {
        id: `outreach-${Date.now()}`,
        jobId: job.id,
        style,
        templateTitle: 'Template 1: Cold Email to a Startup Founder',
        bestFor: 'Best for: Joining an early-stage YC/tech startup, exploring full-time engineering roles.',
        subject,
        body,
        recipient: job.founderEmail,
        formulaBreakdown: { context, relevance, proof, smallAsk },
      };
    }

    case 'INTERNSHIP_JUNIOR': {
      // Template 2: Apply for an Internship or Junior Role
      const subject = `Internship / Early Engineer role at ${companyShort} [${candidate.fullName}]`;
      const context = `I've been following ${job.company}'s recent progress and really admire what you're shipping.`;
      const relevance = `I'm an engineer specializing in ${primarySkillsList}. I've built multiple open-source full-stack applications with real-time WebSockets and automated Docker CI/CD pipelines.`;
      const smallAsk = `Are you currently considering junior developers or interns for ${job.title}?`;
      const proof = `Here's my live portfolio with deployed code: ${candidate.portfolioUrl}`;

      const body = `Hi ${firstName},

${context}

${relevance}

${smallAsk}

${proof}
GitHub: ${candidate.githubUrl}

Best regards,
${candidate.fullName}`;

      return {
        id: `outreach-${Date.now()}`,
        jobId: job.id,
        style,
        templateTitle: 'Template 2: Early Career / Junior Pitch',
        bestFor: 'Best for: Fast-moving junior developers, interns, and early builders.',
        subject,
        body,
        recipient: job.founderEmail,
        formulaBreakdown: { context, relevance, proof, smallAsk },
      };
    }

    case 'PEER_REFERRAL': {
      // Template 3: Ask for a Job Referral
      const subject = `Question about engineering at ${companyShort}`;
      const context = `I saw you're on the engineering team at ${job.company}. I've been researching your architecture and love your focus on ${job.requiredSkills[0] || 'scalability'}.`;
      const relevance = `I'm a ${candidate.headline.split('(')[0].trim()} with 4+ years of production experience in ${primarySkillsList}. I'm preparing to apply for the open ${job.title} role.`;
      const smallAsk = `Would you be open to a 5-minute chat about the engineering culture, or potentially referring me if my background looks like a match?`;
      const proof = `Here's my work and GitHub: ${candidate.githubUrl}`;

      const body = `Hi ${firstName},

${context}

${relevance}

${smallAsk}

${proof}

Appreciate your time,
${candidate.fullName}`;

      return {
        id: `outreach-${Date.now()}`,
        jobId: job.id,
        style,
        templateTitle: 'Template 3: Internal Employee Referral Request',
        bestFor: 'Best for: Reaching existing senior engineers on the team to secure an internal referral.',
        subject,
        body,
        recipient: job.founderEmail,
        formulaBreakdown: { context, relevance, proof, smallAsk },
      };
    }

    case 'FREELANCE_PROPOSAL': {
      // Template 4: Find Freelance / Contract Work
      const subject = `Idea for ${companyShort}'s engineering architecture`;
      const context = `I took a look at ${job.company}'s platform and noticed potential optimization opportunities around ${job.requiredSkills.slice(0, 2).join(' & ')}.`;
      const relevance = `I specialize in low-latency backend systems and frontend state performance. Recently reduced UI re-render thrash by 34% and optimized database indexing under high concurrency at ${candidate.currentCompany}.`;
      const smallAsk = `Would you be open to me sharing a quick 3-point architecture brief for ${companyShort}?`;
      const proof = `Case studies and deployed apps: ${candidate.portfolioUrl}`;

      const body = `Hi ${firstName},

${context}

${relevance}

${smallAsk}

${proof}

Best,
${candidate.fullName}`;

      return {
        id: `outreach-${Date.now()}`,
        jobId: job.id,
        style,
        templateTitle: 'Template 4: Freelance / Problem-Solving Pitch',
        bestFor: 'Best for: Contacting founders with a specific architectural solution or contract proposal.',
        subject,
        body,
        recipient: job.founderEmail,
        formulaBreakdown: { context, relevance, proof, smallAsk },
      };
    }

    case 'LINKEDIN_X_DM': {
      // Template 5: A Short Cold DM on LinkedIn or X
      const subject = `Quick hello from a builder`;
      const context = `Hey ${firstName}, came across ${job.company} and found your work on ${job.title.toLowerCase()} really impressive.`;
      const relevance = `I'm a ${candidate.headline.split('(')[0].trim()} building with ${primarySkillsList}. Scaled core dispatch pipelines handling 120k req/min at ${candidate.currentCompany}.`;
      const smallAsk = `I'd love to connect and explore if my experience could help your team ship faster.`;
      const proof = `Work: ${candidate.portfolioUrl}`;

      const body = `${context}

${relevance}

${smallAsk}

${proof}
GitHub: ${candidate.githubUrl}`;

      return {
        id: `outreach-${Date.now()}`,
        jobId: job.id,
        style,
        templateTitle: 'Template 5: Short Cold DM on LinkedIn or X (Twitter)',
        bestFor: 'Best for: Founders and hiring managers active on Twitter/X or LinkedIn.',
        subject,
        body,
        recipient: job.founderLinkedin || `@${job.founderName.toLowerCase().replace(/\s+/g, '')}`,
        formulaBreakdown: { context, relevance, proof, smallAsk },
      };
    }

    case 'FOLLOW_UP_NUDGE': {
      // Template 6: The Follow Up Email
      const subject = `Re: Interested in building with ${companyShort}`;
      const context = `Just following up on my previous note regarding the ${job.title} opening at ${job.company}.`;
      const relevance = `I'm still very interested because of the technical challenges your team is solving with ${job.requiredSkills[0] || 'distributed systems'}, and thought my experience scaling production services might be worth considering.`;
      const smallAsk = `Would this be relevant to your team at the moment?`;
      const proof = `GitHub: ${candidate.githubUrl}`;

      const body = `Hi ${firstName},

${context}

${relevance}

${smallAsk}

${proof}

Thanks,
${candidate.fullName}`;

      return {
        id: `outreach-${Date.now()}`,
        jobId: job.id,
        style,
        templateTitle: 'Template 6: The Follow Up Email (3–5 Days Later)',
        bestFor: 'Best for: Restarting conversations politely without sounding pushy or desperate.',
        subject,
        body,
        recipient: job.founderEmail,
        formulaBreakdown: { context, relevance, proof, smallAsk },
      };
    }
  }
}
