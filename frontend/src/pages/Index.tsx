import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LandingPage } from "@/components/LandingPage";
import { TopBar } from "@/components/TopBar";
import { SideMenu } from "@/components/SideMenu";

const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar onMenuOpen={() => setMenuOpen(true)} />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      {/* Al hacer clic en el botón de la Landing, viajamos a la ruta real */}
      <LandingPage onNavigate={() => navigate('/crafting')} />
    </div>
  );
};

export default Index;