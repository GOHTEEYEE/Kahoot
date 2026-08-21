"use client";

import { useState } from "react";
import { playSfx } from "../../lib/audio/sfx";
import { getHomeCopy } from "../../lib/i18n/home";
import { useLocale } from "../../lib/i18n/useLocale";
import { usePrefersReducedMotion } from "../../lib/usePrefersReducedMotion";
import { QuickActionCard } from "./QuickActionCard";

type Props = {
  onChest?: () => void;
  onMission?: () => void;
  onEvent?: () => void;
  onSeason?: () => void;
  onWorld?: () => void;
};

/** Compact quick-action columns framing the island hero. */
export function SideActions({ onChest, onMission, onEvent, onSeason, onWorld }: Props) {
  const reduced = usePrefersReducedMotion();
  const { locale } = useLocale();
  const copy = getHomeCopy(locale);
  const [sparkle, setSparkle] = useState(false);

  return (
    <>
      <div className="quick-action-stack quick-action-stack--left">
        <QuickActionCard
          title={copy.dailyChest}
          meta="3/10"
          icon="chest"
          sparkle={sparkle}
          reduced={reduced}
          onClick={() => {
            playSfx("chest");
            setSparkle(true);
            window.setTimeout(() => setSparkle(false), 700);
            onChest?.();
          }}
        />
        <QuickActionCard
          title={copy.dailyMission}
          meta="4/5"
          icon="mission"
          reduced={reduced}
          delay={0.25}
          onClick={() => {
            playSfx("mission");
            onMission?.();
          }}
        />
        <QuickActionCard
          title={copy.battlePass}
          meta="Lv.12"
          icon="pass"
          reduced={reduced}
          href="/rewards"
          onClick={() => playSfx("pass")}
        />
      </div>

      <div className="quick-action-stack quick-action-stack--right">
        <QuickActionCard
          title={copy.events}
          meta="2d 10h"
          icon="event"
          badge
          reduced={reduced}
          delay={0.15}
          onClick={() => {
            playSfx("hud");
            onEvent?.();
          }}
        />
        <QuickActionCard
          title={copy.season}
          meta="4d 21h"
          icon="trophy"
          reduced={reduced}
          delay={0.4}
          onClick={() => {
            playSfx("hud");
            onSeason?.();
          }}
        />
        <QuickActionCard
          title={copy.world}
          meta="World"
          icon="map"
          reduced={reduced}
          delay={0.55}
          onClick={() => {
            playSfx("whoosh");
            onWorld?.();
          }}
        />
      </div>
    </>
  );
}
