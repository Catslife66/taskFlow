from datetime import datetime, timezone
from fastapi import Cookie, Depends, HTTPException, status
from sqlmodel import Session, select

from src.core.config import SESSION_COOKIE_NAME
from src.core.exceptions import NO_SESSION_ERR, INVALID_SESSION_ERR, USER_NOT_FOUND_ERR, EXPIRE_SESSION_ERR
from src.db.session import get_session
from src.db.models import User, Session as UserSession


def get_current_user(
    session_id: str | None = Cookie(default=None, alias=SESSION_COOKIE_NAME),
    session: Session = Depends(get_session),
) -> User:
    if not session_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=NO_SESSION_ERR)

    sess = session.execute(select(UserSession).where(UserSession.id == session_id)).scalar_one_or_none()
    if not sess:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=INVALID_SESSION_ERR)

    now = datetime.now(timezone.utc)
    if sess.revoked_at is not None or sess.expires_at <= now:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=EXPIRE_SESSION_ERR)

    user = session.get(User, sess.user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=USER_NOT_FOUND_ERR)

    return user