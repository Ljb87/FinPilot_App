from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from pydantic import BaseModel, EmailStr
from typing import List

# 🔐 Sicurezza
from app.security import hash_password
from app.auth import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

# 📥 Schema per registrazione
class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str

# 📤 Schema per risposta pubblica
class UserOut(BaseModel):
    id: int
    email: EmailStr
    name: str

    class Config:
        from_attributes = True

# 🚀 Crea nuovo utente
@router.post("/", response_model=dict)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # controlla se l'utente esiste già
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email già registrata")

    # 🔐 Applica hashing
    hashed_pw = hash_password(user.password)

    new_user = models.User(
        email=user.email,
        name=user.name,
        hashed_password=hashed_pw
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": f"Utente {new_user.name} creato con successo"}

# 📋 Elenco utenti (per test)
@router.get("/", response_model=List[UserOut])
def get_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return users

# 👤 Rotta protetta per ottenere i propri dati
@router.get("/me", response_model=UserOut)
def read_current_user(current_user: models.User = Depends(get_current_user)):
    return current_user
