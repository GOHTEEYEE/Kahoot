"use client";

import { useEffect, useState } from "react";
import { playSfx } from "../lib/audio/sfx";
import { getPlayCopy } from "../lib/i18n/play";
import { useLocale } from "../lib/i18n/useLocale";

type Props = {
  onDone: () => void;
};

export function CountdownOverlay({ onDone }: Props) {
  const { locale } = useLocale();
  const go = getPlayCopy(locale).countdownGo;
  const steps = ["3", "2", "1", go];
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= steps.length) {
      onDone();
      return;
    }
    playSfx(step === steps.length - 1 ? "go" : "countdown");
    const ms = step === steps.length - 1 ? 700 : 550;
    const timer = window.setTimeout(() => setStep((s) => s + 1), ms);
    return () => window.clearTimeout(timer);
  }, [step, onDone, steps.length]);

  if (step >= steps.length) return null;

  const label = steps[step];
  const isGo = step === steps.length - 1;

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
