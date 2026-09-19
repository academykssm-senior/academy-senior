import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-surface-raised p-4 text-text-primary",
        className,
      )}
    >
      {children}
    </div>
  );
}
