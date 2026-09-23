const DEFAULT_NEXT = "/home";
const AUTH_NEXT_STORAGE_KEY = "academy-senior.auth.next";
export const AUTH_NEXT_COOKIE = "academy-senior-auth-next";

export function rememberAuthNextPath(next: string): void {
  const safe = sanitizeNextPath(next);
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem(AUTH_NEXT_STORAGE_KEY, safe);
  }
  if (typeof document !== "undefined") {
    document.cookie = `${AUTH_NEXT_COOKIE}=${encodeURIComponent(safe)}; Path=/; SameSite=Lax; Max-Age=600`;
  }
}

export function takeRememberedAuthNextPath(): string | null {
  if (typeof sessionStorage === "undefined") return null;
  const stored = sessionStorage.getItem(AUTH_NEXT_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_NEXT_STORAGE_KEY);
  return stored;
}

const ALLOWED_NEXT =
  /^\/(home|dashboard|learning|community|leaderboard|f4)(\/|$|\?)/;

/**
 * Senior-only relative return paths. Rejects open redirects and Main/www URLs.
 */
export function sanitizeNextPath(raw: string | null | undefined): string {
  if (typeof raw !== "string") return DEFAULT_NEXT;
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return DEFAULT_NEXT;
  if (trimmed.includes("\\") || trimmed.includes("://")) return DEFAULT_NEXT;
  if (/^[a-zA-Z][a-zA-Z+.-]*:/.test(trimmed)) return DEFAULT_NEXT;

  const [pathPart = "", searchPart] = splitPathAndSearch(trimmed);
  if (pathPart === "/login" || pathPart === "/register" || pathPart === "/forgot-password") {
    return DEFAULT_NEXT;
  }
  if (pathPart.startsWith("/auth")) return DEFAULT_NEXT;
  if (!ALLOWED_NEXT.test(pathPart)) return DEFAULT_NEXT;
  if (searchPart && /https?:|\/\//i.test(searchPart)) return DEFAULT_NEXT;

  return searchPart ? `${pathPart}?${searchPart}` : pathPart;
}

function splitPathAndSearch(value: string): [string, string | undefined] {
  const q = value.indexOf("?");
  if (q === -1) return [value, undefined];
  return [value.slice(0, q), value.slice(q + 1)];
}
