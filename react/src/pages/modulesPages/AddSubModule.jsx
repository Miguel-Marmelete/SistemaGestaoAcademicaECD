import React, { useState, useEffect } from "react";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";

const AddSubModule = () => {
    const { accessTokenData } = useAuth();
    const [modules, setModules] = useState([]); // State for fetched modules
    const [formData, setFormData] = useState({
        name: "",
        contact_hours: "",
        abbreviation: "",
        module_id: "",
    });

    // Fetch modules on component mount
    useEffect(() => {
        const fetchModules = async () => {
            try {
                const response = await fetch(endpoints.GET_MODULES, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessTokenData.access_token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setModules(data.modules);
                } else {
                    alert("Failed to fetch modules");
                }
            } catch (error) {
                alert(error);
                console.error("Error:", error);
            }
        };

        fetchModules();
    }, []);

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
            const response = await fetch(endpoints.ADD_SUBMODULES, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessTokenData.access_token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("SubModule added successfully!");
                // Reset form
                setFormData({
                    name: "",
                    contact_hours: "",
                    abbreviation: "",
                    module_id: "",
                });
            } else {
                alert("Failed to add Submodule");
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
                <label>Módulo</label>
                <select
                    name="module_id"
                    value={formData.module_id}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>
                        Select a module
                    </option>
                    {modules.map((module) => (
                        <option key={module.module_id} value={module.module_id}>
                            {module.name}
                        </option>
                    ))}
                </select>
            </div>

            <button type="submit">Submeter</button>
        </form>
    );
};

export default AddSubModule;
