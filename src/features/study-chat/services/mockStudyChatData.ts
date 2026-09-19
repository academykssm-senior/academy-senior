/**
 * DEV/MOCK Study Chat messages.
 * Isolated from UI rendering. Not persisted. Not production data.
 */

import type { StudyChatMessage } from "@/features/study-chat/types";

export const SENIOR_STUDY_CHAT_ROOM_ID = "senior-league";

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

export const MOCK_STUDY_CHAT_MESSAGES: readonly StudyChatMessage[] = [
  {
    id: "msg-01",
    userId: "farhan-k",
    displayName: "Farhan K.",
    avatarUrl: null,
    role: "student",
    body: "Just finished Chemistry Quiz Set A 💪",
    createdAt: minutesAgo(42),
    roomId: SENIOR_STUDY_CHAT_ROOM_ID,
    moderationStatus: "visible",
  },
  {
    id: "msg-02",
    userId: "mei-ling",
    displayName: "Mei Ling",
    avatarUrl: null,
    role: "prefect",
    body: "Anyone revising Add Maths tonight?",
    createdAt: minutesAgo(36),
    roomId: SENIOR_STUDY_CHAT_ROOM_ID,
    moderationStatus: "visible",
  },
  {
    id: "msg-03",
    userId: "zulkifli-h",
    displayName: "Zulkifli H.",
    avatarUrl: null,
    role: "student",
    body: "I finally reached Moon Explorer!",
    createdAt: minutesAgo(21),
    roomId: SENIOR_STUDY_CHAT_ROOM_ID,
    moderationStatus: "visible",
  },
  {
    id: "msg-04",
    userId: "cikgu-nadia",
    displayName: "Cikgu Nadia",
    avatarUrl: null,
    role: "mentor",
    body: "Good luck with your revision everyone.",
    createdAt: minutesAgo(12),
    roomId: SENIOR_STUDY_CHAT_ROOM_ID,
    moderationStatus: "visible",
  },
];
