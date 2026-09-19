import type { VisibleLearningToolId } from "@/types/learning";
import type { ContentLanguage } from "@/types/curriculum";

export const LEARNING_TOOL_ROUTES = {
  flashcards: "/f4/$lang/$subject/$chapter/flashcards",
  quiz: "/f4/$lang/$subject/$chapter/quiz",
  "mind-map": "/f4/$lang/$subject/$chapter/mind-map",
} as const;

export type LearningToolRoute = (typeof LEARNING_TOOL_ROUTES)[VisibleLearningToolId];

type ToolCopy = {
  icon: string;
  title: Record<ContentLanguage, string>;
  description: Record<ContentLanguage, string>;
  action: Record<ContentLanguage, string>;
};

export const LEARNING_TOOL_COPY: Record<VisibleLearningToolId, ToolCopy> = {
  flashcards: {
    icon: "style",
    title: { bm: "Kad imbas", en: "Flashcards" },
    description: {
      bm: "Ulang kaji konsep dan definisi utama.",
      en: "Review key concepts and definitions.",
    },
    action: { bm: "Buka", en: "Open" },
  },
  quiz: {
    icon: "quiz",
    title: { bm: "Kuiz", en: "Quiz" },
    description: {
      bm: "Uji pemahaman anda.",
      en: "Test your understanding.",
    },
    action: { bm: "Buka", en: "Open" },
  },
  "mind-map": {
    icon: "hub",
    title: { bm: "Peta minda", en: "Mind Map" },
    description: {
      bm: "Lihat hubungan topik secara visual.",
      en: "Explore chapter relationships visually.",
    },
    action: { bm: "Buka", en: "Open" },
  },
};
