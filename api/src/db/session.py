from sqlmodel import Session, SQLModel, create_engine
from decouple import config as decouple_config


database_url = decouple_config("DATABASE_URL")
if not database_url:
    raise RuntimeError("Database url is not set.")

engine = create_engine(database_url, echo=True)

def get_session():
    with Session(engine) as session:
        yield session