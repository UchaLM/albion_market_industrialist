import { Menu, Swords } from "lucide-react";
import { LanguageToggle } from "./LanguageToggle";

interface TopBarProps {
  onMenuOpen: () => void;
}

export function TopBar({ onMenuOpen }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button onClick={onMenuOpen} className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <Swords className="h-5 w-5 text-gold" />
          <span className="font-display text-base font-bold tracking-wide text-gold">
            Albion Industrialist
          </span>
        </div>
      </div>
      <LanguageToggle />
    </header>
  );
}
