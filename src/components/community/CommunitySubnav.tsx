import { Link } from "@tanstack/react-router";

const LINKS = [
  { to: "/community" as const, label: "Overview" },
  { to: "/community/activities" as const, label: "Activities" },
  { to: "/community/events" as const, label: "Events" },
  { to: "/community/committee" as const, label: "Committee" },
  { to: "/community/student-council" as const, label: "Student Council" },
];

const chipClass =
  "rounded-full border border-white/8 bg-white/[0.04] px-4 py-2 text-sm text-on-surface-variant transition hover:border-white/14 hover:text-white";

export function CommunitySubnav() {
  return (
    <nav aria-label="Community" className="mb-6 flex flex-wrap gap-2">
      {LINKS.map((link) =>
        link.to === "/community" ? (
          <Link
            key={link.to}
            activeOptions={{ exact: true }}
            activeProps={{ className: "border-cta-gold/30 bg-cta-gold/12 font-semibold text-cta-gold" }}
            className={chipClass}
            to={link.to}
          >
            {link.label}
          </Link>
        ) : (
          <Link
            key={link.to}
            activeProps={{ className: "border-cta-gold/30 bg-cta-gold/12 font-semibold text-cta-gold" }}
            className={chipClass}
            to={link.to}
          >
            {link.label}
          </Link>
        ),
      )}
    </nav>
  );
}
