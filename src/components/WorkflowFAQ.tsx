import React from 'react';
import { Plus } from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: 'Are the roles updated live?',
    answer: 'No. This build uses example role records. Open the source listing and confirm the role, compensation, and contact details before reaching out.',
  },
  {
    question: 'Does JobPilot send a pitch automatically?',
    answer: 'No. The composer prepares a draft for your email client or clipboard. You review and send it yourself, then choose whether to mark it as sent in your tracker.',
  },
  {
    question: 'What does the skill overlap percentage mean?',
    answer: 'It is the share of a role’s required skills that exactly match skills in your saved profile. It is a simple comparison, not a prediction of an employer’s ATS result.',
  },
  {
    question: 'Where is my profile and application tracker stored?',
    answer: 'They are saved in this browser’s local storage. You can export your tracker as CSV; clearing browser storage can remove locally saved data.',
  },
];

export const WorkflowFAQ: React.FC = () => (
  <section className="mx-auto max-w-4xl space-y-7 py-6" aria-labelledby="workflow-faq-title">
    <div className="max-w-2xl space-y-3">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#4CC9F0]">Clear answers</p>
      <h2 id="workflow-faq-title" className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Know what happens next.
      </h2>
      <p className="text-sm leading-relaxed text-[#A1A1A1]">
        A few details about the example directory and the tools in this workspace.
      </p>
    </div>

    <div className="divide-y divide-[#1F1F1F] border-y border-[#1F1F1F]">
      {FAQ_ITEMS.map(({ question, answer }) => (
        <details key={question} className="group py-1">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-sm font-medium text-white marker:hidden [&::-webkit-details-marker]:hidden">
            <span>{question}</span>
            <Plus className="h-4 w-4 shrink-0 text-[#737373] transition-transform duration-200 group-open:rotate-45" aria-hidden="true" />
          </summary>
          <p className="max-w-3xl pb-5 pr-8 text-sm leading-relaxed text-[#A1A1A1]">{answer}</p>
        </details>
      ))}
    </div>
  </section>
);

export default WorkflowFAQ;
