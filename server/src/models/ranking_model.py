from sqlmodel import SQLModel, Field, Column, JSON

class RankingModel(SQLModel, table=True):
    id: int|None = Field(primary_key=True, default=None)

    title: str
    author: str

    criteria: list[str] = Field(sa_type=JSON)
    alternatives: list[str] = Field(sa_type=JSON)
    scale: list[float] = Field(sa_type=JSON)