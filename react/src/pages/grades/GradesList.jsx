import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import customFetch from "../../../scripts/customFetch";
import endpoints from "../../endpoints";
import { ClipLoader } from "react-spinners";

const GradesList = () => {
    const { accessTokenData, setAccessTokenData } = useAuth();
    const [courses, setCourses] = useState([]);
    const [modules, setModules] = useState([]);
    const [students, setStudents] = useState([]); // Initialize as empty array
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedModule, setSelectedModule] = useState("");
    const [grades, setGrades] = useState({});
    const [loading, setLoading] = useState(false); // New loading state

    // Fetch courses and modules on component mount
    useEffect(() => {
        customFetch(
            endpoints.GET_MODULES_OF_COURSE_OF_PROFESSOR,
            accessTokenData,
            setAccessTokenData
        )
            .then((data) => {
                setCourses(data.courseModules.reverse());
            })
            .catch((error) => {
                console.error(error);
                alert(error);
            });
    }, [accessTokenData, setAccessTokenData]);

    // Fetch students and grades when a course and module are selected
    useEffect(() => {
        if (selectedCourse && selectedModule) {
            setLoading(true); // Set loading to true before fetching
            customFetch(
                `${endpoints.GET_STUDENTS_WITH_GRADES}?course_id=${selectedCourse}&module_id=${selectedModule}`,
                accessTokenData,
                setAccessTokenData
            )
                .then((data) => {
                    // Check if data.students exists and is an array
                    if (data.students && Array.isArray(data.students)) {
                        setStudents(data.students);
                        // Initialize grades state with existing grades
                        const initialGrades = {};
                        data.students.forEach((student) => {
                            initialGrades[student.student_id] =
                                student.grade_value;
                        });
                        setGrades(initialGrades);
                    } else {
                        console.error("Unexpected data format", data);
                        setStudents([]);
                        setGrades({});
                    }
                })
                .catch((error) => {
                    console.error(error);
                    alert(error);
                })
                .finally(() => {
                    setLoading(false); // Set loading to false after fetching
                });
        }
    }, [selectedCourse, selectedModule, accessTokenData, setAccessTokenData]);

    const handleCourseChange = (e) => {
        const courseId = e.target.value;
        setSelectedCourse(courseId);
        setSelectedModule("");

        // Find the modules for the selected course
        const selectedCourseModules = courses.find(
            (course) => course.course.course_id === parseInt(courseId)
        );
        setModules(selectedCourseModules ? selectedCourseModules.modules : []);
    };

    const handleGradeChange = (studentId, value) => {
        setGrades((prevGrades) => ({
            ...prevGrades,
            [studentId]: value,
        }));
    };

    const submitGrades = (gradesToSubmit) => {
        customFetch(
            endpoints.SUBMIT_GRADES,
            accessTokenData,
            setAccessTokenData,
            "POST",
            { grades: gradesToSubmit }
        )
            .then(() => alert("Notas submetidas com sucesso"))
            .catch((error) => {
                console.error("Error submitting grades:", error);
                alert(error);
            });
    };

    const handleGradeSubmit = (studentId) => {
        const gradeValue = grades[studentId];
        if (gradeValue === undefined) return;

        const gradeData = [
            {
                module_id: selectedModule,
                student_id: studentId,
                course_id: selectedCourse,
                grade_value: parseInt(gradeValue),
            },
        ];

        submitGrades(gradeData);
    };

    const handleSubmitAllGrades = () => {
        const allGradesData = students
            .map((student) => ({
                module_id: selectedModule,
                student_id: student.student_id,
                course_id: selectedCourse,
                grade_value: parseInt(grades[student.student_id]) || null,
            }))
            .filter((grade) => grade.grade_value !== null);

        if (allGradesData.length > 0) {
            submitGrades(allGradesData);
        } else {
            alert("Não existem notas para submeter");
        }
    };

    return (
        <div>
            <div className="table-list-container">
                <header>
                    <h1>Pauta</h1>
                </header>

                <div className="filters">
                    <label>
                        Curso:
                        <select
                            value={selectedCourse}
                            onChange={handleCourseChange}
                        >
                            <option value="">Selecione um curso</option>
                            {courses.length > 0 &&
                                courses.map((course) => (
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
                            onChange={(e) => setSelectedModule(e.target.value)}
                            disabled={!selectedCourse}
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
                </div>

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
                        ) : selectedCourse && selectedModule ? (
                            students.length > 0 ? (
                                students.map((student) => (
                                    <tr key={student.student_id}>
                                        <td>{student.student_name}</td>
                                        <td>{student.student_number}</td>
                                        <td>
                                            <input
                                                type="number"
                                                min="0"
                                                max="20"
                                                value={
                                                    grades[
                                                        student.student_id
                                                    ] || ""
                                                }
                                                placeholder={
                                                    student.grade_value === null
                                                        ? "Nota não definida"
                                                        : undefined
                                                }
                                                onChange={(e) =>
                                                    handleGradeChange(
                                                        student.student_id,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </td>
                                        <td>
                                            <button
                                                className="buttons"
                                                onClick={() =>
                                                    handleGradeSubmit(
                                                        student.student_id
                                                    )
                                                }
                                            >
                                                Guardar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">Nenhum aluno encontrado</td>
                                </tr>
                            )
                        ) : (
                            <tr>
                                <td colSpan="4">
                                    Selecione um curso e um módulo
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {students.length > 0 && selectedCourse && selectedModule && (
                    <button className="buttons" onClick={handleSubmitAllGrades}>
                        Submeter
                    </button>
                )}
            </div>
        </div>
    );
};

export default GradesList;
