import { useEffect, type RefObject } from "react";
import type { AcademyJourneyRefs } from "@/animation/academyJourney";

function elementFromRef(
  ref: RefObject<HTMLElement | null> | undefined,
): HTMLElement | null {
  if (!ref) return null;
  return ref.current;
}

export function useAcademyJourney(
  rootRef: RefObject<HTMLElement | null>,
  astronautRef?: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    const root = elementFromRef(rootRef);
    if (!root) return;
    const astronaut = elementFromRef(astronautRef);

    let cancelled = false;
    let revert: (() => void) | undefined;

    void import("@/animation/academyJourney").then(({ initAcademyJourney }) => {
      const refs: AcademyJourneyRefs = {
        root,
        astronaut,
      };
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
