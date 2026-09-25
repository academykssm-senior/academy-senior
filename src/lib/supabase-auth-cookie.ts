import type { CookieOptions } from "@supabase/ssr";

/** Shared with Junior. Do not rename without changing both apps together. */
export const SUPABASE_AUTH_COOKIE_NAME = "academy-auth-v1";

/**
 * `@supabase/ssr` default. Junior does not override this.
 * Chunks are `academy-auth-v1`, `academy-auth-v1.0`, `academy-auth-v1.1`, …
 * with a `base64-` prefix when the payload is encoded.
 */
export const SUPABASE_AUTH_COOKIE_ENCODING = "base64url" as const;

/** Align with @supabase/ssr refresh-cookie lifetime (~400 days). */
const AUTH_COOKIE_MAX_AGE_SECONDS = 400 * 24 * 60 * 60;

const PRODUCTION_HOSTS = ["myacademy.my", "www.myacademy.my", "senior.myacademy.my"] as const;

export const SUPABASE_AUTH_COOKIE_OPTIONS = {
  path: "/" as const,
  sameSite: "lax" as const,
  httpOnly: false,
  maxAge: AUTH_COOKIE_MAX_AGE_SECONDS,
};

export type SupabaseAuthCookieOptions = typeof SUPABASE_AUTH_COOKIE_OPTIONS & {
  secure: boolean;
  domain?: ".myacademy.my";
};

type Cookie = { name: string; value: string };
type CookieWrite = Cookie & { options: CookieOptions };

export function getSupabaseAuthCookieOptions(
  hostname: string,
  https = false,
): SupabaseAuthCookieOptions {
  const host = hostname.split(":")[0] ?? hostname;
  const production = (PRODUCTION_HOSTS as readonly string[]).includes(host);
  return {
    ...SUPABASE_AUTH_COOKIE_OPTIONS,
    secure: production || https,
    ...(production ? { domain: ".myacademy.my" as const } : {}),
  };
}

function authCookieGroup(name: string, projectUrl: string): string | null {
  const projectKey = `sb-${new URL(projectUrl).hostname.split(".")[0]}-auth-token`;
  for (const key of [SUPABASE_AUTH_COOKIE_NAME, projectKey]) {
    for (const suffix of ["", "-code-verifier", "-user"]) {
      const base = key + suffix;
      if (
        name === base ||
        (name.startsWith(`${base}.`) && /^\d+$/.test(name.slice(base.length + 1)))
      ) {
        return base;
      }
    }
  }
  return null;
}

function withoutDomain(options: CookieOptions): CookieOptions {
  const { domain: _domain, ...rest } = options;
  return rest;
}

function applyScope(
  cookieOptions: CookieOptions,
  scope: SupabaseAuthCookieOptions,
): CookieOptions {
  const scoped = withoutDomain({
    ...cookieOptions,
    ...scope,
    maxAge: cookieOptions.maxAge ?? scope.maxAge,
  });
  if (!scope.domain) return scoped;
  return { ...scoped, domain: scope.domain };
}

/**
 * Apply the shared scope at the write boundary, including removals and every SSR chunk.
 * On production hosts, delete host-only copies first so they cannot shadow `.myacademy.my`.
 */
export function getSupabaseCookieWrites(
  cookies: CookieWrite[],
  existing: Cookie[],
  projectUrl: string,
  hostname: string,
  https = false,
): CookieWrite[] {
  const scope = getSupabaseAuthCookieOptions(hostname, https);
  const writes: CookieWrite[] = [];
  if (scope.domain) {
    const names = new Set([...existing, ...cookies].map(({ name }) => name));
    for (const name of names) {
      if (authCookieGroup(name, projectUrl)) {
        writes.push({
          name,
          value: "",
          options: { ...withoutDomain(scope), maxAge: 0 },
        });
      }
    }
  }
  for (const cookie of cookies) {
    writes.push({
      ...cookie,
      options: applyScope(cookie.options, scope),
    });
  }
  return writes;
}

/**
 * Cookies do not expose their domain when read. Delete host-only copies first,
 * then reread so a parent-domain value wins over a stale duplicate.
 * Migrate a complete `academy-auth-v1` group only when no parent-domain group remains.
 * Legacy `sb-<project>-auth-token` cookies are removed and not migrated.
 */
export function migrateBrowserAuthCookies(
  read: () => Cookie[],
  write: (cookie: CookieWrite) => void,
  projectUrl: string,
  hostname: string,
  https = false,
): void {
  const scope = getSupabaseAuthCookieOptions(hostname, https);
  if (!scope.domain) return;
  const before = read().filter(({ name }) => authCookieGroup(name, projectUrl));
  for (const name of new Set(before.map((cookie) => cookie.name))) {
    write({ name, value: "", options: { ...withoutDomain(scope), maxAge: 0 } });
  }
  const survivingGroups = new Set(
    read()
      .map(({ name }) => authCookieGroup(name, projectUrl))
      .filter((group): group is string => group !== null),
  );
  for (const cookie of before) {
    const group = authCookieGroup(cookie.name, projectUrl);
    if (
      group?.startsWith(SUPABASE_AUTH_COOKIE_NAME) &&
      !survivingGroups.has(group)
    ) {
      write({ ...cookie, options: scope });
    }
  }
}
