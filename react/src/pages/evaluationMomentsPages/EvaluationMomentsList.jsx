import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import endpoints from "../../endpoints";
import ButtonMenu from "../../components/ButtonMenu";
import { evaluationMomentsMenuButtons } from "../../../scripts/buttonsData";
import customFetch from "../../../scripts/customFetch";

const EvaluationMomentsList = () => {
    const [evaluationMoments, setEvaluationMoments] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedModule, setSelectedModule] = useState("");
    const [coursesModules, setCoursesModules] = useState([]);
    const [modules, setModules] = useState([]);
    const { accessTokenData } = useAuth();

    useEffect(() => {
        fetch(endpoints.GET_MODULES_OF_COURSE_OF_PROFESSOR, {
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setCoursesModules(data.courseModules);
            });
    }, [accessTokenData.access_token]);

    useEffect(() => {
        if (selectedCourse) {
            const selectedCourseModules = coursesModules.find(
                (course) => course.course.course_id === parseInt(selectedCourse)
            );
            setModules(selectedCourseModules ? selectedCourseModules.modules : []);
        } else {
            setModules([]);
        }
    }, [selectedCourse, coursesModules]);

    useEffect(() => {
        if (selectedCourse && selectedModule) {
            fetch(`${endpoints.GET_PROFESSOR_EVALUATION_MOMENTS}?course_id=${selectedCourse}&module_id=${selectedModule}`, {
                headers: {
                    Authorization: `Bearer ${accessTokenData.access_token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setEvaluationMoments(data.evaluationMoments);
                })
                .catch(error => {
                    console.error('Error fetching evaluation moments:', error);
                    setEvaluationMoments([]);
                });
        } else {
            setEvaluationMoments([]);
        }
    }, [selectedCourse, selectedModule, accessTokenData.access_token]);

    const handleCourseChange = (e) => {
        const courseId = e.target.value;
        setSelectedCourse(courseId);
        setSelectedModule(""); // Reset module when course changes

        if (courseId) {
            const selectedCourseModules = coursesModules.find(
                (course) => course.course.course_id === parseInt(courseId)
            );
            setModules(selectedCourseModules ? selectedCourseModules.modules : []);
        } else {
            setModules([]);
        }
    };

    const handleModuleChange = (e) => {
        setSelectedModule(e.target.value);
    };

    return (
        <div>
            <ButtonMenu buttons={evaluationMomentsMenuButtons} />
            <div className="table-list-container">
                <header>
                    <h1>Momentos de Avaliação</h1>
                </header>

                <div className="filters">
                    <label>
                        Curso:
                        <select
                            value={selectedCourse}
                            onChange={handleCourseChange}
                        >
                            <option value="">Todos os Cursos</option>
                            {coursesModules.map((course) => (
                                <option
                                    key={course.course.course_id}
                                    value={course.course.course_id}
                                >
                                    {course.course.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Módulo:
                        <select
                            value={selectedModule}
                            onChange={handleModuleChange}
                            disabled={!selectedCourse || modules.length === 0}
                        >
                            <option value="">Todos os Módulos</option>
                            {modules.map((module) => (
                                <option
                                    key={module.module_id}
                                    value={module.module_id}
                                >
                                    {module.name}
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
                        </tr>
                    </thead>
                    <tbody>
                        {evaluationMoments.length > 0 ? (
                            evaluationMoments.map((moment) => (
                                <tr key={moment.evaluation_moment_id}>
                                    <td>{moment.type}</td>
                                    <td>{moment.course?.name}</td>
                                    <td>{moment.module?.name}</td>
                                    <td>{moment.submodule?.name || 'N/A'}</td>
                                    <td>{moment.date ? new Date(moment.date).toLocaleDateString() : 'N/A'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">
                                    Nenhum momento de avaliação encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EvaluationMomentsList;