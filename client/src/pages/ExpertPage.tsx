import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { FinishedRankingDB, RankingModelDB } from "../types";
import Navbar from "../components/Navbar";


function ExpertPage() {
    const { nickname } = useParams();
    const navigate = useNavigate();


    const [openRankings, setOpenRankings] = useState<RankingModelDB[]>([]);
    const [finishedRankings, setFinishedRankings] = useState<FinishedRankingDB[]>([]);

    const [joinId, setJoinId] = useState("");

    useEffect(() => {
        console.log("Loading Page!");
        const getrankings = async () => {
            try {
                const response = await api.get<RankingModelDB[]>(`/rankings/author/${nickname}`);
                const finres = await api.get<FinishedRankingDB[]>(`/finrankings/author/${nickname}`);
                setOpenRankings(response.data);
                setFinishedRankings(finres.data);
            } catch (err) {
                console.log(err);
            }
        }
        getrankings();
    }, []);

    return (
        <div className="container mt-4">
            <Navbar links={[["/", "Home", "primary"]]} />
            <h1 className="text-center">Expert Page</h1>
            <h2 className="text-center">{nickname}</h2>
            <div className="input-group mb-3">
                <span className="input-group-text">Ranking ID</span>
                <input
                    type="text"
                    className="form-control"
                    onChange={e => setJoinId(e.target.value)} />
                <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => { if (joinId.length > 0) navigate(`/expert/${nickname}/ranking/${joinId}/assessment`) }}>
                    Join Ranking</button>
            </div>

            <div className="d-flex justify-content-center">
                <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/expert/${nickname}/create_ranking`)}>
                    Create new ranking</button>
            </div>

            <div className="list-group pt-2">
                <li className="list-group-item active text-center">My rankings</li>
                {openRankings.map((item, index) => (
                    <li
                        key={`o-${index}`}
                        className="list-group-item list-group-item-action d-flex justify-content-between align-items-start"
                        onClick={() => navigate(`/expert/${nickname}/ranking/${item.id}/manage`)}>
                        <div className="ms-2 me-auto">
                            {item.title}
                        </div>
                        <span className="badge text-bg-warning rounded-pill">open</span>
                    </li>
                ))}

                {finishedRankings.map((item, index) => (
                    <li
                        key={`c-${index}`}
                        className="list-group-item list-group-item-action d-flex justify-content-between align-items-start"
                        onClick={() => navigate(`/ranking/${item.id}`)}>
                        <div className="ms-2 me-auto">
                            {item.title}
                        </div>
                        <span className="badge text-bg-success rounded-pill">finished</span>
                    </li>
                ))}
            </div>
        </div>
    );
}

export default ExpertPage;