import { Link } from "react-router-dom";


export default function Navbar({ links }: { links: [string, string, string][] }) {
    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container-fluid">
                <div className="btn-group">
                    {links.map((item, i) => <Link className={`btn btn-${item[2]}`} key={i} to={item[0]}>{item[1]}</Link>)}
                </div>
            </div>
        </nav>
    );
}