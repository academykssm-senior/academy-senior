/**
 * Isolated mock student for unfinished Senior XP / companion / league UI.
 * Not authenticated identity. Do not use this for the shell name, school, or session.
 * Phase 2B will replace these XP numbers with Senior-scoped totals.
 */
import type { StudentProfile } from "@/types/student";

export const mockStudent: StudentProfile = {
  displayName: "Aisha",
  formLevel: 4,
  languagePreference: "bm",
  totalXp: 1280,
  streakDays: 6,
  companion: {
    name: "Nova",
    mood: "ready",
  },
};
