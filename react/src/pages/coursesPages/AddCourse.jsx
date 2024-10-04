import React, { useState, useEffect, useRef } from "react";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";
import ButtonMenu from "../../components/ButtonMenu";
import { coursesMenuButtons } from "../../../scripts/buttonsData";
import customFetch from "../../../scripts/customFetch";

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
    const [editedCourse, setEditedCourse] = useState({});
    const fileInputRef = useRef(null);

    useEffect(() => {
        customFetch(endpoints.GET_COURSES, accessTokenData, setAccessTokenData)
            .then((data) => {
                setCourses(data.courses.reverse());
            })
            .catch((error) => console.error(error));
    }, [courseAdded]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditedCourse({
            ...editedCourse,
            [name]: value,
        });
    };

    const validateForm = () => {
        const { abbreviation, name, date, schedule } = formData;

        if (abbreviation.trim() === "" || abbreviation.length > 255) {
            alert(
                "A abreviação é obrigatória."
            );
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

        if (loading) return; // Prevent multiple fetches
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
                console.error("Error:", error.message);
                alert(error.message);
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
        const courses = rows.slice(1).map((row) => ({
            name: row[0],
            abbreviation: row[1],
            date: row[2],
            schedule: row[3] || "",
        }));
        console.log(courses);
        /*
        setLoading(true);
        customFetch(
            endpoints.ADD_MULTIPLE_COURSES,
            accessTokenData,
            setAccessTokenData,
            "POST",
            { courses }
        )
            .then(() => {
                alert("Courses added successfully!");
                setCourseAdded((prev) => !prev);
            })
            .catch((error) => {
                console.error("Error:", error.message);
                alert(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
*/
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
                    <div>
                        <label>
                            Horário
                            <small
                                style={{
                                    fontSize: "0.6rem",
                                    paddingLeft: "5px",
                                }}
                            >
                                (Opcional)
                            </small>
                        </label>
                        <input
                            type="text"
                            name="schedule"
                            value={formData.schedule}
                            onChange={handleChange}
                            maxLength={255}
                        />
                    </div>
                    <div className="button-group">
                        <button type="submit" disabled={loading}>
                            {loading ? "A submeter..." : "Submeter"}
                        </button>
                        <button onClick={handleCSVUpload} disabled={loading}>
                            Upload CSV
                        </button>
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
                </div>
            </div>
        </div>
    );
};

export default AddCourse;
