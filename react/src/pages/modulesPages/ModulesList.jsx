import React, { useState, useEffect } from "react";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";
import ButtonMenu from "../../components/ButtonMenu";
import { modulesMenuButtons } from "../../../scripts/buttonsData";

const ModulesList = () => {
    const [modules, setModules] = useState([]);
    const [editedModule, setEditedModule] = useState({});
    const { accessTokenData } = useAuth();

    // Fetch modules from API
    useEffect(() => {
        fetch(endpoints.GET_MODULES, {
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
                console.log("modules", data.modules);
                setModules(data.modules.reverse());
            })
            .catch((error) => {
                console.error("Error fetching modules:", error);
                alert(error.message);
            });
    }, []);

    const handleDelete = (moduleId) => {
        if (!window.confirm("Are you sure you want to delete this module?")) {
            return;
        }
        fetch(endpoints.DELETE_MODULE + `/${moduleId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to delete module");
                }
                setModules((prevModules) =>
                    prevModules.filter(
                        (module) => module.module_id !== moduleId
                    )
                );
                alert("Module deleted successfully");
            })
            .catch((error) => {
                alert(error.message);
            });
    };

    const handleEditClick = (module) => {
        setEditedModule(module);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedModule({ ...editedModule, [name]: value });
    };

    const handleSave = (moduleId) => {
        if (!window.confirm("Are you sure you want to update this module?")) {
            return;
        }

        fetch(endpoints.UPDATE_MODULE + `/${moduleId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
            body: JSON.stringify(editedModule),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to update module");
                }
                return response.json();
            })
            .then(() => {
                setModules((prevModules) =>
                    prevModules.map((module) =>
                        module.module_id === moduleId
                            ? { ...module, ...editedModule }
                            : module
                    )
                );
                setEditedModule({});
                alert("Module updated successfully");
            })
            .catch((error) => {
                alert(error.message);
            });
    };

    return (
        <div>
            <ButtonMenu buttons={modulesMenuButtons} />
            <div className="table-list-container">
                <header>
                    <h1>Módulos Disponíveis</h1>
                </header>
                <table className="table-list" border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Abreviatura</th>
                            <th>ECTS</th>
                            <th>Horas de Contacto</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {modules.map((module) => (
                            <tr key={module.module_id}>
                                {editedModule.module_id === module.module_id ? (
                                    <>
                                        <td>
                                            <input
                                                type="text"
                                                name="name"
                                                value={editedModule.name}
                                                onChange={handleChange}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="abbreviation"
                                                value={
                                                    editedModule.abbreviation
                                                }
                                                onChange={handleChange}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                name="ects"
                                                value={editedModule.ects}
                                                onChange={handleChange}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                name="contact_hours"
                                                value={
                                                    editedModule.contact_hours
                                                }
                                                onChange={handleChange}
                                            />
                                        </td>
                                        <td>
                                            <button
                                                onClick={() =>
                                                    handleSave(module.module_id)
                                                }
                                            >
                                                Save
                                            </button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{module.name}</td>
                                        <td>{module.abbreviation}</td>
                                        <td>{module.ects}</td>
                                        <td>{module.contact_hours}</td>
                                        <td>
                                            <button
                                                onClick={() =>
                                                    handleEditClick(module)
                                                }
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        module.module_id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ModulesList;
