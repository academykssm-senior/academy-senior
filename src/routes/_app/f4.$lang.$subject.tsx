import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { isLanguageStream } from "@/types/curriculum";

export const Route = createFileRoute("/_app/f4/$lang/$subject")({
  beforeLoad: ({ params }) => {
    if (!isLanguageStream(params.lang)) {
      throw notFound();
    }
  },
  component: Outlet,
});
