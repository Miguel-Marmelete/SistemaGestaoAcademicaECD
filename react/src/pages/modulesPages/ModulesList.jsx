import React, { useState, useEffect } from "react";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";
import ButtonMenu from "../../components/ButtonMenu";
import { modulesMenuButtons } from "../../../scripts/buttonsData";
import customFetch from "../../../scripts/customFetch";
import { ClipLoader } from "react-spinners";
const ModulesList = () => {
    const [modules, setModules] = useState([]);
    const [editedModule, setEditedModule] = useState({});
    const { accessTokenData, setAccessTokenData, professor } = useAuth();
    const [isCoordinator, setIsCoordinator] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (professor) {
            setIsCoordinator(professor.is_coordinator === 1);
        }
    }, [professor]);

    // Fetch modules from API
    useEffect(() => {
        setIsLoading(true); // Set loading to true when starting the fetch
        customFetch(
            endpoints.GET_COURSES_AND_MODULES_OF_PROFESSOR,
            accessTokenData,
            setAccessTokenData
        )
            .then((data) => {
                console.log(data.modules);
                setModules(data.modules.reverse());
                setIsLoading(false); // Set loading to false after data is fetched
            })
            .catch((error) => {
                alert(error.message);
                setIsLoading(false); // Set loading to false if there's an error
            })
            .finally(() => {
                setIsLoading(false); // Set loading to false after the fetch is complete
            });
    }, []);

    const handleDelete = (moduleId) => {
        if (!window.confirm("Are you sure you want to delete this module?")) {
            return;
        }
        customFetch(
            endpoints.DELETE_MODULE + `/${moduleId}`,
            accessTokenData,
            setAccessTokenData,
            "DELETE"
        ).then(() => {
            setModules((prevModules) =>
                prevModules.filter((module) => module.module_id !== moduleId)
            );
            alert("Módulo apagado com sucesso");
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
        if (
            !window.confirm("Tem a certeza que deseja atualizar este módulo?")
        ) {
            return;
        }

        customFetch(
            endpoints.UPDATE_MODULE + `/${moduleId}`,
            accessTokenData,
            setAccessTokenData,
            "PUT",
            editedModule
        )
            .then(() => {
                setModules((prevModules) =>
                    prevModules.map((module) =>
                        module.module_id === moduleId
                            ? { ...module, ...editedModule }
                            : module
                    )
                );
                setEditedModule({});
                alert("Módulo atualizado com sucesso");
            })
            .catch((error) => {
                alert(error.message);
            });
    };
    if (!professor) {
        return (
            <div>
                <h2>
                    Loading <ClipLoader size={15} />
                </h2>
            </div>
        );
    }
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
                            {isCoordinator && <th>Ações</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={isCoordinator ? 5 : 4}>
                                    Loading <ClipLoader size={15} />
                                </td>
                            </tr>
                        ) : (
                            modules.map((module) => (
                                <tr key={module.module_id}>
                                    {editedModule.module_id ===
                                    module.module_id ? (
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
                                            {isCoordinator && (
                                                <td>
                                                    <button
                                                        className="buttons"
                                                        onClick={() =>
                                                            handleSave(
                                                                module.module_id
                                                            )
                                                        }
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="buttons"
                                                        onClick={() =>
                                                            setEditedModule({})
                                                        }
                                                    >
                                                        Cancel
                                                    </button>
                                                </td>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <td>{module.name}</td>
                                            <td>{module.abbreviation}</td>
                                            <td>{module.ects}</td>
                                            <td>{module.contact_hours}</td>
                                            {isCoordinator && (
                                                <td>
                                                    <button
                                                        className="buttons"
                                                        onClick={() =>
                                                            handleEditClick(
                                                                module
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="buttons"
                                                        onClick={() =>
                                                            handleDelete(
                                                                module.module_id
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
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ModulesList;
