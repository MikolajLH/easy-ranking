from fastapi import HTTPException, APIRouter
from sqlmodel import select, delete

from ..database import SessionDep
from ..models.assessment import CriteriaAssessment, AlternativesAssessment

router = APIRouter(
    prefix="/assessments",
    tags=['assessments']
)

@router.get("/criteria", response_model=list[CriteriaAssessment])
def get_all_criteria_assessments(session: SessionDep):
    criteria_assessments = session.exec(select(CriteriaAssessment)).all()
    return criteria_assessments


@router.get("/alternatives", response_model=list[AlternativesAssessment])
def get_all_alternatives_assessments(session: SessionDep):
    alternatives_assessments = session.exec(select(AlternativesAssessment)).all()
    return alternatives_assessments


@router.get("/criteria/{ranking_id}", response_model=list[CriteriaAssessment])
def get_criteria_assessments(ranking_id: int, session: SessionDep):
    return session.exec(select(CriteriaAssessment).where(CriteriaAssessment.ranking_id == ranking_id)).all()


@router.get("/alternatives/{ranking_id}", response_model=list[AlternativesAssessment])
def get_alternatives_assessments(ranking_id: int, session: SessionDep):
    return session.exec(select(AlternativesAssessment).where(AlternativesAssessment.ranking_id == ranking_id)).all()


@router.get("/expert/{nickname}/{ranking_id}", response_model=list[tuple[list[list[float]], list[list[list[float]]]]])#list with one element or empty list
def get_assessments_for_expert(nickname: str, ranking_id: int, session: SessionDep):
    db_alternatives_assessment = session.get(AlternativesAssessment, (nickname, ranking_id))
    db_criteria_assessment = session.get(CriteriaAssessment, (nickname, ranking_id))

    if db_alternatives_assessment and db_criteria_assessment:
        return [(db_criteria_assessment.pcm, db_alternatives_assessment.pcms)]
    return []


@router.delete("/alternatives")
def delete_all_alternatives_assessments(session: SessionDep):
    session.exec(delete(AlternativesAssessment))
    session.commit()
    return {"ok": True}


@router.delete("/criteria")
def delete_all_criteria_assessments(session: SessionDep):
    session.exec(delete(CriteriaAssessment))
    session.commit()
    return {"ok": True}



@router.delete("/alternatives/{ranking_id}")
def delete_alternatives_assessments(ranking_id: int, session: SessionDep):
    session.exec(delete(AlternativesAssessment).where(AlternativesAssessment.ranking_id == ranking_id))
    session.commit()
    return {"ok": True}


@router.delete("/criteria/{ranking_id}")
def delete_criteria_assessments(ranking_id: int, session: SessionDep):
    session.exec(delete(CriteriaAssessment).where(CriteriaAssessment.ranking_id == ranking_id))
    session.commit()
    return {"ok": True}



@router.put("/alternatives", response_model=AlternativesAssessment)
def put_alternatives_assessment(assessment: AlternativesAssessment, session: SessionDep):
    db_assessment = session.get(AlternativesAssessment, (assessment.expert_nickname, assessment.ranking_id))
    if db_assessment:
        db_assessment.pcms = assessment.pcms
    else:
        db_assessment = AlternativesAssessment.model_validate(assessment)
    
    session.add(db_assessment)
    session.commit()
    session.refresh(db_assessment)
    return db_assessment


@router.put("/criteria", response_model=CriteriaAssessment)
def put_criteria_assessment(assessment: CriteriaAssessment, session: SessionDep):
    db_assessment = session.get(CriteriaAssessment, (assessment.expert_nickname, assessment.ranking_id))
    if db_assessment:
        db_assessment.pcm = assessment.pcm
    else:
        db_assessment = CriteriaAssessment.model_validate(assessment)
    
    session.add(db_assessment)
    session.commit()
    session.refresh(db_assessment)
    return db_assessment
