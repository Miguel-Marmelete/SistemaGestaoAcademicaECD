import React, { useState, useEffect } from "react";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";
import { fetchCourses } from "../../../scripts/getCourses";

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
    }, []);

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
    }, []);

    // Handle course change
    const handleCourseChange = (event) => {
        setSelectedCourse(event.target.value);
    };

    // Handle module selection
    const handleModuleChange = (event) => {
        const { options } = event.target;
        const selected = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selected.push(options[i].value);
            }
        }
        setSelectedModules(selected);
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
        <div className="form-container">
            <header>
                <h1>Associate Modules with Course</h1>
            </header>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="course-select">Select Course:</label>
                    <select
                        id="course-select"
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

                <div className="form-group">
                    <label htmlFor="module-select">Select Modules:</label>
                    <select
                        id="module-select"
                        multiple
                        value={selectedModules}
                        onChange={handleModuleChange}
                        required
                    >
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

                <button type="submit">Associate Modules</button>
            </form>
        </div>
    );
};

export default AssociateModulesToCourse;
