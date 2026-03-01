import { X, Swords, BarChart3, MapPin } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";
import { t } from "@/data/translations";

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
}

export function SideMenu({ open, onClose }: SideMenuProps) {
  const { locale } = useLocale();

  const links = [
    { label: t("craftingCalc", locale), icon: Swords, active: true, disabled: false },
    { label: t("marketFlipping", locale), icon: BarChart3, active: false, disabled: true },
    { label: t("tradeRoutes", locale), icon: MapPin, active: false, disabled: true },
  ];

  return (
    <>
      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm" onClick={onClose} />
      )}
      {/* Drawer */}
      <div
        className={`fixed left-0 top-0 z-50 h-full w-72 transform border-r border-border bg-card transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <span className="font-display text-lg font-bold text-gold">
            {t("appTitle", locale)}
          </span>
          <button onClick={onClose} className="rounded p-1 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {links.map((link) => (
            <button
              key={link.label}
              disabled={link.disabled}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                link.active
                  ? "bg-primary/10 text-gold font-medium"
                  : link.disabled
                  ? "cursor-not-allowed text-muted-foreground/40"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
              {link.disabled && (
                <span className="ml-auto rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                  {t("comingSoon", locale)}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
