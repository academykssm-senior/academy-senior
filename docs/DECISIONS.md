# Architecture Decision Log — AcadeMY Senior

This log records architecture and technology decisions for AcadeMY Senior. Only decisions that have been explicitly confirmed are marked as decided. Everything else is marked **TBD**.

Do not resolve TBD items by making implicit choices in code. Surface them and get confirmation first.

---

## How to Use This Log

- **Confirmed** — decision is made and must be followed; changing it requires a new ADR entry
- **TBD** — not yet decided; do not assume a default; raise it before it blocks work
- **Superseded** — a previous decision that has been replaced; kept for history

Each entry follows this format:

```
### ADR-XXX: [Title]
- Status: Confirmed | TBD | Superseded
- Date: YYYY-MM-DD
- Context: Why this decision was needed
- Decision: What was decided
- Consequences: What this means going forward
```

---

## Confirmed Decisions

### ADR-001: AcadeMY Senior is a separate application from Junior
- **Status:** Confirmed
- **Date:** 2026-09-16
- **Context:** AcadeMY has an existing Form 1–3 application (Junior) in production. The Form 4–5 experience needs its own repository, deployment, and domain to allow independent development without risking the live Junior application.
- **Decision:** AcadeMY Senior is a standalone application in its own repository (`academy-senior`). It is not a monorepo with Junior. It does not share a codebase, deployment pipeline, or database with Junior.
- **Consequences:** Junior production must never be modified by Senior work. Any future shared infrastructure (e.g. shared identity) requires deliberate design and explicit approval before implementation.

### ADR-002: Supabase is the planned backend platform
- **Status:** Confirmed
- **Date:** 2026-09-16
- **Context:** Supabase is already in use by the AcadeMY platform for authentication and database. Using the same platform for Senior ensures consistency and leverages existing team knowledge.
- **Decision:** AcadeMY Senior will use Supabase for authentication (Supabase Auth), relational database (PostgreSQL), and Row Level Security.
- **Consequences:** No production Supabase connection until explicitly instructed. Local development uses Supabase CLI. All schema changes are expressed as versioned migrations. RLS must be applied to all student data tables.

### ADR-003: Planned domain is senior.myacademy.my
- **Status:** Confirmed
- **Date:** 2026-09-16
- **Context:** A consistent subdomain under `myacademy.my` communicates brand continuity while keeping Senior clearly distinct from Junior.
- **Decision:** The production domain for AcadeMY Senior will be `senior.myacademy.my`.
- **Consequences:** DNS, SSL, and hosting for this domain must be provisioned before the first production deployment. No deployment has been made yet.

### ADR-004: Development follows a vertical-slice strategy
- **Status:** Confirmed
- **Date:** 2026-09-16
- **Context:** Building all features at once increases risk and delays student value. Vertical slices deliver thin but complete, testable paths through the application.
- **Decision:** Senior is built one vertical slice at a time. The first slice covers: Login → Senior Dashboard → Form 4 → one subject → one chapter → Notes, Flashcards, Quiz, XP, Progress.
- **Consequences:** Features outside the current slice must not be built until the current slice is complete and reviewed. Scope creep within a slice must be flagged.

### ADR-005: BM and DLP language support from day one
- **Status:** Confirmed
- **Date:** 2026-09-16
- **Context:** Malaysian students are split between Bahasa Melayu and DLP (English-medium) streams. Retrofitting dual-language support after launch is costly and error-prone.
- **Decision:** Language (BM / DLP) is a first-class attribute in content models, routing, and UI from the first slice.
- **Consequences:** Content data models must include a language field. UI must handle both language labels. No content is created that assumes a single language.

### ADR-006: Mobile-first design and development
- **Status:** Confirmed
- **Date:** 2026-09-16
- **Context:** The majority of Malaysian students access learning platforms on mobile devices. Desktop layouts are secondary.
- **Decision:** All UI is designed and implemented starting from the smallest practical viewport (360px–390px). Desktop is a progressive enhancement.
- **Consequences:** Layouts, touch targets, navigation patterns, and performance budgets must all be evaluated from the mobile baseline first.

### ADR-007: Secrets are managed via environment variables only
- **Status:** Confirmed
- **Date:** 2026-09-16
- **Context:** Hardcoded credentials in source code are a critical security risk, particularly for a student-facing platform.
- **Decision:** All secrets (Supabase keys, API keys, connection strings) are stored as environment variables. `.env` files are gitignored. `.env.example` with placeholder values is committed.
- **Consequences:** Any secret found in the codebase must be treated as compromised and rotated immediately.

### ADR-008: Senior reuses the Junior dashboard experience — it is not a redesign
- **Status:** Confirmed
- **Date:** 2026-09-16
- **Context:** The AcadeMY Junior dashboard represents a proven, student-tested platform experience. Rebuilding it from scratch for Senior introduces unnecessary risk, cost, and inconsistency.
- **Decision:** AcadeMY Senior reuses the Junior dashboard experience. The dashboard layout, navigation patterns, XP system, ranks, streaks, missions, companion system, Ace / Cikgu AI interface, profile, analytics visual language, subscription UI, and mobile behaviour all carry over from Junior unchanged in their design and behaviour.
- **Consequences:** Any deviation from Junior's dashboard design requires a documented reason and explicit approval. Senior-specific changes are limited to the curriculum layer (subjects, chapters, content).

### ADR-009: The primary difference between Junior and Senior is the curriculum layer
- **Status:** Confirmed
- **Date:** 2026-09-16
- **Context:** Students moving from Junior to Senior should experience the same platform — just with Form 4–5 subjects and chapters instead of Form 1–3.
- **Decision:** Senior adapts Junior's curriculum catalogue and content — not the dashboard, not the features, not the design system. Form 4–5 subjects, chapters, notes, flashcards, and quizzes replace their Junior equivalents.
- **Consequences:** Development effort for Senior is focused on content modelling, curriculum data, and content delivery — not platform feature development. Platform features follow Junior's implementation.

### ADR-010: Confirmed technology stack — TanStack Start / React / TypeScript / Vite / Tailwind / Supabase / Cloudflare / PWA
- **Status:** Confirmed
- **Date:** 2026-09-16
- **Context:** The Junior application uses this stack in production. Using the same stack for Senior ensures consistency, shared patterns, and the ability to deliberately reuse components.
- **Decision:** AcadeMY Senior uses TanStack Start (routing/SSR), React (UI), TypeScript (language), Vite (build), Tailwind CSS (styling), Supabase (auth + database), Cloudflare (deployment), and PWA support.
- **Consequences:** TBD-001 (framework) and TBD-005 (styling) are now resolved and closed. Any deviation from this stack requires a new ADR with a documented technical reason and explicit approval.

### ADR-011: Junior components are the reference — check Junior before building in Senior
- **Status:** Confirmed
- **Date:** 2026-09-16
- **Context:** Because Senior reuses the Junior dashboard experience, many UI components already exist in proven form in the Junior codebase.
- **Decision:** Before building any UI component in Senior, agents and developers must check whether an equivalent proven component exists in Junior. If it does, that component is the reference implementation and must be ported deliberately rather than rebuilt from scratch.
- **Consequences:** This reduces duplicate work, ensures consistency, and prevents Senior from accidentally diverging from the platform design. The entire Junior repository must not be copied — only specific, needed components are ported.

### ADR-012: Do not copy the entire Junior repository into Senior
- **Status:** Confirmed
- **Date:** 2026-09-16
- **Context:** While Senior shares the Junior dashboard experience, bulk-copying the Junior repository would introduce stale code, Junior-specific curriculum logic, and maintenance overhead.
- **Decision:** Senior is a fresh repository. Individual, proven components and patterns are ported from Junior deliberately when they are needed for the current vertical slice — not preemptively.
- **Consequences:** The Senior repository starts lean. Each ported component is a conscious decision, documented when introduced.

### ADR-013: Junior production must not be modified during Senior development
- **Status:** Confirmed
- **Date:** 2026-09-16
- **Context:** Junior is a live production system used by real students. Senior development activity must not risk it.
- **Decision:** No change — code, schema, environment variable, deployment, or configuration — may be made to the Junior production system as part of Senior development work. This applies even if access technically exists.
- **Consequences:** Enforced in AGENTS.md. Any cross-application action requires explicit written approval that names the specific action and the system it affects.

### ADR-014: Senior curriculum hierarchy and stable identifiers
- **Status:** Confirmed
- **Date:** 2026-09-19
- **Context:** Form 4 and Form 5 need one reusable learning architecture. Subject-specific apps, mixed chapter slug styles, and bundling heavy content into catalogue files would not scale.
- **Decision:** AcadeMY Senior uses a single hierarchy — Form → Subject → Chapter → Learning Tool → Activity — with stable kebab-case ids (`chemistry`, `chapter-02`, `quiz`, `set-a`). Canonical content languages are `bm` and `en`. Curriculum manifests hold metadata only; learning datasets load separately later. Notes is typed but postponed. Form 5 must reuse this architecture. Current TanStack routes `/f4/$lang/...` are preserved; `dlp` remains a legacy alias for `en`.
- **Consequences:** New subjects and chapters follow `src/curriculum/` manifests and `docs/SENIOR_ARCHITECTURE.md`. Do not create per-subject page files. Do not put quiz/flashcard/mind-map datasets in manifests.

---

## TBD Decisions

### TBD-001: Frontend framework and language
- **Status:** ~~TBD~~ **RESOLVED — see ADR-010**
- Resolved: TanStack Start + React + TypeScript + Vite confirmed.

### TBD-002: Shared vs. separate Supabase project for Junior and Senior
- **Status:** TBD
- **Context:** A shared student identity requires some shared data layer. Whether this means a single Supabase project with schema separation or two projects with a bridge service is unresolved.
- **Blocking:** Database provisioning, shared identity implementation
- **To decide:** Supabase project topology for Senior and the eventual shared identity layer

### TBD-003: Shared identity architecture
- **Status:** TBD
- **Context:** Students should ultimately have one AcadeMY identity across Junior and Senior. The mechanism (shared Supabase auth, dedicated auth service, federated identity, etc.) has not been designed.
- **Blocking:** Cross-platform login, shared profile, cross-platform progress
- **To decide:** Technical design for the shared identity system

### TBD-004: Hosting and deployment platform for Senior
- **Status:** TBD
- **Context:** Cloudflare is confirmed as the deployment platform (see ADR-010), but the specific Cloudflare product (Pages, Workers, D1, etc.), CI/CD pipeline, and environment configuration have not been finalised.
- **Blocking:** First production deployment
- **To decide:** Specific Cloudflare product configuration and CI/CD pipeline setup

### TBD-005: CSS and styling approach
- **Status:** ~~TBD~~ **RESOLVED — see ADR-010**
- Resolved: Tailwind CSS confirmed.

### TBD-006: State management approach
- **Status:** TBD
- **Context:** Client-side state (user session, UI state, cached learning data) needs a management strategy. TanStack Start and React are confirmed; the right state management choice within that stack (TanStack Query, Zustand, React context, or server-driven patterns) has not been decided. Junior's approach should be reviewed as the reference.
- **Blocking:** First data-fetching implementation
- **To decide:** State management library or pattern consistent with TanStack Start + React

### TBD-007: AI feature integration (Ace / Cikgu AI)
- **Status:** TBD
- **Context:** The AI study assistant feature requires an AI provider, API integration, and prompt design. This is not in the first vertical slice.
- **Blocking:** AI feature development (out of scope for first slice)
- **To decide:** AI provider, model selection, integration pattern

### TBD-008: Exact brand colour palette and typography
- **Status:** TBD
- **Context:** Purple is confirmed as the primary brand colour but exact hex values, shade scales, and typeface selections need to be aligned with the AcadeMY brand guide.
- **Blocking:** First UI styling work
- **To decide:** Full design token values for colour and typography

### TBD-009: Analytics and monitoring platform
- **Status:** TBD
- **Context:** Student-facing analytics (study insights, progress) and operational monitoring (error tracking, performance) need platform choices.
- **Blocking:** Analytics feature and production readiness
- **To decide:** Analytics provider and error/performance monitoring approach

### TBD-010: Testing strategy and tooling
- **Status:** TBD
- **Context:** Unit, integration, and end-to-end testing approaches need to be chosen consistently with the TanStack Start + React + Vite stack. Junior's testing setup should be reviewed as the reference.
- **Blocking:** Test infrastructure setup
- **To decide:** Test runner (Vitest is a natural fit with Vite), assertion library, and E2E tooling (Playwright likely)
