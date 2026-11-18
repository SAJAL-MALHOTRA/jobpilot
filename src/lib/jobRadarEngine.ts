import type { JobListing, CandidateProfile, CompanyDossier, MultiFactorFitReport } from '../types';

export const curatedJobs: JobListing[] = [
  {
    id: 'job-12',
    title: 'Founding Full Stack AI Engineer',
    company: 'CognitiveHQ',
    logoColor: 'bg-orange-500',
    location: 'Bengaluru, India',
    isRemote: true,
    source: 'YC W24',
    minCtcLpa: 32.0,
    maxCtcLpa: 48.0,
    experienceDisplay: '3–6 years',
    salaryDisplay: '₹32–48 LPA',
    equityRange: '0.75% - 1.5%',
    requiredSkills: ['react', 'typescript', 'python', 'fastapi', 'docker'],
    roleCategory: 'Full Stack Developer',
    description: 'Autonomous agents for enterprise supply chain visibility. Own the core React canvas interface and agent orchestrator in Python/FastAPI.',
    postedDate: '2 hours ago',
    founderName: 'Siddharth Varma',
    founderRole: 'Co-founder & CEO',
    founderEmail: 'siddharth@cognitivehq.ai',
    hiringUrgency: 'Immediate',
    emailDeliverabilityPct: 99.8,
    fundingRound: 'YC W24 · $500k',
    bangaloreCluster: 'Indiranagar 100ft Rd',
    noticeBuyoutCovered: true,
    atsMatchScore: 84,
    jobUrl: 'https://www.ycombinator.com/companies/cognitivehq/jobs',
    lastVerified: '2025-02-16T09:00:00Z',
    verificationSource: 'YC Work at a Startup (W24)',
    contactConfidence: 'Verified Founder Inbox',
  },
  {
    id: 'job-01',
    title: 'Machine Learning Intern',
    company: 'Prayog AI',
    logoColor: 'bg-sky-500',
    location: 'Bengaluru, India',
    isRemote: false,
    source: 'Wellfound',
    minCtcLpa: 7.2,
    maxCtcLpa: 7.2,
    experienceDisplay: 'Internship (6 mo)',
    salaryDisplay: '₹60,000 / mo (₹7.2 LPA equiv)',
    equityRange: 'PPO with ESOP',
    requiredSkills: ['python', 'pytorch', 'huggingface', 'fastapi'],
    roleCategory: 'AI Engineer',
    description: 'Prayog AI is building open agentic frameworks for legal document reasoning. Looking for an ML intern proficient with PyTorch and fine-tuning Hugging Face transformers.',
    postedDate: '1 hour ago',
    founderName: 'Aarav Singhania',
    founderRole: 'Founder & CEO',
    founderEmail: 'aarav@prayogai.in',
    hiringUrgency: 'Immediate',
    emailDeliverabilityPct: 99.4,
    fundingRound: 'Seed · $1.5M',
    bangaloreCluster: 'Koramangala 5th Block',
    noticeBuyoutCovered: false,
    atsMatchScore: 82,
    jobUrl: 'https://wellfound.com/company/prayog-ai',
    lastVerified: '2025-02-16T08:00:00Z',
    verificationSource: 'Wellfound Verified Seed Listing',
    contactConfidence: 'Verified Founder Inbox',
  },
  {
    id: 'job-02',
    title: 'Senior Data Engineer',
    company: 'Mosaic Retail',
    logoColor: 'bg-indigo-600',
    location: 'Gurugram, India',
    isRemote: true,
    source: 'Instahyre',
    minCtcLpa: 35.0,
    maxCtcLpa: 48.0,
    experienceDisplay: '5–8 years',
    salaryDisplay: '₹35–48 LPA',
    equityRange: '0.5% – 1.0%',
    requiredSkills: ['sql', 'spark', 'kafka', 'python', 'aws'],
    roleCategory: 'Data Scientist',
    description: 'Mosaic Retail processes real-time inventory telemetry for 4,000+ omnichannel storefronts. Seeking a Senior Data Engineer to architect Spark streaming jobs and ClickHouse data warehouses.',
    postedDate: '3 hours ago',
    founderName: 'Vikram Sethi',
    founderRole: 'Co-Founder & CTO',
    founderEmail: 'vikram@mosaicretail.io',
    hiringUrgency: 'High',
    emailDeliverabilityPct: 99.1,
    fundingRound: 'Series A · $18M',
    bangaloreCluster: 'Remote / NCR',
    noticeBuyoutCovered: true,
    atsMatchScore: 82,
    jobUrl: 'https://instahyre.com/job-mosaic-retail-senior-data-engineer',
    lastVerified: '2025-02-16T06:30:00Z',
    verificationSource: 'Instahyre Verified',
    contactConfidence: 'Direct Founder',
  },
  {
    id: 'job-03',
    title: 'Frontend Engineer, Design Systems',
    company: 'Meridian Retail',
    logoColor: 'bg-rose-500',
    location: 'Mumbai, India',
    isRemote: true,
    source: 'Wellfound',
    minCtcLpa: 22.0,
    maxCtcLpa: 30.0,
    experienceDisplay: '3–5 years',
    salaryDisplay: '₹22–30 LPA',
    equityRange: '0.25% – 0.5%',
    requiredSkills: ['react', 'typescript', 'tailwind', 'nextjs'],
    roleCategory: 'Frontend Engineer',
    description: 'Meridian builds headless ecommerce experiences. We need a frontend perfectionist who cares deeply about 60fps micro-interactions, accessibility, and component modularity.',
    postedDate: '5 hours ago',
    founderName: 'Maya Iyer',
    founderRole: 'VP of Engineering',
    founderEmail: 'maya@meridianretail.com',
    hiringUrgency: 'High',
    emailDeliverabilityPct: 99.7,
    fundingRound: 'Series B · $32M',
    bangaloreCluster: 'Mumbai / Remote',
    noticeBuyoutCovered: true,
    atsMatchScore: 81,
    jobUrl: 'https://wellfound.com/company/meridian-retail',
    lastVerified: '2025-02-16T04:00:00Z',
    verificationSource: 'Wellfound Verified',
    contactConfidence: 'High',
  },
  {
    id: 'job-04',
    title: 'Site Reliability Engineer',
    company: 'Neelam Systems',
    logoColor: 'bg-slate-800',
    location: 'Chennai, India',
    isRemote: false,
    source: 'LinkedIn',
    minCtcLpa: 32.0,
    maxCtcLpa: 44.0,
    experienceDisplay: '5–8 years',
    salaryDisplay: '₹32–44 LPA',
    equityRange: '0.4% – 0.8%',
    requiredSkills: ['linux', 'kubernetes', 'terraform', 'aws', 'docker'],
    roleCategory: 'DevOps Engineer',
    description: 'Neelam Systems provides core banking payment switches. Looking for an SRE to manage zero-downtime Kubernetes deployments across multi-region hybrid clouds.',
    postedDate: '6 hours ago',
    founderName: 'Sanjay Neelam',
    founderRole: 'CEO & Founder',
    founderEmail: 'sanjay@neelamsystems.com',
    hiringUrgency: 'Immediate',
    emailDeliverabilityPct: 98.8,
    fundingRound: 'Bootstrapped',
    bangaloreCluster: 'Chennai IT Corridor',
    noticeBuyoutCovered: true,
    atsMatchScore: 80,
    jobUrl: 'https://www.linkedin.com/company/neelam-systems',
    lastVerified: '2025-02-15T22:00:00Z',
    verificationSource: 'LinkedIn Verified Corporate',
    contactConfidence: 'Direct Founder',
  },
  {
    id: 'job-05',
    title: 'Software Engineering Intern',
    company: 'Vidyut Labs',
    logoColor: 'bg-amber-500',
    location: 'Pune, India',
    isRemote: true,
    source: 'Wellfound',
    minCtcLpa: 4.8,
    maxCtcLpa: 6.0,
    experienceDisplay: 'Internship (3 mo)',
    salaryDisplay: '₹40,000 / mo (₹4.8 LPA equiv)',
    equityRange: 'PPO Eligible',
    requiredSkills: ['react', 'typescript', 'node', 'postgresql'],
    roleCategory: 'Full Stack Developer',
    description: 'Vidyut Labs is building battery management operating systems for EV fleets. Looking for an ambitious student developer who can ship full-stack dashboards and API endpoints.',
    postedDate: '7 hours ago',
    founderName: 'Rohan Deshpande',
    founderRole: 'Co-founder',
    founderEmail: 'rohan@vidyutlabs.co',
    hiringUrgency: 'Normal',
    emailDeliverabilityPct: 99.5,
    fundingRound: 'Seed · $2.2M',
    bangaloreCluster: 'Pune Tech Park',
    noticeBuyoutCovered: false,
    atsMatchScore: 79,
    jobUrl: 'https://wellfound.com/company/vidyut-labs',
    lastVerified: '2025-02-15T20:00:00Z',
    verificationSource: 'Wellfound Verified',
    contactConfidence: 'Verified Founder Inbox',
  },
  {
    id: 'job-06',
    title: 'Software Engineer I (Backend)',
    company: 'Willow Payments',
    logoColor: 'bg-emerald-600',
    location: 'Mumbai, India',
    isRemote: false,
    source: 'Instahyre',
    minCtcLpa: 12.0,
    maxCtcLpa: 16.0,
    experienceDisplay: '1–2 years',
    salaryDisplay: '₹12–16 LPA',
    equityRange: '0.25% – 0.5%',
    requiredSkills: ['java', 'postgres', 'spring boot', 'redis'],
    roleCategory: 'Backend Engineer',
    description: 'Willow Payments powers automated UPI split settlements for gig economy platforms. Looking for an early career backend engineer with solid relational database fundamentals.',
    postedDate: '10 hours ago',
    founderName: 'Ananya Roy',
    founderRole: 'Head of Engineering',
    founderEmail: 'ananya@willowpay.com',
    hiringUrgency: 'Immediate',
    emailDeliverabilityPct: 99.2,
    fundingRound: 'Series A · $8M',
    bangaloreCluster: 'Bandra Kurla Complex',
    noticeBuyoutCovered: false,
    atsMatchScore: 79,
    jobUrl: 'https://instahyre.com/job-willow-payments-sde1',
    lastVerified: '2025-02-15T18:00:00Z',
    verificationSource: 'Instahyre Verified',
    contactConfidence: 'Direct Founder',
  },
  {
    id: 'job-07',
    title: 'Security Engineer, Detection',
    company: 'Ironvale Security',
    logoColor: 'bg-red-600',
    location: 'Remote, India',
    isRemote: true,
    source: 'Wellfound',
    minCtcLpa: 28.0,
    maxCtcLpa: 36.0,
    experienceDisplay: '5–7 years',
    salaryDisplay: '₹28–36 LPA',
    equityRange: '0.5%',
    requiredSkills: ['python', 'linux', 'wireshark', 'aws'],
    roleCategory: 'Security Engineer',
    description: 'Ironvale builds cloud infrastructure posture monitoring tools for fintechs. Looking for a detection engineer to write automated SIEM correlation rules and intrusion pipelines.',
    postedDate: '12 hours ago',
    founderName: 'Kabir Varma',
    founderRole: 'Founder & CEO',
    founderEmail: 'kabir@ironvalesec.com',
    hiringUrgency: 'High',
    emailDeliverabilityPct: 99.6,
    fundingRound: 'Seed · $3M',
    bangaloreCluster: 'Remote First',
    noticeBuyoutCovered: false,
    atsMatchScore: 78,
    jobUrl: 'https://wellfound.com/company/ironvale-security',
    lastVerified: '2025-02-15T15:00:00Z',
    verificationSource: 'Wellfound Verified',
    contactConfidence: 'Verified Founder Inbox',
  },
  {
    id: 'job-08',
    title: 'Junior Frontend Developer',
    company: 'Aarna Health',
    logoColor: 'bg-pink-600',
    location: 'Pune, India',
    isRemote: false,
    source: 'LinkedIn',
    minCtcLpa: 4.5,
    maxCtcLpa: 6.5,
    experienceDisplay: '0–1 years',
    salaryDisplay: '₹4.5–6.5 LPA',
    equityRange: 'None',
    requiredSkills: ['react', 'javascript', 'css', 'git'],
    roleCategory: 'Frontend Engineer',
    description: 'Aarna Health is digitizing outpatient clinic workflows. Looking for an energetic junior web developer to build fast, responsive doctor portals in React.',
    postedDate: '14 hours ago',
    founderName: 'Dr. Sameer Joshi',
    founderRole: 'CEO',
    founderEmail: 'sameer@aarnahealth.in',
    hiringUrgency: 'Immediate',
    emailDeliverabilityPct: 98.4,
    fundingRound: 'Seed · $800k',
    bangaloreCluster: 'Kothrud, Pune',
    noticeBuyoutCovered: false,
    atsMatchScore: 77,
    jobUrl: 'https://www.linkedin.com/company/aarna-health',
    lastVerified: '2025-02-15T12:00:00Z',
    verificationSource: 'LinkedIn Jobs',
    contactConfidence: 'Direct Founder',
  },
  {
    id: 'job-09',
    title: 'Associate Software Engineer',
    company: 'Kestrel AI',
    logoColor: 'bg-blue-600',
    location: 'Bengaluru, India',
    isRemote: true,
    source: 'YC W24',
    minCtcLpa: 8.0,
    maxCtcLpa: 12.0,
    experienceDisplay: '0–2 years',
    salaryDisplay: '₹8–12 LPA',
    equityRange: '0.1% – 0.25%',
    requiredSkills: ['python', 'sql', 'fastapi', 'docker'],
    roleCategory: 'AI Engineer',
    description: 'Kestrel AI trains compact edge reasoning models for drone surveillance. Looking for an associate engineer who loves Python, Linux profiling, and working with ONNX runtimes.',
    postedDate: '1 day ago',
    founderName: 'Aditya Shenoy',
    founderRole: 'Founding Engineer',
    founderEmail: 'aditya@kestrelai.com',
    hiringUrgency: 'High',
    emailDeliverabilityPct: 99.8,
    fundingRound: 'YC W24 · $500k',
    bangaloreCluster: 'Indiranagar 12th Main',
    noticeBuyoutCovered: false,
    atsMatchScore: 76,
    jobUrl: 'https://www.ycombinator.com/companies/kestrel-ai/jobs',
    lastVerified: '2025-02-15T09:00:00Z',
    verificationSource: 'YC Work at a Startup (W24)',
    contactConfidence: 'Verified Founder Inbox',
  },
  {
    id: 'job-10',
    title: 'Mobile Engineer, Android',
    company: 'Vidyut Labs',
    logoColor: 'bg-amber-600',
    location: 'Pune, India',
    isRemote: false,
    source: 'Wellfound',
    minCtcLpa: 20.0,
    maxCtcLpa: 28.0,
    experienceDisplay: '3–5 years',
    salaryDisplay: '₹20–28 LPA',
    equityRange: '0.35%',
    requiredSkills: ['kotlin', 'java', 'android jetpack', 'bluetooth'],
    roleCategory: 'Mobile Engineer',
    description: 'Vidyut Labs is seeking an Android engineer to build BLE hardware pairing interfaces and telemetry diagnostics for electric scooter fleets across India.',
    postedDate: '1 day ago',
    founderName: 'Rohan Deshpande',
    founderRole: 'Co-Founder',
    founderEmail: 'rohan@vidyutlabs.co',
    hiringUrgency: 'Normal',
    emailDeliverabilityPct: 99.1,
    fundingRound: 'Seed · $2.2M',
    bangaloreCluster: 'Pune',
    noticeBuyoutCovered: false,
    atsMatchScore: 76,
    jobUrl: 'https://wellfound.com/company/vidyut-labs/jobs',
    lastVerified: '2025-02-15T08:00:00Z',
    verificationSource: 'Wellfound Verified',
    contactConfidence: 'Direct Founder',
  },
  {
    id: 'job-11',
    title: 'Software Engineer I (Security)',
    company: 'Kavach Security',
    logoColor: 'bg-teal-700',
    location: 'Hyderabad, India',
    isRemote: true,
    source: 'LinkedIn',
    minCtcLpa: 10.0,
    maxCtcLpa: 14.0,
    experienceDisplay: '1–2 years',
    salaryDisplay: '₹10–14 LPA',
    equityRange: '0.2% – 0.4%',
    requiredSkills: ['typescript', 'node', 'aws', 'cryptography'],
    roleCategory: 'Security Engineer',
    description: 'Kavach Security builds end-to-end encrypted secret vaults for India fintechs. Looking for a junior engineer comfortable with TypeScript, cryptographic key management, and AWS KMS.',
    postedDate: '1 day ago',
    founderName: 'Pranav Reddy',
    founderRole: 'Founder',
    founderEmail: 'pranav@kavachsec.io',
    hiringUrgency: 'Immediate',
    emailDeliverabilityPct: 99.3,
    fundingRound: 'Seed · $1.2M',
    bangaloreCluster: 'Hitec City, Hyderabad',
    noticeBuyoutCovered: false,
    atsMatchScore: 75,
    jobUrl: 'https://www.linkedin.com/company/kavach-security',
    lastVerified: '2025-02-15T07:00:00Z',
    verificationSource: 'LinkedIn Jobs',
    contactConfidence: 'Verified Founder Inbox',
  },
  {
    id: 'job-13',
    title: 'Founding Full Stack Systems Engineer',
    company: 'DeepScale Systems',
    logoColor: 'bg-emerald-600',
    location: 'Pune, India',
    isRemote: true,
    source: 'YC S24',
    minCtcLpa: 28.0,
    maxCtcLpa: 42.0,
    experienceDisplay: '3–6 years',
    salaryDisplay: '₹28–42 LPA',
    equityRange: '0.8% - 1.5%',
    requiredSkills: ['react', 'typescript', 'python', 'docker', 'fastapi'],
    roleCategory: 'Full Stack Developer',
    description: 'DeepScale Systems builds high-throughput telemetry compaction engines for edge IoT and serverless runtimes. Looking for a founding full-stack engineer to lead core web console and distributed pipeline ingest.',
    postedDate: '3 hours ago',
    founderName: 'Tanmay Kulkarni',
    founderRole: 'Co-Founder & CTO',
    founderEmail: 'tanmay@deepscale.tech',
    hiringUrgency: 'Immediate',
    emailDeliverabilityPct: 99.7,
    fundingRound: 'Seed · $2.8M (Surge)',
    bangaloreCluster: 'Baner Tech Corridor, Pune',
    noticeBuyoutCovered: true,
    atsMatchScore: 88,
    jobUrl: 'https://www.deepscale.tech/careers',
    lastVerified: '2025-02-16T11:00:00Z',
    verificationSource: 'Peak XV Surge Directory',
    contactConfidence: 'Verified Founder Inbox',
  },
  {
    id: 'job-14',
    title: 'Senior Backend Engineer (Distributed Systems)',
    company: 'Synapse Analytics',
    logoColor: 'bg-cyan-600',
    location: 'Pune, India',
    isRemote: false,
    source: 'Wellfound',
    minCtcLpa: 30.0,
    maxCtcLpa: 45.0,
    experienceDisplay: '4–7 years',
    salaryDisplay: '₹30–45 LPA',
    equityRange: '0.4% - 0.9%',
    requiredSkills: ['python', 'fastapi', 'postgres', 'redis', 'kafka'],
    roleCategory: 'Backend Engineer',
    description: 'Synapse Analytics builds continuous machine learning pipelines for predictive logistics. Seeking a senior backend engineer to architect asynchronous event streaming and low-latency API gateways.',
    postedDate: '5 hours ago',
    founderName: 'Neha Deshmukh',
    founderRole: 'Founder & CEO',
    founderEmail: 'neha@synapsehq.io',
    hiringUrgency: 'High',
    emailDeliverabilityPct: 99.4,
    fundingRound: 'Series A · $6.5M',
    bangaloreCluster: 'Hinjewadi Phase 2, Pune',
    noticeBuyoutCovered: true,
    atsMatchScore: 85,
    jobUrl: 'https://wellfound.com/company/synapse-analytics-pune',
    lastVerified: '2025-02-16T10:30:00Z',
    verificationSource: 'Wellfound Verified',
    contactConfidence: 'Direct Founder',
  },
];

// Distinct, vibrant iOS-inspired brand palettes
export function getCompanyBrandStyle(company: string): { bg: string; text: string; border: string; gradient: string } {
  const c = company.toLowerCase();
  if (c.includes('cognitive') || c.includes('prayog')) {
    return {
      bg: 'bg-orange-50 dark:bg-orange-950/30',
      text: 'text-orange-600 dark:text-orange-400',
      border: 'border-orange-200/80 dark:border-orange-800/40',
      gradient: 'from-orange-500 to-amber-500 text-white shadow-orange-500/20',
    };
  }
  if (c.includes('mosaic') || c.includes('kestrel')) {
    return {
      bg: 'bg-indigo-50 dark:bg-indigo-950/30',
      text: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-200/80 dark:border-indigo-800/40',
      gradient: 'from-indigo-600 to-blue-600 text-white shadow-indigo-500/20',
    };
  }
  if (c.includes('meridian') || c.includes('aarna')) {
    return {
      bg: 'bg-rose-50 dark:bg-rose-950/30',
      text: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-200/80 dark:border-rose-800/40',
      gradient: 'from-rose-500 to-pink-600 text-white shadow-rose-500/20',
    };
  }
  if (c.includes('vidyut')) {
    return {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-200/80 dark:border-amber-800/40',
      gradient: 'from-amber-500 to-yellow-500 text-white shadow-amber-500/20',
    };
  }
  if (c.includes('willow') || c.includes('kavach')) {
    return {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-200/80 dark:border-emerald-800/40',
      gradient: 'from-emerald-500 to-teal-600 text-white shadow-emerald-500/20',
    };
  }
  if (c.includes('ironvale')) {
    return {
      bg: 'bg-red-50 dark:bg-red-950/30',
      text: 'text-red-600 dark:text-red-400',
      border: 'border-red-200/80 dark:border-red-800/40',
      gradient: 'from-red-500 to-rose-600 text-white shadow-red-500/20',
    };
  }
  if (c.includes('deepscale')) {
    return {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-200/80 dark:border-emerald-800/40',
      gradient: 'from-emerald-600 to-teal-700 text-white shadow-emerald-500/20',
    };
  }
  if (c.includes('synapse')) {
    return {
      bg: 'bg-cyan-50 dark:bg-cyan-950/30',
      text: 'text-cyan-700 dark:text-cyan-300',
      border: 'border-cyan-200/80 dark:border-cyan-800/40',
      gradient: 'from-cyan-600 to-blue-700 text-white shadow-cyan-500/20',
    };
  }
  return {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200/80 dark:border-blue-800/40',
    gradient: 'from-blue-600 to-cyan-600 text-white shadow-blue-500/20',
  };
}

export function calculateQuickMatchScore(candidate: CandidateProfile, job: JobListing): number {
  const candidateSkills = new Set(
    [...candidate.primarySkills, ...candidate.secondarySkills].map((s) => s.toLowerCase().trim())
  );
  const requiredSkills = job.requiredSkills.map((skill) => skill.toLowerCase().trim()).filter(Boolean);
  if (requiredSkills.length === 0) return 0;
  const matches = requiredSkills.filter((skill) => candidateSkills.has(skill)).length;
  return Math.round((matches / requiredSkills.length) * 100);
}

const companyDossiers: Record<string, CompanyDossier> = {
  'cognitivehq': {
    problemSpace: 'Autonomous multi-agent orchestration engines for real-time supply chain observability and anomaly mitigation.',
    backers: ['Y Combinator (W24)', 'Peak XV Surge', 'Soma Capital'],
    stageRound: 'Seed · $2.3M Total Raised',
    engineeringStack: ['Python 3.12', 'FastAPI', 'React 19', 'TypeScript', 'Docker', 'PostgreSQL', 'Ray Cluster'],
    teamSize: '8 engineers · High agency',
    architectureHighlights: [
      'Event-driven actor system with sub-100ms agent execution loops',
      'Dual LLM routing (local vLLM fallback for cost control + Claude 3.5 Sonnet)',
      'Enterprise tenancy isolation with schema-level encryption',
    ],
    foundedYear: 2023,
    glassdoorTrustRating: '4.9/5 · YC Verified',
  },
  'prayog ai': {
    problemSpace: 'Open-weights agentic frameworks for automated legal reasoning, clause risk extraction, and statutory compliance.',
    backers: ['Peak XV Surge', 'Together Fund', 'Angels from Sarvam AI'],
    stageRound: 'Seed · $1.5M',
    engineeringStack: ['PyTorch', 'Hugging Face Transformers', 'vLLM', 'FastAPI', 'Qdrant Vector DB', 'Docker'],
    teamSize: '6 engineers & ML researchers',
    architectureHighlights: [
      'Custom fine-tuned Llama 3 8B on 4M+ Indian supreme court and commercial judgements',
      'Hybrid dense-sparse retrieval with BM25 + ColBERT reranker',
      'Deterministic structured JSON parsing via grammar-constrained sampling',
    ],
    foundedYear: 2024,
    glassdoorTrustRating: 'Verified Early Stage',
  },
  'mosaic retail': {
    problemSpace: 'Distributed real-time inventory telemetry and automated stock replenishment across 4,000+ omnichannel retail storefronts.',
    backers: ['Accel India', 'Elevation Capital'],
    stageRound: 'Series A · $18M',
    engineeringStack: ['Apache Spark', 'Apache Kafka', 'ClickHouse', 'Python', 'AWS EKS', 'Terraform'],
    teamSize: '24 engineers across data & platform',
    architectureHighlights: [
      'High-throughput Kafka streaming processing >10,000 POS events/sec',
      'ClickHouse columnar cluster replacing legacy Redshift for sub-second aggregations',
      'Automated inventory replenishment recommendation microservices',
    ],
    foundedYear: 2021,
    glassdoorTrustRating: '4.6/5 · 62 reviews',
  },
  'meridian retail': {
    problemSpace: 'Next-generation headless e-commerce store engines and ultra-low-latency checkout design systems.',
    backers: ['Lightspeed Venture Partners', 'Matrix Partners India'],
    stageRound: 'Series B · $32M',
    engineeringStack: ['React', 'Next.js 15', 'TypeScript', 'Tailwind CSS', 'Turborepo', 'Cloudflare Workers'],
    teamSize: '35 engineers',
    architectureHighlights: [
      'Edge-rendered React Server Components with global median TTFB under 40ms',
      'Shared design system library consumed by 12 internal business units',
      'Accessible WCAG 2.1 AA compliant UI component architecture',
    ],
    foundedYear: 2020,
    glassdoorTrustRating: '4.7/5 · 110 reviews',
  },
  'neelam systems': {
    problemSpace: 'Sub-millisecond core banking payment switches handling high-frequency UPI and card settlements with 99.999% SLA.',
    backers: ['Bootstrapped & Profitable ($6M ARR)'],
    stageRound: 'Profitable · Zero Outside Debt',
    engineeringStack: ['Linux Kernel Tuning', 'Go', 'Kubernetes', 'Terraform', 'AWS GovCloud', 'Docker'],
    teamSize: '15 systems & infra engineers',
    architectureHighlights: [
      'Custom kernel bypass networking and eBPF observability pipelines',
      'Zero-downtime active-active multi-region failover cluster',
      'PCI-DSS Level 1 certified payment processing pipelines',
    ],
    foundedYear: 2018,
    glassdoorTrustRating: '4.8/5 · High Employee Retention',
  },
  'vidyut labs': {
    problemSpace: 'Intelligent battery management operating systems and real-time degradation telemetry for commercial EV fleets.',
    backers: ['Blume Ventures', 'Better Capital'],
    stageRound: 'Seed · $2.2M',
    engineeringStack: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'TimescaleDB', 'MQTT / IoT Core'],
    teamSize: '11 engineers (embedded + cloud)',
    architectureHighlights: [
      'TimescaleDB time-series database ingesting battery cell voltage telemetry every 2 seconds',
      'Predictive thermal runaway early warning models with 99.4% precision',
      'Fleet manager React dashboard with geospatial map clustering',
    ],
    foundedYear: 2022,
    glassdoorTrustRating: 'Verified EV Tech Startup',
  },
  'willow payments': {
    problemSpace: 'Automated instant UPI split settlements and escrow ledger infrastructure for gig platforms and marketplaces.',
    backers: ['Peak XV Partners (Sequoia India)', 'Tiger Global'],
    stageRound: 'Series A · $8M',
    engineeringStack: ['Java 21', 'Spring Boot', 'PostgreSQL', 'Redis', 'Kafka', 'Kubernetes'],
    teamSize: '20 engineers',
    architectureHighlights: [
      'Double-entry immutable accounting ledger with cryptographically signed balance snapshots',
      'Idempotent webhook delivery engine processing 500k daily disbursements',
      'Sub-50ms bank API integration proxy with circuit breakers',
    ],
    foundedYear: 2021,
    glassdoorTrustRating: '4.5/5 · 45 reviews',
  },
  'ironvale security': {
    problemSpace: 'Automated cloud infrastructure posture detection and real-time SIEM correlation engines for fintechs and neo-banks.',
    backers: ['Kalaari Capital', 'Nexus Venture Partners'],
    stageRound: 'Seed · $3.0M',
    engineeringStack: ['Python', 'Linux eBPF', 'Wireshark', 'AWS CloudTrail', 'Docker', 'OpenSearch'],
    teamSize: '9 security engineers',
    architectureHighlights: [
      'Kernel-level eBPF probes for zero-overhead runtime syscall monitoring',
      'Real-time behavioral anomaly scoring on AWS VPC flow logs',
      'Automated SOC2 compliance evidence generation engine',
    ],
    foundedYear: 2023,
    glassdoorTrustRating: 'Verified Cybersecurity Seed',
  },
  'aarna health': {
    problemSpace: 'Digital outpatient clinic operating system, electronic medical records (EMR), and unified patient booking.',
    backers: ['Titan Capital', 'AngelList Syndicate'],
    stageRound: 'Seed · $800k',
    engineeringStack: ['React', 'JavaScript', 'CSS Modules', 'REST APIs', 'Git', 'Node.js'],
    teamSize: '5 developers',
    architectureHighlights: [
      'Lightweight PWA capable of running offline on 3G clinic tablets',
      'ABDM (Ayushman Bharat Digital Mission) compliance integration',
      'Automated WhatsApp appointment confirmation and prescription delivery bot',
    ],
    foundedYear: 2023,
    glassdoorTrustRating: 'Verified Healthcare Seed',
  },
  'kestrel ai': {
    problemSpace: 'Low-power edge reasoning models and computer vision pipelines deployed on autonomous inspection drones.',
    backers: ['Y Combinator (W24)', 'Pioneer Fund'],
    stageRound: 'Seed · $1.5M Total',
    engineeringStack: ['Python', 'ONNX Runtime', 'FastAPI', 'Docker', 'C++', 'TensorRT'],
    teamSize: '7 researchers & engineers',
    architectureHighlights: [
      '8-bit quantized vision models executing at 30 FPS on Nvidia Jetson Orin Nano (15W envelope)',
      'Sub-second mission telemetry sync via low-bandwidth satellite uplinks',
      'Automated synthetic training data pipeline using Blender 3D',
    ],
    foundedYear: 2024,
    glassdoorTrustRating: 'YC Verified W24',
  },
  'kavach security': {
    problemSpace: 'End-to-end encrypted secret vaults and hardware-grade tokenization infrastructure for high-compliance fintechs.',
    backers: ['100x.VC', 'Fintech Founders Syndicate'],
    stageRound: 'Seed · $1.2M',
    engineeringStack: ['TypeScript', 'Node.js', 'AWS KMS', 'Cryptography', 'Docker', 'PostgreSQL'],
    teamSize: '6 security & backend engineers',
    architectureHighlights: [
      'Zero-knowledge client-side encryption using WebCrypto API and AES-256-GCM',
      'Automated key rotation with multi-party threshold signatures',
      'RBI data localization compliance with audit trails',
    ],
    foundedYear: 2023,
    glassdoorTrustRating: 'Fintech Security Seed',
  },
  'deepscale systems': {
    problemSpace: 'High-throughput telemetry compaction and distributed streaming runtimes for edge IoT and serverless architectures.',
    backers: ['Peak XV Surge', 'Y Combinator (S23)', 'Blume Ventures'],
    stageRound: 'Seed · $2.8M (Surge)',
    engineeringStack: ['React 19', 'TypeScript', 'Python', 'FastAPI', 'Docker', 'ClickHouse', 'Rust'],
    teamSize: '9 core engineers in Pune (Baner)',
    architectureHighlights: [
      'Sub-millisecond binary compaction protocol handling 400k events/sec per node',
      'Zero-copy WebAssembly edge plugins for dynamic customer telemetry filtering',
      'Automated failover clustering across AWS Mumbai and local data centres',
    ],
    foundedYear: 2023,
    glassdoorTrustRating: 'Surge S23 Verified',
  },
  'synapse analytics': {
    problemSpace: 'Autonomous predictive routing and real-time fleet allocation models for cross-border logistics in South Asia.',
    backers: ['Nexus Venture Partners', 'Kalaari Capital'],
    stageRound: 'Series A · $6.5M',
    engineeringStack: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Kafka', 'Docker', 'Kubernetes'],
    teamSize: '18 engineers in Pune (Hinjewadi)',
    architectureHighlights: [
      'Kafka distributed event fabric ingesting 150M GPS coordinate points daily',
      'PostGIS spatial index optimizations reducing geofencing latency by 82%',
      'Active-active failover with Redis cluster cache and CQRS read projections',
    ],
    foundedYear: 2022,
    glassdoorTrustRating: '4.8/5 · Series A Verified',
  },
};

export function getCompanyDossier(companyName: string): CompanyDossier {
  const key = companyName.toLowerCase().trim();
  const matchedKey = Object.keys(companyDossiers).find((k) => key.includes(k) || k.includes(key));
  if (matchedKey && companyDossiers[matchedKey]) {
    return companyDossiers[matchedKey];
  }

  // Sensible default dossier
  return {
    problemSpace: `${companyName} operates an engineering-driven startup platform delivering high-reliability systems.`,
    backers: ['Tier-1 Venture Capital', 'Angel Syndicate'],
    stageRound: 'Early-Stage Venture',
    engineeringStack: ['TypeScript', 'Python', 'React', 'Docker', 'Cloud Native'],
    teamSize: '8–15 engineers',
    architectureHighlights: [
      'Modern microservices architecture on containerized cloud',
      'CI/CD automated testing pipeline with high test coverage',
      'Low latency API contracts with monitoring and alerting',
    ],
    foundedYear: 2022,
    glassdoorTrustRating: 'Verified Startup Organization',
  };
}

export function evaluateMultiFactorFit(candidate: CandidateProfile, job: JobListing): MultiFactorFitReport {
  const candidateSkillsSet = new Set(
    [...candidate.primarySkills, ...candidate.secondarySkills].map((s) => s.toLowerCase().trim())
  );
  const requiredSkills = job.requiredSkills.map((s) => s.toLowerCase().trim()).filter(Boolean);
  
  const matchedProficiencies = requiredSkills.filter((s) => candidateSkillsSet.has(s));
  const missingRequirements = requiredSkills.filter((s) => !candidateSkillsSet.has(s));

  // 1. Technical Fit Vector (50% weight)
  const techScore = requiredSkills.length > 0 
    ? Math.round((matchedProficiencies.length / requiredSkills.length) * 100) 
    : 70;
  
  let techStatus: 'aligned' | 'partial' | 'gap' = 'partial';
  let techSummary = '';
  if (techScore >= 75) {
    techStatus = 'aligned';
    techSummary = `${matchedProficiencies.length} of ${requiredSkills.length} core proficiencies verified against your profile.`;
  } else if (techScore >= 50) {
    techStatus = 'partial';
    techSummary = `${matchedProficiencies.length} proficiencies matched; ${missingRequirements.length} requirements bridgeable (${missingRequirements.slice(0, 2).join(', ')}).`;
  } else {
    techStatus = 'gap';
    techSummary = `Stack divergence; requires rapid upskilling in ${missingRequirements.slice(0, 3).join(', ')}.`;
  }

  // 2. Experience Fit Vector (30% weight)
  const candidateYoe = candidate.yearsOfExperience || 3.5;
  const expLower = (job.experienceDisplay || '').toLowerCase();
  
  let expScore = 85;
  let expStatus: 'aligned' | 'partial' | 'gap' = 'aligned';
  let expSummary = '';

  if (expLower.includes('intern')) {
    expScore = 95;
    expStatus = 'aligned';
    expSummary = `Seniority advantage: ${candidateYoe}y proven experience exceeds base internship requirements.`;
  } else if (expLower.includes('0–1') || expLower.includes('0–2') || expLower.includes('1–2')) {
    expScore = 95;
    expStatus = 'aligned';
    expSummary = `Direct qualification: Candidate's ${candidateYoe}y career profile exceeds early career minimums.`;
  } else if (expLower.includes('3–5') || expLower.includes('3–6')) {
    expScore = 98;
    expStatus = 'aligned';
    expSummary = `Sweet spot seniority: ${candidateYoe}y experience directly aligns with target ${job.experienceDisplay} window.`;
  } else if (expLower.includes('5–8') || expLower.includes('5–7')) {
    expScore = 75;
    expStatus = 'partial';
    expSummary = `Growth opportunity: ${candidateYoe}y applying for senior ${job.experienceDisplay} mandate.`;
  } else {
    expScore = 85;
    expStatus = 'aligned';
    expSummary = `Tenure aligns with ${job.experienceDisplay || 'target seniority'}.`;
  }

  // 3. Location & Corridor Fit Vector (20% weight)
  let locScore = 80;
  let locStatus: 'aligned' | 'partial' | 'gap' = 'aligned';
  let locSummary = '';

  const candPref = (candidate.locationPreference || '').toLowerCase();
  const isBangaloreCandidate = candPref.includes('bangalore') || (candidate.location || '').toLowerCase().includes('bengaluru') || (candidate.location || '').toLowerCase().includes('bangalore');

  if (job.isRemote) {
    locScore = 100;
    locStatus = 'aligned';
    locSummary = 'Remote-first structure; location agnostic with flexible timezone collaboration.';
  } else if (isBangaloreCandidate && (job.location.toLowerCase().includes('bengaluru') || job.location.toLowerCase().includes('bangalore'))) {
    locScore = 100;
    locStatus = 'aligned';
    locSummary = `Zero relocation friction: ${job.bangaloreCluster || 'Bengaluru tech corridor'} fits candidate preference.`;
  } else if (job.location.toLowerCase().includes('pune') || job.location.toLowerCase().includes('mumbai') || job.location.toLowerCase().includes('chennai') || job.location.toLowerCase().includes('hyderabad')) {
    locScore = 75;
    locStatus = 'partial';
    locSummary = `In-region on-site (${job.location}); notice buyout or relocation stipend applicable.`;
  } else {
    locScore = 85;
    locStatus = 'aligned';
    locSummary = `Location requirements: ${job.location} (${job.isRemote ? 'Remote' : 'In-Office'}).`;
  }

  const overallScore = Math.round(techScore * 0.5 + expScore * 0.3 + locScore * 0.2);
  let alignmentTier: MultiFactorFitReport['alignmentTier'] = 'Strong Fit';
  if (overallScore >= 88) alignmentTier = 'Exceptional Fit';
  else if (overallScore >= 78) alignmentTier = 'Strong Fit';
  else if (overallScore >= 65) alignmentTier = 'Partial Fit';
  else alignmentTier = 'Reach Opportunity';

  return {
    overallScore,
    alignmentTier,
    technicalFit: {
      label: 'Technical Proficiency Alignment',
      score: techScore,
      status: techStatus,
      summary: techSummary,
      details: matchedProficiencies,
    },
    experienceFit: {
      label: 'Seniority & Experience Fit',
      score: expScore,
      status: expStatus,
      summary: expSummary,
      details: [`Candidate: ${candidateYoe} years`, `Role mandate: ${job.experienceDisplay || 'Standard'}`],
    },
    locationFit: {
      label: 'Location & Ecosystem Alignment',
      score: locScore,
      status: locStatus,
      summary: locSummary,
      details: [job.location, job.bangaloreCluster || (job.isRemote ? 'Remote Friendly' : 'On-site')],
    },
    matchedProficiencies,
    missingRequirements,
  };
}
