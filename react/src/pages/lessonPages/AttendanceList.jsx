import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import endpoints from "../../endpoints";
import ButtonMenu from "../../components/ButtonMenu";
import { lessonsMenuButtons } from "../../../scripts/buttonsData";
import customFetch from "../../../scripts/customFetch";
import ClipLoader from "react-spinners/ClipLoader"; // Import ClipLoader

const AttendanceList = () => {
    const { accessTokenData, setAccessTokenData } = useAuth();
    const [courses, setCourses] = useState([]);
    const [submodules, setSubmodules] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedSubmodule, setSelectedSubmodule] = useState("");
    const [selectedLesson, setSelectedLesson] = useState("");
    const [loading, setLoading] = useState(false); // Add loading state

    const [updatedAttendance, setUpdatedAttendance] = useState({
        present: [],
        absent: [],
    });

    useEffect(() => {
        customFetch(endpoints.GET_COURSES, accessTokenData, setAccessTokenData)
            .then((data) => setCourses(data.courses.reverse()))
            .catch((error) =>
                alert("Failed to fetch courses: " + error.message)
            );
    }, [accessTokenData.access_token]);

    useEffect(() => {
        if (selectedCourse) {
            customFetch(
                `${endpoints.GET_SUBMODULES_OF_PROFESSOR}?course_id=${selectedCourse}`,
                accessTokenData,
                setAccessTokenData
            )
                .then((data) => setSubmodules(data.submodules))
                .catch((error) =>
                    alert("Failed to fetch submodules: " + error.message)
                );
        } else {
            setSubmodules([]);
        }
    }, [selectedCourse, accessTokenData.access_token]);

    useEffect(() => {
        if (selectedCourse && selectedSubmodule) {
            customFetch(
                `${endpoints.GET_FILTERED_LESSONS}?course_id=${selectedCourse}&submodule_id=${selectedSubmodule}`,
                accessTokenData,
                setAccessTokenData
            )
                .then((data) => setLessons(data.lessons))
                .catch((error) =>
                    alert("Failed to fetch lessons: " + error.message)
                );
        } else {
            setLessons([]);
        }
    }, [selectedCourse, selectedSubmodule, accessTokenData.access_token]);

    useEffect(() => {
        if (selectedLesson) {
            setLoading(true); // Set loading to true when fetching starts
            customFetch(
                `${endpoints.GET_ATTENDANCE}?lesson_id=${selectedLesson}`,
                accessTokenData,
                setAccessTokenData
            )
                .then((data) => {
                    setUpdatedAttendance({
                        present: data.presentStudents,
                        absent: data.absentStudents,
                    });
                })
                .catch((error) =>
                    alert("Failed to fetch attendance: " + error.message)
                )
                .finally(() => setLoading(false)); // Set loading to false when fetching ends
        } else {
            setUpdatedAttendance({ present: [], absent: [] });
        }
    }, [selectedLesson, accessTokenData.access_token]);

    const moveStudent = (student, from, to) => {
        setUpdatedAttendance((prev) => ({
            ...prev,
            [from]: prev[from].filter(
                (s) => s.student_id !== student.student_id
            ),
            [to]: [...prev[to], student],
        }));
        console.log(
            updatedAttendance.present.map((student) => student.student_id)
        );
    };

    const handleSubmit = () => {
        customFetch(
            endpoints.UPDATE_ATTENDANCE + `/${selectedLesson}`,
            accessTokenData,
            setAccessTokenData,
            "PUT",
            {
                studentsPresent: updatedAttendance.present.map(
                    (student) => student.student_id
                ),
                lesson_id: selectedLesson,
            }
        )
            .then((data) => {
                alert(data.message);
            })
            .catch((error) => {
                console.error("Error:", error.message);
                alert(error.message);
            });
    };

    return (
        <div>
            <ButtonMenu buttons={lessonsMenuButtons} />
            <div className="table-list-container">
                <h1>Presenças</h1>

                <div className="filters">
                    <label>
                        Curso:
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                        >
                            <option value="">Selecione um curso</option>
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
                        Submódulo:
                        <select
                            value={selectedSubmodule}
                            onChange={(e) =>
                                setSelectedSubmodule(e.target.value)
                            }
                            disabled={!selectedCourse}
                        >
                            <option value="">Selecione um submódulo</option>
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
                    <label>
                        Aula:
                        <select
                            value={selectedLesson}
                            onChange={(e) => setSelectedLesson(e.target.value)}
                            disabled={!selectedSubmodule}
                        >
                            <option value="">Selecione uma aula</option>
                            {lessons.map((lesson) => (
                                <option
                                    key={lesson.lesson_id}
                                    value={lesson.lesson_id}
                                >
                                    {lesson.title}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                <div className="container">
                    <div className="list">
                        <h2>Alunos Presentes</h2>
                        {loading ? (
                            <>
                                Loading <ClipLoader size={15} />
                            </>
                        ) : (
                            <ul>
                                {(updatedAttendance.present || []).map(
                                    (student) => (
                                        <li key={student.student_id}>
                                            {student.name}
                                            <button
                                                className="buttons"
                                                onClick={() =>
                                                    moveStudent(
                                                        student,
                                                        "present",
                                                        "absent"
                                                    )
                                                }
                                            >
                                                →
                                            </button>
                                        </li>
                                    )
                                )}
                            </ul>
                        )}
                    </div>
                    <div className="list">
                        <h2>Alunos Ausentes</h2>
                        {loading ? (
                            <>
                                Loading <ClipLoader size={15} />
                            </>
                        ) : (
                            <ul>
                                {(updatedAttendance.absent || []).map(
                                    (student) => (
                                        <li key={student.student_id}>
                                            <button
                                                className="buttons"
                                                onClick={() =>
                                                    moveStudent(
                                                        student,
                                                        "absent",
                                                        "present"
                                                    )
                                                }
                                            >
                                                ←
                                            </button>
                                            {student.name}
                                        </li>
                                    )
                                )}
                            </ul>
                        )}
                    </div>
                </div>
                <button className="buttons" onClick={handleSubmit}>
                    Submeter
                </button>
            </div>
        </div>
    );
};

export default AttendanceList;
