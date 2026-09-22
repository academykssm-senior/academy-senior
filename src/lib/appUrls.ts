const MAIN_APP_PRODUCTION = "https://www.myacademy.my";
const SENIOR_PRODUCTION_HOST = "senior.myacademy.my";
const SHARED_AUTH_COOKIE_DOMAIN = ".myacademy.my";

export function getMainAppOrigin(): string {
  const configured = readPublicEnv("VITE_MAIN_APP_URL");
  if (configured) return stripTrailingSlash(configured);
  return MAIN_APP_PRODUCTION;
}

export function getSeniorAppOrigin(): string {
  const configured = readPublicEnv("VITE_APP_URL");
  if (configured) return stripTrailingSlash(configured);
  if (typeof window !== "undefined") return window.location.origin;
  return `https://${SENIOR_PRODUCTION_HOST}`;
}

export function getMainLoginUrl(): string {
  return `${getMainAppOrigin()}/login`;
}

export function getMainHomeUrl(): string {
  return `${getMainAppOrigin()}/`;
}

export function isLocalHostname(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".localhost")
  );
}

export function shouldUseParentAuthCookieDomain(hostname: string): boolean {
  if (isLocalHostname(hostname)) return false;
  return hostname === "myacademy.my" || hostname.endsWith(SHARED_AUTH_COOKIE_DOMAIN);
}

export function getSharedAuthCookieDomain(): string {
  return SHARED_AUTH_COOKIE_DOMAIN;
}

export function getSeniorProductionHost(): string {
  return SENIOR_PRODUCTION_HOST;
}

function readPublicEnv(name: "VITE_MAIN_APP_URL" | "VITE_APP_URL"): string | undefined {
  const value = import.meta.env[name];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function stripTrailingSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}
