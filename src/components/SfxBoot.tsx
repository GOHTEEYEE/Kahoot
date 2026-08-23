"use client";

import { useEffect } from "react";
import { armBgm } from "../lib/audio/bgm";
import { armSfx } from "../lib/audio/sfx";

/** Unlocks Web Audio + BGM on the first tap so Home SFX/music can play on iOS. */
export function SfxBoot() {
  useEffect(() => {
    armSfx();
    armBgm();
  }, []);
  return null;
}
