import { useState, useMemo } from "react";
import { HelpCircle, ArrowUpDown, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "@/contexts/LocaleContext";
import { t } from "@/data/translations";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

type FlippingEntry = {
  item_id: string;
  item_name_en: string;
  item_name_es: string;
  tier: number;
  buy_city: string;
  sell_city: string;
  buy_price: number;
  sell_price: number;
  unit_profit: number;
  qty: number;
  total_profit: number;
  roi: number;
  volume: number;
  updated_at?: string;
};

type SortKey = keyof FlippingEntry;
type SortDir = "asc" | "desc";

const baseColumns: { key: SortKey; label: string; tip: string; align?: string }[] = [
  { key: "item_name_en", label: "item", tip: "tipItem" },
  { key: "buy_city", label: "buyCity", tip: "tipCCity" },
  { key: "sell_city", label: "targetCity", tip: "tipSCity" },
  { key: "buy_price", label: "buyPrice", tip: "tipCostPerUnit", align: "right" },
  { key: "sell_price", label: "sellPerUnit", tip: "tipSellPerUnit", align: "right" },
  { key: "unit_profit", label: "unitProfit", tip: "tipUnitProfit", align: "right" },
  { key: "qty", label: "qty", tip: "tipQty", align: "right" },
  { key: "volume", label: "volume", tip: "tipVolume", align: "right" },
  { key: "total_profit", label: "totalProfit", tip: "tipTotalProfit", align: "right" },
  { key: "roi", label: "roi", tip: "tipRoi", align: "right" },
  { key: "updated_at", label: "updated", tip: "tipUpdated", align: "right" },
];

function formatSilver(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toLocaleString();
}

const getTimeAgo = (dateString: string | undefined, locale: string) => {
  if (!dateString || dateString.startsWith("0001") || dateString === "Old") {
    return locale === 'es' ? "Viejo" : "Old";
  }
  const diff = Date.now() - new Date(dateString).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return locale === 'es' ? "Recién" : "Just now";
  if (hours < 24) return locale === 'es' ? `hace ${hours}h` : `${hours}h ago`;
  return locale === 'es' ? `hace ${Math.floor(hours / 24)}d` : `${Math.floor(hours / 24)}d ago`;
};

export function FlippingTable({ filters }: any) {
  const { locale } = useLocale();
  const [sortKey, setSortKey] = useState<SortKey>("total_profit");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const { data: apiData = [], isLoading } = useQuery({
    queryKey: ["flippingProfits", filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        use_premium: (filters?.premium ?? true).toString(),
        use_sell_orders: (filters?.useSellOrders ?? true).toString(),
        tier: (filters?.tier ?? 0).toString(),
        limit: "500",
      });

      const response = await fetch(`https://albion-market-industrialist.onrender.com/api/flipping-profits?${params.toString()}`);
      if (!response.ok) throw new Error("Network response was not ok");
      let data = await response.json();

      if (filters?.buyCity && filters.buyCity !== "All") {
        data = data.filter((item: FlippingEntry) => item.buy_city === filters.buyCity);
      }
      if (filters?.city && filters.city !== "All") {
        data = data.filter((item: FlippingEntry) => item.sell_city === filters.city);
      }

      return data;
    },
    refetchInterval: 60000,
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const sorted = useMemo(() => {
    const data = [...apiData];
    data.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return data;
  }, [apiData, sortKey, sortDir]);

  const renderCell = (entry: FlippingEntry, col: (typeof baseColumns)[0]) => {
    const val = entry[col.key];

    // NOMBRES EN DORADO IDÉNTICO AL CRAFTEO
    if (col.key === "item_name_en") {
      const name = locale === 'es' ? entry.item_name_es : entry.item_name_en;
      return <span className="font-medium text-gold">{name}</span>;
    }

    // CIUDADES CON EL MISMO ESTILO
    if (col.key === "buy_city" || col.key === "sell_city") {
      return String(val);
    }

    // PRECIOS BASE (COMPRA Y VENTA) CON EL MISMO REDONDEO "k"
    if (col.key === "buy_price" || col.key === "sell_price") {
      return formatSilver(Number(val));
    }

    // COLORES VERDES/ROJOS PARA LAS GANANCIAS
    if (col.key === "unit_profit" || col.key === "total_profit") {
      const n = Number(val);
      return <span className={n >= 0 ? "text-profit font-semibold" : "text-loss font-semibold"}>{formatSilver(n)}</span>;
    }

    // ADIÓS ROI DECIMAL INFINITO: LO LIMITAMOS A 2 DECIMALES
    if (col.key === "roi") {
      const n = Number(val);
      return <span className={n >= 40 ? "text-profit" : "text-foreground"}>{n.toFixed(2)}%</span>;
    }

    // ADIÓS VOLUMEN DECIMAL INFINITO: LO LIMITAMOS A 1 DECIMAL
    if (col.key === "volume") {
      return Number(val).toFixed(1);
    }

    // CANTIDADES CON COMAS MILES (EJ: 1,500)
    if (col.key === "qty") {
      return Number(val).toLocaleString();
    }

    // TIEMPO RELATIVO CON COLORES
    if (col.key === "updated_at") {
      const timeStr = getTimeAgo(val as string, locale);
      const isOld = timeStr.includes("d") || timeStr === "Old" || timeStr === "Viejo";
      return <span className={`font-medium whitespace-nowrap ${isOld ? "text-red-400" : "text-green-400"}`}>{timeStr}</span>;
    }

    return String(val);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-border bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="max-h-[700px] overflow-y-auto rounded-lg border border-border bg-card relative">
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-20 bg-muted/95 backdrop-blur border-b border-border shadow-sm">
          <tr>
            {baseColumns.map((col) => (
              <th
                key={col.key}
                className={`cursor-pointer whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground ${
                  col.align === "right" ? "text-right" : "text-left"
                }`}
                onClick={() => handleSort(col.key)}
              >
                <span className="inline-flex items-center gap-1">
                  {t(col.label, locale) || col.label}
                  
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/60 hover:text-gold transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent 
                        side="bottom" 
                        align={col.align === "right" ? "end" : "start"}
                        sideOffset={6}
                        className="max-w-[260px] whitespace-normal break-words p-3 text-sm z-[9999] bg-popover text-popover-foreground shadow-lg leading-relaxed border-border"
                      >
                        {t(col.tip, locale) || col.tip}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {sortKey === col.key && (
                    <ArrowUpDown className="h-3 w-3 text-gold" />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((entry, i) => (
            <tr
              key={`${entry.item_id}-${entry.buy_city}-${entry.sell_city}`}
              className={`border-b border-border/50 transition-colors hover:bg-accent/50 ${
                i % 2 === 0 ? "bg-card" : "bg-muted/20"
              }`}
            >
              {baseColumns.map((col) => (
                <td
                  key={col.key}
                  className={`whitespace-nowrap px-3 py-2.5 ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {renderCell(entry, col)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}