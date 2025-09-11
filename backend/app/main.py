from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users
from app.routers import portfolio
from app.routers import suggested  
from app.auth import router as auth_router
from app.database import engine

app = FastAPI(
    title="FinPilot API",
    description="API per la gestione di utenti e simulazioni finanziarie",
    version="1.0.0"
)

# Configurazione CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusione dei router applicativi
app.include_router(users.router)        # Rotte relative agli utenti
app.include_router(auth_router)         # Rotte di autenticazione
app.include_router(portfolio.router)    # Rotte relative al portafoglio
app.include_router(suggested.router)    # Rotte per gli asset suggeriti

# Rotta di default dell'applicazione
@app.get("/")
def read_root():
    return {"message": "Benvenuto su FinPilot!"}
