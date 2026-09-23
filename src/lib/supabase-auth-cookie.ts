import { isLocalHostname } from "@/lib/appUrls";

/** Align with typical @supabase/ssr refresh-cookie lifetime (~400 days). */
const AUTH_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 400;

export type SupabaseAuthCookieOptions = {
  path: "/";
  sameSite: "lax";
  secure: boolean;
  maxAge: number;
};

/**
 * Host-only Senior session cookies. Do not set Domain — never `.myacademy.my`.
 * Path=/, SameSite=Lax, Secure in production (non-localhost).
 */
export function getSupabaseAuthCookieOptions(hostname: string): SupabaseAuthCookieOptions {
  return {
    path: "/",
    sameSite: "lax",
    secure: !isLocalHostname(hostname),
    maxAge: AUTH_COOKIE_MAX_AGE_SECONDS,
  };
}
