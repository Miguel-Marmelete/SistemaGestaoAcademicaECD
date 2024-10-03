import React, { useState, useEffect } from "react";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";
import ButtonMenu from "../../components/ButtonMenu";
import { modulesMenuButtons } from "../../../scripts/buttonsData";
import { fetchCoursesAndModulesOfProfessor } from "../../../scripts/getCoursesandModulesOfProfessor";
import customFetch from "../../../scripts/customFetch";

const AssociateProfessorToModule = () => {
    const { accessTokenData, setAccessTokenData } = useAuth();
    const [modules, setModules] = useState([]);
    const [professors, setProfessors] = useState([]);
    const [courses, setCourses] = useState([]);
    const [professorsAndModules, setProfessorsAndModules] = useState([]);
    const [selectedModule, setSelectedModule] = useState("");
    const [selectedProfessor, setSelectedProfessor] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [loading, setLoading] = useState(false); // New loading state

    // Fetch professors and courses only once when component mounts
    useEffect(() => {
        customFetch(
            endpoints.GET_PROFESSORS,
            accessTokenData,
            setAccessTokenData
        )
            .then((data) => setProfessors(data.professors))
            .catch((error) =>
                alert("Failed to fetch professors: " + error.message)
            );

        customFetch(
            endpoints.GET_COURSES_AND_MODULES_OF_PROFESSOR,
            accessTokenData,
            setAccessTokenData
        )
            .then((data) => {
                setCourses(data.courses.reverse());
            })
            .catch((error) => {
                alert("Failed to fetch courses and modules: " + error.message);
            });
    }, [accessTokenData.access_token]);

    // Fetch modules and professors-and-modules when a course is selected
    useEffect(() => {
        if (selectedCourse) {
            customFetch(
                `${endpoints.GET_MODULES_BY_COURSE}?course_id=${selectedCourse}`,
                accessTokenData,
                setAccessTokenData
            )
                .then((data) => setModules(data.modules.reverse()))
                .catch((error) =>
                    alert("Erro ao procurar módulos: " + error.message)
                );

            // Fetch professors and modules by course (new fetch)
            customFetch(
                `${endpoints.GET_PROFESSORS_IN_CHARGE_OF_MODULES_BY_COURSE}?course_id=${selectedCourse}`,
                accessTokenData,
                setAccessTokenData
            )
                .then((data) =>
                    setProfessorsAndModules(data.professorsAndModules)
                )
                .catch((error) =>
                    alert(
                        "Failed to fetch professors and modules: " +
                            error.message
                    )
                );
        }
    }, [selectedCourse]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        const associationData = {
            professor_id: selectedProfessor,
            module_id: selectedModule,
            course_id: selectedCourse,
        };

        fetch(endpoints.ASSOCIATE_PROFESSOR_TO_MODULE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
            body: JSON.stringify(associationData),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((error) => {
                        throw new Error(error.message || "Unknown error");
                    });
                }
                return response.json();
            })
            .then(() => {
                alert("Professor associated to module successfully!");
                setSelectedModule("");
                setSelectedProfessor("");
                setSelectedCourse("");
                setProfessorsAndModules([]);
            })
            .catch((error) => alert("Error: " + error.message))
            .finally(() => setLoading(false));
    };

    return (
        <div>
            <ButtonMenu buttons={modulesMenuButtons} />
            <div className="container">
                <form className="submitForm" onSubmit={handleSubmit}>
                    <h2>Atribuir módulo a professor</h2>
                    <div>
                        <label>Curso</label>
                        <select
                            name="course"
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            required
                        >
                            <option value="" disabled>
                                Selecione um curso
                            </option>
                            {courses && courses.length > 0 ? (
                                courses.map((course) => (
                                    <option
                                        key={course.course_id}
                                        value={course.course_id}
                                    >
                                        {course.name}
                                    </option>
                                ))
                            ) : (
                                <option disabled>
                                    Nenhum curso disponível
                                </option>
                            )}
                        </select>
                    </div>
                    <div>
                        <label>Módulo</label>
                        <select
                            name="module"
                            value={selectedModule}
                            onChange={(e) => setSelectedModule(e.target.value)}
                            disabled={!selectedCourse}
                            required
                        >
                            <option value="" disabled>
                                Selecione um módulo
                            </option>
                            {modules && modules.length > 0 ? (
                                modules.map((module) => (
                                    <option
                                        key={module.module_id}
                                        value={module.module_id}
                                    >
                                        {module.name}
                                    </option>
                                ))
                            ) : (
                                <option disabled>
                                    Nenhum módulo disponível
                                </option>
                            )}
                        </select>
                    </div>
                    <div>
                        <label>Professor</label>
                        <select
                            name="professor"
                            value={selectedProfessor}
                            onChange={(e) =>
                                setSelectedProfessor(e.target.value)
                            }
                            required
                        >
                            <option value="" disabled>
                                Selecione um professor
                            </option>
                            {professors && professors.length > 0 ? (
                                professors.map((professor) => (
                                    <option
                                        key={professor.professor_id}
                                        value={professor.professor_id}
                                    >
                                        {professor.name}
                                    </option>
                                ))
                            ) : (
                                <option disabled>
                                    Nenhum professor disponível
                                </option>
                            )}
                        </select>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "A submeter..." : "Submeter"}
                    </button>
                </form>

                {/* Display existing professors and modules */}
                <div className="list">
                    <h2>Professores encarregados dos módulos</h2>
                    {professorsAndModules && professorsAndModules.length > 0 ? (
                        <table className="form-table">
                            <thead>
                                <tr>
                                    <th>Módulo</th>
                                    <th>Professor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {professorsAndModules.map((item) => (
                                    <tr key={item.module.module_id}>
                                        <td>{item.module.name}</td>
                                        <td>
                                            {item.professor
                                                ? item.professor.name
                                                : "Sem professor designado"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Nenhum professor encarregado de módulo</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssociateProfessorToModule;
