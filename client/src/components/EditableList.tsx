import { useEffect, useState } from "react"

export default function EditableList({ title, elements, onUpdate }: { title: string, elements: string[], onUpdate: (el: string[]) => void }) {

    const [elems, setElems] = useState(elements);
    const [newElem, setNewElem] = useState("");

    useEffect(() => {
        onUpdate(elems);
    }, [elems]);

    return (
        <ul className="list-group pt-2">
            <li className="list-group-item active"><h2>{title}</h2></li>
            {elems.map((val, i) => (
                <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                    {val}
                    <button className="btn btn-danger" onClick={_ => {
                        setElems(es => es.filter((_, k) => k != i));
                    }}>X</button>
                </li>
            ))}
            <li className="list-group-item">
                <div className="input-group">
                    <input type="text" className="form-control" value={newElem} onChange={e => setNewElem(e.target.value)} />
                    <button className="btn btn-primary" onClick={_ => {
                        if (newElem != "") {
                            setElems(es => [...es, newElem]);
                            setNewElem("");
                        }
                    }}>Add</button>
                </div>
            </li>
            <div className="pb-3" />
        </ul>
    )
}