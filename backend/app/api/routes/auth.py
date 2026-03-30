from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import verify_password
from app.db.dependencies import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, LoginResponse

router = APIRouter(prefix='/auth', tags=['Auth'])


@router.post('/login', response_model=LoginResponse)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()

    if not user:
        raise HTTPException(status_code=401, detail='Email ou password invalido')
    
    if not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail='Email ou password invalido')
    
    return LoginResponse(
        message='Login efetuado com sucesso',
        user_id=user.id,
        name=user.name,
        email=user.email,
    )