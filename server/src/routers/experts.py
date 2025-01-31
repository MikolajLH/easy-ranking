from fastapi import HTTPException, APIRouter
from sqlmodel import select, delete

from ..database import SessionDep
from ..models.expert import Expert

router = APIRouter(
    prefix="/experts",
    tags=['experts']
)

@router.get("/",response_model=list[Expert])
def get_experts(session: SessionDep):
    experts = session.exec(select(Expert)).all()
    return experts


@router.put("/", response_model=tuple[bool, Expert])
def put_expert(expert: Expert, session: SessionDep):
    db_expert = session.get(Expert, expert.nickname)
    if db_expert:
        return (True, db_expert)
    db_expert = Expert.model_validate(expert)
    session.add(db_expert)
    session.commit()
    session.refresh(db_expert)
    return (False, db_expert)


@router.delete("/")
def delete_experts(session: SessionDep):
    session.exec(delete(Expert))
    session.commit()
    return {"ok": True}
