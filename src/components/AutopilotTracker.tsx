import React, { useState } from 'react';
import type { ApplicationCard, KanbanStatus, JobListing } from '../types';
import MetricCard from './kokonutui/metric-card';
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
  Briefcase,
  TrendingUp
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
  dotColor: string 
}[] = [
  { 
    id: 'DISCOVERED', 
    label: '1. Sourced / Wishlist', 
    dotColor: 'bg-neutral-400 dark:bg-neutral-500' 
  },
  { 
    id: 'TAILORED', 
    label: '2. Resume Tailored', 
    dotColor: 'bg-indigo-500' 
  },
  { 
    id: 'OUTREACH_SENT', 
    label: '3. Pitch Dispatched', 
    dotColor: 'bg-amber-500' 
  },
  { 
    id: 'INTERVIEW_SCHEDULED', 
    label: '4. Interview Booked', 
    dotColor: 'bg-blue-500' 
  },
  { 
    id: 'OFFER', 
    label: '5. Offer Secured', 
    dotColor: 'bg-emerald-500' 
  },
  { 
    id: 'REJECTED', 
    label: '6. Archived / Passed', 
    dotColor: 'bg-rose-500' 
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
  const [showAnalyticsChart, setShowAnalyticsChart] = useState(false);
  
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
    notes: '',
    description: '',
    atsScore: 80,
  });

  // Export pipeline to CSV
  const handleExportCsv = () => {
    if (cards.length === 0) {
      alert('Pipeline is currently empty. Add roles before exporting.');
      return;
    }

    const headers = [
      'Application ID',
      'Company',
      'Role Title',
      'Status Stage',
      'Location',
      'Salary / Compensation',
      'Match Score',
      'Founder Name',
      'Founder Email',
      'Job URL',
      'Notes',
    ];

    const rows = cards.map((c) => [
      `"${c.id}"`,
      `"${c.job.company.replace(/"/g, '""')}"`,
      `"${c.job.title.replace(/"/g, '""')}"`,
      `"${c.status}"`,
      `"${c.job.location.replace(/"/g, '""')}"`,
      `"${(c.job.salaryDisplay || `₹${c.job.minCtcLpa}L–${c.job.maxCtcLpa}L`).replace(/"/g, '""')}"`,
      `"${c.atsScore || c.job.atsMatchScore}%"`,
      `"${(c.job.founderName || '').replace(/"/g, '""')}"`,
      `"${(c.job.founderEmail || '').replace(/"/g, '""')}"`,
      `"${(c.jobUrl || c.job.jobUrl || '').replace(/"/g, '""')}"`,
      `"${(c.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `JobPilot_Pipeline_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyFollowUp = (card: ApplicationCard) => {
    const text = `Hi ${card.job.founderName || 'there'},

Following up on my message earlier regarding the ${card.job.title} opening at ${card.job.company}. 

Given your focus on product velocity, I prepared a technical audit of the stack and can ship production improvements immediately. 

Would 10 minutes this week work for a brief intro call?

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
      cards.unshift(newCard);
    }

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
      location: card.job.location,
      salary: card.job.salaryDisplay || (card.job.minCtcLpa ? `₹${card.job.minCtcLpa}–${card.job.maxCtcLpa}L` : ''),
      jobUrl: card.jobUrl || card.job.jobUrl || '',
      tags: existingTags.join(', '),
      status: card.status,
      founderName: card.job.founderName || '',
      founderEmail: card.job.founderEmail || '',
      notes: card.notes || '',
      description: card.job.description || '',
      atsScore: card.atsScore ?? card.job.atsMatchScore ?? 80,
    });
  };

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
    <div className="space-y-6 text-neutral-900 dark:text-neutral-100 font-sans">
      {/* 1. Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-[#121316] p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
            Total In Pipeline
          </span>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white mt-1 tabular-nums">
            {cards.length}
          </div>
        </div>

        <div className="bg-white dark:bg-[#121316] p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
            Pitches Dispatched
          </span>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1 tabular-nums">
            {cards.filter(c => c.status === 'OUTREACH_SENT' || c.status === 'INTERVIEW_SCHEDULED' || c.status === 'OFFER').length}
          </div>
        </div>

        <div className="bg-white dark:bg-[#121316] p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
            Interviews Booked
          </span>
          <div className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1 tabular-nums">
            {cards.filter(c => c.status === 'INTERVIEW_SCHEDULED').length}
          </div>
        </div>

        <div className="bg-white dark:bg-[#121316] p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
            Offers Secured
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            {cards.filter(c => c.status === 'OFFER').length}
          </div>
        </div>
      </div>

      {/* 2. Action Bar */}
      <div className="bg-white dark:bg-[#121316] p-3 sm:p-3.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs shadow-xs">
        {/* Search */}
        <div className="flex-1 relative max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 z-10" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company, title, skill tag, or notes..."
            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 pl-8 pr-8 py-2 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 rounded-lg outline-none font-mono focus:border-neutral-900 dark:focus:border-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <button
            onClick={() => setShowAnalyticsChart(!showAnalyticsChart)}
            className={`px-3 py-2 rounded-lg border font-mono font-medium flex items-center gap-1.5 text-xs transition-colors shadow-xs ${
              showAnalyticsChart
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-transparent'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
            <span>{showAnalyticsChart ? 'Hide Trends' : 'Velocity Chart'}</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-[#EBF946] dark:text-black dark:hover:bg-[#d4e23f] font-semibold flex items-center gap-1.5 text-xs transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Job</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 font-medium flex items-center gap-1.5 text-xs font-mono transition-colors"
            title="Download pipeline as CSV"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Kokonut UI Metric Card Interactive Velocity Spline */}
      {showAnalyticsChart && (
        <div className="border border-neutral-200/80 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs bg-white dark:bg-[#121316]">
          <MetricCard
            label="Pipeline Conversion Velocity"
            segments={['Sourced', 'Tailored', 'Dispatched', 'Interviews']}
            format="number"
            className="w-full"
          />
        </div>
      )}

      {/* 3. Drag and Drop Kanban Board */}
      <div className="flex gap-3.5 overflow-x-auto pb-4 pt-1 items-start select-none">
        {COLUMNS.map((col) => {
          const columnCards = getCardsByStatus(col.id);
          const isOverThisCol = dragOverCol === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOverColumn(e, col.id)}
              onDragLeave={handleDragLeaveColumn}
              onDrop={(e) => handleDropOnColumn(e, col.id)}
              className={`min-w-[280px] w-[280px] shrink-0 rounded-xl bg-neutral-100/70 dark:bg-[#111216] border transition-colors flex flex-col ${
                isOverThisCol 
                  ? 'border-neutral-900 dark:border-neutral-300 ring-2 ring-neutral-900/10 dark:ring-white/10' 
                  : 'border-neutral-200/80 dark:border-neutral-800'
              }`}
            >
              {/* Column Header */}
              <div className="p-3 border-b border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#15171e] flex items-center justify-between rounded-t-xl">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                  <span className="text-xs font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                    {col.label}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 tabular-nums border border-neutral-200/60 dark:border-neutral-700/60">
                  {columnCards.length}
                </span>
              </div>

              {/* Column Body / Drop Zone */}
              <div className="p-2.5 space-y-2.5 min-h-[420px] max-h-[620px] overflow-y-auto">
                {columnCards.length === 0 ? (
                  <div className="h-40 flex flex-col items-center justify-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg text-center p-4">
                    <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
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
                        className={`bg-white dark:bg-[#181a22] border border-neutral-200/90 dark:border-neutral-800 rounded-lg p-3 space-y-2.5 transition-all group cursor-grab active:cursor-grabbing shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 ${
                          isDragging ? 'opacity-30 border-dashed border-neutral-400 scale-95' : ''
                        }`}
                      >
                        {/* Top: Grip Handle, Position & Top Controls */}
                        <div className="flex items-start justify-between gap-1.5">
                          <div className="flex items-start gap-1.5 flex-1 min-w-0">
                            <GripVertical className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 mt-0.5 shrink-0" />
                            <div className="min-w-0">
                              <h4 className="font-semibold text-neutral-900 dark:text-white text-xs leading-snug truncate">
                                {card.job.title}
                              </h4>
                              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono mt-0.5 truncate">
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
                                className="p-1 hover:text-neutral-900 dark:hover:text-white text-neutral-400 transition-colors rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                title="Open Job Posting URL"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            <button
                              onClick={() => handleOpenEditModal(card)}
                              className="p-1 hover:text-neutral-900 dark:hover:text-white text-neutral-400 transition-colors rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                              title="Edit application details"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => onRemoveCard(card.id)}
                              className="p-1 hover:text-rose-600 text-neutral-400 transition-colors rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                              title="Delete from board"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Metadata: Salary & Location */}
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-neutral-600 dark:text-neutral-300">
                          {displaySalary && (
                            <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-medium border border-emerald-200/60 dark:border-emerald-800/60 tabular-nums">
                              {displaySalary}
                            </span>
                          )}
                          {card.job.location && (
                            <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 flex items-center gap-0.5 border border-neutral-200/60 dark:border-neutral-700/60">
                              <MapPin className="w-2.5 h-2.5 text-neutral-400" />
                              <span className="truncate max-w-[110px]">{card.job.location}</span>
                            </span>
                          )}
                        </div>

                        {/* Tag Chips */}
                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200/50 dark:border-neutral-700/50"
                              >
                                #{tag}
                              </span>
                            ))}
                            {tags.length > 3 && (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                                +{tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Notes snippet */}
                        {card.notes && (
                          <p className="text-[10px] text-neutral-600 dark:text-neutral-400 italic line-clamp-2 bg-neutral-50 dark:bg-neutral-900/60 p-1.5 rounded border border-neutral-200/60 dark:border-neutral-800/60 font-mono">
                            "{card.notes}"
                          </p>
                        )}

                        {/* Quick 3-Day Follow-Up Script for Outreach Sent */}
                        {card.status === 'OUTREACH_SENT' && (
                          <div className="p-2.5 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-lg space-y-1.5">
                            <div className="flex items-center justify-between text-[9px] font-mono text-amber-800 dark:text-amber-400">
                              <span className="flex items-center gap-1.5 font-semibold">
                                <Clock className="w-2.5 h-2.5" /> 3-Day Follow-Up
                              </span>
                            </div>
                            <button
                              onClick={() => handleCopyFollowUp(card)}
                              className="w-full py-1 text-[10px] font-mono font-semibold bg-white dark:bg-amber-900/40 hover:bg-neutral-50 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-700/50 rounded transition-colors"
                            >
                              {followUpCopiedId === card.id ? 'Copied script!' : 'Copy follow-up script'}
                            </button>
                          </div>
                        )}

                        {/* 1-Click Launch Founder Pitch */}
                        {(card.status === 'TAILORED' || (card.job.founderEmail && card.status === 'DISCOVERED')) && (
                          <button
                            onClick={() => onOpenOutreachForCard(card.job)}
                            className="w-full py-1.5 text-[10px] font-mono font-semibold bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-[#EBF946] dark:text-black dark:hover:bg-[#d4e23f] rounded flex items-center justify-center gap-1 transition-colors shadow-xs"
                          >
                            <Send className="w-2.5 h-2.5" /> Launch Founder Pitch
                          </button>
                        )}

                        {/* Stage Progression Buttons */}
                        <div className="flex items-center justify-between pt-1.5 border-t border-neutral-100 dark:border-neutral-800 text-[10px] font-mono">
                          {prevStatus ? (
                            <button
                              onClick={() => onUpdateCardStatus(card.id, prevStatus)}
                              className="px-2 py-0.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center gap-0.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
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
                              className="px-2 py-0.5 text-neutral-800 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white font-medium flex items-center gap-0.5 ml-auto rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
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

      {/* 4. MODAL: + Add Custom Job */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#121316] border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5 text-neutral-900 dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                <h3 className="font-semibold text-sm text-neutral-900 dark:text-white">Add Custom Job Application</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomJob} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-600 dark:text-neutral-400">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={newJobForm.company}
                    onChange={(e) => setNewJobForm({ ...newJobForm, company: e.target.value })}
                    placeholder="e.g. Zepto, Sarvam AI"
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-white rounded-lg px-3 py-2 text-neutral-900 dark:text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-600 dark:text-neutral-400">Position / Title *</label>
                  <input
                    type="text"
                    required
                    value={newJobForm.title}
                    onChange={(e) => setNewJobForm({ ...newJobForm, title: e.target.value })}
                    placeholder="e.g. Founding Fullstack Engineer"
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-white rounded-lg px-3 py-2 text-neutral-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-600 dark:text-neutral-400">Location</label>
                  <input
                    type="text"
                    value={newJobForm.location}
                    onChange={(e) => setNewJobForm({ ...newJobForm, location: e.target.value })}
                    placeholder="e.g. Bangalore (HSR Layout) / Remote"
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-white rounded-lg px-3 py-2 text-neutral-900 dark:text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-600 dark:text-neutral-400">Salary / CTC</label>
                  <input
                    type="text"
                    value={newJobForm.salary}
                    onChange={(e) => setNewJobForm({ ...newJobForm, salary: e.target.value })}
                    placeholder="e.g. ₹28–40 LPA"
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-white rounded-lg px-3 py-2 text-neutral-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-600 dark:text-neutral-400">Job URL / Application Link</label>
                <input
                  type="url"
                  value={newJobForm.jobUrl}
                  onChange={(e) => setNewJobForm({ ...newJobForm, jobUrl: e.target.value })}
                  placeholder="https://company.careers/..."
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-white rounded-lg px-3 py-2 text-neutral-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-600 dark:text-neutral-400">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={newJobForm.tags}
                    onChange={(e) => setNewJobForm({ ...newJobForm, tags: e.target.value })}
                    placeholder="React, Next.js, Seed"
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-white rounded-lg px-3 py-2 text-neutral-900 dark:text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-600 dark:text-neutral-400">Initial Pipeline Stage</label>
                  <select
                    value={newJobForm.status}
                    onChange={(e) => setNewJobForm({ ...newJobForm, status: e.target.value as KanbanStatus })}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-white rounded-lg px-3 py-2 text-neutral-900 dark:text-white outline-none"
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
                  <label className="text-neutral-600 dark:text-neutral-400">Founder Name (Optional)</label>
                  <input
                    type="text"
                    value={newJobForm.founderName}
                    onChange={(e) => setNewJobForm({ ...newJobForm, founderName: e.target.value })}
                    placeholder="e.g. Aadit Palicha"
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-white rounded-lg px-3 py-2 text-neutral-900 dark:text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-600 dark:text-neutral-400">Founder Email (Optional)</label>
                  <input
                    type="email"
                    value={newJobForm.founderEmail}
                    onChange={(e) => setNewJobForm({ ...newJobForm, founderEmail: e.target.value })}
                    placeholder="aadit@zeptonow.com"
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-white rounded-lg px-3 py-2 text-neutral-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-600 dark:text-neutral-400">Personal Notes / Next Steps</label>
                <textarea
                  rows={3}
                  value={newJobForm.notes}
                  onChange={(e) => setNewJobForm({ ...newJobForm, notes: e.target.value })}
                  placeholder="Referred by Rahul on Twitter. Need to follow up on Friday..."
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-white rounded-lg px-3 py-2 text-neutral-900 dark:text-white outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-[#EBF946] dark:text-black dark:hover:bg-[#d4e23f] font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Add to Pipeline</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: Edit Application Card */}
      {editingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#121316] border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5 text-neutral-900 dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                <h3 className="font-semibold text-sm text-neutral-900 dark:text-white">Edit Job Application</h3>
              </div>
              <button
                onClick={() => setEditingCard(null)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-white p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditCard} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-600 dark:text-neutral-400">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.company}
                    onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-white rounded-lg px-3 py-2 text-neutral-900 dark:text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-600 dark:text-neutral-400">Position / Title *</label>
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-white rounded-lg px-3 py-2 text-neutral-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-600 dark:text-neutral-400">Location</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-white rounded-lg px-3 py-2 text-neutral-900 dark:text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-600 dark:text-neutral-400">Salary / CTC</label>
                  <input
                    type="text"
                    value={editForm.salary}
                    onChange={(e) => setEditForm({ ...editForm, salary: e.target.value })}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-white rounded-lg px-3 py-2 text-neutral-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-600 dark:text-neutral-400">Job URL</label>
                <input
                  type="url"
                  value={editForm.jobUrl}
                  onChange={(e) => setEditForm({ ...editForm, jobUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-white rounded-lg px-3 py-2 text-neutral-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-600 dark:text-neutral-400">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={editForm.tags}
                    onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-white rounded-lg px-3 py-2 text-neutral-900 dark:text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-600 dark:text-neutral-400">Pipeline Stage</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as KanbanStatus })}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-white rounded-lg px-3 py-2 text-neutral-900 dark:text-white outline-none"
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
                  <label className="text-neutral-600 dark:text-neutral-400">Founder Name</label>
                  <input
                    type="text"
                    value={editForm.founderName}
                    onChange={(e) => setEditForm({ ...editForm, founderName: e.target.value })}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-white rounded-lg px-3 py-2 text-neutral-900 dark:text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-neutral-600 dark:text-neutral-400">Founder Email</label>
                  <input
                    type="email"
                    value={editForm.founderEmail}
                    onChange={(e) => setEditForm({ ...editForm, founderEmail: e.target.value })}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-white rounded-lg px-3 py-2 text-neutral-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-600 dark:text-neutral-400">Personal Notes / Context</label>
                <textarea
                  rows={3}
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-white rounded-lg px-3 py-2 text-neutral-900 dark:text-white outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingCard(null)}
                  className="px-4 py-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-[#EBF946] dark:text-black dark:hover:bg-[#d4e23f] font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
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
