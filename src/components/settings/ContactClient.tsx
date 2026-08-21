"use client";

import { SETTINGS_I18N } from "../../lib/i18n/settings";
import { useLocale } from "../../lib/i18n/useLocale";
import { SettingsSubpageShell } from "./SettingsClient";

export function ContactClient() {
  const { locale } = useLocale();
  const copy = SETTINGS_I18N[locale];

  return (
    <SettingsSubpageShell title={copy.contact}>
      <div className="flex min-h-[42vh] flex-col items-center justify-center px-4 text-center">
        <span className="text-4xl" aria-hidden>
          💬
        </span>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-xl font-bold text-[#3d2f1e]">
          {copy.contact}
        </h2>
        <p className="mt-3 max-w-[16rem] text-[13px] font-bold leading-relaxed text-[#6b5340]">
          {copy.contactBody}
        </p>
        <p className="mt-4 rounded-full bg-[#efe4c8] px-4 py-2 text-[12px] font-extrabold text-[#8a5a18]">
          {copy.contactSoon}
        </p>
      </div>
    </SettingsSubpageShell>
  );
}
