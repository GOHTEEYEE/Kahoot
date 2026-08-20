"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BottomNavigation } from "./home/BottomNavigation";
import { GameIcon } from "./home/GameIcon";
import { MasteryRadar } from "./profile/MasteryRadar";
import { gradeLabel } from "../lib/curriculum";
import { totalTrophies, type StudentAccount } from "../lib/account";
import { overallMastery, subjectMasteryMap } from "../lib/mastery";
import { getCurrentAccount, logout } from "../lib/storage";
import { playSfx } from "../lib/audio/sfx";

export function ProfileClient() {
  const router = useRouter();
  const [account, setAccount] = useState<StudentAccount | null>(null);

  useEffect(() => {
    const current = getCurrentAccount();
    if (!current) {
      router.replace("/auth");
      return;
    }
    setAccount(current);
  }, [router]);

  const mastery = useMemo(() => (account ? subjectMasteryMap(account) : null), [account]);
  const overall = mastery ? overallMastery(mastery) : 0;
  const trophies = account ? totalTrophies(account) : 0;

  if (!account || !mastery) {
    return (
      <div className="flex flex-1 items-center justify-center text-[#8a7355]">加载中…</div>
    );
  }

  return (
    <div className="relative mx-auto flex w-full max-w-[430px] flex-1 flex-col px-3 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-3 sm:max-w-lg">
      <header className="relative mb-3 text-center">
        <div className="wood-plaque plaque-glint relative mx-auto inline-flex overflow-hidden rounded-[1.15rem] px-4 py-1.5 ring-1 ring-[#ffe7b4]/80">
          <div>
            <p className="text-[9px] font-extrabold tracking-[0.22em] text-[#fff6d8] uppercase drop-shadow-[0_1px_0_rgba(80,40,10,0.35)]">
              My Character Stats
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-[22px] font-bold leading-tight text-[#fff8ea] drop-shadow-[0_2px_0_rgba(90,40,10,0.45)]">
              角色属性
            </h1>
          </div>
        </div>
        <p className="mt-2 font-[family-name:var(--font-display)] text-lg font-bold text-[#3d2f1e]">
          {account.displayName}
        </p>
      </header>

      <section className="mastery-plate relative overflow-hidden rounded-[1.7rem] px-2 pb-3 pt-3 ring-1 ring-[#ffe7b4]/90">
        <p className="text-center font-[family-name:var(--font-display)] text-[15px] font-bold text-[#3d2f1e]">
          科目掌握度
        </p>
        <p className="mb-1 text-center text-[10px] font-extrabold tracking-wide text-[#8a5a18]">
          学习表现 · 不是奖杯
        </p>
        <MasteryRadar values={mastery} overall={overall} />
        <p className="mt-1 px-3 text-center text-[10px] font-bold leading-snug text-[#8a7355]">
          对战胜率 + 练习量。去挑战，点亮五边形！
        </p>
      </section>

      <div className="mt-3 flex items-center gap-2">
        <div className="hud-plate flex min-w-0 flex-1 items-center gap-2 rounded-[1.15rem] px-3 py-2 ring-1 ring-[#f0d9a0]/90">
          <GameIcon name="trophy" className="h-8 w-8 shrink-0" />
          <div className="min-w-0">
            <p className="text-[9px] font-extrabold tracking-[0.12em] text-[#8a5a18] uppercase">
              Trophy · 对战进度
            </p>
            <p className="font-[family-name:var(--font-display)] text-xl font-bold leading-none text-[#3d2f1e]">
              {trophies}
            </p>
          </div>
        </div>
        <div className="hud-plate flex min-w-0 flex-1 items-center gap-2 rounded-[1.15rem] px-3 py-2 ring-1 ring-[#f0d9a0]/90">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#ffe27a] to-[#7ee08a] text-sm shadow-[0_2px_0_rgba(90,50,10,0.2)] ring-2 ring-white">
            ⭐
          </span>
          <div className="min-w-0">
            <p className="text-[9px] font-extrabold tracking-[0.12em] text-[#8a5a18] uppercase">
              Mastery · 学习表现
            </p>
            <p className="font-[family-name:var(--font-display)] text-xl font-bold leading-none text-[#3d2f1e]">
              {overall}
            </p>
          </div>
        </div>
      </div>

      <div className="hud-plate mt-3 space-y-2.5 rounded-[1.4rem] p-4 ring-1 ring-[#f0d9a0]/90">
        <Row label="登录名" value={account.username} />
        <Row label="年龄" value={`${account.age}`} />
        <Row label="年级（锁定）" value={gradeLabel(account.grade)} />
        <Row label="学校" value={account.school} />
        <Row label="州属" value={account.state} />
        <Row label="联系方式" value={account.contact} />
      </div>

      <button
        type="button"
        onClick={() => {
          playSfx("tap");
          logout();
          router.replace("/auth");
        }}
        className="mt-4 rounded-[1.15rem] bg-gradient-to-b from-[#ff8a7a] to-[#d44532] px-5 py-3 font-[family-name:var(--font-display)] text-lg font-bold text-white shadow-[0_5px_0_#9a2418]"
      >
        退出登录
      </button>
      <Link
        href="/"
        onClick={() => playSfx("tap")}
        className="mt-3 text-center text-sm font-extrabold text-[#8a5a18]"
      >
        返回 Home
      </Link>
      <BottomNavigation />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-[#c4a56a]/25 pb-2 last:border-0 last:pb-0">
      <span className="text-xs font-extrabold text-[#8a7355]">{label}</span>
      <span className="text-right text-sm font-bold text-[#3d2f1e]">{value}</span>
    </div>
  );
}
