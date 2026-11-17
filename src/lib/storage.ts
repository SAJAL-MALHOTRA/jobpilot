import type { CandidateProfile, ApplicationCard, KanbanStatus } from '../types';

export const STORAGE_VERSION = '1.0';
export const STORAGE_KEYS = {
  VERSION: 'jobpilot_storage_version',
  CANDIDATE: 'jobpilot_candidate',
  CARDS: 'jobpilot_cards',
  APPLIED_IDS: 'jobpilot_applied_ids',
  BACKUP_CARDS: 'jobpilot_cards_backup',
} as const;

const VALID_STATUSES: Set<KanbanStatus> = new Set([
  'DISCOVERED',
  'TAILORED',
  'OUTREACH_SENT',
  'INTERVIEW_SCHEDULED',
  'OFFER',
  'REJECTED',
]);

export function isValidCandidate(obj: unknown): obj is CandidateProfile {
  if (!obj || typeof obj !== 'object') return false;
  const c = obj as Partial<CandidateProfile>;
  return (
    typeof c.id === 'string' &&
    typeof c.fullName === 'string' &&
    c.fullName.trim().length > 0 &&
    typeof c.email === 'string' &&
    Array.isArray(c.primarySkills) &&
    Array.isArray(c.resumeBullets)
  );
}

export function isValidCard(obj: unknown): obj is ApplicationCard {
  if (!obj || typeof obj !== 'object') return false;
  const card = obj as Partial<ApplicationCard>;
  if (typeof card.id !== 'string' || !card.id.trim()) return false;
  if (!card.status || !VALID_STATUSES.has(card.status)) return false;
  if (!card.job || typeof card.job !== 'object') return false;
  const job = card.job;
  return (
    typeof job.id === 'string' &&
    typeof job.company === 'string' &&
    typeof job.title === 'string'
  );
}

export function isValidCardList(arr: unknown): arr is ApplicationCard[] {
  if (!Array.isArray(arr)) return false;
  return arr.every(isValidCard);
}

export function isValidIdList(arr: unknown): arr is string[] {
  if (!Array.isArray(arr)) return false;
  return arr.every((item) => typeof item === 'string');
}

export function loadCandidate(fallback: CandidateProfile): CandidateProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CANDIDATE);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (isValidCandidate(parsed)) {
      return parsed;
    }
    console.warn('[JobPilot Storage] Corrupted candidate shape in localStorage, using default profile.');
    return fallback;
  } catch (err) {
    console.warn('[JobPilot Storage] Failed to read candidate from localStorage:', err);
    return fallback;
  }
}

export function loadCards(fallback: ApplicationCard[]): ApplicationCard[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CARDS);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (isValidCardList(parsed)) {
      return parsed;
    }
    // Attempt recovery from backup
    const backupRaw = localStorage.getItem(STORAGE_KEYS.BACKUP_CARDS);
    if (backupRaw) {
      const backupParsed = JSON.parse(backupRaw);
      if (isValidCardList(backupParsed)) {
        console.warn('[JobPilot Storage] Restored cards from backup after detecting invalid shape.');
        return backupParsed;
      }
    }
    console.warn('[JobPilot Storage] Corrupted cards array in localStorage, falling back to default cards.');
    return fallback;
  } catch (err) {
    console.warn('[JobPilot Storage] Failed to parse cards from localStorage:', err);
    return fallback;
  }
}

export function loadAppliedIds(fallback: string[]): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APPLIED_IDS);
    if (!raw) return new Set(fallback);
    const parsed = JSON.parse(raw);
    if (isValidIdList(parsed)) {
      return new Set(parsed);
    }
    return new Set(fallback);
  } catch (err) {
    console.warn('[JobPilot Storage] Failed to parse applied IDs:', err);
    return new Set(fallback);
  }
}

export interface StorageSaveResult {
  success: boolean;
  error?: string;
}

export function saveState(
  candidate: CandidateProfile,
  cards: ApplicationCard[],
  appliedJobIds: Set<string>
): StorageSaveResult {
  try {
    localStorage.setItem(STORAGE_KEYS.VERSION, STORAGE_VERSION);
    localStorage.setItem(STORAGE_KEYS.CANDIDATE, JSON.stringify(candidate));
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
    localStorage.setItem(STORAGE_KEYS.APPLIED_IDS, JSON.stringify(Array.from(appliedJobIds)));
    // Maintain a recovery backup of verified cards
    if (cards.length > 0) {
      localStorage.setItem(STORAGE_KEYS.BACKUP_CARDS, JSON.stringify(cards));
    }
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Storage quota exceeded or storage unavailable';
    console.error('[JobPilot Storage] Persistence write failure:', message);
    return { success: false, error: message };
  }
}
