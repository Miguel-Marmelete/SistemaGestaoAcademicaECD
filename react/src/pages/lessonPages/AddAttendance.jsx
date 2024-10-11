import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import endpoints from "../../endpoints";
import ButtonMenu from "../../components/ButtonMenu";
import { lessonsMenuButtons } from "../../../scripts/buttonsData";
import customFetch from "../../../scripts/customFetch";
import { ClipLoader } from "react-spinners"; // Import ClipLoader

const AddAttendance = () => {
    const { accessTokenData, setAccessTokenData } = useAuth();
    const [courses, setCourses] = useState([]);
    const [submodules, setSubmodules] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedSubmodule, setSelectedSubmodule] = useState("");
    const [selectedLesson, setSelectedLesson] = useState("");
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingStudents, setLoadingStudents] = useState(false); // New state for loading students

    useEffect(() => {
        customFetch(endpoints.GET_COURSES, accessTokenData, setAccessTokenData)
            .then((data) => {
                setCourses(data.courses.reverse());
            })
            .catch((error) => {
                console.error(error);
                alert(error);
            });
    }, []);

    useEffect(() => {
        if (selectedCourse && selectedSubmodule) {
            setLoadingLessons(true);
            customFetch(
                `${endpoints.GET_FILTERED_LESSONS}?course_id=${selectedCourse}&submodule_id=${selectedSubmodule}`,
                accessTokenData,
                setAccessTokenData
            )
                .then((data) => {
                    setLessons(data.lessons);
                })
                .catch((error) => {
                    console.error(error);
                    alert(error);
                })
                .finally(() => {
                    setLoadingLessons(false);
                });
        } else {
            setLessons([]);
        }
    }, [selectedCourse, selectedSubmodule, accessTokenData.access_token]);

    useEffect(() => {
        if (selectedCourse) {
            setLoadingStudents(true); // Start loading students
            customFetch(
                `${endpoints.GET_STUDENTS}?course_id=${selectedCourse}`,
                accessTokenData,
                setAccessTokenData
            )
                .then((studentsData) => {
                    console.log(studentsData.students);
                    setStudents(studentsData.students);
                })
                .catch((error) => {
                    alert(error);
                })
                .finally(() => {
                    setLoadingStudents(false); // Stop loading students
                });
        }
    }, [selectedCourse]);

    useEffect(() => {
        if (selectedCourse) {
            customFetch(
                `${endpoints.GET_SUBMODULES_OF_PROFESSOR}?course_id=${selectedCourse}`,
                accessTokenData,
                setAccessTokenData
            )
                .then((submodulesData) => {
                    setSubmodules(submodulesData.submodules);
                })
                .catch((error) => {
                    alert(error);
                });
        }
    }, [selectedCourse]);

    useEffect(() => {
        setSelectedSubmodule("");
        setSelectedLesson("");
    }, [selectedCourse]);

    const handleStudentCheckboxChange = (e) => {
        const { value, checked } = e.target;
        const numericValue = parseInt(value, 10);

        setSelectedStudents((prevSelectedStudents) => {
            if (checked) {
                return [...prevSelectedStudents, numericValue];
            } else {
                return prevSelectedStudents.filter((id) => id !== numericValue);
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedLesson || selectedStudents.length === 0) {
            alert("Please select a lesson and at least one student.");
            return;
        }
        if (loading) {
            return;
        }
        setLoading(true);

        customFetch(
            endpoints.REGIST_ATTENDANCE,
            accessTokenData,
            setAccessTokenData,
            "POST",
            {
                lesson_id: selectedLesson,
                student_ids: selectedStudents,
            }
        )
            .then(() => {
                alert("Attendance registered successfully.");
                resetForm();
            })
            .catch((error) =>
                alert("Failed to register attendance: " + error.message)
            )
            .finally(() => {
                setLoading(false);
            });
    };

    const resetForm = () => {
        setSelectedCourse("");
        setSelectedSubmodule("");
        setSelectedLesson("");
        setSelectedStudents([]);
    };

    const handleCourseChange = (e) => {
        setSelectedCourse(e.target.value);
        setSelectedSubmodule("");
        setSelectedLesson("");
    };

    return (
        <div>
            <ButtonMenu buttons={lessonsMenuButtons} />
            <div className="container">
                <form className="submitForm" onSubmit={handleSubmit}>
                    <h2>Adicionar Presenças</h2>

                    <div>
                        <label>Curso</label>
                        <select
                            value={selectedCourse}
                            onChange={handleCourseChange}
                            required
                        >
                            <option value="" disabled>
                                Selecione um Curso
                            </option>
                            {courses.map((course) => (
                                <option
                                    key={course.course_id}
                                    value={course.course_id}
                                >
                                    {course.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Submódulo</label>
                        <select
                            value={selectedSubmodule}
                            onChange={(e) =>
                                setSelectedSubmodule(e.target.value)
                            }
                            disabled={!selectedCourse}
                            required
                        >
                            <option value="" disabled>
                                Selecione um Submódulo
                            </option>
                            {submodules.map((submodule) => (
                                <option
                                    key={submodule.submodule_id}
                                    value={submodule.submodule_id}
                                >
                                    {submodule.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Aula</label>
                        <select
                            value={selectedLesson}
                            onChange={(e) => setSelectedLesson(e.target.value)}
                            disabled={!selectedSubmodule}
                            required
                        >
                            <option value="" disabled>
                                {lessons.length === 0
                                    ? "Nenhuma aula encontrada"
                                    : "Selecione uma Aula"}
                            </option>
                            {lessons.map((lesson) => (
                                <option
                                    key={lesson.lesson_id}
                                    value={lesson.lesson_id}
                                >
                                    {lesson.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Alunos</label>
                        <div className="form-table-responsive">
                            <table className="form-table">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Número</th>
                                        <th>Selecionar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loadingStudents ? (
                                        <tr>
                                            <td
                                                colSpan="3"
                                                className="loading-container"
                                            >
                                                <p>
                                                    Loading
                                                    <ClipLoader size={15} />
                                                </p>
                                            </td>
                                        </tr>
                                    ) : students.length > 0 ? (
                                        students.map((student) => (
                                            <tr key={student.student_id}>
                                                <td>{student.name}</td>
                                                <td>{student.number}</td>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        value={
                                                            student.student_id
                                                        }
                                                        checked={selectedStudents.includes(
                                                            student.student_id
                                                        )}
                                                        onChange={
                                                            handleStudentCheckboxChange
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3">
                                                Nenhum aluno inscrito no curso
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? <ClipLoader size={15} /> : "Submeter"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddAttendance;
