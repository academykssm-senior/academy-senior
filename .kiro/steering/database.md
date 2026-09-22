---
inclusion: always
---

# AcadeMY Senior — Database

## Current State

Senior uses the **existing AcadeMY Supabase project** for authentication and core profile reads (ADR-017). It does not have its own Auth users table.

Do not create a second Supabase project. Do not run schema migrations or alter shared tables unless explicitly instructed. Senior League XP and curriculum progress remain unwired until Phase 2B.

---

## Planned Backend: Supabase

Supabase is the current backend platform for the AcadeMY platform (used by Junior). AcadeMY Senior will also use Supabase for:

- Authentication (Supabase Auth)
- Relational data storage (PostgreSQL via Supabase)
- Row Level Security (RLS) for student data protection
- Storage (for assets, if needed)
- Realtime (for live features, if needed — TBD)

**Project:** the existing AcadeMY project (see ADR-017). Auth identity and `profiles` are shared. Product-specific Senior learning tables, if added later, must be versioned migrations with RLS — never a second Auth project.

---

## Shared Identity vs. Senior-Specific Data

A key principle is that **shared identity data** (who the student is) and **Senior-specific learning data** (what the student has done in Senior) should be separated where appropriate.

### Likely Shared Identity Data

Data that belongs to the student across the entire AcadeMY platform:

- User account (ID, email, display name, avatar)
- Form level / year group
- Language preference (BM / DLP)
- Account creation date and last login

This data should eventually be owned by a shared identity layer, not duplicated per application.

### Likely Senior-Specific Learning Data

Data that is specific to the Form 4–5 learning experience:

- Subject and chapter progress per student
- Notes accessed / bookmarked
- Flashcard deck progress and spaced repetition state
- Quiz attempts, scores, and history
- XP totals and level per subject or overall
- Mission completion state
- Companion system state
- Student analytics snapshots

This data lives in the Senior application's database scope and should not be accessible to or from Junior without an explicit, designed integration.

---

## Schema Change Policy

**No production schema changes without reviewed migrations.**

Rules:
1. All schema changes must be expressed as **versioned migration files** (e.g. Supabase migration SQL files)
2. Migrations must be reviewed before being applied to any shared or production environment
3. Migrations must be **safe to roll back** where possible; destructive changes require extra review
4. No direct schema edits via the Supabase Studio UI in production — migrations are the source of truth
5. During active development, local Supabase (via Supabase CLI) should be used — not a shared dev/staging project

---

## Secrets and Credentials

- Supabase credentials (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) must **never** be hardcoded
- All credentials are managed through environment variables
- The `SERVICE_ROLE_KEY` must **never** be used in client-side code — it is a server-only secret with full database access
- The `ANON_KEY` is safe for client use only when Row Level Security is correctly applied
- `.env` files must be listed in `.gitignore` and never committed

---

## Row Level Security (RLS)

RLS must be considered and designed for every table that holds student data.

Default posture:
- All tables that contain student data must have RLS **enabled**
- Policies must be written so that students can only read and write their own data
- Administrative or teacher access patterns must be explicitly designed, not left as open policies
- Never use `GRANT ALL` or disable RLS on tables with personal data as a shortcut

RLS policies must be included in migration files and reviewed alongside schema changes.

---

## Local Development

When development begins:
- Use the **Supabase CLI** to run a local Supabase instance
- Seed data and test data belong in the local instance only
- Never use production or staging credentials locally unless a deliberate, approved reason exists
- Local Supabase config lives in `supabase/` directory (to be created when development starts)

---

## Principles Summary

| Principle | Rule |
|---|---|
| No production connection yet | Do not connect until explicitly instructed |
| Secrets via env vars only | No hardcoded credentials anywhere |
| Service role key is server-only | Never expose in client-side code |
| RLS on all student data tables | Default to locked-down, open up deliberately |
| Schema changes via migrations | No direct Studio edits in production |
| Shared identity vs. Senior data | Design the boundary explicitly before building |
| Local dev via Supabase CLI | Not against shared environments |
