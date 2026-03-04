import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { Analytics } from "@vercel/analytics/react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MarketFlipper from "./pages/MarketFlipper";
import { Dashboard } from "./components/Dashboard"; // <-- Importamos el Dashboard de crafteo

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LocaleProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />               {/* Landing Page */}
            <Route path="/crafting" element={<Dashboard />} />   {/* Calculadora */}
            <Route path="/flipper" element={<MarketFlipper />} />{/* Flipper */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Analytics />
      </TooltipProvider>
    </LocaleProvider>
  </QueryClientProvider>
);

export default App;