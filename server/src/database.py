from sqlmodel import SQLModel, create_engine, Session
from typing import Annotated
from fastapi import Depends


DATABASE_PATH = "./database/database.db"
DATABASE_URI = f"sqlite:///{DATABASE_PATH}"

connect_args = {"check_same_thread": False}
engine = create_engine(DATABASE_URI, echo=True, connect_args=connect_args)

def get_session():
    with Session(engine) as session:
        yield session

def init_db():
    SQLModel.metadata.create_all(engine)

SessionDep = Annotated[Session, Depends(get_session)]