import type { ChapterActivityId } from "@/types/curriculum";

export type DashboardSubject = {
  slug: string;
  icon: string;
  chapters: number;
  mastery: number;
  accent: "purple" | "indigo" | "emerald";
};

export type MasteryTopic = {
  name: string;
  mastery: number;
  detail?: string;
};

export const dashboardSubjects: readonly DashboardSubject[] = [
  { slug: "biology", icon: "biotech", chapters: 2, mastery: 81, accent: "emerald" },
  { slug: "chemistry", icon: "science", chapters: 1, mastery: 72, accent: "purple" },
  { slug: "mathematics", icon: "functions", chapters: 1, mastery: 64, accent: "indigo" },
];

export const strongTopics: readonly MasteryTopic[] = [
  { name: "Atomic Structure", mastery: 98 },
  { name: "Cell Structure", mastery: 96 },
];

export const reviewTopics: readonly MasteryTopic[] = [
  {
    name: "Biomolecules",
    mastery: 48,
    detail: "Two recall mistakes in the last session",
  },
  {
    name: "Quadratic Functions",
    mastery: 54,
    detail: "Spaced revision is due today",
  },
];

export const learningTools: readonly {
  id: ChapterActivityId;
  title: string;
  subtitle: string;
  icon: string;
}[] = [
  { id: "mind-map", title: "Mind Maps", subtitle: "Explore nodes", icon: "hub" },
  { id: "flashcards", title: "Flashcards", subtitle: "Active recall", icon: "style" },
  { id: "quiz", title: "SPM Quiz", subtitle: "Exam mode", icon: "timer" },
];

export const revisionMission = [
  { icon: "style", value: 5, label: "Flashcards" },
  { icon: "quiz", value: 10, label: "Questions" },
  { icon: "account_tree", value: 1, label: "Mind Map" },
] as const;

export type CosmicRank = {
  id: string;
  name: string;
  xp: number;
  icon: string;
};

export const cosmicRanks: readonly CosmicRank[] = [
  { id: "space-cadet", name: "Space Cadet", xp: 0, icon: "rocket_launch" },
  { id: "moon-explorer", name: "Moon Explorer", xp: 1600, icon: "nightlight" },
  { id: "planet-voyager", name: "Planet Voyager", xp: 4000, icon: "public" },
  { id: "star-captain", name: "Star Captain", xp: 8000, icon: "star" },
  { id: "galaxy-guardian", name: "Galaxy Guardian", xp: 15000, icon: "shield" },
  { id: "cosmic-legend", name: "Cosmic Legend", xp: 30000, icon: "auto_awesome" },
];

export function getRankProgress(totalXp: number) {
  const currentIndex = cosmicRanks.reduce((index, rank, i) => {
    return totalXp >= rank.xp ? i : index;
  }, 0);
  const current = cosmicRanks[currentIndex] ?? cosmicRanks[0];
  const next = cosmicRanks[currentIndex + 1];
  const span = next ? next.xp - (current?.xp ?? 0) : 1;
  const gained = totalXp - (current?.xp ?? 0);
  const percent = next ? Math.min(100, Math.round((gained / span) * 100)) : 100;

  return {
    current: current ?? cosmicRanks[0]!,
    next,
    remaining: next ? Math.max(0, next.xp - totalXp) : 0,
    percent,
    currentIndex,
  };
}
