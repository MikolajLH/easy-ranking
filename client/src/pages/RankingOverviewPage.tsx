import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { FinishedRanking, FinishedRankingDB, transpose } from "../types";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import PCM from "../components/PCM";

function RankingOverviewPage() {
    const navigate = useNavigate();

    const [ranking, setRanking] = useState<FinishedRanking | null>(null);
    const { id } = useParams();
    const [criteriaWeights, setCriteriaWeights] = useState<number[]>([]);
    const [finalWeights, setFinalWeights] = useState<number[]>([]);
    const [topsis, setTopsis] = useState<number[]>([]);

    const prioritization_methods = ["evm", "gmm", "scsm", "sscsm", "cmm"];
    const aggregations_methods = ["aij", "aip"];


    useEffect(() => {
        console.log("Loading Ranking Overview Page!");
        const getranking = async () => {
            try {
                const response = await api.get<FinishedRankingDB>(`/finrankings/${id}`);
                setRanking(response.data);
                console.log(response.data);
            } catch (err) {
                console.log(err);
                navigate("/error/");
            }
        }
        getranking();
    }, []);


    const alts_pcms_by_criterion = (criterionIndex: number) =>
        ranking?.criteria.map((_, i) => ranking.alternatives_pcms.map((byexpert_pcsm) => byexpert_pcsm[i]))[criterionIndex]

    const fetchtopsis = async () => {
        if (ranking) {
            try {
                const apiurlagg = "/aggregations/aij/";
                const apiurlpri = "/prioritizations/evm/";

                const agg_crits = await api.post<number[][]>(apiurlagg, ranking.criteria_pcms);
                const crit_res = await api.post<number[]>(apiurlpri, agg_crits.data);

                const critalt_pcms = ranking.criteria.map((_, i) => alts_pcms_by_criterion(i));

                const tempagg = await Promise.all(critalt_pcms.map((item) => api.post<number[][]>(apiurlagg, item)));
                const temppri = await Promise.all(tempagg.map((item) => (api.post<number[]>(apiurlpri, item.data))));

                const X = temppri.map((item) => item.data);

                const topsisres = await api.post<[number[], number[], number[]]>("/mcda/topsis/", [transpose(X), crit_res.data]);
                setTopsis(topsisres.data[2]);

            } catch (err) {
                console.log(err);
                navigate("/error/");
            }
        }
    }




    const [critIndex, setCritIndex] = useState(0);
    const [expertIndex, setExpertIndex] = useState(0);
    const [priorIndex, setPriorIndex] = useState(0);
    const [aggIndex, setAggIndex] = useState(0);

    useEffect(() => {
        const fetchweights = async () => {
            if (ranking) {
                try {
                    if (aggregations_methods[aggIndex] == "aip") {
                        const apiurl = `/aggregations/aip/${prioritization_methods[priorIndex]}/art/`;

                        const crit_res = await api.post<number[]>(apiurl, ranking.criteria_pcms);
                        setCriteriaWeights(crit_res.data);

                        const critalt_pcms = ranking.criteria.map((_, i) => alts_pcms_by_criterion(i));
                        const promises = critalt_pcms.map((item) => api.post<number[]>(apiurl, item));
                        const tempres = await Promise.all(promises);

                        const finalres = await api.post<number[]>("/aggregations/level3", [tempres.map((item) => item.data), crit_res.data]);
                        setFinalWeights(finalres.data);

                    } else {
                        const apiurlagg = "/aggregations/aij/";
                        const apiurlpri = `/prioritizations/${prioritization_methods[priorIndex]}/`;

                        const agg_crits = await api.post<number[][]>(apiurlagg, ranking.criteria_pcms);
                        const crit_res = await api.post<number[]>(apiurlpri, agg_crits.data);
                        setCriteriaWeights(crit_res.data)

                        const critalt_pcms = ranking.criteria.map((_, i) => alts_pcms_by_criterion(i));

                        const tempagg = await Promise.all(critalt_pcms.map((item) => api.post<number[][]>(apiurlagg, item)));
                        const temppri = await Promise.all(tempagg.map((item) => (api.post<number[]>(apiurlpri, item.data))));

                        const finalres = await api.post<number[]>("/aggregations/level3", [temppri.map((item) => item.data), crit_res.data]);
                        setFinalWeights(finalres.data);

                    }
                } catch (err) {
                    console.log(err);
                    navigate("/error/");
                }
            }
        }
        fetchweights();
    }, [priorIndex, aggIndex, ranking]);

    useEffect(() => {
        fetchtopsis();
    }, [ranking]);

    const onNext = () => {
        if (ranking) setExpertIndex((prev) => (prev + 1) % ranking.criteria_pcms.length);
    }

    const onPrev = () => {
        if (ranking) setExpertIndex((prev) => (prev + ranking.criteria_pcms.length - 1) % ranking.criteria_pcms.length);
    }

    const saveJson = () => {
        if (ranking) {
            const tosave = {
                ...ranking,
                aggregations_method: aggregations_methods[aggIndex],
                prioritization_method: prioritization_methods[priorIndex],
                criteria_weights: criteriaWeights,
                alternatives_weights: finalWeights,
                topsis_vector: topsis
            };
            const blob = new Blob([JSON.stringify(tosave, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `ranking-${ranking.title}-${ranking.author}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }

    }

    return (
        ranking &&
        <div className="container mt-4">
            <Navbar links={[["/", "Home", "primary"]]} />
            <h1 className="text-center">Ranking Overview Page</h1>
            <div className="row">
                <div className="col-3">
                    <h4>Title: {ranking.title}</h4>
                    <h4>Author: {ranking.author}</h4>
                    <h4>Scale: Fundamental Scale</h4>
                    <button className="btn btn-success" onClick={saveJson}>Save ranking</button>
                </div>
                <div className="col-3">
                    <h3>Alternatives</h3>
                    <h6>
                        Aggregation vector in <span className="text-primary">blue</span>
                        <br />
                        TOPSIS vector in <span className="text-success">green</span>
                    </h6>
                    <ol className="list-group list-group-numbered">
                        {ranking.alternatives.map((item, i) => (
                            <li
                                key={i}
                                className="list-group-item d-flex justify-content-between align-items-start">
                                <div className="ms-2 me-auto">{item}</div>
                                {finalWeights.length > 0 && <span className="badge rounded-pill text-bg-primary">{finalWeights[i].toFixed(3)}</span>}
                                {topsis.length > 0 && <span className="badge rounded-pill text-bg-success">{topsis[i].toFixed(3)}</span>}
                            </li>
                        ))}
                    </ol>
                </div>
                <div className="col-6">
                    <div className="row">
                        <div className="col">
                            <h2 className="text-center">Prioritization method</h2>
                            <ul className="list-group">
                                {prioritization_methods.map((item, i) => (
                                    <li
                                        key={i}
                                        className={`list-group-item ${i == priorIndex && "active"}`}
                                        onClick={() => setPriorIndex(i)}>
                                        {item}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="col">
                            <h2 className="text-center">Aggregation method</h2>
                            <ul className="list-group">
                                {aggregations_methods.map((item, i) => (
                                    <li
                                        key={i}
                                        className={`list-group-item ${i == aggIndex && "active"}`}
                                        onClick={() => setAggIndex(i)}>
                                        {item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <div className="row">
                <div className="col-3">
                    <h2 className="text-center">Criteria</h2>
                    <ol className="list-group list-group-numbered">
                        {ranking.criteria.map((item, i) => (
                            <li
                                key={i}
                                className={`list-group-item ${i == critIndex && "active"} d-flex justify-content-between align-items-start`}
                                onClick={() => setCritIndex(i)}>
                                <div className="ms-2 me-auto">{item}</div>
                                {criteriaWeights.length > 0 && <span className="badge rounded-pill text-bg-info">{criteriaWeights[i].toFixed(3)}</span>}
                            </li>
                        ))}
                    </ol>
                </div>
                <div className="col-9">
                    <div className="row">
                        <div className="col">
                            <h4>Crirteria PCM</h4>
                            <PCM matrix={ranking.criteria_pcms[expertIndex]} />
                        </div>
                        <div className="col">
                            <h4>Alternatives PCM for selected criterion</h4>
                            <PCM matrix={ranking.alternatives_pcms[expertIndex][critIndex]} />
                        </div>
                    </div>
                    <div className="row text-center justify-content-center">
                        <div className="col">
                            <div className="btn-group" role="group" aria-label="Basic example">
                                <button type="button" className="btn btn-primary" onClick={onPrev}>{"<-"}</button>
                                <button type="button" className="btn btn-primary">{`Expert ${expertIndex}`}</button>
                                <button type="button" className="btn btn-primary" onClick={onNext}>{"->"}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RankingOverviewPage;