'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Locale, PatternTranslation } from '@/lib/i18n';
import {
  DEFAULT_LOCALE,
  t,
  tBranch,
  tBrightness,
  tPalace,
  tPattern,
  tSiHua,
  tStar,
  tStem,
  tWuxingJu,
} from '@/lib/i18n';

export interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggle: () => void;
  t: (key: string, overrideLocale?: Locale) => string;
  tStar: (name: string, overrideLocale?: Locale) => string;
  tPalace: (name: string, overrideLocale?: Locale) => string;
  tStem: (stem: string | number, overrideLocale?: Locale) => string;
  tBranch: (branch: string | number, overrideLocale?: Locale) => string;
  tBrightness: (brightness?: string, overrideLocale?: Locale) => string;
  tSiHua: (sihua: string, overrideLocale?: Locale) => string;
  tWuxingJu: (ju: string | number, overrideLocale?: Locale) => string;
  tPattern: (patternName: string, overrideLocale?: Locale) => PatternTranslation;
}

const defaultContextValue: LanguageContextType = {
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  toggle: () => {},
  t: (k, loc) => t(k, loc ?? DEFAULT_LOCALE),
  tStar: (n, loc) => tStar(n, loc ?? DEFAULT_LOCALE),
  tPalace: (n, loc) => tPalace(n, loc ?? DEFAULT_LOCALE),
  tStem: (s, loc) => tStem(s, loc ?? DEFAULT_LOCALE),
  tBranch: (b, loc) => tBranch(b, loc ?? DEFAULT_LOCALE),
  tBrightness: (b, loc) => tBrightness(b, loc ?? DEFAULT_LOCALE),
  tSiHua: (s, loc) => tSiHua(s, loc ?? DEFAULT_LOCALE),
  tWuxingJu: (j, loc) => tWuxingJu(j, loc ?? DEFAULT_LOCALE),
  tPattern: (p, loc) => tPattern(p, loc ?? DEFAULT_LOCALE),
};

const LanguageContext = createContext<LanguageContextType>(defaultContextValue);

function getInitialLocale(): Locale {
  if (typeof document !== 'undefined') {
    const attr = document.documentElement.getAttribute('data-lang');
    if (attr === 'vi' || attr === 'zh') return attr;
    try {
      const saved = localStorage.getItem('ziwei-lang');
      if (saved === 'vi' || saved === 'zh') return saved;
    } catch {
      // localStorage may fail in restricted/sandboxed contexts
    }
  }
  return DEFAULT_LOCALE;
}

export function LanguageProvider({
  children,
  defaultLocale = DEFAULT_LOCALE,
}: {
  children: React.ReactNode;
  defaultLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof document !== 'undefined') {
      const initial = getInitialLocale();
      if (initial) return initial;
    }
    return defaultLocale;
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('ziwei-lang') as Locale | null;
      if (saved === 'vi' || saved === 'zh') {
        setLocaleState(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      const root = document.documentElement;
      root.setAttribute('data-lang', locale);
      root.setAttribute('lang', locale === 'zh' ? 'zh-CN' : 'vi');
      localStorage.setItem('ziwei-lang', locale);
    } catch {
      // ignore
    }
  }, [locale, mounted]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
  }, []);

  const toggle = useCallback(() => {
    setLocaleState((prev) => (prev === 'vi' ? 'zh' : 'vi'));
  }, []);

  const value = useMemo<LanguageContextType>(() => ({
    locale,
    setLocale,
    toggle,
    t: (key, override) => t(key, override ?? locale),
    tStar: (name, override) => tStar(name, override ?? locale),
    tPalace: (name, override) => tPalace(name, override ?? locale),
    tStem: (stem, override) => tStem(stem, override ?? locale),
    tBranch: (branch, override) => tBranch(branch, override ?? locale),
    tBrightness: (brightness, override) => tBrightness(brightness, override ?? locale),
    tSiHua: (sihua, override) => tSiHua(sihua, override ?? locale),
    tWuxingJu: (ju, override) => tWuxingJu(ju, override ?? locale),
    tPattern: (pattern, override) => tPattern(pattern, override ?? locale),
  }), [locale, setLocale, toggle]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  return useContext(LanguageContext);
}

export default LanguageProvider;
