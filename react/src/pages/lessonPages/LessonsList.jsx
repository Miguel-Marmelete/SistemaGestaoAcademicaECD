import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import endpoints from "../../endpoints";

const LessonsList = () => {
    const [filteredLessons, setFilteredLessons] = useState([]);
    const [courses, setCourses] = useState([]);
    const [submodules, setSubmodules] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedSubmodule, setSelectedSubmodule] = useState("");
    const { accessTokenData, professor } = useAuth();
    const [expandedLessonId, setExpandedLessonId] = useState(null);

    // Fetch courses on mount
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

    // Fetch submodules on mount
    useEffect(() => {
        fetch(endpoints.GET_SUBMODULES, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Fetched submodules data:", data); // Debugging line
                setSubmodules(data.submodules);
            })
            .catch((error) =>
                alert("Failed to fetch submodules: " + error.message)
            );
    }, [accessTokenData.access_token]);

    // Fetch lessons when course or submodule is selected
    useEffect(() => {
        if (!selectedCourse) {
            return;
        }

        const fetchFilteredLessons = () => {
            let url = `${endpoints.GET_FILTERED_LESSONS}?course_id=${selectedCourse}`;
            if (selectedSubmodule) {
                url += `&submodule_id=${selectedSubmodule}`;
            }

            console.log("Fetching lessons with URL:", url); // Debugging line
            fetch(url, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessTokenData.access_token}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch lessons");
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log("Fetched lessons data:", data); // Debugging line
                    setFilteredLessons(data.lessons);
                })
                .catch((error) => {
                    alert(error.message);
                });
        };

        fetchFilteredLessons();
    }, [
        selectedCourse,
        selectedSubmodule,
        accessTokenData.access_token,
        professor.professor_id,
        professor.is_coordinator,
    ]);

    const toggleSummary = (lessonId) => {
        setExpandedLessonId(expandedLessonId === lessonId ? null : lessonId);
    };

    return (
        <div className="table-list-container">
            <header>
                <h1>Lessons</h1>
            </header>

            <div className="filters">
                <label>
                    Curso:
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                    >
                        <option value="">All Courses</option>
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
                    Submodulo:
                    <select
                        value={selectedSubmodule}
                        onChange={(e) => setSelectedSubmodule(e.target.value)}
                        disabled={!selectedCourse} // Disable submodule dropdown until a course is selected
                    >
                        <option value="">All Submodules</option>
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
            </div>

            {filteredLessons.length === 0 ? (
                <p>No lessons available</p>
            ) : (
                <table className="table-list" border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Summary</th>
                            <th>Submodule</th>
                            <th>Course</th>
                            <th>Date</th>
                            <th>Professors</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLessons.map((lesson) => (
                            <tr key={lesson.lesson_id}>
                                <td>{lesson.title}</td>
                                <td>{lesson.type}</td>
                                <td>
                                    {expandedLessonId === lesson.lesson_id ? (
                                        <>
                                            {lesson.summary}
                                            <button
                                                onClick={() =>
                                                    toggleSummary(
                                                        lesson.lesson_id
                                                    )
                                                }
                                            >
                                                Esconder
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            {lesson.summary.length > 100
                                                ? `${lesson.summary.substring(
                                                      0,
                                                      100
                                                  )}...`
                                                : lesson.summary}
                                            {lesson.summary.length > 100 && (
                                                <button
                                                    onClick={() =>
                                                        toggleSummary(
                                                            lesson.lesson_id
                                                        )
                                                    }
                                                >
                                                    Mais
                                                </button>
                                            )}
                                        </>
                                    )}
                                </td>
                                <td>{lesson.submodule.name}</td>
                                <td>{lesson.course.name}</td>
                                <td>{lesson.date}</td>
                                <td>
                                    {lesson.professors
                                        .map((prof) => prof.name)
                                        .join(", ")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default LessonsList;
