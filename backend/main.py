from fastapi import FastAPI, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from database import get_db, engine
from models import CraftingOpportunity, Base
import schemas
from crafting_math import get_bonus_city

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Albion Industrialist API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def calculate_rrr(item_id: str, craft_city: str, use_focus: bool) -> float:
    bonus_city = get_bonus_city(item_id)
    is_bonus = craft_city == bonus_city
    if use_focus: return 0.479 if is_bonus else 0.435
    return 0.248 if is_bonus else 0.152

@app.get("/api/crafting-profits", response_model=List[schemas.CraftingResponse])
def get_crafting_profits(
    db: Session = Depends(get_db),
    use_premium: bool = Query(False),
    use_focus: bool = Query(False),
    use_journals: bool = Query(False),
    use_buy_orders: bool = Query(False),
    station_fee_per_100: int = Query(500),
    tier: int = Query(0),
    max_investment: int = Query(25000000),
    max_market_share: float = Query(0.25),
    min_total_profit: int = Query(50000),
    max_roi_limit: float = Query(250.0),
    rest_min_roi: float = Query(40.0),
    rest_min_profit: int = Query(5000),
    limit: int = Query(500)
):

    query = db.query(CraftingOpportunity).filter(CraftingOpportunity.item_sell_price > 0)
    
    if tier > 0:
        query = query.filter(CraftingOpportunity.tier == tier)
    else:
        query = query.filter(CraftingOpportunity.tier <= 8)
        
    opportunities = query.all()

    tax_rate = 0.04 if use_premium else 0.08
    setup_fee = 0.025
    best_routes = {}

    for opp in opportunities:
        ret_cost = opp.returnable_cost_buy if use_buy_orders else opp.returnable_cost_sell
        non_ret_cost = opp.non_returnable_cost_buy if use_buy_orders else opp.non_returnable_cost_sell
        
        if (ret_cost + non_ret_cost) <= 0: continue

        current_rrr = calculate_rrr(opp.item_id, opp.craft_city, use_focus)
        station_fee = opp.item_value * (station_fee_per_100 / 100) * 0.1125
        
        actual_material_cost = (ret_cost * (1 - current_rrr)) + non_ret_cost
        
        net_revenue = opp.item_sell_price * (1 - (tax_rate + setup_fee))
        active_journal_profit = opp.journal_profit if use_journals else 0
        
        unit_profit = (net_revenue - actual_material_cost) - station_fee
        roi = (unit_profit / actual_material_cost) * 100 if actual_material_cost > 0 else 0

        if roi > max_roi_limit: continue

        max_sellable_vol = opp.volume * max_market_share
        qty = min(max_sellable_vol, max_investment / actual_material_cost) if actual_material_cost > 0 else max_sellable_vol
        qty = max(1, qty)

        total_profit = unit_profit * qty

        if opp.sell_city in ["Arthurs Rest", "Merlyns Rest", "Morganas Rest"]:
            if roi < rest_min_roi or total_profit < rest_min_profit: continue
        if total_profit < min_total_profit: continue

        response_obj = schemas.CraftingResponse(
            item_id=opp.item_id, item_name_en=opp.item_name_en, item_name_es=opp.item_name_es, tier=opp.tier,
            craft_city=opp.craft_city, sell_city=opp.sell_city, method=opp.method, journal=opp.journal if use_journals else "---",
            sell_price=int(opp.item_sell_price), material_cost=int(actual_material_cost), journal_profit=int(active_journal_profit), 
            station_fee=int(station_fee), unit_profit=int(unit_profit), qty=int(qty), total_profit=int(total_profit),
            roi=round(roi, 2), volume=int(opp.volume)
        )

        key = (opp.item_id, opp.sell_city)
        if key not in best_routes:
            best_routes[key] = {"cost": actual_material_cost, "data": response_obj, "craft_city": opp.craft_city}
        else:
            current_best = best_routes[key]
            if actual_material_cost < current_best["cost"] * 0.99:
                best_routes[key] = {"cost": actual_material_cost, "data": response_obj, "craft_city": opp.craft_city}
            elif actual_material_cost <= current_best["cost"] * 1.01:
                if opp.craft_city == opp.sell_city:
                    best_routes[key] = {"cost": actual_material_cost, "data": response_obj, "craft_city": opp.craft_city}

    results = [route["data"] for route in best_routes.values()]
    results.sort(key=lambda x: x.total_profit, reverse=True)
    return results[:limit]