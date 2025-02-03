import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";


function AdminPage() {
    const navigate = useNavigate();

    const clearDB = () => {
        const cleardb = async () => {
            try {
                const response = await api.delete("/clear_db");
                console.log(response);
            } catch (err) {
                console.log(err);
                navigate("/error/");
            }
        }
        cleardb();
    }

    const fetchDB = () => {
        const fetchdb = async () => {
            try {
                const response = await api.get("/get_db");
                console.log(response.data);
                const fulldb = response.data
                if (fulldb) {
                    const blob = new Blob([JSON.stringify(fulldb, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);

                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `database.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                }
            } catch (err) {
                console.log(err);
                navigate("/error/");
            }
        }
        fetchdb();
    }

    return (
        <div className="container mt-4">
            <Navbar links={[["/", "Home", "primary"]]} />
            <button className="btn btn-danger" onClick={clearDB}>Clear Database</button>
            <button className="btn btn-info" onClick={fetchDB}>Fetch Database</button>
        </div>
    )
}

export default AdminPage;