import type { LearningToolAvailability } from "@/types/learning";
import type { SubjectManifest } from "@/types/curriculum";

const coreTools = {
  flashcards: true,
  quiz: true,
  "mind-map": true,
} as const satisfies LearningToolAvailability;

export const mathematics = {
  id: "mathematics",
  form: 4,
  name: "Mathematics",
  nameBm: "Matematik",
  nameEn: "Mathematics",
  descriptionBm: "Fungsi kuadratik dan corak nombor.",
  descriptionEn: "Functions, numbers and problem solving.",
  artwork: "/assets/subjects/mathematics.webp",
  accent: "#5455B9",
  chapters: [
    {
      id: "chapter-01",
      number: 1,
      title: "Quadratic Functions",
      titleBm: "Fungsi Kuadratik",
      titleEn: "Quadratic Functions",
      languages: ["en", "bm"],
      tools: coreTools,
      routeAliases: ["quadratic-functions"],
    },
  ],
} as const satisfies SubjectManifest;
