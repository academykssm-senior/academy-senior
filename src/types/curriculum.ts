import type {
  LearningToolAvailability,
  VisibleLearningToolId,
} from "@/types/learning";

export type FormLevel = 4 | 5;

export const SUBJECT_IDS = [
  "bahasa-melayu",
  "english",
  "mathematics",
  "additional-mathematics",
  "sejarah",
  "biology",
  "chemistry",
  "physics",
] as const;

export type SubjectId = (typeof SUBJECT_IDS)[number];

export type ChapterId = string;

/** Canonical content language. DLP English is `en`. */
export type ContentLanguage = "bm" | "en";

/**
 * Inbound URL languages. `dlp` is accepted only so legacy URLs can
 * redirect to `en`. It is not an internal content identifier.
 */
export type RouteLanguage = ContentLanguage | "dlp";

/** @deprecated Use ContentLanguage for data and RouteLanguage for URLs. */
export type LanguageStream = RouteLanguage;

export const CONTENT_LANGUAGES: readonly ContentLanguage[] = ["bm", "en"];

export const ROUTE_LANGUAGES: readonly RouteLanguage[] = ["bm", "en", "dlp"];

export const LANGUAGE_STREAMS: readonly RouteLanguage[] = ROUTE_LANGUAGES;

export function isContentLanguage(value: string): value is ContentLanguage {
  return (CONTENT_LANGUAGES as readonly string[]).includes(value);
}

export function isRouteLanguage(value: string): value is RouteLanguage {
  return (ROUTE_LANGUAGES as readonly string[]).includes(value);
}

export function isLanguageStream(value: string): value is RouteLanguage {
  return isRouteLanguage(value);
}

export function toContentLanguage(
  value: string,
): ContentLanguage | undefined {
  if (value === "bm") return "bm";
  if (value === "en" || value === "dlp") return "en";
  return undefined;
}

/** Canonical URL language. Legacy `dlp` becomes `en`. */
export function toCanonicalRouteLanguage(
  value: string,
): ContentLanguage | undefined {
  return toContentLanguage(value);
}

export function isSubjectId(value: string): value is SubjectId {
  return (SUBJECT_IDS as readonly string[]).includes(value);
}

export function toChapterId(chapterNumber: number): ChapterId {
  return `chapter-${String(chapterNumber).padStart(2, "0")}`;
}

/** Where an activity originated. Totals (XP, streak) stay global. */
export type ActivitySource = "senior" | "junior";

/** Visible chapter tools. Alias kept for existing UI imports. */
export type ChapterActivityId = VisibleLearningToolId;

export type FormAvailability = {
  level: FormLevel;
  available: boolean;
  nameBm: string;
  nameEn: string;
};

export type SubjectManifest = {
  id: SubjectId;
  form: FormLevel;
  name: string;
  nameBm?: string;
  nameEn?: string;
  descriptionBm?: string;
  descriptionEn?: string;
  artwork: string;
  accent: string;
  artworkPosition?: string;
  chapters: readonly ChapterManifest[];
};

export type ChapterManifest = {
  id: ChapterId;
  number: number;
  title: string;
  titleBm?: string;
  titleEn?: string;
  languages: readonly ContentLanguage[];
  tools: LearningToolAvailability;
  /** Legacy URL slugs that redirect to `id`. Not a second identifier. */
  routeAliases?: readonly string[];
};

/** Compatibility shape used by older catalogue mappings. */
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
  hasChapters: boolean;
};

export type ChapterView = {
  slug: string;
  subjectSlug: string;
  formLevel: FormLevel;
  number: number;
  title: string;
  activities: readonly ChapterActivityId[];
};
