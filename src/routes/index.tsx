import { createFileRoute } from "@tanstack/react-router";
import { AcademyEntrance } from "@/components/cinematic/AcademyEntrance";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "AcadeMY Senior" },
      {
        name: "description",
        content:
          "AcadeMY Senior — the next chapter of learning, leadership, and community for Form 4 and Form 5.",
      },
    ],
    links: [
      { rel: "preload", href: "/images/senior-lobby.png", as: "image" },
    ],
  }),
});

function HomePage() {
  return <AcademyEntrance />;
}
