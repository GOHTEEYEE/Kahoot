"use client";

import { useEffect, useState } from "react";
import { isBgmMuted, subscribeBgmMute } from "./bgm";

export function useBgmMuted(): boolean {
  const [muted, setMuted] = useState(false);
  useEffect(() => {
    setMuted(isBgmMuted());
    return subscribeBgmMute(() => setMuted(isBgmMuted()));
  }, []);
  return muted;
}
