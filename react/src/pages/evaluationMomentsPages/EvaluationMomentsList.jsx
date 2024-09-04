import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import endpoints from "../../endpoints";

const EvaluationMomentsList = () => {
    const [evaluationMoments, setEvaluationMoments] = useState([]);
    const { accessTokenData } = useAuth();

    useEffect(() => {
        fetch(endpoints.GET_EVALUATION_MOMENTS, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch evaluation moments");
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                setEvaluationMoments(data.evaluationMoments);
            })
            .catch((error) => {
                alert(error.message);
            });
    }, [accessTokenData.access_token]);

    return (
        <div className="table-list-container">
            <header>
                <h1>Momentos de Avaliação</h1>
            </header>

            <table className="table-list" border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Tipo</th>
                        <th>Curso</th>
                        <th>Modulo</th>
                        <th>Submodulo</th>
                        <th>Data</th>
                        <th>Professor</th>
                    </tr>
                </thead>
                <tbody>
                    {evaluationMoments.map((moment) => (
                        <tr key={moment.evaluation_moment_id}>
                            <td>{moment.type}</td>
                            <td>{moment.course.name}</td>
                            <td>{moment.module.name}</td>
                            <td>
                                {moment.submodule
                                    ? moment.submodule.name
                                    : "N/A"}
                            </td>
                            <td>{moment.date}</td>
                            <td>{moment.professor.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EvaluationMomentsList;
