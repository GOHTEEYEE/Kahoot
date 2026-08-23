"use client";

import { useEffect } from "react";
import { setBgmScene } from "./bgm";
import { setSfxScene, type SfxScene } from "./sfx";

/** Home UI vs combat: different SFX palette, and battle ducks the town BGM. */
export function useAudioScene(scene: SfxScene): void {
  useEffect(() => {
    setSfxScene(scene);
    setBgmScene(scene);
    return () => {
      setSfxScene("home");
      setBgmScene("home");
    };
  }, [scene]);
}
