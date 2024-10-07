import React, { useState, useEffect } from "react";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";
import ButtonMenu from "../../components/ButtonMenu";
import { modulesMenuButtons } from "../../../scripts/buttonsData";
import customFetch from "../../../scripts/customFetch";

const SubModulesList = () => {
    const [subModules, setSubModules] = useState([]);
    const [editedSubModule, setEditedSubModule] = useState({});
    const { accessTokenData, setAccessTokenData, professor } = useAuth();
    const [isCoordinator, setIsCoordinator] = useState(false);

    useEffect(() => {
        if (professor) {
            setIsCoordinator(professor.is_coordinator === 1);
        }
    }, [professor]);

    // Fetch submodules from API
    useEffect(() => {
        customFetch(
            endpoints.GET_SUBMODULES,
            accessTokenData,
            setAccessTokenData
        )
            .then((data) => {
                console.log(data);
                setSubModules(data.submodules.reverse());
            })
            .catch((error) => {
                console.error("Error fetching submodules:", error);
                alert(error.message);
            });
    }, [accessTokenData.access_token]);

    const handleDelete = (subModuleId) => {
        if (
            !window.confirm("Are you sure you want to delete this submodule?")
        ) {
            return;
        }
        customFetch(
            endpoints.DELETE_SUBMODULE + `/${subModuleId}`,
            accessTokenData,
            setAccessTokenData,
            "DELETE"
        )
            .then(() => {
                setSubModules((prevSubModules) =>
                    prevSubModules.filter(
                        (subModule) => subModule.submodule_id !== subModuleId
                    )
                );
                alert("Submodule deleted successfully");
            })
            .catch((error) => {
                alert(error.message);
            });
    };

    const handleEditClick = (subModule) => {
        setEditedSubModule(subModule);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedSubModule({ ...editedSubModule, [name]: value });
    };

    const handleSave = (subModuleId) => {
        if (
            !window.confirm("Are you sure you want to update this submodule?")
        ) {
            return;
        }

        customFetch(
            endpoints.UPDATE_SUBMODULE + `/${subModuleId}`,
            accessTokenData,
            setAccessTokenData,
            "PUT",
            editedSubModule
        )
            .then(() => {
                setSubModules((prevSubModules) =>
                    prevSubModules.map((subModule) =>
                        subModule.submodule_id === subModuleId
                            ? { ...subModule, ...editedSubModule }
                            : subModule
                    )
                );
                setEditedSubModule({});
                alert("Submódulo atualizado com sucesso");
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
                    <h1>SubMódulos Disponíveis</h1>
                </header>
                <table className="table-list" border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Abreviatura</th>
                            <th>Horas de Contacto</th>
                            <th>Módulo Principal</th>
                            {isCoordinator && <th>Ações</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {subModules.map((subModule) => (
                            <tr key={subModule.submodule_id}>
                                {editedSubModule.submodule_id ===
                                subModule.submodule_id ? (
                                    <>
                                        <td>
                                            <input
                                                type="text"
                                                name="name"
                                                value={editedSubModule.name}
                                                onChange={handleChange}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                name="abbreviation"
                                                value={
                                                    editedSubModule.abbreviation
                                                }
                                                onChange={handleChange}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                name="contact_hours"
                                                value={
                                                    editedSubModule.contact_hours
                                                }
                                                onChange={handleChange}
                                            />
                                        </td>
                                        <td>{subModule.module.name}</td>
                                        {isCoordinator && (
                                            <td>
                                                <button
                                                    className="buttons"
                                                    onClick={() =>
                                                        handleSave(
                                                            subModule.submodule_id
                                                        )
                                                    }
                                                >
                                                    Save
                                                </button>
                                            </td>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <td>{subModule.name}</td>
                                        <td>{subModule.abbreviation}</td>
                                        <td>{subModule.contact_hours}</td>
                                        <td>{subModule.module.name}</td>
                                        {isCoordinator && (
                                            <td>
                                                <button
                                                    className="buttons"
                                                    onClick={() =>
                                                        handleEditClick(
                                                            subModule
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="buttons"
                                                    onClick={() =>
                                                        handleDelete(
                                                            subModule.submodule_id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        )}
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

export default SubModulesList;
