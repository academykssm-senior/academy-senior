import { getCookie, getCookies, getRequestUrl } from "@tanstack/react-start/server";
import { AUTH_NEXT_COOKIE, sanitizeNextPath } from "@/lib/returnTo";
import { createSupabaseServerClient } from "@/lib/supabase.server";

export type OAuthCallbackGetResult =
  | { ok: true; response: Response }
  | { ok: false; message: string };

export async function handleSeniorOAuthCallbackGet(): Promise<OAuthCallbackGetResult> {
  const requestUrl = getRequestUrl();
  const code = requestUrl.searchParams.get("code");
  if (!code) return { ok: false, message: "Missing OAuth code." };

  const supabase = createSupabaseServerClient();
  if (!supabase) return { ok: false, message: "Senior sign-in is not configured." };

  const hasVerifier = Object.keys(getCookies()).some((name) => name.endsWith("-code-verifier"));
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return {
      ok: false,
      message: hasVerifier ? error.message : "PKCE verifier cookie was missing.",
    };
  }

  const next = sanitizeNextPath(getCookie(AUTH_NEXT_COOKIE));

  return {
    ok: true,
    response: new Response(null, {
      status: 303,
      headers: {
        Location: next,
      },
    }),
  };
}
