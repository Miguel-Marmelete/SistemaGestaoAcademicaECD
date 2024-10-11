import React, { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader"; // Import ClipLoader
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";
import ButtonMenu from "../../components/ButtonMenu";
import { modulesMenuButtons } from "../../../scripts/buttonsData";
import customFetch from "../../../scripts/customFetch";

const AssociateModulesToCourse = () => {
    const [courses, setCourses] = useState([]);
    const [modules, setModules] = useState([]);
    const [modulesInCourse, setModulesInCourse] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedModules, setSelectedModules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingModules, setLoadingModules] = useState(false); // New state for modules loading
    const [loadingModulesInCourse, setLoadingModulesInCourse] = useState(false); // New state for modules in course loading
    const [deletingModuleId, setDeletingModuleId] = useState(null); // New state for tracking deleting module
    const { accessTokenData, setAccessTokenData } = useAuth();

    // Fetch courses and modules from API
    useEffect(() => {
        customFetch(
            endpoints.GET_COURSES_AND_MODULES_OF_PROFESSOR,
            accessTokenData,
            setAccessTokenData
        )
            .then((data) => {
                setCourses(data.courses.reverse());
            })
            .catch((error) => {
                alert(error);
            });

        setLoadingModules(true); // Start loading modules
        customFetch(endpoints.GET_MODULES, accessTokenData, setAccessTokenData)
            .then((data) => {
                setModules(data.modules.reverse());
            })
            .catch((error) => {
                alert(error);
            })
            .finally(() => setLoadingModules(false)); // End loading modules
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            setLoadingModulesInCourse(true); // Start loading modules in course
            customFetch(
                `${endpoints.GET_MODULES_BY_COURSE}?course_id=${selectedCourse}`,
                accessTokenData,
                setAccessTokenData
            )
                .then((data) => {
                    setModulesInCourse(data.modules.reverse());
                })
                .catch((error) => {
                    alert(error);
                })
                .finally(() => setLoadingModulesInCourse(false)); // End loading modules in course
        }
    }, [selectedCourse]);

    // Handle course change
    const handleCourseChange = (event) => {
        setSelectedCourse(event.target.value);
    };

    // Handle module selection via checkboxes
    const handleModuleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        const numericValue = parseInt(value, 10);

        setSelectedModules((prevSelectedModules) => {
            if (checked) {
                return [...prevSelectedModules, numericValue];
            } else {
                return prevSelectedModules.filter(
                    (module_id) => module_id !== numericValue
                );
            }
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);

        const associationData = {
            course_id: selectedCourse,
            module_ids: selectedModules,
        };

        customFetch(
            endpoints.ASSOCIATE_MODULES_TO_COURSE,
            accessTokenData,
            setAccessTokenData,
            "POST",
            associationData
        )
            .then(() => {
                alert("Módulos associados ao curso com sucesso!");
                setSelectedCourse("");
                setSelectedModules([]);
                setModulesInCourse([]);
            })
            .catch((error) => {
                console.error("Error:", error);
                alert(error.message);
            })
            .finally(() => setLoading(false));
    };

    // Add this function to handle module deletion
    const handleDeleteAssociation = (moduleId) => {
        if (!selectedCourse) {
            alert("No course selected.");
            return;
        }

        const deleteData = {
            course_id: selectedCourse,
            module_id: moduleId,
        };

        setLoading(true);
        setDeletingModuleId(moduleId); // Set the module being deleted

        customFetch(
            endpoints.DELETE_MODULE_FROM_COURSE,
            accessTokenData,
            setAccessTokenData,
            "DELETE",
            deleteData
        )
            .then(() => {
                alert("Módulo removido do curso com sucesso!");
                setModulesInCourse((prevModules) =>
                    prevModules.filter(
                        (module) => module.module_id !== moduleId
                    )
                );
            })
            .catch((error) => {
                console.error("Error:", error);
                alert(error.message);
            })
            .finally(() => {
                setLoading(false);
                setDeletingModuleId(null); // Reset the deleting module
            });
    };

    return (
        <div>
            <ButtonMenu buttons={modulesMenuButtons} />
            <div className="container">
                <form className="submitForm" onSubmit={handleSubmit}>
                    <h2>Associar Módulos ao Curso</h2>

                    <div>
                        <label>Selecione um Curso</label>
                        <select
                            name="course"
                            value={selectedCourse}
                            onChange={handleCourseChange}
                            required
                        >
                            <option value="" disabled>
                                Selecione um Curso
                            </option>
                            {courses.map((course) => (
                                <option
                                    key={course.course_id}
                                    value={course.course_id}
                                >
                                    {course.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Módulos</label>
                        <div className="form-table-responsive">
                            <table className="form-table">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Selecione</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loadingModules ? (
                                        <tr>
                                            <td colSpan="2">
                                                Loading <ClipLoader size={15} />
                                            </td>
                                        </tr>
                                    ) : modules.length > 0 ? (
                                        modules.map((module) => (
                                            <tr key={module.module_id}>
                                                <td>{module.name}</td>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        name="module_ids"
                                                        value={module.module_id}
                                                        checked={selectedModules.includes(
                                                            module.module_id
                                                        )}
                                                        onChange={
                                                            handleModuleCheckboxChange
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2">
                                                Não há módulos disponíveis
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? <ClipLoader size={15} /> : "Submeter"}
                    </button>
                </form>
                <div className="list">
                    <h2>Módulos Associados ao Curso </h2>
                    <table className="form-table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingModulesInCourse ? (
                                <tr>
                                    <td colSpan="3">
                                        Loading <ClipLoader size={15} />
                                    </td>
                                </tr>
                            ) : modulesInCourse.length > 0 ? (
                                modulesInCourse.map((module) => (
                                    <tr key={module.module_id}>
                                        <td>{module.name}</td>
                                        <td>
                                            <button
                                                className="buttons"
                                                onClick={() =>
                                                    handleDeleteAssociation(
                                                        module.module_id
                                                    )
                                                }
                                                disabled={
                                                    deletingModuleId ===
                                                    module.module_id
                                                } // Disable button if deleting
                                            >
                                                {deletingModuleId ===
                                                module.module_id ? (
                                                    <ClipLoader size={15} />
                                                ) : (
                                                    "Delete"
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2">
                                        Não há módulos associados a este curso
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AssociateModulesToCourse;
