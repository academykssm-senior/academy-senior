/**
 * Study Chat contracts.
 *
 * Future backend: Supabase Realtime on a moderated room.
 * Do not render emails, phone numbers, database UUIDs, or private profile fields.
 *
 * Moderation is not implemented in this phase, but every message carries a
 * status so filtering, reporting, and moderator deletion can be added later.
 */

export type StudyChatRole = "student" | "mentor" | "prefect";

export type StudyChatModerationStatus =
  | "visible"
  | "pending_review"
  | "hidden"
  | "removed";

export type StudyChatMessage = {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  role: StudyChatRole;
  body: string;
  createdAt: string;
  roomId: string;
  moderationStatus: StudyChatModerationStatus;
};

export type StudyChatRoom = {
  id: string;
  title: string;
};

export type SendStudyChatMessageInput = {
  roomId: string;
  body: string;
  displayName: string;
  userId: string;
};

export type SendStudyChatMessageResult =
  | { ok: true; persisted: false; message: StudyChatMessage }
  | { ok: false; reason: "empty" | "too_long" | "rate_limited" };
