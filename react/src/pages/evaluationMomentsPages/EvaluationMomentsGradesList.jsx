import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import endpoints from "../../endpoints";
import ButtonMenu from "../../components/ButtonMenu";
import { evaluationMomentsMenuButtons } from "../../../scripts/buttonsData";
import customFetch from "../../../scripts/customFetch";
import ClipLoader from "react-spinners/ClipLoader"; // Import ClipLoader

const EvaluationMomentsGradesList = () => {
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
    const [editedGrade, setEditedGrade] = useState({});
    const [loading, setLoading] = useState(false); // Add loading state

    useEffect(() => {
        // Fetch all courses
        customFetch(endpoints.GET_COURSES, accessTokenData, setAccessTokenData)
            .then((data) => {
                setCourses(data.courses.reverse());
            })
            .catch((error) => {
                console.error(error);
                alert(error);
            });
    }, [accessTokenData]);

    useEffect(() => {
        if (selectedCourse) {
            // Fetch evaluation moments for the selected course
            customFetch(
                `${endpoints.GET_PROFESSOR_EVALUATION_MOMENTS}?course_id=${selectedCourse}`,
                accessTokenData,
                setAccessTokenData
            )
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
                .catch((error) => {
                    console.error(error);
                    alert(error);
                });
        } else {
            setEvaluationMoments([]);
            setModules([]);
            setSubmodules([]);
        }
    }, [selectedCourse, accessTokenData]);

    useEffect(() => {
        if (selectedEvaluationMoment) {
            setLoading(true); // Start loading
            customFetch(
                `${endpoints.GET_STUDENTS_EVALUATION_MOMENT_GRADES}/${selectedEvaluationMoment}`,
                accessTokenData,
                setAccessTokenData
            )
                .then((data) => {
                    setStudents(data.students_grades);
                })
                .catch((error) => {
                    console.error(error);
                    alert(error);
                })
                .finally(() => setLoading(false)); // Stop loading
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

    const handleEditClick = (student) => {
        setEditedGrade(student);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedGrade({ ...editedGrade, [name]: value });
    };

    const handleSave = (studentId) => {
        if (!window.confirm("Tem certeza que deseja atualizar esta nota?")) {
            return;
        }
        customFetch(
            `${endpoints.UPDATE_STUDENT_GRADE}/${selectedEvaluationMoment}/${studentId}`,
            accessTokenData,
            setAccessTokenData,
            "PUT",
            { evaluation_moment_grade_value: editedGrade.grade }
        )
            .then(() => {
                setStudents((prevStudents) =>
                    prevStudents.map((student) =>
                        student.student_id === studentId
                            ? { ...student, grade: editedGrade.grade }
                            : student
                    )
                );
                setEditedGrade({});
                alert("Grade updated successfully");
            })
            .catch((error) => console.error(error));
    };

    const handleDelete = (studentId) => {
        if (!window.confirm("Are you sure you want to delete this grade?")) {
            return;
        }
        customFetch(
            `${endpoints.DELETE_STUDENT_GRADE}/${selectedEvaluationMoment}/${studentId}`,
            accessTokenData,
            setAccessTokenData,
            "DELETE"
        )
            .then(() => {
                setStudents((prevStudents) =>
                    prevStudents.map((student) =>
                        student.student_id === studentId
                            ? { ...student, grade: null }
                            : student
                    )
                );
                alert("Nota apagada com sucesso");
            })
            .catch((error) => {
                console.error(error);
                alert(error);
            });
    };

    return (
        <div className="table-list-container">
            <ButtonMenu buttons={evaluationMomentsMenuButtons} />
            <header>
                <h1>Avaliação dos Alunos</h1>
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
                        <option value="">Selecione um curso</option>
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
                        <option value="">Selecione um módulo</option>
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
                        <option value="">Selecione um submódulo</option>
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
                            Selecione um momento de avaliação
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
                        <th>Nome</th>
                        <th>Número</th>
                        <th>Nota</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="4">
                                Loading <ClipLoader size={15} />
                            </td>
                        </tr>
                    ) : !selectedEvaluationMoment ? (
                        <tr>
                            <td colSpan="4">
                                Selecione um momento de avaliação.
                            </td>
                        </tr>
                    ) : students.length === 0 ? (
                        <tr>
                            <td colSpan="4">
                                Não existem notas atribuídas a este momento de
                                avaliação.
                            </td>
                        </tr>
                    ) : (
                        students.map((student) => (
                            <tr key={student.student_id}>
                                {editedGrade.student_id ===
                                student.student_id ? (
                                    <>
                                        <td>{student.student_name}</td>
                                        <td>{student.student_number}</td>
                                        <td>
                                            <input
                                                type="number"
                                                name="grade"
                                                value={editedGrade.grade}
                                                onChange={handleChange}
                                                min="0"
                                                max="20"
                                                step="0.01"
                                            />
                                        </td>
                                        <td>
                                            <button
                                                className="buttons"
                                                onClick={() =>
                                                    handleSave(
                                                        student.student_id
                                                    )
                                                }
                                            >
                                                Save
                                            </button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{student.student_name}</td>
                                        <td>{student.student_number}</td>
                                        <td>{student.grade}</td>
                                        <td>
                                            <button
                                                className="buttons"
                                                onClick={() =>
                                                    handleEditClick(student)
                                                }
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="buttons"
                                                onClick={() =>
                                                    handleDelete(
                                                        student.student_id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default EvaluationMomentsGradesList;
