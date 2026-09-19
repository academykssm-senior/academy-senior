# AcadeMY Senior — Architecture Contract

This document is the source of truth for AcadeMY Senior application architecture.

It describes the curriculum, identity, language, routing, and content-loading contracts for Form 4 and Form 5. Dashboard design, authentication, Supabase, XP presentation, and Nova/companion behaviour are out of scope here.

---

## 1. Universal learning hierarchy

Every learning item in AcadeMY Senior is addressed through one hierarchy:

```
FORM
 → SUBJECT
   → CHAPTER
     → LEARNING TOOL
       → ACTIVITY
```

Example:

```
Form 4
 → Chemistry
   → Chapter 2
     → Quiz
       → Set A
```

Do not build a separate architecture per subject. Chemistry, Biology, Bahasa Melayu, and every future subject use this same model.

Form 5 must reuse this hierarchy exactly. Do not create a Form 5 application, router, or catalogue system.

---

## 2. Learning activity identity

One addressable learning activity is identified by:

```ts
{
  form: 4,
  subjectId: "chemistry",
  chapterId: "chapter-02",
  toolId: "quiz",
  activityId: "set-a",
  language: "en"
}
```

This identity is the future key for:

- progress
- XP
- completion
- Continue Learning
- analytics
- weak-topic analysis
- reports

Phase 1 establishes the type only. No progress backend is implemented yet.

Canonical TypeScript type: `LearningActivityIdentity` in `src/types/learning.ts`.

---

## 3. Stable identifier conventions

Identifiers are lowercase kebab-case slugs. They are stable: renaming a display title must not change the id.

### 3.1 Form

```ts
type FormLevel = 4 | 5
```

URL prefix today: `f4` for Form 4. Form 5 should later use `f5` with the same child segments.

### 3.2 Subject IDs

| Subject                 | `subjectId`               |
| ----------------------- | ------------------------- |
| Bahasa Melayu           | `bahasa-melayu`           |
| English                 | `english`                 |
| Mathematics             | `mathematics`             |
| Additional Mathematics  | `additional-mathematics`  |
| Sejarah                 | `sejarah`                 |
| Biology                 | `biology`                 |
| Chemistry               | `chemistry`               |
| Physics                 | `physics`                 |

### 3.3 Chapter IDs

Canonical form:

```
chapter-01
chapter-02
chapter-03
```

Do not use `chapter1`, `ch1`, `chapter_1`, or topic slugs such as `atomic-structure` as identifiers.

**Canonical id is the only chapter id.** Continue Learning, navigation, manifests, route generation, progress identities, and new code must use `chapter-NN`.

A small number of pre-architecture URL slugs still exist as **redirect aliases only** (see §8.2). They are not a second ID system. Do not store them in progress records or generate new links with them.

### 3.4 Learning tool IDs

Visible now:

| Tool        | `toolId`      |
| ----------- | ------------- |
| Flashcards  | `flashcards`  |
| Quiz        | `quiz`        |
| Mind Map    | `mind-map`    |

Reserved, not displayed:

| Tool  | `toolId` | Status                          |
| ----- | -------- | ------------------------------- |
| Notes | `notes`  | Intentionally postponed         |

Do not render Notes, do not add a Notes page, and do not show “Notes Coming Soon”. The type union includes `notes` so the tool can be added later without restructuring.

### 3.5 Activity IDs

Activities sit under a tool. Examples:

```
set-a
set-b
set-c
```

Activity ids are kebab-case. A chapter tool with no sets yet may omit activities until content exists.

### 3.6 Language

Internal content language ids:

```ts
type ContentLanguage = "bm" | "en"
```

| Id   | Meaning                                      |
| ---- | -------------------------------------------- |
| `bm` | Bahasa Melayu content                        |
| `en` | English / DLP content                        |

`dlp` is **not** an internal language id. Legacy `/f4/dlp/...` URLs redirect to `/f4/en/...`. Student-facing copy may still say “DLP” for the English stream.

BM and DLP are **content variants**, not separate applications. Do not duplicate subject or chapter page implementations per language.

---

## 4. Notes are postponed

Notes are a future learning tool (`notes`). Phase 1:

- does not display Notes
- does not create a Notes route or page
- does not add a disabled Notes control

Chapter manifests may omit `notes` or set it `false`. UI must only render tools in the visible set: `flashcards`, `quiz`, `mind-map`.

---

## 5. Curriculum vs content vs UI vs progress

Keep these responsibilities separate:

| Layer        | Responsibility                                         | Lives in (current / target)      |
| ------------ | ------------------------------------------------------ | -------------------------------- |
| Curriculum   | What subjects, chapters, and tools exist               | `src/curriculum/`                |
| Content      | Actual flashcards, quiz items, mind-map data           | Not bundled in manifests; later  |
| UI           | How information is displayed                           | `src/components/`, `src/routes/` |
| Progress     | What the student has completed                         | Types only in Phase 1            |
| XP           | How rewards are calculated                             | Not redesigned in Phase 1        |
| Routing      | How students navigate                                  | `src/routes/` (TanStack Start)   |

Curriculum manifests describe **what exists**. They must not contain quiz question banks, flashcard decks, or mind-map node trees.

---

## 6. Manifest architecture

A **subject manifest** is lightweight metadata:

- `id`, `form`, `name`
- optional BM / English names
- artwork, accent
- chapter manifests

A **chapter manifest** is lightweight metadata:

- `id` (`chapter-01`, …)
- `number`
- `title`, optional BM / DLP titles
- `languages`
- `tools` availability

Example (shape only):

```ts
{
  id: "chapter-01",
  number: 1,
  title: "Introduction to Chemistry",
  languages: ["en", "bm"],
  tools: {
    flashcards: true,
    quiz: true,
    "mind-map": true
  }
}
```

Form 4 registry: `src/curriculum/form-4/`.
Form 5: same folder pattern later (`src/curriculum/form-5/`). Do not invent a second system.

Query helpers: `src/curriculum/index.ts`.
Existing UI imports may continue to use `src/content/catalogue.ts`, which re-exports those helpers.

---

## 7. Content loading principle

The dashboard must not load:

```
8 subjects × many chapters × BM/DLP × quiz sets × flashcards × mind maps
```

at startup.

Phase 1 does not implement a content loader. Folder layout is ready for later lazy loading:

```
src/curriculum/form-4/<subject>/index.ts          # manifest only
src/curriculum/form-4/<subject>/content/          # future heavy datasets
```

When content is added, import it from the chapter/tool/activity/language that is being viewed — not from the Form 4 registry.

---

## 8. Routing contract

The project uses **TanStack Start file-based routing**. That convention is preserved.

### 8.1 Current working routes (do not break)

Language is already in the URL:

```
/f4/:lang
/f4/:lang/:subject
/f4/:lang/:subject/:chapter
/f4/:lang/:subject/:chapter/flashcards
/f4/:lang/:subject/:chapter/quiz
/f4/:lang/:subject/:chapter/mind-map
```

`:lang` accepts:

- `bm` — Bahasa Melayu (canonical)
- `en` — English / DLP (canonical)
- `dlp` — **legacy URL only**; redirects to `en`

Do not generate new links with `dlp`. Internal types, content loading, and progress use `bm` | `en` only.

Logical desired shape without language (`/form-4/:subject/...`) is **not** forced yet. Changing it would break working navigation.

### 8.2 Legacy chapter URL aliases (redirects only)

These inbound URLs redirect to the canonical `chapter-NN` path. They must not be used as identifiers in new code.

| Subject        | Canonical id   | Legacy URL slug (redirects) |
| -------------- | -------------- | --------------------------- |
| biology        | `chapter-01`   | `cell-structure`            |
| biology        | `chapter-02`   | `biomolecules`              |
| chemistry      | `chapter-01`   | `atomic-structure`          |
| mathematics    | `chapter-01`   | `quadratic-functions`       |

Example: `/f4/bm/chemistry/atomic-structure` → `/f4/bm/chemistry/chapter-01`.

Tool suffixes (`/flashcards`, `/quiz`, `/mind-map`) are preserved during the redirect.

### 8.3 Form 5

Reuse the same child route pattern (`subject` → `chapter` → tool). Do not copy Form 4 page components into a parallel Form 5 tree of subject-specific pages.

### 8.4 Generic pages

Do not create `ChemistryPage.tsx`, `BiologyPage.tsx`, or other subject-specific page files. Routes already act as generic Form / Subject / Chapter / Tool pages driven by curriculum data.

Subjects registered without chapters stay in the catalogue. Dashboard cards show **Coming soon** and are not navigable. The Form 4 subject list shows the same Coming soon state and does not open an empty chapter flow. Direct visits to a subject URL with no chapters show an explicit Coming soon message. Do not invent placeholder chapters.

---

## 9. Source organization

Target shape (migrate toward this; do not recreate empty folders for appearance):

```
src/
├── components/          # UI — dashboard, layout, primitives
├── curriculum/          # manifests (metadata only)
│   └── form-4/<subject>/index.ts
├── content/             # compatibility catalogue + dashboard mock data
├── features/            # future feature modules (progress, xp, tools)
├── types/
│   ├── curriculum.ts
│   ├── learning.ts
│   ├── progress.ts
│   └── student.ts
└── routes/              # TanStack Start file routes — keep as-is
```

Not created in Phase 1 because nothing belongs there yet:

- `src/app/`
- `src/components/learning/`
- `src/curriculum/form-5/`
- empty feature implementations for flashcards / quiz / mindmap

Existing dashboard components stay under `src/components/dashboard/`.

---

## 10. Progress architecture (future)

Progress records will key off:

```
form + subjectId + chapterId + toolId + activityId + language
```

See `src/types/progress.ts`. Do not implement storage, RLS, or XP calculation in Phase 1.

---

## 11. What Phase 1 does not do

- Populate Chemistry (or any subject) with full learning content
- Implement Flashcards, Quiz, or Mind Map interactions beyond existing placeholders
- Redesign the dashboard, Nova, XP UI, or subscriptions
- Rewrite authentication or Supabase
- Add Notes
- Add Form 5 content
- Add new runtime dependencies

---

## 12. Compatibility notes

- Internal language ids are `bm` and `en` only. Student-facing English stream may still be labelled **DLP**. Legacy `dlp` URLs redirect to `en`.
- Database rows use UUID primary/foreign keys; routes and manifests use stable slugs. See `docs/DATA_MODEL.md`. Do not put UUIDs in student-facing routes.
- `LanguageStream` remains a route-facing type that can include inbound `dlp` so the redirect can run. After redirect, URLs and generated links use `bm` | `en`.
