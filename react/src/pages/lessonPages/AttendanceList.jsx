import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import endpoints from "../../endpoints";
import ButtonMenu from "../../components/ButtonMenu";
import { lessonsMenuButtons } from "../../../scripts/buttonsData";

const AttendanceList = () => {
    const { accessTokenData } = useAuth();
    const [courses, setCourses] = useState([]);
    const [submodules, setSubmodules] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedSubmodule, setSelectedSubmodule] = useState("");
    const [selectedLesson, setSelectedLesson] = useState("");
    const [studentsPresent, setStudentsPresent] = useState([]);
    const [studentsAbsent, setStudentsAbsent] = useState([]);

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
                    setStudentsPresent(data.presentStudents);
                    setStudentsAbsent(data.absentStudents);
                })
                .catch((error) =>
                    alert("Failed to fetch attendance: " + error.message)
                );
        } else {
            setStudentsPresent([]);
            setStudentsAbsent([]);
        }
    }, [selectedLesson, accessTokenData.access_token]);

    return (
        <div>
            <ButtonMenu buttons={lessonsMenuButtons} />
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
                        onChange={(e) => setSelectedSubmodule(e.target.value)}
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
                        {(studentsPresent || []).map((student) => (
                            <li key={student.student_id}>{student.name}</li>
                        ))}
                    </ul>
                </div>
                <div className="list">
                    <h2>Students Absent</h2>
                    <ul>
                        {(studentsAbsent || []).map((student) => (
                            <li key={student.student_id}>{student.name}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AttendanceList;
