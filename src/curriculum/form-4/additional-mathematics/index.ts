import type { SubjectManifest } from "@/types/curriculum";

export const additionalMathematics = {
  id: "additional-mathematics",
  form: 4,
  name: "Additional Mathematics",
  nameBm: "Matematik Tambahan",
  nameEn: "Additional Mathematics",
  descriptionBm: "Algebra lanjutan, kalkulus dan geometri.",
  descriptionEn: "Advanced algebra, calculus and geometry.",
  artwork: "/assets/subjects/additional-mathematics.webp",
  accent: "#7953B7",
  chapters: [],
} as const satisfies SubjectManifest;
