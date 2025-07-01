"""Configurazione della connessione e delle sessioni SQLAlchemy."""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()

# Genera una sessione per le operazioni con il database

def get_db():
    """Fornisce una sessione di database e ne assicura la chiusura."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
