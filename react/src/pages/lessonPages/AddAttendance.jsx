import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import endpoints from "../../endpoints";
import ButtonMenu from "../../components/ButtonMenu";
import { lessonsMenuButtons } from "../../../scripts/buttonsData";

const AddAttendance = () => {
    const { accessTokenData } = useAuth();
    const [courses, setCourses] = useState([]);
    const [submodules, setSubmodules] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedSubmodule, setSelectedSubmodule] = useState("");
    const [selectedLesson, setSelectedLesson] = useState("");
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(endpoints.GET_COURSES, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch courses");
                return response.json();
            })
            .then((data) => {
                setCourses(data.courses.reverse());
            })
            .catch((error) => {
                setError("Failed to fetch courses: " + error.message);
            });
    }, []);

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
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch submodules");
                    }
                    return response.json();
                })
                .then((submodulesData) => {
                    setSubmodules(submodulesData.submodules);
                })
                .catch((error) => {
                    setError("Failed to fetch submodules: " + error.message);
                });
        }
    }, [selectedCourse]);

    useEffect(() => {
        if (selectedCourse) {
            fetch(
                `${endpoints.GET_STUDENTS_BY_COURSE}?course_id=${selectedCourse}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessTokenData.access_token}`,
                    },
                }
            )
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch students");
                    }
                    return response.json();
                })
                .then((studentsData) => {
                    console.log(studentsData.students);

                    setStudents(studentsData.students);
                })
                .catch((error) => {
                    setError("Failed to fetch students: " + error.message);
                });
        }
    }, [selectedCourse]);

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
                .then((response) => {
                    if (!response.ok)
                        throw new Error("Failed to fetch lessons");
                    return response.json();
                })
                .then((data) => {
                    setLessons(data.lessons);
                })
                .catch((error) => {
                    setError("Failed to fetch lessons: " + error.message);
                });
        } else {
            setLessons([]);
        }
    }, [selectedCourse, selectedSubmodule]);

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
        if (loading) {
            return;
        }
        setLoading(true); // Set loading to true when submitting

        fetch(endpoints.REGIST_ATTENDANCE, {
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
            .then((response) => {
                if (!response.ok)
                    throw new Error("Failed to register attendance");
                return response.json();
            })
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

    return (
        <div>
            <ButtonMenu buttons={lessonsMenuButtons} />
            <div className="container">
                <form className="submitForm" onSubmit={handleSubmit}>
                    <h2>Add Attendance</h2>

                    <div>
                        <label>Course</label>
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            required
                        >
                            <option value="" disabled>
                                Select a Course
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
                        <label>Submodule</label>
                        <select
                            value={selectedSubmodule}
                            onChange={(e) =>
                                setSelectedSubmodule(e.target.value)
                            }
                            disabled={!selectedCourse}
                            required
                        >
                            <option value="" disabled>
                                Select a Submodule
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
                        <label>Lesson</label>
                        <select
                            value={selectedLesson}
                            onChange={(e) => setSelectedLesson(e.target.value)}
                            disabled={!selectedSubmodule}
                            required
                        >
                            <option value="" disabled>
                                Select a Lesson
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
                        <label>Students</label>
                        <select
                            multiple
                            value={selectedStudents}
                            onChange={handleStudentChange}
                            required
                        >
                            {students.length > 0 ? (
                                students.map((student) => (
                                    <option
                                        key={student.student_id}
                                        value={student.student_id}
                                    >
                                        {student.name}
                                    </option>
                                ))
                            ) : (
                                <option disabled>No students available</option>
                            )}
                        </select>
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddAttendance;
