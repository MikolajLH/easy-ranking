from sqlmodel import SQLModel, Field, Column, JSON

class FinishedRanking(SQLModel, table=True):
    id: int|None = Field(primary_key=True, default=None)

    title: str
    author: str

    criteria: list[str] = Field(sa_type=JSON)
    alternatives: list[str] = Field(sa_type=JSON)
    scale: list[float] = Field(sa_type=JSON)

    alternatives_pcms: list[list[list[list[float]]]] = Field(sa_type=JSON)
    criteria_pcms: list[list[list[float]]] = Field(sa_type=JSON)