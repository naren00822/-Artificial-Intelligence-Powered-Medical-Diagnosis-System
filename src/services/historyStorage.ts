import { DiagnosisResult, SavedAssessment } from '../types';

const STORAGE_KEY = 'med_ai_clinical_assessment_history_v1';
const MAX_HISTORY_ITEMS = 30;

function formatReadableDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'Recently';
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'Recently';
  }
}

/**
 * Retrieves all saved assessments from localStorage, ordered by latest saved first.
 */
export function getAssessmentHistory(): SavedAssessment[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Validate items have expected structure
      return parsed.filter(item => item && item.id && item.result && item.result.primaryDiagnosis);
    }
    return [];
  } catch (err) {
    console.error('Failed to load assessment history from localStorage:', err);
    return [];
  }
}

/**
 * Saves a new assessment or updates an existing one if ID matches.
 * Caps storage to the most recent MAX_HISTORY_ITEMS.
 */
export function saveAssessmentToHistory(
  result: DiagnosisResult,
  customLabel?: string,
  notes?: string
): SavedAssessment[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }

  try {
    const history = getAssessmentHistory();
    const now = new Date().toISOString();
    const existingIndex = history.findIndex(item => item.id === result.id);

    const newRecord: SavedAssessment = {
      id: result.id,
      savedAt: now,
      formattedDate: formatReadableDate(now),
      customLabel: customLabel !== undefined 
        ? customLabel 
        : (existingIndex >= 0 ? history[existingIndex].customLabel : undefined),
      notes: notes !== undefined 
        ? notes 
        : (existingIndex >= 0 ? history[existingIndex].notes : undefined),
      result: { ...result }
    };

    let updated: SavedAssessment[];
    if (existingIndex >= 0) {
      // Replace existing entry and keep position or bring to top
      updated = [
        newRecord,
        ...history.filter((_, idx) => idx !== existingIndex)
      ];
    } else {
      updated = [newRecord, ...history];
    }

    // Limit maximum records
    if (updated.length > MAX_HISTORY_ITEMS) {
      updated = updated.slice(0, MAX_HISTORY_ITEMS);
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save assessment to localStorage:', err);
    return getAssessmentHistory();
  }
}

/**
 * Updates a custom label or clinical note on an existing saved assessment.
 */
export function updateAssessmentMetadata(
  id: string,
  customLabel?: string,
  notes?: string
): SavedAssessment[] {
  if (typeof window === 'undefined' || !window.localStorage) return [];

  try {
    const history = getAssessmentHistory();
    const updated = history.map(item => {
      if (item.id === id) {
        return {
          ...item,
          customLabel: customLabel !== undefined ? customLabel : item.customLabel,
          notes: notes !== undefined ? notes : item.notes
        };
      }
      return item;
    });

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to update assessment metadata:', err);
    return getAssessmentHistory();
  }
}

/**
 * Deletes a single assessment by ID.
 */
export function deleteAssessmentFromHistory(id: string): SavedAssessment[] {
  if (typeof window === 'undefined' || !window.localStorage) return [];

  try {
    const history = getAssessmentHistory();
    const filtered = history.filter(item => item.id !== id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (err) {
    console.error('Failed to delete assessment from localStorage:', err);
    return getAssessmentHistory();
  }
}

/**
 * Clears all saved assessment records.
 */
export function clearAllAssessmentHistory(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear assessment history:', err);
  }
}

/**
 * Exports history records as a formatted JSON string for backup/export.
 */
export function exportHistoryAsJSON(): string {
  const history = getAssessmentHistory();
  return JSON.stringify({
    exportedAt: new Date().toISOString(),
    appName: 'Clinical Medical Diagnosis System',
    totalAssessments: history.length,
    records: history
  }, null, 2);
}

/**
 * Imports history records from a JSON file string.
 */
export function importHistoryFromJSON(jsonString: string): { success: boolean; count?: number; error?: string } {
  try {
    const data = JSON.parse(jsonString);
    const records = Array.isArray(data) ? data : (Array.isArray(data?.records) ? data.records : null);

    if (!records || !Array.isArray(records)) {
      return { success: false, error: 'Invalid file format. Expected an array or records export.' };
    }

    const currentHistory = getAssessmentHistory();
    const existingIds = new Set(currentHistory.map(r => r.id));

    const validNewRecords: SavedAssessment[] = [];
    for (const r of records) {
      if (r && r.id && r.result && r.result.primaryDiagnosis) {
        if (!existingIds.has(r.id)) {
          validNewRecords.push({
            id: r.id,
            savedAt: r.savedAt || new Date().toISOString(),
            formattedDate: r.formattedDate || formatReadableDate(r.savedAt || new Date().toISOString()),
            customLabel: r.customLabel,
            notes: r.notes,
            result: r.result
          });
        }
      }
    }

    const combined = [...validNewRecords, ...currentHistory].slice(0, MAX_HISTORY_ITEMS);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(combined));
    }

    return { success: true, count: validNewRecords.length };
  } catch (err) {
    return { success: false, error: (err as Error).message || 'Failed to parse JSON file' };
  }
}
