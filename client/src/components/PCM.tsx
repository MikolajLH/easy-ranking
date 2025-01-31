import { useEffect, useState } from "react";
import api from "../api/axios";


export default function PCM({ matrix }: { matrix: number[][] }) {
    const [CI, setCI] = useState(-1);
    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await api.post<number>("/consistencyindex", matrix);
                setCI(response.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetch();
    }, [matrix]);

    return (
        <>
            <table className="table table-bordered  text-center">
                <tbody>
                    <tr key={"cols header"} className="table-primary">
                        <td key="0/0" className="table-secondary"></td>
                        {matrix[0].map((_, colIndex) => (
                            <td key={colIndex}>{colIndex + 1}</td>
                        ))}
                    </tr>
                    {matrix.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <td key={`row-${rowIndex}`} className="table-primary">{rowIndex + 1}</td>
                            {row.map((val, colIndex) => (
                                <td key={colIndex} className={colIndex == rowIndex ? "table-dark" : ""}>
                                    {
                                        colIndex == rowIndex ?
                                            "" : val.toFixed(2)
                                    }
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {CI >= 0 && <h5>Consistency Index: {CI.toFixed(3)}</h5>}
        </>
    );
}