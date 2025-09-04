'use client';

import { useState, useEffect, useCallback } from 'react';
import { TranslationHistory, Language } from '@/types/history';
import {
  loadHistory,
  saveHistory,
  addHistoryEntry,
  removeHistoryEntry,
  clearHistory as clearHistoryUtil,
} from '@/utils/history';

export function useHistory() {
  const [history, setHistory] = useState<TranslationHistory | null>(null);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  useEffect(() => {
    if (history) {
      saveHistory(history);
    }
  }, [history]);

  const addEntry = useCallback(
    (sourceText: string, translatedText: string, sourceLang: Language, targetLang: Language) => {
      setHistory(current => {
        if (!current) return current;
        return addHistoryEntry(current, sourceText, translatedText, sourceLang, targetLang);
      });
    },
    []
  );

  const removeEntry = useCallback((entryId: string) => {
    setHistory(current => {
      if (!current) return current;
      return removeHistoryEntry(current, entryId);
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory(clearHistoryUtil());
  }, []);

  return {
    history,
    addEntry,
    removeEntry,
    clearHistory,
  };
}
