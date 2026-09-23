import { createServerClient } from "@supabase/ssr";
import { getCookies, getRequest, getRequestHost, setCookie } from "@tanstack/react-start/server";
import { getSupabaseAuthCookieOptions } from "@/lib/supabase-auth-cookie";
import { getSupabasePublicConfig } from "@/lib/supabaseEnv";

/**
 * Per-request server client. Runs as the student's host-only cookie session (RLS).
 * Never uses the service role key. Never sets a parent-domain cookie.
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
        return readRequestCookies();
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          setCookie(name, value, {
            path: cookieOptions.path,
            sameSite: cookieOptions.sameSite,
            secure: cookieOptions.secure,
            maxAge: options?.maxAge ?? cookieOptions.maxAge,
          });
        }
      },
    },
  });
}

function readRequestCookies(): Array<{ name: string; value: string }> {
  const fromStore = Object.entries(getCookies()).map(([name, value]) => ({ name, value }));
  const header = getRequest().headers.get("cookie");
  if (!header) return fromStore;

  const byName = new Map(fromStore.map((cookie) => [cookie.name, cookie]));
  for (const part of header.split(";")) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const name = trimmed.slice(0, eq);
    if (byName.has(name)) continue;
    byName.set(name, { name, value: trimmed.slice(eq + 1) });
  }
  return [...byName.values()];
}
