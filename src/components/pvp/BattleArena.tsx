"use client";

import { motion } from "framer-motion";
import { AttackEffect } from "./AttackEffect";
import { BattleHeader } from "./BattleHeader";
import { DamageNumber } from "./DamageNumber";
import { Hero } from "./Hero";
import { OpponentStatusMessage } from "./OpponentStatusMessage";
import { PVP_LOW_HP } from "../../lib/pvp/config";
import type { AttackEvent, EmoteId, FighterState, OpponentStatus } from "../../lib/pvp/types";
import type { PvpCopy } from "../../lib/i18n/pvp";

type Props = {
  player: FighterState;
  opponent: FighterState;
  questionIndex: number;
  total: number;
  copy: PvpCopy;
  comboBroke: boolean;
  attack: AttackEvent | null;
  hitSide: "player" | "opponent" | null;
  playerEmote: EmoteId | null;
  opponentEmote: EmoteId | null;
  opponentStatus: OpponentStatus;
  comeback?: boolean;
  winner?: "player" | "opponent" | "draw" | null;
  onSwing?: () => void;
  onImpact?: () => void;
};

export function BattleArena({
  player,
  opponent,
  questionIndex,
  total,
  copy,
  comboBroke,
  attack,
  hitSide,
  playerEmote,
  opponentEmote,
  opponentStatus,
  comeback,
  winner,
  onSwing,
  onImpact,
}: Props) {
  const q = questionIndex + 1;
  const stretchLabel =
    q >= total ? copy.finalQuestion : q === total - 1 ? copy.lateGame : q === total - 2 ? copy.clutch : undefined;

  return (
    <motion.section
      className="pvp-arena relative h-[50%] min-h-[12rem] shrink-0 overflow-hidden"
      animate={hitSide ? { x: [0, -5, 5, -3, 0] } : { x: 0 }}
      transition={{ duration: 0.32 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/worlds/shared/pvp-arena.png?v=1"
        alt=""
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[50%_46%]"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[15] h-20 bg-gradient-to-b from-black/40 to-transparent" />

      <div className="absolute inset-x-0 top-0 z-20">
        <BattleHeader
          player={player}
          opponent={opponent}
          questionIndex={questionIndex}
          total={total}
          copy={copy}
          comboBroke={comboBroke}
          playerDanger={player.hp / player.maxHp <= PVP_LOW_HP}
          opponentDanger={opponent.hp / opponent.maxHp <= PVP_LOW_HP}
          stretchLabel={stretchLabel}
        />
      </div>

      {comeback ? (
        <p className="pointer-events-none absolute left-1/2 top-[34%] z-30 -translate-x-1/2 rounded-full bg-[#ff7a3a] px-2 py-0.5 text-[9px] font-black text-white shadow-md">
          ⚠️ {copy.comeback}
        </p>
      ) : null}

      <div
        className={`pvp-fighter pvp-fighter-player${
          attack?.from === "player" && attack.correct ? " is-rushing" : ""
        }${winner === "player" ? " is-celebrating" : ""}${winner === "opponent" ? " is-crying" : ""}`}
      >
        <Hero
          fighter={player}
          side="player"
          preparing={attack?.from === "player" && Boolean(attack.correct) && !hitSide}
          attacking={attack?.from === "player" && Boolean(attack.correct)}
          hit={hitSide === "player"}
          celebrating={winner === "player"}
          crying={winner === "opponent"}
          onSwing={onSwing}
          onImpact={onImpact}
        />
        <DamageNumber
          amount={attack?.damage ?? 0}
          side="player"
          show={hitSide === "player"}
          power={attack?.power}
        />
        <EmoteBubble text={playerEmote ? copy.emotes[playerEmote] : null} align="left" />
      </div>

      {attack?.correct ? (
        attack.power ? (
          <p className="pointer-events-none absolute left-1/2 top-[36%] z-20 -translate-x-1/2 rounded-full bg-[#ff7a3a] px-2 py-0.5 text-[9px] font-black text-white shadow-md">
            🔥 {copy.powerAttack}
          </p>
        ) : null
      ) : (
        <div className="pointer-events-none absolute inset-x-[30%] top-[44%] z-10 h-[30%]">
          <AttackEffect attack={attack} powerLabel={copy.powerAttack} />
        </div>
      )}

      <div
        className={`pvp-fighter pvp-fighter-foe${
          attack?.from === "opponent" && attack.correct ? " is-rushing" : ""
        }${winner === "opponent" ? " is-celebrating" : ""}${winner === "player" ? " is-crying" : ""}`}
      >
        <Hero
          fighter={opponent}
          side="opponent"
          preparing={attack?.from === "opponent" && Boolean(attack.correct) && !hitSide}
          attacking={attack?.from === "opponent" && Boolean(attack.correct)}
          hit={hitSide === "opponent"}
          celebrating={winner === "opponent"}
          crying={winner === "player"}
          onSwing={onSwing}
          onImpact={onImpact}
        />
        <DamageNumber
          amount={attack?.damage ?? 0}
          side="opponent"
          show={hitSide === "opponent"}
          power={attack?.power}
        />
        <EmoteBubble text={opponentEmote ? copy.emotes[opponentEmote] : null} align="right" />
      </div>

      <OpponentStatusMessage
        name={opponent.name}
        status={opponentStatus}
        combo={opponent.currentCombo}
        lastDamage={opponent.lastDamage}
        copy={copy}
      />
    </motion.section>
  );
}

function EmoteBubble({ text, align }: { text: string | null; align: "left" | "right" }) {
  if (!text) return null;
  return (
    <motion.span
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`absolute top-[8%] z-20 max-w-[6.2rem] rounded-2xl bg-white/95 px-1.5 py-0.5 text-[9px] font-extrabold text-[#4a3418] shadow-sm ${
        align === "left" ? "left-[72%]" : "right-[72%]"
      }`}
    >
      {text}
    </motion.span>
  );
}
