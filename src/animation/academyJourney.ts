import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  contentFrame,
  detectBreakpoint,
  getPose,
  JOURNEY_SCRUB,
  PARALLAX,
  posePixels,
  type JourneyBreakpoint,
  type PoseName,
} from "@/animation/journeyPaths";

export type AcademyJourneyRefs = {
  root: HTMLElement;
  astronaut: HTMLElement;
};

type MediaConditions = {
  isDesktop?: boolean;
  isTablet?: boolean;
  isMobile?: boolean;
  reduceMotion?: boolean;
};

function registerPlugins(): void {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

function qAll(root: HTMLElement, selector: string): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

function q(root: HTMLElement, selector: string): HTMLElement | null {
  return root.querySelector<HTMLElement>(selector);
}

function poseFor(root: HTMLElement, name: PoseName, breakpoint: JourneyBreakpoint) {
  return posePixels(getPose(breakpoint, name), contentFrame(root));
}

function poseVars(pose: ReturnType<typeof posePixels>) {
  return {
    x: pose.x,
    y: pose.y,
    scale: pose.scale,
    rotation: pose.rotate,
    opacity: pose.opacity,
  };
}

function setupNavClicks(root: HTMLElement): Array<() => void> {
  const cleanups: Array<() => void> = [];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  for (const link of qAll(root, "[data-chapter]")) {
    const onClick = (event: Event) => {
      const href = link.getAttribute("href");
      if (!href?.startsWith("#")) return;
      const target = root.querySelector<HTMLElement>(href);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    };
    link.addEventListener("click", onClick);
    cleanups.push(() => link.removeEventListener("click", onClick));
  }

  return cleanups;
}

function setupNavActive(root: HTMLElement): void {
  const links = qAll(root, "[data-chapter]");

  const setActive = (id: string) => {
    for (const link of links) {
      const active = link.dataset.chapter === id;
      link.classList.toggle("is-active", active);
      if (active) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    }
  };

  for (const section of qAll(root, "[data-journey-section]")) {
    const id = section.dataset.journeySection;
    if (!id || id === "finale") continue;
    ScrollTrigger.create({
      trigger: section,
      start: "top 40%",
      end: "bottom 40%",
      onEnter: () => setActive(id),
      onEnterBack: () => setActive(id),
    });
  }
}

function setupAstronautJourney(
  root: HTMLElement,
  astronaut: HTMLElement,
  breakpoint: JourneyBreakpoint,
): void {
  const hero = q(root, '[data-journey-section="home"]');
  if (!hero) return;

  const rest = poseFor(root, "heroRest", breakpoint);
  gsap.set(astronaut, {
    ...poseVars(rest),
    transformOrigin: "50% 82%",
  });
  astronaut.classList.add("is-armed");

  const lift = poseFor(root, "heroLift", breakpoint);
  const portal = poseFor(root, "heroPortal", breakpoint);
  const vanish = poseFor(root, "heroVanish", breakpoint);

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: JOURNEY_SCRUB,
      invalidateOnRefresh: true,
    },
  });

  tl.to(
    astronaut,
    {
      duration: 1,
      ease: "none",
      overwrite: false,
      motionPath: {
        path: [
          { x: rest.x, y: rest.y },
          { x: lift.x, y: lift.y },
          { x: portal.x, y: portal.y },
          { x: vanish.x, y: vanish.y },
        ],
        autoRotate: false,
        curviness: 1.05,
      },
    },
    0,
  );

  tl.to(
    astronaut,
    {
      duration: 1,
      ease: "none",
      overwrite: false,
      keyframes: [
        { scale: lift.scale, rotation: lift.rotate, opacity: lift.opacity, duration: 0.32, ease: "power1.out" },
        { scale: portal.scale, rotation: portal.rotate, opacity: portal.opacity, duration: 0.38, ease: "power1.inOut" },
        { scale: vanish.scale, rotation: vanish.rotate, opacity: 0, duration: 0.3, ease: "power2.in" },
      ],
    },
    0,
  );

  const shadow = q(astronaut, "[data-astronaut-shadow]");
  if (shadow) {
    tl.fromTo(
      shadow,
      { opacity: 0.7, scale: 1 },
      { opacity: 0, scale: 0.35, duration: 0.55, ease: "power1.in" },
      0,
    );
  }

  const rim = q(astronaut, "[data-astronaut-glow]");
  if (rim) {
    tl.fromTo(
      rim,
      { opacity: 0.18 },
      { opacity: 0.7, duration: 0.7, ease: "sine.in" },
      0,
    );
  }

  const glow = q(root, "[data-journey-portal-glow]");
  if (glow) {
    tl.fromTo(
      glow,
      { opacity: 0.22 },
      { opacity: 0.62, duration: 0.75, ease: "none" },
      0,
    );
  }
}

function setupParallax(root: HTMLElement, breakpoint: JourneyBreakpoint): void {
  const depth = PARALLAX[breakpoint];

  for (const layer of qAll(root, "[data-depth]")) {
    const kind = layer.dataset.depth;
    const amount =
      kind === "bg"
        ? depth.bg
        : kind === "mid"
          ? depth.mid
          : kind === "fg"
            ? depth.fg
            : kind === "learning"
              ? depth.learning
              : depth.card;
    const section = layer.closest<HTMLElement>("[data-journey-section]") ?? root;

    gsap.fromTo(
      layer,
      { yPercent: -amount * 0.2 },
      {
        yPercent: amount,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: JOURNEY_SCRUB,
        },
      },
    );
  }
}

function setupReveals(root: HTMLElement, breakpoint: JourneyBreakpoint): void {
  const distance = breakpoint === "mobile" ? 16 : breakpoint === "tablet" ? 24 : 32;

  qAll(root, "[data-reveal]").forEach((card, index) => {
    if (card.dataset.reveal === "learning") return;
    const idle = card.hasAttribute("data-idle");
    const recipe = index % 5;
    const from: gsap.TweenVars = idle
      ? recipe % 2 === 0
        ? { x: -distance, opacity: 0 }
        : { scale: 0.94, rotate: recipe === 1 ? 3 : -2.4, opacity: 0 }
      : recipe === 0
        ? { x: -distance, opacity: 0 }
        : recipe === 1
          ? { x: distance * 0.35, rotate: 3, opacity: 0 }
          : recipe === 2
            ? { scale: 0.94, opacity: 0 }
            : recipe === 3
              ? { x: distance, rotate: -2.5, opacity: 0 }
              : { scale: 1.05, opacity: 0 };

    gsap.fromTo(card, from, {
      x: 0,
      scale: 1,
      rotate: 0,
      opacity: 1,
      duration: breakpoint === "mobile" ? 0.5 : 0.85,
      ease: "power2.out",
      scrollTrigger: {
        trigger: card,
        start: "top 84%",
        toggleActions: "play none none reverse",
      },
    });
  });

  const headline = q(root, "[data-finale-headline]");
  if (headline) {
    gsap.fromTo(
      headline,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headline,
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      },
    );
  }

  setupLearningReveals(root, breakpoint);
}

function setupLearningReveals(root: HTMLElement, breakpoint: JourneyBreakpoint): void {
  const cards = qAll(root, "[data-reveal='learning']");
  const grid = q(root, "[data-learning-grid]");
  if (cards.length === 0 || !grid) return;
  const rise = breakpoint === "mobile" ? 20 : 24;

  gsap.fromTo(
    cards,
    { y: rise, scale: 0.97, opacity: 0 },
    {
      y: 0,
      scale: 1,
      opacity: 1,
      duration: breakpoint === "mobile" ? 0.55 : 0.7,
      ease: "power2.out",
      stagger: 0.08,
      scrollTrigger: {
        trigger: grid,
        start: "top 82%",
        toggleActions: "play none none reverse",
      },
    },
  );
}

function setupIdle(root: HTMLElement): void {
  qAll(root, "[data-idle='card']").forEach((card, index) => {
    gsap.to(card, {
      y: index % 2 === 0 ? 6 : -8,
      rotate: index % 2 === 0 ? 1.4 : -1.8,
      duration: 5.4 + index * 0.7,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      delay: index * 0.35,
    });
  });

  qAll(root, "[data-idle='holo']").forEach((card, index) => {
    gsap.to(card, {
      y: index % 2 === 0 ? 6 : -6,
      rotate: index % 2 === 0 ? 1 : -1,
      duration: 8.5 + index * 0.6,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      delay: index * 0.5,
    });
  });

  const planet = q(root, "[data-idle='planet']");
  if (planet) {
    gsap.to(planet, {
      xPercent: 3,
      duration: 28,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });
  }
}

function setupReducedMotion(root: HTMLElement, astronaut: HTMLElement): void {
  const start = poseFor(root, "heroRest", detectBreakpoint(window.innerWidth));
  gsap.set(astronaut, {
    ...poseVars(start),
    transformOrigin: "50% 82%",
  });

  qAll(root, "[data-reveal], [data-finale-headline]").forEach((el) => {
    gsap.set(el, { clearProps: "transform", opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 });
  });
}

function breakpointFromConditions(conditions: MediaConditions): JourneyBreakpoint {
  if (conditions.isDesktop) return "desktop";
  if (conditions.isTablet) return "tablet";
  return "mobile";
}

export function initAcademyJourney(refs: AcademyJourneyRefs): () => void {
  registerPlugins();
  const { root, astronaut } = refs;
  const navCleanups = setupNavClicks(root);

  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 1024px)",
        isTablet: "(min-width: 768px) and (max-width: 1023px)",
        isMobile: "(max-width: 767px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (media) => {
        const conditions = (media.conditions ?? {}) as MediaConditions;

        setupNavActive(root);

        if (conditions.reduceMotion) {
          setupReducedMotion(root, astronaut);
          return undefined;
        }

        const breakpoint = breakpointFromConditions(conditions);
        setupAstronautJourney(root, astronaut, breakpoint);
        setupParallax(root, breakpoint);
        setupReveals(root, breakpoint);
        setupIdle(root);
        return undefined;
      },
    );

    const images = Array.from(root.querySelectorAll<HTMLImageElement>("img"));
    let pending = images.filter((img) => !img.complete).length;
    const refreshOnce = () => {
      ScrollTrigger.refresh();
    };
    if (pending === 0) {
      requestAnimationFrame(refreshOnce);
    } else {
      const onDone = () => {
        pending -= 1;
        if (pending <= 0) refreshOnce();
      };
      for (const img of images) {
        if (img.complete) continue;
        img.addEventListener("load", onDone, { once: true });
        img.addEventListener("error", onDone, { once: true });
      }
    }

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 180);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, root);

  return () => {
    astronaut.classList.remove("is-armed");
    for (const cleanup of navCleanups) cleanup();
    ctx.revert();
  };
}
