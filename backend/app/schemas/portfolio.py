from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class AssetBase(BaseModel):
    asset_type: str
    symbol: str
    quantity: float
    purchase_price: float
    purchase_date: datetime

class AssetCreate(AssetBase):
    pass

class Asset(AssetBase):
    id: int
    portfolio_id: int
    current_price: float = 0.0  # ➕ Aggiunto per visualizzare il prezzo attuale

    class Config:
        from_attributes = True

class PortfolioBase(BaseModel):
    name: Optional[str] = "Portafoglio principale"

class PortfolioCreate(PortfolioBase):
    pass

class Portfolio(PortfolioBase):
    id: int
    user_id: int
    created_at: datetime
    assets: List[Asset] = []

    class Config:
        from_attributes = True
