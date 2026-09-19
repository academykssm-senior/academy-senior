import type { SubjectManifest } from "@/types/curriculum";

export const bahasaMelayu = {
  id: "bahasa-melayu",
  form: 4,
  name: "Bahasa Melayu",
  nameBm: "Bahasa Melayu",
  nameEn: "Bahasa Melayu",
  descriptionBm: "Bahasa, kesusasteraan dan komunikasi.",
  descriptionEn: "Language, literature and communication.",
  artwork: "/assets/subjects/bahasa-melayu.webp",
  accent: "#9E2F5F",
  artworkPosition: "38% 48%",
  chapters: [],
} as const satisfies SubjectManifest;
