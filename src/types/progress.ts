import type { LearningActivityIdentity } from "@/types/learning";

/**
 * Progress is keyed by learning activity identity.
 * Storage, XP, and completion flows are not implemented yet.
 */
export type ActivityProgressIdentity = LearningActivityIdentity;

export type ActivityProgressRecord = {
  identity: LearningActivityIdentity;
  completed: boolean;
  score?: number;
  completedAt?: string;
  lastAccessedAt?: string;
};

/** Optional UI extension point. Omit entirely when no real progress exists. */
export type SubjectProgressSummary = {
  completedChapters: number;
  totalChapters: number;
};

export type ChapterProgressSummary = {
  completed?: boolean;
};

export type ContinueLearningPoint = {
  identity: LearningActivityIdentity;
  label: string;
};
