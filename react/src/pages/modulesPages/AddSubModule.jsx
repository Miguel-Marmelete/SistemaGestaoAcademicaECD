import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import endpoints from "../../endpoints";
import ButtonMenu from "../../components/ButtonMenu";
import { modulesMenuButtons } from "../../../scripts/buttonsData";
import customFetch from "../../../scripts/customFetch";
import ClipLoader from "react-spinners/ClipLoader"; // Import ClipLoader

const AddSubModule = () => {
    const { accessTokenData, setAccessTokenData } = useAuth();
    const [modules, setModules] = useState([]);
    const [subModules, setSubModules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [subModuleAdded, setSubModuleAdded] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        contact_hours: "",
        abbreviation: "",
        module_id: "",
    });
    const [subModulesLoading, setSubModulesLoading] = useState(true); // For fetching submodules

    // Fetch modules on component mount
    useEffect(() => {
        customFetch(endpoints.GET_MODULES, accessTokenData, setAccessTokenData)
            .then((data) => {
                setModules(data.modules);
            })
            .catch((error) => {
                console.error("Erro ao procurar módulos:", error);
                alert(error.message);
            });
    }, [accessTokenData.access_token]);

    // Fetch submodules on component mount and when a submodule is added
    useEffect(() => {
        setSubModulesLoading(true); // Start loading before fetching submodules
        customFetch(
            endpoints.GET_SUBMODULES,
            accessTokenData,
            setAccessTokenData
        )
            .then((data) => {
                setSubModules(data.submodules.reverse());
            })
            .catch((error) => {
                console.error("Erro ao procurar submódulos:", error);
                alert(error.message);
            })
            .finally(() => {
                setSubModulesLoading(false); // Stop loading after fetching submodules
            });
    }, [accessTokenData.access_token, subModuleAdded]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);

        customFetch(
            endpoints.ADD_SUBMODULES,
            accessTokenData,
            setAccessTokenData,

            "POST",
            formData
        )
            .then((data) => {
                setFormData({
                    name: "",
                    contact_hours: "",
                    abbreviation: "",
                    module_id: "",
                });
                setSubModuleAdded(!subModuleAdded);
                alert("Submódulo adicionado com sucesso!");
            })
            .catch((error) => {
                console.error("Erro ao adicionar submódulo:", error);
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
                    <h2>Adicionar Submódulo</h2>
                    <div>
                        <label>Selecione o Módulo</label>
                        <select
                            name="module_id"
                            value={formData.module_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>
                                Selecione um módulo
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

                    <button type="submit" disabled={loading}>
                        {loading ? <ClipLoader size={15} /> : "Submeter"}
                    </button>
                </form>

                <div className="list">
                    <h2>Submódulos Existentes</h2>
                    <table className="form-table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Abreviatura</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subModulesLoading ? (
                                <tr>
                                    <td colSpan="2">
                                        Loading <ClipLoader size={15} />
                                    </td>
                                </tr>
                            ) : (
                                subModules.map((subModule) => (
                                    <tr key={subModule.submodule_id}>
                                        <td>{subModule.name}</td>
                                        <td>{subModule.abbreviation}</td>
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

export default AddSubModule;
