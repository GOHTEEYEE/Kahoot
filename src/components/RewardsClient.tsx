"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BottomNavigation } from "./home/BottomNavigation";
import { GameIcon } from "./home/GameIcon";
import {
  getCurrentAccount,
  getSelectedSubject,
  getSubjectStats,
} from "../lib/storage";
import { TROPHY_ROAD, getSubjectWorld } from "../lib/worlds";
import type { SubjectId } from "../lib/curriculum";

export function RewardsClient() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [subject, setSubject] = useState<SubjectId>("math");
  const [trophies, setTrophies] = useState(0);

  useEffect(() => {
    const account = getCurrentAccount();
    if (!account) {
      router.replace("/auth");
      return;
    }
    const sub = getSelectedSubject();
    setSubject(sub);
    setTrophies(getSubjectStats(account, sub).trophies);
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex flex-1 items-center justify-center text-[var(--ink-soft)]">加载中…</div>
    );
  }

  const world = getSubjectWorld(subject);

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 pb-28 pt-6">
      <header className="mb-5 text-center">
        <p className="text-xs font-extrabold tracking-[0.2em] text-[var(--brand-deep)] uppercase">
          Trophy Road
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-bold text-[var(--ink)]">
          奖杯之路
        </h1>
        <p className="mt-1 flex items-center justify-center gap-1 text-sm font-bold text-[var(--ink-soft)]">
          {world.worldName} · 当前
          <GameIcon name="trophy" size="utility" />
          {trophies}
        </p>
      </header>

      <ol className="relative space-y-4 before:absolute before:bottom-4 before:left-[1.15rem] before:top-4 before:w-1 before:rounded-full before:bg-[var(--brand)]/25">
        {TROPHY_ROAD.map((reward, index) => {
          const unlocked = trophies >= reward.trophies;
          return (
            <motion.li
              key={reward.trophies}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
              className="relative flex gap-3 pl-1"
            >
              <span
                className={`relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                  unlocked
                    ? "bg-[var(--accent)] text-[var(--ink)]"
                    : "bg-white text-[var(--ink-soft)] ring-2 ring-[var(--brand)]/20"
                }`}
              >
                {unlocked ? "✓" : index + 1}
              </span>
              <div
                className={`flex-1 rounded-[1.3rem] px-4 py-3 shadow-[var(--shadow)] ${
                  unlocked ? "bg-[var(--brand)] text-white" : "bg-white/85 text-[var(--ink)]"
                }`}
              >
                <p className={`text-xs font-extrabold ${unlocked ? "text-white/75" : "text-[var(--ink-soft)]"}`}>
                  {reward.trophies} Trophy
                </p>
                <p className="font-[family-name:var(--font-display)] text-lg font-bold">
                  {reward.title}
                </p>
                <p className={`text-sm font-bold ${unlocked ? "text-white/85" : "text-[var(--ink-soft)]"}`}>
                  {reward.detail}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ol>

      <Link
        href="/"
        className="mt-6 text-center text-sm font-extrabold text-[var(--brand-deep)]"
      >
        返回 Home
      </Link>
      <BottomNavigation />
    </div>
  );
}
