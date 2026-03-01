import { useState } from "react";
import { TopBar } from "./TopBar";
import { SideMenu } from "./SideMenu";
import { FiltersPanel } from "./FiltersPanel";
import { CraftingTable } from "./CraftingTable";
import { AdPlaceholder } from "./AdPlaceholder";
import { useLocale } from "@/contexts/LocaleContext";
import { t } from "@/data/translations";
import { AlertTriangle } from "lucide-react";

export function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { locale } = useLocale();

  const [filters, setFilters] = useState({
    premium: true,
    useFocus: false,
    useBuyOrders: false, 
    city: "Black Market",
    tier: 0 
  });

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar onMenuOpen={() => setMenuOpen(true)} />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1800px] mx-auto p-4 sm:p-6 lg:p-8">
          <AdPlaceholder size="728x90" />
          <h2 className="text-2xl font-bold text-gold mb-4">
            {t("craftingCalc", locale)}
          </h2>
          
          <div className="flex items-start gap-3 rounded-md border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-500/90 shadow-sm mb-6">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>
              {locale === 'es' 
                ? 'Los precios del mercado son recopilados por la comunidad (Albion Data Project) y pueden tener un retraso de varias horas. ¡Verifica siempre los precios exactos en el juego antes de realizar grandes inversiones!' 
                : 'Market prices are crowdsourced via the Albion Data Project and may be delayed by several hours. Always double-check exact prices in-game before making large investments!'}
            </p>
          </div>
          
          <FiltersPanel filters={filters} setFilters={setFilters} />
          <CraftingTable filters={filters} />
          
          <div className="flex justify-center pt-4">
            <AdPlaceholder size="300x250" />
          </div>
        </div>
      </main>
    </div>
  );
}