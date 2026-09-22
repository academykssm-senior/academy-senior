import { SeniorHomepage } from "@/components/landing/SeniorHomepage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/home")({
  component: AppHomePage,
  head: () => ({
    meta: [{ title: "Home — AcadeMY Senior" }],
    links: [
      { rel: "preload", href: "/assets/senior/hero-portal.webp", as: "image" },
      { rel: "preload", href: "/assets/senior/astronaut.webp", as: "image" },
    ],
  }),
});

function AppHomePage() {
  const { student } = Route.useRouteContext();
  return (
    <SeniorHomepage languagePreference={student.languagePreference} variant="app" />
  );
}
