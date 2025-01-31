from fastapi import HTTPException, APIRouter

import numpy as np

router = APIRouter(
    prefix="/mcda",
    tags=['TOPSIS']
)


def topsis(X: np.ndarray, W: np.ndarray) -> np.ndarray:
    m = W.shape[0]
    m, n = X.shape
    R = X / np.sqrt(np.cumsum(X**2, 0)[-1])
    D = R * W

    pis = np.max(D, axis=0)
    nis = np.min(D, axis=0)


    dpis = np.linalg.norm(D - pis, axis=1)
    dnis = np.linalg.norm(D - nis, axis=1)

    return dnis / (dnis + dpis)
    



@router.post("/topsis", response_model=list[float])
def topsis_method(data: tuple[list[list[float]], list[float]]):
    alts, weights = data
    X = np.array(alts)
    W = np.array(weights)
    return list(topsis(X, W))