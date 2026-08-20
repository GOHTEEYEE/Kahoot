"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChallengeShell } from "./ChallengeShell";
import {
  cancelFriendRoom,
  createFriendRoom,
  getFriendRoom,
  joinFriendRoom,
  friendAsOpponent,
  type FriendPlayer,
} from "../../lib/friend";
import { setPendingOpponent } from "../../lib/opponent";
import { getCurrentAccount, getSelectedSubject, getSubjectStats } from "../../lib/storage";
import { playSfx } from "../../lib/audio/sfx";

type Phase = "lobby" | "waiting" | "joining";

function currentPlayer(): FriendPlayer | null {
  const account = getCurrentAccount();
  if (!account) return null;
  const subject = getSelectedSubject();
  return {
    id: account.id,
    nickname: account.displayName,
    trophies: getSubjectStats(account, subject).trophies,
  };
}

function inviteUrl(code: string): string {
  if (typeof window === "undefined") return code;
  const url = new URL("/challenge/friend", window.location.origin);
  url.searchParams.set("code", code);
  return url.toString();
}

export function FriendBattle() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState("");
  const [phase, setPhase] = useState<Phase>("lobby");
  const [hint, setHint] = useState("");
  const startedRef = useRef(false);
  const autoJoinTried = useRef(false);

  useEffect(() => {
    const fromLink = searchParams.get("code")?.replace(/\D/g, "").slice(0, 6) ?? "";
    if (fromLink.length === 6) setCodeInput(fromLink);
  }, [searchParams]);

  useEffect(() => {
    const fromLink = searchParams.get("code")?.replace(/\D/g, "").slice(0, 6) ?? "";
    if (fromLink.length !== 6 || autoJoinTried.current) return;
    if (!getCurrentAccount()) return;
    autoJoinTried.current = true;
    void (async () => {
      setCodeInput(fromLink);
      setPhase("joining");
      const guest = currentPlayer();
      if (!guest) {
        setPhase("lobby");
        setHint("请先登录另一个账号再打开邀请链接");
        return;
      }
      const result = await joinFriendRoom(fromLink, guest);
      if (result.ok && result.room.host && !startedRef.current) {
        startedRef.current = true;
        setPendingOpponent(
          friendAsOpponent(result.room.host, { roomCode: result.room.code, role: "guest" }),
        );
        playSfx("challenge");
        router.push("/battle");
        return;
      }
      setPhase("lobby");
      setHint(!result.ok ? result.error : "加入失败，请重试");
    })();
  }, [searchParams, router]);

  useEffect(() => {
    if (!roomCode || phase !== "waiting") return;

    const timer = window.setInterval(async () => {
      const room = await getFriendRoom(roomCode);
      if (!room || room.status !== "ready" || !room.guest || startedRef.current) return;
      startedRef.current = true;
      setPendingOpponent(friendAsOpponent(room.guest, { roomCode, role: "host" }));
      playSfx("challenge");
      router.push("/battle");
    }, 800);

    return () => window.clearInterval(timer);
  }, [roomCode, phase, router]);

  async function onCreate() {
    const host = currentPlayer();
    if (!host) return;

    setHint("正在创建房间...");
    const account = getCurrentAccount();
    if (!account) return;
    const result = await createFriendRoom(host, account.grade, getSelectedSubject());

    if (result.ok) {
      setRoomCode(result.room.code);
      setPhase("waiting");
      setHint("");
      playSfx("hud");
      return;
    }
    setHint(result.error);
  }

  async function onJoin() {
    const guest = currentPlayer();
    if (!guest) return;

    const trimmed = codeInput.trim();
    if (trimmed.length < 6) {
      setHint("请输入房主手机上显示的 6 位房间码");
      return;
    }

    setPhase("joining");
    const result = await joinFriendRoom(trimmed, guest);

    if (result.ok && result.room.host && !startedRef.current) {
      startedRef.current = true;
      setPendingOpponent(
        friendAsOpponent(result.room.host, { roomCode: result.room.code, role: "guest" }),
      );
      playSfx("challenge");
      router.push("/battle");
      return;
    }

    setPhase("lobby");
    setHint(!result.ok ? result.error : "加入失败，请重试");
  }

  async function copyCode() {
    if (!roomCode) return;
    try {
      await navigator.clipboard.writeText(roomCode);
      setHint("已复制房间码");
      playSfx("tap");
    } catch {
      setHint(roomCode);
    }
  }

  async function copyInviteLink() {
    if (!roomCode) return;
    const link = inviteUrl(roomCode);
    try {
      await navigator.clipboard.writeText(link);
      setHint("已复制邀请链接，发给朋友打开即可加入");
      playSfx("tap");
    } catch {
      setHint(link);
    }
  }

  async function backToLobby() {
    const host = currentPlayer();
    if (roomCode && host) await cancelFriendRoom(roomCode, host.id);
    setRoomCode(null);
    setPhase("lobby");
    setHint("");
    startedRef.current = false;
  }

  return (
    <ChallengeShell title="Friend Battle" subtitle="在线联机 · 房间码或邀请链接" backHref="/challenge">
      {phase === "lobby" || phase === "joining" ? (
        <div className="flex flex-1 flex-col gap-4 pt-2">
          <button
            type="button"
            onClick={onCreate}
            disabled={phase === "joining"}
            className="cta-gold rounded-[1.2rem] py-4 font-[family-name:var(--font-display)] text-xl font-bold text-[#4a320e] disabled:opacity-50"
          >
            Create Room
          </button>
          <div className="hud-dark rounded-[1.2rem] p-4">
            <p className="text-[10px] font-extrabold tracking-[0.14em] text-[#c4b08a] uppercase">
              Enter Room Code
            </p>
            <input
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              placeholder="582913"
              className="mt-2 w-full rounded-[0.9rem] bg-[#fff8ea] px-3 py-3 text-center font-[family-name:var(--font-display)] text-2xl font-bold tracking-[0.3em] text-[#2a2118] outline-none"
            />
            <button
              type="button"
              onClick={onJoin}
              disabled={phase === "joining"}
              className="cta-green mt-3 w-full rounded-[1.05rem] py-3 font-[family-name:var(--font-display)] text-lg font-bold text-white disabled:opacity-50"
            >
              {phase === "joining" ? "加入中..." : "Join"}
            </button>
          </div>
          {hint ? <p className="text-center text-sm font-extrabold text-[#8a5a18]">{hint}</p> : null}
          <p className="text-center text-[11px] font-bold leading-relaxed text-[#6b5340]">
            一台手机点 Create Room，把房间码或邀请链接发给朋友；对方用另一个账号登录后 Join。
          </p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <p className="text-[10px] font-extrabold tracking-[0.16em] text-[#8a5a18] uppercase">
            Your Room Code
          </p>
          <p className="font-[family-name:var(--font-display)] text-5xl font-bold tracking-[0.18em] text-[#2a2118]">
            {roomCode}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={copyCode}
              className="hud-chip rounded-full px-4 py-2 text-sm font-extrabold text-[#3d2f1e]"
            >
              Copy Code
            </button>
            <button
              type="button"
              onClick={copyInviteLink}
              className="cta-green rounded-full px-4 py-2 text-sm font-extrabold text-white"
            >
              Copy Invite Link
            </button>
          </div>
          <p className="mt-4 font-[family-name:var(--font-display)] text-lg font-bold text-[#2a2118]">
            Waiting for Friend...
          </p>
          <p className="max-w-[18rem] text-[12px] font-bold text-[#6b5340]">
            把房间码或邀请链接发给另一台手机。对方登录不同账号后打开链接，对战会自动开始。
          </p>
          {hint ? <p className="text-sm font-bold text-[#8a5a18]">{hint}</p> : null}
          <button
            onClick={backToLobby}
            className="mt-6 text-xs font-bold text-[#6b5340] underline"
          >
            返回
          </button>
        </div>
      )}
    </ChallengeShell>
  );
}
