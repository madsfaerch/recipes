import { useState, useEffect, useCallback } from 'react';
import { type Locale, t, type TranslationKey } from './i18n';

export function useLocale() {
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window === 'undefined') return 'en';
    return (localStorage.getItem('locale') as Locale) || 'en';
  });

  useEffect(() => {
    const handler = (e: Event) => {
      setLocale((e as CustomEvent).detail as Locale);
    };
    window.addEventListener('locale-changed', handler);
    return () => window.removeEventListener('locale-changed', handler);
  }, []);

  const tt = useCallback((key: TranslationKey) => t(key, locale), [locale]);

  return { locale, t: tt };
}
