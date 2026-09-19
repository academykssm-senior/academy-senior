import type { SubjectManifest } from "@/types/curriculum";

export const english = {
  id: "english",
  form: 4,
  name: "English",
  nameBm: "Bahasa Inggeris",
  nameEn: "English",
  descriptionBm: "Kemahiran bahasa, penulisan dan pemahaman.",
  descriptionEn: "Language skills, writing and comprehension.",
  artwork: "/assets/subjects/english.webp",
  accent: "#3567B7",
  artworkPosition: "55% 42%",
  chapters: [],
} as const satisfies SubjectManifest;
