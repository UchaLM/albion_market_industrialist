import { useLocale } from "@/contexts/LocaleContext";
import { t } from "@/data/translations";

export function FiltersPanel({ filters, setFilters }: any) {
  const { locale } = useLocale();

  const allCities = ["Black Market", "Caerleon", "Lymhurst", "Bridgewatch", "Martlock", "Thetford", "Fort Sterling", "Brecilien"];
  const allTiers = [0, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="flex flex-wrap items-center gap-6 rounded-lg border border-border bg-card p-4">
      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={filters.premium}
          onChange={(e) => setFilters({ ...filters, premium: e.target.checked })}
          className="h-4 w-4 rounded border-border bg-muted accent-gold"
        />
        <span className={filters.premium ? "text-gold font-medium" : "text-muted-foreground"}>
          {t("premiumStatus", locale)}
        </span>
      </label>

      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={filters.useFocus}
          onChange={(e) => setFilters({ ...filters, useFocus: e.target.checked })}
          className="h-4 w-4 rounded border-border bg-muted accent-gold"
        />
        <span className={filters.useFocus ? "text-gold font-medium" : "text-muted-foreground"}>
          {t("useFocus", locale)}
        </span>
      </label>

      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Tier:</span>
        <select
          value={filters.tier}
          onChange={(e) => setFilters({ ...filters, tier: Number(e.target.value) })}
          className="rounded-md border border-border bg-muted px-2.5 py-1.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-gold"
        >
          {allTiers.map((t) => (
            <option key={t} value={t}>
              {t === 0 ? (locale === 'es' ? 'Todos' : 'All') : `Tier ${t}`}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">{t("targetCity", locale)}:</span>
        <select
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          className="rounded-md border border-border bg-muted px-2.5 py-1.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-gold"
        >
          {allCities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </div>
  );
}