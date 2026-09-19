import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { listChapters, listSubjectManifests } from "@/content/catalogue";
import { cn } from "@/lib/utils";
import type { LanguageStream, SubjectManifest, SubjectView } from "@/types/curriculum";

type SubjectWorldsProps = {
  lang: LanguageStream;
  subjects: readonly SubjectView[];
};

type SubjectCardStyle = CSSProperties & {
  "--subject-accent": string;
  "--subject-accent-rgb": string;
};

function hexToRgbChannels(hex: string): string {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);
  return `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`;
}

export function SubjectWorlds({ lang, subjects }: SubjectWorldsProps) {
  const manifests = listSubjectManifests(4);

  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">My Subjects</h2>
          <p className="mt-1 text-xs text-on-surface-variant">
            Continue where you left off.
          </p>
        </div>
        <Link
          className="shrink-0 text-xs font-medium text-white/45 transition-colors hover:text-white/80"
          params={{ lang }}
          to="/f4/$lang"
        >
          Browse curriculum →
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {manifests.map((manifest) => {
          const routedSubject = subjects.find((subject) => subject.slug === manifest.id);
          const chapters = routedSubject
            ? listChapters(4, routedSubject.slug, lang)
            : [];

          return (
            <SubjectWorldCard
              chaptersAvailable={chapters.length}
              key={manifest.id}
              lang={lang}
              routeSlug={chapters.length > 0 ? routedSubject?.slug : undefined}
              subject={manifest}
            />
          );
        })}
      </div>
    </section>
  );
}

type SubjectWorldCardProps = {
  subject: SubjectManifest;
  lang: LanguageStream;
  routeSlug?: string | undefined;
  chaptersAvailable: number;
};

function SubjectWorldCard({
  subject,
  lang,
  routeSlug,
  chaptersAvailable,
}: SubjectWorldCardProps) {
  const isAvailable = Boolean(routeSlug);
  const cardStyle: SubjectCardStyle = {
    "--subject-accent": subject.accent,
    "--subject-accent-rgb": hexToRgbChannels(subject.accent),
  };
  const cardClassName = cn(
    "subject-world-card flex h-full flex-col overflow-hidden text-white",
    isAvailable && "subject-world-card--active group",
  );
  const description = subject.descriptionEn ?? subject.descriptionBm ?? "";

  const body = (
    <>
      <div className="subject-world-stage relative aspect-video w-full shrink-0 overflow-hidden">
        <img
          alt=""
          className="subject-world-art absolute -top-1 left-0 h-[calc(100%+8px)] w-full object-cover"
          loading="lazy"
          src={subject.artwork}
          style={{ objectPosition: subject.artworkPosition ?? "center center" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[52%]"
          style={{
            background:
              "linear-gradient(180deg, rgba(17, 23, 42, 0) 0%, #11172a 100%)",
          }}
        />
      </div>

      <div
        className="relative flex flex-1 flex-col px-4 pb-4 pt-2"
        style={{
          background:
            "linear-gradient(180deg, rgba(var(--subject-accent-rgb), 0.10), rgba(17, 23, 42, 0) 55%)",
        }}
      >
        <h3 className="line-clamp-2 min-h-[2.75rem] text-[15px] font-bold leading-snug sm:text-base">
          {subject.name}
        </h3>
        <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-[11px] leading-relaxed text-white/55 sm:text-xs">
          {description}
        </p>

        <div className="mt-auto flex min-h-[1.25rem] items-center justify-between gap-2 pt-4">
          {isAvailable ? (
            <>
              <p className="truncate text-[11px] text-white/50">
                {chaptersAvailable}{" "}
                {chaptersAvailable === 1 ? "chapter" : "chapters"} available
              </p>
              <span className="shrink-0 text-xs font-semibold" style={{ color: subject.accent }}>
                Continue
                <span className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none">
                  →
                </span>
              </span>
            </>
          ) : (
            <p className="text-[11px] text-white/40">Coming soon</p>
          )}
        </div>
      </div>

      <span
        aria-hidden="true"
        className="mt-auto block h-0.5 w-full"
        style={{ background: subject.accent, opacity: 0.55 }}
      />
    </>
  );

  if (isAvailable && routeSlug) {
    return (
      <Link
        className={cardClassName}
        params={{ lang, subject: routeSlug }}
        style={cardStyle}
        to="/f4/$lang/$subject"
      >
        {body}
      </Link>
    );
  }

  return (
    <article className={cardClassName} style={cardStyle}>
      {body}
    </article>
  );
}
