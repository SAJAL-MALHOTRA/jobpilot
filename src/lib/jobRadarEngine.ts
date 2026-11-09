import type { JobListing, CandidateProfile } from '../types';

export const curatedJobs: JobListing[] = [
  {
    id: 'job-yc-01',
    title: 'Founding Full Stack AI Engineer',
    company: 'CognitiveHQ (YC W24)',
    logoColor: 'from-amber-500 to-orange-600',
    location: 'Bangalore / Indiranagar',
    isRemote: true,
    source: 'YC W24',
    minCtcLpa: 32.0,
    maxCtcLpa: 48.0,
    equityRange: '0.75% - 1.5%',
    requiredSkills: ['React', 'TypeScript', 'Python', 'FastAPI', 'LangChain', 'PostgreSQL', 'Docker'],
    description: `We are building autonomous agents for enterprise supply chain visibility. Looking for an exceptional full-stack builder who has shipped low-latency web apps and loves building with LLMs. You will own the core canvas interface in React/TypeScript and agent orchestration pipelines in Python/FastAPI.`,
    postedDate: '2 hours ago',
    founderName: 'Siddharth Varma',
    founderRole: 'Co-founder & CEO',
    founderEmail: 'siddharth@cognitivehq.ai',
    founderLinkedin: 'https://linkedin.com/in/siddharth-varma-yc',
    hiringUrgency: 'Immediate'
  },
  {
    id: 'job-yc-02',
    title: 'Senior Systems Engineer (Distributed Data)',
    company: 'HyperScale Systems (YC S24)',
    logoColor: 'from-blue-600 to-indigo-600',
    location: 'Bangalore / Koramangala',
    isRemote: true,
    source: 'YC S24',
    minCtcLpa: 35.0,
    maxCtcLpa: 52.0,
    equityRange: '0.5% - 1.2%',
    requiredSkills: ['Python', 'PostgreSQL', 'Redis', 'Kafka', 'Docker', 'AWS', 'Kubernetes'],
    description: `HyperScale builds developer infrastructure for streaming vector search. We need a backend systems engineer with deep hands-on expertise in high-throughput message brokers (Kafka/RabbitMQ), Redis caching topologies, and PostgreSQL query planning under heavy concurrency.`,
    postedDate: '5 hours ago',
    founderName: 'Amanpreet Singh',
    founderRole: 'CTO & Co-founder',
    founderEmail: 'aman@hyperscale.dev',
    founderLinkedin: 'https://linkedin.com/in/amanpreet-singh-cto',
    hiringUrgency: 'High'
  },
  {
    id: 'job-wellfound-01',
    title: 'Staff Frontend Engineer (Performance & Canvas)',
    company: 'Postman Ecosystems',
    logoColor: 'from-orange-500 to-red-600',
    location: 'Bangalore (Hybrid)',
    isRemote: false,
    source: 'Wellfound',
    minCtcLpa: 40.0,
    maxCtcLpa: 58.0,
    equityRange: '₹15L - ₹25L ESOP',
    requiredSkills: ['React', 'TypeScript', 'Next.js', 'WebSockets', 'Frontend Performance', 'Tailwind CSS'],
    description: `Join our core platform experience team. You will lead UI architecture for visual API workflow builder. Requires extreme mastery of React rendering lifecycles, memory leak profiling, WebSockets state synchronization, and component design systems.`,
    postedDate: '1 day ago',
    founderName: 'Ankit Sobti',
    founderRole: 'VP of Engineering',
    founderEmail: 'ankit.s@postman.com',
    founderLinkedin: 'https://linkedin.com/in/ankit-sobti',
    hiringUrgency: 'Normal'
  },
  {
    id: 'job-linkedin-01',
    title: 'Senior Full Stack Engineer (Payments & Checkout)',
    company: 'Zepto',
    logoColor: 'from-purple-600 to-pink-600',
    location: 'Bangalore (Bellandur)',
    isRemote: false,
    source: 'LinkedIn',
    minCtcLpa: 30.0,
    maxCtcLpa: 44.0,
    equityRange: '₹10L - ₹18L ESOP',
    requiredSkills: ['Node.js', 'React', 'TypeScript', 'PostgreSQL', 'Redis', 'AWS', 'Docker'],
    description: `Leading 10-minute grocery delivery in India. The Checkout & Payments team handles 400,000 daily transactions with 99.98% success rates. You will build zero-downtime microservices and high-converting checkout flows.`,
    postedDate: '1 day ago',
    founderName: 'Kaveri Deshmukh',
    founderRole: 'Director of Engineering',
    founderEmail: 'kaveri.deshmukh@zeptonow.com',
    founderLinkedin: 'https://linkedin.com/in/kaveri-deshmukh-eng',
    hiringUrgency: 'High'
  },
  {
    id: 'job-instahyre-01',
    title: 'AI Platform Engineer',
    company: 'Sarvam AI',
    logoColor: 'from-emerald-600 to-teal-700',
    location: 'Bangalore',
    isRemote: true,
    source: 'Instahyre',
    minCtcLpa: 36.0,
    maxCtcLpa: 55.0,
    equityRange: 'Top-tier Equity',
    requiredSkills: ['Python', 'FastAPI', 'Docker', 'AWS', 'LangChain', 'Kubernetes'],
    description: `Sarvam AI is developing sovereign foundational models and voice AI interfaces for India. Looking for backend/ML systems engineers to build inference serving layers, token batching pipelines, and developer SDKs.`,
    postedDate: 'Just now',
    founderName: 'Pratyush Kumar',
    founderRole: 'Co-Founder',
    founderEmail: 'pratyush@sarvam.ai',
    founderLinkedin: 'https://linkedin.com/in/pratyush-kumar-sarvam',
    hiringUrgency: 'Immediate'
  },
  {
    id: 'job-yc-03',
    title: 'Senior Software Engineer (DevTools)',
    company: 'TraceLayer (YC W24)',
    logoColor: 'from-cyan-600 to-blue-700',
    location: 'Remote (Worldwide)',
    isRemote: true,
    source: 'YC W24',
    minCtcLpa: 42.0,
    maxCtcLpa: 65.0,
    equityRange: '1.0% - 2.0%',
    requiredSkills: ['TypeScript', 'Node.js', 'React', 'Docker', 'PostgreSQL', 'AWS'],
    description: `Automated OpenTelemetry tracing and observability agent for microservices. Fully remote global team backed by YC. We pay competitive top-10% US market compensation and treat engineers with autonomy and trust.`,
    postedDate: '3 hours ago',
    founderName: 'Marcus Lindholm',
    founderRole: 'Founder & CEO',
    founderEmail: 'marcus@tracelayer.io',
    founderLinkedin: 'https://linkedin.com/in/marcus-lindholm-yc',
    hiringUrgency: 'Immediate'
  }
];

export function calculateQuickMatchScore(candidate: CandidateProfile, job: JobListing): number {
  const candidateSkills = new Set(
    [...candidate.primarySkills, ...candidate.secondarySkills].map(s => s.toLowerCase())
  );
  
  let matchedCount = 0;
  job.requiredSkills.forEach(skill => {
    if (candidateSkills.has(skill.toLowerCase())) {
      matchedCount++;
    }
  });

  const skillMatchPct = (matchedCount / job.requiredSkills.length) * 70;
  // Experience bonus
  const expBonus = candidate.yearsOfExperience >= 3 ? 15 : 10;
  // Location/Remote compatibility bonus
  const locBonus = (job.isRemote || candidate.locationPreference === 'Bangalore') ? 15 : 5;

  return Math.min(98, Math.round(skillMatchPct + expBonus + locBonus));
}
