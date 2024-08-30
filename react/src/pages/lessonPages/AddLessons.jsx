import React, { useState, useEffect } from "react";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";

const AddLesson = () => {
    const { accessTokenData } = useAuth();
    const [submodules, setSubmodules] = useState([]);
    const [courses, setCourses] = useState([]);
    const [professors, setProfessors] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        type: "",
        summary: "",
        submodule_id: "",
        course_id: "",
        date: "",
        professor_ids: [],
    });

    useEffect(() => {
        fetch(endpoints.GET_SUBMODULES, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((submoduleResponse) => {
                if (submoduleResponse.ok) {
                    return submoduleResponse.json();
                } else {
                    throw new Error("Failed to fetch submodules");
                }
            })
            .then((submoduleData) => {
                setSubmodules(submoduleData.submodules);
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("An error occurred while fetching submodules");
            });

        fetch(endpoints.GET_COURSES, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((courseResponse) => {
                if (courseResponse.ok) {
                    return courseResponse.json();
                } else {
                    throw new Error("Failed to fetch courses");
                }
            })
            .then((courseData) => {
                setCourses(courseData.courses);
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("An error occurred while fetching courses");
            });

        fetch(endpoints.GET_PROFESSORS, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((professorResponse) => {
                if (professorResponse.ok) {
                    return professorResponse.json();
                } else {
                    throw new Error("Failed to fetch professors");
                }
            })
            .then((professorData) => {
                setProfessors(professorData.professors);
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("An error occurred while fetching professors");
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleProfessorChange = (e) => {
        const { options } = e.target;
        const selectedProfessors = [];
        for (const option of options) {
            if (option.selected) {
                selectedProfessors.push(option.value);
            }
        }
        setFormData({
            ...formData,
            professor_ids: selectedProfessors,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Format the date to match the backend format Y-m-d H:00:00
        const formattedDate = new Date(formData.date)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
        const adjustedDate = formattedDate.slice(0, 13) + ":00:00";

        // Update the formData with the formatted date
        const updatedFormData = {
            ...formData,
            date: adjustedDate,
        };

        fetch(endpoints.ADD_LESSONS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
            body: JSON.stringify(updatedFormData),
        })
            .then((response) => {
                if (response.ok) {
                    alert("Lesson added successfully!");
                    setFormData({
                        title: "",
                        type: "",
                        summary: "",
                        submodule_id: "",
                        course_id: "",
                        date: "",
                        professor_ids: [],
                    });
                } else {
                    return response.json().then((errorData) => {
                        throw new Error(
                            `Failed to add lesson: ${JSON.stringify(
                                errorData.errors
                            )}`
                        );
                    });
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("An error occurred while adding the lesson");
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add Lesson</h2>
            <div>
                <label>Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    maxLength={255}
                />
            </div>
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
                    <option value="Teórica">Teórica</option>
                    <option value="Laboratorial">Laboratorial</option>
                    <option value="Teórica-Prática">Teórica-Prática</option>
                </select>
            </div>
            <div>
                <label>Summary</label>
                <textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleChange}
                    required
                ></textarea>
            </div>
            <div>
                <label>Submodule</label>
                <select
                    name="submodule_id"
                    value={formData.submodule_id}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>
                        Select a submodule
                    </option>
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
                <label>Professors</label>
                <select
                    name="professor_ids"
                    multiple
                    value={formData.professor_ids}
                    onChange={handleProfessorChange}
                    required
                >
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
                <label>Date</label>
                <input
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />
            </div>

            <button type="submit">Submit</button>
        </form>
    );
};

export default AddLesson;
