from sqlmodel import SQLModel, Field, JSON, Column


class Mock(SQLModel, table=True):
    id: int|None = Field(primary_key=True, default=None)
    body: dict = Field(sa_column=Column(JSON))