from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, status
from sqlmodel import Session, select


from .schemas import UserInSchema
from src.core.config import SESSION_TTL_SECONDS
from src.core.exceptions import USER_NOT_FOUND_ERR, USER_CONFLICT_ERR, USER_UNAUTH_ERR
from src.core.security import get_password_hash, verify_password
from src.db.session import get_session
from src.db.models import User, Session as UserSession


def register_user(payload: UserInSchema, session: Session = Depends(get_session)) -> User:
    existing = session.exec(select(User).where(User.email == payload.email)).one_or_none()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=USER_CONFLICT_ERR)
    user = User(email=payload.email, password_hash=get_password_hash(payload.password))
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


def create_session(user_id: str, session: Session = Depends(get_session)) -> UserSession:
    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(seconds=SESSION_TTL_SECONDS)

    sess = UserSession(user_id=user_id, created_at=now, expires_at=expires_at, revoked_at=None)
    session.add(sess)
    session.commit()
    session.refresh(sess)
    return sess


def revoke_session(session_id: str, session: Session = Depends(get_session)) -> None:
    sess = session.exec(select(UserSession).where(UserSession.id == session_id)).one_or_none()
    if not sess:
        return
    sess.revoked_at = datetime.now(timezone.utc)
    session.commit()