import React, { useState, useEffect } from "react";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";
import { fetchCourses } from "../../../scripts/getCourses";
import { fetchProfessors } from "../../../scripts/getProfessors";

const AddModule = () => {
    const { accessTokenData } = useAuth();
    const [courses, setCourses] = useState([]);
    const [professors, setProfessors] = useState([]);

    // Retrieve the token from context and fetch courses and professors
    useEffect(() => {
        fetchCourses(accessTokenData.access_token)
            .then((courses) => {
                setCourses(courses);
            })
            .catch((error) => {
                alert("Failed to fetch courses: " + error);
            });

        fetchProfessors(accessTokenData.access_token)
            .then((professors) => {
                setProfessors(professors);
            })
            .catch((error) => {
                alert("Failed to fetch professors: " + error);
            });
    }, [accessTokenData.access_token]);

    const [formData, setFormData] = useState({
        name: "",
        contact_hours: "",
        abbreviation: "",
        ects: "",
        course_id: "",
        professors: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleProfessorsChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(
            (option) => option.value
        );
        setFormData({
            ...formData,
            professors: selectedOptions,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(endpoints.ADD_MODULES, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessTokenData.access_token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Module added successfully!");
                // Reset form
                setFormData({
                    name: "",
                    contact_hours: "",
                    abbreviation: "",
                    ects: "",
                    course_id: "",
                    professors: [],
                });
            } else {
                alert("Failed to add module");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while adding the module");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Adicionar Módulo</h2>
            <div>
                <label>Nome</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={255}
                />
            </div>
            <div>
                <label>Horas de Contacto</label>
                <input
                    type="text"
                    name="contact_hours"
                    value={formData.contact_hours}
                    onChange={handleChange}
                    required
                    pattern="\d+"
                />
            </div>
            <div>
                <label>Abreviatura</label>
                <input
                    type="text"
                    name="abbreviation"
                    value={formData.abbreviation}
                    onChange={handleChange}
                    required
                    maxLength={255}
                />
            </div>
            <div>
                <label>ECTS</label>
                <input
                    type="text"
                    name="ects"
                    value={formData.ects}
                    onChange={handleChange}
                    required
                    maxLength={255}
                />
            </div>
            <div>
                <label>Curso</label>
                <select
                    name="course_id"
                    value={formData.course_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">Selecione um curso</option>
                    {courses.map((course) => (
                        <option key={course.course_id} value={course.course_id}>
                            {course.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Professores</label>
                <select
                    name="professors"
                    value={formData.professors}
                    onChange={handleProfessorsChange}
                    multiple
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

            <button type="submit">Submeter</button>
        </form>
    );
};

export default AddModule;
