import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import endpoints from "../../endpoints";
import ButtonMenu from "../../components/ButtonMenu";
import { coursesMenuButtons } from "../../../scripts/buttonsData";
import customFetch from "../../../scripts/customFetch";
import ClipLoader from "react-spinners/ClipLoader"; // Import ClipLoader

const CoursesList = () => {
    const [courses, setCourses] = useState([]);
    const [editedCourse, setEditedCourse] = useState({});
    const { accessTokenData, setAccessTokenData, professor } = useAuth();
    const [isCoordinator, setIsCoordinator] = useState(false);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        if (professor) {
            setIsCoordinator(professor.is_coordinator === 1);
        }
    }, [professor]);

    useEffect(() => {
        customFetch(endpoints.GET_COURSES, accessTokenData, setAccessTokenData)
            .then((data) => {
                setCourses(data.courses.reverse());
            })
            .catch((error) => {
                console.error(error);
                alert(error);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = (courseId) => {
        if (!window.confirm("Tem certeza que deseja apagar este curso?")) {
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
                alert("Curso apagado com sucesso");
            })
            .catch((error) => {
                console.error(error);
                alert(error);
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
        if (!window.confirm("Tem certeza que deseja atualizar este curso?")) {
            return;
        }
        console.log("editedCourse", editedCourse);
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
                alert("Curso atualizado com sucesso");
            })
            .catch((error) => {
                console.error(error);
                alert(error);
            });
    };

    const handleCancelEdit = () => {
        setEditedCourse({});
    };

    if (!professor) {
        return (
            <div>
                <h2>
                    Loading <ClipLoader size={15} />
                </h2>
            </div>
        );
    }
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
                        {isCoordinator && <th>Ações</th>}
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
                                    {isCoordinator && (
                                        <td>
                                            <button
                                                className="buttons"
                                                onClick={() =>
                                                    handleSave(course.course_id)
                                                }
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="buttons"
                                                onClick={handleCancelEdit}
                                            >
                                                Cancel
                                            </button>
                                        </td>
                                    )}
                                </>
                            ) : (
                                <>
                                    <td>{course.name}</td>
                                    <td>{course.abbreviation}</td>
                                    <td>{course.date}</td>
                                    {isCoordinator && (
                                        <td>
                                            <button
                                                className="buttons"
                                                onClick={() =>
                                                    handleEditClick(course)
                                                }
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="buttons"
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

            {loading && (
                <div className="loading-container">
                    <p>
                        Loading courses... <ClipLoader size={15} />
                    </p>
                </div>
            )}
        </div>
    );
};

export default CoursesList;
