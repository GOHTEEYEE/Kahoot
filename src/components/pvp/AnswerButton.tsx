"use client";

import { playSfx } from "../../lib/audio/sfx";

const TONES = [
  { bg: "bg-[#f04444]", letter: "A" },
  { bg: "bg-[#5ba4d6]", letter: "B" },
  { bg: "bg-[#f0a020]", letter: "C" },
  { bg: "bg-[#58b94b]", letter: "D" },
] as const;

type Props = {
  index: number;
  text: string;
  letter: string;
  disabled?: boolean;
  selected?: boolean;
  correct?: boolean;
  wrong?: boolean;
  revealedWrong?: boolean;
  onSelect: () => void;
};

export function AnswerButton({
  index,
  text,
  letter,
  disabled,
  selected,
  correct,
  wrong,
  revealedWrong,
  onSelect,
}: Props) {
  const tone = TONES[index] ?? TONES[0];
  let ring = "ring-transparent";
  let extra = "";
  if (correct) {
    ring = "ring-[3px] ring-white";
    extra = "brightness-110";
  } else if (wrong) {
    ring = "ring-[3px] ring-black/25";
    extra = "opacity-70 grayscale-[0.2]";
  } else if (selected) {
    ring = "ring-[3px] ring-white/85";
  } else if (revealedWrong) {
    extra = "opacity-45";
  }

  return (
    <button
      type="button"
      disabled={disabled || revealedWrong}
      onClick={() => {
        playSfx("answer");
        onSelect();
      }}
      className={`${tone.bg} ${ring} ${extra} pressable flex min-h-[clamp(3.8rem,12.5vw,4.6rem)] items-center gap-2.5 rounded-[1.15rem] px-3 py-2.5 text-left text-white shadow-[0_3px_0_rgba(40,20,10,0.22)] disabled:cursor-not-allowed`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 font-[family-name:var(--font-display)] text-xl font-black">
        {letter}
      </span>
      <span className="text-[clamp(0.95rem,3.7vw,1.15rem)] font-extrabold leading-snug">{text}</span>
    </button>
  );
}
