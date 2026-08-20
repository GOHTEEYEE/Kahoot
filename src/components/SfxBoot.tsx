"use client";

import { useEffect } from "react";
import { armSfx } from "../lib/audio/sfx";

/** Unlocks Web Audio on the first tap so later Home SFX can play on iOS. */
export function SfxBoot() {
  useEffect(() => {
    armSfx();
  }, []);
  return null;
}
