"use client";

import { motion } from "framer-motion";
import { MasteryRadar } from "./MasteryRadar";
import { SubjectMascotIcon } from "../icons/SubjectMascotIcon";
import type { ProfileSnapshot, SubjectProgressRow } from "../../lib/profile";
import { playSfx } from "../../lib/audio/sfx";
import { localizedSubject } from "../../lib/i18n/home";
import { getProfileCopy } from "../../lib/i18n/profile";
import { useLocale } from "../../lib/i18n/useLocale";

type Props = {
  profile: ProfileSnapshot;
  onSubject: (row: SubjectProgressRow) => void;
  onSubjectDetails: () => void;
};

export function LearningHero({ profile, onSubject, onSubjectDetails }: Props) {
  const { locale } = useLocale();
  const copy = getProfileCopy(locale);
  const strongest = profile.strongest;
  const next = profile.nextBreakthrough;

  return (
    <section className="mastery-plate relative mt-3 overflow-hidden rounded-[1.5rem] px-3 pb-3 pt-3 ring-1 ring-[#ffe7b4]/90">
      <div className="text-center">
        <h3 className="font-[family-name:var(--font-display)] text-[17px] font-bold text-[#3d2f1e]">
          {copy.heroesTitle}
        </h3>
        <p className="text-[10px] font-extrabold tracking-wide text-[#8a5a18]">{copy.heroesSubtitle}</p>
      </div>

      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="mx-auto w-full max-w-[15.5rem] shrink-0 sm:mx-0">
          <MasteryRadar values={profile.mastery} />
        </div>

        <ul className="min-w-0 flex-1 space-y-1.5">
          {profile.subjects.map((row) => {
            const name = localizedSubject(row.id, locale);
            return (
              <li key={row.id}>
                <button
                  type="button"
                  onClick={() => {
                    playSfx("tap");
                    onSubject(row);
                  }}
                  className="flex w-full items-center gap-2 rounded-[0.95rem] bg-[#fff8ea]/75 px-2 py-1.5 text-left ring-1 ring-[#e8c98a]/45 transition active:scale-[0.99]"
                  aria-label={copy.openArena(name)}
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/80 ring-1 ring-[#e8c98a]/60">
                    <SubjectMascotIcon subject={row.id} className="h-7 w-7 object-contain" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[12px] font-extrabold text-[#3d2f1e]">{name}</span>
                      <span className="shrink-0 text-[10px] font-bold tabular-nums text-[#8a5a18]">
                        Lv.{row.level} · {row.mastery}%
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#3c3425]/12">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-[#65c84a] to-[#b8f070]"
                        initial={{ width: 0 }}
                        animate={{ width: `${row.mastery}%` }}
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-[1.1rem] bg-[#fff8ea]/8 px-3 py-2 ring-1 ring-[#e8c98a]/50">
          <p className="text-[9px] font-extrabold tracking-wide text-[#8a5a18]">{copy.strongest}</p>
          {strongest ? (
            <>
              <p className="font-[family-name:var(--font-display)] text-[15px] font-bold text-[#3d2f1e]">
                {localizedSubject(strongest.id, locale)}
              </p>
              <p className="text-[12px] font-extrabold tabular-nums text-[#2f9e6e]">{strongest.mastery}</p>
            </>
          ) : (
            <p className="text-[12px] font-bold text-[#8a7355]">{copy.lightAbility}</p>
          )}
        </div>
        <div className="rounded-[1.1rem] bg-[#fff8ea]/8 px-3 py-2 ring-1 ring-[#e8c98a]/50">
          <p className="text-[9px] font-extrabold tracking-wide text-[#8a5a18]">{copy.nextBreakthrough}</p>
          {next ? (
            <>
              <p className="font-[family-name:var(--font-display)] text-[15px] font-bold text-[#3d2f1e]">
                {localizedSubject(next.subject.id, locale)}
              </p>
              <p className="text-[10px] font-bold leading-snug text-[#6b5340]">
                {copy.trophiesToLevel(next.trophiesNeeded, next.nextLevel)}
              </p>
            </>
          ) : (
            <p className="text-[12px] font-bold text-[#8a7355]">{copy.maxStage}</p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          playSfx("tap");
          onSubjectDetails();
        }}
        className="mt-3 w-full text-center text-[12px] font-extrabold text-[#2f9e6e]"
      >
        {copy.viewSubjectDetails}
      </button>
    </section>
  );
}
