import type { LearningToolAvailability } from "@/types/learning";
import type { SubjectManifest } from "@/types/curriculum";

const coreTools = {
  flashcards: true,
  quiz: true,
  "mind-map": true,
} as const satisfies LearningToolAvailability;

export const chemistry = {
  id: "chemistry",
  form: 4,
  name: "Chemistry",
  nameBm: "Kimia",
  nameEn: "Chemistry",
  descriptionBm: "Struktur atom dan ikatan kimia.",
  descriptionEn: "Matter, atoms and chemical interactions.",
  artwork: "/assets/subjects/chemistry.webp",
  accent: "#A84769",
  artworkPosition: "54% 46%",
  chapters: [
    {
      id: "chapter-01",
      number: 1,
      title: "Atomic Structure",
      titleBm: "Struktur Atom",
      titleEn: "Atomic Structure",
      languages: ["en", "bm"],
      tools: coreTools,
      routeAliases: ["atomic-structure"],
    },
  ],
} as const satisfies SubjectManifest;
