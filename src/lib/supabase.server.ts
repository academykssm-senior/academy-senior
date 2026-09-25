import { createServerClient } from "@supabase/ssr";
import {
  getCookies,
  getRequest,
  getRequestHost,
  getRequestProtocol,
  setCookie,
  setResponseHeader,
} from "@tanstack/react-start/server";
import {
  SUPABASE_AUTH_COOKIE_ENCODING,
  SUPABASE_AUTH_COOKIE_NAME,
  getSupabaseAuthCookieOptions,
  getSupabaseCookieWrites,
} from "@/lib/supabase-auth-cookie";
import { getSupabasePublicConfig } from "@/lib/supabaseEnv";

/**
 * Per-request server client. Runs as the student's shared `.myacademy.my` session (RLS).
 * Never uses the service role key. Does not create profiles.
 */
export function createSupabaseServerClient() {
  const config = getSupabasePublicConfig();
  if (!config) return null;

  const hostname = getRequestHost().split(":")[0] ?? "localhost";
  const https = getRequestProtocol({ xForwardedProto: true }) === "https";
  const cookieOptions = {
    name: SUPABASE_AUTH_COOKIE_NAME,
    ...getSupabaseAuthCookieOptions(hostname, https),
  };

  return createServerClient(config.url, config.anonKey, {
    cookieOptions,
    cookieEncoding: SUPABASE_AUTH_COOKIE_ENCODING,
    auth: {
      storageKey: SUPABASE_AUTH_COOKIE_NAME,
    },
    cookies: {
      getAll() {
        return readRequestCookies();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value, options } of getSupabaseCookieWrites(
          cookiesToSet,
          readRequestCookies(),
          config.url,
          hostname,
          https,
        )) {
          setCookie(name, value, options);
        }
        for (const [headerName, headerValue] of Object.entries(headers)) {
          setResponseHeader(headerName, headerValue);
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
