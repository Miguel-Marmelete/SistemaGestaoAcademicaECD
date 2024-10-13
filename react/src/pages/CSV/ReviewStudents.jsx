import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import customFetch from "../../../scripts/customFetch";
import endpoints from "../../endpoints";
import { ClipLoader } from "react-spinners";

const ReviewStudents = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { accessTokenData, setAccessTokenData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);

    // Destructure students and course from state
    const { students = [], course = null } = state || {};

    // Initialize studentsData with students from state
    const [studentsData, setStudentsData] = useState(students);

    const handleSubmit = () => {
        setLoading(true);
        customFetch(
            endpoints.ADD_AND_ENROLL_STUDENTS_CSV,
            accessTokenData,
            setAccessTokenData,
            "POST",
            {
                students, // Send all students
                course_id: course, // Include course_id
            }
        )
            .then((data) => {
                alert(data.message);
                navigate("/addStudents");
            })
            .catch((error) => {
                console.log(error);
                alert(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const toggleEditMode = () => {
        setEditMode(!editMode);
    };

    const handleInputChange = (index, field, value) => {
        const updatedStudents = [...studentsData];
        updatedStudents[index][field] = value;
        setStudentsData(updatedStudents);
    };

    return (
        <div className="table-list-container">
            <header>
                <h1>Alunos</h1>
            </header>
            {students.length === 0 ? (
                <p>Não há alunos para submeter</p>
            ) : (
                <table className="table-list" border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email IPBEJA</th>
                            <th>Número</th>
                            <th>Data de Nascimento</th>
                            <th>Morada</th>
                            <th>Cidade</th>
                            <th>Telemóvel</th>
                            <th>Classe</th>
                            <th>Posto</th>
                            <th>Email Pessoal</th>
                            <th>NIM</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentsData.map((student, index) => (
                            <tr key={index}>
                                <td>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={student.name}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    index,
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    ) : (
                                        student.name
                                    )}
                                </td>
                                <td>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={student.ipbeja_email}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    index,
                                                    "ipbeja_email",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    ) : (
                                        student.ipbeja_email
                                    )}
                                </td>
                                <td>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={student.number}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    index,
                                                    "number",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    ) : (
                                        student.number
                                    )}
                                </td>
                                <td>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={student.birthday}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    index,
                                                    "birthday",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    ) : (
                                        student.birthday
                                    )}
                                </td>
                                <td>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={student.address}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    index,
                                                    "address",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    ) : (
                                        student.address
                                    )}
                                </td>
                                <td>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={student.city}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    index,
                                                    "city",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    ) : (
                                        student.city
                                    )}
                                </td>
                                <td>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={student.mobile}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    index,
                                                    "mobile",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    ) : (
                                        student.mobile
                                    )}
                                </td>
                                <td>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={student.classe}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    index,
                                                    "classe",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    ) : (
                                        student.classe
                                    )}
                                </td>
                                <td>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={student.posto}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    index,
                                                    "posto",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    ) : (
                                        student.posto
                                    )}
                                </td>
                                <td>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={student.personal_email}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    index,
                                                    "personal_email",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    ) : (
                                        student.personal_email
                                    )}
                                </td>
                                <td>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={student.nim}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    index,
                                                    "nim",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    ) : (
                                        student.nim
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <div className="button-group">
                {!editMode && (
                    <button
                        className="buttons"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <ClipLoader size={15} /> : "Submeter"}
                    </button>
                )}
                <button className="buttons" onClick={toggleEditMode}>
                    {editMode ? "Guardar Alterações" : "Editar"}
                </button>
            </div>
        </div>
    );
};

export default ReviewStudents;
