import { createFileRoute } from "@tanstack/react-router";
import { CompanionCard } from "@/components/dashboard/CompanionCard";
import { CosmicJourney } from "@/components/dashboard/CosmicJourney";
import { DashboardHero } from "@/components/dashboard/DashboardHero";
import { NextGoalCard } from "@/components/dashboard/NextGoalCard";
import { RankCard } from "@/components/dashboard/RankCard";
import { SubjectWorlds } from "@/components/dashboard/SubjectWorlds";
import { TodayProgress } from "@/components/dashboard/TodayProgress";
import { listSubjects } from "@/content/catalogue";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { student } = Route.useRouteContext();
  const lang = student.languagePreference;
  const subjects = listSubjects(4, lang);

  return (
    <div className="relative pb-4">
      <DashboardHero displayName={student.displayName} lang={lang} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <RankCard />
        </div>
        <div className="lg:col-span-4">
          <CompanionCard />
        </div>
        <div className="lg:col-span-3">
          <NextGoalCard lang={lang} />
        </div>
        <div className="lg:col-span-8">
          <CosmicJourney />
        </div>
        <div className="lg:col-span-4">
          <TodayProgress />
        </div>
        <div className="lg:col-span-12">
          <SubjectWorlds lang={lang} subjects={subjects} />
        </div>
      </div>
    </div>
  );
}
