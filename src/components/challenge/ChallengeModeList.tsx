import type { ChallengeModeMeta } from "../../lib/challenge";
import type { ChallengeCopy } from "../../lib/i18n/challenge";
import { ChallengeModeCard } from "./ChallengeModeCard";

type Props = {
  modes: ChallengeModeMeta[];
  copy: ChallengeCopy;
};

export function ChallengeModeList({ modes, copy }: Props) {
  return (
    <div className="challenge-mode-list flex flex-1 flex-col gap-[0.62rem] sm:gap-2.5">
      {modes.map((mode, i) => (
        <ChallengeModeCard key={mode.id} mode={mode} copy={copy} delay={i * 0.05} />
      ))}
    </div>
  );
}
