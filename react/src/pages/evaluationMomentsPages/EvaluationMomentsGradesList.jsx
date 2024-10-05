import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import endpoints from "../../endpoints";
import ButtonMenu from "../../components/ButtonMenu";
import { evaluationMomentsMenuButtons } from "../../../scripts/buttonsData";

const EvaluationMomentsGradesList = () => {
    const { accessTokenData } = useAuth();
    const [evaluationMoments, setEvaluationMoments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [modules, setModules] = useState([]);
    const [submodules, setSubmodules] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedModule, setSelectedModule] = useState("");
    const [selectedSubmodule, setSelectedSubmodule] = useState("");
    const [selectedEvaluationMoment, setSelectedEvaluationMoment] =
        useState("");
    const [students, setStudents] = useState([]);

    useEffect(() => {
        // Fetch all courses
        fetch(endpoints.GET_COURSES, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setCourses(data.courses);
            })
            .catch((error) => setErrorMessage(error.message));
    }, [accessTokenData]);

    useEffect(() => {
        if (selectedCourse) {
            // Fetch evaluation moments for the selected course
            fetch(
                `${endpoints.GET_PROFESSOR_EVALUATION_MOMENTS}?course_id=${selectedCourse}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessTokenData.access_token}`,
                    },
                }
            )
                .then((response) => response.json())
                .then((data) => {
                    setEvaluationMoments(data.evaluationMoments);

                    // Extract unique modules and submodules
                    const uniqueModules = [
                        ...new Set(
                            data.evaluationMoments.map(
                                (moment) => moment.module.module_id
                            )
                        ),
                    ].map(
                        (id) =>
                            data.evaluationMoments.find(
                                (moment) => moment.module.module_id === id
                            ).module
                    );

                    const uniqueSubmodules = [
                        ...new Set(
                            data.evaluationMoments
                                .map(
                                    (moment) =>
                                        moment.submodule &&
                                        moment.submodule.submodule_id
                                )
                                .filter((submodule) => submodule)
                        ),
                    ].map(
                        (id) =>
                            data.evaluationMoments.find(
                                (moment) =>
                                    moment.submodule &&
                                    moment.submodule.submodule_id === id
                            ).submodule
                    );

                    setModules(uniqueModules);
                    setSubmodules(uniqueSubmodules);
                })
                .catch((error) => setErrorMessage(error.message));
        } else {
            setEvaluationMoments([]);
            setModules([]);
            setSubmodules([]);
        }
    }, [selectedCourse, accessTokenData]);

    useEffect(() => {
        if (selectedEvaluationMoment) {
            // Fetch students for the selected course
            fetch(
                `${endpoints.GET_STUDENTS_EVALUATION_MOMENT_GRADES}/${selectedEvaluationMoment}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessTokenData.access_token}`,
                    },
                }
            )
                .then((response) => response.json())
                .then((data) => {
                    setStudents(data.students_grades);
                })
                .catch((error) => setErrorMessage(error.message));
        } else {
            setStudents([]);
        }
    }, [selectedEvaluationMoment, accessTokenData]);

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
        <div className="table-list-container">
            <header>
                <h1>Avaliação dos Estudantes</h1>
            </header>

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
                        onChange={(e) => setSelectedSubmodule(e.target.value)}
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

                <label>
                    Momento de Avaliação:
                    <select
                        value={selectedEvaluationMoment}
                        onChange={(e) =>
                            setSelectedEvaluationMoment(e.target.value)
                        }
                    >
                        <option value="">Todos os Momentos de Avaliação</option>
                        {filteredEvaluationMoments.length > 0 &&
                            filteredEvaluationMoments.map((moment) => (
                                <option
                                    key={moment.evaluation_moment_id}
                                    value={moment.evaluation_moment_id}
                                >
                                    {moment.type} - {moment.date}
                                </option>
                            ))}
                    </select>
                </label>
            </div>

            <h2>Estudantes</h2>
            <table className="table-list" border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Nome </th>
                        <th>Número </th>
                        <th>Nota</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length > 0 &&
                        students.map((student) => (
                            <tr key={student.student_id}>
                                <td>{student.student_name}</td>
                                <td>{student.student_number}</td>
                                <td>{student.grade}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

export default EvaluationMomentsGradesList;
