from pydantic import BaseModel
from typing import Optional

class CraftingResponse(BaseModel):
    item_id: str
    item_name_en: str
    item_name_es: str
    tier: int
    craft_city: str
    sell_city: str
    method: str
    journal: Optional[str]
    
    sell_price: int
    material_cost: int
    journal_profit: int
    station_fee: int
    unit_profit: int
    qty: int
    total_profit: int
    roi: float
    volume: int

    class Config:
        from_attributes = True