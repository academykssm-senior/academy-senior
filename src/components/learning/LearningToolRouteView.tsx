import { notFound } from "@tanstack/react-router";
import { LearningToolShell } from "@/components/learning/LearningToolShell";
import { getFormManifest, pickLocalized, resolveToolContext } from "@/features/curriculum";
import { isLanguageStream, toContentLanguage } from "@/types/curriculum";
import type { VisibleLearningToolId } from "@/types/learning";

type LearningToolRouteViewProps = {
  toolId: VisibleLearningToolId;
  lang: string;
  subjectId: string;
  chapterId: string;
};

export function LearningToolRouteView({
  toolId,
  lang,
  subjectId,
  chapterId,
}: LearningToolRouteViewProps) {
  if (!isLanguageStream(lang)) throw notFound();

  const resolved = resolveToolContext(4, lang, subjectId, chapterId, toolId);
  if (!resolved.ok) throw notFound();

  const contentLang = toContentLanguage(lang) ?? "en";
  const form = getFormManifest(4);
  const formLabel = pickLocalized(lang, form?.nameBm ?? "Tingkatan 4", form?.nameEn ?? "Form 4");

  return (
    <LearningToolShell
      available={resolved.available}
      chapter={resolved.chapter}
      contentLang={contentLang}
      formLabel={formLabel}
      lang={lang}
      subject={resolved.subject}
      toolId={toolId}
    />
  );
}
