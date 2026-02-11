import uuid
from pydantic import EmailStr, Field, AfterValidator
from sqlmodel import SQLModel
from typing_extensions import Annotated
from src.common.utils import check_password_strength


class UserInSchema(SQLModel):
    email: EmailStr = Field(unique=True, max_length=100)
    password: Annotated[str, AfterValidator(check_password_strength)]


class UserOutSchema(SQLModel):
    id: uuid.UUID
    email: EmailStr 
