import React, { useState, useEffect } from "react";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";
import { fetchCourses } from "../../../scripts/getCourses";
import ButtonMenu from "../../components/ButtonMenu";
import { modulesMenuButtons } from "../../../scripts/buttonsData";
const AssociateModulesToCourse = () => {
    const [courses, setCourses] = useState([]);
    const [modules, setModules] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(""); // Default to empty
    const [selectedModules, setSelectedModules] = useState([]); // To manage selected modules
    const { accessTokenData } = useAuth();

    // Fetch courses from API
    useEffect(() => {
        fetchCourses(accessTokenData.access_token)
            .then((courses) => {
                setCourses(courses.reverse());
            })
            .catch((error) => {
                alert(error);
            });
    }, [accessTokenData.access_token]); // Added dependency to useEffect

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
                alert("Failed to load modules.");
            });
    }, [accessTokenData.access_token]); // Added dependency to useEffect

    // Handle course change
    const handleCourseChange = (event) => {
        setSelectedCourse(event.target.value);
    };

    // Handle module selection via checkboxes
    const handleModuleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        const numericValue = parseInt(value, 10); // Convert value to a number

        setSelectedModules((prevSelectedModules) => {
            if (checked) {
                // Add module if checked
                return [...prevSelectedModules, numericValue];
            } else {
                // Remove module if unchecked
                return prevSelectedModules.filter(
                    (module_id) => module_id !== numericValue
                );
            }
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

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
                // Reset form
                setSelectedCourse("");
                setSelectedModules([]);
            })
            .catch((error) => {
                console.error("Error:", error);
                alert(error.message);
            });
    };

    return (
        <div>
            <ButtonMenu buttons={modulesMenuButtons} />
            <div className="form-container">
                <form onSubmit={handleSubmit}>
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
                        <div className="checkbox-group">
                            {modules.map((module) => (
                                <div key={module.module_id}>
                                    <label>
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
                                        {module.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="submit">Submeter</button>
                </form>
            </div>
        </div>
    );
};

export default AssociateModulesToCourse;
