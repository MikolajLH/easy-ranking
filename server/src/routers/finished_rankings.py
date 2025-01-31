from fastapi import HTTPException, APIRouter
from sqlmodel import select, delete

from ..database import SessionDep
from ..models.finished_ranking import FinishedRanking

router = APIRouter(
    prefix="/finrankings",
    tags=['finished rankings']
)

@router.get("/",response_model=list[FinishedRanking])
def get_finished_rankings(session: SessionDep):
    frankings = session.exec(select(FinishedRanking)).all()
    return frankings


@router.get("/author/{nickname}", response_model=list[FinishedRanking])
def get_finished_rankings_by_author(nickname: str, session: SessionDep):
    return session.exec(select(FinishedRanking).where(FinishedRanking.author == nickname)).all()



@router.get("/{id}", response_model=FinishedRanking)
def get_finished_ranking(id: int, session: SessionDep):
    db_ranking = session.get(FinishedRanking, id)
    if not db_ranking:
        raise HTTPException(status_code=404, detail="Ranking not found")
    return db_ranking



@router.post("/", response_model=FinishedRanking)
def create_finished_ranking(new_ranking: FinishedRanking, session: SessionDep):
    db_ranking = FinishedRanking.model_validate(new_ranking)
    session.add(db_ranking)
    session.commit()
    session.refresh(db_ranking)
    return db_ranking



@router.delete("/")
def delete_finished_rankings(session: SessionDep):
    session.exec(delete(FinishedRanking))
    session.commit()
    return {"ok": True}



@router.delete("/{ranking_id}")
def delete_finished_ranking(ranking_id: int, session: SessionDep):
    ranking_db = session.get(FinishedRanking, ranking_id)
    if not ranking_db:
        raise HTTPException(status_code=404, detail="Ranking not found")
    session.delete(ranking_db)
    session.commit()
    return {"ok": True}
