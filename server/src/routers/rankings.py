from fastapi import HTTPException, APIRouter
from sqlmodel import select, delete

from ..database import SessionDep
from ..models.ranking_model import RankingModel
from .assessments import delete_all_alternatives_assessments, delete_all_criteria_assessments, delete_alternatives_assessments, delete_criteria_assessments

router = APIRouter(
    prefix="/rankings",
    tags=['rankings']
)


@router.get("/",response_model=list[RankingModel])
def get_rankings(session: SessionDep):
    experts = session.exec(select(RankingModel)).all()
    return experts


@router.get("/{id}", response_model=RankingModel)
def get_ranking(id: int, session: SessionDep):
    db_ranking = session.get(RankingModel, id)
    if not db_ranking:
        raise HTTPException(status_code=404, detail="Ranking not found")
    return db_ranking


@router.get("/author/{nickname}", response_model=list[RankingModel])
def get_rankings_by_author(nickname: str, session: SessionDep):
    return session.exec(select(RankingModel).where(RankingModel.author == nickname)).all()


@router.post("/", response_model=RankingModel)
def create_ranking_model(new_ranking: RankingModel, session: SessionDep):
    db_ranking = RankingModel.model_validate(new_ranking)
    session.add(db_ranking)
    session.commit()
    session.refresh(db_ranking)
    return db_ranking


@router.delete("/")
def delete_rankings(session: SessionDep):
    session.exec(delete(RankingModel))
    session.commit()
    delete_all_alternatives_assessments(session)
    delete_all_criteria_assessments(session)
    return {"ok": True}


@router.delete("/{ranking_id}")
def delete_ranking(ranking_id: int, session: SessionDep):
    ranking_db = session.get(RankingModel, ranking_id)
    if not ranking_db:
        raise HTTPException(status_code=404, detail="Ranking not found")
    session.delete(ranking_db)
    session.commit()

    delete_alternatives_assessments(ranking_id, session)
    delete_criteria_assessments(ranking_id, session)
    return {"ok": True}