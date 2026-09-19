import type { ContentLanguage, FormLevel } from "@/types/curriculum";

/**
 * Global AcadeMY student display model.
 * XP, streak, and companion are ecosystem-wide — not Senior-specific.
 */
export type StudentCompanion = {
  name: string;
  mood: string;
};

export type StudentProfile = {
  displayName: string;
  formLevel: FormLevel;
  languagePreference: ContentLanguage;
  totalXp: number;
  streakDays: number;
  companion: StudentCompanion;
};
