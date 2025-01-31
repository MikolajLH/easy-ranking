from fastapi import HTTPException, APIRouter
import numpy as np

router = APIRouter(
    prefix="/prioritizations",
    tags=['prioritization methods']
)

def evm(C: np.ndarray) -> np.ndarray:
    eigenvalues, eigenvectors = np.linalg.eig(C)
    max_eigenvalue_index = np.argmax(np.abs(eigenvalues))
    principal_eigenvector = eigenvectors[:, max_eigenvalue_index]

    principal_eigenvector = np.real(principal_eigenvector)
    principal_eigenvector /= np.sum(principal_eigenvector)
    return principal_eigenvector


def gmm(C: np.ndarray) -> np.ndarray:
    gm = C.prod(axis=1) ** (1 / C.shape[0])
    return gm / np.sum(gm)


def scsm(C: np.ndarray) -> np.ndarray:
    return C.sum(axis=1) / C.shape[0]


def sscsm(C: np.ndarray) -> np.ndarray:
    return (C / C.sum(axis=0)).sum(axis=1)


def cmm(C: np.ndarray) -> np.ndarray:
    B = C / (C * C).sum(axis=0)

    return B.sum(axis=1) / np.sqrt(np.sum(B.sum(axis=0)**2))


def get_method_impl(name: str):
    name = name.lower()
    if name == "evm":
        return evm
    if name == "gmm":
        return gmm
    if name == "scsm":
        return scsm
    if name == "sscsm":
        return sscsm
    if name == "cmm":
        return cmm
    assert False


@router.post("/evm", response_model=list[float])
def evm_method(pcm: list[list[float]]):
    C = np.array(pcm)
    n,m = C.shape
    assert n == m

    return list(evm(C))


@router.post("/gmm", response_model=list[float])
def gmm_method(pcm: list[list[float]]):
    C = np.array(pcm)
    n,m = C.shape
    assert n == m

    return list(gmm(C))


@router.post("/scsm", response_model=list[float])
def scsm_method(pcm: list[list[float]]):
    C = np.array(pcm)
    n,m = C.shape
    assert n == m

    return list(scsm(C))


@router.post("/sscsm", response_model=list[float])
def sscsm_method(pcm: list[list[float]]):
    C = np.array(pcm)
    n,m = C.shape
    assert n == m

    return list(sscsm(C))



@router.post("/cmm", response_model=list[float])
def cmm_method(pcm: list[list[float]]):
    C = np.array(pcm)
    n,m = C.shape
    assert n == m

    return list(cmm(C))