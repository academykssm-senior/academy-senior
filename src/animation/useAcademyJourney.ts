import { useEffect, type RefObject } from "react";
import type { AcademyJourneyRefs } from "@/animation/academyJourney";

export function useAcademyJourney(
  rootRef: RefObject<HTMLElement | null>,
  astronautRef: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    const root = rootRef.current;
    const astronaut = astronautRef.current;
    if (!root || !astronaut) return;

    let cancelled = false;
    let revert: (() => void) | undefined;

    void import("@/animation/academyJourney").then(({ initAcademyJourney }) => {
      const refs: AcademyJourneyRefs = { root, astronaut };
      const cleanup = initAcademyJourney(refs);
      if (cancelled) {
        cleanup();
        return;
      }
      revert = cleanup;
    });

    return () => {
      cancelled = true;
      revert?.();
    };
  }, [astronautRef, rootRef]);
}
