import { Suspense } from "react";
import { FriendBattle } from "../../../components/challenge/FriendBattle";
import { LocaleLoading } from "../../../components/LocaleLoading";

export default function FriendPage() {
  return (
    <main className="flex min-h-full flex-1 flex-col">
      <Suspense fallback={<LocaleLoading />}>
        <FriendBattle />
      </Suspense>
    </main>
  );
}
