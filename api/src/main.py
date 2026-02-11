from fastapi import FastAPI

from src.users.routes import router as users_router
from src.tasks.routes import router as tasks_router


app = FastAPI()

app.include_router(users_router, prefix="/api/auth", tags=["users"])
app.include_router(tasks_router, prefix="/api/tasks", tags=["tasks"])

@app.get("/health")
def read_root():
    return {"ok": True}