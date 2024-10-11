import React, { useState, useEffect } from "react";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";
import ButtonMenu from "../../components/ButtonMenu";
import { modulesMenuButtons } from "../../../scripts/buttonsData";
import customFetch from "../../../scripts/customFetch";
import { ClipLoader } from "react-spinners";

const AssociateProfessorToModule = () => {
    const { accessTokenData, setAccessTokenData } = useAuth();
    const [modules, setModules] = useState([]);
    const [professors, setProfessors] = useState([]);
    const [courses, setCourses] = useState([]);
    const [professorsAndModules, setProfessorsAndModules] = useState([]);
    const [selectedModule, setSelectedModule] = useState("");
    const [selectedProfessor, setSelectedProfessor] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [loadingSubmit, setLoadingSubmit] = useState(false); // Loading state for submission
    const [loadingTable, setLoadingTable] = useState(false); // Loading state for table data

    // Fetch professors and courses only once when component mounts
    useEffect(() => {
        customFetch(
            endpoints.GET_PROFESSORS,
            accessTokenData,
            setAccessTokenData
        )
            .then((data) => setProfessors(data.professors))
            .catch((error) => alert(error));

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
    }, [accessTokenData.access_token]);

    // Fetch modules and professors-and-modules when a course is selected
    useEffect(() => {
        if (selectedCourse) {
            setLoadingTable(true); // Start loading for table data
            customFetch(
                `${endpoints.GET_MODULES_BY_COURSE}?course_id=${selectedCourse}`,
                accessTokenData,
                setAccessTokenData
            )
                .then((data) => setModules(data.modules.reverse()))
                .catch((error) => alert(error));

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
                    alert("Failed to fetch professors and modules: " + error)
                )
                .finally(() => setLoadingTable(false)); // End loading for table data
        }
    }, [selectedCourse]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (loadingSubmit) return;
        setLoadingSubmit(true);

        const associationData = {
            professor_id: selectedProfessor,
            module_id: selectedModule,
            course_id: selectedCourse,
        };

        customFetch(
            endpoints.ASSOCIATE_PROFESSOR_TO_MODULE,
            accessTokenData,
            setAccessTokenData,
            "POST",
            associationData
        )
            .then(() => {
                alert("Professor associated to module successfully!");
                setSelectedModule("");
                setSelectedProfessor("");
                setSelectedCourse("");
                setProfessorsAndModules([]);
            })
            .catch((error) => alert("Error: " + error.message))
            .finally(() => setLoadingSubmit(false));
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

                    <button type="submit" disabled={loadingSubmit}>
                        {loadingSubmit ? <ClipLoader size={15} /> : "Submeter"}
                    </button>
                </form>

                {/* Display existing professors and modules */}
                <div className="list">
                    <h2>Professores encarregados dos módulos</h2>
                    <table className="form-table">
                        <thead>
                            <tr>
                                <th>Módulo</th>
                                <th>Professor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingTable ? (
                                <tr>
                                    <td colSpan="2">
                                        Loading <ClipLoader size={15} />
                                    </td>
                                </tr>
                            ) : professorsAndModules.length > 0 ? (
                                professorsAndModules.map((item) => (
                                    <tr key={item.module.module_id}>
                                        <td>{item.module.name}</td>
                                        <td>
                                            {item.professor
                                                ? item.professor.name
                                                : "Sem professor designado"}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="2"
                                        style={{ textAlign: "center" }}
                                    >
                                        Nenhum professor encarregado do módulo
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

export default AssociateProfessorToModule;
