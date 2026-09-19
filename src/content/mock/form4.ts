import type { ChapterRecord, SubjectRecord } from "@/types/curriculum";

export const form4Subjects: readonly SubjectRecord[] = [
  {
    slug: "biology",
    formLevel: 4,
    nameBm: "Biologi",
    nameEn: "Biology",
    descriptionBm: "Sel, biomolekul, dan asas kehidupan.",
    descriptionEn: "Cells, biomolecules, and the basics of life.",
  },
  {
    slug: "chemistry",
    formLevel: 4,
    nameBm: "Kimia",
    nameEn: "Chemistry",
    descriptionBm: "Struktur atom dan ikatan kimia.",
    descriptionEn: "Atomic structure and chemical bonding.",
  },
  {
    slug: "mathematics",
    formLevel: 4,
    nameBm: "Matematik",
    nameEn: "Mathematics",
    descriptionBm: "Fungsi kuadratik dan corak nombor.",
    descriptionEn: "Quadratic functions and number patterns.",
  },
];

export const form4Chapters: readonly ChapterRecord[] = [
  {
    slug: "cell-structure",
    subjectSlug: "biology",
    formLevel: 4,
    number: 1,
    titleBm: "Struktur Sel",
    titleEn: "Cell Structure",
    activities: ["flashcards", "quiz", "mind-map"],
  },
  {
    slug: "biomolecules",
    subjectSlug: "biology",
    formLevel: 4,
    number: 2,
    titleBm: "Biomolekul",
    titleEn: "Biomolecules",
    activities: ["flashcards", "quiz", "mind-map"],
  },
  {
    slug: "atomic-structure",
    subjectSlug: "chemistry",
    formLevel: 4,
    number: 1,
    titleBm: "Struktur Atom",
    titleEn: "Atomic Structure",
    activities: ["flashcards", "quiz", "mind-map"],
  },
  {
    slug: "quadratic-functions",
    subjectSlug: "mathematics",
    formLevel: 4,
    number: 1,
    titleBm: "Fungsi Kuadratik",
    titleEn: "Quadratic Functions",
    activities: ["flashcards", "quiz", "mind-map"],
  },
];
