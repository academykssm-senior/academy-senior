import { FORM_4_SUBJECTS } from "@/curriculum/form-4";
import {
  visibleToolIds,
  type LearningToolAvailability,
  type LearningToolId,
} from "@/types/learning";
import type {
  ChapterManifest,
  ChapterView,
  ContentLanguage,
  FormAvailability,
  FormLevel,
  LanguageStream,
  SubjectManifest,
  SubjectView,
} from "@/types/curriculum";
import {
  CONTENT_LANGUAGES,
  isSubjectId,
  toContentLanguage,
} from "@/types/curriculum";

const FORM_AVAILABILITY: readonly FormAvailability[] = [
  {
    level: 4,
    available: true,
    nameBm: "Tingkatan 4",
    nameEn: "Form 4",
  },
  {
    level: 5,
    available: false,
    nameBm: "Tingkatan 5",
    nameEn: "Form 5",
  },
];

const subjectsByForm: Record<FormLevel, readonly SubjectManifest[]> = {
  4: FORM_4_SUBJECTS,
  5: [],
};

export function pickLocalized(lang: LanguageStream, bm: string, en: string): string {
  return toContentLanguage(lang) === "bm" ? bm : en;
}

function chapterMatches(chapter: ChapterManifest, chapterParam: string): boolean {
  return chapter.id === chapterParam || (chapter.routeAliases?.includes(chapterParam) ?? false);
}

export function rewritePathParam(
  pathname: string,
  from: string,
  to: string,
): string {
  const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return pathname.replace(new RegExp(`/${escaped}(?=/|$)`), `/${to}`);
}

export function listForms(): readonly FormAvailability[] {
  return FORM_AVAILABILITY;
}

export function getForm(level: FormLevel): FormAvailability | undefined {
  return FORM_AVAILABILITY.find((form) => form.level === level);
}

export const getFormManifest = getForm;

export function listSubjectManifests(formLevel: FormLevel): readonly SubjectManifest[] {
  return subjectsByForm[formLevel];
}

export function getSubjectManifest(
  formLevel: FormLevel,
  subjectId: string,
): SubjectManifest | undefined {
  return subjectsByForm[formLevel].find((subject) => subject.id === subjectId);
}

export function getChapterManifest(
  formLevel: FormLevel,
  subjectId: string,
  chapterParam: string,
): ChapterManifest | undefined {
  const subject = getSubjectManifest(formLevel, subjectId);
  return subject?.chapters.find((chapter) => chapterMatches(chapter, chapterParam));
}

export function isLearningToolAvailable(
  tools: LearningToolAvailability,
  toolId: LearningToolId,
): boolean {
  if (toolId === "notes") {
    return tools.notes === true;
  }
  return tools[toolId];
}

export function getAvailableLanguages(
  chapter: ChapterManifest,
): readonly ContentLanguage[] {
  return chapter.languages;
}

export function getSubjectLanguages(
  subject: SubjectManifest,
): ContentLanguage[] {
  const found = new Set<ContentLanguage>();
  for (const chapter of subject.chapters) {
    for (const language of chapter.languages) {
      found.add(language);
    }
  }
  return CONTENT_LANGUAGES.filter((language) => found.has(language));
}

export function otherContentLanguage(lang: ContentLanguage): ContentLanguage {
  return lang === "bm" ? "en" : "bm";
}

export function listSubjects(
  formLevel: FormLevel,
  lang: LanguageStream,
): SubjectView[] {
  return subjectsByForm[formLevel].map((subject) => toSubjectView(subject, lang));
}

export function getSubject(
  formLevel: FormLevel,
  slug: string,
  lang: LanguageStream,
): SubjectView | undefined {
  const subject = getSubjectManifest(formLevel, slug);
  return subject ? toSubjectView(subject, lang) : undefined;
}

export function listChapters(
  formLevel: FormLevel,
  subjectSlug: string,
  lang: LanguageStream,
): ChapterView[] {
  const subject = getSubjectManifest(formLevel, subjectSlug);
  if (!subject) return [];

  return subject.chapters.map((chapter) => toChapterView(chapter, subject, lang));
}

export function getChapter(
  formLevel: FormLevel,
  subjectSlug: string,
  chapterSlug: string,
  lang: LanguageStream,
): ChapterView | undefined {
  const subject = getSubjectManifest(formLevel, subjectSlug);
  if (!subject) return undefined;

  const chapter = subject.chapters.find((item) => chapterMatches(item, chapterSlug));
  return chapter ? toChapterView(chapter, subject, lang) : undefined;
}

export type CurriculumLookupError =
  | "invalid-language"
  | "invalid-subject"
  | "invalid-chapter"
  | "unavailable-tool";

export function resolveSubjectContext(
  formLevel: FormLevel,
  lang: string,
  subjectId: string,
):
  | { ok: true; language: ContentLanguage; subject: SubjectManifest }
  | { ok: false; reason: CurriculumLookupError } {
  const language = toContentLanguage(lang);
  if (!language) {
    return { ok: false, reason: "invalid-language" };
  }
  if (!isSubjectId(subjectId)) {
    return { ok: false, reason: "invalid-subject" };
  }
  const subject = getSubjectManifest(formLevel, subjectId);
  if (!subject) {
    return { ok: false, reason: "invalid-subject" };
  }
  return { ok: true, language, subject };
}

export function resolveChapterContext(
  formLevel: FormLevel,
  lang: string,
  subjectId: string,
  chapterParam: string,
):
  | {
      ok: true;
      language: ContentLanguage;
      subject: SubjectManifest;
      chapter: ChapterManifest;
    }
  | { ok: false; reason: CurriculumLookupError } {
  const subjectContext = resolveSubjectContext(formLevel, lang, subjectId);
  if (!subjectContext.ok) {
    return subjectContext;
  }
  const chapter = getChapterManifest(formLevel, subjectId, chapterParam);
  if (!chapter) {
    return { ok: false, reason: "invalid-chapter" };
  }
  return {
    ok: true,
    language: subjectContext.language,
    subject: subjectContext.subject,
    chapter,
  };
}

export function resolveToolContext(
  formLevel: FormLevel,
  lang: string,
  subjectId: string,
  chapterParam: string,
  toolId: LearningToolId,
):
  | {
      ok: true;
      language: ContentLanguage;
      subject: SubjectManifest;
      chapter: ChapterManifest;
      available: boolean;
    }
  | { ok: false; reason: CurriculumLookupError } {
  const chapterContext = resolveChapterContext(
    formLevel,
    lang,
    subjectId,
    chapterParam,
  );
  if (!chapterContext.ok) {
    return chapterContext;
  }
  return {
    ok: true,
    language: chapterContext.language,
    subject: chapterContext.subject,
    chapter: chapterContext.chapter,
    available: isLearningToolAvailable(chapterContext.chapter.tools, toolId),
  };
}

function toSubjectView(subject: SubjectManifest, lang: LanguageStream): SubjectView {
  const nameBm = subject.nameBm ?? subject.name;
  const nameEn = subject.nameEn ?? subject.name;
  const descriptionBm = subject.descriptionBm ?? subject.descriptionEn ?? "";
  const descriptionEn = subject.descriptionEn ?? subject.descriptionBm ?? "";

  return {
    slug: subject.id,
    formLevel: subject.form,
    name: pickLocalized(lang, nameBm, nameEn),
    description: pickLocalized(lang, descriptionBm, descriptionEn),
    hasChapters: subject.chapters.length > 0,
  };
}

function toChapterView(
  chapter: ChapterManifest,
  subject: SubjectManifest,
  lang: LanguageStream,
): ChapterView {
  const titleBm = chapter.titleBm ?? chapter.title;
  const titleEn = chapter.titleEn ?? chapter.title;

  return {
    slug: chapter.id,
    subjectSlug: subject.id,
    formLevel: subject.form,
    number: chapter.number,
    title: pickLocalized(lang, titleBm, titleEn),
    activities: visibleToolIds(chapter.tools),
  };
}
