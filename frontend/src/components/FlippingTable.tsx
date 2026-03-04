import { useQuery } from "@tanstack/react-query";
import { useLocale } from "@/contexts/LocaleContext";
import { t } from "@/data/translations";
import { Loader2, ArrowRight } from "lucide-react";

interface FlippingEntry {
  item_id: string;
  item_name_en: string;
  item_name_es: string;
  tier: number;
  buy_city: string;
  sell_city: string;
  buy_price: number;
  sell_price: number;
  profit: number;
  roi: number;
  volume: number;
  updated_at: string;
}

export function FlippingTable({ filters }: any) {
  const { locale } = useLocale();

  const { data, isLoading, error } = useQuery({
    queryKey: ["flipping-profits", filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        use_premium: filters.premium.toString(),
        use_sell_orders: filters.useSellOrders.toString(),
        tier: filters.tier.toString(),
        limit: "500",
      });
      
      const response = await fetch(`https://albion-market-industrialist.onrender.com/api/flipping-profits?${params}`);
      if (!response.ok) throw new Error("Error fetching data");
      let results: FlippingEntry[] = await response.json();

      if (filters.buyCity && filters.buyCity !== "All") {
        results = results.filter((i) => i.buy_city === filters.buyCity);
      }
      if (filters.city && filters.city !== "All") {
        results = results.filter((i) => i.sell_city === filters.city);
      }

      return results;
    },
    refetchInterval: 60000,
  });

  if (isLoading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>;
  if (error) return <div className="p-4 text-red-500 text-center">Error loading flipping data</div>;

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/50 text-xs font-medium uppercase text-muted-foreground">
          <tr>
            <th className="px-4 py-3">{t("item", locale)}</th>
            <th className="px-4 py-3">{t("buyCity", locale) || "Buy City"}</th>
            <th className="px-4 py-3 text-center"></th>
            <th className="px-4 py-3">{t("targetCity", locale)}</th>
            <th className="px-4 py-3 text-right">{t("profitPerItem", locale) || "Profit"}</th>
            <th className="px-4 py-3 text-right">ROI</th>
            <th className="px-4 py-3 text-right">{t("volume", locale)}</th>
            <th className="px-4 py-3 text-right">{t("updated", locale)}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data?.map((item, idx) => (
            <tr key={`${item.item_id}-${idx}`} className="hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3 font-medium">
                {locale === "es" ? item.item_name_es : item.item_name_en}
                <div className="text-[10px] text-muted-foreground font-mono">{item.item_id}</div>
              </td>
              <td className="px-4 py-3 text-blue-400 font-semibold">{item.buy_city}</td>
              <td className="px-4 py-3 text-muted-foreground text-center">
                <ArrowRight className="h-4 w-4 inline-block" />
              </td>
              <td className="px-4 py-3 text-gold font-semibold">{item.sell_city}</td>
              <td className="px-4 py-3 text-right text-green-400 font-bold">
                {Math.round(item.profit).toLocaleString()} <span className="text-[10px] opacity-70">/ u</span>
              </td>
              <td className="px-4 py-3 text-right">
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.roi > 20 ? 'bg-green-500/20 text-green-500' : 'bg-gold/20 text-gold'}`}>
                  {item.roi.toFixed(1)}%
                </span>
              </td>
              <td className="px-4 py-3 text-right text-muted-foreground">
                {item.volume.toFixed(1)} <span className="text-[10px] uppercase">/d</span>
              </td>
              <td className="px-4 py-3 text-right text-[10px] text-muted-foreground">
                {item.updated_at}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}