import type { SubjectManifest } from "@/types/curriculum";

export const physics = {
  id: "physics",
  form: 4,
  name: "Physics",
  nameBm: "Fizik",
  nameEn: "Physics",
  descriptionBm: "Daya, tenaga, gelombang dan elektrik.",
  descriptionEn: "Forces, energy, waves and electricity.",
  artwork: "/assets/subjects/physics.webp",
  accent: "#3286A5",
  artworkPosition: "50% 44%",
  chapters: [],
} as const satisfies SubjectManifest;
