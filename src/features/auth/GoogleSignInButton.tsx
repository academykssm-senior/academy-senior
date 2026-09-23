import { getSeniorAuthCallbackUrl } from "@/lib/appUrls";
import { rememberAuthNextPath, sanitizeNextPath } from "@/lib/returnTo";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export function GoogleSignInButton({ next, label }: { next: string; label: string }) {
  return (
    <button
      className="mt-4 flex min-h-12 w-full items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-sm font-semibold text-on-surface transition hover:border-cta-gold/40"
      onClick={() => {
        void startGoogleSignIn(next);
      }}
      type="button"
    >
      {label}
    </button>
  );
}

async function startGoogleSignIn(next: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  rememberAuthNextPath(sanitizeNextPath(next));

  const redirectTo = getSeniorAuthCallbackUrl();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });
  if (error || !data.url) return;
  if (data.url.includes("www.myacademy.my")) return;
  window.location.assign(data.url);
}
