import { mockStudent } from "@/content/mock/student";

export function CompanionCard() {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#24183d] to-[#3b1d63] p-5 shadow-card">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-200/80">
        Your companion
      </p>
      <div className="mt-3 flex items-center gap-4">
        <div
          aria-hidden="true"
          className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-gradient-to-b from-amber-200 to-orange-400 text-4xl shadow-[0_0_24px_rgba(251,191,36,0.45)]"
        >
          🐣
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">{mockStudent.companion.name}</h2>
          <p className="mt-1 text-sm text-violet-100">Keep learning! You&apos;re doing great.</p>
          <p className="mt-2 text-xs text-white/60">
            Earn lifetime XP to help {mockStudent.companion.name} grow.
          </p>
        </div>
      </div>
    </section>
  );
}
