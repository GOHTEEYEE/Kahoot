import type { Grade, SubjectId } from "./curriculum";
import type { BattleOpponent } from "./opponent";
import type { Question } from "./questions";

export type FriendPlayer = {
  id: string;
  nickname: string;
  trophies: number;
};

export type FriendAnswer = {
  choice: number | null;
  score: number;
};

export type FriendRoom = {
  code: string;
  host: FriendPlayer;
  guest: FriendPlayer | null;
  status: "waiting" | "ready";
  createdAt: number;
  grade: Grade;
  subject: SubjectId;
  questions: Question[];
  hostAnswers: FriendAnswer[];
  guestAnswers: FriendAnswer[];
};

export function friendAsOpponent(
  player: FriendPlayer,
  extra?: { roomCode: string; role: "host" | "guest" },
): BattleOpponent {
  return {
    type: "friend",
    id: player.id,
    nickname: player.nickname,
    trophies: player.trophies,
    roomCode: extra?.roomCode,
    role: extra?.role,
  };
}

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  try {
    const res = await fetch(path, {
      cache: "no-store",
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
    const body = (await res.json().catch(() => ({}))) as {
      room?: T;
      error?: string;
    };
    if (!res.ok) {
      const map: Record<string, string> = {
        not_found: "房间不存在或已过期，请让房主重新开房",
        self: "不能加入自己的房间，请用另一个账号登录",
        full: "房间已满",
        invalid: "请求无效，请重试",
        db_required: "线上好友对战需要配置 Supabase，请看 supabase_friend_rooms.sql",
        db_error: "房间服务器暂时不可用，请稍后再试",
      };
      return { ok: false, error: map[body.error ?? ""] ?? "连线失败，请重试" };
    }
    return { ok: true, data: (body.room ?? body) as T };
  } catch (e) {
    console.error("Friend room request failed", e);
    return { ok: false, error: "网络连不上，请检查网络后重试" };
  }
}

export async function createFriendRoom(
  host: FriendPlayer,
  grade: Grade,
  subject: SubjectId,
): Promise<{ ok: true; room: FriendRoom } | { ok: false; error: string }> {
  const res = await request<FriendRoom>("/api/friend-room", {
    method: "POST",
    body: JSON.stringify({ action: "create", host, grade, subject }),
  });
  if (!res.ok) return res;
  return { ok: true, room: res.data };
}

export async function joinFriendRoom(
  code: string,
  guest: FriendPlayer,
): Promise<{ ok: true; room: FriendRoom } | { ok: false; error: string }> {
  const res = await request<FriendRoom>("/api/friend-room", {
    method: "POST",
    body: JSON.stringify({ action: "join", code, guest }),
  });
  if (!res.ok) return res;
  return { ok: true, room: res.data };
}

export async function getFriendRoom(code: string): Promise<FriendRoom | null> {
  const res = await request<FriendRoom>(`/api/friend-room?code=${encodeURIComponent(code)}`);
  return res.ok ? res.data : null;
}

export async function submitFriendAnswer(input: {
  code: string;
  playerId: string;
  index: number;
  choice: number | null;
  remainingMs: number;
}): Promise<FriendRoom | null> {
  const res = await request<FriendRoom>("/api/friend-room", {
    method: "POST",
    body: JSON.stringify({ action: "answer", ...input }),
  });
  return res.ok ? res.data : null;
}

export async function cancelFriendRoom(code: string, hostId: string): Promise<void> {
  await request("/api/friend-room", {
    method: "POST",
    body: JSON.stringify({ action: "cancel", code, hostId }),
  });
}

export function myAnswers(room: FriendRoom, playerId: string): FriendAnswer[] {
  return room.host.id === playerId ? room.hostAnswers : room.guestAnswers;
}

export function foeAnswers(room: FriendRoom, playerId: string): FriendAnswer[] {
  return room.host.id === playerId ? room.guestAnswers : room.hostAnswers;
}
