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
- **Status:** Confirmed (amended by ADR-017)
- **Date:** 2026-09-16
- **Context:** AcadeMY has an existing Form 1–3 application (Junior) in production. The Form 4–5 experience needs its own repository, deployment, and domain to allow independent development without risking the live Junior application.
- **Decision:** AcadeMY Senior is a standalone application in its own repository (`academy-senior`). It is not a monorepo with Junior. It does not share a codebase or deployment pipeline with Junior. The original wording also said Senior does not share a database with Junior; **that database sentence is superseded by ADR-017**.
- **Consequences:** Junior production source, hosting, and curriculum must never be modified by Senior work. Shared identity uses the existing AcadeMY Supabase project (see ADR-017), not a copied Junior repository.

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

### ADR-015: GSAP for the Senior marketing homepage only
- **Status:** Confirmed
- **Date:** 2026-09-21
- **Context:** The public Senior homepage needs a cinematic scroll journey (astronaut choreography, layered parallax, chapter nav). The confirmed stack does not include an animation library. Three.js was considered for ambient particles and deferred to keep student devices usable.
- **Decision:** Add `gsap` 3.15.0 with ScrollTrigger and MotionPathPlugin for `/` only. Load it via a dynamic import from the homepage hook so `/dashboard` and learning routes do not pay the bundle cost. Do not introduce Three.js, Framer Motion, or a custom scrollbar in this pass. Native scrolling remains intact. Animations use `gsap.context()` and revert on unmount.
- **Consequences:** Homepage motion lives in `src/animation/`. Dashboard and AppShell must not import GSAP. A later Three.js ambient layer requires a new ADR.

### ADR-017: Shared Supabase identity — same project, separate apps
- **Status:** Confirmed
- **Date:** 2026-09-22
- **Context:** ADR-001 kept Senior in a separate repository so Junior production stays untouched. Students still need one AcadeMY account. Phase 2A audit found a single live project (`aojrbxoqbgyxmfljqpqj`, API `https://aojrbxoqbgyxmfljqpqj.supabase.co`) already holding `auth.users`, `profiles`, and `user_progress`. Creating a second Auth system or second Supabase project would split identity.
- **Decision:** Junior/Main (`www.myacademy.my`, silken-sheen) and Senior (`senior.myacademy.my`, this repository) remain **separate codebases, separate deployments, and separate curriculum apps**. Both use the **same existing Supabase project** and the **same `auth.users` identity**. `www.myacademy.my` owns Login / Register / OAuth / email confirmation. Senior **consumes** that session (cookie Domain `.myacademy.my` in production) and does **not** ship its own Login or Register. Core user/profile identity (`auth.users`, `profiles`, school, form, language preference) is shared. Product-specific learning progress, Senior League XP, and Junior `get_leaderboard()` / monthly quiz XP / notes reading progress stay **scoped separately** until a later ADR (Phase 2B).
- **Consequences:** Senior env vars point at the existing project (anon key only; no service role in the client). Do not create a second Supabase project. Do not copy the Junior repository. Do not wire Senior UI to Junior-scoped XP RPCs until Phase 2B. ADR-001’s “no shared database” sentence is superseded; separate apps and deployments are not.

### ADR-016: Senior cinematic chrome — midnight navy and portal gold
- **Status:** Confirmed
- **Date:** 2026-09-21
- **Context:** ADR-008 and the design-system steering doc treat Junior’s purple-led dashboard chrome as the Senior reference. The cinematic Senior homepage uses a different visual world (deep space navy, warm portal gold, champagne highlights). Keeping the logged-in shell in Junior purple made Home, Dashboard, and Leaderboard feel like two products.
- **Decision:** The logged-in Senior shell (sidebar, top bar, primary CTAs, active tabs, and in-app surfaces) uses the cinematic Senior palette: midnight navy / charcoal, warm portal gold as the primary accent, muted silver-blue as a supporting accent, and soft white text. Layout, routes, and dashboard/leaderboard behaviour are unchanged. Purple remains a reserved family-brand token (`nova-purple`) but is no longer used for Senior chrome.
- **Consequences:** This is an explicit, approved deviation from ADR-008’s colour language for Senior chrome only. Do not reintroduce bright purple/fuchsia navigation pills or CTA gradients. TBD-008 (family-wide brand hex) remains open for marketing collateral; Senior product chrome follows this ADR.

---

## TBD Decisions

### TBD-001: Frontend framework and language
- **Status:** ~~TBD~~ **RESOLVED — see ADR-010**
- Resolved: TanStack Start + React + TypeScript + Vite confirmed.

### TBD-002: Shared vs. separate Supabase project for Junior and Senior
- **Status:** ~~TBD~~ **RESOLVED — see ADR-017**
- Resolved: Same existing Supabase project. Separate repositories and deployments. No second project.

### TBD-003: Shared identity architecture
- **Status:** ~~TBD~~ **RESOLVED — see ADR-017**
- Resolved: Shared `auth.users` + `profiles`. www owns Login/Register. Senior consumes the session. Product-specific progress/XP remain separately scoped (Phase 2B).

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
