import logging
from sqlalchemy.dialects.sqlite import insert
from database import SessionLocal, engine
from models import CraftingOpportunity, Base
from crafting_math import (
    load_recipes, get_official_names, fetch_market_data,
    resolve_ingredient, is_refinable_resource, get_enchant_amount,
    get_journal_info, get_val, generate_target_items,
    RESOURCE_FAME, JOURNAL_FAME, CRAFT_CITIES, SELL_CITIES
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - [%(levelname)s] - %(message)s")

def get_price(prices_db, item_id, city, use_buy_order=False):
    order_type = "buy_offers" if use_buy_order else "sell_offers"
    return prices_db.get(item_id, {}).get(order_type, {}).get(city, 0)

def process_and_store_items():
    db = SessionLocal()
    recipes_db = load_recipes()
    name_map = get_official_names()
    
    filtered_targets = generate_target_items(recipes_db, max_tier=8)
    shopping_list = set(filtered_targets)
    
    for t in filtered_targets:
        base = t.split("@")[0]
        ench = int(t.split("@")[1]) if "@" in t else 0
        recipes_to_check = [recipes_db[k] for k in (t, base) if k in recipes_db]
        
        for r_entry in recipes_to_check:
            r = r_entry[0] if isinstance(r_entry, list) else r_entry
            c_res = get_val(r, "craftresource")
            res_list = c_res if isinstance(c_res, list) else [c_res] if c_res else []
            for ing in res_list:
                uname = get_val(ing, "uniquename")
                if uname:
                    shopping_list.add(uname)
                    shopping_list.add(resolve_ingredient(uname, ench))

    extras = []
    journals = ["WARRIOR", "HUNTER", "MAGE", "TOOLMAKER"]
    for tier in range(2, 9): 
        extras.extend([f"T{tier}_RUNE", f"T{tier}_SOUL", f"T{tier}_RELIC"])
        for j in journals:
            extras.extend([f"T{tier}_JOURNAL_{j}_EMPTY", f"T{tier}_JOURNAL_{j}_FULL"])
    shopping_list.update(extras)

    logging.info(f"Fetching market data for {len(shopping_list)} unique items/ingredients...")
    prices, volumes = fetch_market_data(list(shopping_list), SELL_CITIES + CRAFT_CITIES)

    opportunities_to_upsert = []

    for target_id in filtered_targets:
        base_id = target_id.split("@")[0]
        ench_lvl = int(target_id.split("@")[1]) if "@" in target_id else 0
        
        if base_id not in recipes_db: continue
        try: tier = int(target_id.split('_')[0].replace('T', ''))
        except: continue

        r_base = recipes_db[base_id][0] if isinstance(recipes_db[base_id], list) else recipes_db[base_id]
        item_val = float(get_val(r_base, "@itemvalue") or get_val(r_base, "@silver") or 0)
        c_res_base = get_val(r_base, "craftresource")
        res_list_base = c_res_base if isinstance(c_res_base, list) else [c_res_base] if c_res_base else []
        yield_base = float(get_val(r_base, "amountcraftable") or 1)

        is_exact = any(x in target_id.upper() for x in ["_MEAL_", "_POTION_"]) and target_id in recipes_db
        if is_exact:
            r_exact = recipes_db[target_id][0] if isinstance(recipes_db[target_id], list) else recipes_db[target_id]
            c_res_exact = get_val(r_exact, "craftresource")
            res_list_dir = c_res_exact if isinstance(c_res_exact, list) else [c_res_exact] if c_res_exact else []
            yield_dir = float(get_val(r_exact, "amountcraftable") or 1)
        else:
            res_list_dir = res_list_base
            yield_dir = yield_base

        journal_full_name, journal_short = get_journal_info(base_id)
        ench_suffix = f" .{ench_lvl}" if ench_lvl > 0 else ""
        item_name_en = name_map.get(base_id, {}).get("en", base_id) + ench_suffix
        item_name_es = name_map.get(base_id, {}).get("es", base_id) + ench_suffix

        for craft_city in CRAFT_CITIES:

            total_resources_unit = 0
            dir_ret_sell, dir_non_sell = 0, 0
            dir_ret_buy, dir_non_buy = 0, 0
            poss_dir_sell, poss_dir_buy = True, True
            
            for ing in res_list_dir:
                u_name = get_val(ing, "uniquename")
                count = float(get_val(ing, "count") or 1)
                if not u_name: continue
                real_ing_id = u_name if is_exact else resolve_ingredient(u_name, ench_lvl)
                
                p_sell = get_price(prices, real_ing_id, craft_city, False)
                p_buy = get_price(prices, real_ing_id, craft_city, True)

                is_ret = is_refinable_resource(u_name)
                
                if p_sell <= 0: poss_dir_sell = False
                else:
                    if is_ret: dir_ret_sell += p_sell * count
                    else: dir_non_sell += p_sell * count
                    
                if p_buy <= 0: poss_dir_buy = False
                else:
                    if is_ret: dir_ret_buy += p_buy * count
                    else: dir_non_buy += p_buy * count
                    
                if is_ret: total_resources_unit += (count / yield_dir)

            cost_dir_ret_sell = dir_ret_sell / yield_dir if poss_dir_sell else float('inf')
            cost_dir_non_sell = dir_non_sell / yield_dir if poss_dir_sell else float('inf')
            cost_dir_ret_buy = dir_ret_buy / yield_dir if poss_dir_buy else float('inf')
            cost_dir_non_buy = dir_non_buy / yield_dir if poss_dir_buy else float('inf')

            cost_upg_ret_sell, cost_upg_non_sell = float('inf'), float('inf')
            cost_upg_ret_buy, cost_upg_non_buy = float('inf'), float('inf')

            if ench_lvl > 0 and not is_exact and not "CAPEITEM" in base_id.upper():
                base_ret_sell, base_non_sell = 0, 0
                base_ret_buy, base_non_buy = 0, 0
                poss_upg_sell, poss_upg_buy = True, True
                
                for ing in res_list_base:
                    u_name = get_val(ing, "uniquename")
                    count = float(get_val(ing, "count") or 1)
                    
                    p_sell = get_price(prices, u_name, craft_city, False)
                    p_buy = get_price(prices, u_name, craft_city, True)
                    
                    is_ret = is_refinable_resource(u_name)
                    
                    if p_sell <= 0: poss_upg_sell = False
                    else:
                        if is_ret: base_ret_sell += p_sell * count
                        else: base_non_sell += p_sell * count
                        
                    if p_buy <= 0: poss_upg_buy = False
                    else:
                        if is_ret: base_ret_buy += p_buy * count
                        else: base_non_buy += p_buy * count
                
                ench_amount = get_enchant_amount(base_id)
                ench_sell_cost, ench_buy_cost = 0, 0
                for e_level in range(1, ench_lvl + 1):
                    ench_mats = {1: "_RUNE", 2: "_SOUL", 3: "_RELIC"}
                    if e_level not in ench_mats:
                        poss_upg_sell = False
                        poss_upg_buy = False
                        break
                        
                    ench_mat_id = f"T{tier}{ench_mats[e_level]}"
                    p_sell = get_price(prices, ench_mat_id, craft_city, False)
                    p_buy = get_price(prices, ench_mat_id, craft_city, True)
                    
                    if p_sell <= 0: poss_upg_sell = False
                    else: ench_sell_cost += p_sell * ench_amount
                    
                    if p_buy <= 0: poss_upg_buy = False
                    else: ench_buy_cost += p_buy * ench_amount
                
                if poss_upg_sell: 
                    cost_upg_ret_sell = base_ret_sell / yield_base
                    cost_upg_non_sell = (base_non_sell / yield_base) + ench_sell_cost
                if poss_upg_buy: 
                    cost_upg_ret_buy = base_ret_buy / yield_base
                    cost_upg_non_buy = (base_non_buy / yield_base) + ench_buy_cost

            total_dir_sell = cost_dir_ret_sell + cost_dir_non_sell
            total_upg_sell = cost_upg_ret_sell + cost_upg_non_sell
            
            if total_dir_sell < total_upg_sell:
                best_ret_sell = cost_dir_ret_sell
                best_non_sell = cost_dir_non_sell
                best_method = "Direct"
            else:
                best_ret_sell = cost_upg_ret_sell
                best_non_sell = cost_upg_non_sell
                best_method = "Upgrade"
                
            total_dir_buy = cost_dir_ret_buy + cost_dir_non_buy
            total_upg_buy = cost_upg_ret_buy + cost_upg_non_buy
            
            if total_dir_buy < total_upg_buy:
                best_ret_buy = cost_dir_ret_buy
                best_non_buy = cost_dir_non_buy
            else:
                best_ret_buy = cost_upg_ret_buy
                best_non_buy = cost_upg_non_buy

            if (best_ret_sell == float('inf') and best_non_sell == float('inf')) and (best_ret_buy == float('inf') and best_non_buy == float('inf')): 
                continue

            raw_j_profit = 0.0
            if tier in RESOURCE_FAME and total_resources_unit > 0 and journal_full_name:
                item_fame = total_resources_unit * RESOURCE_FAME[tier]
                journals_filled = item_fame / JOURNAL_FAME.get(tier, 1)
                j_id_e = f"T{tier}_JOURNAL_{journal_full_name}_EMPTY"
                j_id_f = f"T{tier}_JOURNAL_{journal_full_name}_FULL"
                p_e = get_price(prices, j_id_e, craft_city, False)
                p_f = prices.get(j_id_f, {}).get("sell_offers", {}).get(craft_city, 0)
                if p_e > 0 and p_f > p_e:
                    raw_j_profit = (p_f - p_e) * journals_filled

            for sell_city in SELL_CITIES:
                sell_price = prices.get(target_id, {}).get("sell_offers", {}).get(sell_city, 0)
                mkt_vol = volumes.get(target_id, {}).get(sell_city, 0)
                
                updated_date = prices.get(target_id, {}).get("sell_price_min_date", {}).get(sell_city, "Old")

                # REGLA RELAJADA: Solo descartamos si nadie lo vende o tiene 0 absoluto de volumen
                if sell_price <= 0 or mkt_vol < 0.01: continue

                opportunities_to_upsert.append({
                    "item_id": target_id,
                    "item_name_en": item_name_en,
                    "item_name_es": item_name_es,
                    "tier": tier,
                    "craft_city": craft_city,
                    "sell_city": sell_city,
                    "method": best_method,
                    "journal": f"{journal_full_name.capitalize()}'s Journal" if journal_full_name else "---",
                    "item_sell_price": sell_price,
                    "returnable_cost_sell": best_ret_sell if best_ret_sell != float('inf') else 0,
                    "non_returnable_cost_sell": best_non_sell if best_non_sell != float('inf') else 0,
                    "returnable_cost_buy": best_ret_buy if best_ret_buy != float('inf') else 0,
                    "non_returnable_cost_buy": best_non_buy if best_non_buy != float('inf') else 0,
                    "journal_profit": raw_j_profit,
                    "item_value": item_val,
                    "volume": mkt_vol,
                    "updated_at": updated_date
                })

    if opportunities_to_upsert:
        logging.info(f"Preparing to upsert {len(opportunities_to_upsert)} routes to the database...")
        
        CHUNK_SIZE = 500
        for i in range(0, len(opportunities_to_upsert), CHUNK_SIZE):
            chunk = opportunities_to_upsert[i : i + CHUNK_SIZE]
            
            stmt = insert(CraftingOpportunity).values(chunk)
            
            update_dict = {
                "method": stmt.excluded.method,
                "item_sell_price": stmt.excluded.item_sell_price,
                "returnable_cost_sell": stmt.excluded.returnable_cost_sell,
                "non_returnable_cost_sell": stmt.excluded.non_returnable_cost_sell,
                "returnable_cost_buy": stmt.excluded.returnable_cost_buy,
                "non_returnable_cost_buy": stmt.excluded.non_returnable_cost_buy,
                "journal_profit": stmt.excluded.journal_profit,
                "item_value": stmt.excluded.item_value,
                "volume": stmt.excluded.volume,
                "updated_at": stmt.excluded.updated_at
            }
            
            stmt = stmt.on_conflict_do_update(
                index_elements=['item_id', 'craft_city', 'sell_city'], 
                set_=update_dict
            )
            
            db.execute(stmt)
            
        db.commit()
    
    db.close()
    logging.info("Sync complete.")

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    process_and_store_items()