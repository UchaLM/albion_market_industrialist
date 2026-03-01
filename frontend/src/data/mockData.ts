// ============================================================
// TODO: REPLACE WITH ACTUAL BACKEND API DATA
// This file contains all mock/dummy data for the Albion Industrialist app.
// When integrating the real backend, replace each export with
// actual API calls or data fetched from the Python/SQL backend.
// ============================================================

export interface CraftingEntry {
  id: string;
  itemKey: string; // translation key
  craftCity: string;
  sellCity: string;
  method: "DIR" | "UPG";
  journalType: string;
  costPerUnit: number;
  sellPerUnit: number;
  unitProfit: number;
  quantity: number;
  dailyVolume: number;
  totalProfit: number;
  roi: number;
}

// TODO: REPLACE WITH ACTUAL BACKEND API DATA
export const mockCraftingData: CraftingEntry[] = [
  {
    id: "1",
    itemKey: "bloodletter",
    craftCity: "Lymhurst",
    sellCity: "Caerleon",
    method: "DIR",
    journalType: "Hunter",
    costPerUnit: 45200,
    sellPerUnit: 72500,
    unitProfit: 27300,
    quantity: 12,
    dailyVolume: 87,
    totalProfit: 327600,
    roi: 60.4,
  },
  {
    id: "2",
    itemKey: "greatAxe",
    craftCity: "Fort Sterling",
    sellCity: "Bridgewatch",
    method: "UPG",
    journalType: "Hunter",
    costPerUnit: 38000,
    sellPerUnit: 54800,
    unitProfit: 16800,
    quantity: 20,
    dailyVolume: 145,
    totalProfit: 336000,
    roi: 44.2,
  },
  {
    id: "3",
    itemKey: "guardianHelmet",
    craftCity: "Bridgewatch",
    sellCity: "Caerleon",
    method: "DIR",
    journalType: "Warrior",
    costPerUnit: 22100,
    sellPerUnit: 31400,
    unitProfit: 9300,
    quantity: 35,
    dailyVolume: 210,
    totalProfit: 325500,
    roi: 42.1,
  },
  {
    id: "4",
    itemKey: "royalSandals",
    craftCity: "Martlock",
    sellCity: "Lymhurst",
    method: "DIR",
    journalType: "Mage",
    costPerUnit: 67000,
    sellPerUnit: 98500,
    unitProfit: 31500,
    quantity: 8,
    dailyVolume: 42,
    totalProfit: 252000,
    roi: 47.0,
  },
  {
    id: "5",
    itemKey: "graveguardArmor",
    craftCity: "Thetford",
    sellCity: "Caerleon",
    method: "UPG",
    journalType: "Warrior",
    costPerUnit: 89000,
    sellPerUnit: 115000,
    unitProfit: 26000,
    quantity: 6,
    dailyVolume: 28,
    totalProfit: 156000,
    roi: 29.2,
  },
  {
    id: "6",
    itemKey: "boltCasters",
    craftCity: "Lymhurst",
    sellCity: "Fort Sterling",
    method: "DIR",
    journalType: "Hunter",
    costPerUnit: 31500,
    sellPerUnit: 49200,
    unitProfit: 17700,
    quantity: 18,
    dailyVolume: 95,
    totalProfit: 318600,
    roi: 56.2,
  },
  {
    id: "7",
    itemKey: "druidRobe",
    craftCity: "Martlock",
    sellCity: "Bridgewatch",
    method: "DIR",
    journalType: "Mage",
    costPerUnit: 41000,
    sellPerUnit: 52000,
    unitProfit: 11000,
    quantity: 25,
    dailyVolume: 178,
    totalProfit: 275000,
    roi: 26.8,
  },
];

// TODO: REPLACE WITH ACTUAL BACKEND API DATA
export const cities = [
  "Lymhurst",
  "Fort Sterling",
  "Bridgewatch",
  "Martlock",
  "Thetford",
  "Caerleon",
];
