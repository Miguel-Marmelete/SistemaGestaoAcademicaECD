import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import { fetchCourses } from "../../../scripts/getCourses";
import endpoints from "../../endpoints";
import ButtonMenu from "../../components/ButtonMenu";
import { coursesMenuButtons } from "../../../scripts/buttonsData";

const CoursesList = () => {
    const [courses, setCourses] = useState([]);
    const [editedCourse, setEditedCourse] = useState({});
    const { accessTokenData, professor } = useAuth();

    useEffect(() => {
        fetchCourses(accessTokenData.access_token)
            .then((courses) => {
                setCourses(courses.reverse());
            })
            .catch((error) => {
                alert(error.message);
            });
    }, []);

    const handleDelete = (courseId) => {
        if (!window.confirm("Are you sure you want to delete this course?")) {
            return;
        }
        fetch(endpoints.DELETE_COURSE + `/${courseId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to delete course");
                }
                setCourses((prevCourses) =>
                    prevCourses.filter(
                        (course) => course.course_id !== courseId
                    )
                );
                alert("Course deleted successfully");
            })
            .catch((error) => {
                alert(error.message);
            });
    };

    const handleEditClick = (course) => {
        setEditedCourse(course);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedCourse({ ...editedCourse, [name]: value });
    };

    const handleSave = (courseId) => {
        if (!window.confirm("Are you sure you want to update this course?")) {
            return;
        }

        fetch(endpoints.UPDATE_COURSE + `/${courseId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
            body: JSON.stringify(editedCourse),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to update course");
                }
                return response.json();
            })
            .then(() => {
                // Use the updated course data, but fallback to previous data for missing fields
                setCourses((prevCourses) =>
                    prevCourses.map((course) =>
                        course.course_id === courseId
                            ? { ...course, ...editedCourse }
                            : course
                    )
                );
                setEditedCourse({});
                alert("Course updated successfully");
            })
            .catch((error) => {
                alert(error.message);
            });
    };

    return (
        <div className="table-list-container">
            <ButtonMenu buttons={coursesMenuButtons} />
            <header>
                <h1>Cursos</h1>
            </header>

            <table className="table-list" border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Abreviatura</th>
                        <th>Data de Inicio</th>
                        {professor.is_coordinator === 1 && <th>Ações</th>}
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => (
                        <tr key={course.course_id}>
                            {editedCourse.course_id === course.course_id ? (
                                <>
                                    <td>
                                        <input
                                            type="text"
                                            name="name"
                                            value={editedCourse.name}
                                            onChange={handleChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="abbreviation"
                                            value={editedCourse.abbreviation}
                                            onChange={handleChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="date"
                                            name="date"
                                            value={editedCourse.date}
                                            onChange={handleChange}
                                        />
                                    </td>
                                    {professor.is_coordinator === 1 && (
                                        <td>
                                            <button
                                                onClick={() =>
                                                    handleSave(course.course_id)
                                                }
                                            >
                                                Save
                                            </button>
                                        </td>
                                    )}
                                </>
                            ) : (
                                <>
                                    <td>{course.name}</td>
                                    <td>{course.abbreviation}</td>
                                    <td>{course.date}</td>
                                    {professor.is_coordinator === 1 && (
                                        <td>
                                            <button
                                                onClick={() =>
                                                    handleEditClick(course)
                                                }
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        course.course_id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    )}
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CoursesList;
