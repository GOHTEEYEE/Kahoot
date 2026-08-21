"use client";

import { APP_NAME, APP_TAGLINE_ZH, APP_VERSION } from "../../lib/appVersion";
import { SETTINGS_I18N } from "../../lib/i18n/settings";
import { useLocale } from "../../lib/i18n/useLocale";
import { SettingsSubpageShell } from "./SettingsClient";

/**
 * About OG EduWorld.
 * No official logo asset exists in the repo yet — wordmark only (no fake logo image).
 */
export function AboutClient() {
  const { locale } = useLocale();
  const copy = SETTINGS_I18N[locale];

  return (
    <SettingsSubpageShell title={copy.aboutTitle}>
      <div className="flex min-h-[48vh] flex-col items-center justify-center px-4 text-center">
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-[#3d2f1e]">
          {APP_NAME}
        </h2>
        <p className="mt-3 whitespace-pre-line text-[14px] font-bold leading-relaxed text-[#6b5340]">
          {APP_TAGLINE_ZH}
        </p>
        <p className="mt-5 text-[12px] font-extrabold text-[#8a5a18]">
          {copy.version} {APP_VERSION}
        </p>
        <p className="mt-1 text-[11px] font-bold text-[#b8a078]">© 2026 {APP_NAME}</p>
      </div>
    </SettingsSubpageShell>
  );
}
