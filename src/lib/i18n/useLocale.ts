"use client";

import { useCallback, useEffect, useState } from "react";
import type { AppLocale } from "./locale";
import { getLocale, saveLocale } from "../storage";

/** Must match SSR. Never read localStorage in the initializer — that caused
 *  server (zh) vs client (saved en/ms) hydration mismatches on loading copy. */
const SSR_LOCALE: AppLocale = "zh";

export function useLocale() {
  const [locale, setLocaleState] = useState<AppLocale>(SSR_LOCALE);

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
