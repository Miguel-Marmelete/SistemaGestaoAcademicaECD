import React, { useState } from "react";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";

const AddCourse = () => {
    const { accessTokenData } = useAuth();

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch(endpoints.ADD_COURSES, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessTokenData.access_token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Course added successfully!");
                // Reset form
                setFormData({
                    abbreviation: "",
                    name: "",
                    date: "",
                    schedule: "",
                });
            } else {
                alert("Failed to add course");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while adding the course");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Adicionar Curso</h2>
            <div>
                <label>Nome</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={255}
                />
            </div>{" "}
            <div>
                <label>Abreviatura</label>
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
                <label className="date_input_label">Data de Inicio</label>
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
                    Horário
                    <small style={{ fontSize: "0.6rem", paddingLeft: "5px" }}>
                        (Campo Opcional)
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
            <button type="submit">Submeter</button>
        </form>
    );
};

export default AddCourse;
