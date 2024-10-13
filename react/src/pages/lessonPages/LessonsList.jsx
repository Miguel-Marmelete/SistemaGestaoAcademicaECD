import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import endpoints from "../../endpoints";
import ButtonMenu from "../../components/ButtonMenu";
import { lessonsMenuButtons } from "../../../scripts/buttonsData";
import { useNavigate } from "react-router-dom";
import customFetch from "../../../scripts/customFetch";
import { ClipLoader } from "react-spinners"; // Import ClipLoader

const LessonsList = () => {
    const [filteredLessons, setFilteredLessons] = useState([]);
    const [courses, setCourses] = useState([]);
    const [submodules, setSubmodules] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedSubmodule, setSelectedSubmodule] = useState("");
    const { accessTokenData, setAccessTokenData } = useAuth();
    const [expandedLessonId, setExpandedLessonId] = useState(null);
    const [editedLesson, setEditedLesson] = useState({});
    const [loading, setLoading] = useState(false); // Add loading state

    const navigate = useNavigate();

    const handlePrint = (lesson) => {
        navigate("/print-lesson", { state: { lesson } });
    };

    // Fetch courses on mount
    useEffect(() => {
        setLoading(true); // Start loading
        customFetch(endpoints.GET_COURSES, accessTokenData, setAccessTokenData)
            .then((data) => {
                setCourses(data.courses.reverse());
            })
            .catch((error) => {
                console.log(error);
                alert(error);
            })
            .finally(() => setLoading(false)); // Stop loading
    }, [accessTokenData, setAccessTokenData]);

    // Fetch submodules when course changes
    useEffect(() => {
        if (!selectedCourse) {
            setSubmodules([]); // Clear submodules if no course is selected
            return;
        }

        setLoading(true); // Start loading
        customFetch(
            `${endpoints.GET_SUBMODULES_OF_PROFESSOR}?course_id=${selectedCourse}`,
            accessTokenData,
            setAccessTokenData
        )
            .then((data) => {
                setSubmodules(data.submodules);
            })
            .catch((error) => {
                alert(error);
            })
            .finally(() => setLoading(false)); // Stop loading
    }, [selectedCourse, accessTokenData, setAccessTokenData]);

    // Fetch lessons when course or submodule is selected
    useEffect(() => {
        if (!selectedCourse) {
            return;
        }

        setLoading(true); // Start loading
        let url = `${endpoints.GET_FILTERED_LESSONS}?course_id=${selectedCourse}`;
        if (selectedSubmodule) {
            url += `&submodule_id=${selectedSubmodule}`;
        }
        customFetch(url, accessTokenData, setAccessTokenData)
            .then((data) => {
                setFilteredLessons(data.lessons.reverse());
            })
            .catch((error) => {
                alert(error);
            })
            .finally(() => setLoading(false)); // Stop loading
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
        if (
            !window.confirm("Tem certeza de que deseja guardar as alterações?")
        ) {
            return;
        }

        // Extract only the editable fields
        const { title, type, summary, date } = editedLesson;
        // Format the date to yyyy-MM-dd HH:00:00
        const formattedDate = new Date(date)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
        const adjustedDate = formattedDate.slice(0, 13) + ":00:00";

        const formattedEditedLesson = {
            title,
            type,
            summary,
            date: adjustedDate, // Use the adjusted date
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
                alert("Aula atualizada com sucesso");
            })
            .catch((error) => {
                alert(error);
            });
    };

    const handleDelete = (lessonId) => {
        if (!window.confirm("Tem certeza de que deseja excluir esta aula?")) {
            return;
        }

        customFetch(
            `${endpoints.DELETE_LESSON}/${lessonId}`,
            accessTokenData,
            setAccessTokenData,
            "DELETE"
        )
            .then(() => {
                setFilteredLessons((prevLessons) =>
                    prevLessons.filter(
                        (lesson) => lesson.lesson_id !== lessonId
                    )
                );
                alert("Aula excluída com sucesso");
            })
            .catch((error) => {
                alert(error);
            });
    };

    return (
        <div>
            <ButtonMenu buttons={lessonsMenuButtons} />
            <div className="table-list-container">
                <h1>Aulas</h1>
                <div className="filters">
                    <label>
                        Curso:
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                        >
                            <option value="">Selecione um curso</option>
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
                        Submódulo:
                        <select
                            value={selectedSubmodule}
                            onChange={(e) =>
                                setSelectedSubmodule(e.target.value)
                            }
                            disabled={!selectedCourse}
                        >
                            <option value="">Selecione um submódulo</option>
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

                <table className="table-list" border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Tipo</th>
                            <th>Resumo</th>
                            <th>Submodulo</th>
                            <th>Curso</th>
                            <th>Data</th>
                            <th>Professores</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="8">
                                    Loading... <ClipLoader size={15} />
                                </td>
                            </tr>
                        ) : filteredLessons.length > 0 ? (
                            filteredLessons.map((lesson) => (
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
                                                <select
                                                    name="type"
                                                    value={
                                                        editedLesson.type || ""
                                                    }
                                                    onChange={handleChange}
                                                >
                                                    <option value="Teórica">
                                                        Teórica
                                                    </option>
                                                    <option value="Laboratorial">
                                                        Laboratorial
                                                    </option>
                                                    <option value="Teórica-Prática">
                                                        Teórica-Prática
                                                    </option>
                                                </select>
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
                                                    type="datetime-local"
                                                    name="date"
                                                    value={
                                                        editedLesson.date || ""
                                                    }
                                                    onChange={handleChange}
                                                    style={{
                                                        width: "100%",
                                                        boxSizing: "border-box",
                                                        maxWidth: "150px",
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                {lesson.professors
                                                    .map((prof) => prof.name)
                                                    .join(", ")}
                                            </td>
                                            <td>
                                                <button
                                                    className="buttons"
                                                    onClick={() =>
                                                        handleSave(
                                                            lesson.lesson_id
                                                        )
                                                    }
                                                >
                                                    Guardar
                                                </button>
                                                <button
                                                    className="buttons"
                                                    onClick={() =>
                                                        setEditedLesson({})
                                                    }
                                                >
                                                    Cancelar
                                                </button>
                                            </td>
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
                                                            className="buttons"
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
                                                                className="buttons"
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
                                            <td>
                                                <button
                                                    className="buttons"
                                                    onClick={() =>
                                                        handleEditClick(lesson)
                                                    }
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="buttons"
                                                    onClick={() =>
                                                        handleDelete(
                                                            lesson.lesson_id
                                                        )
                                                    }
                                                >
                                                    Apagar
                                                </button>
                                                <button
                                                    className="buttons"
                                                    onClick={() =>
                                                        handlePrint(lesson)
                                                    }
                                                >
                                                    Imprimir
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8">Nenhuma aula encontrada</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LessonsList;
