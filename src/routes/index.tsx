import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: FoundationScreen,
});

function FoundationScreen() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6">
      {/* Temporary foundation screen — not the final dashboard */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div
          className="mb-2 flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ background: "var(--nova-purple)" }}
          aria-hidden="true"
        >
          <span className="text-3xl font-bold text-white">A</span>
        </div>

        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-display)", color: "var(--nova-purple)" }}
        >
          AcadeMY Senior
        </h1>

        <p className="text-lg" style={{ color: "var(--foreground-muted)" }}>
          Forms 4–5
        </p>

        <p
          className="mt-4 rounded-full px-4 py-1.5 text-sm font-medium"
          style={{
            background: "var(--surface-raised)",
            color: "var(--foreground-muted)",
          }}
        >
          Foundation ready
        </p>
      </div>
    </main>
  );
}
