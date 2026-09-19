import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { resolveSubjectContext } from "@/features/curriculum";
import { isLanguageStream } from "@/types/curriculum";

export const Route = createFileRoute("/_app/f4/$lang/$subject")({
  beforeLoad: ({ params }) => {
    if (!isLanguageStream(params.lang)) {
      throw notFound();
    }
    const resolved = resolveSubjectContext(4, params.lang, params.subject);
    if (!resolved.ok) {
      throw notFound();
    }
  },
  component: Outlet,
});
