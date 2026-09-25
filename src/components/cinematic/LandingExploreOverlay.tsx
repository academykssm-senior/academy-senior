import { useEffect, useId, useRef } from "react";
import {
  EXPLORE_MENU,
  EXPLORE_TOOLS,
  WHY_SENIOR,
  type ExplorePanel,
} from "@/components/cinematic/landingExplore";
import { FORM_4_SUBJECTS } from "@/curriculum/form-4";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

type LandingExploreOverlayProps = {
  open: boolean;
  panel: ExplorePanel;
  onClose: () => void;
  onBack: () => void;
  onOpenPanel: (panel: Exclude<ExplorePanel, "menu">) => void;
};

const PANEL_TITLE: Record<ExplorePanel, string> = {
  menu: "Explore Senior",
  subjects: "Subjects",
  tools: "Learning Tools",
  why: "Why AcadeMY",
};

export function LandingExploreOverlay({
  open,
  panel,
  onClose,
  onBack,
  onOpenPanel,
}: LandingExploreOverlayProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    restoreFocus.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    return () => {
      restoreFocus.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const root = panelRef.current;
      if (!root) return;
      const focusable = Array.from(
        root.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((node) => !node.hasAttribute("inert") && node.tabIndex !== -1);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, open]);

  const showBack = panel !== "menu";

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "absolute inset-0 z-30 flex items-stretch justify-center p-3 sm:p-5 md:p-8",
        "transition-[opacity,transform] duration-300 ease-out",
        open ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      inert={!open}
    >
      <button
        aria-label="Close explore"
        className="absolute inset-0 bg-[#070b14]/80 backdrop-blur-md"
        tabIndex={-1}
        type="button"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        aria-labelledby={titleId}
        aria-modal="true"
        className={cn(
          "academy-explore-panel relative z-10 flex h-full w-full max-w-4xl flex-col overflow-hidden",
          "rounded-3xl border border-white/12 bg-[#0b1020]/95 shadow-[0_24px_80px_rgb(0_0_0/0.45)] backdrop-blur-xl",
          "transition-transform duration-300 ease-out",
          open ? "scale-100" : "scale-[0.98]",
        )}
        role="dialog"
      >
        <header className="flex shrink-0 items-center gap-2 border-b border-white/8 px-4 py-3 sm:px-6">
          {showBack ? (
            <button
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/15 text-[11px] font-semibold tracking-[0.16em] text-[#f4f1ea] hover:border-[#e8b84a]/50"
              type="button"
              onClick={onBack}
            >
              Back
            </button>
          ) : (
            <span className="min-w-11" />
          )}
          <h2
            className="flex-1 text-center text-[12px] font-semibold tracking-[0.28em] text-[#f4f1ea] sm:text-[13px]"
            id={titleId}
          >
            {PANEL_TITLE[panel]}
          </h2>
          <button
            ref={closeRef}
            aria-label="Close"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/15 text-[#f4f1ea] hover:border-[#e8b84a]/50"
            type="button"
            onClick={onClose}
          >
            <Icon className="text-xl" name="close" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-6">
          {panel === "menu" ? (
            <nav
              aria-label="Explore Senior"
              className="grid min-h-full content-center gap-3 sm:grid-cols-3"
            >
              {EXPLORE_MENU.map((item) => (
                <button
                  key={item.id}
                  className="rounded-2xl border border-white/12 bg-white/10 px-4 py-5 text-left transition-colors hover:border-[#e8b84a]/45 hover:bg-white/14"
                  type="button"
                  onClick={() => onOpenPanel(item.id)}
                >
                  <span className="block text-[13px] font-semibold tracking-[0.16em] text-[#e8b84a]">
                    {item.label}
                  </span>
                  <span className="mt-2 block text-sm text-[#f4f1ea]/70">{item.hint}</span>
                </button>
              ))}
            </nav>
          ) : null}

          {panel === "subjects" ? (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {FORM_4_SUBJECTS.map((subject) => (
                <li
                  key={subject.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020]/70"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      alt=""
                      className="h-full w-full object-cover"
                      decoding="async"
                      height={360}
                      src={subject.artwork}
                      width={480}
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-[#070b14]/20 to-transparent"
                    />
                  </div>
                  <p className="px-3 py-3 text-sm font-semibold tracking-wide text-[#f4f1ea]">
                    {subject.nameEn ?? subject.name}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}

          {panel === "tools" ? (
            <ul className="grid gap-3 sm:grid-cols-3">
              {EXPLORE_TOOLS.map((tool) => (
                <li
                  key={tool.id}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020]/70"
                >
                  <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[3/2]">
                    <img
                      alt=""
                      className="h-full w-full object-cover brightness-110 contrast-105"
                      decoding="async"
                      height={360}
                      src={tool.image}
                      width={540}
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-[#070b14]/55 to-[#070b14]/10"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 px-4 py-4">
                    <p className="flex items-center gap-2 text-sm font-semibold tracking-wide text-[#f4f1ea]">
                      <Icon className="text-lg text-[#e8b84a]" name={tool.icon} />
                      {tool.title}
                    </p>
                    <p className="mt-1 text-sm text-[#f4f1ea]/80">{tool.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}

          {panel === "why" ? (
            <ul className="mx-auto max-w-lg space-y-3">
              {WHY_SENIOR.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#f4f1ea]/85"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}
