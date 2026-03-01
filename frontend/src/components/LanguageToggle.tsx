import { useLocale } from "@/contexts/LocaleContext";

export function LanguageToggle() {
  const { locale, toggleLocale } = useLocale();
  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-semibold tracking-wide transition-colors hover:bg-accent"
    >
      <span className={locale === "en" ? "text-gold" : "text-muted-foreground"}>EN</span>
      <span className="text-muted-foreground/50">/</span>
      <span className={locale === "es" ? "text-gold" : "text-muted-foreground"}>ES</span>
    </button>
  );
}
