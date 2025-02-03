import Navbar from "../components/Navbar";


function ErrorPage() {
    return (
        <div className="container mt-4">
            <Navbar links={[["/", "Home", "primary"]]} />
            <h1>Internal Server Error</h1>
        </div>
    );
}

export default ErrorPage;