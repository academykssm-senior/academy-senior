import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Icon } from "@/components/ui/Icon";
import { mockStudent } from "@/content/mock/student";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const lang = mockStudent.languagePreference;

  return (
    <div className="cosmic-shell min-h-dvh text-on-surface">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-[#0b1024] px-4 py-6 lg:flex">
        <Brand />
        <nav aria-label="Desktop primary" className="mt-8 space-y-1">
          <DesktopLink icon="home" label="Home" to="/dashboard" />
          <DesktopLink icon="dashboard" label="Dashboard" to="/dashboard" />
          <DesktopLink
            icon="hub"
            label="Mind Maps"
            params={{ lang, subject: "chemistry", chapter: "atomic-structure" }}
            to="/f4/$lang/$subject/$chapter/mind-map"
          />
          <DesktopLink
            icon="quiz"
            label="Quizzes"
            params={{ lang, subject: "chemistry", chapter: "atomic-structure" }}
            to="/f4/$lang/$subject/$chapter/quiz"
          />
          <DesktopLink
            icon="style"
            label="Flashcards"
            params={{ lang, subject: "chemistry", chapter: "atomic-structure" }}
            to="/f4/$lang/$subject/$chapter/flashcards"
          />
          <DesktopItem icon="smart_toy" label="Ace" />
          <DesktopItem icon="pets" label="Companion" />
        </nav>
        <div className="mt-auto space-y-3">
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary-container to-secondary-container text-sm font-bold text-white">
              {mockStudent.displayName.slice(0, 1)}
            </div>
            <div>
              <p className="text-sm font-semibold">{mockStudent.displayName}</p>
              <p className="text-[11px] text-on-surface-variant">Form {mockStudent.formLevel} · Senior</p>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-r from-orange-500/20 to-amber-400/10 p-3">
            <p className="flex items-center gap-2 text-sm font-bold text-status-review">
              <Icon name="local_fire_department" className="text-lg" />
              {mockStudent.streakDays} Day Streak
            </p>
            <p className="mt-1 text-xs text-on-surface-variant">Keep going!</p>
          </div>
          <Link
            className="flex min-h-11 items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500 text-sm font-bold text-white shadow-primary"
            params={{ lang }}
            to="/f4/$lang"
          >
            Start Studying
          </Link>
        </div>
      </aside>

      <header className="fixed inset-x-0 top-0 z-30 bg-[#070b1c]/90 backdrop-blur-xl lg:left-64">
        <div className="flex h-16 items-center justify-between gap-3 px-4 lg:px-8">
          <div className="lg:hidden"><Brand /></div>
          <label className="relative hidden max-w-xl flex-1 lg:block">
            <span className="sr-only">Search</span>
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-outline" name="search" />
            <input
              className="w-full rounded-full border-0 bg-white/8 py-2.5 pl-10 pr-16 text-sm text-on-surface outline-none placeholder:text-outline focus:ring-1 focus:ring-primary"
              placeholder="Search quizzes, flashcards, or topics..."
              type="search"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-on-surface-variant">
              Ctrl K
            </span>
          </label>
          <div className="flex items-center gap-2">
            <Metric compactLabel={`${mockStudent.streakDays}`} icon="local_fire_department" label={`${mockStudent.streakDays} Day Streak`} tone="review" />
            <Metric compactLabel={`${mockStudent.totalXp.toLocaleString()} XP`} icon="bolt" label={`${mockStudent.totalXp.toLocaleString()} XP`} tone="primary" />
            <button aria-label="Notifications" className="grid h-11 w-11 place-items-center rounded-full bg-white/5 text-on-surface-variant" type="button">
              <Icon name="notifications" className="text-xl" />
            </button>
            <div className="hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 px-3 py-2 text-[10px] font-bold leading-tight text-white lg:block">
              Learn
              <br />
              Explore
            </div>
          </div>
        </div>
      </header>

      <main className="min-h-dvh px-4 pb-24 pt-20 sm:px-6 lg:ml-64 lg:px-8 lg:pb-10 lg:pt-24">
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>

      <nav aria-label="Mobile primary" className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0b1024] pb-[env(safe-area-inset-bottom)] lg:hidden">
        <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-1">
          <MobileLink icon="home" label="Home" />
          <MobileLink icon="menu_book" label="Subjects" />
          <MobileItem icon="hub" label="Mastery" />
          <MobileItem icon="auto_awesome" label="Ace" raised />
          <MobileItem icon="person" label="Profile" />
        </div>
      </nav>
    </div>
  );
}

function Brand() {
  return (
    <Link className="flex items-center gap-1.5 whitespace-nowrap" to="/dashboard">
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-bold text-white">
        A
      </span>
      <span className="text-base font-bold tracking-tight sm:text-lg">AcadeMY</span>
      <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-primary">
        Senior
      </span>
    </Link>
  );
}

function Metric({
  compactLabel,
  icon,
  label,
  tone,
}: {
  compactLabel: string;
  icon: string;
  label: string;
  tone: "review" | "primary";
}) {
  return (
    <span className={`flex items-center gap-1 rounded-full bg-white/5 px-2 py-1.5 text-[10px] font-semibold ${tone === "review" ? "text-status-review" : "text-primary"}`}>
      <Icon name={icon} className="text-sm" />
      <span className="sm:hidden">{compactLabel}</span>
      <span className="hidden sm:inline">{label}</span>
    </span>
  );
}

function DesktopLink({
  icon,
  label,
  to,
  params,
}: {
  icon: string;
  label: string;
  to: "/dashboard" | "/f4/$lang/$subject/$chapter/mind-map" | "/f4/$lang/$subject/$chapter/quiz" | "/f4/$lang/$subject/$chapter/flashcards";
  params?: { lang: typeof mockStudent.languagePreference; subject: string; chapter: string };
}) {
  const className =
    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-on-surface-variant transition hover:bg-white/5 hover:text-white [&.active]:bg-violet-500/20 [&.active]:font-semibold [&.active]:text-white";

  if (to === "/dashboard") {
    return (
      <Link className={className} to="/dashboard">
        <Icon name={icon} className="text-xl" /> {label}
      </Link>
    );
  }

  const activityParams = params ?? {
    lang: mockStudent.languagePreference,
    subject: "chemistry",
    chapter: "atomic-structure",
  };

  return (
    <Link className={className} params={activityParams} to={to}>
      <Icon name={icon} className="text-xl" /> {label}
    </Link>
  );
}

function DesktopItem({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-on-surface-variant">
      <Icon name={icon} className="text-xl" /> {label}
    </span>
  );
}

function MobileLink({ icon, label }: { icon: string; label: string }) {
  if (label === "Home") {
    return (
      <Link className="flex min-h-11 min-w-14 flex-col items-center justify-center gap-0.5 text-[10px] text-primary" to="/dashboard">
        <Icon name={icon} className="text-xl" /> {label}
      </Link>
    );
  }

  return (
    <Link className="flex min-h-11 min-w-14 flex-col items-center justify-center gap-0.5 text-[10px] text-on-surface-variant" params={{ lang: mockStudent.languagePreference }} to="/f4/$lang">
      <Icon name={icon} className="text-xl" /> {label}
    </Link>
  );
}

function MobileItem({ icon, label, raised = false }: { icon: string; label: string; raised?: boolean }) {
  return (
    <span className="flex min-h-11 min-w-14 flex-col items-center justify-center gap-0.5 text-[10px] text-on-surface-variant">
      <span className={raised ? "-mt-3 grid h-9 w-9 place-items-center rounded-full bg-surface-card text-primary shadow-primary" : ""}>
        <Icon name={icon} className="text-xl" />
      </span>
      {label}
    </span>
  );
}
