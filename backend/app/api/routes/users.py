from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies.auth import get_current_user
from app.db.dependencies import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse

router = APIRouter(prefix='/users', tags=['Users'])

@router.post('/', response_model=UserResponse, status_code=201)
def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail='Email ja cadastrado')
    
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=user_data.password,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.get('/me', response_model=UserResponse)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user