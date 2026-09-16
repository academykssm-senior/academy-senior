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
- Share environment variables or secrets with Junior
- Import or depend on Junior's codebase as a package (hard dependency)

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

## Shared Identity Goal

Students should eventually use **one AcadeMY identity** across both Junior and Senior — a single login, single profile, and single progress record that spans their secondary school years.

### Current State

The shared identity layer does not exist yet. Supabase is used for authentication in the existing platform, but a unified cross-application identity system has not been designed or implemented.

### Approach (Planned — TBD)

Shared identity will be designed deliberately. Options under consideration include:

- A shared Supabase project with RLS-separated schemas per application
- A dedicated identity/auth service that both Junior and Senior delegate to
- Supabase Auth as the identity layer, with per-application databases for learning data

**No shared identity implementation will begin until the architecture is explicitly agreed and reviewed.**

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
