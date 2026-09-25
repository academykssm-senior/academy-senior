import type { ContentLanguage, FormLevel } from "@/types/curriculum";
import { isContentLanguage, toContentLanguage } from "@/types/curriculum";

/**
 * Authenticated identity from the shared AcadeMY project.
 * Does not include Junior-scoped XP, streak, or leaderboard totals.
 */
export type AuthenticatedStudent = {
  id: string;
  displayName: string;
  email: string | null;
  avatarUrl: string | null;
  schoolName: string | null;
  formLabel: string | null;
  formLevel: FormLevel | null;
  languagePreference: ContentLanguage;
};

type ProfileRow = {
  id: string;
  full_name: string | null;
  username: string | null;
  email: string | null;
  form: string | null;
  school: string | null;
  schools: { school_name: string } | { school_name: string }[] | null;
};

type ProgressLangRow = {
  language_preference: string | null;
};

/** Profile rows are keyed by the existing auth.users id. Do not invent a second id. */
export function authenticatedUserIdFromClaims(
  claims: { sub?: unknown } | null | undefined,
): string | null {
  const userId = claims?.sub;
  if (typeof userId !== "string" || userId.length === 0) return null;
  return userId;
}

export function mapAuthenticatedStudent(
  userId: string,
  authEmail: string | null,
  profile: ProfileRow | null,
  progress: ProgressLangRow | null,
): AuthenticatedStudent {
  const displayName = firstNonEmpty(profile?.full_name, profile?.username) ?? "Student";
  const email = firstNonEmpty(profile?.email, authEmail);
  const schoolFromJoin = schoolNameFromJoin(profile?.schools ?? null);
  const schoolName = firstNonEmpty(schoolFromJoin, profile?.school);
  const formLabel = firstNonEmpty(profile?.form);
  const languagePreference = parseLanguagePreference(progress?.language_preference);

  return {
    id: userId,
    displayName,
    email: email ?? null,
    avatarUrl: null,
    schoolName: schoolName ?? null,
    formLabel: formLabel ?? null,
    formLevel: parseFormLevel(formLabel),
    languagePreference,
  };
}

export function learningLanguage(student: AuthenticatedStudent): ContentLanguage {
  return student.languagePreference;
}

function parseLanguagePreference(value: string | null | undefined): ContentLanguage {
  if (!value) return "bm";
  const canonical = toContentLanguage(value.toLowerCase());
  if (canonical) return canonical;
  if (isContentLanguage(value)) return value;
  return "bm";
}

function parseFormLevel(formLabel: string | null | undefined): FormLevel | null {
  if (!formLabel) return null;
  if (/\b5\b/.test(formLabel) || /tingkatan\s*5/i.test(formLabel)) return 5;
  if (/\b4\b/.test(formLabel) || /tingkatan\s*4/i.test(formLabel)) return 4;
  return null;
}

function schoolNameFromJoin(
  schools: ProfileRow["schools"],
): string | undefined {
  if (!schools) return undefined;
  if (Array.isArray(schools)) return firstNonEmpty(schools[0]?.school_name);
  return firstNonEmpty(schools.school_name);
}

function firstNonEmpty(...values: Array<string | null | undefined>): string | undefined {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return undefined;
}
