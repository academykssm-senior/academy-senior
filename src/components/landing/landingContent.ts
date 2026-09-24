export const CHAPTERS = [
  { id: "home", label: "Home" },
  { id: "learning", label: "Learning" },
  { id: "activities", label: "Activities" },
  { id: "committee", label: "Committee" },
  { id: "council", label: "Student Council" },
] as const;

export const LEARNING_CARDS = [
  {
    title: "Guided Quizzes",
    body: "SPM-style sets that surface weak topics before they become surprises.",
    image: "/assets/senior/learning/guided-quizzes.webp",
  },
  {
    title: "Flashcards",
    body: "Quick, focused cards to help you recall and remember faster.",
    image: "/assets/senior/learning/flashcards.webp",
  },
  {
    title: "Notes",
    body: "Clear, concise notes to help you learn faster and remember longer.",
    image: "/assets/senior/learning/notes.png",
  },
  {
    title: "Mind Maps",
    body: "Visual summaries that connect ideas and make learning stick.",
    image: "/assets/senior/learning/mind-maps.webp",
  },
] as const;

export const ACTIVITY_CARDS = [
  {
    title: "Camping",
    icon: "nights_stay",
    body: "Field nights that turn classmates into a crew.",
  },
  {
    title: "Meet & Greet",
    icon: "handshake",
    body: "First orbits — seniors, juniors, and the people who run the worlds.",
  },
  {
    title: "Student Challenges",
    icon: "emoji_events",
    body: "Timed missions that reward nerve, craft, and collaboration.",
  },
  {
    title: "Workshops",
    icon: "handyman",
    body: "Hands-on labs beyond the lecture hall.",
  },
  {
    title: "AcadeMY Gatherings",
    icon: "groups",
    body: "The house comes together — celebrations, showcases, send-offs.",
  },
] as const;

export const CREW = [
  {
    initials: "EM",
    title: "Evolution Master",
    role: "Curriculum orbit",
    bio: "Shapes how each chapter world unfolds across Form 4 and Form 5.",
  },
  {
    initials: "FH",
    title: "Frontier Host",
    role: "Community orbit",
    bio: "Keeps gatherings, camps, and first-contact events feeling human.",
  },
  {
    initials: "CM",
    title: "Cadet Mentor",
    role: "Guidance orbit",
    bio: "Walks new seniors through the first weeks until the path feels theirs.",
  },
  {
    initials: "CL",
    title: "Command Lead",
    role: "Operations orbit",
    bio: "Holds the station together — schedules, crews, and calm under pressure.",
  },
] as const;

export const COUNCIL_STATS = [
  { value: "128", label: "Student leaders" },
  { value: "2,800", label: "Community hours" },
  { value: "100%", label: "Student-led" },
] as const;

export const CINEMATIC = {
  gate: "/cinematic/academy-entry-poster.webp",
  entry: "/cinematic/academy-entry.webm",
  entryMp4: "/cinematic/academy-entry.mp4",
  lobby: "/cinematic/academy-senior-lobby.webp",
} as const;

export const ASSETS = {
  astronaut: "/assets/senior/astronaut.webp",
  astronautFallback: "/assets/senior/astronaut.png",
  hero: "/assets/senior/hero-portal.webp",
  learning: "/assets/senior/learning-world.webp",
  activities: "/assets/senior/activities-landscape.webp",
  committee: "/assets/senior/committee-station.webp",
  council: "/assets/senior/council-chamber.webp",
  finale: "/assets/senior/finale-sunrise.webp",
} as const;
