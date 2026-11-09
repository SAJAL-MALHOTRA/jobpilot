import React, { useState } from 'react';
import type { ApplicationCard, KanbanStatus, JobListing } from '../types';
import { 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  Trash2, 
  Send, 
  Mail, 
  Download
} from 'lucide-react';

interface AutopilotTrackerProps {
  cards: ApplicationCard[];
  onUpdateCardStatus: (cardId: string, nextStatus: KanbanStatus) => void;
  onRemoveCard: (cardId: string) => void;
  onOpenOutreachForCard: (job: JobListing) => void;
}

const COLUMNS: { id: KanbanStatus; label: string; countColor: string }[] = [
  { id: 'DISCOVERED', label: '1. Discovered', countColor: 'text-neutral-400 bg-neutral-800' },
  { id: 'TAILORED', label: '2. ATS Tailored', countColor: 'text-indigo-400 bg-neutral-800' },
  { id: 'OUTREACH_SENT', label: '3. Pitch Dispatched', countColor: 'text-amber-400 bg-neutral-800' },
  { id: 'INTERVIEW_SCHEDULED', label: '4. Interview Booked', countColor: 'text-blue-400 bg-neutral-800' },
  { id: 'OFFER', label: '5. Offer Secured', countColor: 'text-emerald-400 bg-neutral-800' },
];

export const AutopilotTracker: React.FC<AutopilotTrackerProps> = ({
  cards,
  onUpdateCardStatus,
  onRemoveCard,
  onOpenOutreachForCard,
}) => {
  const [followUpCopiedId, setFollowUpCopiedId] = useState<string | null>(null);

  const handleExportCsv = () => {
    const headers = ['Company', 'Role', 'Status', 'Founder Name', 'Founder Email', 'Location', 'Salary', 'Notes'];
    const rows = cards.map((c) => [
      `"${c.job.company}"`,
      `"${c.job.title}"`,
      `"${c.status}"`,
      `"${c.job.founderName}"`,
      `"${c.job.founderEmail}"`,
      `"${c.job.location}"`,
      `"${c.job.salaryDisplay || `₹${c.job.minCtcLpa}L`}"`,
      `"${(c.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jobpilot_applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCardsByStatus = (status: KanbanStatus) => cards.filter((c) => c.status === status);

  const handleCopyFollowUp = (card: ApplicationCard) => {
    const firstName = card.job.founderName.split(' ')[0] || 'there';
    const text = `Hi ${firstName},

Hope you're having a productive week! 

Just following up quickly on my note from a few days ago regarding the ${card.job.title} role at ${card.job.company}. 

Given your focus on ${card.job.requiredSkills.slice(0, 3).join(', ')}, I'd love to share how we solved similar scale challenges at ${card.job.company}. Would you be open to a brief 10-minute chat this Thursday?

Best regards,
Arjun Mehta`;

    navigator.clipboard.writeText(text);
    setFollowUpCopiedId(card.id);
    setTimeout(() => setFollowUpCopiedId(null), 2500);
  };

  const getNextStatus = (current: KanbanStatus): KanbanStatus | null => {
    switch (current) {
      case 'DISCOVERED': return 'TAILORED';
      case 'TAILORED': return 'OUTREACH_SENT';
      case 'OUTREACH_SENT': return 'INTERVIEW_SCHEDULED';
      case 'INTERVIEW_SCHEDULED': return 'OFFER';
      case 'OFFER': return null;
    }
  };

  const getPrevStatus = (current: KanbanStatus): KanbanStatus | null => {
    switch (current) {
      case 'OFFER': return 'INTERVIEW_SCHEDULED';
      case 'INTERVIEW_SCHEDULED': return 'OUTREACH_SENT';
      case 'OUTREACH_SENT': return 'TAILORED';
      case 'TAILORED': return 'DISCOVERED';
      case 'DISCOVERED': return null;
    }
  };

  return (
    <div className="space-y-6 text-[#EDEDED]">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#111115] p-5 rounded-2xl border border-neutral-800">
          <span className="text-[11px] font-mono font-semibold text-neutral-400 uppercase tracking-wider block">
            Total In Pipeline
          </span>
          <div className="text-3xl font-black font-mono text-white mt-1">{cards.length}</div>
        </div>

        <div className="bg-[#111115] p-5 rounded-2xl border border-neutral-800">
          <span className="text-[11px] font-mono font-semibold text-neutral-400 uppercase tracking-wider block">
            Founder Pitches Sent
          </span>
          <div className="text-3xl font-black font-mono text-amber-400 mt-1">
            {cards.filter(c => c.status === 'OUTREACH_SENT' || c.status === 'INTERVIEW_SCHEDULED' || c.status === 'OFFER').length}
          </div>
        </div>

        <div className="bg-[#111115] p-5 rounded-2xl border border-neutral-800">
          <span className="text-[11px] font-mono font-semibold text-neutral-400 uppercase tracking-wider block">
            Interviews Booked
          </span>
          <div className="text-3xl font-black font-mono text-indigo-400 mt-1">
            {cards.filter(c => c.status === 'INTERVIEW_SCHEDULED').length}
          </div>
        </div>

        <div className="bg-[#111115] p-5 rounded-2xl border border-neutral-800">
          <span className="text-[11px] font-mono font-semibold text-neutral-400 uppercase tracking-wider block">
            Offers Secured
          </span>
          <div className="text-3xl font-black font-mono text-emerald-400 mt-1">
            {cards.filter(c => c.status === 'OFFER').length}
          </div>
        </div>
      </div>

      {/* Real Pipeline Export Bar */}
      <div className="bg-[#0A0A0A] p-4 rounded-xl border border-[#1F1F1F] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#141414] border border-[#262626] flex items-center justify-center text-white">
            <Mail className="w-4 h-4 text-[#888888]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white font-sans text-sm">Application Pipeline Tracker</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-[#141414] text-[#888888] border border-[#262626]">
                Local Storage Persistence
              </span>
            </div>
            <p className="text-[11px] text-[#888888] mt-0.5">
              All applications and outreach logs persist in your browser. Export to CSV anytime.
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-3.5 py-2 rounded-lg bg-[#141414] hover:bg-[#1F1F1F] text-white font-medium border border-[#262626] transition-colors flex items-center gap-2 shrink-0 text-xs"
        >
          <Download className="w-3.5 h-3.5 text-[#888888]" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const columnCards = getCardsByStatus(col.id);

          return (
            <div
              key={col.id}
              className="bg-[#111115] rounded-2xl border border-neutral-800 p-4 space-y-3 min-w-[240px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800/80">
                <span className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wide">
                  {col.label}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold font-mono ${col.countColor}`}>
                  {columnCards.length}
                </span>
              </div>

              {/* Column Cards */}
              <div className="space-y-3 min-h-[160px]">
                {columnCards.length === 0 ? (
                  <div className="py-10 text-center text-[11px] font-mono text-neutral-500 italic">
                    No active roles
                  </div>
                ) : (
                  columnCards.map((card) => {
                    const nextStatus = getNextStatus(card.status);
                    const prevStatus = getPrevStatus(card.status);

                    return (
                      <div
                        key={card.id}
                        className="bg-neutral-900/90 rounded-xl border border-neutral-800 hover:border-neutral-700 p-4 space-y-3 transition-all shadow-md group"
                      >
                        {/* Card Top */}
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-white text-xs leading-snug group-hover:text-indigo-300 transition-colors">
                              {card.job.title}
                            </h4>
                            <p className="text-[11px] text-neutral-400 mt-0.5 font-mono">{card.job.company}</p>
                          </div>
                          <button
                            onClick={() => onRemoveCard(card.id)}
                            className="text-neutral-500 hover:text-rose-400 transition-colors p-0.5"
                            title="Remove from CRM"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* CTC & ATS Match */}
                        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-300 bg-neutral-950/80 px-2.5 py-1.5 rounded-lg border border-neutral-800">
                          <span>₹{card.job.minCtcLpa}–{card.job.maxCtcLpa}L</span>
                          <span className="text-emerald-400 font-bold">{card.atsScore}% ATS</span>
                        </div>

                        {/* Follow Up Timer Banner for Outreach Sent */}
                        {card.status === 'OUTREACH_SENT' && (
                          <div className="p-2.5 bg-neutral-950/80 border border-amber-500/20 rounded-lg space-y-1.5">
                            <div className="flex items-center justify-between text-[10px] font-mono text-amber-400">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-400" /> 3-Day Nudge Due
                              </span>
                            </div>
                            <button
                              onClick={() => handleCopyFollowUp(card)}
                              className="w-full py-1 text-[10px] font-mono font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded transition-all"
                            >
                              {followUpCopiedId === card.id ? 'Copied Follow-up Script!' : 'Copy 3-Day Follow-Up'}
                            </button>
                          </div>
                        )}

                        {/* Launch outreach directly for tailored cards */}
                        {card.status === 'TAILORED' && (
                          <button
                            onClick={() => onOpenOutreachForCard(card.job)}
                            className="w-full py-1.5 text-[10px] font-mono font-bold bg-white hover:bg-neutral-200 text-black rounded flex items-center justify-center gap-1 transition-all"
                          >
                            <Send className="w-2.5 h-2.5" /> Launch Founder Pitch
                          </button>
                        )}

                        {/* Status Advancement Controls */}
                        <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-[10px] font-mono">
                          {prevStatus ? (
                            <button
                              onClick={() => onUpdateCardStatus(card.id, prevStatus)}
                              className="text-neutral-400 hover:text-white flex items-center gap-0.5"
                            >
                              <ChevronLeft className="w-3 h-3" /> Back
                            </button>
                          ) : <span />}

                          {nextStatus && (
                            <button
                              onClick={() => onUpdateCardStatus(card.id, nextStatus)}
                              className="text-white hover:text-neutral-300 font-bold flex items-center gap-0.5 ml-auto"
                            >
                              Advance <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default AutopilotTracker;
