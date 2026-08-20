import type { FriendRoom } from "./friend";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const ROOM_TTL_MS = 20 * 60 * 1000;
const TABLE = "friend_rooms";

function isPlaceholder(value: string | undefined): boolean {
  if (!value) return true;
  const v = value.toLowerCase();
  return (
    v.includes("placeholder") ||
    v.includes("your-project") ||
    v.includes("your_supabase") ||
    v === "https://placeholder.supabase.co"
  );
}

export function friendRoomDbConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && !isPlaceholder(url) && !isPlaceholder(key) && key.length > 40);
}

function client(): SupabaseClient | null {
  if (!friendRoomDbConfigured()) return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** In-memory fallback — only reliable on a single Node process (local `next dev`). */
type MemoryStore = { rooms: Map<string, FriendRoom> };

function memory(): MemoryStore {
  const g = globalThis as typeof globalThis & { __matharenaFriendRooms?: MemoryStore };
  if (!g.__matharenaFriendRooms) g.__matharenaFriendRooms = { rooms: new Map() };
  return g.__matharenaFriendRooms;
}

function isExpired(room: FriendRoom): boolean {
  return Date.now() - room.createdAt > ROOM_TTL_MS;
}

export async function dbGetRoom(code: string): Promise<FriendRoom | null> {
  const sb = client();
  if (!sb) {
    const room = memory().rooms.get(code) ?? null;
    if (room && isExpired(room)) {
      memory().rooms.delete(code);
      return null;
    }
    return room;
  }

  const { data, error } = await sb.from(TABLE).select("payload").eq("code", code).maybeSingle();
  if (error) {
    console.error("friend_rooms get failed", error.message);
    throw new Error("db_error");
  }
  if (!data?.payload) return null;
  const room = data.payload as FriendRoom;
  if (isExpired(room)) {
    await sb.from(TABLE).delete().eq("code", code);
    return null;
  }
  return room;
}

export async function dbSaveRoom(room: FriendRoom): Promise<void> {
  const sb = client();
  if (!sb) {
    memory().rooms.set(room.code, room);
    return;
  }

  const { error } = await sb.from(TABLE).upsert(
    {
      code: room.code,
      payload: room,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "code" },
  );
  if (error) {
    console.error("friend_rooms save failed", error.message);
    throw new Error("db_error");
  }
}

export async function dbDeleteRoom(code: string): Promise<void> {
  const sb = client();
  if (!sb) {
    memory().rooms.delete(code);
    return;
  }
  const { error } = await sb.from(TABLE).delete().eq("code", code);
  if (error) {
    console.error("friend_rooms delete failed", error.message);
    throw new Error("db_error");
  }
}

export async function dbHasCode(code: string): Promise<boolean> {
  return (await dbGetRoom(code)) != null;
}
