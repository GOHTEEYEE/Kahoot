"use client";

import { useCallback, useEffect, useState } from "react";
import type { AppLocale } from "./locale";
import { getLocale, saveLocale } from "../storage";

export function useLocale() {
  const [locale, setLocaleState] = useState<AppLocale>("zh");

  useEffect(() => {
    setLocaleState(getLocale());
  }, []);

  const setLocale = useCallback((next: AppLocale) => {
    saveLocale(next);
    setLocaleState(next);
  }, []);

  return { locale, setLocale };
}
