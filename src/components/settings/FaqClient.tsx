"use client";

import { useState } from "react";
import { getFaqItems } from "../../lib/i18n/helpContent";
import { SETTINGS_I18N } from "../../lib/i18n/settings";
import { useLocale } from "../../lib/i18n/useLocale";
import { playSfx } from "../../lib/audio/sfx";
import { SettingsSubpageShell } from "./SettingsClient";

export function FaqClient() {
  const { locale } = useLocale();
  const copy = SETTINGS_I18N[locale];
  const items = getFaqItems(locale);
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <SettingsSubpageShell title={copy.faq}>
      <ul className="space-y-2">
        {items.map((item, i) => {
          const open = openId === i;
          return (
            <li key={item.q} className="overflow-hidden rounded-[1.1rem] bg-white/70 ring-1 ring-[#e8c98a]/45">
              <button
                type="button"
                aria-expanded={open}
                onClick={() => {
                  playSfx("tap");
                  setOpenId(open ? null : i);
                }}
                className="flex min-h-[48px] w-full items-center justify-between gap-2 px-3 py-3 text-left"
              >
                <span className="text-[13px] font-extrabold text-[#3d2f1e]">{item.q}</span>
                <span className="text-sm font-black text-[#8a5a18]" aria-hidden>
                  {open ? "−" : "+"}
                </span>
              </button>
              {open ? (
                <p className="border-t border-[#e8c98a]/35 px-3 py-3 text-[12px] font-bold leading-relaxed text-[#6b5340]">
                  {item.a}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </SettingsSubpageShell>
  );
}
