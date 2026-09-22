import { Link } from "@tanstack/react-router";
import { Icon } from "@/components/ui/Icon";
import type { LanguageStream } from "@/types/curriculum";

export function DashboardHero({ displayName, lang }: { displayName: string; lang: LanguageStream }) {
  return (
    <section className="relative mb-6 overflow-hidden rounded-[28px] min-h-[220px] sm:min-h-[280px] lg:mb-8 lg:min-h-[340px]">
      <img
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[center_40%]"
        src="/backgrounds/dashboard-hero.jpg"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#070b1c]/80 via-[#070b1c]/35 to-transparent" />
      <div className="relative z-10 flex min-h-[220px] flex-col justify-end p-5 sm:min-h-[280px] sm:p-8 lg:min-h-[340px]">
        <p className="text-sm text-white/80">Good afternoon,</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white lg:text-5xl">
          {displayName} 👋
        </h1>
        <p className="mt-2 max-w-md text-sm text-white/80">
          Small steps today, big futures tomorrow.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            className="senior-cta inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-bold"
            params={{ lang, subject: "chemistry", chapter: "chapter-01" }}
            to="/f4/$lang/$subject/$chapter"
          >
            Continue Learning
            <Icon name="arrow_forward" className="text-lg" />
          </Link>
          <Link
            className="inline-flex min-h-11 items-center rounded-full border border-white/25 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur-md"
            params={{ lang }}
            to="/f4/$lang"
          >
            View My Progress
          </Link>
        </div>
      </div>
    </section>
  );
}
