from sqlalchemy import Column, String, Float, Integer
from database import Base

class CraftingOpportunity(Base):
    __tablename__ = "crafting_opportunities"
    
    item_id = Column(String, primary_key=True)
    craft_city = Column(String, primary_key=True)
    sell_city = Column(String, primary_key=True)
    item_name_en = Column(String)
    item_name_es = Column(String)
    tier = Column(Integer)
    method = Column(String)
    journal = Column(String)
    item_sell_price = Column(Float)
    returnable_cost_sell = Column(Float)
    non_returnable_cost_sell = Column(Float)
    returnable_cost_buy = Column(Float)
    non_returnable_cost_buy = Column(Float)
    journal_profit = Column(Float)
    item_value = Column(Float)
    volume = Column(Float)
    updated_at = Column(String, nullable=True)

class FlippingOpportunity(Base):
    __tablename__ = "flipping_opportunities"
    
    item_id = Column(String, primary_key=True)
    buy_city = Column(String, primary_key=True)
    sell_city = Column(String, primary_key=True)
    item_name_en = Column(String)
    item_name_es = Column(String)
    tier = Column(Integer)
    buy_price = Column(Float)
    sell_price_min = Column(Float) # Para órdenes de venta
    buy_price_max = Column(Float)  # Para venta directa
    volume = Column(Float)
    updated_at = Column(String, nullable=True)