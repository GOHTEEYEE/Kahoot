"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { playSfx } from "../../lib/audio/sfx";
import { getSharedLabels } from "../../lib/i18n/labels";
import { useLocale } from "../../lib/i18n/useLocale";

type Props = {
  title: string;
  subtitle?: string;
  backHref?: string;
  children: ReactNode;
};

export function ChallengeShell({ title, subtitle, backHref = "/challenge", children }: Props) {
  const { locale } = useLocale();
  const labels = getSharedLabels(locale);
  return (
    <div className="relative mx-auto flex min-h-full w-full max-w-[430px] flex-1 flex-col px-3 pb-8 pt-3 sm:max-w-lg">
      <header className="mb-3 flex items-center gap-2">
        <Link
          href={backHref}
          onClick={() => playSfx("tap")}
          className="hud-icon-btn flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg font-black text-[#3d2f1e]"
          aria-label={labels.back}
        >
          ‹
        </Link>
        <div className="min-w-0">
          <h1 className="font-[family-name:var(--font-display)] text-[22px] font-bold leading-tight text-[#2a2118]">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-[11px] font-extrabold tracking-wide text-[#8a5a18]">{subtitle}</p>
          ) : null}
        </div>
      </header>
      {children}
    </div>
  );
}
