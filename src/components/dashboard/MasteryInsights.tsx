import { Icon } from "@/components/ui/Icon";
import { reviewTopics, strongTopics } from "@/content/mock/dashboard";

export function MasteryInsights() {
  return (
    <section>
      <div className="mb-2 flex items-end justify-between gap-3">
        <h2 className="text-lg font-semibold">Your Mastery Insights</h2>
        <span className="text-[10px] text-on-surface-variant">Real-time diagnostic</span>
      </div>

      <div className="space-y-4 rounded-3xl border border-border-subtle bg-surface-card p-4 shadow-card">
        <div>
          <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
            <span className="text-status-mastered">● Strong Mastery</span>
            <span className="text-on-surface-variant">Exam ready</span>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {strongTopics.map((topic) => (
              <div className="flex items-center justify-between rounded-xl bg-surface-container p-2.5" key={topic.name}>
                <span className="flex min-w-0 items-center gap-2 text-xs">
                  <Icon filled name="check_circle" className="text-base text-status-mastered" />
                  <span className="truncate">{topic.name}</span>
                </span>
                <strong className="text-xs text-status-mastered">{topic.mastery}%</strong>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
            <span className="text-status-review">● Needs Review</span>
            <span className="text-status-review">High SPM weightage</span>
          </div>
          <div className="space-y-2">
            {reviewTopics.map((topic) => (
              <div className="flex items-center justify-between gap-3 rounded-2xl bg-surface-container p-3" key={topic.name}>
                <div className="min-w-0">
                  <strong className="flex items-center gap-2 text-sm">
                    <Icon name="warning" className="text-lg text-status-review" />
                    {topic.name}
                  </strong>
                  <p className="mt-0.5 truncate text-[10px] text-on-surface-variant">{topic.detail}</p>
                </div>
                <span className="rounded-full bg-status-review/15 px-2.5 py-1 text-xs font-bold text-status-review">
                  {topic.mastery}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <button className="min-h-11 w-full rounded-2xl bg-surface-container-high px-4 text-sm font-semibold text-primary transition hover:bg-surface-bright" type="button">
          Start 10-Minute Targeted Revision
        </button>
      </div>
    </section>
  );
}
