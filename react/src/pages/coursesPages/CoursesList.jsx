import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import endpoints from "../../endpoints";
import ButtonMenu from "../../components/ButtonMenu";
import { coursesMenuButtons } from "../../../scripts/buttonsData";
import customFetch from "../../../scripts/customFetch";

const CoursesList = () => {
    const [courses, setCourses] = useState([]);
    const [editedCourse, setEditedCourse] = useState({});
    const { accessTokenData, setAccessTokenData, professor } = useAuth();

    customFetch(endpoints.GET_COURSES, accessTokenData, setAccessTokenData)
        .then((data) => {
            setCourses(data.courses.reverse());
        })
        .catch((error) => console.error(error));

    const handleDelete = (courseId) => {
        if (!window.confirm("Are you sure you want to delete this course?")) {
            return;
        }
        customFetch(
            endpoints.DELETE_COURSE + `/${courseId}`,
            accessTokenData,
            setAccessTokenData,
            "DELETE"
        )
            .then(() => {
                setCourses((prevCourses) =>
                    prevCourses.filter(
                        (course) => course.course_id !== courseId
                    )
                );
                alert("Course deleted successfully");
            })
            .catch((error) => console.error(error));
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
        customFetch(
            endpoints.UPDATE_COURSE + `/${courseId}`,
            accessTokenData,
            setAccessTokenData,
            "PUT",
            editedCourse
        )
            .then(() => {
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
            .catch((error) => console.error(error));
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
