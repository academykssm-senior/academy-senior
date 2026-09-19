import { createFileRoute, notFound, Outlet, redirect } from "@tanstack/react-router";
import { rewritePathParam } from "@/content/catalogue";
import { isLanguageStream, toCanonicalRouteLanguage } from "@/types/curriculum";

export const Route = createFileRoute("/_app/f4/$lang")({
  beforeLoad: ({ params, location }) => {
    if (!isLanguageStream(params.lang)) {
      throw notFound();
    }

    const canonicalLang = toCanonicalRouteLanguage(params.lang);
    if (canonicalLang && canonicalLang !== params.lang) {
      throw redirect({
        href: rewritePathParam(location.pathname, params.lang, canonicalLang),
      });
    }
  },
  component: Outlet,
});
