"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getCurrentAccount,
  getSelectedSubject,
  saveSelectedSubject,
} from "../lib/storage";
import type { SubjectId } from "../lib/curriculum";
import {
  loadRanking,
  type LeaderboardEntry,
  type RankingPeriod,
  type RankingSubjectFilter,
} from "../lib/leaderboard";
import { playSfx } from "../lib/audio/sfx";
import { HomeAtmosphere } from "./home/HomeAtmosphere";
import { BottomNavigation } from "./home/BottomNavigation";
import { RankingSubjectTabs } from "./leaderboard/RankingTabs";
import { LeaderboardRow, LeaderboardRowSkeleton } from "./leaderboard/LeaderboardRow";
import { RankingMotivation } from "./leaderboard/RankingMotivation";
import { CurrentUserRanking } from "./leaderboard/CurrentUserRanking";
import { RankingRulesModal } from "./leaderboard/RankingRulesModal";
import { PlayerMiniProfileModal } from "./leaderboard/PlayerMiniProfileModal";

const LIST_LIMIT = 10;

export function LeaderboardClient() {
  const router = useRouter();
  const [subject, setSubject] = useState<RankingSubjectFilter>("chinese");
  const [period] = useState<RankingPeriod>("all");
  const [meName, setMeName] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [reloadKey, setReloadKey] = useState(0);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [profile, setProfile] = useState<{ entry: LeaderboardEntry; place: number } | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    try {
      const account = getCurrentAccount();
      if (!account) {
        router.replace("/auth");
        return;
      }
      if (cancelled) return;
      setMeName(account.username);
      setSubject(getSelectedSubject());
      setStatus("ready");
    } catch {
      if (!cancelled) setStatus("error");
    }
    return () => {
      cancelled = true;
    };
  }, [router, reloadKey]);

  const snap = useMemo(() => {
    if (status !== "ready" || !meName) return null;
    try {
      return loadRanking(subject, period, meName);
    } catch {
      return null;
    }
  }, [status, subject, period, meName, reloadKey]);

  useEffect(() => {
    if (status === "ready" && snap == null) setStatus("error");
  }, [status, snap]);

  function onSubjectChange(next: RankingSubjectFilter) {
    setSubject(next);
    if (next !== "all") saveSelectedSubject(next as SubjectId);
  }

  function openPlayer(entry: LeaderboardEntry, place: number) {
    setProfile({ entry, place });
  }

  const list = snap?.rows.slice(0, LIST_LIMIT) ?? [];
  const mePlace = snap && snap.meIndex >= 0 ? snap.meIndex + 1 : 0;

  return (
    <div className="relative flex h-[100dvh] min-h-0 flex-1 flex-col overflow-hidden">
      <HomeAtmosphere />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-xl min-h-0 flex-col px-3 pt-[max(0.5rem,env(safe-area-inset-top))] pb-[calc(var(--home-nav-h)+0.85rem+env(safe-area-inset-bottom))]">
        {/* Header */}
        <header className="mb-2 flex items-center gap-2">
          <Link
            href="/"
            onClick={() => playSfx("tap")}
            aria-label="返回"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff8ea] text-lg font-black text-[#6b4525] shadow-[var(--game-shadow)] ring-1 ring-[#e8c98a]/50"
          >
            ←
          </Link>
          <div className="wood-plaque wood-plaque-leaf relative min-w-0 flex-1 rounded-[1.15rem] px-3 py-2 text-center">
            <span className="wood-leaf" style={{ left: "-0.35rem", transform: "translateY(-50%) rotate(-28deg)" }} />
            <span className="wood-leaf" style={{ right: "-0.35rem", left: "auto", transform: "translateY(-50%) scaleX(-1) rotate(-28deg)" }} />
            <h1 className="font-[family-name:var(--font-display)] text-[1.2rem] font-bold leading-tight text-[#fff8ea] drop-shadow-[0_2px_0_rgba(90,40,10,0.35)]">
              奖杯排行榜
            </h1>
            <p className="text-[9px] font-extrabold text-[#ffe7b4]/85">
              各科目奖杯分开排 · 可看总奖杯
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              playSfx("tap");
              setRulesOpen(true);
            }}
            className="flex h-10 items-center justify-center rounded-full bg-[#a96b32] px-3 text-[12px] font-extrabold text-[#fff8ea] shadow-[var(--game-shadow)]"
          >
            规则
          </button>
        </header>

        <RankingSubjectTabs value={subject} onChange={onSubjectChange} />

        <div className="mt-2 min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {status === "loading" ? (
            <div className="overflow-hidden rounded-[1.35rem] bg-[#fff8ea]/92 shadow-[var(--game-shadow)] ring-1 ring-[#e8c98a]/40">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={i > 0 ? "border-t border-[#e8dcc4]/55" : ""}>
                  <LeaderboardRowSkeleton />
                </div>
              ))}
            </div>
          ) : null}

          {status === "error" ? (
            <div className="rounded-[1.35rem] bg-[#fff8ea]/92 px-4 py-10 text-center shadow-[var(--game-shadow)] ring-1 ring-[#e8c98a]/40">
              <p className="font-[family-name:var(--font-display)] text-lg font-bold text-[#3d2f1e]">
                排行榜暂时无法加载
              </p>
              <button
                type="button"
                onClick={() => {
                  playSfx("tap");
                  setReloadKey((k) => k + 1);
                }}
                className="mt-4 rounded-full bg-[var(--game-green)] px-5 py-2.5 text-sm font-extrabold text-white shadow-[var(--game-shadow)]"
              >
                重新加载
              </button>
            </div>
          ) : null}

          {status === "ready" && snap && list.length === 0 ? (
            <div className="rounded-[1.35rem] bg-[#fff8ea]/92 px-4 py-10 text-center shadow-[var(--game-shadow)] ring-1 ring-[#e8c98a]/40">
              <p className="font-[family-name:var(--font-display)] text-lg font-bold text-[#3d2f1e]">
                还没有同学参加挑战
              </p>
              <p className="mt-1 text-sm font-bold text-[#8a7355]">完成一局挑战即可登上奖杯榜</p>
              <Link
                href="/challenge"
                onClick={() => playSfx("whoosh")}
                className="mt-4 inline-flex rounded-full bg-[var(--game-green)] px-5 py-2.5 text-sm font-extrabold text-white shadow-[var(--game-shadow)]"
              >
                去挑战
              </Link>
            </div>
          ) : null}

          {status === "ready" && snap && list.length > 0 ? (
            <>
              {/* Single vertical leaderboard */}
              <section className="overflow-hidden rounded-[1.35rem] bg-[#fff8ea]/94 shadow-[var(--game-shadow)] ring-1 ring-[#e8c98a]/40">
                <div className="flex items-center gap-2.5 border-b border-[#e8dcc4]/70 px-3 py-1.5 text-[10px] font-extrabold tracking-wide text-[#a08968] uppercase">
                  <span className="w-8 text-center">排名</span>
                  <span className="w-11" />
                  <span className="flex-1">玩家信息</span>
                  <span className="w-14 text-right">奖杯数</span>
                </div>
                <ol>
                  {list.map((row, i) => {
                    const place = i + 1;
                    const isMe = meName != null && row.username === meName;
                    return (
                      <li
                        key={`${row.username}-${place}`}
                        className={i > 0 ? "border-t border-[#e8dcc4]/55" : ""}
                      >
                        <LeaderboardRow
                          place={place}
                          entry={row}
                          isMe={isMe}
                          embedded
                          onClick={() => openPlayer(row, place)}
                        />
                      </li>
                    );
                  })}
                </ol>
              </section>

              <div className="mt-2.5 space-y-2.5 pb-1">
                <RankingMotivation
                  gapLine={snap.gapLine}
                  motivation={snap.motivation}
                  meIndex={snap.meIndex}
                  trophyGap={snap.trophyGap}
                />
                <CurrentUserRanking me={snap.me} place={mePlace} />
              </div>
            </>
          ) : null}
        </div>
      </div>

      <BottomNavigation />

      <RankingRulesModal open={rulesOpen} onClose={() => setRulesOpen(false)} />
      <PlayerMiniProfileModal
        open={profile != null}
        onClose={() => setProfile(null)}
        player={profile?.entry ?? null}
        place={profile?.place ?? 0}
        subject={subject}
        isMe={profile != null && meName != null && profile.entry.username === meName}
      />
    </div>
  );
}
