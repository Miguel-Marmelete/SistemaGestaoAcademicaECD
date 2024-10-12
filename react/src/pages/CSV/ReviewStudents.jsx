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

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await customFetch(
                endpoints.ADD_AND_ENROLL_STUDENTS_CSV,
                accessTokenData,
                setAccessTokenData,
                "POST",
                {
                    students, // Send all students
                    course_id: course, // Include course_id
                }
            );
            alert("Students added successfully!");
            navigate("/addStudents");
        } catch (error) {
            alert(error);
            console.log(error);
        } finally {
            setLoading(false);
        }
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
                <h1>Review Students</h1>
            </header>
            {students.length === 0 ? (
                <p>No students to review</p>
            ) : (
                <table className="table-list" border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>IPBEJA Email</th>
                            <th>Number</th>
                            <th>Birthday</th>
                            <th>Address</th>
                            <th>City</th>
                            <th>Mobile</th>
                            <th>Class</th>
                            <th>Posto</th>
                            <th>Personal Email</th>
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
                <button
                    className="buttons"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? <ClipLoader size={15} /> : "Submit"}
                </button>
                <button className="buttons" onClick={toggleEditMode}>
                    {editMode ? "Save" : "Edit"}
                </button>
                <button
                    className="buttons"
                    onClick={() => navigate("/addStudents")}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default ReviewStudents;
