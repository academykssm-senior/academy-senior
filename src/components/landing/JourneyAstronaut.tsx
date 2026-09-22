import type { RefObject } from "react";
import { ASSETS } from "@/components/landing/landingContent";

type JourneyAstronautProps = {
  astronautRef: RefObject<HTMLDivElement | null>;
};

export function JourneyAstronaut({ astronautRef }: JourneyAstronautProps) {
  return (
    <div
      ref={astronautRef}
      aria-hidden="true"
      className="journey-astronaut"
    >
      <span className="astronaut-ground-shadow" data-astronaut-shadow="" />
      <span className="astronaut-rim-glow" data-astronaut-glow="" />
      <img
        alt=""
        height={1152}
        src={ASSETS.astronaut}
        width={864}
        onError={(event) => {
          const image = event.currentTarget;
          if (image.src.includes("astronaut.png")) return;
          image.src = ASSETS.astronautFallback;
        }}
      />
    </div>
  );
}
