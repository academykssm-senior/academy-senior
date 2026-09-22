import { Link } from "@tanstack/react-router";
import type { FormAvailability, LanguageStream } from "@/types/curriculum";
import { Card } from "@/components/ui/Card";

type FormCardProps = {
  form: FormAvailability;
  lang: LanguageStream;
};

export function FormCard({ form, lang }: FormCardProps) {
  const title = lang === "bm" ? form.nameBm : form.nameEn;
  const laterLabel = lang === "bm" ? "Akan datang" : "Coming later";
  const openLabel = lang === "bm" ? "Buka" : "Open";

  if (!form.available) {
    return (
      <Card className="border border-nova-slate opacity-70">
        <p className="font-display text-xl font-semibold">{title}</p>
        <p className="mt-2 text-sm text-text-secondary">{laterLabel}</p>
      </Card>
    );
  }

  return (
    <Link
      to="/f4/$lang"
      params={{ lang }}
      className="block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta-gold"
    >
      <Card className="border border-cta-gold/35 transition hover:border-cta-gold">
        <p className="font-display text-xl font-semibold text-cta-gold">
          {title}
        </p>
        <p className="mt-2 text-sm text-text-secondary">{openLabel}</p>
      </Card>
    </Link>
  );
}
