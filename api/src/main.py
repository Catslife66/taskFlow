from decouple import config as decouple_config
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.users.routes import router as users_router
from src.tasks.routes import router as tasks_router


app = FastAPI()

DEBUG = decouple_config("ENV", default='dev') == 'dev'
allow_origins=[]

if DEBUG:
    origins = decouple_config("ALLOW_ORIGINS", default="http://localhost:3000")
    allow_origins = origins.split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router, prefix="/api/auth", tags=["users"])
app.include_router(tasks_router, prefix="/api/tasks", tags=["tasks"])

@app.get("/health")
def read_root():
    return {"ok": True}