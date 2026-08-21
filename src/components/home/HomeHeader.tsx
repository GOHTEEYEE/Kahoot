"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { gradeLabel, type Grade } from "../../lib/curriculum";
import { isSfxMuted, playSfx, setSfxMuted } from "../../lib/audio/sfx";
import { useSfxMuted } from "../../lib/audio/useSfxMuted";
import { GameIcon } from "./GameIcon";
import { GameResource } from "../game-ui/GameResource";
import { GameHUDButton } from "../game-ui/GameHUDButton";

type Props = {
  name: string;
  grade: Grade;
  xpLevel: number;
  xpProgress?: number;
  coins: number;
  gems: number;
  avatarSrc?: string;
  onNotify?: () => void;
  onMail?: () => void;
};

export function HomeHeader({
  name,
  grade,
  xpLevel,
  xpProgress = 0,
  coins,
  gems,
  avatarSrc = "/worlds/chinese/momo.png?v=live",
  onNotify,
  onMail,
}: Props) {
  const muted = useSfxMuted();
  const xpNow = xpLevel * 250 + xpProgress * 8;
  const xpMax = (xpLevel + 1) * 250;
  const xpPct = Math.min(100, Math.round((xpNow / xpMax) * 100));

  return (
    <header className="relative z-30 shrink-0 py-0.5">
      <div className="flex items-start gap-2">
        <div className="profile-plate flex min-w-0 shrink-0 items-center gap-2.5 rounded-[1.35rem] px-2.5 py-2">
          <div className="relative shrink-0">
            <div className="profile-avatar relative h-11 w-11 overflow-hidden rounded-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarSrc}
                alt=""
                className="h-full w-full object-cover object-[50%_20%]"
                draggable={false}
              />
            </div>
            <span className="level-badge absolute -bottom-0.5 -right-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full px-1 text-[8px] font-black leading-none text-[#ffe27a]">
              {xpLevel}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-[family-name:var(--font-display)] text-[14px] font-bold leading-tight text-[var(--game-dark)]">
              {name}
            </p>
            <p className="mt-0.5 text-[9.5px] font-extrabold leading-none tracking-wide text-[#6b5340]">
              {gradeLabel(grade)} · Lv.{xpLevel}
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-[#3c3425]/14 ring-1 ring-white/45">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--game-green)] via-[#7ed957] to-[#b8f070]"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPct}%` }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <span className="shrink-0 text-[7.5px] font-black tabular-nums text-[#6b5340]">
                {xpPct}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <div className="flex items-center gap-1">
            <GameResource icon="coin" value={coins} variant="coin" />
            <GameResource icon="gem" value={gems} variant="gem" />
          </div>
          <div className="flex items-center gap-1">
            <GameHUDButton
              ariaLabel="邮件"
              badge="3"
              onClick={() => {
                playSfx("mail");
                onMail?.();
              }}
            >
              <GameIcon name="mail" size="utility" />
            </GameHUDButton>
            <GameHUDButton
              ariaLabel="通知"
              badge="2"
              onClick={() => {
                playSfx("hud");
                onNotify?.();
              }}
            >
              <GameIcon name="notification" size="utility" />
            </GameHUDButton>
            <GameHUDButton
              ariaLabel={muted ? "打开音效" : "关闭音效"}
              onClick={() => {
                if (isSfxMuted()) {
                  setSfxMuted(false);
                  playSfx("hud");
                } else {
                  playSfx("mute");
                  setSfxMuted(true);
                }
              }}
            >
              <span className="relative">
                <GameIcon name="event" size="utility" />
                {muted ? (
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-[#f04444]">
                    /
                  </span>
                ) : null}
              </span>
            </GameHUDButton>
            <Link
              href="/profile"
              aria-label="设置"
              onClick={() => playSfx("tap")}
              className="hud-round-btn flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
            >
              <GameIcon name="settings" size="utility" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
