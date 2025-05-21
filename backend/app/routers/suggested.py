from fastapi import APIRouter
from typing import List
import yfinance as yf
from sklearn.linear_model import LinearRegression
import numpy as np

from app.schemas.suggested import SuggestedAsset  # importa lo schema

router = APIRouter()

@router.get("/suggested-assets", response_model=List[SuggestedAsset])
def get_suggested_assets():
    symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"]
    asset_data = []

    for symbol in symbols:
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period="3mo")
            if hist.empty:
                continue

            hist = hist.reset_index()
            hist['Date_ordinal'] = hist['Date'].map(lambda x: x.toordinal())

            X = hist[['Date_ordinal']]
            y = hist['Close']
            model = LinearRegression().fit(X, y)

            future_day = hist['Date_ordinal'].max() + 30
            predicted_price = model.predict([[future_day]])[0]
            current_price = y.iloc[-1]
            forecast_growth = ((predicted_price - current_price) / current_price) * 100

            asset_data.append({
                "symbol": symbol,
                "name": ticker.info.get("shortName", symbol),
                "price": round(current_price, 2),
                "change_percent": round((y.iloc[-1] - y.iloc[-2]) / y.iloc[-2] * 100, 2),
                "forecast_growth": round(forecast_growth, 2),
                "recommended": False  # verrà aggiornato sotto
            })
        except Exception as e:
            print(f"Errore per {symbol}: {e}")
            continue

    if asset_data:
        best = max(asset_data, key=lambda x: x['forecast_growth'])
        for asset in asset_data:
            asset['recommended'] = (asset == best)

    return asset_data
