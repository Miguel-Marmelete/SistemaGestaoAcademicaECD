import React, { useState, useEffect } from "react";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";

const ModulesList = () => {
    const [modules, setModules] = useState([]);
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
                setModules(data.modules);
            })
            .catch((error) => {
                console.error("Error fetching modules:", error);
                alert(error.message);
            });
    }, []);

    return (
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
                    </tr>
                </thead>
                <tbody>
                    {modules.map((module) => (
                        <tr key={module.module_id}>
                            <td>{module.name}</td>
                            <td>{module.abbreviation}</td>
                            <td>{module.ects}</td>
                            <td>{module.contact_hours}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ModulesList;
