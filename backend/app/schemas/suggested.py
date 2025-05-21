from pydantic import BaseModel

class SuggestedAsset(BaseModel):
    symbol: str
    name: str
    price: float
    change_percent: float
    forecast_growth: float
    recommended: bool
