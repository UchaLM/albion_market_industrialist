import os
import time
import json
import requests

BATCH_SIZE = 200 
LANGUAGE = "EN-US" 
NO_RRR = ["_JOURNAL_", "MOUNT", "HORSE", "OX", "STAG", "FURNITURE"]
RESOURCE_FAME = {4: 22.5, 5: 90, 6: 270, 7: 645, 8: 1350}
JOURNAL_FAME = {4: 900, 5: 1800, 6: 3600, 7: 7200, 8: 14400}

CRAFT_CITIES = ["Caerleon", "Bridgewatch", "Fort Sterling", "Lymhurst", "Martlock", "Thetford", "Brecilien"]
SELL_CITIES = ["Caerleon", "Black Market", "Bridgewatch", "Fort Sterling", "Lymhurst", "Martlock", "Thetford", "Brecilien", "Arthurs Rest", "Merlyns Rest", "Morganas Rest"]

DB_FILE = "data/recipes_v31.json"
NAMES_URL = "https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master/formatted/items.json"

def load_recipes():
    with open(DB_FILE, 'r', encoding='utf-8') as f: return json.load(f)

def get_official_names():
    try:
        r = requests.get(NAMES_URL).json()
        name_map = {}
        for item in r:
            uid = item.get('UniqueName')
            loc = item.get('LocalizedNames')
            if uid: 
                name_map[uid] = {
                    "en": loc.get('EN-US', uid) if isinstance(loc, dict) else uid,
                    "es": loc.get('ES-ES', uid) if isinstance(loc, dict) else uid
                }
        return name_map
    except: return {}

def fetch_market_data(items, target_cities):
    prices, volumes = {}, {}
    cities_str = ",".join(target_cities)
    
    for i in range(0, len(items), BATCH_SIZE):
        chunk_str = ','.join(items[i:i+BATCH_SIZE])
        
        try:
            rp = requests.get(f"https://www.albion-online-data.com/api/v2/stats/prices/{chunk_str}?locations={cities_str}")
            if rp.status_code == 200:
                for d in rp.json():
                    iid = d['item_id']
                    city = d['city']
                    
                    if iid not in prices: 
                        prices[iid] = {"sell_offers": {}, "buy_offers": {}}
                        
                    sell_price = d['sell_price_min']
                    buy_price = d['buy_price_max']
                    
                    if sell_price > 0:
                        current_sell = prices[iid]["sell_offers"].get(city, float('inf'))
                        if sell_price < current_sell:
                            prices[iid]["sell_offers"][city] = sell_price

                            if "sell_price_min_date" not in prices[iid]:
                                prices[iid]["sell_price_min_date"] = {}
                            prices[iid]["sell_price_min_date"][city] = d.get('sell_price_min_date', "Old")
                            
                    if buy_price > 0:
                        current_buy = prices[iid]["buy_offers"].get(city, 0)
                        if buy_price > current_buy:
                            prices[iid]["buy_offers"][city] = buy_price
        except: 
            pass
            
        try:
            rh = requests.get(f"https://www.albion-online-data.com/api/v2/stats/history/{chunk_str}?locations={cities_str}&time-scale=24&qualities=1")
            if rh.status_code == 200:
                for entry in rh.json():
                    iid = entry['item_id']
                    if iid not in volumes: volumes[iid] = {}
                    hist = entry.get('data', [])
                    if hist: volumes[iid][entry['location']] = sum(p['item_count'] for p in hist) / len(hist)
        except: 
            pass
            
        time.sleep(0.05)
        
    return prices, volumes

def get_val(d, k):
    for key, v in d.items():
        if k in key.lower(): return v
    return None

def is_refinable_resource(item_id):
    return any(x in str(item_id).upper() for x in ["_PLANKS", "_METALBAR", "_LEATHER", "_CLOTH", "_STONEBLOCK"])

def resolve_ingredient(base_id, target_enchant):
    ALWAYS_FLAT = ["ARTIFACT", "ARTEFACT", "HEART", "SIGIL", "RUNE", "SOUL", "RELIC", "CREST", "JOURNAL", "MILK", "FLOUR", "BUTTER", "FISHSAUCE", "FACTION", "TOKEN"]
    if target_enchant == 0 or any(x in str(base_id).upper() for x in ALWAYS_FLAT): return base_id
    if is_refinable_resource(base_id): return f"{base_id}_LEVEL{target_enchant}@{target_enchant}"
    if "@" not in base_id: return f"{base_id}@{target_enchant}"
    return base_id

def get_bonus_city(item_id):
    i = item_id.upper()
    if any(x in i for x in ["_AXE", "_QUARTERSTAFF", "_FROSTSTAFF", "_SHOES_PLATE", "_OFF_"]): return "Martlock"
    if any(x in i for x in ["_MACE", "_NATURESTAFF", "_FIRESTAFF", "_ARMOR_LEATHER", "_HEAD_CLOTH"]): return "Thetford"
    if any(x in i for x in ["_HAMMER", "_SPEAR", "_HOLYSTAFF", "_HEAD_PLATE", "_ARMOR_CLOTH"]): return "Fort Sterling"
    if any(x in i for x in ["_SWORD", "_BOW", "_ARCANESTAFF", "_HEAD_LEATHER", "_SHOES_LEATHER"]): return "Lymhurst"
    if any(x in i for x in ["_CROSSBOW", "_DAGGER", "_CURSEDSTAFF", "_ARMOR_PLATE", "_SHOES_CLOTH"]): return "Bridgewatch"
    if any(x in i for x in ["_TOOL_", "_GATHERER_", "_MEAL_", "_POTION_"]): return "Caerleon"
    if any(x in i for x in ["_CAPE", "_BAG"]): return "Brecilien"
    return ""

def get_enchant_amount(item_id):
    i = item_id.upper()
    if any(x in i for x in ["_HEAD", "_SHOES", "_OFF_", "_CAPE"]): return 96
    if any(x in i for x in ["_ARMOR_", "_BAG", "_BACKPACK_"]): return 192
    if "_2H_" in i: return 384
    return 288 

def get_journal_info(item_id):
    i = item_id.upper()
    if any(x in i for x in ["_MEAL_", "_POTION_", "FISHSAUCE", "MOUNT", "HORSE", "OX", "STAG", "FURNITURE"]): return None, "---"
    if any(x in i for x in ["_BAG", "_CAPE", "_BACKPACK_", "_TOOL_", "_GATHERER_"]): return "TOOLMAKER", "TNK"
    if any(x in i for x in ["_FIRESTAFF", "_HOLYSTAFF", "_ARCANESTAFF", "_FROSTSTAFF", "_CURSEDSTAFF", "_TOME", "_CLOTH", "_ORB", "_DEMONSKULL", "_TOTEM", "_CHALICE", "_BOOK"]): return "MAGE", "IMB"
    if any(x in i for x in ["_BOW", "_SPEAR", "_NATURESTAFF", "_DAGGER", "_QUARTERSTAFF", "_TORCH", "_LEATHER", "_HORN"]): return "HUNTER", "FLT"
    if any(x in i for x in ["_SWORD", "_AXE", "_MACE", "_HAMMER", "_CROSSBOW", "_SHIELD", "_PLATE"]): return "WARRIOR", "BLK"
    return "WARRIOR", "BLK"

def generate_target_items(recipes_db, max_tier=8):
    targets = []
    EXCLUDE_KEYWORDS = [
        "_WOOD", "_ORE", "_FIBER", "_HIDE", "_ROCK", "_PLANKS", "_METALBAR", "_CLOTH", 
        "_LEATHER", "_STONEBLOCK", "_RUNE", "_SOUL", "_RELIC", "_JOURNAL_", "_EMPTY", "_FULL", 
        "TRASH", "_ESSENCE", "_ARTEFACT", "_ARTIFACT", "TOKEN", "MAP", "_TROPHY", "_FISH", 
        "SHARK", "SALMON", "EEL", "CRAB", "CARP", "LOACH", "RAY", "CLAM", "SQUID", "SNAPPER", 
        "TREASURE", "_SEED", "_FARM", "_MEAT", "_BUTTER", "MILK", "EGG", "BREAD", "FLOUR", "ALCOHOL", 
        "POTION_TRIAL", "FISHSAUCE", "EVENT", "ARENA", "MOUNT", "HORSE", "OX", "STAG", "FURNITURE", 
        "CREST", "EXTRACT", "REMAINS"
    ]
    
    for item_id in recipes_db.keys():
        if not item_id.startswith("T"): continue
        if any(kw in item_id.upper() for kw in EXCLUDE_KEYWORDS): continue
            
        try:
            tier = int(item_id.split('_')[0].replace('T', ''))
            if tier <= max_tier or "CAPEITEM" in item_id.upper(): targets.append(item_id)
        except ValueError: pass
    return targets