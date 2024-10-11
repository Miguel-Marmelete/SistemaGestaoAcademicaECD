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

    const { students, course } = state || { students: [], course: null };

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
                        {students.map((student, index) => (
                            <tr key={index}>
                                <td>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={student.name}
                                            // Add onChange handler to update student data
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
                                            // Add onChange handler to update student data
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
                                            // Add onChange handler to update student data
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
                                            // Add onChange handler to update student data
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
                                            // Add onChange handler to update student data
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
                                            // Add onChange handler to update student data
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
                                            // Add onChange handler to update student data
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
                                            // Add onChange handler to update student data
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
                                            // Add onChange handler to update student data
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
                                            // Add onChange handler to update student data
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
                                            // Add onChange handler to update student data
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
