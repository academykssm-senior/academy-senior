type MasteryRingProps = {
  value: number;
  size?: "sm" | "lg";
};

export function MasteryRing({ value, size = "sm" }: MasteryRingProps) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const dimensions = size === "lg" ? "h-28 w-28" : "h-20 w-20";

  return (
    <div className={`relative grid shrink-0 place-items-center ${dimensions}`}>
      <svg className="h-full w-full -rotate-90" viewBox="0 0 72 72">
        <circle
          cx="36"
          cy="36"
          fill="none"
          r={radius}
          stroke="var(--surface-container)"
          strokeWidth="6"
        />
        <circle
          className="drop-shadow-[0_0_5px_rgba(16,185,129,0.45)]"
          cx="36"
          cy="36"
          fill="none"
          r={radius}
          stroke="var(--status-mastered)"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth="6"
        />
      </svg>
      <div className="absolute text-center">
        <strong className="block text-base leading-none">{value}%</strong>
        <span className="mt-1 block text-[8px] font-semibold uppercase tracking-wide text-on-surface-variant">
          Mastered
        </span>
      </div>
    </div>
  );
}
