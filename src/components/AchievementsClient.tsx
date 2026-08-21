"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BottomNavigation } from "./home/BottomNavigation";
import { GameModal } from "./game-ui/GameModal";
import { GameIcon } from "./home/GameIcon";
import { evaluateAchievements, type AchievementView } from "../lib/achievements";
import type { StudentAccount } from "../lib/account";
import { getCurrentAccount } from "../lib/storage";
import { playSfx } from "../lib/audio/sfx";

function Glyph({ achievement }: { achievement: AchievementView }) {
  const map = {
    trophy: "trophy",
    fire: "quest",
    brain: "spirit",
    swords: "swords",
    lock: "leaderboard",
    star: "medal",
    map: "map",
    medal: "medal",
  } as const;
  return <GameIcon name={map[achievement.icon]} className="h-10 w-10" />;
}

export function AchievementsClient() {
  const router = useRouter();
  const [account, setAccount] = useState<StudentAccount | null>(null);
  const [selected, setSelected] = useState<AchievementView | null>(null);

  useEffect(() => {
    const current = getCurrentAccount();
    if (!current) {
      router.replace("/auth");
      return;
    }
    setAccount(current);
  }, [router]);

  const list = useMemo(() => (account ? evaluateAchievements(account) : []), [account]);
  const unlocked = list.filter((a) => a.unlocked).length;

  if (!account) {
    return (
      <div className="flex flex-1 items-center justify-center text-[#8a7355]">加载中…</div>
    );
  }

  return (
    <div className="relative mx-auto flex w-full max-w-[430px] flex-1 flex-col px-3 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-3 sm:max-w-lg">
      <header className="mb-3 flex items-center gap-2">
        <Link
          href="/profile"
          onClick={() => playSfx("tap")}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff8ea] text-lg font-black text-[#5a3a18] ring-1 ring-[#e8c98a]/70"
          aria-label="返回资料"
        >
          ←
        </Link>
        <div className="wood-plaque flex-1 rounded-[1.15rem] px-4 py-1.5 text-center">
          <h1 className="font-[family-name:var(--font-display)] text-[18px] font-bold text-[#fff8ea]">
            全部成就
          </h1>
        </div>
        <span className="w-10" />
      </header>

      <p className="mb-3 text-center text-[12px] font-extrabold text-[#8a5a18]">
        已获得 {unlocked} / {list.length}
      </p>

      <ul className="grid grid-cols-2 gap-2.5">
        {list.map((a) => (
          <li key={a.id}>
            <button
              type="button"
              onClick={() => {
                playSfx("tap");
                setSelected(a);
              }}
              className={`hud-plate flex w-full flex-col items-center gap-2 rounded-[1.25rem] px-3 py-3 ring-1 ring-[#f0d9a0]/90 ${
                a.unlocked ? "" : "grayscale opacity-70"
              }`}
            >
              <Glyph achievement={a} />
              <span className="text-center text-[12px] font-extrabold text-[#3d2f1e]">{a.name}</span>
              <span className="text-[10px] font-bold text-[#8a5a18]">{a.progressLabel}</span>
            </button>
          </li>
        ))}
      </ul>

      <GameModal
        open={!!selected}
        title={selected?.name ?? "成就"}
        subtitle={selected?.unlocked ? "已完成" : "未解锁"}
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <div className="space-y-2 text-sm font-bold text-[#3d2f1e]">
            <p className="text-[#6b5340]">{selected.description}</p>
            <p>条件：{selected.condition}</p>
            <p>
              进度：{selected.progressLabel}（{selected.progress}%）
            </p>
            <p>
              状态：{selected.unlocked ? "已完成" : "进行中"}
              {selected.unlockedAt ? ` · ${selected.unlockedAt}` : ""}
            </p>
          </div>
        ) : null}
      </GameModal>

      <BottomNavigation />
    </div>
  );
}
