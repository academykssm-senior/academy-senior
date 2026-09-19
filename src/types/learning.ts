import type {
  ChapterId,
  ContentLanguage,
  FormLevel,
  SubjectId,
} from "@/types/curriculum";

export const VISIBLE_LEARNING_TOOLS = ["flashcards", "quiz", "mind-map"] as const;

export type VisibleLearningToolId = (typeof VISIBLE_LEARNING_TOOLS)[number];

/**
 * `notes` is reserved so a Notes tool can be added later without
 * restructuring. It is not displayed in Phase 1.
 */
export type LearningToolId = VisibleLearningToolId | "notes";

export type ActivityId = string;

export type LearningToolAvailability = {
  flashcards: boolean;
  quiz: boolean;
  "mind-map": boolean;
  notes?: boolean;
};

/**
 * One addressable learning activity.
 * Future key for progress, XP, completion, Continue Learning, and analytics.
 */
export type LearningActivityIdentity = {
  form: FormLevel;
  subjectId: SubjectId;
  chapterId: ChapterId;
  toolId: LearningToolId;
  activityId: ActivityId;
  language: ContentLanguage;
};

export function visibleToolIds(
  tools: LearningToolAvailability,
): VisibleLearningToolId[] {
  return VISIBLE_LEARNING_TOOLS.filter((toolId) => tools[toolId]);
}

export function learningActivityKey(identity: LearningActivityIdentity): string {
  return [
    identity.form,
    identity.subjectId,
    identity.chapterId,
    identity.toolId,
    identity.activityId,
    identity.language,
  ].join(":");
}
