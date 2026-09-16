# AGENTS.md — AcadeMY Senior

Master instructions for any AI coding agent working on this repository.

**Read this file before writing any code, creating any file, or making any change.**

---

## 1. Read These Documents First

Before any coding work, you must read and understand:

| File | Why |
|---|---|
| `.kiro/steering/product.md` | What AcadeMY Senior is, scope, features, and vertical-slice strategy |
| `.kiro/steering/architecture.md` | Application topology, Junior/Senior separation, technology constraints |
| `.kiro/steering/design-system.md` | Visual identity, mobile-first rules, component architecture |
| `.kiro/steering/database.md` | Database rules, Supabase usage, secrets, RLS, migration policy |
| `.kiro/steering/security.md` | Security rules — secrets, RLS, least privilege, production change policy |
| `docs/DECISIONS.md` | Confirmed architecture decisions and TBD items — do not contradict confirmed decisions |
| `docs/DATA_MODEL.md` | Conceptual data model — do not introduce schema that contradicts it |

Do not proceed with implementation if you have not read the relevant sections.

---

## 2. Junior Production is Off Limits

**AcadeMY Junior is a separate, live production application.**

You must never:
- Modify any file in the Junior repository
- Connect to, query, or alter Junior's production database
- Deploy to Junior's infrastructure
- Use Junior's secrets or environment variables
- Copy the entire Junior codebase into Senior

This rule has no exceptions unless the user provides explicit written instruction that names the Junior production system and the specific action required. Even then, treat it as high-risk and confirm before acting.

---

## 3. Check Junior Before Building Any Component

**Before recreating any UI component in Senior, you must first check whether an equivalent proven component already exists in Junior.**

If a Junior equivalent exists:
- Use it as the direct reference implementation
- Port it deliberately and intentionally — do not rebuild from scratch
- Preserve the same visual behaviour, variants, and naming

If no Junior equivalent exists:
- Build it according to the design system rules in `.kiro/steering/design-system.md`
- Ensure it is consistent with Junior's visual language

This rule applies to: layout components, navigation, buttons, cards, forms, XP/progress indicators, modals, skeletons, and any feature-level component (missions, companion, AI chat, analytics, profile, subscription UI).

Do not bypass this check to save time. Consistency with Junior is a product requirement.

---

## 3. Scope Discipline — Build Only What Is Asked

Do not build ahead of the current vertical slice.

The first slice is:
```
Login → Senior Dashboard → Form 4 → Subject → Chapter → Notes + Flashcards + Quiz + XP + Progress
```

Do not implement features outside this slice unless explicitly instructed. Do not create placeholder pages, stubbed-out routes, or skeleton components for features that are not in the current scope.

If a change touches something outside the current slice, stop and confirm with the user.

---

## 4. Change Size and Reviewability

- Make **small, focused, reviewable changes**
- One logical concern per commit — do not bundle unrelated changes
- If a task requires more than ~200 lines of new or changed code, break it into steps and confirm the approach before proceeding
- Prefer modifying existing files correctly over creating new files unnecessarily
- Do not refactor existing code unless it is directly required by the current task

---

## 5. Before Committing (Once the Application Exists)

Before marking any task complete or suggesting a commit:

1. **TypeScript / type checking** — run the type checker and resolve all errors
2. **Linting** — run the project linter and resolve all warnings/errors
3. **Relevant tests** — run tests for any code you created or modified; all must pass
4. **No secrets** — verify no credential, key, or token appears in any staged file
5. **No Junior files** — verify no file from the Junior repository has been touched

Do not skip these checks to save time. A failing type check or lint error is a blocker, not a suggestion.

---

## 6. Secrets and Credentials

- Never write a secret, API key, connection string, or token into source code
- Never hardcode Supabase URLs or keys — use environment variables only
- Never use `SUPABASE_SERVICE_ROLE_KEY` in client-side code — it is server-only
- If you need to reference a secret, use the environment variable name as a placeholder (e.g. `process.env.SUPABASE_URL`) and document it in `.env.example`
- If you discover a secret already committed in the repository, flag it to the user immediately and do not proceed until it is rotated and removed

---

## 7. Database and Schema Rules

- Do not connect to any Supabase project until explicitly instructed
- Do not write or run migration SQL against any shared or production environment
- All schema changes must be expressed as versioned migration files
- RLS must be enabled and policies must be written for every table containing student data
- Do not alter the database schema in ways that contradict `docs/DATA_MODEL.md` without first updating the data model and getting confirmation

---

## 8. Production Changes

**Any action that affects a live or shared environment requires explicit user approval before execution.**

This includes:
- Running migrations against a non-local database
- Deploying to any hosted environment
- Changing environment variables in any hosted environment
- Modifying DNS, SSL, or hosting config
- Any change to a Supabase project that is not your local instance

State clearly what you intend to do and why, and wait for confirmation. Do not proceed on assumed approval.

---

## 9. Architecture and Technology Decisions

The confirmed technology stack is: **TanStack Start · React · TypeScript · Vite · Tailwind CSS · Supabase · Cloudflare · PWA**.

- Do not substitute, replace, or add alongside any confirmed technology without a documented ADR and explicit user approval
- Do not introduce a new framework, library, or major dependency without flagging it to the user and recording the decision in `docs/DECISIONS.md`
- Do not make architectural decisions (e.g. state management approach, API design pattern, routing strategy) unilaterally — propose and confirm
- If you encounter a TBD item in `docs/DECISIONS.md`, do not resolve it by making an implicit choice in code — surface it explicitly
- Senior does not redesign the dashboard — the Junior dashboard is the reference; do not deviate without a confirmed ADR

---

## 10. Code Quality Standards

- Match the language, conventions, and style of existing code in the repository
- Write TypeScript with explicit types — avoid `any`
- Write accessible HTML — semantic elements, proper heading hierarchy, alt text, keyboard operability
- Write mobile-first CSS using **Tailwind CSS** — start from the smallest viewport, use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`) to extend upward
- Use Tailwind theme tokens for colours, spacing, and typography — do not hardcode arbitrary values
- Document non-obvious logic with comments
- Do not leave `console.log`, `debugger`, or TODO comments in committed code without a tracking issue
- Prefer TanStack Start conventions (file-based routing, loaders, actions) over ad-hoc patterns

---

## 11. Communication

- If you are uncertain about scope, intent, or the correct approach, ask before acting
- If a task requires a decision that is marked TBD, surface it rather than resolving it silently
- When completing a task, briefly summarise what was changed and why — do not just say "done"
- If you encounter a potential security issue, flag it immediately and clearly
