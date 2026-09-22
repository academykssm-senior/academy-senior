import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  back: ReactNode;
};

export function PageHeader({ title, back }: PageHeaderProps) {
  return (
    <header className="mb-6">
      <div className="text-sm font-medium text-cta-gold">{back}</div>
      <h1 className="mt-3 font-display text-2xl font-bold tracking-tight">
        {title}
      </h1>
    </header>
  );
}
