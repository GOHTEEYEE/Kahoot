"use client";

import { getHowToSections } from "../../lib/i18n/helpContent";
import { SETTINGS_I18N } from "../../lib/i18n/settings";
import { useLocale } from "../../lib/i18n/useLocale";
import { SettingsSubpageShell } from "./SettingsClient";

export function HowToPlayClient() {
  const { locale } = useLocale();
  const copy = SETTINGS_I18N[locale];
  const sections = getHowToSections(locale);

  return (
    <SettingsSubpageShell title={copy.howToPlay}>
      <div className="space-y-3">
        {sections.map((s, idx) => (
          <article
            key={s.title}
            className="rounded-[1.15rem] bg-white/70 px-3 py-3 ring-1 ring-[#e8c98a]/45"
          >
            <h3 className="font-[family-name:var(--font-display)] text-[15px] font-bold text-[#3d2f1e]">
              {idx + 1}. {s.title}
            </h3>
            <p className="mt-1.5 text-[12px] font-bold leading-relaxed text-[#6b5340]">{s.body}</p>
          </article>
        ))}
      </div>
    </SettingsSubpageShell>
  );
}
