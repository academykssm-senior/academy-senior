---
inclusion: always
---

# AcadeMY Senior — Security

Security is built in from the start. It is not reviewed at the end of a sprint or added as a phase. Every code change, schema design, and deployment decision must consider the security implications.

---

## Secrets Management

### Never Commit Secrets

No secret, credential, key, token, password, or connection string may ever be committed to version control — not even in a private repository.

This includes:
- Supabase `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Any third-party API keys (AI providers, analytics, email, etc.)
- Database connection strings
- JWT secrets
- OAuth client secrets

**How secrets are managed:**
- All secrets are stored as **environment variables**
- Local development uses a `.env` (or `.env.local`) file that is listed in `.gitignore`
- CI/CD and production secrets are stored in the hosting platform's secret manager, not in code
- `.env.example` files with placeholder values (not real values) may be committed as documentation

### What to do if a secret is accidentally committed

1. Rotate the secret immediately — assume it is compromised
2. Remove it from history using appropriate git tooling
3. Report the incident before continuing work

---

## Supabase Service Role Key

The Supabase `SERVICE_ROLE_KEY` bypasses Row Level Security and has full database access. It is **a server-side-only secret**.

Rules:
- The service role key must **never** appear in client-side JavaScript, HTML, or any bundle that is sent to a browser
- It must only be used in server-side code (API routes, server functions, backend services)
- If a client-side import ever references the service role key, it is a critical security bug

The `ANON_KEY` is designed for client-side use — but only when RLS policies are correctly applied. Relying on the anon key without RLS is not acceptable for student data.

---

## Row Level Security (RLS)

All tables that hold student personal data or learning records must have RLS **enabled**.

Policies must enforce:
- Students can only read and modify **their own** data (matched by `auth.uid()`)
- No student can read another student's learning records, quiz scores, or progress
- Teacher/admin access is explicitly designed — not left open by default
- `SELECT`, `INSERT`, `UPDATE`, and `DELETE` policies are individually considered, not bundled

RLS policies are part of migrations and must be reviewed alongside schema changes. Disabling RLS on any student data table requires explicit justification and approval.

---

## Least Privilege

Every component, service, and database role should have only the permissions it needs — nothing more.

- Client-side code uses the Supabase `anon` role with RLS-constrained access
- Server-side functions use the minimum Supabase role required for the operation
- Do not use the service role key for operations that can be done with a user-scoped token
- Third-party integrations receive scoped API keys, not admin credentials

---

## Client-Side Security

- Never expose private credentials, internal API endpoints, or database connection details to the browser
- Validate and sanitise all user inputs on the server side, even if also validated on the client
- Do not trust client-supplied data for authorisation decisions — verify server-side using the authenticated user's session
- Use HTTPS for all network communication — no plaintext HTTP in production
- Apply appropriate Content Security Policy (CSP) headers
- Avoid storing sensitive data in `localStorage` or `sessionStorage` where session cookies are more appropriate

---

## Authentication

- Authentication is handled through Supabase Auth (JWT-based)
- Session tokens must be handled securely and not logged
- Implement appropriate session expiry and token refresh behaviour
- If email/password auth is used, enforce minimum password requirements
- Magic link / OTP flows must use short-lived tokens

---

## Production Change Policy

**No production infrastructure changes without explicit written approval.**

This includes:
- Deploying to `senior.myacademy.my`
- Running migrations against a production or shared database
- Modifying DNS, SSL, or hosting configuration
- Changing any environment variable in a production environment
- Modifying Supabase Auth settings in a production project
- Any change that could affect live student data or access

The approval must be documented (in a PR, issue, or decision record) before the action is taken — not after.

---

## Junior Production — Off Limits

AcadeMY Junior is a live production application used by real students. The Senior repository and team must never:

- Access or modify Junior's production database
- Deploy code to Junior's infrastructure
- Use Junior's production environment variables or secrets
- Make changes to Junior's Supabase project

This applies even if access technically exists. Any cross-application action requires explicit, reviewed approval.

---

## Dependency Security

- Prefer well-maintained, widely-used packages over obscure alternatives
- Pin dependency versions to avoid unexpected upstream changes
- Review changelogs before upgrading dependencies
- Do not install packages unless there is a clear, justified need
- Regularly check for known vulnerabilities in dependencies (e.g. `npm audit`)

---

## Summary Checklist

Before any code is committed or deployed, verify:

- [ ] No secrets in source code or version control
- [ ] `.env` files are in `.gitignore`
- [ ] Service role key is not referenced in client-side code
- [ ] RLS is enabled and policies are written for any new student data table
- [ ] User inputs are validated server-side
- [ ] Production changes have explicit written approval
- [ ] Junior production has not been touched
