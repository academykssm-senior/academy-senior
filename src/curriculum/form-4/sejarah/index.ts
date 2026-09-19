import type { SubjectManifest } from "@/types/curriculum";

export const sejarah = {
  id: "sejarah",
  form: 4,
  name: "Sejarah",
  nameBm: "Sejarah",
  nameEn: "Sejarah",
  descriptionBm: "Sejarah Malaysia dan perkembangan dunia.",
  descriptionEn: "Malaysian history and world developments.",
  artwork: "/assets/subjects/sejarah.webp",
  accent: "#9A6235",
  artworkPosition: "52% 46%",
  chapters: [],
} as const satisfies SubjectManifest;
