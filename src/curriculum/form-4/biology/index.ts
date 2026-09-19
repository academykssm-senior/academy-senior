import type { LearningToolAvailability } from "@/types/learning";
import type { SubjectManifest } from "@/types/curriculum";

const coreTools = {
  flashcards: true,
  quiz: true,
  "mind-map": true,
} as const satisfies LearningToolAvailability;

export const biology = {
  id: "biology",
  form: 4,
  name: "Biology",
  nameBm: "Biologi",
  nameEn: "Biology",
  descriptionBm: "Sel, biomolekul, dan asas kehidupan.",
  descriptionEn: "Cells, living systems and biodiversity.",
  artwork: "/assets/subjects/biology.webp",
  accent: "#27805F",
  artworkPosition: "48% 42%",
  chapters: [
    {
      id: "chapter-01",
      number: 1,
      title: "Cell Structure",
      titleBm: "Struktur Sel",
      titleEn: "Cell Structure",
      languages: ["en", "bm"],
      tools: coreTools,
      routeAliases: ["cell-structure"],
    },
    {
      id: "chapter-02",
      number: 2,
      title: "Biomolecules",
      titleBm: "Biomolekul",
      titleEn: "Biomolecules",
      languages: ["en", "bm"],
      tools: coreTools,
      routeAliases: ["biomolecules"],
    },
  ],
} as const satisfies SubjectManifest;
