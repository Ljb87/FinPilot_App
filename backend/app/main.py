from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users
from app.routers import portfolio
from app.routers import suggested   # ✅ Aggiunto router suggeriti
from app.auth import router as auth_router
from app.database import engine

app = FastAPI(
    title="FinPilot API",
    description="API per la gestione di utenti e simulazioni finanziarie",
    version="1.0.0"
)

# ✅ CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In produzione: metti ["http://localhost:8081"] o dominio reale
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🚀 Inclusione dei router
app.include_router(users.router)        # 👤 Rotte utenti
app.include_router(auth_router)         # 🔐 Rotte autenticazione
app.include_router(portfolio.router)    # 💼 Rotte portfolio
app.include_router(suggested.router)    # 🌟 Rotte asset suggeriti

# 🌍 Rotta base
@app.get("/")
def read_root():
    return {"message": "Benvenuto su FinPilot!"}
