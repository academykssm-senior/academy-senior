import { getMainLoginUrl, getSeniorAppOrigin, getSeniorProductionHost, isLocalHostname } from "@/lib/appUrls";

/**
 * Allowlisted post-login destinations. Rejects open redirects.
 * Only Senior hosts are valid — never bounce to an arbitrary origin.
 */
export function sanitizeReturnTo(raw: string | null | undefined, fallbackOrigin = getSeniorAppOrigin()): string {
  const fallback = `${stripTrailingSlash(fallbackOrigin)}/home`;
  if (!raw) return fallback;

  try {
    const origin = stripTrailingSlash(fallbackOrigin);
    const candidate = raw.startsWith("/") && !raw.startsWith("//") ? new URL(raw, `${origin}/`) : new URL(raw);

    if (candidate.protocol !== "http:" && candidate.protocol !== "https:") return fallback;
    if (candidate.username || candidate.password) return fallback;
    if (!isAllowedReturnHost(candidate.hostname)) return fallback;

    const path = candidate.pathname.startsWith("/") ? candidate.pathname : `/${candidate.pathname}`;
    return `${candidate.origin}${path}${candidate.search}`;
  } catch {
    return fallback;
  }
}

export function buildMainLoginRedirect(requestedUrl: string): string {
  const next = sanitizeReturnTo(requestedUrl);
  return `${getMainLoginUrl()}?next=${encodeURIComponent(next)}`;
}

function isAllowedReturnHost(hostname: string): boolean {
  if (hostname === getSeniorProductionHost()) return true;
  if (isLocalHostname(hostname)) return true;

  try {
    const appHost = new URL(getSeniorAppOrigin()).hostname;
    return hostname === appHost;
  } catch {
    return false;
  }
}

function stripTrailingSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}
