import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import endpoints from "../../endpoints";

const AddAttendance = () => {
    const [courses, setCourses] = useState([]);
    const [submodules, setSubmodules] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedSubmodule, setSelectedSubmodule] = useState("");
    const [selectedLesson, setSelectedLesson] = useState("");
    const [selectedStudents, setSelectedStudents] = useState([]);
    const { accessTokenData } = useAuth();

    useEffect(() => {
        // Fetch courses
        fetch(endpoints.GET_COURSES, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => setCourses(data.courses))
            .catch((error) =>
                alert("Failed to fetch courses: " + error.message)
            );
    }, [accessTokenData.access_token]);

    useEffect(() => {
        if (selectedCourse) {
            // Fetch submodules based on selected course
            fetch(`${endpoints.GET_SUBMODULES}?course_id=${selectedCourse}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessTokenData.access_token}`,
                },
            })
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
            // Fetch lessons based on selected course and submodule
            fetch(
                `${endpoints.GET_LESSONS}?course_id=${selectedCourse}&submodule_id=${selectedSubmodule}`,
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
        // Fetch students
        fetch(endpoints.GET_STUDENTS, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => setStudents(data.students))
            .catch((error) =>
                alert("Failed to fetch students: " + error.message)
            );
    }, [accessTokenData.access_token]);

    const handleStudentChange = (e) => {
        const value = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        );
        setSelectedStudents(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedLesson || selectedStudents.length === 0) {
            alert("Please select a lesson and at least one student.");
            return;
        }

        fetch(endpoints.POST_ATTENDANCE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
            body: JSON.stringify({
                lesson_id: selectedLesson,
                student_ids: selectedStudents,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    throw new Error(data.error);
                }
                alert("Attendance registered successfully.");
                // Clear selections
                setSelectedCourse("");
                setSelectedSubmodule("");
                setSelectedLesson("");
                setSelectedStudents([]);
            })
            .catch((error) =>
                alert("Failed to register attendance: " + error.message)
            );
    };

    return (
        <div className="attendance-form-container">
            <header>
                <h1>Add Attendance</h1>
            </header>

            <div className="filters">
                <label>
                    Course:
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                    >
                        <option value="">Select a Course</option>
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
                        <option value="">Select a Submodule</option>
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
                        <option value="">Select a Lesson</option>
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

            <form onSubmit={handleSubmit}>
                <label>
                    Students:
                    <select
                        multiple
                        value={selectedStudents}
                        onChange={handleStudentChange}
                    >
                        {students
                            .filter(
                                (student) =>
                                    student.course_id === selectedCourse
                            )
                            .map((student) => (
                                <option
                                    key={student.student_id}
                                    value={student.student_id}
                                >
                                    {student.name}
                                </option>
                            ))}
                    </select>
                </label>

                <button type="submit">Register Attendance</button>
            </form>
        </div>
    );
};

export default AddAttendance;
