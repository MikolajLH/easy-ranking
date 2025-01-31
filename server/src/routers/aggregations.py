from fastapi import HTTPException, APIRouter
import numpy as np
from .prioritizations import get_method_impl

router = APIRouter(
    prefix="/aggregations",
    tags=['Aggregation methods']
)


@router.post("/aij", response_model=list[list[float]])
def aij_method(pcms: list[list[list[float]]]):
    matrices = [np.array(pcm) for pcm in pcms]
    r = len(matrices)
    assert r > 0
    m,n = matrices[0].shape
    assert m == n

    result = np.array([[np.array([m[i,j] for m in matrices]).prod() for j in range(n)] for i in range(n)]) ** (1/r)

    return result


@router.post("/aip/{priotitization_method}/{mean}", response_model=list[float])
def aip_method(priotitization_method: str, mean: str, pcms: list[list[list[float]]]):
    matrices = [np.array(pcm) for pcm in pcms]
    prior_method = get_method_impl(priotitization_method)
    r = len(matrices)
    assert r > 0
    m,n = matrices[0].shape
    assert m == n

    ws = [prior_method(m) for m in matrices]

    geo = np.prod(ws, axis=0) ** (1/len(ws))
    art = np.sum(ws, axis=0) / len(ws)

    if mean == "art":
        return art
    if mean == "geo":
        return geo

    return []


@router.post("/final", response_model=list[float])
def final_weights(data: tuple[list[list[float]], list[float]]):
    alternatives_weights, criteria_weights = data
    m = len(criteria_weights)
    w2 = np.array(criteria_weights)
    W = np.array(alternatives_weights)
    m, n = W.shape

    w3 = [np.sum([w2[j] * W[j,i] for j in range(m)]) for i in range(n)]
    return w3