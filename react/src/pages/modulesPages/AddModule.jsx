import React, { useState, useEffect } from "react";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";

const AddModule = () => {
    const { accessTokenData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [modules, setModules] = useState([]); // State for fetched modules
    const [moduleAdded, setModuleAdded] = useState(false); // State to track if a module was added

    const [formData, setFormData] = useState({
        name: "",
        contact_hours: "",
        abbreviation: "",
        ects: "",
    });

    useEffect(() => {
        fetch(endpoints.GET_MODULES, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch modules");
                }
                return response.json();
            })
            .then((data) => {
                setModules(data.modules.reverse());
            })
            .catch((error) => {
                console.error("Error fetching modules:", error);
                alert(error.message);
            });
    }, [moduleAdded]); // Trigger fetch when a module is added

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);

        fetch(endpoints.ADD_MODULES, {
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
                    throw new Error(errorData.error || "Failed to add module");
                }
                return response.json();
            })
            .then(() => {
                alert("Module added successfully!");
                // Reset form
                setFormData({
                    name: "",
                    contact_hours: "",
                    abbreviation: "",
                    ects: "",
                });
                setModuleAdded((prev) => !prev); // Toggle the state to trigger re-fetch
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
        <div className="container">
            <form className="submitForm" onSubmit={handleSubmit}>
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
                <button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>

            <div className="list">
                <h2>Existing Modules</h2>
                <ul>
                    {modules.map((module) => (
                        <li key={module.module_id}>
                            {module.name} - {module.abbreviation}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AddModule;
