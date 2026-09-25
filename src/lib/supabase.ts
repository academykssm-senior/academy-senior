import {
  createBrowserClient,
  parseCookieHeader,
  serializeCookieHeader,
  type CookieOptions,
} from "@supabase/ssr";
import {
  SUPABASE_AUTH_COOKIE_ENCODING,
  SUPABASE_AUTH_COOKIE_NAME,
  getSupabaseAuthCookieOptions,
  getSupabaseCookieWrites,
  migrateBrowserAuthCookies,
} from "@/lib/supabase-auth-cookie";
import { getSupabasePublicConfig } from "@/lib/supabaseEnv";

type BrowserSupabaseClient = ReturnType<typeof createBrowserClient>;

let browserClient: BrowserSupabaseClient | null = null;

function readBrowserCookies(): Array<{ name: string; value: string }> {
  return parseCookieHeader(document.cookie).map(({ name, value }) => ({
    name,
    value: value ?? "",
  }));
}

/**
 * Singleton browser client. Do not call `createBrowserClient` elsewhere.
 * Storage key is `academy-auth-v1`, the same cookie Junior writes on `.myacademy.my`.
 */
export function getSupabaseBrowserClient(): BrowserSupabaseClient | null {
  const config = getSupabasePublicConfig();
  if (!config) return null;
  if (browserClient) return browserClient;

  const isBrowser = typeof window !== "undefined";
  const hostname = isBrowser ? window.location.hostname : "localhost";
  const https = isBrowser && window.location.protocol === "https:";

  if (isBrowser) {
    migrateBrowserAuthCookies(
      readBrowserCookies,
      ({ name, value, options }) => {
        document.cookie = serializeCookieHeader(name, value, options);
      },
      config.url,
      hostname,
      https,
    );
  }

  const clientOptions = {
    cookieOptions: {
      name: SUPABASE_AUTH_COOKIE_NAME,
      ...getSupabaseAuthCookieOptions(hostname, https),
    },
    cookieEncoding: SUPABASE_AUTH_COOKIE_ENCODING,
    isSingleton: true as const,
    auth: {
      flowType: "pkce" as const,
      detectSessionInUrl: false,
      persistSession: isBrowser,
      autoRefreshToken: isBrowser,
      storageKey: SUPABASE_AUTH_COOKIE_NAME,
    },
  };

  browserClient = isBrowser
    ? createBrowserClient(config.url, config.anonKey, {
        ...clientOptions,
        cookies: {
          getAll: readBrowserCookies,
          setAll(cookies: Array<{ name: string; value: string; options: CookieOptions }>) {
            for (const { name, value, options } of getSupabaseCookieWrites(
              cookies,
              readBrowserCookies(),
              config.url,
              hostname,
              https,
            )) {
              document.cookie = serializeCookieHeader(name, value, options);
            }
          },
        },
      })
    : createBrowserClient(config.url, config.anonKey, clientOptions);

  return browserClient;
}
