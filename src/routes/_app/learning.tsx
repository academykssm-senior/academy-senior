import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/learning")({
  beforeLoad: ({ context }) => {
    throw redirect({
      to: "/f4/$lang",
      params: { lang: context.student.languagePreference },
    });
  },
  component: function LearningRedirect() {
    return null;
  },
});
