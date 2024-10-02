import React, { useState, useEffect } from "react";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";
import { fetchCoursesAndModulesOfProfessor } from "../../../scripts/getCoursesandModulesOfProfessor";
import ButtonMenu from "../../components/ButtonMenu";
import { modulesMenuButtons } from "../../../scripts/buttonsData";

const AssociateModulesToCourse = () => {
    const [courses, setCourses] = useState([]);
    const [modules, setModules] = useState([]);
    const [modulesInCourse, setModulesInCourse] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedModules, setSelectedModules] = useState([]);
    const [loading, setLoading] = useState(false);
    const { accessTokenData } = useAuth();

    // Fetch courses from API
    useEffect(() => {
        fetchCoursesAndModulesOfProfessor(accessTokenData.access_token)
            .then((data) => {
                setCourses(data.courses.reverse());
            })
            .catch((error) => {
                alert(error);
            });

        fetch(`${endpoints.GET_MODULES}?course_id=${selectedCourse}`, {
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
                setModules(data.modules.reverse());
            })
            .catch((error) => {
                console.error("Error fetching modules:", error);
                alert("Failed to load modules.");
            });
    }, []);

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
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch modules");
                    }
                    return response.json();
                })
                .then((data) => {
                    setModulesInCourse(data.modules.reverse());
                    console.log("modulesInCourse", data.modules);
                })
                .catch((error) => {
                    console.error("Error fetching modules:", error);
                    alert("Failed to load modules.");
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

        fetch(endpoints.ASSOCIATE_MODULES_TO_COURSE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
            body: JSON.stringify(associationData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to associate modules with course");
                }
                return response.json();
            })
            .then(() => {
                alert("Modules associated with course successfully!");
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
                    <h2>Associate Modules with Course</h2>

                    <div>
                        <label>Select Course</label>
                        <select
                            name="course"
                            value={selectedCourse}
                            onChange={handleCourseChange}
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

                    <div>
                        <label>Modules</label>
                        <div className="form-table-responsive">
                            {modules.length > 0 ? (
                                <table className="form-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Select</th>
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
                                <p>No modules available</p>
                            )}
                        </div>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                </form>
                <div className="list">
                    <h2>Modules for Selected Course</h2>
                    <ul>
                        {modulesInCourse.map((module) => (
                            <li key={module.module_id}>{module.name}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AssociateModulesToCourse;
