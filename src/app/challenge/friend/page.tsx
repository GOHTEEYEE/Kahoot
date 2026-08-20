import { Suspense } from "react";
import { FriendBattle } from "../../../components/challenge/FriendBattle";

export default function FriendPage() {
  return (
    <main className="flex min-h-full flex-1 flex-col">
      <Suspense fallback={<div className="flex flex-1 items-center justify-center text-sm font-bold text-[#6b5340]">加载中...</div>}>
        <FriendBattle />
      </Suspense>
    </main>
  );
}
