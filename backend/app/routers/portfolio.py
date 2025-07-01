from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.schemas.portfolio import Portfolio, PortfolioCreate, Asset, AssetCreate
from app.auth import get_current_user
from datetime import datetime
import yfinance as yf


router = APIRouter(
    prefix="/portfolio",
    tags=["Portfolio"]
)

# Restituisce il portafoglio dell'utente autenticato includendo il prezzo corrente degli asset
@router.get("/me", response_model=Portfolio)
def get_my_portfolio(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    portfolio = db.query(models.Portfolio).filter(models.Portfolio.user_id == current_user.id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio non trovato")

    # Aggiunta dinamica del campo current_price tramite yfinance
    for asset in portfolio.assets:
        try:
            ticker = yf.Ticker(asset.symbol)
            data = ticker.history(period="1d")
            asset.current_price = round(data["Close"][-1], 2) if not data.empty else 0.0
        except Exception as e:
            print(f"Errore su {asset.symbol}: {e}")
            asset.current_price = 0.0

    return portfolio



# Aggiunge un asset al portafoglio (effettua merge se già presente)
@router.post("/asset", response_model=Asset)
def add_asset(
    asset: AssetCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    portfolio = db.query(models.Portfolio).filter(models.Portfolio.user_id == current_user.id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio non trovato")

    existing_asset = db.query(models.Asset).filter_by(
        portfolio_id=portfolio.id,
        symbol=asset.symbol
    ).first()

    if existing_asset:
        total_quantity = existing_asset.quantity + asset.quantity
        weighted_price = (
            (existing_asset.quantity * existing_asset.purchase_price) +
            (asset.quantity * asset.purchase_price)
        ) / total_quantity

        existing_asset.quantity = total_quantity
        existing_asset.purchase_price = weighted_price
        existing_asset.purchase_date = asset.purchase_date

        db.commit()
        db.refresh(existing_asset)
        return existing_asset

    new_asset = models.Asset(**asset.dict(), portfolio_id=portfolio.id)
    db.add(new_asset)
    db.commit()
    db.refresh(new_asset)
    return new_asset


# Aggiorna le informazioni di un asset
@router.put("/asset/{asset_id}", response_model=Asset)
def update_asset(
    asset_id: int,
    updated_asset: AssetCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    asset = db.query(models.Asset).join(models.Portfolio).filter(
        models.Asset.id == asset_id,
        models.Portfolio.user_id == current_user.id
    ).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset non trovato")

    for field, value in updated_asset.dict().items():
        setattr(asset, field, value)

    db.commit()
    db.refresh(asset)
    return asset


@router.delete("/asset/{asset_id}")
def delete_asset(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    print(f"🗑️ Richiesta DELETE per asset_id: {asset_id} da utente: {current_user.id}")

    asset = db.query(models.Asset).join(models.Portfolio).filter(
        models.Asset.id == asset_id,
        models.Portfolio.user_id == current_user.id
    ).first()

    if not asset:
        print("❌ Asset non trovato o non autorizzato")
        raise HTTPException(status_code=404, detail="Asset non trovato")

    print(f"✅ Eliminazione asset: {asset.symbol} (ID: {asset.id})")
    db.delete(asset)
    db.commit()
    return {"message": "Asset eliminato con successo"}



# Calcola il bilancio complessivo del portafoglio
@router.get("/me/balance")
def get_portfolio_balance(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    portfolio = db.query(models.Portfolio).filter(models.Portfolio.user_id == current_user.id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio non trovato")

    total_invested = sum(asset.quantity * asset.purchase_price for asset in portfolio.assets)

    return {
        "total_invested": round(total_invested, 2),
        "asset_count": len(portfolio.assets),
        "last_updated": datetime.utcnow()
    }

# Restituisce la performance del portafoglio tramite yfinance
@router.get("/me/performance")
def get_portfolio_performance(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    portfolio = db.query(models.Portfolio).filter(models.Portfolio.user_id == current_user.id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio non trovato")
    
    # Forza il refresh dal database
    db.refresh(portfolio)

    result = []

    for asset in portfolio.assets:
        try:
            ticker = yf.Ticker(asset.symbol)
            data = ticker.history(period="1d")
            current_price = data["Close"].iloc[-1]
        except Exception:
            current_price = None

        if current_price:
            profit_loss = (current_price - asset.purchase_price) * asset.quantity
            performance_percent = ((current_price - asset.purchase_price) / asset.purchase_price) * 100

            result.append({
                "symbol": asset.symbol,
                "quantity": asset.quantity,
                "purchase_price": asset.purchase_price,
                "current_price": round(current_price, 2),
                "profit_loss": round(profit_loss, 2),
                "performance_percent": round(performance_percent, 2),
                "id": asset.id,
                "purchase_date": asset.purchase_date.isoformat() if asset.purchase_date else None
            })

        else:
            result.append({
                "symbol": asset.symbol,
                "error": "Dati non disponibili",
                "id": asset.id
            })

    return result


# Restituisce statistiche aggregate del portafoglio
@router.get("/stats")
def get_portfolio_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    portfolio = db.query(models.Portfolio).filter(models.Portfolio.user_id == current_user.id).first()

    if not portfolio:
        raise HTTPException(status_code=404, detail="Portafoglio non trovato")

    stats = {
        "total_invested": 0.0,
        "current_value": 0.0,
        "total_profit_loss": 0.0,
        "average_performance_percent": 0.0,
        "number_of_assets": 0
    }

    assets = portfolio.assets
    if not assets:
        return stats  # Portafoglio vuoto

    total_percent = 0.0

    for asset in assets:
        try:
            ticker = yf.Ticker(asset.symbol)
            current_price = ticker.info.get("regularMarketPrice")
        except Exception:
            current_price = None

        if current_price is None:
            continue

        invested = asset.quantity * asset.purchase_price
        current = asset.quantity * current_price
        profit = current - invested
        performance_percent = ((profit) / invested) * 100 if invested > 0 else 0

        stats["total_invested"] += invested
        stats["current_value"] += current
        stats["total_profit_loss"] += profit
        total_percent += performance_percent

    stats["number_of_assets"] = len(assets)
    stats["average_performance_percent"] = round(total_percent / stats["number_of_assets"], 2)

    # Arrotondamento finale
    stats["total_invested"] = round(stats["total_invested"], 2)
    stats["current_value"] = round(stats["current_value"], 2)
    stats["total_profit_loss"] = round(stats["total_profit_loss"], 2)

    return stats


# Andamento giornaliero dell'asset con la migliore performance
@router.get("/top-asset/history")
def get_top_asset_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    portfolio = db.query(models.Portfolio).filter(models.Portfolio.user_id == current_user.id).first()

    if not portfolio or not portfolio.assets:
        raise HTTPException(status_code=404, detail="Nessun asset trovato")

    best_asset = None
    best_performance = float('-inf')

    for asset in portfolio.assets:
        try:
            ticker = yf.Ticker(asset.symbol)
            price = ticker.info.get("regularMarketPrice")
            if price and asset.purchase_price > 0:
                perf = ((price - asset.purchase_price) / asset.purchase_price) * 100
                if perf > best_performance:
                    best_performance = perf
                    best_asset = asset
        except Exception:
            continue

    if not best_asset:
        raise HTTPException(status_code=404, detail="Impossibile determinare l'asset migliore")

    # Prendi gli ultimi 7 giorni di dati
    try:
        ticker = yf.Ticker(best_asset.symbol)
        hist = ticker.history(period="7d")["Close"]
        history = [
            {"date": str(date.date()), "price": round(price, 2)}
            for date, price in hist.items()
        ]
    except Exception:
        history = []

    return {
        "symbol": best_asset.symbol,
        "history": history
    }


# Andamento giornaliero dell'asset con la peggiore performance
@router.get("/worst-asset/history")
def get_worst_asset_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    portfolio = db.query(models.Portfolio).filter(models.Portfolio.user_id == current_user.id).first()

    if not portfolio or not portfolio.assets:
        raise HTTPException(status_code=404, detail="Nessun asset trovato")

    worst_asset = None
    worst_performance = float('inf')

    for asset in portfolio.assets:
        try:
            ticker = yf.Ticker(asset.symbol)
            price = ticker.info.get("regularMarketPrice")
            if price and asset.purchase_price > 0:
                perf = ((price - asset.purchase_price) / asset.purchase_price) * 100
                if perf < worst_performance:
                    worst_performance = perf
                    worst_asset = asset
        except Exception:
            continue

    if not worst_asset:
        raise HTTPException(status_code=404, detail="Impossibile determinare l'asset peggiore")

    try:
        ticker = yf.Ticker(worst_asset.symbol)
        hist = ticker.history(period="7d")["Close"]
        history = [
            {"date": str(date.date()), "price": round(price, 2)}
            for date, price in hist.items()
        ]
    except Exception:
        history = []

    return {
        "symbol": worst_asset.symbol,
        "history": history
    }

# Suggerimenti di acquisto o vendita basati sull'andamento settimanale
@router.get("/alerts")
def get_alerts(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    portfolio = db.query(models.Portfolio).filter(models.Portfolio.user_id == current_user.id).first()
    if not portfolio or not portfolio.assets:
        return []

    alerts = []

    for asset in portfolio.assets:
        try:
            ticker = yf.Ticker(asset.symbol)
            history = ticker.history(period="7d")["Close"]

            if len(history) >= 2:
                first_price = history[0]
                last_price = history[-1]
                change_percent = ((last_price - first_price) / first_price) * 100

                if change_percent >= 5:
                    alerts.append({
                        "type": "buy",
                        "symbol": asset.symbol,
                        "change_percent": round(change_percent, 2),
                        "reason": f"Trend positivo negli ultimi 7 giorni (+{round(change_percent, 2)}%)"
                    })
                elif change_percent <= -10:
                    alerts.append({
                        "type": "sell",
                        "symbol": asset.symbol,
                        "change_percent": round(change_percent, 2),
                        "reason": f"Andamento negativo prolungato (-{round(change_percent, 2)}%)"
                    })
        except Exception as e:
            print(f"Errore su {asset.symbol}: {e}")

    return alerts

