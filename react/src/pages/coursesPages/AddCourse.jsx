import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";
import ButtonMenu from "../../components/ButtonMenu";
import { coursesMenuButtons } from "../../../scripts/buttonsData";
import customFetch from "../../../scripts/customFetch";
import { ClipLoader } from "react-spinners";
const AddCourse = () => {
    const { accessTokenData, setAccessTokenData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [courseAdded, setCourseAdded] = useState(false);
    const [formData, setFormData] = useState({
        abbreviation: "",
        name: "",
        date: "",
        schedule: "",
    });
    const fileInputRef = useRef(null);
    const [coursesLoading, setCoursesLoading] = useState(true);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        setCoursesLoading(true);
        customFetch(endpoints.GET_COURSES, accessTokenData, setAccessTokenData)
            .then((data) => {
                setCourses(data.courses.reverse());
            })
            .catch((error) => console.error(error))
            .finally(() => {
                setCoursesLoading(false);
            });
    }, [courseAdded]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateForm = () => {
        const { abbreviation, name, date, schedule } = formData;

        if (abbreviation.trim() === "" || abbreviation.length > 255) {
            alert("A abreviação é obrigatória.");
            return false;
        }
        if (name.trim() === "" || name.length > 255) {
            alert("O Nome do Curso é obrigatório.");
            return false;
        }
        if (!date || isNaN(new Date(date).getTime())) {
            alert("A data de início é obrigatória e deve ser uma data válida.");
            return false;
        }
        if (schedule && schedule.length > 255) {
            alert("O horário não deve exceder 255 caracteres.");
            return false;
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (loading) return;
        if (!validateForm()) return;

        setLoading(true);

        customFetch(
            endpoints.ADD_COURSES,
            accessTokenData,
            setAccessTokenData,
            "POST",
            formData
        )
            .then(() => {
                alert("Course added successfully!");
                setFormData({
                    abbreviation: "",
                    name: "",
                    date: "",
                    schedule: "",
                });
                setCourseAdded((prev) => !prev);
            })
            .catch((error) => {
                alert(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleCSVUpload = (e) => {
        e.preventDefault();
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                const csvData = event.target.result;
                processAndUploadCSV(csvData);
            };
            reader.readAsText(file);
        }
    };

    const processAndUploadCSV = (csvData) => {
        const rows = csvData.split("\n").map((row) => row.split(","));
        const parsedCourses = rows.slice(1).map((row) => ({
            name: row[0],
            abbreviation: row[1],
            date: row[2],
        }));

        // Navigate to the review page with the parsed courses
        navigate("/reviewCourses", { state: { courses: parsedCourses } });
    };

    return (
        <div>
            <ButtonMenu buttons={coursesMenuButtons} />
            <div className="container">
                <form className="submitForm" onSubmit={handleSubmit}>
                    <h2>Adicionar Curso</h2>
                    <div>
                        <label>Nome do Curso</label>
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
                        <label>Data de Início</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="button-group">
                        <button type="submit" disabled={loading}>
                            {loading ? <ClipLoader size={15} /> : "Submeter"}
                        </button>{" "}
                        <div className="tooltip-container">
                            <button
                                onClick={handleCSVUpload}
                                disabled={loading}
                            >
                                CSV
                            </button>
                            <div className="custom-tooltip">
                                <pre>
                                    Formato do CSV:
                                    <br />
                                    Nome,Abreviatura,Data
                                    <br />
                                    CursoX,CX,2023-01-01
                                </pre>
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                            accept=".csv"
                        />
                    </div>
                </form>

                <div className="list">
                    <h2>Cursos Existentes</h2>
                    {coursesLoading ? (
                        <table className="form-table">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Abreviatura</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td
                                        colSpan="2"
                                        style={{ textAlign: "center" }}
                                    >
                                        Loading... <ClipLoader size={15} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (
                        <table className="form-table">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Abreviatura</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map((course) => (
                                    <tr key={course.course_id}>
                                        <td>{course.name}</td>
                                        <td>{course.abbreviation}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddCourse;
