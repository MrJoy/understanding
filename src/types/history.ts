export type Language = 'en' | 'ja';

export interface TranslationHistoryEntry {
  id: string;
  timestamp: number;
  sourceText: string;
  translatedText: string;
  sourceLang: Language;
  targetLang: Language;
}

export interface TranslationHistory {
  entries: TranslationHistoryEntry[];
  maxEntries: number;
  version: number;
}

export const HISTORY_STORAGE_KEY = 'translation-history';
export const HISTORY_VERSION = 1;
export const DEFAULT_MAX_ENTRIES = 100;
