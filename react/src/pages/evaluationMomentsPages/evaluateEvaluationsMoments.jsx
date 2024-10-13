import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import endpoints from "../../endpoints";
import ButtonMenu from "../../components/ButtonMenu";
import { evaluationMomentsMenuButtons } from "../../../scripts/buttonsData";
import { ClipLoader } from "react-spinners";
import customFetch from "../../../scripts/customFetch";

const EvaluateEvaluationMoments = () => {
    const { accessTokenData, setAccessTokenData } = useAuth();
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
    const [grades, setGrades] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        customFetch(endpoints.GET_COURSES, accessTokenData, setAccessTokenData)
            .then((data) => {
                setCourses(data.courses);
            })
            .catch((error) => setErrorMessage(error.message));
    }, [accessTokenData]);

    useEffect(() => {
        if (selectedCourse) {
            customFetch(
                `${endpoints.GET_PROFESSOR_EVALUATION_MOMENTS}?course_id=${selectedCourse}`,
                accessTokenData,
                setAccessTokenData
            )
                .then((data) => {
                    setEvaluationMoments(data.evaluationMoments);

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
        if (selectedCourse) {
            setLoading(true);
            customFetch(
                `${endpoints.GET_STUDENTS}?course_id=${selectedCourse}`,
                accessTokenData,
                setAccessTokenData
            )
                .then((data) => {
                    setStudents(data.students);
                })
                .catch((error) => setErrorMessage(error.message))
                .finally(() => setLoading(false));
        } else {
            setStudents([]);
        }
    }, [selectedCourse, accessTokenData]);

    const handleGradeChange = (studentId, value) => {
        const grade = Math.max(0, Math.min(20, parseFloat(value) || 0));
        setGrades({
            ...grades,
            [studentId]: grade,
        });
    };

    const handleSubmitGrades = () => {
        if (!selectedEvaluationMoment) {
            alert("Selecione um momento de avaliação.");
            return;
        }
        if (loading) {
            alert("Aguarde a submissão das notas.");
            return;
        }

        const gradeData = students.map((student) => ({
            student_id: student.student_id,
            evaluation_moment_id: selectedEvaluationMoment,
            evaluation_moment_grade_value: grades[student.student_id] || 0,
        }));

        if (
            gradeData.some((grade) => grade.evaluation_moment_grade_value === 0)
        ) {
            alert("Todos os alunos devem ter uma nota.");
            return;
        }

        setLoading(true);
        customFetch(
            endpoints.SUBMIT_EVALUATION_MOMENT_GRADES,
            accessTokenData,
            setAccessTokenData,
            "POST",
            { grades: gradeData }
        )
            .then((data) => {
                setGrades({});
                setSelectedEvaluationMoment("");
                alert("Notas submetidas com sucesso!");
            })
            .catch((error) => {
                console.error(error);
                setErrorMessage(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

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
            <ButtonMenu buttons={evaluationMomentsMenuButtons} />
            <header>
                <h1>Avaliações dos Alunos</h1>
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
                        <option value="">Selecione um Curso</option>
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
                        disabled={!selectedCourse} // Disable if no course is selected
                    >
                        <option value="">Selecione um Módulo</option>
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
                        disabled={!selectedModule} // Disable if no module is selected
                    >
                        <option value="">Selecione um Submódulo</option>
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
                        disabled={!selectedCourse || !selectedModule} // Disable if no course or module is selected
                    >
                        <option value="">
                            Selecione um Momento de Avaliação
                        </option>
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

            <h2>Alunos</h2>
            <table className="table-list" border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Nome </th>
                        <th>Número </th>
                        <th>Inserir Nota</th>
                    </tr>
                </thead>
                <tbody>
                    {!selectedCourse && (
                        <tr>
                            <td colSpan="3">
                                Selecione um curso para continuar.
                            </td>
                        </tr>
                    )}

                    {selectedCourse &&
                        students.length > 0 &&
                        students.map((student) => (
                            <tr key={student.student_id}>
                                <td>{student.name}</td>
                                <td>{student.number}</td>
                                <td>
                                    <input
                                        type="number"
                                        min="0"
                                        max="20"
                                        step="0.1"
                                        value={
                                            grades[student.student_id] !==
                                            undefined
                                                ? grades[student.student_id]
                                                : ""
                                        }
                                        onChange={(e) =>
                                            handleGradeChange(
                                                student.student_id,
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </td>
                            </tr>
                        ))}

                    {selectedCourse && !loading && students.length === 0 && (
                        <tr>
                            <td colSpan="3">
                                Nenhum aluno inscrito no curso selecionado
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {selectedCourse && loading && (
                <p>
                    Loading... <ClipLoader size={15} />
                </p>
            )}

            {selectedCourse && students.length > 0 && (
                <button className="buttons" onClick={handleSubmitGrades}>
                    Submeter Notas
                </button>
            )}
        </div>
    );
};

export default EvaluateEvaluationMoments;
