import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import endpoints from "../../endpoints";
import ButtonMenu from "../../components/ButtonMenu";
import { modulesMenuButtons } from "../../../scripts/buttonsData";
const AddSubModule = () => {
    const { accessTokenData } = useAuth();
    const [modules, setModules] = useState([]); // State for fetched modules
    const [subModules, setSubModules] = useState([]); // State for fetched submodules
    const [loading, setLoading] = useState(false); // Add loading state
    const [subModuleAdded, setSubModuleAdded] = useState(false); // State to track if a submodule was added
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
    }, [accessTokenData.access_token]);

    // Fetch submodules on component mount and when a submodule is added
    useEffect(() => {
        const fetchSubModules = async () => {
            try {
                const response = await fetch(endpoints.GET_SUBMODULES, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessTokenData.access_token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setSubModules(data.submodules.reverse());
                } else {
                    alert("Failed to fetch submodules");
                }
            } catch (error) {
                alert(error);
                console.error("Error:", error);
            }
        };

        fetchSubModules();
    }, [accessTokenData.access_token, subModuleAdded]); // Re-fetch submodules when subModuleAdded changes

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return; // Prevent multiple submissions

        setLoading(true); // Set loading to true

        try {
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
                setSubModuleAdded((prev) => !prev); // Toggle the state to trigger re-fetch
            } else {
                alert("Failed to add Submodule");
            }
        } catch (error) {
            console.error("Error:", error);
            alert(error.message);
        } finally {
            setLoading(false); // Set loading to false
        }
    };

    return (
        <div>
            <ButtonMenu buttons={modulesMenuButtons} />
            <div className="container">
                <form className="submitForm" onSubmit={handleSubmit}>
                    <h2>Adicionar Submódulo</h2>
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
                                <option
                                    key={module.module_id}
                                    value={module.module_id}
                                >
                                    {module.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Submitting..." : "Submeter"}
                    </button>
                </form>

                <div className="list">
                    <h2>Existing Submodules</h2>
                    <ul>
                        {subModules.map((subModule) => (
                            <li key={subModule.submodule_id}>
                                {subModule.name} - {subModule.abbreviation}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AddSubModule;
