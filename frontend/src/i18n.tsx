/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { en, fr, rw, type TranslationKey } from "./translations";

export type Lang = "en" | "fr" | "rw";
export type { TranslationKey };

const translations: Record<Lang, Record<TranslationKey, string>> = {
  en,
  fr,
  rw,
};

type I18nContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const LANG_STORAGE_KEY = "tembera_lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === "fr" || saved === "rw" || saved === "en") return saved;
    return "rw";
  });

  const setLang = (next: Lang) => {
    window.localStorage.setItem(LANG_STORAGE_KEY, next);
    setLangState(next);
  };

  const value = useMemo<I18nContextValue>(
    () => ({
      lang,
      setLang,
      t: (key: TranslationKey) => translations[lang][key] ?? key,
    }),
    [lang],
  );

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
