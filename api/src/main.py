from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from src.core.config import ALLOW_ORIGINS
from src.core.exceptions import http_exception_handler, validation_exception_handler, unhandled_exception_handler
from src.users.routes import router as users_router
from src.tasks.routes import router as tasks_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router, prefix="/api/auth", tags=["users"])
app.include_router(tasks_router, prefix="/api/tasks", tags=["tasks"])

app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)

@app.get("/health")
def read_root():
    return {"ok": True}