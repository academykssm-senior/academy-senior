import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn — class name helper.
 * Merges Tailwind classes without conflicts, using clsx for conditional logic.
 * Matches Junior's src/lib/utils.ts exactly.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
