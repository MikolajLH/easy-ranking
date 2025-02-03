from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
from .database import init_db, SessionDep
from .routers import rankings, experts, assessments, finished_rankings, aggregations, prioritizations, mcda

origins = ["http://localhost:5173"]

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Start")
    init_db()
    yield
    print("Close")

app = FastAPI(lifespan=lifespan)
app.include_router(rankings.router)
app.include_router(experts.router)
app.include_router(assessments.router)
app.include_router(finished_rankings.router)
app.include_router(aggregations.router)
app.include_router(prioritizations.router)
app.include_router(mcda.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", include_in_schema=False)
async def root():
    return RedirectResponse(url="/docs")



@app.delete("/clear_db")
def clear_db(session: SessionDep):
    rankings.delete_rankings(session)
    assessments.delete_all_alternatives_assessments(session)
    assessments.delete_all_criteria_assessments(session)
    experts.delete_experts(session)
    finished_rankings.delete_finished_rankings(session)


@app.get("/get_db")
def get_db(session: SessionDep):
    rankings_db = rankings.get_rankings(session)
    assessments_crits_db = assessments.get_all_criteria_assessments(session)
    assessments_alts_db = assessments.get_all_alternatives_assessments(session)
    experts_db = experts.get_experts(session)
    finished_rankings_db = finished_rankings.get_finished_rankings(session)

    return {
        "RankingModels": rankings_db,
        "CriteriaAssessments": assessments_crits_db,
        "AlternativesAssessments": assessments_alts_db,
        "Experts": experts_db,
        "FinishedRankings": finished_rankings_db
    }


@app.post("/consistencyindex", response_model=float)
def saaty_consistency_index(pcm: list[list[float]]):
    C = np.array(pcm)
    n,m = C.shape
    assert n == m

    eigenvalues, _ = np.linalg.eig(C)
    max_eigenvalue = np.max(np.abs(eigenvalues))

    return (max_eigenvalue - n) / (n - 1)
