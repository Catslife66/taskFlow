from fastapi import APIRouter, Depends, Query, status
from typing import Optional
from sqlmodel import Session

from src.users.dependencies import get_current_user
from .schemas import PaginatedTaskResponse, TaskInSchema, TaskOutSchema, TaskUpdateSchema
from .services import create_task, update_task, delete_task, get_tasks
from src.db.models import User
from src.db.session import get_session


router = APIRouter()


@router.get("", response_model=PaginatedTaskResponse)
def list_my_tasks(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    tasks = get_tasks(session, user, status, priority, limit, offset)
    return tasks


@router.post("", response_model=TaskOutSchema)
def create_my_task(
    payload: TaskInSchema, 
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    task = create_task(payload, session, user)
    return task


@router.patch("/{task_id}", response_model=TaskOutSchema)
def update_my_task(
    task_id: str,
    payload: TaskUpdateSchema, 
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user)
):
    task = update_task(task_id, payload, session, user)
    return task
    

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_my_task(
    task_id: str, 
    session: Session = Depends(get_session), 
    user: User = Depends(get_current_user)
):
    delete_task(task_id, session, user)
    return None