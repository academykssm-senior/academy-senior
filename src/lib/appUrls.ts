const SENIOR_PRODUCTION_HOST = "senior.myacademy.my";

export function getSeniorProductionHost(): string {
  return SENIOR_PRODUCTION_HOST;
}

export function getSeniorAppOrigin(): string {
  return getSeniorAppOriginFromEnv() ?? `https://${SENIOR_PRODUCTION_HOST}`;
}

/** Exact allowlisted OAuth return URL. Do not append query params. */
export function getSeniorAuthCallbackUrl(): string {
  const origin = getSeniorAppOriginFromEnv();
  if (!origin) {
    throw new Error("VITE_APP_URL is required for Senior Google sign-in.");
  }
  return `${origin}/auth/callback`;
}

function getSeniorAppOriginFromEnv(): string | null {
  const configured = import.meta.env.VITE_APP_URL;
  if (typeof configured !== "string") return null;
  const trimmed = configured.trim();
  if (trimmed.length === 0) return null;
  return stripTrailingSlash(trimmed);
}

export function isLocalHostname(hostname: string): boolean {
  const host = hostname.split(":")[0] ?? hostname;
  return host === "localhost" || host === "127.0.0.1" || host.endsWith(".localhost");
}

function stripTrailingSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}
