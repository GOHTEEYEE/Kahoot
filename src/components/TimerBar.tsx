"use client";

type Props = {
  remainingMs: number;
  totalMs: number;
};

export function TimerBar({ remainingMs, totalMs }: Props) {
  const pct = Math.max(0, Math.min(100, (remainingMs / totalMs) * 100));
  const urgent = pct < 30;

  return (
    <div
      className={`h-3.5 w-full overflow-hidden rounded-full bg-white/50 shadow-inner ${
        urgent ? "animate-timer-urgent" : ""
      }`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-100 ease-linear ${
          urgent ? "bg-[var(--red)]" : "bg-[var(--brand)]"
        }`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
