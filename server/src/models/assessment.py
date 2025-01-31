from sqlmodel import SQLModel, Field, Column, JSON

class CriteriaAssessment(SQLModel, table=True):
    expert_nickname: str = Field(foreign_key='expert.nickname', primary_key=True)
    ranking_id: int = Field(foreign_key='rankingmodel.id', primary_key=True)

    pcm: list[list[float]] = Field(sa_column=Column(JSON))


class AlternativesAssessment(SQLModel, table=True):
    expert_nickname: str = Field(foreign_key='expert.nickname', primary_key=True)
    ranking_id: int = Field(foreign_key='rankingmodel.id', primary_key=True)

    pcms: list[list[list[float]]] = Field(sa_column=Column(JSON))