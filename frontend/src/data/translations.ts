// ============================================================
// TODO: REPLACE WITH ACTUAL BACKEND API DATA / GAME DATA FILES
// Translation dictionary for UI labels and game-specific item names.
// Item names use game-specific terminology, NOT literal translations.
// ============================================================

export type Locale = "en" | "es";

interface TranslationMap {
  [key: string]: { en: string; es: string };
}

// Game item names — must match in-game localization
export const itemNames: TranslationMap = {
  bloodletter: { en: "Bloodletter", es: "Sangradora" },
  greatAxe: { en: "Great Axe", es: "Gran Hacha" },
  guardianHelmet: { en: "Guardian Helmet", es: "Yelmo de Guardián" },
  royalSandals: { en: "Royal Sandals", es: "Sandalias Reales" },
  graveguardArmor: { en: "Graveguard Armor", es: "Armadura de Guardatumbas" },
  boltCasters: { en: "Bolt Casters", es: "Lanzarrayos" },
  druidRobe: { en: "Druid Robe", es: "Túnica de Druida" },
};

// UI labels
export const uiLabels: TranslationMap = {
  // Header / Nav
  appTitle: { en: "Albion Industrialist", es: "Albion Industrialist" },
  dashboard: { en: "Dashboard", es: "Panel" },
  craftingCalc: { en: "Crafting Calculator", es: "Calculadora de Crafteo" },
  marketFlipping: { en: "Market Flipping", es: "Reventa de Mercado" },
  tradeRoutes: { en: "Trade Routes", es: "Rutas Comerciales" },
  comingSoon: { en: "Coming Soon", es: "Próximamente" },
  useBuyOrders: { en: "Use Buy Orders (Materials)", es: "Órdenes de Compra (Materiales)" },
  tipUpdated: { en: "Time since last market price update", es: "Tiempo desde la última actualización del precio en el mercado" },
  updated: { en: "Updated", es: "Actualizado" },
  
  

  // Landing
  heroTitle: { en: "Maximize Your Silver", es: "Maximiza Tu Plata" },
  heroSubtitle: {
    en: "Real-time crafting data & market arbitrage tools for Albion Online",
    es: "Datos de crafteo en tiempo real y herramientas de arbitraje para Albion Online",
  },
  goToDashboard: { en: "Go to Dashboard", es: "Ir al Panel" },
  featureData: { en: "Live Market Data", es: "Datos de Mercado en Vivo" },
  featureDataDesc: {
    en: "Prices updated every 5 minutes from all royal cities",
    es: "Precios actualizados cada 5 minutos de todas las ciudades reales",
  },
  featureProfit: { en: "Profit Calculator", es: "Calculadora de Ganancias" },
  featureProfitDesc: {
    en: "Factor in taxes, focus, journals, and return rates automatically",
    es: "Incluye impuestos, focus, diarios y tasas de retorno automáticamente",
  },
  featureRoutes: { en: "Optimal Routes", es: "Rutas Óptimas" },
  featureRoutesDesc: {
    en: "Find the best city-to-city crafting and selling combinations",
    es: "Encuentra las mejores combinaciones de crafteo y venta entre ciudades",
  },
  freeForever: { en: "100% Free, Forever", es: "100% Gratis, Para Siempre" },
  freeDesc: {
    en: "Albion Industrialist is completely free and supported by ads.",
    es: "Albion Industrialist es completamente gratis y se sostiene con anuncios.",
  },

  // Filters
  premiumStatus: { en: "Premium Status", es: "Estado Premium" },
  useFocus: { en: "Use Crafting Focus", es: "Usar Focus de Crafteo" },
  targetCity: { en: "Target City", es: "Ciudad Objetivo" },
  craftCity: { en: "Crafting City", es: "Ciudad de Crafteo" },
  selectCity: { en: "Select city...", es: "Seleccionar ciudad..." },

  // Table headers
  item: { en: "Item", es: "Objeto" },
  cCity: { en: "C.City", es: "C.Ciudad" },
  sCity: { en: "S.City", es: "V.Ciudad" },
  method: { en: "Method", es: "Método" },
  journal: { en: "Jrnl", es: "Diario" },
  costPerUnit: { en: "Cost/U", es: "Costo/U" },
  sellPerUnit: { en: "Sell/U", es: "Venta/U" },
  unitProfit: { en: "U.Prof", es: "Gan/U" },
  qty: { en: "Qty", es: "Cant" },
  volume: { en: "Vol", es: "Vol" },
  totalProfit: { en: "Tot Profit", es: "Gan Total" },
  roi: { en: "ROI", es: "ROI" },

  marketFlipper: {
    en: "Market Flipper",
    es: "Market Flipper"
  },
  buyCity: {
    en: "Buy City",
    es: "Ciudad de Compra"
  },
  profitPerItem: {
    en: "Profit per Item",
    es: "Ganancia por Ítem"
  },
  useSellOrders: {
    en: "Use Sell Orders",
    es: "Orden de Venta"
  },
  buyPrice: {
    en: "Buy Price",
    es: "Precio de Compra"
  },

  // Tooltips
  tipItem: { en: "Name of the craftable item", es: "Nombre del objeto crafteable" },
  tipCCity: { en: "City where the item is crafted", es: "Ciudad donde se craftea el objeto" },
  tipSCity: { en: "City where the item is sold", es: "Ciudad donde se vende el objeto" },
  tipMethod: { en: "DIR = Direct craft, UPG = Upgrade from lower tier", es: "DIR = Crafteo directo, UPG = Mejora desde tier inferior" },
  tipJournal: { en: "Type of journal used for crafting fame", es: "Tipo de diario usado para la fama de crafteo" },
  tipCostPerUnit: { en: "Total material cost per unit crafted", es: "Costo total de materiales por unidad crafteada" },
  tipSellPerUnit: { en: "Market sell price per unit after taxes", es: "Precio de venta en mercado por unidad tras impuestos" },
  tipUnitProfit: { en: "Profit per single unit (sell - cost)", es: "Ganancia por unidad (venta - costo)" },
  tipQty: { en: "Recommended quantity to craft for optimal profit", es: "Cantidad recomendada a craftear para ganancia óptima" },
  tipVolume: { en: "Average daily market volume (units sold per day)", es: "Volumen diario promedio del mercado (unidades vendidas por día)" },
  tipTotalProfit: { en: "Total profit = Unit Profit × Quantity", es: "Ganancia total = Ganancia por unidad × Cantidad" },
  tipRoi: { en: "Return on Investment as a percentage", es: "Retorno de inversión como porcentaje" },

  "Warrior's Journal": { en: "Warrior's Journal", es: "Diario de Guerrero" },
  "Hunter's Journal": { en: "Hunter's Journal", es: "Diario de Cazador" },
  "Mage's Journal": { en: "Mage's Journal", es: "Diario de Mago" },
  "Toolmaker's Journal": { en: "Toolmaker's Journal", es: "Diario de Hojalatero" },
  "Tinker's Journal": { en: "Tinker's Journal", es: "Diario de Hojalatero" },
  "Blacksmith's Journal": { en: "Blacksmith's Journal", es: "Diario de Herrero" },
  "Fletcher's Journal": { en: "Fletcher's Journal", es: "Diario de Flechero" },
  "Imbuer's Journal": { en: "Imbuer's Journal", es: "Diario de Imbuidor" },
};

export function t(key: string, locale: Locale): string {
  const entry = uiLabels[key] || itemNames[key];
  if (!entry) return key;
  return entry[locale] || entry.en;
}

export function tItem(key: string, locale: Locale): string {
  const entry = itemNames[key];
  if (!entry) return key;
  return entry[locale] || entry.en;
}

