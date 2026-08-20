"use client";

import { CHALLENGE_MODES } from "../../lib/challenge";
import { getChallengeCopy } from "../../lib/i18n/challenge";
import { useLocale } from "../../lib/i18n/useLocale";
import { ChallengeHeader } from "./ChallengeHeader";
import { ChallengeModeList } from "./ChallengeModeList";

export function ChallengeModeSelector() {
  const { locale } = useLocale();
  const copy = getChallengeCopy(locale);

  return (
    <div className="challenge-shell relative z-10 mx-auto flex min-h-full w-full max-w-[430px] flex-1 flex-col px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))] sm:max-w-lg">
      <ChallengeHeader copy={copy} backHref="/" />
      <ChallengeModeList modes={CHALLENGE_MODES} copy={copy} />
    </div>
  );
}
