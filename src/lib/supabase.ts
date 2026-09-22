import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseAuthCookieOptions } from "@/lib/supabase-auth-cookie";
import { getSupabasePublicConfig } from "@/lib/supabaseEnv";

type BrowserSupabaseClient = ReturnType<typeof createBrowserClient>;

let browserClient: BrowserSupabaseClient | null = null;

/**
 * Singleton browser client. Do not call `createBrowserClient` elsewhere.
 * Do not attach additional `onAuthStateChange` listeners in the shell.
 */
export function getSupabaseBrowserClient(): BrowserSupabaseClient | null {
  const config = getSupabasePublicConfig();
  if (!config) return null;
  if (browserClient) return browserClient;

  const hostname = typeof window !== "undefined" ? window.location.hostname : "localhost";
  const cookieOptions = getSupabaseAuthCookieOptions(hostname);

  browserClient = createBrowserClient(config.url, config.anonKey, {
    cookieOptions,
    isSingleton: true,
    auth: {
      flowType: "pkce",
      detectSessionInUrl: false,
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return browserClient;
}
