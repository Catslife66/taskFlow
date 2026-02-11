from datetime import datetime
from typing import Optional
import uuid
from sqlmodel import Field, SQLModel

from src.db.models import Priority, Status


class TaskBaseSchema(SQLModel):
    title: str
    status: Status = Field(default=Status.TODO)
    priority: Priority = Field(default=Priority.MEDIUM)
    due_datetime: Optional[datetime] = None


class TaskInSchema(TaskBaseSchema):
    pass


class TaskUpdateSchema(SQLModel):
    title: Optional[str] = None
    status: Optional[Status] = None
    priority: Optional[Priority] = None
    due_datetime: Optional[datetime] = None


class TaskOutSchema(TaskBaseSchema):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

