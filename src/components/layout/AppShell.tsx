import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Icon } from "@/components/ui/Icon";
import { StudentAvatar } from "@/components/ui/StudentAvatar";
import { LogoutButton } from "@/features/auth/LogoutButton";
import type { AuthenticatedStudent } from "@/lib/studentIdentity";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: ReactNode;
  student: AuthenticatedStudent;
};

const navClass =
  "senior-nav-link flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-on-surface-variant transition hover:bg-white/[0.04] hover:text-white";

export function AppShell({ children, student }: AppShellProps) {
  const lang = student.languagePreference;
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const fullBleed = pathname === "/home";
  const formLine = student.formLabel ?? "Senior";

  return (
    <div className="cosmic-shell min-h-dvh text-on-surface">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/8 bg-[#070b14]/95 px-4 py-6 backdrop-blur-xl lg:flex">
        <Brand />
        <nav aria-label="Desktop primary" className="mt-8 space-y-1">
          <Link activeOptions={{ exact: true }} className={navClass} to="/home">
            <Icon className="text-xl" name="home" /> Home
          </Link>
          <Link activeOptions={{ exact: true }} className={navClass} to="/dashboard">
            <Icon className="text-xl" name="dashboard" /> Dashboard
          </Link>
          <Link className={navClass} params={{ lang }} to="/f4/$lang">
            <Icon className="text-xl" name="menu_book" /> Learning
          </Link>
          <Link className={navClass} to="/community">
            <Icon className="text-xl" name="groups" /> Community
          </Link>
          <Link className={navClass} to="/leaderboard">
            <Icon className="text-xl" name="leaderboard" /> Leaderboard
          </Link>
        </nav>
        <div className="mt-auto space-y-3">
          <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.035] p-3">
            <StudentAvatar name={student.displayName} size="md" src={student.avatarUrl} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{student.displayName}</p>
              <p className="truncate text-[11px] text-on-surface-variant">{formLine}</p>
              {student.schoolName ? (
                <p className="truncate text-[11px] text-on-surface-variant">{student.schoolName}</p>
              ) : null}
            </div>
          </div>
          <Link
            className="senior-cta flex min-h-11 items-center justify-center rounded-full text-sm font-bold"
            params={{ lang }}
            to="/f4/$lang"
          >
            Start Studying
          </Link>
          <LogoutButton />
        </div>
      </aside>

      <header className="fixed inset-x-0 top-0 z-30 border-b border-white/6 bg-[#070b14]/80 backdrop-blur-xl lg:left-64">
        <div className="flex h-16 items-center justify-between gap-3 px-4 lg:px-8">
          <div className="lg:hidden"><Brand /></div>
          <label className="relative hidden max-w-xl flex-1 lg:block">
            <span className="sr-only">Search</span>
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-outline" name="search" />
            <input
              className="w-full rounded-full border border-white/8 bg-white/[0.04] py-2.5 pl-10 pr-16 text-sm text-on-surface outline-none placeholder:text-outline focus:border-cta-gold/35 focus:ring-1 focus:ring-cta-gold/30"
              placeholder="Search quizzes, flashcards, or topics..."
              type="search"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-white/8 bg-white/5 px-1.5 py-0.5 text-[10px] text-on-surface-variant">
              Ctrl K
            </span>
          </label>
          <div className="flex items-center gap-2">
            <Link
              aria-label="Ace chat"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/8 bg-white/[0.04] text-on-surface-variant transition hover:border-cta-gold/30 hover:text-cta-gold [&.active]:border-cta-gold/40 [&.active]:text-cta-gold"
              to="/leaderboard"
            >
              <Icon className="text-xl" name="smart_toy" />
            </Link>
            <button aria-label="Notifications" className="grid h-11 w-11 place-items-center rounded-full border border-white/8 bg-white/[0.04] text-on-surface-variant transition hover:border-white/16 hover:text-white" type="button">
              <Icon name="notifications" className="text-xl" />
            </button>
            <StudentAvatar
              className="border border-white/10"
              name={student.displayName}
              size="md"
              src={student.avatarUrl}
            />
          </div>
        </div>
      </header>

      <main
        className={cn(
          "min-h-dvh lg:ml-64",
          fullBleed ? "pb-24 pt-16 lg:pb-0" : "px-4 pb-24 pt-20 sm:px-6 lg:px-8 lg:pb-10 lg:pt-24",
        )}
      >
        <div className={fullBleed ? "w-full" : "mx-auto w-full max-w-7xl"}>{children}</div>
      </main>

      <nav aria-label="Mobile primary" className="fixed inset-x-0 bottom-0 z-40 border-t border-white/8 bg-[#070b14]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-1">
          <MobileNavLink icon="home" lang={lang} label="Home" to="/home" />
          <MobileNavLink icon="dashboard" lang={lang} label="Dashboard" to="/dashboard" />
          <MobileNavLink icon="menu_book" lang={lang} label="Learning" to="/f4/$lang" />
          <MobileNavLink icon="groups" lang={lang} label="Community" to="/community" />
          <MobileNavLink icon="leaderboard" lang={lang} label="Board" to="/leaderboard" />
        </div>
      </nav>
    </div>
  );
}

function Brand() {
  return (
    <Link className="flex items-center gap-1.5 whitespace-nowrap" to="/home">
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-[#2a2418] to-cta-gold text-sm font-bold text-cta-gold-on">
        A
      </span>
      <span className="text-base font-bold tracking-tight sm:text-lg">AcadeMY</span>
      <span className="rounded-full border border-cta-gold/25 bg-cta-gold/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-cta-gold">
        Senior
      </span>
    </Link>
  );
}

function MobileNavLink({
  icon,
  label,
  lang,
  to,
}: {
  icon: string;
  label: string;
  lang: AuthenticatedStudent["languagePreference"];
  to: "/home" | "/dashboard" | "/f4/$lang" | "/community" | "/leaderboard";
}) {
  const className =
    "flex min-h-11 min-w-14 flex-col items-center justify-center gap-0.5 text-[10px] text-on-surface-variant [&.active]:text-cta-gold";

  if (to === "/f4/$lang") {
    return (
      <Link className={className} params={{ lang }} to={to}>
        <Icon className="text-xl" name={icon} /> {label}
      </Link>
    );
  }

  if (to === "/home" || to === "/dashboard") {
    return (
      <Link activeOptions={{ exact: true }} className={className} to={to}>
        <Icon className="text-xl" name={icon} /> {label}
      </Link>
    );
  }

  return (
    <Link className={className} to={to}>
      <Icon className="text-xl" name={icon} /> {label}
    </Link>
  );
}
