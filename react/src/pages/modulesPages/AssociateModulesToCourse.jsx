import React, { useState, useEffect } from "react";
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
    const { accessTokenData, setAccessTokenData } = useAuth();

    // Fetch courses from API
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

        customFetch(endpoints.GET_MODULES, accessTokenData, setAccessTokenData)
            .then((data) => {
                setModules(data.modules.reverse());
            })
            .catch((error) => {
                alert(error);
            });
    }, []);

    useEffect(() => {
        if (selectedCourse) {
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
                });
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
                            {modules.length > 0 ? (
                                <table className="form-table">
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>Selecione</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {modules.map((module) => (
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
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>Não há módulos disponíveis</p>
                            )}
                        </div>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "A submeter..." : "Submeter"}
                    </button>
                </form>
                <div className="list">
                    <h2>Módulos Associados ao Curso </h2>
                    {modulesInCourse.length > 0 ? (
                        <table className="form-table">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                </tr>
                            </thead>
                            <tbody>
                                {modulesInCourse.map((module) => (
                                    <tr key={module.module_id}>
                                        <td>{module.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Não há módulos associados a este curso</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssociateModulesToCourse;
