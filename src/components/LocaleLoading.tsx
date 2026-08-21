"use client";

import { getSharedLabels } from "../lib/i18n/labels";
import { useLocale } from "../lib/i18n/useLocale";

export function LocaleLoading({ className }: { className?: string }) {
  const { locale } = useLocale();
  return (
    <div className={className ?? "flex flex-1 items-center justify-center text-sm font-bold text-[#6b5340]"}>
      {getSharedLabels(locale).loading}
    </div>
  );
}
