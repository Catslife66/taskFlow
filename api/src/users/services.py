from uuid import uuid4
from src.db.redis import get_redis
from fastapi import Cookie, Depends, HTTPException, status
from sqlmodel import Session, select

from .schemas import UserInSchema
from src.core.config import SESSION_COOKIE_NAME, SESSION_TTL_SECONDS
from src.core.exceptions import USER_NOT_FOUND_ERR, USER_CONFLICT_ERR, USER_UNAUTH_ERR, NO_SESSION_ERR, INVALID_SESSION_ERR, EXPIRE_SESSION_ERR
from src.core.security import make_password_hash, verify_password
from src.db.session import get_session
from src.db.models import User


def register_user(payload: UserInSchema, session: Session = Depends(get_session)) -> User:
    existing = session.exec(select(User).where(User.email == payload.email)).one_or_none()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=USER_CONFLICT_ERR)
    user = User(email=payload.email, password_hash=make_password_hash(payload.password))
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

def authenticate_user(payload: UserInSchema, session: Session = Depends(get_session)) -> User | None:
    user = session.exec(select(User).where(User.email == payload.email)).one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=USER_NOT_FOUND_ERR)
    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=USER_UNAUTH_ERR)
    return user

def _session_key(session_id:str) -> str:
    return f"session:{session_id}"

def _user_sessions_key(user_id: str) -> str:
    return f"user_sessions:{user_id}"

def create_session(user_id: str) -> str:
    r = get_redis()
    session_id = str(uuid4())
    r.setex(_session_key(session_id), SESSION_TTL_SECONDS, user_id)
    r.sadd(_user_sessions_key(user_id), session_id)
    return session_id

def revoke_session(session_id: str) -> None:
    r = get_redis()
    user_id = r.get(_session_key(session_id))
    r.delete(_session_key(session_id))
    if user_id:
        r.srem(_user_sessions_key(user_id), session_id)

def revoke_all_sessions(user_id: str) -> None:
    r = get_redis()
    sess_ids = r.smembers(_user_sessions_key(user_id))
    for sess_id in sess_ids:
        r.delete(_session_key(sess_id))
    r.delete(_user_sessions_key(user_id))

def get_current_user(
    session_id: str | None = Cookie(default=None, alias=SESSION_COOKIE_NAME),
    session: Session = Depends(get_session),
) -> User:
    if not session_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=NO_SESSION_ERR)

    r = get_redis()
    user_id = r.get(_session_key(session_id))
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=INVALID_SESSION_ERR)
    
    user = session.exec(select(User).where(User.id == user_id)).one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=USER_NOT_FOUND_ERR)
    
    return user