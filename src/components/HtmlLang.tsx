"use client";

import { useEffect } from "react";
import { useLocale } from "../lib/i18n/useLocale";

export function HtmlLang() {
  const { locale } = useLocale();
  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : locale === "ms" ? "ms-MY" : "en";
  }, [locale]);
  return null;
}
