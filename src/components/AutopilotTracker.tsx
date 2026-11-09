import React, { useState } from 'react';
import type { ApplicationCard, KanbanStatus, JobListing } from '../types';
import { Clock, ChevronRight, ChevronLeft, Trash2, Send } from 'lucide-react';

interface AutopilotTrackerProps {
  cards: ApplicationCard[];
  onUpdateCardStatus: (cardId: string, nextStatus: KanbanStatus) => void;
  onRemoveCard: (cardId: string) => void;
  onOpenOutreachForCard: (job: JobListing) => void;
}

const COLUMNS: { id: KanbanStatus; label: string; countColor: string }[] = [
  { id: 'DISCOVERED', label: 'Discovered', countColor: 'text-slate-400 bg-slate-800' },
  { id: 'TAILORED', label: 'ATS Tailored', countColor: 'text-indigo-400 bg-indigo-500/10' },
  { id: 'OUTREACH_SENT', label: 'Outreach Sent', countColor: 'text-amber-400 bg-amber-500/10' },
  { id: 'INTERVIEW_SCHEDULED', label: 'Interviewing', countColor: 'text-blue-400 bg-blue-500/10' },
  { id: 'OFFER', label: 'Offer Received', countColor: 'text-emerald-400 bg-emerald-500/10' },
];

export const AutopilotTracker: React.FC<AutopilotTrackerProps> = ({
  cards,
  onUpdateCardStatus,
  onRemoveCard,
  onOpenOutreachForCard,
}) => {
  const [followUpCopiedId, setFollowUpCopiedId] = useState<string | null>(null);

  const getCardsByStatus = (status: KanbanStatus) => cards.filter((c) => c.status === status);

  const handleCopyFollowUp = (card: ApplicationCard) => {
    const firstName = card.job.founderName.split(' ')[0] || 'there';
    const text = `Hi ${firstName},

Hope you're having a great week! 

Just following up quickly on my note from a few days ago regarding the ${card.job.title} opening at ${card.job.company}. 

I remain very excited about what you're building. Would you be open to a brief 10-minute chat this week?

Best regards,
Arjun Mehta`;

    navigator.clipboard.writeText(text);
    setFollowUpCopiedId(card.id);
    setTimeout(() => setFollowUpCopiedId(null), 2000);
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
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#101625] p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total In Pipeline</span>
          <div className="text-2xl font-black font-mono text-white mt-1">{cards.length}</div>
        </div>

        <div className="bg-[#101625] p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Outreach Sent</span>
          <div className="text-2xl font-black font-mono text-amber-400 mt-1">
            {cards.filter(c => c.status === 'OUTREACH_SENT' || c.status === 'INTERVIEW_SCHEDULED' || c.status === 'OFFER').length}
          </div>
        </div>

        <div className="bg-[#101625] p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Interview Pipeline</span>
          <div className="text-2xl font-black font-mono text-indigo-400 mt-1">
            {cards.filter(c => c.status === 'INTERVIEW_SCHEDULED').length}
          </div>
        </div>

        <div className="bg-[#101625] p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Offers Secured</span>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
            {cards.filter(c => c.status === 'OFFER').length}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const columnCards = getCardsByStatus(col.id);

          return (
            <div
              key={col.id}
              className="bg-[#101625]/90 rounded-2xl border border-slate-800/80 p-4 space-y-3 min-w-[240px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                  {col.label}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold font-mono ${col.countColor}`}>
                  {columnCards.length}
                </span>
              </div>

              {/* Column Cards */}
              <div className="space-y-3 min-h-[150px]">
                {columnCards.length === 0 ? (
                  <div className="py-8 text-center text-[11px] text-slate-500 italic">
                    No jobs in this stage
                  </div>
                ) : (
                  columnCards.map((card) => {
                    const nextStatus = getNextStatus(card.status);
                    const prevStatus = getPrevStatus(card.status);

                    return (
                      <div
                        key={card.id}
                        className="bg-slate-900/90 rounded-xl border border-slate-800 hover:border-slate-700 p-4 space-y-3 transition-all shadow-md group"
                      >
                        {/* Card Top */}
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-white text-xs leading-snug group-hover:text-indigo-400 transition-colors">
                              {card.job.title}
                            </h4>
                            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{card.job.company}</p>
                          </div>
                          <button
                            onClick={() => onRemoveCard(card.id)}
                            className="text-slate-500 hover:text-rose-400 transition-colors p-0.5"
                            title="Remove from CRM"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* CTC & ATS Match */}
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-slate-800/80">
                          <span>₹ {card.job.minCtcLpa}–{card.job.maxCtcLpa}L</span>
                          <span className="text-emerald-400 font-bold">{card.atsScore}% ATS</span>
                        </div>

                        {/* Follow Up Timer Banner for Outreach Sent */}
                        {card.status === 'OUTREACH_SENT' && (
                          <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg space-y-1.5">
                            <div className="flex items-center justify-between text-[10px] text-amber-300 font-medium">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-400" /> Follow-up in 2 days
                              </span>
                            </div>
                            <button
                              onClick={() => handleCopyFollowUp(card)}
                              className="w-full py-1 text-[10px] font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded transition-all"
                            >
                              {followUpCopiedId === card.id ? 'Copied Follow-up Script!' : 'Copy 3-Day Nudge'}
                            </button>
                          </div>
                        )}

                        {/* Launch outreach directly for tailored cards */}
                        {card.status === 'TAILORED' && (
                          <button
                            onClick={() => onOpenOutreachForCard(card.job)}
                            className="w-full py-1 text-[10px] font-bold bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded flex items-center justify-center gap-1 transition-all"
                          >
                            <Send className="w-2.5 h-2.5" /> Draft Founder Pitch
                          </button>
                        )}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px]">
                          {prevStatus ? (
                            <button
                              onClick={() => onUpdateCardStatus(card.id, prevStatus)}
                              className="text-slate-400 hover:text-white flex items-center gap-0.5"
                            >
                              <ChevronLeft className="w-3 h-3" /> Back
                            </button>
                          ) : <span />}

                          {nextStatus && (
                            <button
                              onClick={() => onUpdateCardStatus(card.id, nextStatus)}
                              className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-0.5 ml-auto"
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
