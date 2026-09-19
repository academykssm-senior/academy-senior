import { cn } from "@/lib/utils";

const TONES = [
  "bg-violet-500/25 text-violet-100",
  "bg-cyan-500/20 text-cyan-100",
  "bg-indigo-500/25 text-indigo-100",
  "bg-fuchsia-500/20 text-fuchsia-100",
  "bg-sky-500/20 text-sky-100",
  "bg-teal-500/20 text-teal-100",
] as const;

type StudentAvatarProps = {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZE_CLASS = {
  sm: "h-8 w-8 text-[11px]",
  md: "h-11 w-11 text-sm",
  lg: "h-16 w-16 text-lg",
} as const;

export function StudentAvatar({ name, src = null, size = "md", className }: StudentAvatarProps) {
  const initials = getInitials(name);
  const tone = TONES[hashName(name) % TONES.length] ?? TONES[0];

  if (src) {
    return (
      <img
        alt=""
        className={cn("shrink-0 rounded-full object-cover", SIZE_CLASS[size], className)}
        src={src}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-semibold",
        SIZE_CLASS[size],
        tone,
        className,
      )}
    >
      {initials}
    </span>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const second = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : (parts[0]?.[1] ?? "");
  return `${first}${second}`.toUpperCase();
}

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash + name.charCodeAt(i) * (i + 1)) % 997;
  }
  return hash;
}
