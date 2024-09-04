import React, { useState } from "react";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";

const AddCourse = () => {
    const { accessTokenData } = useAuth();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        abbreviation: "",
        name: "",
        date: "",
        schedule: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
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

        if (loading) return;
        if (!validateForm()) return;

        setLoading(true);

        fetch(endpoints.ADD_COURSES, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
            body: JSON.stringify(formData),
        })
            .then(async (response) => {
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to add course");
                }
                return response.json();
            })
            .then(() => {
                alert("Course added successfully!");
                // Reset form
                setFormData({
                    abbreviation: "",
                    name: "",
                    date: "",
                    schedule: "",
                });
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
        <form onSubmit={handleSubmit}>
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
            <div className="date_input_container">
                <label className="date_input_label">Start Date</label>
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
                    <small style={{ fontSize: "0.6rem", paddingLeft: "5px" }}>
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
    );
};

export default AddCourse;
