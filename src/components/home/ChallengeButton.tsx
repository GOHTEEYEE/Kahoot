"use client";

import { playSfx } from "../../lib/audio/sfx";
import { getHomeCopy } from "../../lib/i18n/home";
import { useLocale } from "../../lib/i18n/useLocale";
import { GameButton } from "../game-ui/GameButton";

type Props = {
  onClick: () => void;
  disabled?: boolean;
};

export function ChallengeButton({ onClick, disabled }: Props) {
  const { locale } = useLocale();
  const copy = getHomeCopy(locale);

  return (
    <GameButton
      variant="gold"
      icon="challenge"
      iconSize="challenge"
      titleZh={copy.challenge}
      titleEn={copy.challengeSub}
      disabled={disabled}
      flexBasisClass="basis-[54%]"
      onClick={() => {
        playSfx("challenge");
        onClick();
      }}
    />
  );
}
