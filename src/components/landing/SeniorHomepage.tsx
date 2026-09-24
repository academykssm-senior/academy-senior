import { Link } from "@tanstack/react-router";
import { useRef } from "react";
import { useAcademyJourney } from "@/animation/useAcademyJourney";
import { AcademyEntrance } from "@/components/cinematic/AcademyEntrance";
import { JourneyAstronaut } from "@/components/landing/JourneyAstronaut";
import {
  ACTIVITY_CARDS,
  ASSETS,
  CHAPTERS,
  COUNCIL_STATS,
  CREW,
  LEARNING_CARDS,
} from "@/components/landing/landingContent";
import { cn } from "@/lib/utils";
import type { ContentLanguage } from "@/types/curriculum";

export type SeniorHomepageVariant = "public" | "app";

export function SeniorHomepage({
  variant = "public",
  languagePreference = "bm",
}: {
  variant?: SeniorHomepageVariant;
  languagePreference?: ContentLanguage;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const astronautRef = useRef<HTMLDivElement>(null);
  const isPublic = variant === "public";
  useAcademyJourney(rootRef, isPublic ? undefined : astronautRef);

  return (
    <div ref={rootRef} className="relative overflow-x-clip bg-surface text-on-surface" data-journey-root="">
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-lg focus:bg-cta-gold focus:px-4 focus:py-2 focus:text-cta-gold-on"
        href="#home"
      >
        Skip to content
      </a>
      {isPublic ? null : <JourneyAstronaut astronautRef={astronautRef} />}
      {isPublic ? (
        <AcademyEntrance languagePreference={languagePreference} />
      ) : (
        <HeroSection languagePreference={languagePreference} variant={variant} />
      )}
      <LearningSection languagePreference={languagePreference} />
      <ActivitiesSection />
      <CommitteeSection />
      <CouncilSection />
      <FinaleSection languagePreference={languagePreference} variant={variant} />
      {variant === "public" ? <HomeFooter /> : null}
    </div>
  );
}

function HomeNav() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-surface/80 backdrop-blur-xl">
      <div className="pointer-events-auto mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 md:px-8">
        <Link className="flex shrink-0 items-center gap-2" to="/">
          <span className="text-sm font-bold tracking-tight text-on-surface">AcadeMY</span>
          <span className="rounded-full border border-cta-gold/25 bg-cta-gold/12 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-cta-gold">
            SENIOR
          </span>
        </Link>
        <nav
          aria-label="Homepage chapters"
          className="hidden items-center gap-6 lg:flex"
        >
          {CHAPTERS.map((chapter, index) => (
            <a
              key={chapter.id}
              className={cn(
                "chapter-link text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:text-on-surface",
                index === 0 && "is-active",
              )}
              data-chapter={chapter.id}
              href={`#${chapter.id}`}
            >
              {chapter.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            className="hidden rounded-full border border-white/15 px-4 py-2 text-label-md text-on-surface transition-colors hover:border-cta-gold/50 sm:inline-flex"
            search={{ next: "/home" }}
            to="/login"
          >
            Login
          </Link>
          <Link
            className="senior-cta inline-flex rounded-full px-4 py-2 text-label-md"
            search={{ next: "/home" }}
            to="/register"
          >
            Get Started
          </Link>
        </div>
      </div>
      <nav
        aria-label="Homepage chapters"
        className="pointer-events-auto flex gap-3 overflow-x-auto px-4 pb-2 lg:hidden"
      >
        {CHAPTERS.map((chapter) => (
          <a
            key={chapter.id}
            className="chapter-link shrink-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-on-surface-variant"
            data-chapter={chapter.id}
            href={`#${chapter.id}`}
          >
            {chapter.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function SceneImage({
  src,
  alt,
  eager,
  depth,
  hero,
  className,
}: {
  src: string;
  alt: string;
  eager?: boolean;
  depth: "bg" | "mid";
  hero?: boolean;
  className?: string;
}) {
  return (
    <img
      alt={alt}
      className={cn("absolute inset-0 h-full w-full object-cover", className)}
      data-depth={depth}
      data-journey-hero-img={hero ? "" : undefined}
      decoding={eager ? "sync" : "async"}
      fetchPriority={eager ? "high" : "low"}
      height={720}
      loading={eager ? "eager" : "lazy"}
      src={src}
      width={1280}
    />
  );
}

function HeroSection({
  variant,
  languagePreference,
}: {
  variant: SeniorHomepageVariant;
  languagePreference: ContentLanguage;
}) {
  return (
    <section
      className="relative min-h-dvh overflow-hidden scroll-mt-28"
      data-journey-section="home"
      id="home"
    >
      <SceneImage alt="" depth="bg" eager hero src={ASSETS.hero} />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-surface via-surface/70 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-surface to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute right-[18%] top-[28%] h-[42vw] max-h-[520px] w-[42vw] max-w-[520px] rounded-full bg-amber-200/25 blur-3xl"
        data-journey-portal-glow=""
      />
      <div
        aria-hidden="true"
        className="absolute -left-10 top-24 h-56 w-56 rounded-full bg-cta-gold/8 blur-3xl"
      />

      <div className="relative z-20 mx-auto flex min-h-dvh max-w-7xl flex-col justify-center px-4 pb-16 pt-28 md:px-8 md:pt-24">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className={variant === "public" ? "max-w-2xl lg:col-span-7" : "max-w-xl lg:col-span-6"}>
            <p className="text-label-md uppercase tracking-[0.28em] text-on-surface-variant">
              Welcome to
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-on-surface sm:text-5xl lg:text-6xl">
              AcadeMY <span className="text-cta-gold">SENIOR</span>
            </h1>
            <p className={variant === "public" ? "mt-5 max-w-xl text-body-lg text-on-surface-variant" : "mt-5 max-w-md text-body-lg text-on-surface-variant"}>
              Your journey begins at the classroom&apos;s edge, but it never stays there.
              AcadeMY Senior is the next chapter of learning, leadership, and community.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {variant === "public" ? (
                <>
                  <Link
                    className="senior-cta inline-flex rounded-full px-6 py-3 text-label-lg"
                    search={{ next: "/home" }}
                    to="/register"
                  >
                    Get Started
                  </Link>
                  <Link
                    className="inline-flex rounded-full border border-white/20 px-6 py-3 text-label-lg text-on-surface transition-colors hover:border-cta-gold/50"
                    search={{ next: "/home" }}
                    to="/login"
                  >
                    Login
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    className="senior-cta inline-flex rounded-full px-6 py-3 text-label-lg"
                    to="/dashboard"
                  >
                    Open Dashboard
                  </Link>
                  <Link
                    className="inline-flex rounded-full border border-white/20 px-6 py-3 text-label-lg text-on-surface transition-colors hover:border-cta-gold/50"
                    params={{ lang: languagePreference }}
                    to="/f4/$lang"
                  >
                    Continue Learning
                  </Link>
                  <Link
                    className="inline-flex rounded-full border border-white/20 px-6 py-3 text-label-lg text-on-surface transition-colors hover:border-cta-gold/50"
                    to="/community"
                  >
                    Explore Community
                  </Link>
                </>
              )}
            </div>
          </div>
          <div aria-hidden="true" className="hidden lg:col-span-5 lg:col-start-8 lg:block" />
        </div>
      </div>
    </section>
  );
}

function LearningSection({ languagePreference }: { languagePreference: ContentLanguage }) {
  return (
    <section
      className="relative min-h-dvh overflow-hidden scroll-mt-28"
      data-journey-section="learning"
      id="learning"
    >
      <SceneImage alt="" depth="bg" src={ASSETS.learning} />
      <div aria-hidden="true" className="absolute inset-0 bg-surface/55" />
      <div className="relative z-20 mx-auto grid min-h-dvh max-w-7xl items-center gap-10 px-4 py-24 md:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="text-3xl font-bold tracking-tight text-on-surface sm:text-4xl lg:text-5xl">
            Built for your{" "}
            <span className="text-cta-gold">next chapter.</span>
          </h2>
          <p className="mt-5 max-w-md text-body-lg text-on-surface-variant">
            Premium tools for Form 4 and Form 5 — notes, flashcards, quizzes and
            mind maps — so every chapter becomes mastery, not memorisation.
          </p>
          <Link
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold tracking-wide text-cta-gold transition-colors hover:text-primary-fixed"
            to="/f4/$lang"
            params={{ lang: languagePreference }}
          >
            Open Learning
            <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div
          className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:col-span-7 lg:origin-left lg:scale-[1.06]"
          data-learning-grid=""
        >
          {LEARNING_CARDS.map((card) => (
            <article
              key={card.title}
              className="learning-tile relative aspect-[3/2]"
              data-reveal="learning"
            >
              <div aria-hidden="true" className="learning-tile-glow" />
              <div className="learning-tile-art">
                <div className="learning-tile-parallax" data-depth="learning">
                  <img
                    alt=""
                    decoding="async"
                    height={720}
                    loading="lazy"
                    src={card.image}
                    width={1080}
                  />
                </div>
              </div>
              <h3 className="sr-only">{card.title}</h3>
              <p className="sr-only">{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ActivitiesSection() {
  return (
    <section
      className="relative min-h-dvh overflow-hidden scroll-mt-28"
      data-journey-section="activities"
      id="activities"
    >
      <SceneImage alt="" depth="bg" src={ASSETS.activities} />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-surface via-surface/75 to-surface/30"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent"
      />
      <div className="relative z-20 mx-auto flex min-h-dvh max-w-7xl flex-col justify-center px-4 py-24 md:px-8">
        <h2 className="max-w-xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Beyond the <span className="text-status-review">classroom.</span>
        </h2>
        <p className="mt-4 max-w-lg text-body-lg text-on-surface-variant">
          Learning continues in the field — camps, challenges, workshops, and
          gatherings that turn a cohort into a crew.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {ACTIVITY_CARDS.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-white/10 bg-surface-card/75 p-4 backdrop-blur-md"
              data-depth="card"
              data-reveal=""
            >
              <span aria-hidden="true" className="material-symbols-outlined text-secondary">
                {card.icon}
              </span>
              <h3 className="mt-3 text-headline-sm text-on-surface">{card.title}</h3>
              <p className="mt-2 text-body-md text-on-surface-variant">{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CommitteeSection() {
  return (
    <section
      className="relative min-h-dvh overflow-hidden scroll-mt-28"
      data-journey-section="committee"
      id="committee"
    >
      <div className="absolute inset-0" data-committee-scene="">
        <SceneImage alt="" depth="bg" src={ASSETS.committee} />
      </div>
      <div className="absolute inset-0 bg-surface/50" />
      <div className="relative z-20 mx-auto flex min-h-dvh max-w-7xl flex-col justify-center px-4 py-24 md:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Meet the Crew.
          </h2>
          <p className="text-label-md uppercase tracking-[0.22em] text-on-surface-variant">
            Discover the 5 worlds.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CREW.map((member) => (
            <article
              key={member.title}
              className="crew-card rounded-2xl border border-border-subtle bg-surface-card/70 p-5 backdrop-blur-md"
              data-idle="holo"
              data-reveal=""
              tabIndex={0}
            >
              <div
                aria-hidden="true"
                className="grid h-14 w-14 place-items-center rounded-full border border-cta-gold/35 bg-cta-gold/10 text-sm font-bold text-cta-gold"
              >
                {member.initials}
              </div>
              <h3 className="mt-4 text-headline-sm text-on-surface">{member.title}</h3>
              <p className="text-label-sm text-cta-gold">{member.role}</p>
              <p className="crew-bio mt-3 text-body-md text-on-surface-variant">
                {member.bio}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CouncilSection() {
  return (
    <section
      className="relative min-h-dvh overflow-hidden scroll-mt-28"
      data-journey-section="council"
      id="council"
    >
      <SceneImage alt="" depth="bg" src={ASSETS.council} />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-surface via-surface/80 to-surface/45"
      />
      <div
        aria-hidden="true"
        className="absolute right-0 top-10 h-64 w-64 rounded-full bg-cta-gold/10 blur-3xl"
        data-idle="planet"
        data-depth="bg"
      />
      <div className="relative z-20 mx-auto grid min-h-dvh max-w-7xl items-center gap-12 px-4 py-24 md:px-8 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Students Who{" "}
            <span className="text-cta-gold">Lead</span>
          </h2>
          <blockquote className="mt-6 max-w-lg border-l-2 border-cta-gold/50 pl-4 text-body-lg text-on-surface-variant">
            We don&apos;t wait for permission to lead. We build the worlds our
            peers study in — with discipline, hospitality, and nerve.
          </blockquote>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 lg:col-span-6">
          {COUNCIL_STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-surface-card/70 px-4 py-6 text-center backdrop-blur-md"
              data-reveal=""
            >
              <p className="text-3xl font-bold text-on-surface">{stat.value}</p>
              <p className="mt-1 text-label-sm uppercase tracking-[0.16em] text-on-surface-variant">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinaleSection({
  variant,
  languagePreference,
}: {
  variant: SeniorHomepageVariant;
  languagePreference: ContentLanguage;
}) {
  return (
    <section
      className="relative min-h-dvh overflow-hidden scroll-mt-28"
      data-journey-section="finale"
      id="finale"
    >
      <SceneImage alt="" depth="bg" src={ASSETS.finale} />
      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/70 to-surface/20" />
      <div className="relative z-20 mx-auto flex min-h-dvh max-w-4xl flex-col items-center justify-end px-4 pb-24 pt-28 text-center md:px-8">
        <h2
          className="text-3xl font-bold tracking-tight text-on-surface sm:text-5xl lg:text-6xl [text-shadow:0_8px_32px_rgb(0_0_0_/_55%)]"
          data-finale-headline=""
        >
          Your Journey Is Just Beginning.
        </h2>
        <p className="mt-5 max-w-xl text-body-lg text-on-surface-variant">
          Join thousands of Malaysian Form 4 and Form 5 students mastering every
          chapter — then leading the ones that follow.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            className="senior-cta inline-flex rounded-full px-6 py-3 text-label-lg"
            params={{ lang: languagePreference }}
            to="/f4/$lang"
          >
            Continue to F4
          </Link>
          <Link
            className="inline-flex rounded-full border border-white/20 px-6 py-3 text-label-lg text-on-surface transition-colors hover:border-cta-gold/50"
            to={variant === "public" ? "/home" : "/community"}
          >
            {variant === "public" ? "Enter AcadeMY" : "Explore Community"}
          </Link>
        </div>
      </div>
    </section>
  );
}

function HomeFooter() {
  return (
    <footer className="border-t border-white/8 bg-surface px-4 py-6 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 text-label-sm text-on-surface-variant sm:flex-row sm:items-center">
        <p>AcadeMY Senior</p>
        <p>Remember. Master. Achieve.</p>
      </div>
    </footer>
  );
}
