import React, { useState } from 'react';
import type { ApplicationCard, KanbanStatus, JobListing } from '../types';
import { 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  Trash2, 
  Send, 
  Download,
  Plus,
  Pencil,
  ExternalLink,
  MapPin,
  Search,
  X,
  GripVertical,
  Check,
  Briefcase
} from 'lucide-react';

interface AutopilotTrackerProps {
  cards: ApplicationCard[];
  onUpdateCardStatus: (cardId: string, nextStatus: KanbanStatus) => void;
  onUpdateCard?: (updatedCard: ApplicationCard) => void;
  onAddCustomCard?: (newCard: ApplicationCard) => void;
  onRemoveCard: (cardId: string) => void;
  onOpenOutreachForCard: (job: JobListing) => void;
}

const COLUMNS: { 
  id: KanbanStatus; 
  label: string; 
  countColor: string; 
  borderColor: string; 
  dotColor: string 
}[] = [
  { 
    id: 'DISCOVERED', 
    label: '1. Wishlist / Sourced', 
    countColor: 'text-neutral-300 bg-neutral-900 border-neutral-700', 
    borderColor: 'border-neutral-800', 
    dotColor: 'skeuo-led-amber' 
  },
  { 
    id: 'TAILORED', 
    label: '2. Resume tailored',
    countColor: 'text-indigo-400 bg-indigo-950/40 border-indigo-900/50', 
    borderColor: 'border-indigo-950/40', 
    dotColor: 'skeuo-led-blue' 
  },
  { 
    id: 'OUTREACH_SENT', 
    label: '3. Pitch Dispatched', 
    countColor: 'text-amber-400 bg-amber-950/40 border-amber-900/50', 
    borderColor: 'border-amber-950/40', 
    dotColor: 'skeuo-led-amber' 
  },
  { 
    id: 'INTERVIEW_SCHEDULED', 
    label: '4. Interview Booked', 
    countColor: 'text-blue-400 bg-blue-950/40 border-blue-900/50', 
    borderColor: 'border-blue-950/40', 
    dotColor: 'skeuo-led-blue' 
  },
  { 
    id: 'OFFER', 
    label: '5. Offer Secured', 
    countColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-900/50', 
    borderColor: 'border-emerald-950/40', 
    dotColor: 'skeuo-led-green' 
  },
  { 
    id: 'REJECTED', 
    label: '6. Archived / Passed', 
    countColor: 'text-rose-400 bg-rose-950/40 border-rose-900/50', 
    borderColor: 'border-rose-950/40', 
    dotColor: 'skeuo-led-red' 
  },
];

export const AutopilotTracker: React.FC<AutopilotTrackerProps> = ({
  cards,
  onUpdateCardStatus,
  onUpdateCard,
  onAddCustomCard,
  onRemoveCard,
  onOpenOutreachForCard,
}) => {
  const [followUpCopiedId, setFollowUpCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Drag and drop states
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<KanbanStatus | null>(null);

  // Add Custom Job Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newJobForm, setNewJobForm] = useState({
    company: '',
    title: '',
    location: 'Bangalore (HSR Layout)',
    salary: '₹25–35 LPA',
    jobUrl: '',
    tags: 'React, TypeScript, Seed',
    status: 'DISCOVERED' as KanbanStatus,
    founderName: '',
    founderEmail: '',
    founderRole: 'Founder & CEO',
    description: '',
    notes: '',
  });

  // Edit Job Card Modal State
  const [editingCard, setEditingCard] = useState<ApplicationCard | null>(null);
  const [editForm, setEditForm] = useState({
    company: '',
    title: '',
    location: '',
    salary: '',
    jobUrl: '',
    tags: '',
    status: 'DISCOVERED' as KanbanStatus,
    founderName: '',
    founderEmail: '',
    description: '',
    notes: '',
    atsScore: 85,
  });

  const sanitizeCsvCell = (val: string): string => {
    let safe = (val || '').replace(/"/g, '""');
    // Guard against spreadsheet formula injection (=, +, -, @, \t, \r)
    if (/^[=+\-@\t\r]/.test(safe)) {
      safe = `'${safe}`;
    }
    return `"${safe}"`;
  };

  const handleExportCsv = () => {
    const headers = ['Company', 'Role', 'Status', 'Salary', 'Location', 'Tags', 'Job URL', 'Founder Name', 'Founder Email', 'Notes', 'Applied Date'];
    const rows = cards.map((c) => {
      const allTags = c.tags || c.job.tags || c.job.requiredSkills || [];
      return [
        sanitizeCsvCell(c.job.company),
        sanitizeCsvCell(c.job.title),
        sanitizeCsvCell(c.status),
        sanitizeCsvCell(c.job.salaryDisplay || (c.job.minCtcLpa ? `₹${c.job.minCtcLpa}–${c.job.maxCtcLpa}L` : '')),
        sanitizeCsvCell(c.job.location || ''),
        sanitizeCsvCell(allTags.join(', ')),
        sanitizeCsvCell(c.jobUrl || c.job.jobUrl || ''),
        sanitizeCsvCell(c.job.founderName || ''),
        sanitizeCsvCell(c.job.founderEmail || ''),
        sanitizeCsvCell(c.notes || ''),
        sanitizeCsvCell(c.appliedDate || ''),
      ];
    });

    const csvContent = '\uFEFF' + [headers.map(sanitizeCsvCell).join(','), ...rows.map(e => e.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `jobpilot_applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyFollowUp = (card: ApplicationCard) => {
    const firstName = card.job.founderName ? card.job.founderName.split(' ')[0] : 'there';
    const text = `Hi ${firstName},

Hope you're having a productive week! 

Just following up quickly on my note from a few days ago regarding the ${card.job.title} role at ${card.job.company}. 

Given your focus on ${(card.job.requiredSkills || []).slice(0, 3).join(', ')}, I'd love to share how we solved similar scale challenges. Would you be open to a brief 10-minute chat this Thursday?

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
      case 'OFFER': return 'REJECTED';
      case 'REJECTED': return null;
    }
  };

  const getPrevStatus = (current: KanbanStatus): KanbanStatus | null => {
    switch (current) {
      case 'REJECTED': return 'OFFER';
      case 'OFFER': return 'INTERVIEW_SCHEDULED';
      case 'INTERVIEW_SCHEDULED': return 'OUTREACH_SENT';
      case 'OUTREACH_SENT': return 'TAILORED';
      case 'TAILORED': return 'DISCOVERED';
      case 'DISCOVERED': return null;
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData('text/plain', cardId);
    setDraggedCardId(cardId);
  };

  const handleDragEnd = () => {
    setDraggedCardId(null);
    setDragOverCol(null);
  };

  const handleDragOverColumn = (e: React.DragEvent, colId: KanbanStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCol !== colId) {
      setDragOverCol(colId);
    }
  };

  const handleDragLeaveColumn = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverCol(null);
    }
  };

  const handleDropOnColumn = (e: React.DragEvent, colId: KanbanStatus) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain') || draggedCardId;
    if (cardId) {
      onUpdateCardStatus(cardId, colId);
    }
    setDraggedCardId(null);
    setDragOverCol(null);
  };

  // Add custom job handler
  const handleCreateCustomJob = (e: React.FormEvent) => {
    e.preventDefault();
    const company = newJobForm.company.trim();
    const title = newJobForm.title.trim();
    if (!company || !title) return;

    const parsedTags = newJobForm.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const customJob: JobListing = {
      id: `custom-job-${Date.now()}`,
      company,
      title,
      logoColor: 'bg-blue-600',
      location: newJobForm.location.trim() || 'Bangalore, India',
      isRemote: newJobForm.location.toLowerCase().includes('remote'),
      source: 'LinkedIn',
      minCtcLpa: 0,
      maxCtcLpa: 0,
      equityRange: '',
      requiredSkills: parsedTags.length > 0 ? parsedTags : ['Full Stack'],
      description: newJobForm.description.trim() || `Role at ${company} for ${title}.`,
      postedDate: 'Custom Entry',
      founderName: newJobForm.founderName.trim(),
      founderRole: newJobForm.founderRole.trim() || 'Founder / Team',
      founderEmail: newJobForm.founderEmail.trim(),
      hiringUrgency: 'Normal',
      atsMatchScore: 80,
      salaryDisplay: newJobForm.salary.trim(),
      jobUrl: newJobForm.jobUrl.trim(),
      tags: parsedTags,
    };

    const newCard: ApplicationCard = {
      id: `app-${Date.now()}`,
      job: customJob,
      status: newJobForm.status,
      atsScore: 80,
      appliedDate: 'Just now',
      notes: newJobForm.notes.trim() || 'Custom logged application.',
      tags: parsedTags,
      jobUrl: newJobForm.jobUrl.trim(),
    };

    if (onAddCustomCard) {
      onAddCustomCard(newCard);
    } else {
      // Fallback
      cards.unshift(newCard);
    }

    // Reset and close
    setNewJobForm({
      company: '',
      title: '',
      location: 'Bangalore (HSR Layout)',
      salary: '₹25–35 LPA',
      jobUrl: '',
      tags: 'React, TypeScript, Seed',
      status: 'DISCOVERED',
      founderName: '',
      founderEmail: '',
      founderRole: 'Founder & CEO',
      description: '',
      notes: '',
    });
    setIsAddModalOpen(false);
  };

  // Open edit modal for a card
  const handleOpenEditModal = (card: ApplicationCard) => {
    setEditingCard(card);
    const existingTags = card.tags || card.job.tags || card.job.requiredSkills || [];
    setEditForm({
      company: card.job.company,
      title: card.job.title,
      location: card.job.location || '',
      salary: card.job.salaryDisplay || `₹${card.job.minCtcLpa}–${card.job.maxCtcLpa}L`,
      jobUrl: card.jobUrl || card.job.jobUrl || '',
      tags: existingTags.join(', '),
      status: card.status,
      founderName: card.job.founderName || '',
      founderEmail: card.job.founderEmail || '',
      description: card.job.description || '',
      notes: card.notes || '',
      atsScore: card.atsScore || 80,
    });
  };

  // Save edited card
  const handleSaveEditCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard) return;

    const parsedTags = editForm.tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const updatedJob: JobListing = {
      ...editingCard.job,
      company: editForm.company,
      title: editForm.title,
      location: editForm.location,
      salaryDisplay: editForm.salary,
      jobUrl: editForm.jobUrl,
      founderName: editForm.founderName,
      founderEmail: editForm.founderEmail,
      description: editForm.description,
      tags: parsedTags,
      requiredSkills: parsedTags.length > 0 ? parsedTags : editingCard.job.requiredSkills,
    };

    const updatedCard: ApplicationCard = {
      ...editingCard,
      job: updatedJob,
      status: editForm.status,
      notes: editForm.notes,
      tags: parsedTags,
      jobUrl: editForm.jobUrl,
      atsScore: editForm.atsScore,
    };

    if (onUpdateCard) {
      onUpdateCard(updatedCard);
    } else {
      onUpdateCardStatus(editingCard.id, editForm.status);
    }

    setEditingCard(null);
  };

  // Filtered cards by search query
  const filteredCards = cards.filter((c) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const allTags = [...(c.tags || []), ...(c.job.tags || []), ...(c.job.requiredSkills || [])].join(' ').toLowerCase();
    return (
      c.job.company.toLowerCase().includes(query) ||
      c.job.title.toLowerCase().includes(query) ||
      (c.job.location && c.job.location.toLowerCase().includes(query)) ||
      (c.notes && c.notes.toLowerCase().includes(query)) ||
      allTags.includes(query)
    );
  });

  const getCardsByStatus = (status: KanbanStatus) => 
    filteredCards.filter((c) => c.status === status);

  return (
    <div className="space-y-6 text-[#EDEDED] font-sans">
      {/* 1. Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="skeuo-surface p-4 sm:p-5 rounded-xl">
          <span className="text-[11px] font-mono font-medium text-neutral-400 uppercase tracking-wider block">
            Total In Pipeline
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white mt-1">{cards.length}</div>
        </div>

        <div className="skeuo-surface p-4 sm:p-5 rounded-xl">
          <span className="text-[11px] font-mono font-medium text-neutral-400 uppercase tracking-wider block">
            Pitches Dispatched
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400 mt-1">
            {cards.filter(c => c.status === 'OUTREACH_SENT' || c.status === 'INTERVIEW_SCHEDULED' || c.status === 'OFFER').length}
          </div>
        </div>

        <div className="skeuo-surface p-4 sm:p-5 rounded-xl">
          <span className="text-[11px] font-mono font-medium text-neutral-400 uppercase tracking-wider block">
            Interviews Booked
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-blue-400 mt-1">
            {cards.filter(c => c.status === 'INTERVIEW_SCHEDULED').length}
          </div>
        </div>

        <div className="skeuo-surface p-4 sm:p-5 rounded-xl">
          <span className="text-[11px] font-mono font-medium text-neutral-400 uppercase tracking-wider block">
            Offers Secured
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 mt-1">
            {cards.filter(c => c.status === 'OFFER').length}
          </div>
        </div>
      </div>

      {/* 2. Top Action Bar: Search, Add Custom Job, and CSV Export */}
      <div className="bg-[#0A0A0A] p-3.5 sm:p-4 rounded-xl border border-[#1F1F1F] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search & Filter */}
        <div className="flex-1 relative max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 z-10" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company, title, skill tag, or notes..."
            className="w-full skeuo-well pl-8 pr-8 py-2 text-xs text-white placeholder-neutral-500 rounded-lg outline-none transition-all font-mono focus:border-[#3F3F46]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-end md:self-auto shrink-0">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="skeuo-btn-primary px-3.5 py-2 rounded-lg text-black font-semibold flex items-center gap-1.5 text-xs active:translate-y-[2px] active:shadow-none font-sans"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Job</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="skeuo-btn px-3.5 py-2 rounded-lg text-neutral-300 hover:text-white font-medium flex items-center gap-1.5 text-xs font-mono active:translate-y-[2px] active:shadow-none"
            title="Download full pipeline as CSV"
          >
            <Download className="w-3.5 h-3.5 text-neutral-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 3. Drag and Drop Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 items-start select-none">
        {COLUMNS.map((col) => {
          const columnCards = getCardsByStatus(col.id);
          const isOverThisCol = dragOverCol === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOverColumn(e, col.id)}
              onDragLeave={handleDragLeaveColumn}
              onDrop={(e) => handleDropOnColumn(e, col.id)}
              className={`min-w-[275px] w-[275px] shrink-0 rounded-xl skeuo-slot transition-all duration-150 flex flex-col ${
                isOverThisCol 
                  ? 'ring-2 ring-white/30 border-white/50' 
                  : ''
              }`}
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-[#202028] bg-gradient-to-b from-[#18181D] to-[#101014] flex items-center justify-between rounded-t-xl">
                <div className="flex items-center gap-2">
                  <span className={col.dotColor} />
                  <span className="text-xs font-mono font-bold text-neutral-200">
                    {col.label}
                  </span>
                </div>
                <span className="skeuo-badge px-2 py-0.5 rounded-md text-[11px] font-mono font-bold text-neutral-200">
                  {columnCards.length}
                </span>
              </div>

              {/* Column Body / Drop Zone */}
              <div className="p-2.5 space-y-2.5 min-h-[420px] max-h-[620px] overflow-y-auto">
                {columnCards.length === 0 ? (
                  <div className="h-44 flex flex-col items-center justify-center border border-dashed border-[#272732] rounded-lg text-center p-4 skeuo-well opacity-50">
                    <span className="text-[11px] font-mono text-neutral-500 italic">
                      Drag jobs here
                    </span>
                  </div>
                ) : (
                  columnCards.map((card) => {
                    const isDragging = draggedCardId === card.id;
                    const nextStatus = getNextStatus(card.status);
                    const prevStatus = getPrevStatus(card.status);
                    const tags = card.tags || card.job.tags || card.job.requiredSkills || [];
                    const displaySalary = card.job.salaryDisplay || (card.job.minCtcLpa ? `₹${card.job.minCtcLpa}–${card.job.maxCtcLpa}L` : null);
                    const jobLink = card.jobUrl || card.job.jobUrl;

                    return (
                      <div
                        key={card.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, card.id)}
                        onDragEnd={handleDragEnd}
                        className={`skeuo-index-card rounded-xl p-3.5 space-y-2.5 transition-all group cursor-grab active:cursor-grabbing ${
                          isDragging ? 'opacity-30 border-dashed border-white/50 scale-95' : ''
                        }`}
                      >
                        {/* Top: Grip Handle, Position & Top Controls */}
                        <div className="flex items-start justify-between gap-1.5">
                          <div className="flex items-start gap-1.5 flex-1 min-w-0">
                            <GripVertical className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-200 mt-0.5 shrink-0" />
                            <div className="min-w-0">
                              <h4 className="font-bold text-white text-xs leading-snug truncate group-hover:text-white transition-colors">
                                {card.job.title}
                              </h4>
                              <p className="text-[11px] text-neutral-400 font-mono mt-0.5 truncate">
                                {card.job.company}
                              </p>
                            </div>
                          </div>

                          {/* Quick Actions (Edit, Link, Delete) */}
                          <div className="flex items-center gap-1 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                            {jobLink && (
                              <a
                                href={jobLink}
                                target="_blank"
                                rel="noreferrer"
                                className="skeuo-btn p-1 hover:text-white text-neutral-400 transition-colors rounded active:translate-y-[2px] active:shadow-none"
                                title="Open Job Posting URL"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            <button
                              onClick={() => handleOpenEditModal(card)}
                              className="skeuo-btn p-1 hover:text-white text-neutral-400 transition-colors rounded active:translate-y-[2px] active:shadow-none"
                              title="Edit application details"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => onRemoveCard(card.id)}
                              className="skeuo-btn p-1 hover:text-rose-400 text-neutral-400 transition-colors rounded active:translate-y-[2px] active:shadow-none"
                              title="Delete from board"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Metadata Pills: Salary & Location */}
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-neutral-300">
                          {displaySalary && (
                            <span className="skeuo-tag px-2 py-0.5 rounded text-emerald-400 font-medium">
                              {displaySalary}
                            </span>
                          )}
                          {card.job.location && (
                            <span className="skeuo-tag px-2 py-0.5 rounded text-neutral-300 flex items-center gap-0.5">
                              <MapPin className="w-2.5 h-2.5 text-neutral-400" />
                              <span className="truncate max-w-[110px]">{card.job.location}</span>
                            </span>
                          )}
                        </div>

                        {/* Physical Tag Badges */}
                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-[9px] font-mono px-2 py-0.5 rounded skeuo-tag text-neutral-300"
                              >
                                #{tag}
                              </span>
                            ))}
                            {tags.length > 3 && (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded skeuo-badge text-neutral-400">
                                +{tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Notes snippet */}
                        {card.notes && (
                          <p className="text-[10px] text-neutral-400 italic line-clamp-2 skeuo-well p-1.5 rounded font-mono">
                            "{card.notes}"
                          </p>
                        )}

                        {/* Quick 3-Day Follow-Up Script for Outreach Sent */}
                        {card.status === 'OUTREACH_SENT' && (
                          <div className="p-2.5 skeuo-surface border border-amber-500/30 rounded-lg space-y-1.5">
                            <div className="flex items-center justify-between text-[9px] font-mono text-amber-400">
                              <span className="flex items-center gap-1.5">
                                <span className="skeuo-led-amber" />
                                <Clock className="w-2.5 h-2.5" /> 3-Day Follow-Up Template
                              </span>
                            </div>
                            <button
                              onClick={() => handleCopyFollowUp(card)}
                              className="skeuo-btn w-full py-1 text-[10px] font-mono font-bold text-neutral-200 rounded transition-all active:translate-y-[2px] active:shadow-none"
                            >
                              {followUpCopiedId === card.id ? 'Copied Follow-up Script!' : 'Copy 3-Day Follow-Up'}
                            </button>
                          </div>
                        )}

                        {/* 1-Click Launch Founder Pitch */}
                        {(card.status === 'TAILORED' || (card.job.founderEmail && card.status === 'DISCOVERED')) && (
                          <button
                            onClick={() => onOpenOutreachForCard(card.job)}
                            className="skeuo-btn-primary w-full py-1.5 text-[10px] font-mono font-bold text-black rounded flex items-center justify-center gap-1 transition-all active:translate-y-[2px] active:shadow-none"
                          >
                            <Send className="w-2.5 h-2.5" /> Launch Founder Pitch
                          </button>
                        )}

                        {/* Stage Progression Arrows (Tactile click alternative to drag-and-drop) */}
                        <div className="flex items-center justify-between pt-1.5 border-t border-[#23232C] text-[10px] font-mono">
                          {prevStatus ? (
                            <button
                              onClick={() => onUpdateCardStatus(card.id, prevStatus)}
                              className="skeuo-btn px-2 py-0.5 text-neutral-400 hover:text-white flex items-center gap-0.5 active:translate-y-[2px] active:shadow-none rounded"
                              title={`Move back to ${prevStatus}`}
                            >
                              <ChevronLeft className="w-3 h-3" /> Back
                            </button>
                          ) : (
                            <span />
                          )}

                          {nextStatus && (
                            <button
                              onClick={() => onUpdateCardStatus(card.id, nextStatus)}
                              className="skeuo-btn px-2 py-0.5 text-neutral-200 hover:text-white font-bold flex items-center gap-0.5 ml-auto active:translate-y-[2px] active:shadow-none rounded"
                              title={`Advance to ${nextStatus}`}
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

      {/* 4. MODAL: + Add Custom Job (Tanmay-inspired Dialog) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#0D0D11] border border-[#24242A] rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F1F24]">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-white" />
                <h3 className="font-bold text-sm text-white">Add Custom Job Application</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomJob} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-400">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={newJobForm.company}
                    onChange={(e) => setNewJobForm({ ...newJobForm, company: e.target.value })}
                    placeholder="e.g. Zepto, Sarvam AI"
                    className="w-full bg-[#141418] border border-[#26262B] focus:border-white/40 rounded-lg px-3 py-2 text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400">Position / Title *</label>
                  <input
                    type="text"
                    required
                    value={newJobForm.title}
                    onChange={(e) => setNewJobForm({ ...newJobForm, title: e.target.value })}
                    placeholder="e.g. Founding Fullstack Engineer"
                    className="w-full bg-[#141418] border border-[#26262B] focus:border-white/40 rounded-lg px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-400">Location</label>
                  <input
                    type="text"
                    value={newJobForm.location}
                    onChange={(e) => setNewJobForm({ ...newJobForm, location: e.target.value })}
                    placeholder="e.g. Bangalore (HSR Layout) / Remote"
                    className="w-full bg-[#141418] border border-[#26262B] focus:border-white/40 rounded-lg px-3 py-2 text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400">Salary / CTC</label>
                  <input
                    type="text"
                    value={newJobForm.salary}
                    onChange={(e) => setNewJobForm({ ...newJobForm, salary: e.target.value })}
                    placeholder="e.g. ₹28–40 LPA or $120k"
                    className="w-full bg-[#141418] border border-[#26262B] focus:border-white/40 rounded-lg px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400">Job URL / Application Link</label>
                <input
                  type="url"
                  value={newJobForm.jobUrl}
                  onChange={(e) => setNewJobForm({ ...newJobForm, jobUrl: e.target.value })}
                  placeholder="https://wellfound.com/jobs/..."
                  className="w-full bg-[#141418] border border-[#26262B] focus:border-white/40 rounded-lg px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-400">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={newJobForm.tags}
                    onChange={(e) => setNewJobForm({ ...newJobForm, tags: e.target.value })}
                    placeholder="React, Next.js, High Pay"
                    className="w-full bg-[#141418] border border-[#26262B] focus:border-white/40 rounded-lg px-3 py-2 text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400">Initial Pipeline Stage</label>
                  <select
                    value={newJobForm.status}
                    onChange={(e) => setNewJobForm({ ...newJobForm, status: e.target.value as KanbanStatus })}
                    className="w-full bg-[#141418] border border-[#26262B] focus:border-white/40 rounded-lg px-3 py-2 text-white outline-none"
                  >
                    {COLUMNS.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-400">Founder / Contact Name (Optional)</label>
                  <input
                    type="text"
                    value={newJobForm.founderName}
                    onChange={(e) => setNewJobForm({ ...newJobForm, founderName: e.target.value })}
                    placeholder="e.g. Aadit Palicha"
                    className="w-full bg-[#141418] border border-[#26262B] focus:border-white/40 rounded-lg px-3 py-2 text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400">Founder Email (Optional)</label>
                  <input
                    type="email"
                    value={newJobForm.founderEmail}
                    onChange={(e) => setNewJobForm({ ...newJobForm, founderEmail: e.target.value })}
                    placeholder="aadit@zeptonow.com"
                    className="w-full bg-[#141418] border border-[#26262B] focus:border-white/40 rounded-lg px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400">Personal Notes / Next Steps</label>
                <textarea
                  rows={3}
                  value={newJobForm.notes}
                  onChange={(e) => setNewJobForm({ ...newJobForm, notes: e.target.value })}
                  placeholder="Referred by Rahul on Twitter. Need to follow up on Friday..."
                  className="w-full bg-[#141418] border border-[#26262B] focus:border-white/40 rounded-lg px-3 py-2 text-white outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#1F1F24]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="skeuo-btn px-4 py-2 rounded-lg text-neutral-400 hover:text-white transition-all active:translate-y-[2px] active:shadow-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="skeuo-btn-primary px-4 py-2 rounded-lg text-black font-semibold transition-all flex items-center gap-1.5 active:translate-y-[2px] active:shadow-none"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Add to Pipeline</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: Edit Application Card (Tanmay-inspired Dialog) */}
      {editingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#0D0D11] border border-[#24242A] rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F1F24]">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-white" />
                <h3 className="font-bold text-sm text-white">Edit Job Application</h3>
              </div>
              <button
                onClick={() => setEditingCard(null)}
                className="text-neutral-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditCard} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-400">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.company}
                    onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                    className="w-full bg-[#141418] border border-[#26262B] focus:border-white/40 rounded-lg px-3 py-2 text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400">Position / Title *</label>
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full bg-[#141418] border border-[#26262B] focus:border-white/40 rounded-lg px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-400">Location</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full bg-[#141418] border border-[#26262B] focus:border-white/40 rounded-lg px-3 py-2 text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400">Salary / CTC</label>
                  <input
                    type="text"
                    value={editForm.salary}
                    onChange={(e) => setEditForm({ ...editForm, salary: e.target.value })}
                    className="w-full bg-[#141418] border border-[#26262B] focus:border-white/40 rounded-lg px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400">Job URL</label>
                <input
                  type="url"
                  value={editForm.jobUrl}
                  onChange={(e) => setEditForm({ ...editForm, jobUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-[#141418] border border-[#26262B] focus:border-white/40 rounded-lg px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-400">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={editForm.tags}
                    onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                    className="w-full bg-[#141418] border border-[#26262B] focus:border-white/40 rounded-lg px-3 py-2 text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400">Pipeline Stage</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as KanbanStatus })}
                    className="w-full bg-[#141418] border border-[#26262B] focus:border-white/40 rounded-lg px-3 py-2 text-white outline-none"
                  >
                    {COLUMNS.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-400">Founder / Contact Name</label>
                  <input
                    type="text"
                    value={editForm.founderName}
                    onChange={(e) => setEditForm({ ...editForm, founderName: e.target.value })}
                    className="w-full bg-[#141418] border border-[#26262B] focus:border-white/40 rounded-lg px-3 py-2 text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-400">Founder Email</label>
                  <input
                    type="email"
                    value={editForm.founderEmail}
                    onChange={(e) => setEditForm({ ...editForm, founderEmail: e.target.value })}
                    className="w-full bg-[#141418] border border-[#26262B] focus:border-white/40 rounded-lg px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400">Personal Notes / Context</label>
                <textarea
                  rows={3}
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full bg-[#141418] border border-[#26262B] focus:border-white/40 rounded-lg px-3 py-2 text-white outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#1F1F24]">
                <button
                  type="button"
                  onClick={() => setEditingCard(null)}
                  className="skeuo-btn px-4 py-2 rounded-lg text-neutral-400 hover:text-white transition-all active:translate-y-[2px] active:shadow-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="skeuo-btn-primary px-4 py-2 rounded-lg text-black font-semibold transition-all flex items-center gap-1.5 active:translate-y-[2px] active:shadow-none"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutopilotTracker;
