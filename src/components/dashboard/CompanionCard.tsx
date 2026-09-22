/**
 * Isolated mock companion copy. Not wired to shared identity XP (Phase 2B).
 */
import { mockStudent } from "@/content/mock/student";

export function CompanionCard() {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#12182a] to-[#1a2236] p-5 shadow-card">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cta-gold/80">
        Your companion
      </p>
      <div className="mt-3 flex items-center gap-4">
        <div
          aria-hidden="true"
          className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-gradient-to-b from-amber-200 to-orange-400 text-4xl shadow-[0_0_24px_rgba(232,184,74,0.28)]"
        >
          🐣
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">{mockStudent.companion.name}</h2>
          <p className="mt-1 text-sm text-on-surface-variant">Keep learning! You&apos;re doing great.</p>
          <p className="mt-2 text-xs text-white/60">
            Earn lifetime XP to help {mockStudent.companion.name} grow.
          </p>
        </div>
      </div>
    </section>
  );
}
