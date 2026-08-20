"use client";

import { useEffect, useState } from "react";
import { isSfxMuted, subscribeSfxMute } from "./sfx";

export function useSfxMuted(): boolean {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(isSfxMuted());
    return subscribeSfxMute(() => setMuted(isSfxMuted()));
  }, []);

  return muted;
}
