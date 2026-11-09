import type { CandidateProfile } from '../types';

export const initialProfile: CandidateProfile = {
  id: 'cand-001',
  fullName: 'Arjun Mehta',
  email: 'arjun.mehta.dev@gmail.com',
  phone: '+91 98765 43210',
  headline: 'Senior Full Stack & AI Systems Engineer (Ex-Swiggy, 4 YOE)',
  yearsOfExperience: 4.2,
  currentCompany: 'Swiggy',
  targetRoles: ['Full Stack Engineer', 'Founding Engineer', 'Senior Backend Engineer', 'AI Platform Engineer'],
  primarySkills: ['React', 'TypeScript', 'Node.js', 'Python', 'FastAPI', 'PostgreSQL', 'Docker', 'AWS'],
  secondarySkills: ['Next.js', 'Redis', 'Kafka', 'LangChain', 'Kubernetes', 'GraphQL', 'Tailwind CSS'],
  minTargetCtcLpa: 24.0,
  locationPreference: 'Bangalore',
  githubUrl: 'https://github.com/arjunmehta-dev',
  linkedinUrl: 'https://linkedin.com/in/arjunmehta-engineer',
  portfolioUrl: 'https://arjunmehta.dev',
  resumeBullets: [
    {
      id: 'b1',
      role: 'Software Engineer II',
      company: 'Swiggy',
      text: 'Architected high-throughput order dispatch service handling 120k requests/min with sub-45ms p99 latency using Node.js, Redis clusters, and PostgreSQL.',
      keywords: ['Node.js', 'Redis', 'PostgreSQL', 'High-Throughput', 'Latency']
    },
    {
      id: 'b2',
      role: 'Software Engineer II',
      company: 'Swiggy',
      text: 'Built customer-facing tracking UI in React 18 & TypeScript with real-time WebSockets, decreasing frontend re-render thrash by 34%.',
      keywords: ['React', 'TypeScript', 'WebSockets', 'Frontend Performance']
    },
    {
      id: 'b3',
      role: 'Software Engineer I',
      company: 'Razorpay',
      text: 'Engineered automated reconciliation pipeline processing ₹40Cr daily GMV with 99.99% accuracy using Python, Celery workers, and AWS SQS.',
      keywords: ['Python', 'AWS', 'Celery', 'Fintech', 'Microservices']
    },
    {
      id: 'b4',
      role: 'Software Engineer I',
      company: 'Razorpay',
      text: 'Migrated monolithic payment gateway service into Docker containers orchestrated via Kubernetes, reducing build deployment times from 28 mins to 4 mins.',
      keywords: ['Docker', 'Kubernetes', 'CI/CD', 'DevOps']
    }
  ]
};
