from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)

    # 👇 Relazione uno-a-uno con Portfolio
    portfolio = relationship("Portfolio", back_populates="user", uselist=False)


class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, default="Portafoglio principale")
    created_at = Column(DateTime, default=datetime.utcnow)

    # 👇 Relazioni
    user = relationship("User", back_populates="portfolio")
    assets = relationship("Asset", back_populates="portfolio", cascade="all, delete-orphan")


class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    portfolio_id = Column(Integer, ForeignKey("portfolios.id"), nullable=False)
    asset_type = Column(String, nullable=False)   # es: "stock", "crypto", "etf"
    symbol = Column(String, nullable=False)       # es: "AAPL", "BTC", "VWCE"
    quantity = Column(Float, nullable=False)
    purchase_price = Column(Float, nullable=False)
    purchase_date = Column(DateTime, nullable=False)

    # 👇 Relazione con Portfolio
    portfolio = relationship("Portfolio", back_populates="assets")
