import type { FriendPlayer, FriendRoom } from "../../../lib/friend";
import type { Grade, SubjectId } from "../../../lib/curriculum";
import { pickMatchQuestions, scoreForAnswer } from "../../../lib/questions";
import {
  dbDeleteRoom,
  dbGetRoom,
  dbHasCode,
  dbSaveRoom,
  friendRoomDbConfigured,
} from "../../../lib/friendRoomDb";

const GRADES: Grade[] = [1, 2, 3, 4, 5, 6];
const SUBJECTS: SubjectId[] = ["chinese", "english", "malay", "math", "science"];

async function randomCode(): Promise<string> {
  for (let i = 0; i < 12; i++) {
    const code = String(100000 + Math.floor(Math.random() * 900000));
    if (!(await dbHasCode(code))) return code;
  }
  return String(Date.now()).slice(-6);
}

function isPlayer(value: unknown): value is FriendPlayer {
  if (!value || typeof value !== "object") return false;
  const p = value as FriendPlayer;
  return (
    typeof p.id === "string" &&
    p.id.length > 0 &&
    typeof p.nickname === "string" &&
    p.nickname.length > 0 &&
    typeof p.trophies === "number"
  );
}

function isGrade(value: unknown): value is Grade {
  return typeof value === "number" && GRADES.includes(value as Grade);
}

function isSubject(value: unknown): value is SubjectId {
  return typeof value === "string" && SUBJECTS.includes(value as SubjectId);
}

function productionNeedsDb(): boolean {
  return process.env.NODE_ENV === "production" && !friendRoomDbConfigured();
}

export async function GET(req: Request) {
  try {
    if (productionNeedsDb()) {
      return Response.json({ error: "db_required" }, { status: 503 });
    }
    const code = new URL(req.url).searchParams.get("code")?.trim() ?? "";
    const room = await dbGetRoom(code);
    if (!room) return Response.json({ error: "not_found" }, { status: 404 });
    return Response.json({ room });
  } catch {
    return Response.json({ error: "db_error" }, { status: 503 });
  }
}

export async function POST(req: Request) {
  let body: {
    action?: string;
    host?: FriendPlayer;
    guest?: FriendPlayer;
    code?: string;
    hostId?: string;
    playerId?: string;
    grade?: Grade;
    subject?: SubjectId;
    index?: number;
    choice?: number | null;
    remainingMs?: number;
  };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return Response.json({ error: "invalid" }, { status: 400 });
  }

  try {
    if (productionNeedsDb()) {
      return Response.json({ error: "db_required" }, { status: 503 });
    }

    if (body.action === "create") {
      if (!isPlayer(body.host) || !isGrade(body.grade) || !isSubject(body.subject)) {
        return Response.json({ error: "invalid" }, { status: 400 });
      }
      const room: FriendRoom = {
        code: await randomCode(),
        host: body.host,
        guest: null,
        status: "waiting",
        createdAt: Date.now(),
        grade: body.grade,
        subject: body.subject,
        questions: [],
        hostAnswers: [],
        guestAnswers: [],
      };
      await dbSaveRoom(room);
      return Response.json({ room });
    }

    if (body.action === "join") {
      const code = body.code?.trim() ?? "";
      if (!code || !isPlayer(body.guest)) {
        return Response.json({ error: "invalid" }, { status: 400 });
      }
      const room = await dbGetRoom(code);
      if (!room) return Response.json({ error: "not_found" }, { status: 404 });
      if (room.host.id === body.guest.id) {
        return Response.json({ error: "self" }, { status: 409 });
      }
      if (room.status === "ready" || room.guest) {
        return Response.json({ error: "full" }, { status: 409 });
      }
      const next: FriendRoom = {
        ...room,
        guest: body.guest,
        status: "ready",
        questions: pickMatchQuestions(room.grade, room.subject),
      };
      await dbSaveRoom(next);
      return Response.json({ room: next });
    }

    if (body.action === "answer") {
      const code = body.code?.trim() ?? "";
      const playerId = body.playerId ?? "";
      const index = body.index;
      const room = await dbGetRoom(code);
      if (!room || typeof index !== "number" || !playerId) {
        return Response.json({ error: "not_found" }, { status: 404 });
      }
      const question = room.questions[index];
      if (!question) return Response.json({ error: "invalid" }, { status: 400 });

      const isHost = room.host.id === playerId;
      const isGuest = room.guest?.id === playerId;
      if (!isHost && !isGuest) return Response.json({ error: "invalid" }, { status: 400 });

      const answers = isHost ? [...room.hostAnswers] : [...room.guestAnswers];
      if (answers[index] != null) {
        return Response.json({ room });
      }
      while (answers.length < index) {
        answers.push({ choice: null, score: 0 });
      }
      const remainingMs = typeof body.remainingMs === "number" ? body.remainingMs : 0;
      const choice = typeof body.choice === "number" ? body.choice : null;
      const correct = choice !== null && choice === question.correctIndex;
      answers[index] = { choice, score: scoreForAnswer(correct, remainingMs) };

      const next: FriendRoom = isHost
        ? { ...room, hostAnswers: answers }
        : { ...room, guestAnswers: answers };
      await dbSaveRoom(next);
      return Response.json({ room: next });
    }

    if (body.action === "cancel") {
      const code = body.code?.trim() ?? "";
      const room = await dbGetRoom(code);
      if (room && room.host.id === body.hostId) await dbDeleteRoom(code);
      return Response.json({ ok: true });
    }

    return Response.json({ error: "invalid" }, { status: 400 });
  } catch {
    return Response.json({ error: "db_error" }, { status: 503 });
  }
}
