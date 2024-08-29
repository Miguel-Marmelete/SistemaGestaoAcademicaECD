import React, { useState, useEffect } from "react";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";

const SubModulesList = () => {
    const [subModules, setSubModules] = useState([]);
    const { accessTokenData } = useAuth();

    // Fetch submodules from API
    useEffect(() => {
        fetch(endpoints.GET_SUBMODULES, {
            // Assuming GET_SUBMODULES is the correct endpoint for fetching submodules
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch submodules");
                }
                return response.json();
            })
            .then((data) => {
                console.log("submodules", data.submodules);
                setSubModules(data.submodules);
            })
            .catch((error) => {
                console.error("Error fetching submodules:", error);
                alert("Failed to load submodules.");
            });
    }, [accessTokenData.access_token]);

    return (
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
                    </tr>
                </thead>
                <tbody>
                    {subModules.map((subModule) => (
                        <tr key={subModule.submodule_id}>
                            <td>{subModule.name}</td>
                            <td>{subModule.abbreviation}</td>
                            <td>{subModule.contact_hours}</td>
                            <td>{subModule.module_id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SubModulesList;
