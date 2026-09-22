import { createServerClient } from "@supabase/ssr";
import { getCookies, getRequestHost, setCookie } from "@tanstack/react-start/server";
import { getSupabaseAuthCookieOptions } from "@/lib/supabase-auth-cookie";
import { getSupabasePublicConfig } from "@/lib/supabaseEnv";

/**
 * Per-request server client. Runs as the student's cookie session (RLS).
 * Never uses the service role key.
 */
export function createSupabaseServerClient() {
  const config = getSupabasePublicConfig();
  if (!config) return null;

  const hostname = getRequestHost();
  const cookieOptions = getSupabaseAuthCookieOptions(hostname);

  return createServerClient(config.url, config.anonKey, {
    cookieOptions,
    cookies: {
      getAll() {
        return Object.entries(getCookies()).map(([name, value]) => ({ name, value }));
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          setCookie(name, value, {
            path: cookieOptions.path,
            sameSite: cookieOptions.sameSite,
            secure: cookieOptions.secure,
            maxAge: options?.maxAge ?? cookieOptions.maxAge,
            ...(cookieOptions.domain ? { domain: cookieOptions.domain } : {}),
          });
        }
      },
    },
  });
}
