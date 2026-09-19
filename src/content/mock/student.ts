import type { StudentProfile } from "@/types/student";

/** Placeholder global student. Replace with identity-layer data later. */
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
