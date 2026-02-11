from fastapi import Depends, HTTPException, Query, status
from typing import Optional
from sqlmodel import Session, select

from .schemas import TaskInSchema, TaskUpdateSchema
from src.core.exceptions import TASK_NOT_FOUND_ERR
from src.db.session import get_session
from src.db.models import User, Task, Priority, Status
from src.users.dependencies import get_current_user


def create_task(
    payload: TaskInSchema, 
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)
) -> Task:
    task = Task(
        user_id=user.id,
        **payload.model_dump()
    )
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


def get_tasks(
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user), 
    status: Optional[str] = None,
    priority: Optional[str] = None,
    limit: int = 20,
    offset: int = 0,
) -> list[Task]: 
    query = select(Task).where(Task.user_id == user.id)

    if status:
        query = query.where(Task.status == status.upper())

    if priority:
        query = query.where(Task.priority == priority.upper())

    query = (
        query.order_by(Task.created_at.desc())
             .limit(limit)
             .offset(offset)
    )

    tasks = session.exec(query).all()
    return list(tasks)


def _get_users_task_or_404(
    task_id: str,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user), 
) -> Task:
    task = session.exec(
        select(Task)
        .where(Task.id == task_id, Task.user_id == user.id)
    ).one_or_none()

    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=TASK_NOT_FOUND_ERR)
    return task


def update_task(
    task_id:str, 
    payload:TaskUpdateSchema, 
    session: Session=Depends(get_session), 
    user: User = Depends(get_current_user)
) -> Task:
    task = _get_users_task_or_404(task_id, session, user)

    if payload.title is not None:
        task.title = payload.title
    if payload.status is not None:
        task.status = payload.status
    if payload.priority is not None:
        task.priority = payload.priority
    if payload.due_datetime is not None:
        task.due_datetime = payload.due_datetime

    session.commit()
    session.refresh(task)
    return task


def delete_task(
    task_id: str, 
    session: Session = Depends(get_session), 
    user: User = Depends(get_current_user)
) -> None:
    task = _get_users_task_or_404(task_id, session, user)
    session.delete(task)
    session.commit()