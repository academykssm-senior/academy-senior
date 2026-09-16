# AcadeMY Junior → Senior Compatibility Audit

**Date:** 2026-09-16  
**Repository audited:** `rayyanfaizal39-ai/silken-sheen` (AcadeMY Junior production)  
**Audit type:** Read-only. No files were copied, modified, or deployed.

---

## 1. Executive Summary

The Junior codebase is a mature, well-structured TanStack Start + React + TypeScript application deployed on Cloudflare Pages. It is architecturally clean, with clear separation between platform code (shell, auth, gamification, AI) and curriculum code (notes, quizzes, flashcard data per subject/form).

**The main finding is strongly positive:** the platform layer — everything students experience except the actual learning content — is reusable for Senior with deliberate, selective porting. The curriculum data layer is entirely Junior-specific (Forms 1–3 subjects) and must not be inherited.

**Critical legacy structure warning:** The repository contains a `silken-sheen-main/` subfolder at the root with an earlier, slimmer version of the same application. This is an archived snapshot, not the live code. It must not be confused with the current source.

---

## 2. Junior Architecture Overview

### 2.1 Stack (confirmed from source)

| Layer | Technology | Key files |
|---|---|---|
| Framework | TanStack Start v1.168+ | `src/start.ts`, `src/router.tsx`, `src/routes/` |
| UI | React 19 | All `src/components/`, `src/routes/` |
| Language | TypeScript strict | `tsconfig.json` |
| Build | Vite 7 + `@lovable.dev/vite-tanstack-config` | `vite.config.ts` |
| Styling | Tailwind CSS v4 (Vite plugin, no config file) | `src/styles.css` |
| Auth + DB | Supabase (`@supabase/ssr` v0.12) | `src/lib/supabase.ts`, `src/lib/supabase.server.ts` |
| Deploy | Cloudflare Pages (Advanced Mode, `_worker.js`) | `wrangler.jsonc`, build scripts |
| PWA | `vite-plugin-pwa` v1.3 + Workbox | `vite.config.ts` |
| Animation | Framer Motion v12, GSAP v3 | Used in landing, companion, progression |
| UI primitives | Radix UI (full suite) + shadcn patterns | `src/components/ui/` |
| Testing | Vitest 3.2.7 | `src/components/**/*.test.*`, `src/lib/**/*.test.*` |

### 2.2 Application structure

```
src/
├── assets/         Static images, chapter backgrounds per subject/form
├── companion/      Ace/Cikgu AI panel, companion species, mood, speech
├── components/
│   ├── ui/         Radix-backed shadcn primitives (Button, Card, Sheet, etc.)
│   ├── home/       Home dashboard sub-components
│   ├── notes/      Per-chapter NotesBlock components (200+ files)
│   ├── notes/blocks/ Reusable note visual components (diagrams, calculators, etc.)
│   ├── progression/ RankUp, MissionReward, CompanionEvolution modals + CSS
│   ├── admin/      Admin shell, quiz importer (admin-only)
│   ├── billing/    Subscription UI
│   └── landing-cinematic/ Landing page scene system
├── config/         Feature flags, plan definitions
├── content/        Curriculum data (form1/, form2/, form3/) per subject
├── context/        Auth, CikguAI, SignInModal, BackgroundMusic providers
├── data/           Legacy data files (quizzes.ts, flashcards.ts, subjects.ts)
├── features/       Grammar lesson, quiz-streak features
├── hooks/          use-progress (XP/rank/missions), use-science-lang, etc.
├── lib/            All business logic (auth, analytics, billing, missions, etc.)
├── routes/         TanStack Start file-based routes
└── styles/         billing.css, upgrade.css, fonts.css, theme.css
supabase/
├── migrations/     Versioned SQL migrations
├── functions/      Edge Functions (billing, email, ToyyibPay)
└── schema.sql      Base schema
```

### 2.3 Auth and session model

- **Supabase Auth** with PKCE flow via `@supabase/ssr`
- Browser client (`src/lib/supabase.ts`): `createBrowserClient` with cookie-based session, no auto URL detection, PKCE, `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
- Server client (`src/lib/supabase.server.ts`): `createServerClient` running as the user's session via cookies; no service role key on the edge
- Auth context (`src/context/auth-context.tsx`): `AuthProvider` with 8s boot timeout, onboarding flow (`ExplorerProfile`), Google OAuth + email/password, guest mode support
- Progress is persisted in localStorage (`learnnova-progress-v1`) and optionally synced to Supabase with a 2s debounce

### 2.4 Progress and gamification system

All gamification lives in `src/hooks/use-progress.ts` (one central hook, ~1500 lines):
- XP accumulation from quiz completion, flashcard review, notes reading
- Space ranks (Space Cadet → Cosmic Legend) derived from cumulative XP — `src/data/rankAssets.ts`
- Streaks tracked as `lastActive` date key
- Companion system: 5 companions (nova, luna, terra, comet, nebula), 5 stages (egg → guardian), level progression from XP, SM-2 spaced repetition for flashcards
- Missions: daily + weekly, stored in Supabase via `src/lib/mission-system.ts`
- Progress events bus (`src/lib/progression-events.ts`) — rank-up, companion evolution, mission reward celebrations

### 2.5 Navigation and shell

`src/components/AppShell.tsx` (large, ~32KB):
- Desktop left sidebar + mobile bottom navigation
- 9 nav items: Home, Dashboard, Notes, Mind Maps, Quizzes, Flashcards, AI Tracker, Cosmic Companion, Leaderboard
- XP bar and rank badge in sidebar header, streak counter, profile avatar
- Floating AI button (`AICompanionButton`) always visible
- Onboarding redirect logic, guest mode handling, admin role check
- Background music control (`BackgroundMusicControl`)

### 2.6 Content architecture

Content is split into two layers:

**Curriculum layer** (Junior-specific, DO NOT inherit):
- `src/content/form1/`, `src/content/form2/`, `src/content/form3/` — per-subject, per-chapter notes, quizzes, flashcards, mindmaps, all in TypeScript data files
- `src/content/registry.ts` — master registry of all curriculum content (~163KB)
- `src/data/` — legacy flat data files (quizzes.ts, flashcards.ts, notes.ts, content.ts — some very large)

**Platform layer** (reusable):
- `src/content/types.ts` — shared TypeScript interfaces for notes, quizzes, flashcard decks
- `src/components/notes/blocks/` — 200+ reusable visual/interactive block components (diagrams, calculators, timelines, etc.)
- `src/routes/notes.tsx`, `src/routes/quizzes.tsx`, `src/routes/flashcards.tsx` — route shells that consume content

### 2.7 Design system (confirmed)

- **Tailwind CSS v4** using the Vite plugin — no `tailwind.config.js` file; configuration is in `src/styles.css` via `@theme inline`
- **Design tokens as CSS custom properties** on `:root`: `--background`, `--foreground`, `--accent`, etc., mapped into Tailwind via `@theme inline`
- **Nova colour palette**: `--nova-purple: #8b5cf6`, `--nova-blue: #3b82f6`, `--nova-yellow: #facc15`, `--nova-navy: #0d1117`, `--nova-slate: #161b22`
- **Typography**: `--font-display: "Space Grotesk"`, `--font-body: "Inter"`
- **Base theme**: dark, deep navy (`--background: oklch(0.18 0.04 265)`)
- **Radix UI** for all interactive primitives with shadcn-style component wrappers in `src/components/ui/`
- **Mobile nav height**: `--mobile-nav-height: 72px`, safe area insets handled
- **Accent is purple** (`#8b5cf6`) — exact colour confirmed in source

---

## 3. Reuse Matrix

| Junior file / system | Purpose | Classification | Senior destination | Key dependencies | Notes |
|---|---|---|---|---|---|
| `src/components/AppShell.tsx` | Full app shell: sidebar, mobile nav, XP bar, AI button, auth guard, onboarding redirect | **B — ADAPT** | `src/components/AppShell.tsx` | `use-progress`, `auth-context`, `companion/`, progression modals, `GalaxySearch` | Nav items need Form 4–5 subjects; otherwise structurally identical |
| `src/components/ui/` (all 40+ files) | Radix-backed shadcn component library | **A — REUSE** | `src/components/ui/` | Tailwind CSS v4, Radix UI packages | Identical in both main and silken-sheen-main; copy verbatim |
| `src/lib/supabase.ts` | Browser Supabase client with PKCE, cookie session | **A — REUSE** | `src/lib/supabase.ts` | `@supabase/ssr`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | Change only project URL/key; logic is portable |
| `src/lib/supabase.server.ts` | Per-request server client, RLS-respecting | **A — REUSE** | `src/lib/supabase.server.ts` | TanStack Start server core, `@supabase/ssr` | No changes needed for Senior; same pattern |
| `src/context/auth-context.tsx` | Auth state: user, session, onboarding, ExplorerProfile | **B — ADAPT** | `src/context/auth-context.tsx` | `supabase.ts`, `explorer-profile.ts`, `guest-mode.ts` | Shared identity goal — may need to point at shared Supabase project |
| `src/hooks/use-progress.ts` | XP, ranks, streaks, companion, missions, flashcard SM-2 | **B — ADAPT** | `src/hooks/use-progress.ts` | `supabase.ts`, `rankAssets.ts`, `mission-system.ts`, `progression-events.ts` | Storage key should change; rank thresholds and companion data may be shared |
| `src/data/rankAssets.ts` | Space rank definitions with images | **A — REUSE** | `src/data/rankAssets.ts` | Rank PNG assets in `public/ranks/` | Ranks are platform-level, not curriculum-level |
| `src/companion/AICompanionButton.tsx` | Floating Ace button opening CikguAI panel | **A — REUSE** | `src/companion/AICompanionButton.tsx` | `CikguAIPanel`, `use-progress`, robot image asset | No curriculum coupling; works with any XP value |
| `src/companion/CikguAIPanel.tsx` | Ace / Cikgu AI slide-over panel (Sheet) | **B — ADAPT** | `src/companion/CikguAIPanel.tsx` | Radix Sheet, `cikguMockData.ts`, `use-read-aloud`, Supabase (knowledge cards) | Knowledge cards table query needs Senior subjects; mock data is curriculum-neutral |
| `src/companion/` (species, mood, messages, banks, index) | Companion species definitions, mood logic, message banks | **A — REUSE** | `src/companion/` | `use-progress`, companion PNG assets | Species/stages are platform-level |
| `src/components/progression/RankUpCelebration.tsx` | Rank-up animation modal with CSS | **A — REUSE** | `src/components/progression/` | `rank-up-celebration.css`, rank assets, confetti | No curriculum coupling |
| `src/components/progression/MissionRewardCelebration.tsx` | Mission completion animation | **A — REUSE** | `src/components/progression/` | Same rank/XP assets | No curriculum coupling |
| `src/components/progression/CompanionEvolutionModal.tsx` | Companion stage-up modal | **A — REUSE** | `src/components/progression/` | Companion assets | No curriculum coupling |
| `src/components/progression/ProgressionHelp.tsx` | XP/Streak/Companion info popovers | **A — REUSE** | `src/components/progression/` | Radix Popover | No curriculum coupling |
| `src/components/RankBadge.tsx` | Rank badge visual component | **A — REUSE** | `src/components/RankBadge.tsx` | `rankAssets.ts` | Used everywhere |
| `src/components/AcademyLogo.tsx` | Logo component | **A — REUSE** | `src/components/AcademyLogo.tsx` | Logo SVG/PNG assets | Identical |
| `src/lib/mission-system.ts` | Daily/weekly mission state, progress tracking, Supabase writes | **B — ADAPT** | `src/lib/mission-system.ts` | Supabase `missions` table, `use-progress` | Mission pool may differ (Senior subject activities); logic is reusable |
| `src/lib/progression-events.ts` | XP events bus, rank-up detection, journey unlocks | **A — REUSE** | `src/lib/progression-events.ts` | `use-progress` | No curriculum coupling |
| `src/lib/feature-access.ts` | Feature flags / plan gating (not yet enforced) | **A — REUSE** | `src/lib/feature-access.ts` | `src/config/features.ts` | Copy and extend Senior-specific features |
| `src/config/features.ts` | Plan → feature mapping | **B — ADAPT** | `src/config/features.ts` | Nothing | May need Senior-specific features (e.g. SPM materials) |
| `src/lib/analytics.ts` | Student analytics (quiz history, weak topics) | **B — ADAPT** | `src/lib/analytics.ts` | Supabase `quiz_history` table, `use-progress` | Table name and subject IDs need Senior equivalents |
| `src/lib/guest-mode.ts` | Guest (unauthenticated) mode detection | **A — REUSE** | `src/lib/guest-mode.ts` | localStorage | No curriculum coupling |
| `src/lib/daily-missions.ts` + `src/lib/daily-mission-progress.ts` | Mission utilities | **A — REUSE** | `src/lib/` | `use-progress` | No curriculum coupling |
| `src/lib/sounds.ts` | Sound effects (rank-up, quiz feedback) | **A — REUSE** | `src/lib/sounds.ts` | Sound WAV assets | No curriculum coupling |
| `src/lib/leaderboard.ts` + `src/data/leaderboard.ts` | Leaderboard logic | **B — ADAPT** | `src/lib/leaderboard.ts` | Supabase `monthly_leaderboard` view | Shared or Senior-specific leaderboard TBD |
| `src/components/HomeDashboard.tsx` | Main authenticated home page (world portals, quick access, XP) | **B — ADAPT** | `src/components/HomeDashboard.tsx` | `use-progress`, `AcademyPage`, subject list, content registry | World portals need Senior subjects; XP/streak/companion sections are reusable |
| `src/routes/dashboard.tsx` | XP dashboard page (stats, badges, missions, companion) | **B — ADAPT** | `src/routes/dashboard.tsx` | `use-progress`, mission system, `AcademyPage` | Replace Form 1–3 subject references with Form 4–5; most of the page is platform |
| `src/components/AcademyPage.tsx` | Shared page shell, planet/world card system, `NotesSubjectCard` | **B — ADAPT** | `src/components/AcademyPage.tsx` | Subject-planet art, Tailwind | Planet/world art assets need Senior subjects; shell reusable |
| `src/components/SubjectWorldArt.tsx` | Subject planet image mapping | **B — ADAPT** | `src/components/SubjectWorldArt.tsx` | `public/world/` images | Needs Senior subject planet images |
| `src/routes/login.tsx` + `src/routes/onboarding.tsx` | Login page, onboarding flow | **B — ADAPT** | `src/routes/login.tsx`, `src/routes/onboarding.tsx` | `auth-context`, `explorer-profile`, onboarding CSS | Onboarding form/year selection needs Form 4–5 options |
| `src/lib/explorer-profile.ts` | Student profile data (form level, language preference, school) | **B — ADAPT** | `src/lib/explorer-profile.ts` | Supabase `explorer_profiles` table | Form level range needs to include 4 and 5 |
| `src/components/notes/blocks/` (200+ block components) | Reusable interactive note visual components | **B — ADAPT** | `src/components/notes/blocks/` | Tailwind, React | Subject-specific content is passed as props — components themselves are generic. Not all are needed for first slice. |
| `src/components/notes/NotesBlock.tsx` | Main notes renderer that consumes block components | **B — ADAPT** | `src/components/notes/NotesBlock.tsx` | All note block components, Tailwind | Remove Junior chapter-specific routing logic |
| `src/components/notes/ChapterFeatureBar.tsx` | Chapter feature tab bar (Notes/Cards/Quiz/MindMap) | **A — REUSE** | `src/components/notes/ChapterFeatureBar.tsx` | Tailwind, Lucide icons | No curriculum coupling |
| `src/components/notes/VideoBlock.tsx` | Embedded YouTube video block | **A — REUSE** | `src/components/notes/VideoBlock.tsx` | Radix AspectRatio | No curriculum coupling |
| `src/components/MindMap.tsx` | Interactive mind map component | **B — ADAPT** | `src/components/MindMap.tsx` | Large, self-contained; mobile/desktop tree | Mind map data format is portable; Junior chapter data is not |
| `src/components/ChapterPicker.tsx` | Subject/chapter navigation picker | **B — ADAPT** | `src/components/ChapterPicker.tsx` | Content registry, subject list | Registry needs Senior chapters |
| `src/components/GalaxySearch.tsx` | Global search across subjects/chapters | **B — ADAPT** | `src/components/GalaxySearch.tsx` | Content registry | Registry needs Senior content |
| `src/routes/flashcards.tsx` | Flashcard study session (SM-2, keyboard nav, animations) | **C — REFERENCE ONLY** | `src/routes/flashcards.tsx` | Very large (~300KB). Tightly coupled to Junior flashcard data IDs | Port the UX/interaction logic; do not copy the data registration |
| `src/routes/quizzes.tsx` | Quiz session (MCQ, timer, streak, XP award) | **C — REFERENCE ONLY** | `src/routes/quizzes.tsx` | Very large (~700KB). Tightly coupled to Junior quiz data IDs | Port the engine logic; do not copy data registration |
| `src/routes/notes.tsx` | Notes page routing and per-chapter note loading | **C — REFERENCE ONLY** | `src/routes/notes.tsx` | Large, Junior chapter registration, 200+ NotesBlock imports | Port the route shell and loading pattern; rewrite for Senior chapters |
| `src/lib/pwa-register.ts` | PWA service worker registration | **A — REUSE** | `src/lib/pwa-register.ts` | `vite-plugin-pwa`, Workbox | No curriculum coupling |
| `src/components/audio/BackgroundMusicControl.tsx` | Music toggle in sidebar | **A — REUSE** | `src/components/audio/` | `BackgroundMusicProvider`, audio file | |
| `supabase/migrations/` (platform-level) | Schema for profiles, quiz_history, missions, billing, schools | **B — ADAPT** | `supabase/migrations/` | Supabase project | Reuse the schema design; create fresh migrations for Senior; do not run Junior migrations against Senior DB |
| `supabase/functions/` | Edge Functions (billing, email, payments) | **B — ADAPT** | `supabase/functions/` | Resend, ToyyibPay | Reuse billing/email functions if shared; otherwise port separately |
| `src/components/billing/MySubscription.tsx` + `src/routes/upgrade.tsx` | Subscription/plan UI | **B — ADAPT** | Same | `feature-access`, billing server functions | Plans and pricing may differ for Senior |
| `wrangler.jsonc` | Cloudflare Pages deployment configuration | **B — ADAPT** | `wrangler.jsonc` | Cloudflare Pages project name `academymy-senior` (new project) | Different project name, different domain; same structure |
| `src/components/home/` (sub-components) | HomeContinueLearning, HomeProgressSummaries, TodaysMission, etc. | **B — ADAPT** | `src/components/home/` | `use-progress`, content registry | Replace Junior subject/chapter references |
| `src/data/subjects.ts` / `src/data/subjects-meta.ts` | Subject definitions (id, name, icon, planet) | **D — DO NOT REUSE** | New file for Senior | — | Junior subjects only (Form 1–3). Senior needs Form 4–5 subjects |
| `src/content/form1/`, `src/content/form2/`, `src/content/form3/` | All Junior curriculum content (notes, quizzes, flashcards, mindmaps) | **D — DO NOT REUSE** | Senior-specific content | — | Wrong form level. Never inherit |
| `src/content/registry.ts` | Junior content registry | **D — DO NOT REUSE** | New Senior registry | — | Only Junior chapters registered |
| `src/data/content.ts` | Massive flat Junior content file (~1.4MB) | **D — DO NOT REUSE** | — | — | Junior curriculum only; very large |
| `src/data/quizzes.ts` | Junior quiz bank (~450KB) | **D — DO NOT REUSE** | — | — | Wrong curriculum |
| `src/data/flashcards.ts` | Junior flashcard bank (~400KB) | **D — DO NOT REUSE** | — | — | Wrong curriculum |
| `src/data/notes.ts` | Junior notes data | **D — DO NOT REUSE** | — | — | Wrong curriculum |
| `src/components/BMWorldPage.tsx` + `BMForm*` | BM Form 1–3 specific pages and content | **D — DO NOT REUSE** | — | — | Wrong form level and curriculum |
| `src/assets/background form 2/`, `src/assets/science/form1/`, etc. | Junior subject chapter background images | **D — DO NOT REUSE** | — | — | Wrong form level |
| `src/routes/admin.tsx` + admin sub-routes | Admin dashboard | **C — REFERENCE ONLY** | Separate admin project or later | — | Can be ported when Senior needs admin tooling |
| `silken-sheen-main/` (entire folder) | Archived earlier version of the app | **D — DO NOT REUSE** | — | — | See Section 7 — Legacy/Duplicate Warning |
| `.claude/`, `.agents/` | AI skill packs (animation, marketing, UI/UX, Supabase) | **D — DO NOT REUSE** | — | — | Third-party skill libraries checked in to the repo; not application code |
| `design-reference/` | Static HTML design reference files | **C — REFERENCE ONLY** | — | — | Useful for understanding note visual language; not importable code |
| `audit-sources/` | Science textbook PDFs | **D — DO NOT REUSE** | — | — | Source audit materials for Junior curriculum; wrong form level |
| `SCIENCE_F2_*.md`, `SCIENCE_F3_*.md` (root-level markdown) | Content audit reports | **D — DO NOT REUSE** | — | — | Junior content documentation |

---

## 4. Exact Source File Paths for Priority Systems

### Authentication
```
src/lib/supabase.ts                    — browser client
src/lib/supabase.server.ts             — server client (RLS-respecting)
src/lib/supabase-auth-cookie.ts        — cookie name/options
src/context/auth-context.tsx           — AuthProvider, useAuth
src/lib/explorer-profile.ts            — onboarding profile (form level, school, language)
src/lib/onboarding-routing.ts          — redirect logic
src/lib/guest-mode.ts                  — guest mode
src/routes/login.tsx                   — login page
src/routes/onboarding.tsx              — onboarding flow
src/routes/auth.callback.tsx           — OAuth callback handler
src/routes/auth.confirm.ts             — email confirm handler
```

### App Shell and Navigation
```
src/components/AppShell.tsx            — full shell (~33KB)
src/components/AcademyLogo.tsx         — logo
src/components/RankBadge.tsx           — rank badge
src/components/ProfileAvatar.tsx       — avatar
src/components/SiteFooter.tsx          — footer
src/components/GalaxySearch.tsx        — global search
src/components/MobileNav.tsx           — mobile nav bar (separate small file)
src/lib/study-routing.ts               — isRouteActive helper
```

### XP, Ranks, Gamification
```
src/hooks/use-progress.ts              — central progress hook (~1500 lines)
src/data/rankAssets.ts                 — rank definitions + image paths
src/lib/mission-system.ts             — mission state, claims, Supabase writes
src/lib/progression-events.ts         — XP events bus, rank-up detection
src/lib/daily-missions.ts             — daily mission pool logic
src/lib/daily-mission-progress.ts     — daily progress tracking
src/lib/feature-access.ts             — feature flags / plan gating
src/config/features.ts                — PLAN_FEATURES map
public/ranks/                          — rank PNG images (6 ranks)
public/companions/                     — companion PNG images (5 species × 5 stages)
public/sounds/rank-up-digital-swoosh.wav
```

### Ace / Cikgu AI
```
src/companion/AICompanionButton.tsx    — floating button
src/companion/CikguAIPanel.tsx         — panel/sheet (~23KB)
src/companion/CompanionImage.tsx       — companion image renderer
src/companion/CompanionPanel.tsx       — companion detail panel
src/companion/CompanionWidget.tsx      — compact companion widget
src/companion/species.ts               — companion species data
src/companion/mood.ts                  — companion mood logic
src/companion/messages.ts             — companion messages
src/companion/selectedAt.ts           — days together calculation
src/companion/banks/                   — challenge, curiosity, notes, story banks
src/companion/cikguMockData.ts         — AI panel mock discovery data
src/companion/index.ts                 — barrel exports
src/assets/cikgu-ai-robot.png         — Ace robot image
src/context/cikgu-context.tsx          — CikguProvider (open/close state)
```

### Progression Celebrations
```
src/components/progression/RankUpCelebration.tsx
src/components/progression/rank-up-celebration.css
src/components/progression/MissionRewardCelebration.tsx
src/components/progression/CompanionEvolutionModal.tsx
src/components/progression/ProgressionHelp.tsx
src/components/progression/RankUpModal.tsx
src/components/Confetti.tsx
```

### Design System (Tailwind + Radix)
```
src/styles.css                         — @theme inline tokens, :root custom properties
src/styles/fonts.css                   — Space Grotesk + Inter font declarations
src/components/ui/                     — all 40+ Radix-backed components
src/lib/utils.ts                       — cn() helper (clsx + tailwind-merge)
public/branding/academy-icon*.png     — brand icons (multiple sizes)
public/branding/academy-logo-full.*   — full logo SVG + PNG
```

### PWA and Cloudflare
```
vite.config.ts                         — VitePWA plugin config, nitro cloudflare preset
wrangler.jsonc                         — Cloudflare Pages project config
public/site.webmanifest               — PWA manifest
src/lib/pwa-register.ts               — service worker registration
scripts/build-pages-worker.js         — Pages Advanced Mode packaging script
scripts/patch-wrangler-assets.js      — wrangler.json patch for Pages deploy
```

### Analytics
```
src/lib/analytics.ts                   — student analytics (quiz history, weak topics)
src/lib/tracker.ts                     — study tracker
src/hooks/use-progress.ts             — getStudentAnalytics is embedded here
src/routes/tracker.tsx                 — AI tracker UI
supabase/migrations/20260703080703_quiz_history.sql
```

### Subscriptions
```
src/lib/feature-access.ts
src/lib/billing-core.ts
src/lib/billing.server.ts
src/lib/billing.types.ts
src/lib/billing-config.ts
src/config/features.ts
src/components/billing/MySubscription.tsx
src/routes/upgrade.tsx
supabase/migrations/20260716001758_subscription_payments_invoices.sql
supabase/functions/create-toyyibpay-bill/
supabase/functions/toyyibpay-callback/
```

---

## 5. Dependencies for Each Reusable System

### AppShell dependencies
- `@tanstack/react-router` (Link, useRouterState, useNavigate)
- `lucide-react` (all nav icons)
- `use-progress`, `getRank`, `getCompanionLevelProgress` from `src/hooks/use-progress.ts`
- `auth-context`, `sign-in-modal` context
- `companion/` (AICompanionButton, CompanionTip, getCompanionDisplayName)
- `progression/` (RankUpCelebration, CompanionEvolutionModal, MissionRewardCelebration)
- `src/components/NextMissionCard.tsx`
- `src/lib/audio/studentMusicRoutes.ts`
- `src/lib/admin-access.ts`
- `src/lib/onboarding-routing.ts`, `src/lib/guest-mode.ts`

### use-progress hook dependencies
- `src/lib/supabase.ts` (session sync)
- `src/lib/guest-mode.ts`
- `src/lib/feature-access.ts`
- `src/lib/mission-system.ts`
- `src/lib/progression-events.ts`
- `src/lib/daily-mission-progress.ts`
- `src/lib/removed-content-progress.ts` (safe to exclude in Senior)
- `src/companion/selectedAt.ts`
- `src/data/rankAssets.ts`
- `src/data/profile-avatars.ts`

### Supabase client dependencies
- `@supabase/ssr` ^0.12.0
- `@supabase/supabase-js` ^2.108.1
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (env vars)
- Server: `@tanstack/start-server-core` (getCookies, setCookie, setResponseHeader)

---

## 6. Junior-Specific Dependencies to Remove

These are tightly coupled to Junior curriculum and must not be ported to Senior:

| Dependency / Pattern | Why it must not be ported | Action |
|---|---|---|
| `src/content/registry.ts` | Registers only Form 1–3 chapters | Replace with Senior registry |
| `src/data/content.ts` | ~1.4MB of Junior curriculum data | Replace with Senior content files |
| `src/data/quizzes.ts` | Junior quiz bank | Replace with Senior quiz files |
| `src/data/flashcards.ts` | Junior flashcard data | Replace with Senior flashcard files |
| `src/data/notes.ts` | Junior notes data | Replace with Senior notes files |
| `src/data/subjects.ts` / `subjects-meta.ts` | Form 1–3 subject IDs and metadata | Create new Senior subjects file |
| `src/content/form1/`, `form2/`, `form3/` | Junior curriculum content | Do not copy |
| `src/data/geography-f1-subtopics.ts` | Junior Geography F1 data | Do not copy |
| `src/data/sejarah-f1-subtopics.ts` | Junior Sejarah F1 data | Do not copy |
| `src/components/notes/ScienceF*` (200+ component files) | Per-Junior-chapter note components | Do NOT copy these; create Senior equivalents for first slice only |
| `src/components/notes/Geo*`, `Sej*`, `Math*`, `BM*` | Junior per-chapter note blocks | Same as above |
| `src/components/BMWorldPage.tsx` + `BMForm*` | Bahasa Melayu Form 1–3 specific pages | Do not copy; Senior BM will have different komsas |
| `src/assets/background form 2/`, `form1/`, `form3/` | Junior chapter background images | Do not copy; source Senior images separately |
| `src/lib/removed-content-progress.ts` | Removes legacy Form 3 Geography content from Junior progress | Not applicable to Senior |
| `src/data/sejarah-f*-*-flashcards.ts` / `quizzes.ts` | Per-chapter Junior sejarah data | Do not copy |
| `src/data/bm-*.ts` (all BM data files) | Junior BM komsas, karangan, peribahasa data | Do not copy |

---

## 7. Legacy / Duplicate Code Warnings

### WARNING: `silken-sheen-main/` is an archived snapshot

The root of the repository contains a `silken-sheen-main/` folder that is an **earlier version of the same application**, committed as a directory (not a submodule). Key differences:

| Aspect | `src/` (current) | `silken-sheen-main/src/` (archive) |
|---|---|---|
| Dependencies | Full stack with Supabase, framer-motion, GSAP, PWA, billing, email, vitest | Minimal — no Supabase, no billing, no email, no PWA, no tests |
| `@lovable.dev/vite-tanstack-config` | `2.9.1` | `2.3.1` (much older) |
| `@tanstack/react-start` | `1.168.26` | `1.167.50` |
| Build scripts | 5 post-build scripts | None |
| Content | Full Junior curriculum (F1–F3 all subjects) | Basic F2 sejarah chapter only |
| Admin dashboard | Full admin | None |
| Billing / payments | Full ToyyibPay + Supabase billing | None |

**Rule:** `silken-sheen-main/` must be classified **D — DO NOT REUSE** in its entirety. It is not a clean starting point; it is a preserved earlier snapshot that is missing most platform features. The current `src/` directory is the correct reference.

### Other legacy patterns in `src/`

- **`src/data/content.ts`** (~1.4MB): A large flat data file that predates the modular `src/content/` structure. The current content is in `src/content/` organized by form/subject/chapter. The flat file is kept for backward compatibility with older progress keys.
- **`src/data/notes.ts`**: Another legacy flat notes file. Newer notes live in `src/content/form*/subject/chapter*/notes.ts`.
- **`src/data/quizzes.ts`** (~450KB): Legacy flat quiz bank. Newer quizzes live in `src/content/*/*/quizzes*.ts`.
- **`design-reference/`**: ~200 static HTML design files used during development to preview note visuals. Not importable code.
- **`SCIENCE_F2_*.md`, `SCIENCE_F3_*.md` (root level)**: Content audit markdown documents. Not code.
- **`.claude/`, `.agents/`**: Third-party AI skill packs for animation, marketing, UI/UX. Not application code — do not confuse with the Kiro `.kiro/` governance files in Senior.

---

## 8. Recommended Clean Senior Folder Structure

```
src/
├── assets/
│   ├── branding/              ← Copy from Junior: academy-icon*.png, logo
│   └── subjects/              ← New: Form 4–5 subject planet images
├── companion/                 ← ADAPT from Junior: AICompanionButton, CikguAIPanel, species, mood
├── components/
│   ├── ui/                    ← REUSE from Junior: all 40+ Radix components verbatim
│   ├── home/                  ← ADAPT from Junior: HomeContinueLearning, etc. (with Senior subjects)
│   ├── notes/
│   │   └── blocks/            ← SELECTIVE PORT: only blocks needed for first slice
│   ├── progression/           ← REUSE from Junior: all celebration modals verbatim
│   ├── billing/               ← ADAPT from Junior: when billing is needed
│   └── [AppShell, RankBadge, AcademyLogo, GalaxySearch, etc.]
├── config/
│   └── features.ts            ← ADAPT from Junior: add Senior-specific features
├── content/
│   ├── types.ts               ← REUSE from Junior: TypeScript content interfaces
│   └── form4/
│       └── science/           ← NEW: first slice science content
│           └── chapter-1/
│               ├── notes.ts
│               ├── flashcards-bm.ts
│               ├── flashcards-dlp.ts
│               ├── quizzes-bm.ts
│               └── quizzes-dlp.ts
├── context/                   ← ADAPT from Junior: auth-context, cikgu-context, sign-in-modal
├── data/
│   ├── rankAssets.ts          ← REUSE from Junior verbatim
│   ├── profile-avatars.ts     ← REUSE from Junior verbatim
│   └── subjects-senior.ts     ← NEW: Form 4–5 subject definitions
├── hooks/
│   └── use-progress.ts        ← ADAPT from Junior: change storage key, preserve all logic
├── lib/                       ← ADAPT from Junior: most lib files reusable
├── routes/
│   ├── __root.tsx
│   ├── index.tsx
│   ├── login.tsx              ← ADAPT
│   ├── onboarding.tsx         ← ADAPT (add Form 4/5 options)
│   ├── home.tsx               ← ADAPT
│   ├── dashboard.tsx          ← ADAPT
│   ├── notes.tsx              ← ADAPT (Senior chapters only)
│   ├── flashcards.tsx         ← ADAPT (Senior decks only)
│   ├── quizzes.tsx            ← ADAPT (Senior quiz bank only)
│   ├── companion.tsx          ← REUSE / minor adapt
│   ├── upgrade.tsx            ← ADAPT
│   └── auth.*.tsx             ← REUSE verbatim
├── styles.css                 ← REUSE from Junior verbatim (same Tailwind tokens)
└── styles/
    └── fonts.css              ← REUSE from Junior verbatim
supabase/
├── migrations/                ← NEW: fresh migrations for Senior DB
├── functions/                 ← ADAPT: reuse billing/email; write Senior-specific
└── config.toml
public/
├── branding/                  ← REUSE from Junior verbatim
├── companions/                ← REUSE from Junior verbatim
├── ranks/                     ← REUSE from Junior verbatim
├── sounds/                    ← REUSE from Junior verbatim
└── world/                     ← NEW: Senior subject planet images
```

---

## 9. Recommended First Components to Migrate/Adapt

For the first vertical slice (Login → Dashboard → Form 4 → one subject → one chapter → Notes + Flashcards + Quiz + XP + Progress), migrate in this order:

**Batch 1 — Foundation (no curriculum dependency)**
1. `src/styles.css` + `src/styles/fonts.css` — design tokens, theme
2. `src/components/ui/` — all Radix/shadcn components
3. `src/lib/utils.ts` — cn() helper
4. `public/branding/` — logo and icon assets
5. `public/ranks/` + `src/data/rankAssets.ts` — rank definitions and images

**Batch 2 — Auth and Shell**
6. `src/lib/supabase.ts` + `src/lib/supabase.server.ts` — Supabase clients
7. `src/lib/supabase-auth-cookie.ts`
8. `src/context/auth-context.tsx` (point at Senior Supabase project)
9. `src/lib/guest-mode.ts`, `src/lib/onboarding-routing.ts`
10. `src/lib/explorer-profile.ts` (add Form 4 and 5 options)
11. `src/routes/login.tsx`
12. `src/routes/onboarding.tsx` (change form level options to 4, 5)
13. `src/routes/auth.callback.tsx`, `src/routes/auth.confirm.ts`

**Batch 3 — Progress and Gamification**
14. `src/hooks/use-progress.ts` (change storage key to `academysenior-progress-v1`)
15. `src/lib/progression-events.ts`
16. `src/lib/mission-system.ts`
17. `src/lib/daily-missions.ts` + `src/lib/daily-mission-progress.ts`
18. `src/lib/sounds.ts` + `public/sounds/`
19. `public/companions/` + all `src/companion/` files

**Batch 4 — App Shell**
20. `src/components/RankBadge.tsx`
21. `src/components/AcademyLogo.tsx`
22. `src/components/ProfileAvatar.tsx`
23. `src/components/progression/` (all celebration modals)
24. `src/components/AppShell.tsx` (update nav items to Senior subjects)
25. `src/components/SiteFooter.tsx`

**Batch 5 — Dashboard**
26. `src/routes/home.tsx` + `src/components/home/` (adapt world portals to Senior subjects)
27. `src/routes/dashboard.tsx` (adapt subject progress to Form 4–5)

**Batch 6 — First slice curriculum**
28. Create `src/content/types.ts` (copy from Junior)
29. Create `src/data/subjects-senior.ts` with Form 4–5 subject definitions
30. Write first Science Form 4 chapter content (notes, flashcards, quizzes)
31. Adapt `src/routes/notes.tsx`, `flashcards.tsx`, `quizzes.tsx` for Senior registry
32. Port only the `src/components/notes/blocks/` components needed for the first chapter

---

## 10. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| **`use-progress.ts` localStorage key clash** — if a student uses both Junior and Senior from the same browser, the default key `learnnova-progress-v1` would be shared | High | Change the key to `academysenior-progress-v1` in Senior immediately |
| **Supabase project coupling** — if Junior and Senior share a Supabase project prematurely, RLS policies could leak cross-form data | High | Use a dedicated Senior Supabase project until shared identity is deliberately designed (TBD-002/003) |
| **`src/content/registry.ts` size** — the Junior registry is ~163KB. Accidentally inheriting it would bloat the Senior bundle and break all routing | High | Never copy `registry.ts`; write a new one from scratch |
| **`silken-sheen-main/` confusion** — developer porting components might accidentally pull from the archived folder | Medium | Document clearly; the archived folder should ideally be removed from the repository eventually |
| **`use-progress.ts` size and complexity** — the hook is ~1500 lines and handles many Junior-specific concerns | Medium | Port it whole, then incrementally remove unused Junior features (e.g. `removePendingGeographyF3Progress`) |
| **framer-motion / GSAP in AppShell** — adds ~100KB to the bundle; the shell relies on these for rank-up and landing animations | Low | Both are already in `package.json`; acceptable for the platform layer |
| **Tailwind v4 no-config-file pattern** — configuration lives in `src/styles.css` via `@theme inline`, not in `tailwind.config.js` | Low | Port `src/styles.css` exactly; do not create a `tailwind.config.js` |
| **`@lovable.dev/vite-tanstack-config`** — this wrapper package controls the Vite/TanStack setup | Low | Use the same version as Junior (`2.9.1`); check for updates carefully |
| **Large curriculum data file sizes** — `quizzes.ts` is ~450KB, `content.ts` is ~1.4MB. These exist because data is TypeScript. | Low | Normal for this pattern; Senior will grow the same way. Do not pre-optimize. |

---

## 11. Remaining Questions

1. **TBD-002: Shared vs. separate Supabase project** — Will the Senior application share the Junior Supabase project (with schema separation) or use a completely new project? This determines whether auth migration is needed.
2. **TBD-003: Shared identity architecture** — Is the `explorer_profiles` table shared? Can Form 4–5 students log in with a Junior account, and if so, which Supabase project owns the `auth.users` table?
3. **Rank assets** — Do ranks carry over from Junior to Senior? If so, students who earned Cosmic Legend in Junior should start Senior at the same rank. This depends on whether progress is shared or separate.
4. **Leaderboard scope** — Is the Senior leaderboard separate from Junior, or combined? The `monthly_leaderboard` view and `get_leaderboard()` function in Supabase would need to be scoped.
5. **Senior subject planet images** — Junior has `public/world/*.webp` for each subject. Senior needs equivalent images for Form 4–5 subjects (Physics, Chemistry, Additional Mathematics, Biology, etc.).
6. **Payment provider** — Junior uses ToyyibPay. Will Senior use the same payment provider and billing functions?
7. **`@lovable.dev/vite-tanstack-config`** — This is a Lovable-specific build wrapper. Will Senior use the same build setup, or a plain TanStack Start setup? The vite.config.ts is heavily customised around this package.
8. **CikguAI knowledge cards table** — `CikguAIPanel` queries a `knowledge_cards` Supabase table for discovery content. Does this table need to exist in the Senior project, or does Senior get its own knowledge base?

---

## 12. Proposed Migration Order (Summary)

```
Phase 1: Foundation
  → styles.css + fonts.css (design tokens)
  → src/components/ui/ (Radix primitives)
  → public/branding/ + public/ranks/ + public/companions/ + public/sounds/

Phase 2: Auth
  → supabase.ts + supabase.server.ts
  → auth-context.tsx (point at Senior project)
  → login.tsx + onboarding.tsx (Form 4/5 options)

Phase 3: Progress
  → use-progress.ts (new storage key)
  → progression-events.ts + mission-system.ts
  → companion/ system

Phase 4: Shell
  → AppShell.tsx (Senior nav items)
  → Progression celebrations

Phase 5: Dashboard
  → home.tsx + HomeDashboard.tsx (Senior subjects)
  → dashboard.tsx (Senior XP stats)

Phase 6: First Slice Content
  → Create Senior subject/chapter data
  → Adapt notes/flashcards/quizzes routes
  → Port only needed notes/blocks components
```

---

## Summary: Top 10 Files/Systems Worth Reusing

1. **`src/components/ui/`** — Complete, battle-tested Radix/shadcn component library. Copy verbatim.
2. **`src/hooks/use-progress.ts`** — Entire XP/rank/streak/companion/mission system. Central to the platform.
3. **`src/styles.css`** — Nova purple design token system (confirmed hex values, Tailwind v4 pattern).
4. **`src/companion/` + `src/components/progression/`** — Complete Ace/Cikgu AI system and rank-up/mission celebrations.
5. **`src/lib/supabase.ts` + `src/lib/supabase.server.ts`** — Production-ready Supabase client pair with correct PKCE, cookies, RLS.
6. **`src/context/auth-context.tsx`** — Robust auth state with 8s timeout, onboarding flow, guest mode.
7. **`src/components/AppShell.tsx`** — Full navigation shell (needs Subject list update only).
8. **`src/components/notes/blocks/`** — 200+ reusable visual blocks (diagrams, calculators, timelines). Needed for rich Senior notes.
9. **`src/lib/mission-system.ts` + `src/lib/progression-events.ts`** — Daily/weekly missions and XP events bus.
10. **`src/data/rankAssets.ts` + `public/ranks/` + `public/companions/`** — All rank and companion visual assets.

## Top 10 Things NOT to Bring Into Senior

1. **`src/content/form1/`, `form2/`, `form3/`** — Wrong form level. Never inherit.
2. **`src/content/registry.ts`** — Junior chapter registry only. Must be rewritten.
3. **`src/data/content.ts`** (~1.4MB) — Entirely Junior curriculum.
4. **`src/data/quizzes.ts`** (~450KB) and **`flashcards.ts`** (~400KB) — Junior banks.
5. **`src/data/subjects.ts` / `subjects-meta.ts`** — Form 1–3 subject definitions only.
6. **`silken-sheen-main/`** — Archived earlier version, not the current codebase.
7. **`src/components/notes/ScienceF*`, `Geo*`, `Sej*`, `MathF*`** — 200+ Junior-chapter-specific note block components. Not the generic blocks in `notes/blocks/` — those can be reused.
8. **`src/components/BMWorldPage.tsx` + `BMForm*`** — Junior BM pages with Form 1–3 komsas.
9. **`src/lib/removed-content-progress.ts`** — Junior-specific Geography F3 cleanup utility. Not applicable.
10. **`.claude/`, `.agents/` (third-party AI skill packs)** — Not application code; 100+ MB of checked-in third-party skill packs.

## Dangerous Coupling to Junior Content/Data

- `src/content/registry.ts` is imported by `src/components/ChapterPicker.tsx`, `src/components/GalaxySearch.tsx`, `src/components/HomeDashboard.tsx`, `src/routes/notes.tsx`, `src/routes/quizzes.tsx`, `src/routes/flashcards.tsx`, `src/routes/mindmaps.tsx` — all of these will need a Senior registry to work
- `src/data/subjects.ts` / `subjects-meta.ts` is imported by `AppShell.tsx`, `HomeDashboard.tsx`, `AcademyPage.tsx`, `dashboard.tsx` — update these to a Senior subjects file
- `src/hooks/use-progress.ts` uses `localStorage` key `learnnova-progress-v1` — **rename immediately** to avoid data collision with Junior

## Architecture Problems Discovered

1. **Curriculum data is embedded as TypeScript modules** — this is intentional (no API needed, Cloudflare edge-compatible, type-safe) but means the first Senior subject chapter must be written entirely as TypeScript data files before any content is visible. This is the expected pattern.
2. **`silken-sheen-main/` is 280MB of unnecessary files** committed to the repository root. This increases clone time and confuses new developers. It should be removed from the Junior repository (out of scope for Senior, but worth noting).
3. **`design-reference/`** contains ~200 HTML reference files (~50MB). Also not necessary in the production repository.
4. **`@lovable.dev/vite-tanstack-config`** is a proprietary Lovable build wrapper. If Senior is built outside Lovable, the standard `@tanstack/start` Vite plugin will be needed instead. Confirm the build environment before starting Senior development.

---

*Audit performed by: Kiro (read-only, no files modified, no production systems accessed)*
