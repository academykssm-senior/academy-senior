/**
 * Study Chat service boundary.
 *
 * Current: in-memory mock list + local-only send (not persisted, no Realtime).
 * Future: Supabase messages table + Realtime channel, with moderation status,
 * reporting, moderator deletion, rate limits, and blocked-term checks.
 */

import {
  MOCK_STUDY_CHAT_MESSAGES,
  SENIOR_STUDY_CHAT_ROOM_ID,
} from "@/features/study-chat/services/mockStudyChatData";
import type {
  SendStudyChatMessageInput,
  SendStudyChatMessageResult,
  StudyChatMessage,
} from "@/features/study-chat/types";

export const STUDY_CHAT_MAX_LENGTH = 500;
export const STUDY_CHAT_MIN_INTERVAL_MS = 800;

const localSessionMessages: StudyChatMessage[] = [];
let lastSendAt = 0;

export function isPubliclyVisible(message: StudyChatMessage): boolean {
  return message.moderationStatus === "visible";
}

export async function listStudyChatMessages(
  roomId: string = SENIOR_STUDY_CHAT_ROOM_ID,
): Promise<StudyChatMessage[]> {
  const combined = [
    ...MOCK_STUDY_CHAT_MESSAGES.filter((message) => message.roomId === roomId),
    ...localSessionMessages.filter((message) => message.roomId === roomId),
  ];

  return combined
    .filter(isPubliclyVisible)
    .slice()
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function sendStudyChatMessage(
  input: SendStudyChatMessageInput,
): Promise<SendStudyChatMessageResult> {
  const body = input.body.trim();
  if (body.length === 0) return { ok: false, reason: "empty" };
  if (body.length > STUDY_CHAT_MAX_LENGTH) return { ok: false, reason: "too_long" };

  const now = Date.now();
  if (now - lastSendAt < STUDY_CHAT_MIN_INTERVAL_MS) {
    return { ok: false, reason: "rate_limited" };
  }

  lastSendAt = now;

  const message: StudyChatMessage = {
    id: `local-${now}`,
    userId: input.userId,
    displayName: input.displayName,
    avatarUrl: null,
    role: "student",
    body,
    createdAt: new Date(now).toISOString(),
    roomId: input.roomId,
    moderationStatus: "visible",
  };

  localSessionMessages.push(message);

  return { ok: true, persisted: false, message };
}
