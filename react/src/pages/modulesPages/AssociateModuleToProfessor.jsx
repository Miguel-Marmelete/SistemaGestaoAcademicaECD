import React, { useState, useEffect } from "react";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";

const AssociateProfessorToModule = () => {
    const { accessTokenData } = useAuth();
    const [modules, setModules] = useState([]);
    const [professors, setProfessors] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedModule, setSelectedModule] = useState("");
    const [selectedProfessor, setSelectedProfessor] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");

    useEffect(() => {
        fetch(endpoints.GET_MODULES, {
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => setModules(data.modules))
            .catch((error) =>
                alert("Failed to fetch modules: " + error.message)
            );

        fetch(endpoints.GET_PROFESSORS, {
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => setProfessors(data.professors))
            .catch((error) =>
                alert("Failed to fetch professors: " + error.message)
            );

        fetch(endpoints.GET_COURSES, {
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => setCourses(data.courses.reverse()))
            .catch((error) =>
                alert("Failed to fetch courses: " + error.message)
            );
    }, [accessTokenData.access_token]);

    const handleSubmit = (e) => {
        e.preventDefault();

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
            .catch((error) => alert("Error: " + error.message));
    };

    return (
        <div className="container">
            <form className="submitForm" onSubmit={handleSubmit}>
                <h2>Associate Professor to Module</h2>
                <div>
                    <label>Professor</label>
                    <select
                        name="professor"
                        value={selectedProfessor}
                        onChange={(e) => setSelectedProfessor(e.target.value)}
                        required
                    >
                        <option value="" disabled>
                            Select a professor
                        </option>
                        {professors.map((professor) => (
                            <option
                                key={professor.professor_id}
                                value={professor.professor_id}
                            >
                                {professor.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Module</label>
                    <select
                        name="module"
                        value={selectedModule}
                        onChange={(e) => setSelectedModule(e.target.value)}
                        required
                    >
                        <option value="" disabled>
                            Select a module
                        </option>
                        {modules.map((module) => (
                            <option
                                key={module.module_id}
                                value={module.module_id}
                            >
                                {module.name}
                            </option>
                        ))}
                    </select>
                </div>
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
                <button type="submit">Submit</button>
            </form>
            <div className="list">
                <h2>Existing Modules and Professors in Charge</h2>
                <ul>
                    {modules.map((module) => (
                        <li key={module.module_id}>
                            {module.name} -{" "}
                            {module.professor
                                ? module.professor.name
                                : "No professor assigned"}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AssociateProfessorToModule;
