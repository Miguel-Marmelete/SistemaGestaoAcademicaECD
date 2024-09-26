import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import endpoints from "../../endpoints";
import ButtonMenu from "../../components/ButtonMenu";
import { evaluationMomentsMenuButtons } from "../../../scripts/buttonsData";
const EvaluationMomentsList = () => {
    const [evaluationMoments, setEvaluationMoments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [modules, setModules] = useState([]);
    const [submodules, setSubmodules] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedModule, setSelectedModule] = useState("");
    const [selectedSubmodule, setSelectedSubmodule] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { accessTokenData } = useAuth();

    useEffect(() => {
        fetch(endpoints.GET_PROFESSOR_EVALUATION_MOMENTS, {
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
                const evaluationMoments = data.evaluationMoments;
                setEvaluationMoments(evaluationMoments);

                // Extract unique courses, modules, and submodules from the evaluation moments
                const uniqueCourses = [
                    ...new Set(
                        evaluationMoments.map(
                            (moment) => moment.course.course_id
                        )
                    ),
                ].map(
                    (id) =>
                        evaluationMoments.find(
                            (moment) => moment.course.course_id === id
                        ).course
                );

                const uniqueModules = [
                    ...new Set(
                        evaluationMoments.map(
                            (moment) => moment.module.module_id
                        )
                    ),
                ].map(
                    (id) =>
                        evaluationMoments.find(
                            (moment) => moment.module.module_id === id
                        ).module
                );

                const uniqueSubmodules = [
                    ...new Set(
                        evaluationMoments
                            .map(
                                (moment) =>
                                    moment.submodule &&
                                    moment.submodule.submodule_id
                            )
                            .filter((submodule) => submodule)
                    ),
                ].map(
                    (id) =>
                        evaluationMoments.find(
                            (moment) =>
                                moment.submodule &&
                                moment.submodule.submodule_id === id
                        ).submodule
                );

                setCourses(uniqueCourses);
                setModules(uniqueModules);
                setSubmodules(uniqueSubmodules);
            })
            .catch((error) => {
                setErrorMessage(error.message);
            });
    }, [accessTokenData.access_token]);

    const filteredEvaluationMoments = evaluationMoments.filter(
        (moment) =>
            (!selectedCourse ||
                moment.course.course_id.toString() === selectedCourse) &&
            (!selectedModule ||
                moment.module.module_id.toString() === selectedModule) &&
            (!selectedSubmodule ||
                (moment.submodule &&
                    moment.submodule.submodule_id.toString() ===
                        selectedSubmodule))
    );

    return (
        <div>
            <ButtonMenu buttons={evaluationMomentsMenuButtons} />
            <div className="table-list-container">
                <header>
                    <h1>Momentos de Avaliação</h1>
                </header>

                {errorMessage && (
                    <p className="error-message">{errorMessage}</p>
                )}

                <div className="filters">
                    <label>
                        Curso:
                        <select
                            value={selectedCourse}
                            onChange={(e) => {
                                setSelectedCourse(e.target.value);
                                setSelectedModule(""); // Reset module when selecting a new course
                                setSelectedSubmodule(""); // Reset submodule
                            }}
                        >
                            <option value="">Todos os Cursos</option>
                            {courses.length > 0 &&
                                courses.map((course) => (
                                    <option
                                        key={course.course_id}
                                        value={course.course_id}
                                    >
                                        {course.name}
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
                            {modules.length > 0 &&
                                modules.map((module) => (
                                    <option
                                        key={module.module_id}
                                        value={module.module_id}
                                    >
                                        {module.name}
                                    </option>
                                ))}
                        </select>
                    </label>

                    <label>
                        Submódulo:
                        <select
                            value={selectedSubmodule}
                            onChange={(e) =>
                                setSelectedSubmodule(e.target.value)
                            }
                        >
                            <option value="">Todos os Submódulos</option>
                            {submodules.length > 0 &&
                                submodules.map((submodule) => (
                                    <option
                                        key={submodule.submodule_id}
                                        value={submodule.submodule_id}
                                    >
                                        {submodule.name}
                                    </option>
                                ))}
                        </select>
                    </label>
                </div>

                {selectedCourse || selectedModule ? (
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
                            {filteredEvaluationMoments.length > 0 ? (
                                filteredEvaluationMoments.map((moment) => (
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
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6">
                                        Nenhum momento de avaliação encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                ) : (
                    <p>Nenhum momento de avaliação encontrado.</p>
                )}
            </div>
        </div>
    );
};

export default EvaluationMomentsList;
