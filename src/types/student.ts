import type { FormLevel, LanguageStream } from "@/types/curriculum";

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
  languagePreference: LanguageStream;
  totalXp: number;
  streakDays: number;
  companion: StudentCompanion;
};
