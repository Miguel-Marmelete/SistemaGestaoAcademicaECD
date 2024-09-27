import React, { useState, useEffect } from "react";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";
import ButtonMenu from "../../components/ButtonMenu";
import { coursesMenuButtons } from "../../../scripts/buttonsData";
import customFetch from "../../../scripts/customFetch";

const AddCourse = () => {
    const { accessTokenData, setAccessTokenData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [courseAdded, setCourseAdded] = useState(false);
    const [formData, setFormData] = useState({
        abbreviation: "",
        name: "",
        date: "",
        schedule: "",
    });
    const [editedCourse, setEditedCourse] = useState({});

    useEffect(() => {
        customFetch(endpoints.GET_COURSES, accessTokenData, setAccessTokenData)
            .then((data) => {
                setCourses(data.courses.reverse());
            })
            .catch((error) => console.error(error));
    }, [courseAdded]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditedCourse({
            ...editedCourse,
            [name]: value,
        });
    };

    const validateForm = () => {
        const { abbreviation, name, date, schedule } = formData;

        if (abbreviation.trim() === "" || abbreviation.length > 255) {
            alert(
                "Abbreviation is required and should not exceed 255 characters."
            );
            return false;
        }
        if (name.trim() === "" || name.length > 255) {
            alert("Name is required and should not exceed 255 characters.");
            return false;
        }
        if (!date || isNaN(new Date(date).getTime())) {
            alert("Date is required and must be a valid date.");
            return false;
        }
        if (schedule && schedule.length > 255) {
            alert("Schedule should not exceed 255 characters.");
            return false;
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (loading) return; // Prevent multiple fetches
        if (!validateForm()) return;

        setLoading(true);

        customFetch(
            endpoints.ADD_COURSES,
            accessTokenData,
            setAccessTokenData,
            "POST",
            formData
        )
            .then(() => {
                alert("Course added successfully!");
                setFormData({
                    abbreviation: "",
                    name: "",
                    date: "",
                    schedule: "",
                });
                setCourseAdded((prev) => !prev);
            })
            .catch((error) => {
                console.error("Error:", error.message);
                alert(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div>
            <ButtonMenu buttons={coursesMenuButtons} />
            <div className="container">
                <form className="submitForm" onSubmit={handleSubmit}>
                    <h2>Add Course</h2>
                    <div>
                        <label>Course Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            maxLength={255}
                        />
                    </div>
                    <div>
                        <label>Abbreviation</label>
                        <input
                            type="text"
                            name="abbreviation"
                            value={formData.abbreviation}
                            onChange={handleChange}
                            required
                            maxLength={255}
                        />
                    </div>
                    <div>
                        <label>Start Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>
                            Schedule
                            <small
                                style={{
                                    fontSize: "0.6rem",
                                    paddingLeft: "5px",
                                }}
                            >
                                (Optional)
                            </small>
                        </label>
                        <input
                            type="text"
                            name="schedule"
                            value={formData.schedule}
                            onChange={handleChange}
                            maxLength={255}
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                </form>

                <div className="list">
                    <h2>Existing Courses</h2>
                    <ul>
                        {courses.map((course) => (
                            <li key={course.course_id}>
                                <>
                                    {course.name} - {course.abbreviation}
                                </>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AddCourse;
