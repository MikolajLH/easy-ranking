import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Expert } from "../types";


function HomePage() {

    const [nickname, setNickname] = useState("");
    const navigate = useNavigate();

    const onSignIn = () => {
        if (nickname.length == 0) return;
        const signin = async () => {
            try {
                const response = await api.put<Expert>(`/experts/`, { nickname: nickname });
                console.log(response.data);
                navigate(`/expert/${nickname}`);
            } catch (err) {
                console.log(err);
                navigate("/error/");
            }
        }
        signin();
    }

    return (
        <div className="container mt-4">
            <h1 className="text-center">HomePage</h1>
            <div className="input-group mb-3">
                <span className="input-group-text">Nickname</span>
                <input type="text" className="form-control" onChange={e => setNickname(e.target.value)} />
                <button className="btn btn-outline-secondary" type="button" onClick={onSignIn}>Sign in</button>
            </div>
            <div className="row text-center">
                <div className="col">
                    <Link className="btn btn-primary" to="/admin">Admin Panel</Link>
                </div>
            </div>
        </div>
    );
}

export default HomePage;