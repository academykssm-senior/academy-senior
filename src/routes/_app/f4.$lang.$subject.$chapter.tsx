import { createFileRoute, notFound, Outlet, redirect } from "@tanstack/react-router";
import { getChapterManifest, rewritePathParam } from "@/content/catalogue";
import { isLanguageStream } from "@/types/curriculum";

export const Route = createFileRoute("/_app/f4/$lang/$subject/$chapter")({
  beforeLoad: ({ params, location }) => {
    if (!isLanguageStream(params.lang)) {
      throw notFound();
    }

    const chapter = getChapterManifest(4, params.subject, params.chapter);
    if (!chapter) {
      throw notFound();
    }

    if (params.chapter !== chapter.id) {
      throw redirect({
        href: rewritePathParam(location.pathname, params.chapter, chapter.id),
      });
    }
  },
  component: Outlet,
});
