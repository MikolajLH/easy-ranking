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

    return pis, nis, dnis / (dnis + dpis)
    



@router.post("/topsis", response_model=tuple[list[float], list[float], list[float]])
def topsis_method(data: tuple[list[list[float]], list[float]]):
    '''
    TOPSIS method

    First element in a tuple is a matrix of columnes of weights of vectors corresponding to each criteria.  
    Second element in a tuple is a vector of criteria' weights that sums up to one.

    Return Positive Ideal Solution, Negative Ideal Solution and The Vector of alternatives' relative distances to them.
    '''
    alts, weights = data
    X = np.array(alts)
    W = np.array(weights)
    p,n,r = topsis(X, W)
    return list(p), list(n), list(r)