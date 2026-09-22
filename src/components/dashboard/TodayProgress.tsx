/**
 * Isolated mock lifetime XP tile. Not Junior user_progress.xp (Phase 2B).
 */
import { Icon } from "@/components/ui/Icon";
import { mockStudent } from "@/content/mock/student";

const stats = [
  { icon: "hub", label: "Mind maps studied", value: 0, tone: "bg-sky-500/20 text-sky-200" },
  { icon: "quiz", label: "Quizzes completed", value: 0, tone: "bg-emerald-500/20 text-emerald-200" },
  { icon: "style", label: "Flashcards mastered", value: 0, tone: "bg-orange-500/20 text-orange-200" },
] as const;

export function TodayProgress() {
  return (
    <section className="rounded-[28px] border border-white/10 bg-[#12182a]/90 p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Today&apos;s Progress</h2>
        <span className="text-xs text-on-surface-variant">View reports</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div className="rounded-2xl bg-white/5 p-3" key={stat.label}>
            <span className={`grid h-9 w-9 place-items-center rounded-xl ${stat.tone}`}>
              <Icon name={stat.icon} className="text-xl" />
            </span>
            <p className="mt-3 text-2xl font-bold">{stat.value}</p>
            <p className="text-[11px] text-on-surface-variant">{stat.label}</p>
          </div>
        ))}
        <div className="rounded-2xl bg-gradient-to-br from-amber-400/20 to-yellow-300/10 p-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-300/20 text-amber-200">
            <Icon filled name="star" className="text-xl" />
          </span>
          <p className="mt-3 text-2xl font-bold">{mockStudent.totalXp.toLocaleString()}</p>
          <p className="text-[11px] text-on-surface-variant">Lifetime XP</p>
        </div>
      </div>
    </section>
  );
}
