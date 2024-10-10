import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import customFetch from "../../../scripts/customFetch";
import { useAuth } from "../../auth/AuthContext";
import endPoints from "../../endpoints";

function ReviewCourses() {
    const location = useLocation();
    const navigate = useNavigate();
    const { accessTokenData, setAccessTokenData } = useAuth();
    const { courses } = location.state || { courses: [] };
    const [editableCourses, setEditableCourses] = useState(courses);

    const handleInputChange = (index, field, value) => {
        const updatedCourses = [...editableCourses];
        updatedCourses[index][field] = value;
        setEditableCourses(updatedCourses);
    };

    const handleConfirm = () => {
        customFetch(
            endPoints.ADD_COURSES_CSV,
            accessTokenData,
            setAccessTokenData,
            "POST",
            editableCourses
        )
            .then(() => {
                alert("Courses submitted successfully");
                navigate("/addCourse");
            })
            .catch((error) => {
                console.error("Error submitting courses:", error);
            });
    };

    return (
        <div className="table-list-container">
            <header>
                <h1>Review Courses</h1>
            </header>
            <table className="table-list" border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Abbreviation</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {editableCourses.map((course, index) => (
                        <tr key={index}>
                            <td>
                                <input
                                    type="text"
                                    value={course.name}
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            "name",
                                            e.target.value
                                        )
                                    }
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={course.abbreviation}
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            "abbreviation",
                                            e.target.value
                                        )
                                    }
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={course.date}
                                    onChange={(e) =>
                                        handleInputChange(
                                            index,
                                            "date",
                                            e.target.value
                                        )
                                    }
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="buttons" onClick={handleConfirm}>
                Confirm
            </button>
        </div>
    );
}

export default ReviewCourses;
