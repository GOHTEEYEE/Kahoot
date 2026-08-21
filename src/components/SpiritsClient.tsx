"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BottomNavigation } from "./home/BottomNavigation";
import { GameIcon } from "./home/GameIcon";
import { SubjectMascotIcon } from "./icons/SubjectMascotIcon";
import { SUBJECT_WORLDS } from "../lib/worlds";
import { getCurrentAccount, getSubjectStats } from "../lib/storage";
import { getPlayCopy } from "../lib/i18n/play";
import { getSharedLabels } from "../lib/i18n/labels";
import { localizedSubject } from "../lib/i18n/home";
import { useLocale } from "../lib/i18n/useLocale";

export function SpiritsClient() {
  const router = useRouter();
  const { locale } = useLocale();
  const play = getPlayCopy(locale);
  const labels = getSharedLabels(locale);
  const [ready, setReady] = useState(false);
  const [trophies, setTrophies] = useState<Record<string, number>>({});

  useEffect(() => {
    const account = getCurrentAccount();
    if (!account) {
      router.replace("/auth");
      return;
    }
    const map: Record<string, number> = {};
    SUBJECT_WORLDS.forEach((w) => {
      map[w.subject] = getSubjectStats(account, w.subject).trophies;
    });
    setTrophies(map);
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex flex-1 items-center justify-center text-[var(--ink-soft)]">{labels.loading}</div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pb-28 pt-6">
      <header className="mb-5 text-center">
        <p className="text-xs font-extrabold tracking-[0.2em] text-[var(--brand-deep)] uppercase">
          Spirits
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-bold">
          {play.spiritsTitle}
        </h1>
        <p className="mt-1 text-sm font-bold text-[var(--ink-soft)]">
          {play.spiritsHint}
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {SUBJECT_WORLDS.map((w) => (
          <div
            key={w.subject}
            className="rounded-[1.4rem] p-4 text-white shadow-[var(--shadow)]"
            style={{ background: `linear-gradient(145deg, ${w.accent}, #14352f)` }}
          >
            <SubjectMascotIcon subject={w.subject} className="h-12 w-12 object-contain" />
            <p className="mt-2 font-[family-name:var(--font-display)] text-lg font-bold">
              {w.mascotName}
            </p>
            <p className="text-xs font-bold text-white/80">{localizedSubject(w.subject, locale)}</p>
            <p className="mt-2 flex items-center gap-1 text-sm font-extrabold">
              <GameIcon name="trophy" size="utility" />
              {trophies[w.subject] ?? 0}
            </p>
          </div>
        ))}
      </div>
      <BottomNavigation />
    </div>
  );
}
