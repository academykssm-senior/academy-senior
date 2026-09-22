import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/community/")({
  component: CommunityHubPage,
});

const HUB = [
  {
    to: "/community/activities" as const,
    title: "Activities",
    body: "Camps, challenges, workshops, and gatherings beyond the classroom.",
  },
  {
    to: "/community/events" as const,
    title: "Events",
    body: "Meet & greets, showcases, and AcadeMY gatherings on the calendar.",
  },
  {
    to: "/community/committee" as const,
    title: "Committee",
    body: "The crew that keeps curriculum, community, and operations in orbit.",
  },
  {
    to: "/community/student-council" as const,
    title: "Student Council",
    body: "Student-led leadership — 128 voices, one chamber.",
  },
];

function CommunityHubPage() {
  return (
    <section>
      <h1 className="font-display text-2xl font-bold tracking-tight">Community</h1>
      <p className="mt-2 max-w-xl text-sm text-on-surface-variant">
        Activities, events, committee, and student council — the worlds around the classroom.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {HUB.map((item) => (
          <Link
            key={item.to}
            className="rounded-2xl border border-white/8 bg-white/4 p-5 transition hover:border-cta-gold/35 hover:bg-white/6"
            to={item.to}
          >
            <h2 className="text-lg font-semibold text-on-surface">{item.title}</h2>
            <p className="mt-2 text-sm text-on-surface-variant">{item.body}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
