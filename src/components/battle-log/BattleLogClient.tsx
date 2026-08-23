"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BottomNavigation } from "../home/BottomNavigation";
import { GameModal } from "../game-ui/GameModal";
import { GameIcon } from "../home/GameIcon";
import { getCurrentAccount } from "../../lib/storage";
import { playSfx } from "../../lib/audio/sfx";
import { getBattleLogCopy } from "../../lib/i18n/battleLog";
import { getSharedLabels } from "../../lib/i18n/labels";
import { localizedSubject } from "../../lib/i18n/home";
import { useLocale } from "../../lib/i18n/useLocale";
import {
  loadBattleLog,
  markBattleLogSeen,
  type BattleLogEntry,
} from "../../lib/pvp/battleLog";

type Filter = "all" | "win" | "lose";

function relativeTime(ts: number, copy: ReturnType<typeof getBattleLogCopy>): string {
  const delta = Math.max(0, Date.now() - ts);
  const mins = Math.floor(delta / 60000);
  if (mins < 1) return copy.justNow;
  if (mins < 60) return copy.minutesAgo(mins);
  const hours = Math.floor(mins / 60);
  if (hours < 24) return copy.hoursAgo(hours);
  return copy.daysAgo(Math.floor(hours / 24));
}

function speedLine(entry: BattleLogEntry, copy: ReturnType<typeof getBattleLogCopy>): string {
  if (entry.speedLead > 0) return copy.speedLead(String(entry.speedLead));
  if (entry.speedLead < 0) return copy.speedLag(String(Math.abs(entry.speedLead)));
  return copy.speedEven;
}

function Face({ src, emoji, name }: { src: string; emoji: string; name: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
      <div className="relative h-12 w-12 overflow-hidden rounded-full bg-[#fff3d6] ring-2 ring-[#f0d9a0]">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" draggable={false} className="h-full w-full object-cover object-[50%_18%]" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-2xl">{emoji || "🐼"}</span>
        )}
      </div>
      <p className="max-w-full truncate text-[12px] font-black text-[#3d2f1e]">{name}</p>
    </div>
  );
}

export function BattleLogClient() {
  const router = useRouter();
  const { locale } = useLocale();
  const copy = getBattleLogCopy(locale);
  const labels = getSharedLabels(locale);
  const [entries, setEntries] = useState<BattleLogEntry[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<BattleLogEntry | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const account = getCurrentAccount();
    if (!account) {
      router.replace("/auth");
      return;
    }
    setEntries(loadBattleLog());
    markBattleLogSeen();
    setReady(true);
  }, [router]);

  const visible = useMemo(() => {
    if (filter === "all") return entries;
    return entries.filter((row) => row.result === filter);
  }, [entries, filter]);

  if (!ready) {
    return <div className="flex flex-1 items-center justify-center text-[#8a7355]">{labels.loading}</div>;
  }

  return (
    <div className="relative mx-auto flex w-full max-w-[430px] flex-1 flex-col px-3 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-3 sm:max-w-lg">
      <header className="mb-3 flex items-center gap-2">
        <Link
          href="/"
          onClick={() => playSfx("tap")}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff8ea] text-lg font-black text-[#5a3a18] ring-1 ring-[#e8c98a]/70"
          aria-label={labels.back}
        >
          ←
        </Link>
        <div className="wood-plaque flex min-w-0 flex-1 items-center justify-center gap-2 rounded-[1.15rem] px-4 py-1.5">
          <GameIcon name="swords" size="utility" />
          <h1 className="font-[family-name:var(--font-display)] text-[18px] font-bold text-[#fff8ea]">
            ⚔️ {copy.title}
          </h1>
        </div>
        <span className="w-10" />
      </header>

      <div className="mb-3 grid grid-cols-3 gap-1.5">
        {(
          [
            ["all", copy.all],
            ["win", copy.wins],
            ["lose", copy.losses],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              playSfx("tap");
              setFilter(id);
            }}
            className={`min-h-10 rounded-full text-[12px] font-black ${
              filter === id
                ? "bg-gradient-to-b from-[#ffe9b0] to-[#f5b62b] text-[#4a3414] shadow-[0_3px_0_#c8860a]"
                : "bg-[#fff8ea] text-[#6b5340] ring-1 ring-[#e8c98a]/80"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="hud-plate mt-6 flex flex-col items-center rounded-[1.5rem] px-5 py-8 text-center">
          <p className="text-4xl">⚔️</p>
          <p className="mt-3 font-[family-name:var(--font-display)] text-xl font-bold text-[#5a3a18]">
            {copy.emptyTitle}
          </p>
          <p className="mt-2 whitespace-pre-line text-[13px] font-bold text-[#8a5a18]">{copy.emptyBody}</p>
          <button
            type="button"
            onClick={() => {
              playSfx("challenge");
              router.push("/challenge");
            }}
            className="mt-5 min-h-12 w-full rounded-2xl bg-gradient-to-b from-[#ffe9b0] to-[#f5b62b] text-sm font-black text-[#4a3414] shadow-[0_4px_0_#c8860a]"
          >
            {copy.startBattle}
          </button>
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {visible.map((entry) => {
            const win = entry.result === "win";
            return (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => {
                    playSfx("tap");
                    setSelected(entry);
                  }}
                  className="battle-log-card hud-plate relative w-full rounded-[1.35rem] px-3 py-3 text-left ring-1 ring-[#f0d9a0]/90"
                >
                  <span className="absolute right-3 top-2.5 text-[10px] font-black text-[#8a6840]">
                    {relativeTime(entry.timestamp, copy)}
                  </span>
                  <div className="flex items-center gap-1 pt-3">
                    <Face src={entry.player.avatar} emoji={entry.player.emoji} name={entry.player.name} />
                    <span className="shrink-0 font-[family-name:var(--font-display)] text-lg font-black text-[#f5b62b]">
                      VS
                    </span>
                    <Face src={entry.opponent.avatar} emoji={entry.opponent.emoji} name={entry.opponent.name} />
                  </div>
                  <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] font-extrabold text-[#5a3a18]">
                    <span className={win ? "text-[#2f8a3a]" : entry.result === "draw" ? "text-[#8a6840]" : "text-[#c45c20]"}>
                      {win ? `🏆 ${copy.victory}` : entry.result === "draw" ? copy.draw : `❌ ${copy.defeat}`}
                    </span>
                    <span>
                      {copy.accuracy} {entry.player.accuracy}%
                    </span>
                    <span>
                      {entry.player.correctAnswers} / {entry.player.totalQuestions}
                    </span>
                    <span>{speedLine(entry, copy)}</span>
                    <span>
                      {entry.trophyChange >= 0 ? "+" : ""}
                      {entry.trophyChange} 🏆
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <GameModal
        open={Boolean(selected)}
        title={`⚔️ ${copy.detailTitle}`}
        subtitle={
          selected
            ? `${selected.player.name} VS ${selected.opponent.name}`
            : undefined
        }
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <div className="space-y-3 text-sm font-bold text-[#3d2f1e]">
            <p className="text-center text-lg font-black">
              {selected.result === "win"
                ? `🏆 ${copy.victory}`
                : selected.result === "draw"
                  ? copy.draw
                  : `❌ ${copy.defeat}`}
            </p>
            <div className="grid grid-cols-2 gap-2 text-[12px]">
              <p>
                {copy.accuracy} {selected.player.accuracy}%
              </p>
              <p>{speedLine(selected, copy)}</p>
              <p>
                {copy.finalHp} {Math.round(selected.player.finalHp)} / {selected.player.maxHp}
              </p>
              <p>
                {copy.trophy} {selected.trophyChange >= 0 ? "+" : ""}
                {selected.trophyChange}
              </p>
              <p>
                {copy.xp} +{selected.xpChange}
              </p>
              <p>{localizedSubject(selected.subject, locale)}</p>
            </div>
            {selected.questions.length > 0 ? (
              <div>
                <p className="mb-1.5 text-[12px] font-black text-[#8a5a18]">{copy.breakdown}</p>
                <ul className="space-y-1.5">
                  {selected.questions.map((q) => (
                    <li
                      key={`${selected.id}-${q.index}`}
                      className="flex items-center justify-between rounded-2xl bg-[#fff3d8] px-3 py-2 text-[12px]"
                    >
                      <span>
                        {copy.questionN(q.index + 1)}{" "}
                        {q.correct ? `✓ ${copy.correct}` : `✕ ${copy.wrong}`}
                      </span>
                      <span className="tabular-nums text-[#6b5340]">
                        {q.timeSec.toFixed(1)}s · {copy.damage(q.damage)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </GameModal>

      <BottomNavigation />
    </div>
  );
}
