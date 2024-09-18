import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";
import { fetchCourses } from "../../../scripts/getCourses";
import { studentsMenuButtons } from "../../../scripts/buttonsData";
import ButtonMenu from "../../components/ButtonMenu";

const StudentsList = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [students, setStudents] = useState([]);
    const [editedStudent, setEditedStudent] = useState({});
    const navigate = useNavigate();
    const { accessTokenData, professor } = useAuth();

    // Fetch courses from API
    useEffect(() => {
        fetchCourses(accessTokenData.access_token)
            .then((fetchedCourses) => {
                setCourses(fetchedCourses.reverse());
            })
            .catch((error) => {
                alert("Error fetching courses: " + error.message);
            });
    }, [accessTokenData.access_token]);

    // Fetch students when the selected course changes
    useEffect(() => {
        const fetchStudentsUrl = selectedCourse
            ? `${endpoints.GET_STUDENTS_BY_COURSE}?course_id=${selectedCourse}`
            : endpoints.GET_STUDENTS;

        fetch(fetchStudentsUrl, {
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
                return response.json();
            })
            .then((data) => {
                setStudents(data.students.reverse());
            })
            .catch((error) => {
                console.error("Error fetching students:", error);
                alert("Error fetching students: " + error);
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
        if (!window.confirm("Are you sure you want to save the changes?")) {
            return;
        }

        fetch(`${endpoints.UPDATE_STUDENT}/${studentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
            body: JSON.stringify(editedStudent),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        throw new Error(errorData.details);
                    });
                }
                return response.json();
            })
            .then(() => {
                setStudents((prevStudents) =>
                    prevStudents.map((student) =>
                        student.student_id === studentId
                            ? { ...student, ...editedStudent }
                            : student
                    )
                );
                setEditedStudent({});
                alert("Student updated successfully");
            })
            .catch((error) => {
                alert("Error updating student: " + error.message);
            });
    };

    const handleDelete = (studentId) => {
        if (!window.confirm("Are you sure you want to delete this student?")) {
            return;
        }

        fetch(`${endpoints.DELETE_STUDENT}/${studentId}`, {
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
                setStudents((prevStudents) =>
                    prevStudents.filter(
                        (student) => student.student_id !== studentId
                    )
                );
                alert("Student deleted successfully");
            })
            .catch((error) => {
                alert("Error deleting student: " + error.message);
            });
    };

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
                        {professor.is_coordinator === 1 && <th>Ações</th>}
                    </tr>
                </thead>
                <tbody>
                    {students.length === 0 ? (
                        <tr>
                            <td
                                colSpan={professor.is_coordinator === 1 ? 4 : 3}
                            >
                                No students enrolled in selected course
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
                                        {professor.is_coordinator === 1 && (
                                            <td>
                                                <button
                                                    onClick={() =>
                                                        handleSave(
                                                            student.student_id
                                                        )
                                                    }
                                                >
                                                    Save
                                                </button>
                                            </td>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <td>{student.name}</td>
                                        <td>{student.number}</td>
                                        <td>{student.personal_email}</td>
                                        {professor.is_coordinator === 1 && (
                                            <td>
                                                <button
                                                    onClick={() =>
                                                        handleEditClick(student)
                                                    }
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            student.student_id
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
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default StudentsList;
