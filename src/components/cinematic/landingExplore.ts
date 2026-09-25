import { LEARNING_CARDS } from "@/components/landing/landingContent";
import { LEARNING_TOOL_COPY } from "@/components/learning/toolMeta";
import type { VisibleLearningToolId } from "@/types/learning";

export type ExplorePanel = "menu" | "subjects" | "tools" | "why";

export const EXPLORE_MENU = [
  {
    id: "subjects" as const,
    label: "Subjects",
    hint: "Form 4 catalogue",
  },
  {
    id: "tools" as const,
    label: "Learning Tools",
    hint: "Flashcards, quiz, mind maps",
  },
  {
    id: "why" as const,
    label: "Why AcadeMY",
    hint: "What Senior is for",
  },
] as const;

const TOOL_IMAGES: Record<VisibleLearningToolId, string> = {
  flashcards: LEARNING_CARDS[1].image,
  quiz: LEARNING_CARDS[0].image,
  "mind-map": LEARNING_CARDS[3].image,
};

export const EXPLORE_TOOLS: readonly {
  id: VisibleLearningToolId;
  title: string;
  body: string;
  image: string;
  icon: string;
}[] = (
  ["flashcards", "quiz", "mind-map"] as const
).map((id) => ({
  id,
  title: LEARNING_TOOL_COPY[id].title.en,
  body: LEARNING_TOOL_COPY[id].description.en,
  image: TOOL_IMAGES[id],
  icon: LEARNING_TOOL_COPY[id].icon,
}));

export const WHY_SENIOR = [
  "Structured Form 4–5 learning",
  "Revision tools: flashcards, quizzes, and mind maps",
  "Progress tracking as you move through chapters",
  "XP and a Senior leaderboard",
  "Bahasa Melayu and English",
] as const;
