"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  SUBJECT_WORLDS,
  WORLD_STAGES,
  getSubjectWorld,
  getWorldStage,
} from "../../lib/worlds";
import { getWorldArtPack, peekWorldPlate } from "../../lib/animation/worldArt";
import type { SubjectId } from "../../lib/curriculum";
import type { WorldStageId } from "../../lib/worlds";
import { getSubjectStats } from "../../lib/storage";
import type { StudentAccount } from "../../lib/account";
import { playSfx } from "../../lib/audio/sfx";
import { GameIcon } from "./GameIcon";

type Props = {
  open: boolean;
  current: SubjectId;
  viewingStage?: WorldStageId | null;
  account: StudentAccount;
  onClose: () => void;
  onSelect: (subject: SubjectId) => void;
  onViewStage: (stage: WorldStageId) => void;
};

export function WorldPickerModal({
  open,
  current,
  viewingStage,
  account,
  onClose,
  onSelect,
  onViewStage,
}: Props) {
  const [browse, setBrowse] = useState(current);

  useEffect(() => {
    if (open) setBrowse(current);
  }, [open, current]);

  const world = getSubjectWorld(browse);
  const trophies = getSubjectStats(account, browse).trophies;
  const currentStage = getWorldStage(trophies);
  const pack = getWorldArtPack(browse);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-[#3d2f1e]/45 p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            playSfx("tap");
            onClose();
          }}
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="flex max-h-[86vh] w-full max-w-md flex-col overflow-hidden rounded-[1.6rem] bg-[#fff8ea] shadow-[0_24px_60px_rgba(60,40,15,0.35)] ring-1 ring-[#e8c98a]/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="wood-plaque shrink-0 px-5 py-3">
              <p className="text-[10px] font-extrabold tracking-[0.18em] text-[#ffe9c4] uppercase">
                World Map
              </p>
              <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#fff8ea] drop-shadow-[0_2px_0_rgba(90,40,10,0.4)]">
                世界地图
              </h3>
              <p className="mt-0.5 text-xs font-bold text-[#ffe7b4]/85">
                {world.subjectName} · {world.worldName} · 点关卡看小岛
              </p>
            </div>

            <div className="shrink-0 border-b border-[#e8d7b8] px-4 py-3">
              <div className="flex gap-1.5">
                {SUBJECT_WORLDS.map((w) => {
                  const selected = w.subject === browse;
                  return (
                    <button
                      key={w.subject}
                      type="button"
                      onClick={() => {
                        playSfx(selected ? "tap" : "world");
                        setBrowse(w.subject);
                        onSelect(w.subject);
                      }}
                      className={`min-w-0 flex-1 rounded-2xl px-1 py-2 text-center text-[11px] font-extrabold transition ${
                        selected
                          ? "bg-[#3d2f1e] text-[#fff8ea] shadow-md"
                          : "bg-white/80 text-[#5a4630] hover:bg-white"
                      }`}
                    >
                      {w.subjectName}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto px-4 py-4">
              {WORLD_STAGES.map((stage) => {
                const { plate, designed } = peekWorldPlate(pack, stage.id);
                const unlocked = trophies >= stage.minTrophies;
                const isCurrent = currentStage.id === stage.id;
                const isViewing = (viewingStage ?? currentStage.id) === stage.id;
                const remain = Math.max(0, stage.minTrophies - trophies);

                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => {
                      playSfx("world");
                      onSelect(browse);
                      onViewStage(stage.id);
                    }}
                    className={`flex w-full items-center gap-3 rounded-[1.25rem] p-3 text-left transition ${
                      isViewing
                        ? "bg-[#3d2f1e] text-[#fff8ea] shadow-lg"
                        : unlocked
                          ? "bg-white/85 text-[#3d2f1e] hover:bg-white"
                          : "bg-[#efe4cc]/80 text-[#3d2f1e] hover:bg-[#ead9b8]"
                    }`}
                  >
                    <span
                      className="relative h-[4.75rem] w-[4.75rem] shrink-0 overflow-hidden rounded-2xl bg-[#cfe4f4] shadow-inner ring-2 ring-white/70"
                      aria-hidden
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={plate.src}
                        alt=""
                        className={`h-full w-full object-contain object-center ${
                          unlocked ? "" : "scale-105 opacity-55 grayscale"
                        }`}
                      />
                      {!unlocked ? (
                        <span className="absolute inset-0 flex items-center justify-center bg-[#2a1c10]/45 text-lg">
                          🔒
                        </span>
                      ) : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block text-[11px] font-extrabold ${isViewing ? "text-white/70" : "text-[#8a7355]"}`}>
                        Lv.{stage.level} · {stage.nameEn}
                      </span>
                      <span className="block font-[family-name:var(--font-display)] text-lg font-bold leading-tight">
                        {stage.name}
                      </span>
                      <span
                        className={`mt-1 flex items-center gap-1 text-xs font-extrabold ${
                          isViewing ? "text-[#ffd66b]" : "text-[#8a5a18]"
                        }`}
                      >
                        <GameIcon name="trophy" className="h-3.5 w-3.5" />
                        {stage.minTrophies === 0 ? "免费解锁" : `${stage.minTrophies} 奖杯解锁`}
                      </span>
                      {!designed ? (
                        <span className={`mt-0.5 block text-[10px] font-bold ${isViewing ? "text-white/55" : "text-[#9a8464]"}`}>
                          地图即将揭晓
                        </span>
                      ) : null}
                    </span>
                    {isViewing ? (
                      <span className="rounded-full bg-[#ffd66b] px-2 py-1 text-[10px] font-extrabold text-[#3d2f1e]">
                        {isCurrent ? "当前" : "预览"}
                      </span>
                    ) : unlocked ? (
                      <span className="rounded-full bg-[#d9f5c8] px-2 py-1 text-[10px] font-extrabold text-[#14682a]">
                        已解锁
                      </span>
                    ) : (
                      <span className="rounded-full bg-white/80 px-2 py-1 text-center text-[10px] font-extrabold text-[#8a5a18]">
                        还差
                        <br />
                        {remain}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="shrink-0 px-4 pb-4">
              <button
                type="button"
                onClick={() => {
                  playSfx("tap");
                  onClose();
                }}
                className="w-full rounded-full bg-[#e8d7b8] py-3 text-sm font-extrabold text-[#5a4630]"
              >
                关闭
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function ChangeWorldButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97, y: 3 }}
      transition={{ type: "spring", stiffness: 420, damping: 22 }}
      onClick={() => {
        playSfx("whoosh");
        onClick();
      }}
      className="cta-green relative flex h-full min-w-0 basis-[38%] items-center justify-center gap-1.5 rounded-[var(--game-radius)] px-2 text-[#fff8ea] will-change-transform"
      style={{ minHeight: "var(--home-cta-height)" }}
    >
      <span className="pointer-events-none absolute inset-x-4 top-2 h-2 rounded-full bg-white/30" />
      <GameIcon name="map" size="worldMap" className="relative z-10" />
      <span className="relative z-10 text-left leading-tight">
        <span className="block font-[family-name:var(--font-display)] text-[clamp(0.95rem,3.8vw,1.05rem)] font-bold drop-shadow-[0_1px_0_rgba(20,70,30,0.35)]">
          世界地图
        </span>
        <span className="block text-[8px] font-extrabold tracking-[0.14em] text-white/82">
          WORLD MAP
        </span>
      </span>
    </motion.button>
  );
}

export function worldPreviewAccent(subject: SubjectId) {
  return getSubjectWorld(subject).accent;
}
