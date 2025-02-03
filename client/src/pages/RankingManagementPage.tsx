import { useEffect, useState } from "react";
import { AlternativesAssessmentDB, CriteriaAssessmentDB, RankingModelDB, FinishedRanking, FinishedRankingDB } from "../types";
import PCM from "../components/PCM";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";


function RankingManagementPage() {
    const navigate = useNavigate();
    const { nickname, ranking_id } = useParams();


    // Data to fetch
    const [ranking, setRanking] = useState<RankingModelDB | null>(null);
    const [alternativesAssessments, setAlternativesAssessments] = useState<AlternativesAssessmentDB[]>([]);
    const [criteriaAssessments, setCriteriaAssessments] = useState<CriteriaAssessmentDB[]>([]);

    useEffect(() => {
        console.log("Loading Page!");
        const getdata = async () => {
            try {
                const response = await api.get<RankingModelDB>(`/rankings/${ranking_id}`);

                const alternatives_assessments = await api.get<AlternativesAssessmentDB[]>(`/assessments/alternatives/${ranking_id}`);
                const criteria_assessments = await api.get<CriteriaAssessmentDB[]>(`/assessments/criteria/${ranking_id}`);

                setAlternativesAssessments(alternatives_assessments.data);
                setCriteriaAssessments(criteria_assessments.data);
                setRanking(response.data);
            } catch (err) {
                console.log(err);
                navigate("/error/");
            }
        }
        getdata();
    }, []);


    const [critIndex, setCritIndex] = useState(0);
    const [expertIndex, setExpertIndex] = useState(0);

    const getExpertNickname = (k: number) => {
        return criteriaAssessments[k].expert_nickname;
    };

    const onConclude = () => {
        const onconclude = async () => {
            if (ranking) {
                const finishedranking: FinishedRanking = {
                    title: ranking.title,
                    author: ranking.author,
                    scale: ranking.scale,
                    alternatives: ranking.alternatives,
                    criteria: ranking.criteria,
                    criteria_pcms: criteriaAssessments.map((item) => item.pcm),
                    alternatives_pcms: alternativesAssessments.map((item) => item.pcms)
                }

                try {
                    const response = await api.post<FinishedRankingDB>("/finrankings/", finishedranking);
                    console.log(response.data);
                    await api.delete(`/rankings/${ranking_id}`);
                    navigate(`/ranking/${response.data.id}`);
                } catch (err) {
                    console.log(err);
                    navigate("/error/");
                }

            }
        }
        onconclude();
    }


    return ranking && (
        <div className="container mt-4">
            <Navbar links={[["/", "Home", "primary"], [`/expert/${nickname}`, "Profile", "secondary"]]} />
            <h1 className="text-center">Ranking Management</h1>
            <br />
            <div className="row">
                <div className="col">
                    <h2 className="">Ranking Title: {ranking.title}</h2>
                    <h2 className="">Ranking ID: {ranking_id}</h2>
                    <h2>Author: {ranking.author}</h2>
                </div>
                <div className="col">
                    <h3>Alternatives</h3>
                    <ol className="list-group list-group-numbered">
                        {ranking.alternatives.map((item, i) => (
                            <li
                                key={i}
                                className="list-group-item">{item}</li>
                        ))}
                    </ol>
                </div>
            </div>
            <br />
            <div className="row">
                <div className="col-3">
                    <h2>Criteria</h2>
                    <ol className="list-group list-group-numbered">
                        {ranking.criteria.map((item, i) => (
                            <li
                                key={i}
                                className={`list-group-item ${i == critIndex && "active"}`}
                                onClick={() => setCritIndex(i)}>
                                {item}</li>
                        ))}
                    </ol>

                </div>
                <div className="col-6">
                    <div className="row">
                        <div className="col">
                            <h4 className="text-center">Criteria PCM</h4>
                            <PCM matrix={criteriaAssessments.find((val) => val.expert_nickname == getExpertNickname(expertIndex))?.pcm ?? [[0]]} />
                        </div>
                        <div className="col">
                            <h4 className="text-center">Alternatives PCM</h4>
                            <PCM matrix={alternativesAssessments.length > 0 ? alternativesAssessments[expertIndex].pcms[critIndex] : [[0]]} />
                        </div>
                    </div>
                </div>
                <div className="col-3">
                    <h2>Experts</h2>
                    <ul className="list-group">
                        {criteriaAssessments.map((item, i) => (
                            <li
                                key={i}
                                className={`list-group-item ${i == expertIndex && "active"}`}
                                onClick={() => setExpertIndex(i)}>{item.expert_nickname}</li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="d-flex justify-content-center">
                <button className="btn btn-primary" onClick={onConclude}>Conclude</button>
            </div>
        </div>
    );
}

export default RankingManagementPage;