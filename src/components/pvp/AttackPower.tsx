"use client";

type Props = {
  label: string;
  value: number;
  tone: "ally" | "foe";
};

export function AttackPower({ label, value, tone }: Props) {
  return (
    <p
      className={`truncate text-[9px] font-extrabold tabular-nums ${
        tone === "ally" ? "text-[#b8ecff]" : "text-[#ffd0b8]"
      }`}
    >
      {label} ⚡ {value}
    </p>
  );
}
