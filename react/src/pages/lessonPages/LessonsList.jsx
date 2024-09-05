import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import endpoints from "../../endpoints";

const LessonsList = () => {
    const [lessons, setLessons] = useState([]);
    const [filteredLessons, setFilteredLessons] = useState([]);
    const [courses, setCourses] = useState([]);
    const [submodules, setSubmodules] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedSubmodule, setSelectedSubmodule] = useState("");
    const { accessTokenData } = useAuth();

    useEffect(() => {
        fetch(endpoints.GET_LESSONS, {
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
                console.log(data);
                setLessons(data.lessons); // Store all lessons
                setFilteredLessons(data.lessons); // Initialize filtered lessons
                // Extract unique courses and submodules
                const uniqueCourses = [
                    ...new Set(
                        data.lessons.map((lesson) => lesson.course.name)
                    ),
                ];
                const uniqueSubmodules = [
                    ...new Set(
                        data.lessons.map((lesson) => lesson.submodule.name)
                    ),
                ];
                setCourses(uniqueCourses);
                setSubmodules(uniqueSubmodules);
            })
            .catch((error) => {
                alert(error.message);
            });
    }, []);

    useEffect(() => {
        // Apply filters when selection changes
        let filtered = lessons;
        if (selectedCourse) {
            filtered = filtered.filter(
                (lesson) => lesson.course.name === selectedCourse
            );
        }
        if (selectedSubmodule) {
            filtered = filtered.filter(
                (lesson) => lesson.submodule.name === selectedSubmodule
            );
        }
        setFilteredLessons(filtered);
    }, [selectedCourse, selectedSubmodule, lessons]);

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
                            <option key={course} value={course}>
                                {course}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Submodulo:
                    <select
                        value={selectedSubmodule}
                        onChange={(e) => setSelectedSubmodule(e.target.value)}
                    >
                        <option value="">All Submodules</option>
                        {submodules.map((submodule) => (
                            <option key={submodule} value={submodule}>
                                {submodule}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

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
                            <td>{lesson.summary}</td>
                            <td>{lesson.submodule.name}</td>
                            <td>{lesson.course.name}</td>
                            <td>{lesson.date}</td>
                            <td>
                                {lesson.professors
                                    .map((professor) => professor.name)
                                    .join(", ")}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LessonsList;
