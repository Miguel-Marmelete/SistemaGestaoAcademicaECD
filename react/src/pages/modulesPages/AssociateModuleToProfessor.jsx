import React, { useState, useEffect } from "react";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";
import ButtonMenu from "../../components/ButtonMenu";
import { modulesMenuButtons } from "../../../scripts/buttonsData";

const AssociateProfessorToModule = () => {
    const { accessTokenData } = useAuth();
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
        fetch(endpoints.GET_PROFESSORS, {
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => setProfessors(data.professors))
            .catch((error) =>
                alert("Failed to fetch professors: " + error.message)
            )
            .finally(() => {});

        fetch(endpoints.GET_COURSES, {
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => setCourses(data.courses.reverse()))
            .catch((error) =>
                alert("Failed to fetch courses: " + error.message)
            )
            .finally(() => {});
    }, [accessTokenData.access_token]);

    // Fetch modules and professors-and-modules when a course is selected
    useEffect(() => {
        if (selectedCourse) {
            fetch(
                `${endpoints.GET_MODULES_BY_COURSE}?course_id=${selectedCourse}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessTokenData.access_token}`,
                    },
                }
            )
                .then((response) => response.json())
                .then((data) => setModules(data.modules.reverse()))
                .catch((error) =>
                    alert("Failed to fetch modules: " + error.message)
                )
                .finally(() => {});

            // Fetch professors and modules by course (new fetch)
            fetch(
                `${endpoints.GET_PROFESSORS_IN_CHARGE_OF_MODULES_BY_COURSE}?course_id=${selectedCourse}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessTokenData.access_token}`,
                    },
                }
            )
                .then((response) => response.json())
                .then((data) =>
                    setProfessorsAndModules(data.professorsAndModules)
                )
                .catch((error) =>
                    alert(
                        "Failed to fetch professors and modules: " +
                            error.message
                    )
                )
                .finally(() => {});
        } else {
            setModules([]); // Clear modules if no course is selected
            setProfessorsAndModules([]); // Clear professors and modules if no course is selected
        }
    }, [selectedCourse]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true); // Start loading

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
            })
            .catch((error) => alert("Error: " + error.message))
            .finally(() => setLoading(false)); // End loading
    };

    return (
        <div>
            <ButtonMenu buttons={modulesMenuButtons} />
            <div className="container">
                <form className="submitForm" onSubmit={handleSubmit}>
                    <h2>Associate Professor to Module</h2>
                    <div>
                        <label>Course</label>
                        <select
                            name="course"
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            required
                        >
                            <option value="" disabled>
                                Select a course
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
                                <option disabled>No courses available</option>
                            )}
                        </select>
                    </div>
                    <div>
                        <label>Module</label>
                        <select
                            name="module"
                            value={selectedModule}
                            onChange={(e) => setSelectedModule(e.target.value)}
                            disabled={!selectedCourse}
                            required
                        >
                            <option value="" disabled>
                                Select a module
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
                                <option disabled>No modules available</option>
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
                                Select a professor
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
                                    No professors available
                                </option>
                            )}
                        </select>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                </form>

                {/* Display existing professors and modules */}
                <div className="list">
                    <h2>Professors and Modules for the Selected Course</h2>
                    <ul>
                        {professorsAndModules &&
                        professorsAndModules.length > 0 ? (
                            professorsAndModules.map((item) => (
                                <li key={item.module.module_id}>
                                    {item.module.name} -{" "}
                                    {item.professor
                                        ? item.professor.name
                                        : "No professor assigned"}
                                </li>
                            ))
                        ) : (
                            <li>No data available</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AssociateProfessorToModule;
