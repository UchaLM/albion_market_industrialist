import { useState } from "react";
import { LandingPage } from "@/components/LandingPage";
import { Dashboard } from "@/components/Dashboard";
import { TopBar } from "@/components/TopBar";
import { SideMenu } from "@/components/SideMenu";

type View = "landing" | "dashboard";

const Index = () => {
  const [view, setView] = useState<View>("landing");
  const [menuOpen, setMenuOpen] = useState(false);

  if (view === "landing") {
    return (
      <div className="min-h-screen flex flex-col">
        <TopBar onMenuOpen={() => setMenuOpen(true)} />
        <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
        <LandingPage onNavigate={() => setView("dashboard")} />
      </div>
    );
  }

  return <Dashboard />;
};

export default Index;
