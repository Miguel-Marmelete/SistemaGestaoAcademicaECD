import React, { useState, useEffect } from "react";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";
import ButtonMenu from "../../components/ButtonMenu";
import { evaluationMomentsMenuButtons } from "../../../scripts/buttonsData";
import customFetch from "../../../scripts/customFetch";

import { ClipLoader } from "react-spinners";

const AddEvaluationMoment = () => {
    const { accessTokenData, professor, setAccessTokenData } = useAuth();

    const [courses, setCourses] = useState([]); // Store courses and modules array
    const [modules, setModules] = useState([]); // Modules of selected course
    const [submodules, setSubmodules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: "",
        course_id: "",
        professor_id: "", // Initialize as an empty string
        module_id: "",
        submodule_id: null,
        date: "",
    });
    const [evaluationMoments, setEvaluationMoments] = useState([]);
    const [loadingEvaluationMoments, setLoadingEvaluationMoments] =
        useState(false); // New state for loading evaluation moments

    // Fetch courses and modules when component mounts
    useEffect(() => {
        customFetch(
            endpoints.GET_MODULES_OF_COURSE_OF_PROFESSOR,
            accessTokenData,
            setAccessTokenData
        )
            .then((data) => {
                console.log(data.courseModules);
                setCourses(data.courseModules.reverse());
            })
            .catch((error) => {
                console.error(error);
                alert(error);
            });
    }, []);

    // Fetch submodules when a module is selected and the type is "Trabalho"
    useEffect(() => {
        if (formData.module_id && formData.type === "Trabalho") {
            customFetch(
                `${endpoints.GET_SUBMODULES}?module_id=${formData.module_id}`,
                accessTokenData,
                setAccessTokenData
            )
                .then((data) => {
                    setSubmodules(data.submodules.reverse());
                })
                .catch((error) => {
                    console.error(error);
                    alert(error);
                });
        } else {
            setSubmodules([]);
            setFormData({
                ...formData,
                submodule_id: null,
            });
        }
    }, [formData.module_id, formData.type, accessTokenData]);

    // New useEffect hook to fetch evaluation moments
    useEffect(() => {
        if (formData.course_id && formData.module_id) {
            setLoadingEvaluationMoments(true); // Set loading to true
            customFetch(
                `${endpoints.GET_EVALUATION_MOMENTS_OF_PROFESSOR}?course_id=${formData.course_id}&module_id=${formData.module_id}`,
                accessTokenData,
                setAccessTokenData
            )
                .then((data) => {
                    setEvaluationMoments(data.evaluationMoments.reverse());
                })
                .catch((error) => {
                    console.error(error);
                    alert(error);
                })
                .finally(() => {
                    setLoadingEvaluationMoments(false); // Set loading to false
                });
        }
    }, [formData.course_id, formData.module_id, accessTokenData.access_token]);

    // Update professor_id in formData when professor data is available
    useEffect(() => {
        if (professor) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                professor_id: professor.professor_id,
            }));
        }
    }, [professor]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // When a course is selected, update modules based on the course
        if (name === "course_id") {
            const selectedCourse = courses.find(
                (course) => course.course.course_id === parseInt(value)
            );
            setModules(selectedCourse ? selectedCourse.modules : []); // Set modules of the selected course
        }

        setFormData({
            ...formData,
            [name]: value,
            ...(name === "type" && { submodule_id: null }), // Reset submodule if type changes
        });
    };

    const validateForm = () => {
        const { type, course_id, module_id, date } = formData;

        if (!type || !course_id || !module_id || !date) {
            alert("Todos os campos, exceto o submódulo, são obrigatórios.");
            return false;
        }

        if (!date || isNaN(new Date(date).getTime())) {
            alert("A data é obrigatória e deve ser uma data válida.");
            return false;
        }

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (loading) return; // Prevent multiple submissions
        if (!validateForm()) return;

        setLoading(true); // Set loading to true

        // Update professor_id with the one from useAuth before submitting
        const updatedFormData = {
            ...formData,
            professor_id: professor?.professor_id || "",
        };

        customFetch(
            endpoints.ADD_EVALUATION_MOMENT,
            accessTokenData,
            setAccessTokenData,
            "POST",
            updatedFormData
        )
            .then((data) => {
                alert(data.message);
                setFormData({
                    type: "",
                    course_id: "",
                    module_id: "",
                    submodule_id: null,
                    date: "",
                });
                setEvaluationMoments([]); // Clear evaluation moments
            })
            .catch((error) => {
                console.error(error);
                alert(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    if (!professor) {
        return (
            <div>
                <h2>
                    Loading <ClipLoader size={15} />
                </h2>
            </div>
        );
    }
    return (
        <div>
            <ButtonMenu buttons={evaluationMomentsMenuButtons} />

            <div className="container">
                <form className="submitForm" onSubmit={handleSubmit}>
                    <h2>Adicionar Momento de Avaliação</h2>

                    <div>
                        <label>Curso</label>
                        <select
                            name="course_id"
                            value={formData.course_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>
                                Selecione um curso
                            </option>
                            {courses.length > 0 &&
                                courses.map((course) => (
                                    <option
                                        key={course.course.course_id}
                                        value={course.course.course_id}
                                    >
                                        {course.course.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div>
                        <label>Módulo</label>
                        <select
                            name="module_id"
                            value={formData.module_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>
                                Selecione um módulo
                            </option>
                            {modules.length > 0 &&
                                modules.map((module) => (
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
                        <label>Tipo</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>
                                Selecione um tipo
                            </option>
                            <option value="Exame">Exame</option>
                            <option value="Trabalho">Trabalho</option>
                            <option value="Exame Recurso">Exame Recurso</option>
                        </select>
                    </div>
                    {formData.type === "Trabalho" && (
                        <div>
                            <label>Submódulo</label>
                            <select
                                name="submodule_id"
                                value={formData.submodule_id || ""}
                                onChange={handleChange}
                            >
                                <option value="" disabled>
                                    Selecione um submódulo
                                </option>
                                {submodules.length > 0 &&
                                    submodules.map((submodule) => (
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
                        <label className="date_input_label">
                            Data da Avaliação
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? <ClipLoader size={15} /> : "Submit"}
                    </button>
                </form>
                <div className="list">
                    <h2>Momentos de Avaliação</h2>
                    <table className="form-table">
                        <thead>
                            <tr>
                                <th>Tipo</th>
                                <th>Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingEvaluationMoments ? (
                                <tr>
                                    <td colSpan="2">
                                        Loading <ClipLoader size={15} />
                                    </td>
                                </tr>
                            ) : !formData.course_id || !formData.module_id ? (
                                <tr>
                                    <td colSpan="2">
                                        Selecione um curso e um módulo
                                    </td>
                                </tr>
                            ) : evaluationMoments.length === 0 ? (
                                <tr>
                                    <td colSpan="2">
                                        Nenhum momento de avaliação encontrado.
                                    </td>
                                </tr>
                            ) : (
                                evaluationMoments.map((evaluationMoment) => (
                                    <tr
                                        key={
                                            evaluationMoment.evaluation_moment_id
                                        }
                                    >
                                        <td>{evaluationMoment.type}</td>
                                        <td>
                                            {new Date(
                                                evaluationMoment.date
                                            ).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AddEvaluationMoment;
