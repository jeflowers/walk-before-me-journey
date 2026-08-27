import { useState, useCallback } from 'react';

export type TimeFormat = '12h' | '24h';

const STORAGE_KEY = 'wbmj-time-format';

function getStored(): TimeFormat {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    if (val === '24h') return '24h';
  } catch { /* ignore */ }
  return '12h';
}

export function useTimeFormat() {
  const [format, setFormatState] = useState<TimeFormat>(getStored);

  const setFormat = useCallback((f: TimeFormat) => {
    setFormatState(f);
    try { localStorage.setItem(STORAGE_KEY, f); } catch { /* ignore */ }
  }, []);

  const toggle = useCallback(() => {
    setFormat(getStored() === '12h' ? '24h' : '12h');
  }, [setFormat]);

  return { format, setFormat, toggle };
}
