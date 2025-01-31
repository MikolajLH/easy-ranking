export type Expert = {
    nickname: string
}

export type RankingModel = {
    title: string
    author: string
    criteria: string[]
    alternatives: string[]
    scale: number[]
}

export type RankingModelDB = RankingModel & { id: number };

export type CriteriaAssessmentDB = {
    ranking_id: number
    expert_nickname: string
    pcm: Matrix
}

export type AlternativesAssessmentDB = {
    ranking_id: number
    expert_nickname: string
    pcms: Matrix[]
}

export type Matrix = number[][];

export function matrixSetValue(mat: Matrix, i: number, j: number, val: number) {
    return mat.map(
        (row, rowIndex) =>
            row.map((elem, colIndex) => (rowIndex == i && colIndex == j) ? val : elem));
}

export function createMatrix(rows: number, cols: number, val: number): Matrix {
    return Array.from({ length: rows }, () => Array.from({ length: cols }, () => val));
}

export function transpose(matrix: number[][]): number[][] {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

export function makepairs<T>(elems: T[]): [number, number][] {
    let res: [number, number][] = [];
    for (let i = 0; i < elems.length; i++) {
        for (let j = i + 1; j < elems.length; j++) {
            res.push([i, j]);
        }
    }
    return res;
}

export type FinishedRanking = RankingModel & { criteria_pcms: Matrix[], alternatives_pcms: Matrix[][] }
export type FinishedRankingDB = FinishedRanking & { id: number }