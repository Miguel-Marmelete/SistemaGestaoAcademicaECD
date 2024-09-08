import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import endpoints from "../../endpoints";

const EvaluationMomentsList = () => {
    const [evaluationMoments, setEvaluationMoments] = useState([]);
    const [filteredEvaluationMoments, setFilteredEvaluationMoments] = useState(
        []
    );
    const [courses, setCourses] = useState([]);
    const [modules, setModules] = useState([]);
    const [submodules, setSubmodules] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedModule, setSelectedModule] = useState("");
    const [selectedSubmodule, setSelectedSubmodule] = useState("");
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
                const moments = data.evaluationMoments;
                setEvaluationMoments(moments);
                setFilteredEvaluationMoments(moments);

                // Extract unique courses, modules, and submodules
                const uniqueCourses = [
                    ...new Set(moments.map((moment) => moment.course.name)),
                ];
                const uniqueModules = [
                    ...new Set(moments.map((moment) => moment.module.name)),
                ];
                const uniqueSubmodules = [
                    ...new Set(
                        moments
                            .filter((moment) => moment.submodule)
                            .map((moment) => moment.submodule.name)
                    ),
                ];
                setCourses(uniqueCourses.reverse());
                setModules(uniqueModules);
                setSubmodules(uniqueSubmodules);
            })
            .catch((error) => {
                alert(error.message);
            });
    }, [selectedModule]);

    // Apply filters when selection changes
    useEffect(() => {
        let filtered = evaluationMoments;

        if (selectedCourse) {
            filtered = filtered.filter(
                (moment) => moment.course.name === selectedCourse
            );
        }

        if (selectedModule) {
            filtered = filtered.filter(
                (moment) => moment.module.name === selectedModule
            );
        }

        if (selectedSubmodule) {
            filtered = filtered.filter(
                (moment) =>
                    moment.submodule &&
                    moment.submodule.name === selectedSubmodule
            );
        }

        setFilteredEvaluationMoments(filtered);
    }, [selectedCourse, selectedModule, selectedSubmodule, evaluationMoments]);

    return (
        <div className="table-list-container">
            <header>
                <h1>Momentos de Avaliação</h1>
            </header>

            <div className="filters">
                <label>
                    Curso:
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                    >
                        <option value="">Todos os Cursos</option>
                        {courses.map((course) => (
                            <option key={course} value={course}>
                                {course}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Módulo:
                    <select
                        value={selectedModule}
                        onChange={(e) => setSelectedModule(e.target.value)}
                    >
                        <option value="">Todos os Módulos</option>
                        {modules.map((module) => (
                            <option key={module} value={module}>
                                {module}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Submódulo:
                    <select
                        value={selectedSubmodule}
                        onChange={(e) => setSelectedSubmodule(e.target.value)}
                    >
                        <option value="">Todos os Submódulos</option>
                        {submodules.map((submodule) => (
                            <option key={submodule} value={submodule}>
                                {submodule}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <table className="table-list" border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Tipo</th>
                        <th>Curso</th>
                        <th>Módulo</th>
                        <th>Submódulo</th>
                        <th>Data</th>
                        <th>Professor</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEvaluationMoments.map((moment) => (
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
