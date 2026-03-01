import { useLocale } from "@/contexts/LocaleContext";
import { t } from "@/data/translations";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function FiltersPanel({ filters, setFilters }: any) {
  const { locale } = useLocale();

  const allCities = ["Black Market", "Caerleon", "Lymhurst", "Bridgewatch", "Martlock", "Thetford", "Fort Sterling", "Brecilien"];
  const allTiers = [0, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="flex flex-wrap items-center gap-6 rounded-lg border border-border bg-card p-4">
      
      {/* Switch: Premium */}
      <div className="flex items-center space-x-2">
        <Switch
          id="premium"
          checked={filters.premium}
          onCheckedChange={(c) => setFilters({ ...filters, premium: c })}
        />
        <Label 
          htmlFor="premium" 
          className={`cursor-pointer ${filters.premium ? "text-gold font-medium" : "text-muted-foreground font-normal"}`}
        >
          {t("premiumStatus", locale)}
        </Label>
      </div>

      {/* Switch: Focus */}
      <div className="flex items-center space-x-2">
        <Switch
          id="focus"
          checked={filters.useFocus}
          onCheckedChange={(c) => setFilters({ ...filters, useFocus: c })}
        />
        <Label 
          htmlFor="focus" 
          className={`cursor-pointer ${filters.useFocus ? "text-gold font-medium" : "text-muted-foreground font-normal"}`}
        >
          {t("useFocus", locale)}
        </Label>
      </div>

      {/* Switch: Buy Orders (¡Nuevo y alineado!) */}
      <div className="flex items-center space-x-2">
        <Switch
          id="buy-orders"
          checked={filters.useBuyOrders}
          onCheckedChange={(c) => setFilters({ ...filters, useBuyOrders: c })}
        />
        <Label 
          htmlFor="buy-orders" 
          className={`cursor-pointer ${filters.useBuyOrders ? "text-gold font-medium" : "text-muted-foreground font-normal"}`}
        >
          {t("useBuyOrders", locale)}
        </Label>
      </div>

      {/* Select: Tier */}
      <div className="flex items-center gap-2 text-sm ml-auto">
        <span className="text-muted-foreground">Tier:</span>
        <select
          value={filters.tier}
          onChange={(e) => setFilters({ ...filters, tier: Number(e.target.value) })}
          className="rounded-md border border-border bg-muted px-2.5 py-1.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-gold cursor-pointer"
        >
          {allTiers.map((t) => (
            <option key={t} value={t}>
              {t === 0 ? (locale === 'es' ? 'Todos' : 'All') : `Tier ${t}`}
            </option>
          ))}
        </select>
      </div>

      {/* Select: City */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">{t("targetCity", locale)}:</span>
        <select
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          className="rounded-md border border-border bg-muted px-2.5 py-1.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-gold cursor-pointer"
        >
          {allCities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      
    </div>
  );
}