export function formatXp(xp: number): string {
  return `${xp.toLocaleString("en-MY")} XP`;
}

export function formatRank(rank: number): string {
  return `#${rank}`;
}

export function formatPaddedRank(rank: number): string {
  return String(rank).padStart(2, "0");
}

export function formatRelativeActivity(iso: string, now = Date.now()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";

  const diffMs = Math.max(0, now - then);
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function formatRankChange(change: number): {
  label: string;
  tone: "up" | "down" | "flat";
} {
  if (change > 0) return { label: `↑ ${change}`, tone: "up" };
  if (change < 0) return { label: `↓ ${Math.abs(change)}`, tone: "down" };
  return { label: "—", tone: "flat" };
}
