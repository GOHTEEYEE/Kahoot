"use client";

type Props = {
  elapsedMs: number;
  capMs: number;
  locked?: boolean;
  label: (sec: string) => string;
};

export function BattleTimer({ elapsedMs, capMs, locked, label }: Props) {
  const sec = (Math.min(elapsedMs, capMs) / 1000).toFixed(1);
  const urgent = !locked && elapsedMs > capMs * 0.7;
  return (
    <p
      className={`font-[family-name:var(--font-display)] text-sm font-bold tabular-nums ${
        locked ? "text-[#1f8f38]" : urgent ? "text-[#d44a28]" : "text-[#5a3a20]"
      }`}
    >
      {label(sec)}
    </p>
  );
}
