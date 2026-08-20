"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion";

type Props = {
  value: number;
  className?: string;
};

export function TrophyCount({ value, className = "" }: Props) {
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);
  const displayRef = useRef(reduced ? value : 0);
  const first = useRef(true);

  useEffect(() => {
    if (reduced) {
      displayRef.current = value;
      setDisplay(value);
      return;
    }

    const start = first.current ? 0 : displayRef.current;
    first.current = false;
    if (start === value) {
      setDisplay(value);
      return;
    }

    const delta = value - start;
    const duration = 800;
    const startAt = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - startAt) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = Math.round(start + delta * eased);
      displayRef.current = next;
      setDisplay(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, reduced]);

  return (
    <span className={className} aria-label={`${value} 奖杯`}>
      {display}
    </span>
  );
}
