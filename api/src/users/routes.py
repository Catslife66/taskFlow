from fastapi import APIRouter, Cookie, Depends, Response
from sqlmodel import Session

from .dependencies import get_current_user
from .schemas import UserInSchema, UserOutSchema
from .services import register_user, authenticate_user, create_session, revoke_session
from src.core.config import SESSION_COOKIE_NAME, COOKIE_SECURE, COOKIE_SAMESITE
from src.db.models import User
from src.db.session import get_session


router = APIRouter()

@router.post("/register", response_model=UserOutSchema)
def register(payload: UserInSchema, session: Session = Depends(get_session)):
    return register_user(payload, session)
   

@router.post("/login")
def login(
        payload: UserInSchema,
        response: Response,
        session: Session = Depends(get_session),
    ):
    user = authenticate_user(payload, session)
    sess = create_session(user.id, session)

    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=str(sess.id),
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE, 
        path="/",
    )
    return {"ok": True}


@router.post('/logout')
def logout(
        response:Response, 
        session_id: str | None = Cookie(default=None, alias=SESSION_COOKIE_NAME),
        session: Session = Depends(get_session), 
    ):
    if session_id:
        revoke_session(session_id, session)
    response.delete_cookie(key=SESSION_COOKIE_NAME, path="/")
    return {"ok": True}


@router.get("/me", response_model=UserOutSchema)
def me(user: User = Depends(get_current_user)):
    return UserOutSchema(id=str(user.id), email=user.email)