---
inclusion: always
---

# AcadeMY Senior — Product Definition

## What Is AcadeMY Senior?

AcadeMY Senior is the Form 4–5 extension of the AcadeMY learning platform. It is a dedicated web application serving Malaysian secondary school students in the upper secondary years, continuing the AcadeMY experience beyond the Junior platform (Forms 1–3).

AcadeMY Senior lives at its own domain (`senior.myacademy.my`) and in its own repository. It shares the AcadeMY brand identity and, eventually, a shared student identity layer — but it is a **separate application** from AcadeMY Junior. The Junior codebase and production environment must not be modified by Senior development work.

### Senior Is Not a Dashboard Redesign

**AcadeMY Senior reuses the existing AcadeMY Junior dashboard experience.** It is not a redesign. The dashboard layout, navigation patterns, and all platform features (XP, ranks, streaks, missions, companion, AI, analytics, profile, subscription UI) carry over from Junior unchanged in their look, feel, and behaviour.

The primary difference between Junior and Senior is the **curriculum layer**:

| Layer | Junior | Senior |
|---|---|---|
| Forms covered | 1–3 | 4–5 |
| Subject catalogue | Junior subjects | Senior subjects |
| Chapter/content | Junior chapters | Senior chapters |
| Dashboard & features | ← **Reference implementation** | Matches Junior |

Senior adapts the curriculum, not the platform. If you are building a feature that exists in Junior, the Junior implementation is the reference. Do not redesign it.

---

## Scope: Form 4 and Form 5

AcadeMY Senior covers:

- **Form 4** — Year one of Malaysian upper secondary (SPM preparation begins)
- **Form 5** — Year two of Malaysian upper secondary (SPM year)

It does not cover Forms 1–3. Those are served by AcadeMY Junior.

---

## Language Support

AcadeMY Senior must support both streams from the very beginning:

- **Bahasa Melayu (BM)** — standard national curriculum stream
- **DLP (Dual Language Programme) / English** — English-medium science and mathematics stream

Language awareness must be built into content models, UI labels, and routing from day one. It must not be retrofitted later.

---

## Learning Features

The full planned feature set includes:

| Feature | Description |
|---|---|
| Notes | Structured written study notes per chapter |
| Videos | Embedded learning videos per topic |
| Mind Maps | Visual topic summaries |
| Flashcards | Spaced-repetition card decks |
| Quizzes | Chapter and topic assessments |
| XP & Progress | Experience points, level tracking, progress indicators |
| Student Analytics | Personal performance data and study insights |
| Ace / Cikgu AI | AI-powered study assistant and tutor |
| Missions | Structured learning challenges and goals |
| Companion System | Motivational companion characters tied to student progress |

**Not all features are built at once.** See vertical slice strategy below.

---

## Vertical Slice Development Strategy

Development proceeds in deliberate vertical slices — each slice is a thin but complete, shippable path through the application. No horizontal layer (e.g. all database tables, all UI components) is completed in isolation before moving to the next concern.

### First Vertical Slice (Planned)

The first slice to be built covers exactly this path:

```
Login
 └── Senior Dashboard
      └── Form 4
           └── Subject (one subject)
                └── Chapter (one chapter)
                     ├── Notes
                     ├── Flashcards
                     ├── Quiz
                     ├── XP
                     └── Progress
```

Everything outside this slice is **out of scope** until this slice is complete and reviewed.

### Subsequent Slices (TBD)

Further slices will be defined after the first slice ships. Likely candidates include:
- Additional subjects and chapters
- Form 5 content
- Videos and mind maps
- Missions and companion system
- AI features (Ace / Cikgu AI)
- Analytics

---

## Technology Stack

AcadeMY Senior uses the same technology stack as Junior. This is a confirmed decision — do not deviate without a documented technical reason.

| Technology | Role |
|---|---|
| TanStack Start | Full-stack React framework (routing, SSR) |
| React | UI component library |
| TypeScript | Language — strict types throughout |
| Vite | Build tooling |
| Tailwind CSS | Styling |
| Supabase | Auth, database, RLS |
| Cloudflare | Deployment and edge infrastructure |
| PWA | Progressive Web App support |

Deviating from any of these requires a new confirmed ADR entry in `docs/DECISIONS.md` with a documented technical reason.

---

## Product Principles

1. **Continuity first** — Senior continues the Junior experience; it does not reinvent it
2. **Curriculum is the delta** — the main thing that changes from Junior to Senior is subjects and chapters
3. **Mobile first** — design and build for small screens first; desktop is an enhancement
4. **Fast loading** — performance is a feature; students may be on limited data connections
5. **Student friendly** — language, tone, and UX should feel motivating, not institutional
6. **Premium AcadeMY design** — consistent with the AcadeMY brand; purple visual identity
7. **BM and DLP from day one** — language switching is not an afterthought
8. **Accessible** — meet baseline accessibility standards (keyboard nav, contrast, screen readers)
9. **Minimal dependencies** — do not add packages unless clearly justified
10. **Reusable components** — check Junior first; build only what does not already exist there
11. **Secure by default** — security is not added later; it is built in from the start
12. **Never expose secrets** — no keys, tokens, or credentials in client-side code or version control
