import React, { useState, useEffect } from "react";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";

const AddModule = () => {
    const { accessTokenData } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        contact_hours: "",
        abbreviation: "",
        ects: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log("formdata", formData);
            const response = await fetch(endpoints.ADD_MODULES, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessTokenData.access_token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Module added successfully!");
                // Reset form
                setFormData({
                    name: "",
                    contact_hours: "",
                    abbreviation: "",
                    ects: "",
                });
            } else {
                alert("Failed to add module");
            }
        } catch (error) {
            console.error("Error:", error);
            alert(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Adicionar Módulo</h2>
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
            </div>
            <div>
                <label>Horas de Contacto</label>
                <input
                    type="text"
                    name="contact_hours"
                    value={formData.contact_hours}
                    onChange={handleChange}
                    required
                    pattern="\d+"
                />
            </div>
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
            <div>
                <label>ECTS</label>
                <input
                    type="text"
                    name="ects"
                    value={formData.ects}
                    onChange={handleChange}
                    required
                    maxLength={255}
                />
            </div>

            <button type="submit">Submeter</button>
        </form>
    );
};

export default AddModule;
