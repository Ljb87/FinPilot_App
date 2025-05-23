from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.security import verify_password, hash_password
from pydantic import BaseModel, EmailStr

# 🔐 Configurazione token
SECRET_KEY = "supersegreto123"  # In produzione usa una ENV VAR!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# 📦 Router FastAPI dedicato all'autenticazione
router = APIRouter(prefix="/auth", tags=["Auth"])

# 🔑 Schema per protezione via header Authorization: Bearer <token>
oauth2_scheme = HTTPBearer()


# 🔐 Crea il token JWT
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# 🔎 Verifica la validità del token
def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


# 🔐 Login endpoint (genera token)
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenziali non valide")

    access_token = create_access_token(data={"sub": user.email})

    return {
        "access_token": access_token,
        "user": {
            "name": user.name,
            "email": user.email
        }
    }



# 🔐 Recupera l'utente loggato dal token
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Token non valido o scaduto",
            headers={"WWW-Authenticate": "Bearer"},
        )

    email = payload.get("sub")
    if email is None:
        raise HTTPException(status_code=401, detail="Token senza email")

    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="Utente non trovato")

    return user


# 🆕 Registrazione utente
class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email già registrata")

    hashed_pwd = hash_password(user.password)

    new_user = models.User(
        email=user.email,
        name=user.name,
        hashed_password=hashed_pwd
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    new_portfolio = models.Portfolio(
        user_id=new_user.id,
        name="Portafoglio principale",
        created_at=datetime.utcnow()
    )

    db.add(new_portfolio)
    db.commit()
    db.refresh(new_portfolio)

    return {
        "message": "Utente registrato con successo",
        "user_id": new_user.id
    }
