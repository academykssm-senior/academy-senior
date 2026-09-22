import { createFileRoute } from "@tanstack/react-router";
import { SeniorHomepage } from "@/components/landing/SeniorHomepage";

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
      {
        rel: "preload",
        href: "/assets/senior/hero-portal.webp",
        as: "image",
      },
      {
        rel: "preload",
        href: "/assets/senior/astronaut.webp",
        as: "image",
      },
    ],
  }),
});

function HomePage() {
  return <SeniorHomepage variant="public" />;
}
