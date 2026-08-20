"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DUNGEONS, type SubjectId } from "../lib/curriculum";
import { getCurrentAccount, getLeaderboard, getSelectedSubject } from "../lib/storage";
import { getRank } from "../lib/trophy";
import { BottomNavigation } from "./home/BottomNavigation";

type Row = ReturnType<typeof getLeaderboard>[number];

export function LeaderboardClient() {
  const router = useRouter();
  const [subject, setSubject] = useState<SubjectId | "all">("math");
  const [rows, setRows] = useState<Row[]>([]);
  const [me, setMe] = useState<string | null>(null);

  useEffect(() => {
    const account = getCurrentAccount();
    if (!account) {
      router.replace("/auth");
      return;
    }
    setMe(account.username);
    const initial = getSelectedSubject();
    setSubject(initial);
    setRows(getLeaderboard(initial));
  }, [router]);

  useEffect(() => {
    if (subject === "all") setRows(getLeaderboard());
    else setRows(getLeaderboard(subject));
  }, [subject]);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-5 pb-28 py-8">
      <header className="mb-6 text-center">
        <p className="text-sm font-extrabold tracking-[0.2em] text-[var(--brand-deep)] uppercase">
          Ranking
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-bold text-[var(--ink)]">
          奖杯排行榜
        </h1>
        <p className="mt-2 text-[var(--ink-soft)]">各科目奖杯分开排 · 可看总奖杯</p>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        <Chip active={subject === "all"} onClick={() => setSubject("all")} label="总奖杯" />
        {DUNGEONS.map((d) => (
          <Chip
            key={d.id}
            active={subject === d.id}
            onClick={() => setSubject(d.id)}
            label={d.name}
          />
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <p className="text-lg font-bold text-[var(--ink-soft)]">还没有人上榜</p>
          <Link href="/" className="rounded-full bg-[var(--brand)] px-6 py-3 font-extrabold text-white">
            去挑战副本
          </Link>
        </div>
      ) : (
        <ol className="flex flex-col gap-3">
          {rows.map((row, index) => {
            const rank = getRank(row.trophies);
            const isMe = me != null && row.username === me;
            return (
              <li
                key={`${row.username}-${index}`}
                className={`flex items-center gap-4 rounded-3xl px-4 py-4 shadow-[var(--shadow)] ${
                  isMe ? "bg-[var(--brand)] text-white" : "bg-white/80 text-[var(--ink)]"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-[family-name:var(--font-display)] text-lg font-bold ${
                    index === 0
                      ? "bg-[var(--accent)] text-[var(--ink)]"
                      : isMe
                        ? "bg-white/20"
                        : "bg-[var(--bg-top)]"
                  }`}
                >
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-[family-name:var(--font-display)] text-xl font-semibold">
                    {row.displayName}
                    {isMe ? " · 你" : ""}
                  </p>
                  <p className={`text-sm font-bold ${isMe ? "text-white/80" : "text-[var(--ink-soft)]"}`}>
                    <span style={{ color: isMe ? undefined : rank.color }}>{rank.name}</span>
                    {" · "}
                    {row.grade}年级 · {row.school}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-[family-name:var(--font-display)] text-2xl font-bold">
                    {row.trophies}
                  </p>
                  <p className={`text-xs font-bold ${isMe ? "text-white/70" : "text-[var(--ink-soft)]"}`}>
                    奖杯
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="flex flex-1 items-center justify-center rounded-full bg-white/80 px-5 py-3.5 font-extrabold text-[var(--brand-deep)] shadow-sm"
        >
          返回首页
        </Link>
        <Link
          href="/battle"
          className="flex flex-1 items-center justify-center rounded-full bg-[var(--accent)] px-5 py-3.5 font-extrabold text-[var(--ink)] shadow-[var(--shadow)]"
        >
          开始对战
        </Link>
      </div>
      <BottomNavigation />
    </div>
  );
}

function Chip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-extrabold ${
        active ? "bg-[var(--brand)] text-white" : "bg-white/80 text-[var(--ink)]"
      }`}
    >
      {label}
    </button>
  );
}
