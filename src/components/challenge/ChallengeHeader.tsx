"use client";

import Link from "next/link";
import type { ChallengeCopy } from "../../lib/i18n/challenge";
import { playSfx } from "../../lib/audio/sfx";
import { UtilityIcon } from "../icons/UtilityIcon";

type Props = {
  copy: ChallengeCopy;
  backHref?: string;
};

export function ChallengeHeader({ copy, backHref = "/" }: Props) {
  return (
    <header className="challenge-header relative shrink-0 pt-1">
      <Link
        href={backHref}
        onClick={() => playSfx("tap")}
        className="challenge-back-btn absolute left-0 top-1 z-10 flex h-[52px] w-[52px] items-center justify-center rounded-full"
        aria-label={copy.backLabel}
      >
        <UtilityIcon name="arrow-left" className="h-6 w-6" />
      </Link>

      <div className="px-14 text-center">
        <h1 className="challenge-title font-[family-name:var(--font-display)] text-[clamp(1.45rem,5.6vw,1.85rem)] font-bold leading-[1.12] tracking-tight">
          {copy.pageTitle}
        </h1>
        <p className="challenge-subtitle mt-1.5 text-[clamp(0.58rem,2.4vw,0.68rem)] font-extrabold uppercase tracking-[0.14em]">
          {copy.pageSubtitle}
        </p>
        <div className="challenge-ornament mx-auto mt-2" aria-hidden>
          <span className="challenge-ornament-line" />
          <span className="challenge-ornament-gem" />
          <span className="challenge-ornament-line" />
        </div>
      </div>
    </header>
  );
}
