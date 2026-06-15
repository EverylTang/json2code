"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { translations, Locale, Translation } from "@/lib/i18n/translations";

interface I18nContextType {
  locale: Locale;
  t: Translation;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  t: translations.en,
  setLocale: () => {},
});

function detectLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const nav = navigator.language || (navigator as any).languages?.[0] || "en";
  return nav.startsWith("zh") ? "zh" : "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    setLocale(detectLocale());
  }, []);

  const t = translations[locale];

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
