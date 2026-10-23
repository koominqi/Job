import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { messages } from './messages';
import { contentMessages } from './content';
import { guidanceMessages } from './guidance';

export type Language = 'en' | 'ms' | 'zh-CN';
export const languages = [{ value: 'en', label: 'English' }, { value: 'ms', label: 'Bahasa Malaysia' }, { value: 'zh-CN', label: '简体中文' }] as const;
const locales = { en: 'en-MY', ms: 'ms-MY', 'zh-CN': 'zh-CN' } as const;
const dictionary = { ...messages, ...contentMessages, ...guidanceMessages };
export function translate(language: Language, key: string, params: Record<string, string | number> = {}) {
  const translated = language === 'en' ? key : dictionary[key]?.[language === 'ms' ? 0 : 1] ?? key;
  return translated.replace(/\{(\w+)\}/g, (match, name: string) => String(params[name] ?? match));
}
function initialLanguage(): Language {
  try {
    const saved = localStorage.getItem('fp.language');
    if (saved === 'en' || saved === 'ms' || saved === 'zh-CN') return saved;
  } catch { /* Private browsing may disable persistent preferences. */ }
  return 'en';
}
type LanguageContext = {
  language: Language;
  setLanguage: (value: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  date: (value: string, dateOnly?: boolean) => string;
};
const Context = createContext<LanguageContext | null>(null);
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const t = useCallback((key: string, params?: Record<string, string | number>) => translate(language, key, params), [language]);
  useEffect(() => {
    document.documentElement.lang = language;
    try { localStorage.setItem('fp.language', language); } catch { /* Switching still works for the current session. */ }
  }, [language]);
  const date = useCallback((value: string, dateOnly = false) => {
    const parsed = new Date(value);
    if (Number.isNaN(+parsed)) return t('Not available');
    // Calendar-only source dates must not move to the previous day in western time zones.
    return new Intl.DateTimeFormat(locales[language], dateOnly ? { dateStyle: 'long', timeZone: 'UTC' } : { dateStyle: 'medium', timeStyle: 'short' }).format(parsed);
  }, [language, t]);
  const context = useMemo(() => ({ language, setLanguage, t, date }), [language, t, date]);
  return <Context.Provider value={context}>{children}</Context.Provider>;
}
export function useLanguage() {
  const value = useContext(Context);
  if (!value) throw new Error('useLanguage requires LanguageProvider');
  return value;
}
