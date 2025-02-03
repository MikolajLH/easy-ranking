import { useEffect, useState } from "react";
import { createMatrix, Matrix, RankingModel, RankingModelDB, matrixSetValue, makepairs, CriteriaAssessmentDB, AlternativesAssessmentDB } from "../types";
import PCM from "../components/PCM";
import StringList from "../components/StringList";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";


function AssessmentPage() {
    const { nickname, ranking_id } = useParams();
    const navigate = useNavigate();

    // filled by the api call as the page loads
    const [ranking, setRanking] = useState<RankingModel | null>(null);


    // PCMs for criteria comparison
    const [criteriaPCM, setCriteriaPCM] = useState<Matrix>([]);

    // const criteria.length PCMs for alternatives comparison, each PCM for different criterion
    const [alternativesPCMs, setAlternativesPCMs] = useState<Matrix[]>([]);

    const [selectedCriterionIndex, setSelectedCriterionIndex] = useState(0);


    const updateAlternativesComparison = (criterionIndex: number, leftAlternativeIndex: number, rightAlternativeIndex: number, compVal: number) => {
        setAlternativesPCMs((prev) =>
            prev.map((pcm, i) =>
                i == criterionIndex ? matrixSetValue(pcm, leftAlternativeIndex, rightAlternativeIndex, compVal) : pcm));
    }

    const updateCriteriaComparison = (leftCriterionIndex: number, rightCriterionIndex: number, compVal: number) => {
        setCriteriaPCM((prev) => matrixSetValue(prev, leftCriterionIndex, rightCriterionIndex, compVal));
    }

    const handleSubmit = () => {
        if (nickname && ranking_id && ranking) {
            const submitassessments = async () => {
                const criteria_assessment: CriteriaAssessmentDB = {
                    expert_nickname: nickname,
                    ranking_id: +ranking_id,
                    pcm: criteriaPCM
                }

                const alternatives_assessments: AlternativesAssessmentDB = {
                    expert_nickname: nickname,
                    ranking_id: +ranking_id,
                    pcms: alternativesPCMs
                }

                const criteria_response = await api.put<CriteriaAssessmentDB>("/assessments/criteria/", criteria_assessment);
                const alternatives_response = await api.put<AlternativesAssessmentDB>("/assessments/alternatives/", alternatives_assessments);

                console.log(criteria_response);
                console.log(alternatives_response);

                navigate(`/expert/${nickname}`);
            }
            submitassessments()
        }
    }

    useEffect(() => {
        console.log("Loading Assessment Page!")
        const getranking = async () => {
            try {
                const response = await api.get<RankingModelDB>(`/rankings/${ranking_id}`);



                const matrices = await api.get<[Matrix, Matrix[]][]>(`/assessments/expert/${nickname}/${ranking_id}`)

                if (matrices.data.length > 0) {
                    console.log(matrices.data)
                    setCriteriaPCM(matrices.data[0][0]);
                    setAlternativesPCMs(matrices.data[0][1]);
                }
                else {
                    setCriteriaPCM(createMatrix(response.data.criteria.length, response.data.criteria.length, response.data.scale[Math.floor(response.data.scale.length / 2)]));

                    setAlternativesPCMs(
                        Array.from({ length: response.data.criteria.length },
                            (_) => createMatrix(response.data.alternatives.length, response.data.alternatives.length, response.data.scale[Math.floor(response.data.scale.length / 2)])));
                }

                setRanking(response.data);
            } catch (err) {
                console.log(err);
                navigate("/error/");
            }
        }
        getranking();

    }, []);


    return (
        ranking &&
        <div className="container mt-4">
            <Navbar links={[["/", "Home", "primary"], [`/expert/${nickname}`, "Profile", "secondary"]]} />
            <h1 className="text-center">Assessment Page</h1>
            <br />
            <div className="row">
                <div className="col-6">
                    <div className="row">
                        <h2 className="text-center">Criteria</h2>
                        <ol className="list-group list-group-numbered">
                            {ranking.criteria.map((item, i) => (
                                <li
                                    key={i}
                                    className={`list-group-item ${i == selectedCriterionIndex && "active"}`}
                                    onClick={() => setSelectedCriterionIndex(i)}>
                                    {item}</li>
                            ))}
                        </ol>
                    </div>
                    <br />
                    <div className="row">
                        <h2 className="text-center">Criteria pairwise comparison</h2>
                        <ul className="list-group">
                            {makepairs(ranking.criteria).map((item, i) => (
                                <li key={i} className="list-group-item">
                                    <div className="row-col d-flex justify-content-between align-items-center">
                                        {`${ranking.criteria[item[0]]} vs ${ranking.criteria[item[1]]}`}
                                        <span className="badge text-bg-primary rounded-pill">{criteriaPCM[item[0]][item[1]].toFixed(2)}</span>
                                    </div>
                                    <input type="range" className="form-range"
                                        min={0}
                                        max={ranking.scale.length - 1}
                                        step={1}
                                        defaultValue={Math.floor(ranking.scale.length / 2)}
                                        onChange={(e) => {
                                            updateCriteriaComparison(item[0], item[1], ranking.scale[+e.target.value]);
                                            updateCriteriaComparison(item[1], item[0], 1 / ranking.scale[+e.target.value]);
                                        }}
                                    />

                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="row">
                        <PCM matrix={criteriaPCM} />
                    </div>
                </div>
                <div className="col-6">
                    <div className="row">
                        <h2 className="text-center">Alternatives</h2>
                        <StringList isOrdered={true} elements={ranking.alternatives} />
                    </div>
                    <br />
                    <div className="row">
                        <h2 className="text-center">Alternatives pairwise comparison for criterion {ranking.criteria[selectedCriterionIndex]}</h2>
                        <ul className="list-group">
                            {makepairs(ranking.alternatives).map((item, i) => (
                                <li key={i} className="list-group-item">
                                    <div className="row-col d-flex justify-content-between align-items-center">
                                        {`${ranking.alternatives[item[0]]} vs ${ranking.alternatives[item[1]]}`}
                                        <span className="badge text-bg-primary rounded-pill">{alternativesPCMs[selectedCriterionIndex][item[0]][item[1]].toFixed(2)}</span>
                                    </div>
                                    <input type="range" className="form-range"
                                        min={0}
                                        max={ranking.scale.length - 1}
                                        step={1}
                                        defaultValue={Math.floor(ranking.scale.length / 2)}
                                        onChange={(e) => {
                                            updateAlternativesComparison(selectedCriterionIndex, item[0], item[1], ranking.scale[+e.target.value]);
                                            updateAlternativesComparison(selectedCriterionIndex, item[1], item[0], 1 / ranking.scale[+e.target.value]);
                                        }}
                                    />

                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="row">
                        <PCM matrix={alternativesPCMs[selectedCriterionIndex]} />
                    </div>
                </div>
            </div>
            <div className="row text-center">
                <div className="col">
                    <button className="btn btn-primary" type="button" onClick={handleSubmit}>Submit</button>
                </div>
            </div>
        </div>
    );
}

export default AssessmentPage;