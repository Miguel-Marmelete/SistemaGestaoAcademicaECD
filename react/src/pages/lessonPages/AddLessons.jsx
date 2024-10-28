import React, { useState, useEffect } from "react";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";
import ButtonMenu from "../../components/ButtonMenu";
import { lessonsMenuButtons } from "../../../scripts/buttonsData";
import customFetch from "../../../scripts/customFetch";
import { ClipLoader } from "react-spinners";

const AddLesson = () => {
    const { accessTokenData, professor, setAccessTokenData } = useAuth();
    const [submodules, setSubmodules] = useState([]);
    const [courses, setCourses] = useState([]);
    const [professors, setProfessors] = useState([]);
    const [students, setStudents] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedSubmodule, setSelectedSubmodule] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        type: "",
        summary: "",
        submodule_id: "",
        course_id: "",
        date: "",
        professor_ids: [],
        student_ids: [],
    });
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [loadingLessons, setLoadingLessons] = useState(false);

    useEffect(() => {
        if (professor) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                professor_ids: [professor.professor_id],
            }));
        }
    }, [professor]);

    useEffect(() => {
        customFetch(
            endpoints.GET_COURSES_AND_MODULES_OF_PROFESSOR,
            accessTokenData,
            setAccessTokenData
        )
            .then((data) => {
                setCourses(data.courses.reverse());
            })
            .catch((error) => {
                alert("Error fetching courses: " + error.message);
            });

        customFetch(
            endpoints.GET_PROFESSORS,
            accessTokenData,
            setAccessTokenData
        )
            .then((professorData) => {
                setProfessors(professorData.professors);
            })
            .catch((error) => {
                console.error("Error:", error);
                alert(error.message);
            });
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            setLoadingStudents(true);
            customFetch(
                `${endpoints.GET_STUDENTS}?course_id=${selectedCourse}`,
                accessTokenData,
                setAccessTokenData
            )
                .then((studentsData) => {
                    setStudents(studentsData.students.reverse());
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert(error.message);
                })
                .finally(() => setLoadingStudents(false));
        } else {
            setStudents([]);
        }
    }, [selectedCourse]);

    useEffect(() => {
        if (selectedCourse) {
            customFetch(
                `${endpoints.GET_SUBMODULES_OF_PROFESSOR}?course_id=${selectedCourse}`,
                accessTokenData,
                setAccessTokenData
            )
                .then((data) => {
                    console.log("submodulos", data.submodules);
                    setSubmodules(data.submodules);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert(error.message);
                });
        } else {
            setSubmodules([]);
        }
    }, [selectedCourse]);

    useEffect(() => {
        if (selectedCourse) {
            let url = `${endpoints.GET_FILTERED_LESSONS}?course_id=${selectedCourse}`;
            if (selectedSubmodule) {
                url += `&submodule_id=${selectedSubmodule}`;
            }

            setLoadingLessons(true);
            customFetch(url, accessTokenData, setAccessTokenData)
                .then((data) => {
                    setLessons(data.lessons);
                })
                .catch((error) => {
                    alert(error.message);
                })
                .finally(() => setLoadingLessons(false));
        }
    }, [selectedCourse, selectedSubmodule]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === "course_id") {
            setSelectedCourse(value);
        } else if (name === "submodule_id") {
            setSelectedSubmodule(value);
        }
    };

    const handleProfessorCheckboxChange = (e) => {
        const { value, checked } = e.target;
        const numericValue = parseInt(value, 10);

        setFormData((prevState) => {
            if (checked) {
                return {
                    ...prevState,
                    professor_ids: [...prevState.professor_ids, numericValue],
                };
            } else {
                return {
                    ...prevState,
                    professor_ids: prevState.professor_ids.filter(
                        (id) => id !== numericValue
                    ),
                };
            }
        });
    };

    const handleStudentCheckboxChange = (e) => {
        const { value, checked } = e.target;
        const numericValue = parseInt(value, 10);

        setFormData((prevState) => {
            if (checked) {
                return {
                    ...prevState,
                    student_ids: [...prevState.student_ids, numericValue],
                };
            } else {
                return {
                    ...prevState,
                    student_ids: prevState.student_ids.filter(
                        (id) => id !== numericValue
                    ),
                };
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);

        const formattedDate = new Date(formData.date)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
        const adjustedDate = formattedDate.slice(0, 13) + ":00:00";

        const payload = {
            ...formData,
            date: adjustedDate,
            course_id: formData.course_id,
            student_ids: formData.student_ids,
        };

        customFetch(
            endpoints.ADD_LESSON_AND_ATTENDANCE,
            accessTokenData,
            setAccessTokenData,
            "POST",
            payload
        )
            .then((data) => {
                alert(data.message);
                setFormData({
                    title: "",
                    type: "",
                    summary: "",
                    submodule_id: "",
                    course_id: "",
                    date: "",
                    professor_ids: [],
                    student_ids: [],
                });
                setLessons([]); // Clear the lessons table
                setSelectedCourse(""); // Clear the selected course
            })
            .catch((error) => {
                console.error("Error:", error);
                alert(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
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
        <div>
            <ButtonMenu buttons={lessonsMenuButtons} />

            <div className="container">
                <form className="submitForm" onSubmit={handleSubmit}>
                    <h2>Adicionar Aula</h2>
                    <div>
                        <label>Curso</label>
                        <select
                            name="course_id"
                            value={formData.course_id}
                            onChange={(e) => {
                                handleChange(e);
                                setSelectedCourse(e.target.value);
                            }}
                            required
                        >
                            <option value="" disabled>
                                Selecione um curso
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
                        <label>Módulo/Submódulo</label>
                        <select
                            name="submodule_id"
                            value={formData.submodule_id}
                            onChange={(e) => {
                                handleChange(e);
                                setSelectedSubmodule(e.target.value);
                            }}
                            required
                            disabled={!formData.course_id}
                        >
                            <option value="" disabled>
                                Selecione um submódulo
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
                        <label>Título</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            maxLength={255}
                        />
                    </div>
                    <div>
                        <label>Tipo</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>
                                Selecione um tipo
                            </option>
                            <option value="Teórica">Teórica</option>
                            <option value="Laboratorial">Laboratorial</option>
                            <option value="Teórica-Prática">
                                Teórica-Prática
                            </option>
                        </select>
                    </div>
                    <div>
                        <label>Sumário</label>
                        <textarea
                            name="summary"
                            value={formData.summary}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label>Professores</label>
                        <div className="form-table-responsive">
                            {professors.length > 0 ? (
                                <table className="form-table">
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>Selecionar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {professors.map((prof) => (
                                            <tr key={prof.professor_id}>
                                                <td>{prof.name}</td>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        name="professor_ids"
                                                        value={
                                                            prof.professor_id
                                                        }
                                                        checked={formData.professor_ids.includes(
                                                            prof.professor_id
                                                        )}
                                                        onChange={
                                                            handleProfessorCheckboxChange
                                                        }
                                                        disabled={
                                                            prof.professor_id ===
                                                            professor.professor_id
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>Nenhum professor encontrado</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label>Alunos</label>
                        <div className="form-table-responsive">
                            <table className="form-table">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Número</th>
                                        <th>Selecionar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loadingStudents ? (
                                        <tr>
                                            <td colSpan="3">
                                                Loading <ClipLoader size={15} />
                                            </td>
                                        </tr>
                                    ) : students.length > 0 ? (
                                        students.map((student) => (
                                            <tr key={student.student_id}>
                                                <td>{student.name}</td>
                                                <td>{student.number}</td>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        name="student_ids"
                                                        value={
                                                            student.student_id
                                                        }
                                                        checked={formData.student_ids.includes(
                                                            student.student_id
                                                        )}
                                                        onChange={
                                                            handleStudentCheckboxChange
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3">
                                                Nenhum aluno inscrito no curso
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div>
                        <label>Data</label>
                        <input
                            type="datetime-local"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? <ClipLoader size={15} /> : "Submit"}
                    </button>
                </form>
                <div className="list">
                    <h2>Aulas Existentes</h2>
                    <table className="form-table">
                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingLessons ? (
                                <tr>
                                    <td colSpan="2">
                                        Loading <ClipLoader size={15} />
                                    </td>
                                </tr>
                            ) : lessons.length > 0 ? (
                                lessons.map((lesson) => (
                                    <tr key={lesson.lesson_id}>
                                        <td>{lesson.title}</td>
                                        <td>{lesson.date}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2">Nenhuma aula encontrada</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AddLesson;
