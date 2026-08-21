import { LeaderboardClient } from "../../components/LeaderboardClient";

export default function LeaderboardPage() {
  return (
    <main className="relative flex h-[100dvh] min-h-0 flex-1 flex-col overflow-hidden">
      <LeaderboardClient />
    </main>
  );
}
