from sqlalchemy import Column, Integer, String, Float, DateTime, UniqueConstraint
from database import Base

class CraftingOpportunity(Base):
    __tablename__ = "crafting_opportunities"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(String, index=True, nullable=False)
    item_name_en = Column(String, nullable=False)
    item_name_es = Column(String, nullable=False)
    tier = Column(Integer, nullable=False, index=True)
    
    craft_city = Column(String, nullable=False)
    sell_city = Column(String, nullable=False)
    method = Column(String, nullable=False)
    journal = Column(String, nullable=True)
    
    item_sell_price = Column(Float, nullable=False)
    returnable_cost_sell = Column(Float, nullable=False)
    non_returnable_cost_sell = Column(Float, nullable=False)
    returnable_cost_buy = Column(Float, nullable=False)
    non_returnable_cost_buy = Column(Float, nullable=False)
    journal_profit = Column(Float, default=0.0)
    item_value = Column(Float, nullable=False)
    volume = Column(Integer, default=0)
    updated_at = Column(String, nullable=True)

    __table_args__ = (UniqueConstraint('item_id', 'craft_city', 'sell_city', name='uix_item_route'),)

# --- NUEVA TABLA FLIPPER ---
class FlippingOpportunity(Base):
    __tablename__ = "flipping_opportunities"
    
    item_id = Column(String, primary_key=True)
    buy_city = Column(String, primary_key=True)
    sell_city = Column(String, primary_key=True)
    item_name_en = Column(String)
    item_name_es = Column(String)
    tier = Column(Integer)
    buy_price = Column(Float)
    sell_price_min = Column(Float) 
    buy_price_max = Column(Float)  
    volume = Column(Float)
    updated_at = Column(String, nullable=True)