import type { GameIconId } from "../../lib/gameIcons";
import { GameIcon } from "../home/GameIcon";

type Props = {
  icon: GameIconId;
  label: string;
};

export function ChallengeReward({ icon, label }: Props) {
  return (
    <span className="challenge-reward mt-1 inline-flex items-center gap-1.5">
      <GameIcon name={icon} className="h-[18px] w-[18px]" />
      <span className="text-[clamp(0.62rem,2.2vw,0.72rem)] font-extrabold leading-none">
        {label}
      </span>
    </span>
  );
}
