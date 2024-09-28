import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import endpoints from "../../endpoints";
import ButtonMenu from "../../components/ButtonMenu";
import { lessonsMenuButtons } from "../../../scripts/buttonsData";
import { useNavigate } from "react-router-dom";
import customFetch from "../../../scripts/customFetch";

const LessonsList = () => {
    const [filteredLessons, setFilteredLessons] = useState([]);
    const [courses, setCourses] = useState([]);
    const [submodules, setSubmodules] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedSubmodule, setSelectedSubmodule] = useState("");
    const { accessTokenData, setAccessTokenData, professor } = useAuth();
    const [expandedLessonId, setExpandedLessonId] = useState(null);
    const [editedLesson, setEditedLesson] = useState({});

    const navigate = useNavigate();

    const handlePrint = (lesson) => {
        navigate("/print-lesson", { state: { lesson } });
    };
    // Fetch courses on mount
    useEffect(() => {
        customFetch(endpoints.GET_COURSES, accessTokenData, setAccessTokenData)
            .then((data) => {
                setCourses(data.courses.reverse());
            })
            .catch((error) => {
                alert("Error fetching courses: " + error.message);
            });
    }, [accessTokenData, setAccessTokenData]);

    // Fetch submodules when course changes
    useEffect(() => {
        if (!selectedCourse) {
            setSubmodules([]); // Clear submodules if no course is selected
            return;
        }

        customFetch(
            `${endpoints.GET_SUBMODULES_OF_PROFESSOR}?course_id=${selectedCourse}`,
            accessTokenData,
            setAccessTokenData
        )
            .then((data) => {
                setSubmodules(data.submodules);
            })
            .catch((error) => {
                alert("Error fetching submodules: " + error.message);
            });
    }, [selectedCourse, accessTokenData, setAccessTokenData]);

    // Fetch lessons when course or submodule is selected
    useEffect(() => {
        if (!selectedCourse) {
            return;
        }

        let url = `${endpoints.GET_FILTERED_LESSONS}?course_id=${selectedCourse}`;
        if (selectedSubmodule) {
            url += `&submodule_id=${selectedSubmodule}`;
        }
        customFetch(url, accessTokenData, setAccessTokenData)
            .then((data) => {
                setFilteredLessons(data.lessons.reverse());
            })
            .catch((error) => {
                alert("Error fetching lessons: " + error.message);
            });
    }, [
        selectedCourse,
        selectedSubmodule,
        accessTokenData,
        setAccessTokenData,
    ]);

    const toggleSummary = (lessonId) => {
        setExpandedLessonId(expandedLessonId === lessonId ? null : lessonId);
    };

    const handleEditClick = (lesson) => {
        // Format the date to yyyy-MM-dd HH:00:00
        const formattedDate = new Date(lesson.date)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
        setEditedLesson({ ...lesson, date: formattedDate });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedLesson({ ...editedLesson, [name]: value });
    };

    const handleSave = (lessonId) => {
        if (!window.confirm("Are you sure you want to save the changes?")) {
            return;
        }

        // Extract only the editable fields
        const { title, type, summary, date } = editedLesson;
        const formattedDate = new Date(date)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
        const formattedEditedLesson = {
            title,
            type,
            summary,
            date: formattedDate,
        };

        customFetch(
            `${endpoints.UPDATE_LESSON}/${lessonId}`,
            accessTokenData,
            setAccessTokenData,
            "PUT",
            formattedEditedLesson
        )
            .then(() => {
                setFilteredLessons((prevLessons) =>
                    prevLessons.map((lesson) =>
                        lesson.lesson_id === lessonId
                            ? { ...lesson, ...formattedEditedLesson }
                            : lesson
                    )
                );
                setEditedLesson({});
                alert("Lesson updated successfully");
            })
            .catch((error) => {
                alert("Error updating lesson: " + error.message);
            });
    };

    const handleDelete = (lessonId) => {
        if (!window.confirm("Are you sure you want to delete this lesson?")) {
            return;
        }

        fetch(`${endpoints.DELETE_LESSON}/${lessonId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        throw new Error(errorData.details);
                    });
                }
                setFilteredLessons((prevLessons) =>
                    prevLessons.filter(
                        (lesson) => lesson.lesson_id !== lessonId
                    )
                );
                alert("Lesson deleted successfully");
            })
            .catch((error) => {
                alert("Error deleting lesson: " + error.message);
            });
    };

    return (
        <div>
            <ButtonMenu buttons={lessonsMenuButtons} />
            <div className="table-list-container">
                <h1>Lessons</h1>

                <div className="filters">
                    <label>
                        Curso:
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                        >
                            <option value="">Courses</option>
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
                            onChange={(e) =>
                                setSelectedSubmodule(e.target.value)
                            }
                            disabled={!selectedCourse} // Disable submodule dropdown until a course is selected
                        >
                            <option value="">Submodules</option>
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
                                {professor.is_coordinator === 1 && (
                                    <th>Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLessons.map((lesson) => (
                                <tr key={lesson.lesson_id}>
                                    {editedLesson.lesson_id ===
                                    lesson.lesson_id ? (
                                        <>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="title"
                                                    value={
                                                        editedLesson.title || ""
                                                    }
                                                    onChange={handleChange}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="type"
                                                    value={
                                                        editedLesson.type || ""
                                                    }
                                                    onChange={handleChange}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="summary"
                                                    value={
                                                        editedLesson.summary ||
                                                        ""
                                                    }
                                                    onChange={handleChange}
                                                />
                                            </td>
                                            <td>{lesson.submodule.name}</td>
                                            <td>{lesson.course.name}</td>
                                            <td>
                                                <input
                                                    type="date"
                                                    name="date"
                                                    value={
                                                        editedLesson.date || ""
                                                    }
                                                    onChange={handleChange}
                                                />
                                            </td>
                                            <td>
                                                {lesson.professors
                                                    .map((prof) => prof.name)
                                                    .join(", ")}
                                            </td>
                                            {professor.is_coordinator === 1 && (
                                                <td>
                                                    <button
                                                        onClick={() =>
                                                            handleSave(
                                                                lesson.lesson_id
                                                            )
                                                        }
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setEditedLesson({})
                                                        }
                                                    >
                                                        Cancel
                                                    </button>
                                                </td>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <td>{lesson.title}</td>
                                            <td>{lesson.type}</td>
                                            <td>
                                                {expandedLessonId ===
                                                lesson.lesson_id ? (
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
                                                        {lesson.summary.length >
                                                        100
                                                            ? `${lesson.summary.substring(
                                                                  0,
                                                                  100
                                                              )}...`
                                                            : lesson.summary}
                                                        {lesson.summary.length >
                                                            100 && (
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
                                            <td>
                                                {
                                                    new Date(lesson.date)
                                                        .toISOString()
                                                        .split("T")[0]
                                                }
                                            </td>
                                            <td>
                                                {lesson.professors
                                                    .map((prof) => prof.name)
                                                    .join(", ")}
                                            </td>
                                            {professor.is_coordinator === 1 && (
                                                <td>
                                                    <button
                                                        onClick={() =>
                                                            handleEditClick(
                                                                lesson
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                lesson.lesson_id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handlePrint(lesson)
                                                        }
                                                    >
                                                        Print
                                                    </button>
                                                </td>
                                            )}
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default LessonsList;
