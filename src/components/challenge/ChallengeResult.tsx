"use client";

import { motion } from "framer-motion";
import type { ChallengeResult } from "../../lib/challenge";
import { playSfx } from "../../lib/audio/sfx";
import { GameIcon } from "../home/GameIcon";
import { getPlayCopy } from "../../lib/i18n/play";
import { useLocale } from "../../lib/i18n/useLocale";

type Props = {
  title: string;
  result: ChallengeResult;
  extra?: string;
  onAgain: () => void;
  onHome: () => void;
};

export function ChallengeResult({ title, result, extra, onAgain, onHome }: Props) {
  const { locale } = useLocale();
  const play = getPlayCopy(locale);
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-1 flex-col items-center justify-center px-1 py-4"
    >
      <div className="wood-plaque w-full rounded-[1.4rem] px-4 py-4 text-center ring-1 ring-[#ffe7b4]/70">
        <p className="text-[10px] font-extrabold tracking-[0.16em] text-[#ffe9c4] uppercase">Complete</p>
        <h2 className="font-[family-name:var(--font-display)] text-[26px] font-bold text-[#fff8ea]">
          {title}
        </h2>
        {extra ? <p className="mt-1 text-sm font-bold text-[#ffe7b4]">{extra}</p> : null}
      </div>

      <div className="hud-dark mt-3 grid w-full grid-cols-2 gap-2 rounded-[1.2rem] p-3 text-center">
        <Stat label="Score" value={`${result.score}`} />
        <Stat label="Correct" value={`${result.correct}/${result.total}`} />
        <Stat
          label="Accuracy"
          value={`${result.total ? Math.round((result.correct / result.total) * 100) : 0}%`}
        />
        <Stat label="Time" value={`${Math.round(result.duration / 1000)}s`} />
      </div>

      <div className="mt-3 flex w-full items-center justify-center gap-3">
        <RewardPill icon="coin" value={`+${result.goldEarned}`} />
        <RewardPill icon="fragment" value={`+${result.fragmentsEarned}`} />
        {result.trophyEarned > 0 ? (
          <RewardPill icon="trophy" value={`+${result.trophyEarned}`} />
        ) : null}
      </div>
      <p className="mt-1 text-[11px] font-extrabold text-[#8a5a18]">XP +{result.xpEarned}</p>

      <div className="mt-5 flex w-full gap-2">
        <button
          type="button"
          onClick={() => {
            playSfx("challenge");
            onAgain();
          }}
          className="cta-gold flex-1 rounded-[1.05rem] py-3 font-[family-name:var(--font-display)] text-lg font-bold text-[#4a320e]"
        >
          {play.again}
        </button>
        <button
          type="button"
          onClick={() => {
            playSfx("tap");
            onHome();
          }}
          className="cta-green flex-1 rounded-[1.05rem] py-3 font-[family-name:var(--font-display)] text-lg font-bold text-white"
        >
          {play.back}
        </button>
      </div>
    </motion.section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] font-extrabold tracking-[0.12em] text-[#c4b08a] uppercase">{label}</p>
      <p className="font-[family-name:var(--font-display)] text-xl font-bold text-[#fff6e4]">{value}</p>
    </div>
  );
}

function RewardPill({ icon, value }: { icon: string; value: string }) {
  return (
    <span className="coin-pill inline-flex items-center gap-1 rounded-full px-2 py-1 text-[12px] font-black text-[#fff4d6]">
      <GameIcon name={icon} className="h-5 w-5" />
      {value}
    </span>
  );
}
