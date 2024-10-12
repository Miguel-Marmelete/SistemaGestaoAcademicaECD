import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";
import { studentsMenuButtons } from "../../../scripts/buttonsData";
import ButtonMenu from "../../components/ButtonMenu";
import customFetch from "../../../scripts/customFetch";
import { ClipLoader } from "react-spinners";

const StudentsList = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [students, setStudents] = useState([]);
    const [editedStudent, setEditedStudent] = useState({});
    const [loading, setLoading] = useState(false); // New loading state
    const navigate = useNavigate();
    const { accessTokenData, professor, setAccessTokenData } = useAuth();

    // Fetch courses from API
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
                alert(error);
            });
    }, [accessTokenData.access_token]);

    // Fetch students when the selected course changes
    useEffect(() => {
        setLoading(true); // Start loading
        customFetch(
            `${endpoints.GET_STUDENTS}?course_id=${selectedCourse}`,
            accessTokenData,
            setAccessTokenData
        )
            .then((data) => {
                setStudents(data.students.reverse());
            })
            .catch((error) => {
                console.error("Error fetching students:", error);
                alert("Error fetching students: " + error);
            })
            .finally(() => {
                setLoading(false); // End loading
            });

        // Update query string
        navigate(`?course=${selectedCourse}`);
    }, [selectedCourse, accessTokenData.access_token, navigate]);

    const handleCourseChange = (event) => {
        setSelectedCourse(event.target.value);
    };

    const handleEditClick = (student) => {
        setEditedStudent({ ...student });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedStudent({ ...editedStudent, [name]: value });
    };

    const handleSave = (studentId) => {
        if (!window.confirm("Tem certeza que deseja guardar as alterações?")) {
            return;
        }

        customFetch(
            `${endpoints.UPDATE_STUDENT}/${studentId}`,
            accessTokenData,
            setAccessTokenData,
            "PUT",
            editedStudent
        )
            .then(() => {
                setStudents((prevStudents) =>
                    prevStudents.map((student) =>
                        student.student_id === studentId
                            ? { ...student, ...editedStudent }
                            : student
                    )
                );
                setEditedStudent({});
                alert("Aluno atualizado com sucesso");
            })
            .catch((error) => {
                alert(error);
            });
    };

    const handleDelete = (studentId) => {
        if (!window.confirm("Tem certeza que deseja apagar este aluno?")) {
            return;
        }

        customFetch(
            `${endpoints.DELETE_STUDENT}/${studentId}`,
            accessTokenData,
            setAccessTokenData,
            "DELETE"
        )
            .then(() => {
                setStudents((prevStudents) =>
                    prevStudents.filter(
                        (student) => student.student_id !== studentId
                    )
                );
                alert("Aluno apagado com sucesso");
            })
            .catch((error) => {
                alert(error);
            });
    };

    const handleCancelEdit = () => {
        setEditedStudent({}); // Clear the edited student state to cancel editing
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
            <ButtonMenu buttons={studentsMenuButtons} />
            <header>
                <h1>Alunos Inscritos</h1>
            </header>
            <div className="filters">
                <label>
                    Curso:
                    <select
                        id="course-select"
                        value={selectedCourse}
                        onChange={handleCourseChange}
                    >
                        <option value="">Todos os cursos</option>
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
            </div>
            <table className="table-list" border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Número</th>
                        <th>Email</th>
                        <th>Telefone</th> {/* New column */}
                        {professor.is_coordinator === 1 && <th>Ações</th>}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td
                                colSpan={professor.is_coordinator === 1 ? 5 : 4}
                            >
                                Loading <ClipLoader size={15} />
                            </td>
                        </tr>
                    ) : students.length === 0 ? (
                        <tr>
                            <td
                                colSpan={professor.is_coordinator === 1 ? 5 : 4}
                            >
                                Nenhum aluno inscrito no curso selecionado
                            </td>
                        </tr>
                    ) : (
                        students.map((student) => (
                            <tr key={student.student_id}>
                                {editedStudent.student_id ===
                                student.student_id ? (
                                    <>
                                        <td>
                                            <input
                                                type="text"
                                                name="name"
                                                value={editedStudent.name || ""}
                                                onChange={handleChange}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="number"
                                                value={
                                                    editedStudent.number || ""
                                                }
                                                onChange={handleChange}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="personal_email"
                                                value={
                                                    editedStudent.personal_email ||
                                                    ""
                                                }
                                                onChange={handleChange}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="phone"
                                                value={
                                                    editedStudent.phone || ""
                                                }
                                                onChange={handleChange}
                                            />
                                        </td>
                                        {professor.is_coordinator === 1 && (
                                            <td>
                                                <button
                                                    className="buttons"
                                                    onClick={() =>
                                                        handleSave(
                                                            student.student_id
                                                        )
                                                    }
                                                >
                                                    Guardar
                                                </button>
                                                <button
                                                    className="buttons"
                                                    onClick={handleCancelEdit}
                                                >
                                                    Cancelar
                                                </button>
                                            </td>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <td>{student.name}</td>
                                        <td>{student.number}</td>
                                        <td>{student.personal_email}</td>
                                        <td>{student.mobile}</td>{" "}
                                        {/* New column */}
                                        {professor.is_coordinator === 1 && (
                                            <td>
                                                <button
                                                    className="buttons"
                                                    onClick={() =>
                                                        handleEditClick(student)
                                                    }
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="buttons"
                                                    onClick={() =>
                                                        handleDelete(
                                                            student.student_id
                                                        )
                                                    }
                                                >
                                                    Apagar
                                                </button>
                                            </td>
                                        )}
                                    </>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default StudentsList;
