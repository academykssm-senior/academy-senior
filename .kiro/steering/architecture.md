---
inclusion: always
---

# AcadeMY Senior — Architecture

## Application Topology

AcadeMY is structured as a family of distinct applications under one brand, not a monolith.

```
www.myacademy.my
│
│   Main AcadeMY gateway / marketing / registration
│   (separate application — not owned by this repository)
│
├── Junior  (Forms 1–3)
│   ├── Repository: separate production repository
│   ├── Domain:     (existing, managed by Junior team)
│   └── Status:     PRODUCTION — must not be modified by Senior work
│
└── Senior  (Forms 4–5)
    ├── Repository: THIS repository (academy-senior)
    ├── Domain:     senior.myacademy.my  (planned)
    └── Status:     new development
```

---

## Boundaries and Separation

### AcadeMY Junior — Hands Off

AcadeMY Junior is a separate, live production application in its own repository.

**The Senior repository must never:**
- Modify Junior source code
- Deploy to Junior's infrastructure
- Alter Junior's database schema or data
- Copy Junior’s hosting secret store or `.env` files
- Import or depend on Junior's codebase as a package (hard dependency)

Senior may be configured independently with the **same Supabase project URL and anon key** as Main/Junior (ADR-017). That is shared identity, not a copied Junior environment.

### Component Reuse from Junior — Deliberate and Selective

Senior reuses Junior's dashboard experience, but this does **not** mean copying the entire repository. Reuse is:

- **Deliberate** — a specific component or pattern is identified, reviewed, and intentionally reproduced in Senior
- **Selective** — only what is needed for the current slice is brought across
- **Reviewed** — the component must be understood before being ported; no blind copying

**Before building any UI component in Senior, agents must first check whether an equivalent proven component already exists in Junior.** If it does, that component is the reference implementation. Port it intentionally rather than rebuilding from scratch.

Junior components or patterns that do not exist in Senior yet are **not** automatically imported — they are ported when they become relevant to the current slice.

### AcadeMY Senior — This Repository

Everything in this repository is scoped exclusively to the Form 4–5 experience at `senior.myacademy.my`.

---

## Shared Identity (ADR-017 / ADR-018)

Students use the **same AcadeMY account** (`auth.users`) and the **same browser session** on Junior and Senior.

| Concern | Decision |
|---|---|
| Repositories | Separate |
| Deployments / domains | Separate (`www.myacademy.my` vs `senior.myacademy.my`) |
| Curriculum / app UX | Separate |
| Supabase project | Shared — existing AcadeMY project `aojrbxoqbgyxmfljqpqj` |
| `auth.users` / `profiles` / schools | Shared where compatible. Senior reads `profiles.id` = `claims.sub` and does not create profiles |
| Login / Register UI | Senior still has its own pages until SSO is proven |
| Auth cookies | Shared `academy-auth-v1` on `Domain=.myacademy.my` in production. Localhost stays host-only |
| Learning progress, Senior League XP | Product-scoped |

A student signed in at `www.myacademy.my` is recognized at `senior.myacademy.my`. If that cookie is absent, Senior `/login` is still the fallback.

---

## Technology Stack

AcadeMY Senior uses the same confirmed technology stack as Junior. This ensures compatibility, shared team knowledge, and consistent developer experience across both applications.

| Technology | Role | Status |
|---|---|---|
| TanStack Start | Full-stack React framework (routing, SSR) | **Confirmed** |
| React | UI component library | **Confirmed** |
| TypeScript | Language — strict types throughout | **Confirmed** |
| Vite | Build tooling | **Confirmed** |
| Tailwind CSS | Styling | **Confirmed** |
| Supabase | Auth, database, RLS | **Confirmed** |
| Cloudflare | Deployment and edge infrastructure | **Confirmed** |
| PWA | Progressive Web App support | **Confirmed** |

Deviating from any confirmed technology requires:
1. A documented technical reason
2. A new confirmed ADR entry in `docs/DECISIONS.md`
3. Explicit user approval before any change is made

Do not introduce alternative frameworks, styling systems, or deployment platforms without going through this process.

---

## Environments

| Environment | Purpose | Status |
|---|---|---|
| Local | Development on a developer's machine | Active when building begins |
| Staging | Pre-production integration testing | TBD |
| Production | `senior.myacademy.my` — live student traffic | Not yet provisioned |

Production infrastructure must not be created or modified without explicit approval.

---

## Domain and Routing (Planned)

- `www.myacademy.my` — gateway/marketing (not this repo)
- `senior.myacademy.my` — this application (planned, not yet provisioned)

DNS, SSL, and hosting configuration are TBD and will be defined before the first deployment.

---

## Principles

- Prefer **explicit separation** over shared infrastructure until sharing is intentionally designed
- Prefer **reversible decisions** — do not lock in infrastructure choices before the first slice is shipped
- All architecture changes must be documented in `docs/DECISIONS.md`
- Production changes require **explicit written approval** before execution
