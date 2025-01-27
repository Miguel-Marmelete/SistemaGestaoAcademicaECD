import React, { useState, useEffect } from "react";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";
import ButtonMenu from "../../components/ButtonMenu";
import { modulesMenuButtons } from "../../../scripts/buttonsData";
import customFetch from "../../../scripts/customFetch";
import ClipLoader from "react-spinners/ClipLoader"; // Import ClipLoader

const AddModule = () => {
    const { accessTokenData, setAccessTokenData } = useAuth();
    const [loading, setLoading] = useState(false); // For form submission
    const [modulesLoading, setModulesLoading] = useState(true); // For fetching modules
    const [modules, setModules] = useState([]); // State for fetched modules
    const [moduleAdded, setModuleAdded] = useState(false); // State to track if a module was added

    const [formData, setFormData] = useState({
        name: "",
        contact_hours: "",
        abbreviation: "",
        ects: "",
    });

    useEffect(() => {
        setModulesLoading(true); // Start loading before fetching modules
        customFetch(endpoints.GET_MODULES, accessTokenData, setAccessTokenData)
            .then((data) => {
                setModules(data.modules.reverse());
            })
            .catch((error) => {
                console.error(error);
                alert(error);
            })
            .finally(() => {
                setModulesLoading(false); // Stop loading after fetching modules
            });
    }, [moduleAdded]);

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

        customFetch(
            endpoints.ADD_MODULES,
            accessTokenData,
            setAccessTokenData,
            "POST",
            formData
        )
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
        <div>
            <ButtonMenu buttons={modulesMenuButtons} />
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
                            pattern="\d+"
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? <ClipLoader size={15} /> : "Submeter"}
                    </button>
                </form>

                <div className="list">
                    <h2>Módulos Existentes</h2>
                    <table className="form-table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Abreviatura</th>
                            </tr>
                        </thead>
                        <tbody>
                            {modulesLoading ? (
                                <tr>
                                    <td colSpan="2">
                                        Loading <ClipLoader size={15} />
                                    </td>
                                </tr>
                            ) : (
                                modules.map((module) => (
                                    <tr key={module.module_id}>
                                        <td>{module.name}</td>
                                        <td>{module.abbreviation}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AddModule;
