import {
  TranslationHistory,
  TranslationHistoryEntry,
  Language,
  HISTORY_STORAGE_KEY,
  HISTORY_VERSION,
  DEFAULT_MAX_ENTRIES,
} from '@/types/history';

export function loadHistory(): TranslationHistory {
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!stored) {
      return createEmptyHistory();
    }

    const history = JSON.parse(stored) as TranslationHistory;

    if (history.version !== HISTORY_VERSION) {
      console.warn('History version mismatch, creating new history');
      return createEmptyHistory();
    }

    return history;
  } catch (error) {
    console.error('Failed to load history:', error);
    return createEmptyHistory();
  }
}

export function saveHistory(history: TranslationHistory): void {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save history:', error);
  }
}

export function addHistoryEntry(
  history: TranslationHistory,
  sourceText: string,
  translatedText: string,
  sourceLang: Language,
  targetLang: Language
): TranslationHistory {
  const entry: TranslationHistoryEntry = {
    id: generateId(),
    timestamp: Date.now(),
    sourceText,
    translatedText,
    sourceLang,
    targetLang,
  };

  const newEntries = [entry, ...history.entries];

  if (newEntries.length > history.maxEntries) {
    newEntries.length = history.maxEntries;
  }

  return {
    ...history,
    entries: newEntries,
  };
}

export function removeHistoryEntry(history: TranslationHistory, entryId: string): TranslationHistory {
  return {
    ...history,
    entries: history.entries.filter(entry => entry.id !== entryId),
  };
}

export function clearHistory(): TranslationHistory {
  const emptyHistory = createEmptyHistory();
  saveHistory(emptyHistory);
  return emptyHistory;
}

function createEmptyHistory(): TranslationHistory {
  return {
    entries: [],
    maxEntries: DEFAULT_MAX_ENTRIES,
    version: HISTORY_VERSION,
  };
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
