"use client";

import { useEffect, useState } from "react";

type Props = {
  onDone: () => void;
};

const STEPS = ["3", "2", "1", "开始!"] as const;

export function CountdownOverlay({ onDone }: Props) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= STEPS.length) {
      onDone();
      return;
    }
    const ms = step === STEPS.length - 1 ? 700 : 550;
    const timer = window.setTimeout(() => setStep((s) => s + 1), ms);
    return () => window.clearTimeout(timer);
  }, [step, onDone]);

  if (step >= STEPS.length) return null;

  const label = STEPS[step];
  const isGo = label === "开始!";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(20,53,47,0.45)] backdrop-blur-[2px]">
      <div
        key={label}
        className={`animate-countdown-punch font-[family-name:var(--font-display)] font-bold text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)] ${
          isGo ? "text-7xl text-[var(--accent)] sm:text-8xl" : "text-8xl sm:text-9xl"
        }`}
      >
        {label}
      </div>
    </div>
  );
}
