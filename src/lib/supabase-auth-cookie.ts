import {
  getSharedAuthCookieDomain,
  isLocalHostname,
  shouldUseParentAuthCookieDomain,
} from "@/lib/appUrls";

/** Align with typical @supabase/ssr refresh-cookie lifetime (~400 days). */
const AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 400;

export type SupabaseAuthCookieOptions = {
  path: "/";
  sameSite: "lax";
  secure: boolean;
  maxAge: number;
  domain?: string;
};

/**
 * Cookie settings shared with Main AcadeMY for the same `auth.users` session.
 *
 * Production (`www` / `senior` under myacademy.my): Domain=.myacademy.my, Secure, SameSite=Lax, Path=/.
 * Localhost: host-only cookies (no parent Domain) so local HTTP testing still works.
 *
 * HttpOnly is omitted. `@supabase/ssr` PKCE refresh on the browser client must
 * read the chunked auth cookies; setting HttpOnly here would desync SSR and the browser.
 */
export function getSupabaseAuthCookieOptions(hostname: string): SupabaseAuthCookieOptions {
  const useParentDomain = shouldUseParentAuthCookieDomain(hostname);
  const secure = useParentDomain || !isLocalHostname(hostname);

  if (useParentDomain) {
    return {
      path: "/",
      sameSite: "lax",
      secure: true,
      maxAge: AUTH_COOKIE_MAX_AGE_SECONDS,
      domain: getSharedAuthCookieDomain(),
    };
  }

  return {
    path: "/",
    sameSite: "lax",
    secure,
    maxAge: AUTH_COOKIE_MAX_AGE_SECONDS,
  };
}
