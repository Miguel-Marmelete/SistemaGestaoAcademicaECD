import React, { useState, useEffect } from "react";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";

const AddEvaluationMoment = () => {
    const { accessTokenData, professor } = useAuth();
    const [courses, setCourses] = useState([]);
    const [modules, setModules] = useState([]);
    const [submodules, setSubmodules] = useState([]);
    const [formData, setFormData] = useState({
        type: "",
        course_id: "",
        professor_id: professor.professor_id,
        module_id: "",
        submodule_id: null,
        date: "",
    });

    useEffect(() => {
        // Fetch courses and modules
        fetch(endpoints.GET_COURSES, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch courses");
                }
                return response.json();
            })
            .then((data) => {
                setCourses(data.courses.reverse());
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("An error occurred while fetching courses");
            });

        fetch(endpoints.GET_MODULES, {
            method: "GET",
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
                setModules(data.modules);
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("An error occurred while fetching modules");
            });
    }, [accessTokenData.access_token]);

    useEffect(() => {
        // Fetch submodules when a module is selected and the type is "Trabalho"
        if (formData.module_id && formData.type === "Trabalho") {
            fetch(
                `${endpoints.GET_SUBMODULES}?module_id=${formData.module_id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessTokenData.access_token}`,
                    },
                }
            )
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch submodules");
                    }
                    return response.json();
                })
                .then((data) => {
                    setSubmodules(data.submodules);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert("An error occurred while fetching submodules");
                });
        } else {
            setSubmodules([]);
            setFormData({
                ...formData,
                submodule_id: null,
            });
        }
    }, [formData.module_id, formData.type, accessTokenData.access_token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
            ...(name === "type" && { submodule_id: null }), // Reset submodule if type changes
        });
    };

    const validateForm = () => {
        const { type, course_id, module_id, date } = formData;

        if (!type || !course_id || !module_id || !date) {
            alert("All fields except submodule are required.");
            return false;
        }

        if (!date || isNaN(new Date(date).getTime())) {
            alert("Date is required and must be a valid date.");
            return false;
        }

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        fetch(endpoints.ADD_EVALUATION_MOMENT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        throw new Error(
                            `Failed to add evaluation moment: ${JSON.stringify(
                                errorData.errors
                            )}`
                        );
                    });
                }
                return response.json();
            })
            .then(() => {
                alert("Evaluation Moment added successfully!");
                setFormData({
                    type: "",
                    course_id: "",
                    module_id: "",
                    submodule_id: null,
                    date: "",
                });
            })
            .catch((error) => {
                console.error("Error:", error);
                alert(error.message);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add Evaluation Moment</h2>
            <div>
                <label>Type</label>
                <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>
                        Select a type
                    </option>
                    <option value="Exame">Exame</option>
                    <option value="Trabalho">Trabalho</option>
                    <option value="Exame Recurso">Exame Recurso</option>
                </select>
            </div>
            <div>
                <label>Course</label>
                <select
                    name="course_id"
                    value={formData.course_id}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>
                        Select a course
                    </option>
                    {courses.map((course) => (
                        <option key={course.course_id} value={course.course_id}>
                            {course.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Module</label>
                <select
                    name="module_id"
                    value={formData.module_id}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>
                        Select a module
                    </option>
                    {modules.map((module) => (
                        <option key={module.module_id} value={module.module_id}>
                            {module.name}
                        </option>
                    ))}
                </select>
            </div>
            {formData.type === "Trabalho" && (
                <div>
                    <label>Submodule</label>
                    <select
                        name="submodule_id"
                        value={formData.submodule_id || ""}
                        onChange={handleChange}
                    >
                        <option value="" disabled>
                            Select a submodule
                        </option>
                        <option value="">None</option>
                        {submodules.map((submodule) => (
                            <option
                                key={submodule.submodule_id}
                                value={submodule.submodule_id}
                            >
                                {submodule.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            <div className="date_input_container">
                <label className="date_input_label">Evaluation Date</label>
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
            </button>
        </form>
    );
};

export default AddEvaluationMoment;
