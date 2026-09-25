import { Link } from "@tanstack/react-router";
import { useCallback, useLayoutEffect, useState } from "react";
import { LandingExploreOverlay } from "@/components/cinematic/LandingExploreOverlay";
import type { ExplorePanel } from "@/components/cinematic/landingExplore";
import { cn } from "@/lib/utils";

const LANDING_HERO = "/images/senior-lobby.png";

export function AcademyEntrance() {
  const [exploreOpen, setExploreOpen] = useState(false);
  const [explorePanel, setExplorePanel] = useState<ExplorePanel>("menu");
  const chromeOpen = !exploreOpen;

  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    html.classList.add("academy-entrance-lock");
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.classList.remove("academy-entrance-lock");
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, []);

  const openExplore = useCallback(() => {
    setExplorePanel("menu");
    setExploreOpen(true);
  }, []);

  const closeExplore = useCallback(() => {
    setExploreOpen(false);
    setExplorePanel("menu");
  }, []);

  return (
    <section
      aria-label="AcadeMY Senior entrance"
      className="fixed inset-0 z-0 h-[100svh] min-h-[100svh] w-full overflow-hidden bg-[#070b14]"
    >
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <img
          alt=""
          className="academy-hero-image"
          decoding="async"
          fetchPriority="high"
          height={941}
          src={LANDING_HERO}
          width={1672}
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#070b14]/55 to-transparent"
      />

      <div
        inert={!chromeOpen}
        className={cn(
          "absolute inset-0 z-10 transition-opacity duration-300 ease-out",
          chromeOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="academy-gateway-copy absolute inset-x-0 bottom-0 flex flex-col items-center px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-6 text-center sm:px-8">
          <p className="max-w-3xl text-[clamp(1.15rem,3.4vw,1.85rem)] font-semibold leading-tight tracking-tight text-[#f4f1ea]">
            Beyond Your Imagination
          </p>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f4f1ea]/70 sm:text-[11px]">
            Learn. Grow. Achieve.
          </p>
          <div className="mt-5 flex w-full max-w-md flex-col items-stretch gap-3 sm:mt-6 sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
            <button
              className="academy-hero-cta academy-hero-cta-primary inline-flex min-h-12 items-center justify-center rounded-full px-7 py-3 text-[12px] font-semibold tracking-[0.16em]"
              type="button"
              onClick={openExplore}
            >
              Explore Senior
            </button>
            <Link
              className="academy-hero-cta inline-flex min-h-12 items-center justify-center rounded-full px-7 py-3 text-[12px] font-semibold tracking-[0.16em]"
              search={{ next: "/home" }}
              to="/login"
            >
              Enter AcadeMY
            </Link>
          </div>
        </div>
      </div>

      <LandingExploreOverlay
        open={exploreOpen}
        panel={explorePanel}
        onBack={() => setExplorePanel("menu")}
        onClose={closeExplore}
        onOpenPanel={(next) => setExplorePanel(next)}
      />
    </section>
  );
}
