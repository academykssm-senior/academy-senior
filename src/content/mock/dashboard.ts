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

export type SubjectWorldTheme = {
  slug: string;
  name: string;
  description: string;
  image: string;
  accent: string;
  objectPosition?: string;
  visible: boolean;
};

export const subjectWorldThemes: readonly SubjectWorldTheme[] = [
  {
    slug: "bahasa-melayu",
    name: "Bahasa Melayu",
    description: "Language, literature and communication.",
    image: "/assets/subjects/bahasa-melayu.webp",
    accent: "#9E2F5F",
    objectPosition: "38% 48%",
    visible: true,
  },
  {
    slug: "english",
    name: "English",
    description: "Language skills, writing and comprehension.",
    image: "/assets/subjects/english.webp",
    accent: "#3567B7",
    objectPosition: "55% 42%",
    visible: true,
  },
  {
    slug: "mathematics",
    name: "Mathematics",
    description: "Functions, numbers and problem solving.",
    image: "/assets/subjects/mathematics.webp",
    accent: "#5455B9",
    visible: true,
  },
  {
    slug: "additional-mathematics",
    name: "Additional Mathematics",
    description: "Advanced algebra, calculus and geometry.",
    image: "/assets/subjects/additional-mathematics.webp",
    accent: "#7953B7",
    visible: true,
  },
  {
    slug: "sejarah",
    name: "Sejarah",
    description: "Malaysian history and world developments.",
    image: "/assets/subjects/sejarah.webp",
    accent: "#9A6235",
    objectPosition: "52% 46%",
    visible: true,
  },
  {
    slug: "biology",
    name: "Biology",
    description: "Cells, living systems and biodiversity.",
    image: "/assets/subjects/biology.webp",
    accent: "#27805F",
    objectPosition: "48% 42%",
    visible: true,
  },
  {
    slug: "chemistry",
    name: "Chemistry",
    description: "Matter, atoms and chemical interactions.",
    image: "/assets/subjects/chemistry.webp",
    accent: "#A84769",
    objectPosition: "54% 46%",
    visible: true,
  },
  {
    slug: "physics",
    name: "Physics",
    description: "Forces, energy, waves and electricity.",
    image: "/assets/subjects/physics.webp",
    accent: "#3286A5",
    objectPosition: "50% 44%",
    visible: true,
  },
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
