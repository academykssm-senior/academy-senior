export type FormLevel = 4 | 5;

export type LanguageStream = "bm" | "dlp";

export const LANGUAGE_STREAMS: readonly LanguageStream[] = ["bm", "dlp"];

export function isLanguageStream(value: string): value is LanguageStream {
  return (LANGUAGE_STREAMS as readonly string[]).includes(value);
}

/** Where an activity originated. Totals (XP, streak) stay global. */
export type ActivitySource = "senior" | "junior";

export type ChapterActivityId = "flashcards" | "quiz" | "mind-map";

export type FormAvailability = {
  level: FormLevel;
  available: boolean;
  nameBm: string;
  nameEn: string;
};

export type SubjectRecord = {
  slug: string;
  formLevel: FormLevel;
  nameBm: string;
  nameEn: string;
  descriptionBm: string;
  descriptionEn: string;
};

export type ChapterRecord = {
  slug: string;
  subjectSlug: string;
  formLevel: FormLevel;
  number: number;
  titleBm: string;
  titleEn: string;
  activities: readonly ChapterActivityId[];
};

export type SubjectView = {
  slug: string;
  formLevel: FormLevel;
  name: string;
  description: string;
};

export type ChapterView = {
  slug: string;
  subjectSlug: string;
  formLevel: FormLevel;
  number: number;
  title: string;
  activities: readonly ChapterActivityId[];
};
