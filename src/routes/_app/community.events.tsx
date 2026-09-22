import { createFileRoute } from "@tanstack/react-router";
import { ACTIVITY_CARDS } from "@/components/landing/landingContent";

export const Route = createFileRoute("/_app/community/events")({
  component: CommunityEventsPage,
});

const EVENT_TITLES = new Set(["Meet & Greet", "Workshops", "AcadeMY Gatherings"]);

function CommunityEventsPage() {
  const events = ACTIVITY_CARDS.filter((card) => EVENT_TITLES.has(card.title));

  return (
    <section>
      <h1 className="font-display text-2xl font-bold tracking-tight">Events</h1>
      <p className="mt-2 max-w-xl text-sm text-on-surface-variant">
        Meet & greets, workshops, and gatherings — the calendar around the curriculum.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {events.map((card) => (
          <article
            key={card.title}
            className="rounded-2xl border border-white/8 bg-white/4 p-5"
          >
            <h2 className="text-lg font-semibold">{card.title}</h2>
            <p className="mt-2 text-sm text-on-surface-variant">{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
