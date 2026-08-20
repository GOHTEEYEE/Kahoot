import { ChallengeBackground } from "../../components/challenge/ChallengeBackground";
import { ChallengeModeSelector } from "../../components/challenge/ChallengeModeSelector";

export default function ChallengePage() {
  return (
    <main className="challenge-page relative flex min-h-full flex-1 flex-col overflow-hidden">
      <ChallengeBackground />
      <ChallengeModeSelector />
    </main>
  );
}
