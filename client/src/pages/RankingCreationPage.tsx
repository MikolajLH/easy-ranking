import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import EditableList from "../components/EditableList";
import { RankingModel, RankingModelDB } from "../types";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function RankingCreationPage() {
    const navigate = useNavigate();
    const { nickname } = useParams();
    const [newRanking, setNewRanking] = useState<RankingModel>({
        author: nickname ?? "<unknown>",
        title: "",
        criteria: [],
        alternatives: [],
        scale: [1 / 9, 1 / 8, 1 / 7, 1 / 6, 1 / 5, 1 / 4, 1 / 3, 1 / 2, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    });

    const handleChange = (field: string, value: string | string[]) => {
        setNewRanking((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const onSubmit = () => {
        const submit = async () => {
            try {
                const response = await api.post<RankingModelDB>("/rankings/", newRanking);
                const rankingId = response.data.id;
                navigate(`/expert/${nickname}/ranking/${rankingId}/manage`);
            } catch (err) {
                console.log(err);
                return -1;
            }
        }
        submit();
    };

    return (
        <div className="container mt-4">
            <Navbar links={[["/", "Home", "primary"], [`/expert/${nickname}`, "Profile", "secondary"]]} />
            <h1 className="text-center">Ranking Creation Page</h1>
            <div className="input-group mb-3">
                <span className="input-group-text">Author</span>
                <input
                    type="text"
                    id="author"
                    className="form-control"
                    value={newRanking.author}
                    disabled
                    readOnly
                />
            </div>
            <div className="input-group mb-3">
                <span className="input-group-text">Title</span>
                <input
                    type="text"
                    id="title"
                    className="form-control"
                    value={newRanking.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                />
            </div>
            <div className="row">
                <div className="col-6">
                    <EditableList title="Criteria" elements={newRanking.criteria} onUpdate={el => handleChange("criteria", el)} />
                </div>
                <div className="col-6">
                    <EditableList title="Alternatives" elements={newRanking.alternatives} onUpdate={el => handleChange("alternatives", el)} />
                </div>
            </div>
            <div className="row text-center">
                <button onClick={onSubmit} className="btn btn-primary">Create</button>
            </div>
        </div>
    );
}

export default RankingCreationPage;