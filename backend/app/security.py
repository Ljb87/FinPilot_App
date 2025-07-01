"""Funzioni di hashing e verifica delle password."""

import bcrypt

def hash_password(password: str) -> str:
    """Restituisce l'hash della password usando bcrypt."""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """Confronta una password in chiaro con il relativo hash."""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))
