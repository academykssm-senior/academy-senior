import { form4Chapters, form4Subjects } from "@/content/mock/form4";
import type {
  ChapterRecord,
  ChapterView,
  FormAvailability,
  FormLevel,
  LanguageStream,
  SubjectRecord,
  SubjectView,
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

const subjectsByForm: Record<FormLevel, readonly SubjectRecord[]> = {
  4: form4Subjects,
  5: [],
};

const chaptersByForm: Record<FormLevel, readonly ChapterRecord[]> = {
  4: form4Chapters,
  5: [],
};

function pickLocalized(
  lang: LanguageStream,
  bm: string,
  en: string,
): string {
  return lang === "bm" ? bm : en;
}

export function listForms(): readonly FormAvailability[] {
  return FORM_AVAILABILITY;
}

export function getForm(level: FormLevel): FormAvailability | undefined {
  return FORM_AVAILABILITY.find((form) => form.level === level);
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
  const subject = subjectsByForm[formLevel].find((item) => item.slug === slug);
  return subject ? toSubjectView(subject, lang) : undefined;
}

export function listChapters(
  formLevel: FormLevel,
  subjectSlug: string,
  lang: LanguageStream,
): ChapterView[] {
  return chaptersByForm[formLevel]
    .filter((chapter) => chapter.subjectSlug === subjectSlug)
    .map((chapter) => toChapterView(chapter, lang));
}

export function getChapter(
  formLevel: FormLevel,
  subjectSlug: string,
  chapterSlug: string,
  lang: LanguageStream,
): ChapterView | undefined {
  const chapter = chaptersByForm[formLevel].find(
    (item) => item.subjectSlug === subjectSlug && item.slug === chapterSlug,
  );
  return chapter ? toChapterView(chapter, lang) : undefined;
}

function toSubjectView(
  subject: SubjectRecord,
  lang: LanguageStream,
): SubjectView {
  return {
    slug: subject.slug,
    formLevel: subject.formLevel,
    name: pickLocalized(lang, subject.nameBm, subject.nameEn),
    description: pickLocalized(lang, subject.descriptionBm, subject.descriptionEn),
  };
}

function toChapterView(
  chapter: ChapterRecord,
  lang: LanguageStream,
): ChapterView {
  return {
    slug: chapter.slug,
    subjectSlug: chapter.subjectSlug,
    formLevel: chapter.formLevel,
    number: chapter.number,
    title: pickLocalized(lang, chapter.titleBm, chapter.titleEn),
    activities: chapter.activities,
  };
}
