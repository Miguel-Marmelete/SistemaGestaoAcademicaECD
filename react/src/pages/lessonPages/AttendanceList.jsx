import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import endpoints from "../../endpoints";
import ButtonMenu from "../../components/ButtonMenu";
import { lessonsMenuButtons } from "../../../scripts/buttonsData";
import customFetch from "../../../scripts/customFetch";

const AttendanceList = () => {
    const { accessTokenData, setAccessTokenData } = useAuth();
    const [courses, setCourses] = useState([]);
    const [submodules, setSubmodules] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedSubmodule, setSelectedSubmodule] = useState("");
    const [selectedLesson, setSelectedLesson] = useState("");

    const [updatedAttendance, setUpdatedAttendance] = useState({
        present: [],
        absent: [],
    });

    useEffect(() => {
        fetch(endpoints.GET_COURSES, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => setCourses(data.courses.reverse()))
            .catch((error) =>
                alert("Failed to fetch courses: " + error.message)
            );
    }, [accessTokenData.access_token]);

    useEffect(() => {
        if (selectedCourse) {
            fetch(
                `${endpoints.GET_SUBMODULES_OF_PROFESSOR}?course_id=${selectedCourse}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessTokenData.access_token}`,
                    },
                }
            )
                .then((response) => response.json())
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
            fetch(
                `${endpoints.GET_FILTERED_LESSONS}?course_id=${selectedCourse}&submodule_id=${selectedSubmodule}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessTokenData.access_token}`,
                    },
                }
            )
                .then((response) => response.json())
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
            fetch(`${endpoints.GET_ATTENDANCE}?lesson_id=${selectedLesson}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessTokenData.access_token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setUpdatedAttendance({
                        present: data.presentStudents,
                        absent: data.absentStudents,
                    });
                })
                .catch((error) =>
                    alert("Failed to fetch attendance: " + error.message)
                );
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
            .then(() => {
                alert("Attendance updated successfully!");
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
                <h1>Attendance</h1>

                <div className="filters">
                    <label>
                        Course:
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                        >
                            <option value="">Select a course</option>
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
                        Submodule:
                        <select
                            value={selectedSubmodule}
                            onChange={(e) =>
                                setSelectedSubmodule(e.target.value)
                            }
                            disabled={!selectedCourse}
                        >
                            <option value="">Select a submodule</option>
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
                        Lesson:
                        <select
                            value={selectedLesson}
                            onChange={(e) => setSelectedLesson(e.target.value)}
                            disabled={!selectedSubmodule}
                        >
                            <option value="">Select a lesson</option>
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
                        <h2>Students Present</h2>
                        <ul>
                            {(updatedAttendance.present || []).map(
                                (student) => (
                                    <li key={student.student_id}>
                                        {student.name}
                                        <button
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
                    </div>
                    <div className="list">
                        <h2>Students Absent</h2>
                        <ul>
                            {(updatedAttendance.absent || []).map((student) => (
                                <li key={student.student_id}>
                                    {student.name}
                                    <button
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
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
};

export default AttendanceList;
