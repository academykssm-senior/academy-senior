import { cn } from "@/lib/utils";

type ProgressBarProps = {
  value: number;
  className?: string;
  indicatorClassName?: string;
  label?: string;
};

export function ProgressBar({
  value,
  className,
  indicatorClassName,
  label = "Progress",
}: ProgressBarProps) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div
      aria-label={label}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={safeValue}
      className={cn("h-1.5 overflow-hidden rounded-full bg-surface-container-low", className)}
      role="progressbar"
    >
      <div
        className={cn(
          "h-full rounded-full bg-primary-container transition-[width] duration-700 motion-reduce:transition-none",
          indicatorClassName,
        )}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}
