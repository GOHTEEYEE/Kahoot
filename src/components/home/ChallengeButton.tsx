"use client";

import { playSfx } from "../../lib/audio/sfx";
import { GameButton } from "../game-ui/GameButton";

type Props = {
  onClick: () => void;
  disabled?: boolean;
};

export function ChallengeButton({ onClick, disabled }: Props) {
  return (
    <GameButton
      variant="gold"
      icon="challenge"
      iconSize="challenge"
      titleZh="挑战"
      titleEn="CHALLENGE"
      disabled={disabled}
      flexBasisClass="basis-[58%]"
      onClick={() => {
        playSfx("challenge");
        onClick();
      }}
    />
  );
}
