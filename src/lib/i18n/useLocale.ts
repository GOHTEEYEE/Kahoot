"use client";

import { useCallback, useEffect, useState } from "react";
import type { AppLocale } from "./locale";
import { getLocale, saveLocale } from "../storage";

export function useLocale() {
  const [locale, setLocaleState] = useState<AppLocale>(() =>
    typeof window === "undefined" ? "zh" : getLocale(),
  );

  useEffect(() => {
    setLocaleState(getLocale());
    const onLocale = (e: Event) => {
      const detail = (e as CustomEvent<AppLocale>).detail;
      if (detail === "en" || detail === "zh" || detail === "ms") {
        setLocaleState(detail);
      } else {
        setLocaleState(getLocale());
      }
    };
    window.addEventListener("matharena:locale", onLocale);
    window.addEventListener("storage", onLocale);
    return () => {
      window.removeEventListener("matharena:locale", onLocale);
      window.removeEventListener("storage", onLocale);
    };
  }, []);

  const setLocale = useCallback((next: AppLocale) => {
    saveLocale(next);
    setLocaleState(next);
  }, []);

  return { locale, setLocale };
}
