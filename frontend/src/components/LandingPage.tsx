import { Swords, TrendingUp, MapPin } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { t } from "@/data/translations";
import { AdPlaceholder } from "./AdPlaceholder";

interface LandingPageProps {
  onNavigate: () => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const { locale } = useLocale();

  const features = [
    { icon: TrendingUp, title: t("featureData", locale), desc: t("featureDataDesc", locale) },
    { icon: Swords, title: t("featureProfit", locale), desc: t("featureProfitDesc", locale) },
    { icon: MapPin, title: t("featureRoutes", locale), desc: t("featureRoutesDesc", locale) },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="relative flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20" />
        <div className="relative z-10 max-w-3xl animate-fade-in">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 glow-gold">
            <Swords className="h-8 w-8 text-gold" />
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gold sm:text-5xl lg:text-6xl">
            {t("heroTitle", locale)}
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
            {t("heroSubtitle", locale)}
          </p>
          <button
            onClick={onNavigate}
            className="gradient-gold rounded-lg px-8 py-3 text-sm font-bold tracking-wide text-primary-foreground transition-all hover:scale-105 hover:shadow-lg"
          >
            {t("goToDashboard", locale)}
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto grid max-w-5xl gap-6 px-4 pb-16 sm:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-gold/30"
          >
            <f.icon className="mb-3 h-6 w-6 text-gold" />
            <h3 className="mb-1 text-base font-semibold text-foreground">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Free banner */}
      <section className="mx-auto max-w-3xl px-4 pb-12 text-center">
        <p className="text-sm font-medium text-gold">{t("freeForever", locale)}</p>
        <p className="mt-1 text-xs text-muted-foreground">{t("freeDesc", locale)}</p>
      </section>

      {/* Ad */}
      <div className="pb-8">
        <AdPlaceholder size="728x90" />
      </div>
    </div>
  );
}
