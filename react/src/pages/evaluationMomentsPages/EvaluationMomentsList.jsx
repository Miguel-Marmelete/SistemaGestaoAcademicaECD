import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import endpoints from "../../endpoints";
import ButtonMenu from "../../components/ButtonMenu";
import { evaluationMomentsMenuButtons } from "../../../scripts/buttonsData";
import { fetchCoursesAndModulesOfProfessor } from "../../../scripts/getCoursesandModulesOfProfessor";
import customFetch from "../../../scripts/customFetch";

const EvaluationMomentsList = () => {
    const [evaluationMoments, setEvaluationMoments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [modules, setModules] = useState([]);
    const [submodules, setSubmodules] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedModule, setSelectedModule] = useState("");
    const [selectedSubmodule, setSelectedSubmodule] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { accessTokenData, setAccessTokenData } = useAuth();

    useEffect(() => {
        fetchCoursesAndModulesOfProfessor(accessTokenData.access_token)
            .then((data) => {
                setCourses(data.courses);
                setModules(data.modules);
            })
            .catch((error) => {
                setErrorMessage(
                    "Failed to fetch courses and modules: " + error.message
                );
            });
    }, [accessTokenData.access_token]);

    useEffect(() => {
        if (selectedModule) {
            fetch(
                `${endpoints.GET_SUBMODULES_OF_PROFESSOR}?module_id=${selectedModule}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessTokenData.access_token}`,
                    },
                }
            )
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch submodules");
                    }
                    return response.json();
                })
                .then((data) => {
                    setSubmodules(data.submodules);
                })
                .catch((error) => {
                    setErrorMessage(
                        "Failed to load submodules: " + error.message
                    );
                });
        } else {
            setSubmodules([]);
        }
    }, [selectedModule, accessTokenData.access_token]);

    useEffect(() => {
        if (selectedCourse) {
            customFetch(
                `${endpoints.GET_EVALUATION_MOMENTS_OF_PROFESSOR}?course_id=${selectedCourse}&module_id=${selectedModule}&submodule_id=${selectedSubmodule}`,
                accessTokenData,
                setAccessTokenData
            )
                .then((data) => {
                    setEvaluationMoments(data.evaluationMoments);
                })
                .catch((error) => {
                    setErrorMessage(
                        "Failed to load evaluation moments: " + error.message
                    );
                });
        }
    }, [
        selectedCourse,
        selectedModule,
        selectedSubmodule,
        accessTokenData.access_token,
    ]);

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
                                setSelectedModule("");
                                setSelectedSubmodule("");
                            }}
                        >
                            <option value="">Todos os Cursos</option>
                            {courses.map((course) => (
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
                            onChange={(e) => {
                                setSelectedModule(e.target.value);
                                setSelectedSubmodule("");
                            }}
                            disabled={!selectedCourse}
                        >
                            <option value="">Todos os Módulos</option>
                            {modules
                                .filter(
                                    (module) =>
                                        !selectedCourse ||
                                        module.course_id ===
                                            parseInt(selectedCourse)
                                )
                                .map((module) => (
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
                            disabled={!selectedModule}
                        >
                            <option value="">Todos os Submódulos</option>
                            {submodules.map((submodule) => (
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
                            {evaluationMoments.length > 0 ? (
                                evaluationMoments.map((moment) => (
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
