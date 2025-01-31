from sqlmodel import SQLModel, Field

class Expert(SQLModel, table=True):
    nickname: str = Field(primary_key=True)