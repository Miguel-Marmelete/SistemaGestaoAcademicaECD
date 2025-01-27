import React, { useState, useEffect, useRef } from "react";
import ButtonMenu from "../../components/ButtonMenu";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";
import { studentsMenuButtons } from "../../../scripts/buttonsData";
import { fetchCoursesAndModulesOfProfessor } from "../../../scripts/getCoursesandModulesOfProfessor";
import customFetch from "../../../scripts/customFetch";
import { useNavigate } from "react-router-dom"; // Add this import
import ClipLoader from "react-spinners/ClipLoader"; // Import ClipLoader

const AddStudents = () => {
    const { accessTokenData, setAccessTokenData } = useAuth();
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        ipbeja_email: "",
        number: "",
        birthday: "",
        address: "",
        city: "",
        mobile: "",
        classe: "",
        posto: "",
        personal_email: "",
        nim: "",
    });
    const fileInputRef = useRef(null);
    const navigate = useNavigate(); // Add this line
    const [loadingStudents, setLoadingStudents] = useState(false); // Add state for loading students

    useEffect(() => {
        fetchCoursesAndModulesOfProfessor(accessTokenData.access_token)
            .then((data) => {
                setCourses(data.courses.reverse());
            })
            .catch((error) => {
                alert("Error fetching courses: " + error.message);
            });
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            setLoadingStudents(true); // Start loading animation
            customFetch(
                `${endpoints.GET_STUDENTS}?course_id=${selectedCourse}`,
                accessTokenData,
                setAccessTokenData
            )
                .then((data) => setStudents(data.students.reverse()))
                .catch((error) => alert(error))
                .finally(() => setLoadingStudents(false)); // Stop loading animation
        }
    }, [selectedCourse]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleCourseChange = (e) => {
        setSelectedCourse(e.target.value);
    };

    const validateForm = () => {
        const {
            name,
            ipbeja_email,
            number,
            birthday,
            address,
            city,
            mobile,
            classe,
            posto,
            personal_email,
            nim,
        } = formData;

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (name.trim() === "" || name.length > 255)
            return alert(
                "Nome é obrigatório e não pode exceder 255 caracteres."
            );
        if (!emailPattern.test(ipbeja_email) || ipbeja_email.length > 255)
            return alert("Email IPBEJA inválido ou excede 255 caracteres.");
        if (isNaN(number) || number.trim() === "")
            return alert("Número é obrigatório e deve ser um inteiro.");
        if (birthday && isNaN(new Date(birthday).getTime()))
            return alert("Data de Nascimento inválida.");
        if (address.length > 255)
            return alert("Morada não pode exceder 255 caracteres.");
        if (city.length > 255)
            return alert("Cidade não pode exceder 255 caracteres.");
        if (mobile && isNaN(mobile))
            return alert("Telemóvel deve ser um número.");
        if (posto.length > 255)
            return alert("Posto não pode exceder 255 caracteres.");
        if (nim && isNaN(nim)) return alert("NIM deve ser um número.");
        if (!emailPattern.test(personal_email) || personal_email.length > 255)
            return alert("Email Pessoal inválido ou excede 255 caracteres.");

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;
        if (loading) return;

        setLoading(true);

        customFetch(
            endpoints.ADD_AND_ENROLL_STUDENT,
            accessTokenData,
            setAccessTokenData,
            "POST",
            {
                ...formData, // Student data
                course_id: selectedCourse, // Enrollment data
            }
        )
            .then((result) => {
                alert(result.message); // Show success message

                // Reset form fields
                setFormData({
                    name: "",
                    ipbeja_email: "",
                    number: "",
                    birthday: "",
                    address: "",
                    city: "",
                    mobile: "",
                    classe: "",
                    posto: "",
                    personal_email: "",
                    nim: "",
                });
                setSelectedCourse(""); // Reset selected course
            })
            .catch((error) => {
                // Handle any errors during the process
                alert(error.message);
            })
            .finally(() => {
                // Always stop the loading spinner after the process
                setLoading(false);
            });
    };

    const handleCSVUpload = (e) => {
        e.preventDefault();
        if (!selectedCourse) {
            alert("Please select a course before uploading a CSV file.");
            return;
        }
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const csvData = event.target.result;
                processAndUploadCSV(csvData);
            };
            reader.readAsText(file);
        }
    };

    const processAndUploadCSV = (csvData) => {
        // Split into rows and filter out empty rows
        const rows = csvData
            .split("\n")
            .map((row) => row.trim().split(","))
            .filter((row) => row.some((cell) => cell.trim() !== "")); // Only keep rows that have at least one non-empty cell

        const parsedStudents = rows
            .slice(1) // Skip header row
            .filter((row) => row[0]?.trim() && row[2]?.trim()) // Ensure name and number exist
            .map((row) => ({
                name: row[0]?.trim() || "",
                ipbeja_email: row[1]?.trim() || "",
                number: row[2]?.trim() || "",
                birthday: row[3]?.trim() || "",
                address: row[4]?.trim() || "",
                city: row[5]?.trim() || "",
                mobile: row[6]?.trim() || "",
                classe: row[7]?.trim() || "",
                posto: row[8]?.trim() || "",
                personal_email: row[9]?.trim() || "",
                nim: row[10]?.trim() || "",
                course_id: selectedCourse,
            }));

        // Only proceed if there are valid students to process
        if (parsedStudents.length > 0) {
            navigate("/reviewStudents", {
                state: { students: parsedStudents, course: selectedCourse },
            });
        } else {
            alert("No valid student data found in CSV file");
        }
    };

    return (
        <div>
            <ButtonMenu buttons={studentsMenuButtons} />

            <div className="container">
                <form className="submitForm" onSubmit={handleSubmit}>
                    <h2>Adicionar Alunos</h2>
                    <div>
                        <label>Curso</label>
                        <select
                            name="course_id"
                            value={selectedCourse}
                            onChange={handleCourseChange}
                            required
                        >
                            <option value="" disabled>
                                Selecione um Curso
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
                    <div className="date_input_container">
                        <label className="date_input_label">
                            Data de Nascimento
                        </label>
                        <input
                            type="date"
                            name="birthday"
                            value={formData.birthday}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Telemóvel</label>
                        <input
                            type="text"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            required
                            pattern="\d+"
                        />
                    </div>
                    <div>
                        <label>Classe</label>
                        <input
                            type="text"
                            name="classe"
                            value={formData.classe}
                            onChange={handleChange}
                            required
                            maxLength={255}
                        />
                    </div>
                    <div>
                        <label>Email IPBEJA</label>
                        <input
                            type="email"
                            name="ipbeja_email"
                            value={formData.ipbeja_email}
                            onChange={handleChange}
                            required
                            maxLength={255}
                        />
                    </div>
                    <div>
                        <label>Morada</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            maxLength={255}
                        />
                    </div>
                    <div>
                        <label>Posto</label>
                        <input
                            type="text"
                            name="posto"
                            value={formData.posto}
                            onChange={handleChange}
                            required
                            maxLength={255}
                        />
                    </div>
                    <div>
                        <label>Número</label>
                        <input
                            type="text"
                            name="number"
                            value={formData.number}
                            onChange={handleChange}
                            required
                            pattern="\d+"
                        />
                    </div>
                    <div>
                        <label>Cidade</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                            maxLength={255}
                        />
                    </div>
                    <div>
                        <label>NIM</label>
                        <input
                            type="text"
                            name="nim"
                            value={formData.nim}
                            onChange={handleChange}
                            pattern="\d+"
                        />
                    </div>
                    <div>
                        <label>Email Pessoal</label>
                        <input
                            type="email"
                            name="personal_email"
                            value={formData.personal_email}
                            onChange={handleChange}
                            required
                            maxLength={255}
                        />
                    </div>

                    <div className="button-group">
                        <button type="submit" disabled={loading}>
                            {loading ? <ClipLoader size={15} /> : "Submeter"}
                        </button>{" "}
                        <div className="tooltip-container">
                            <button onClick={handleCSVUpload}>CSV</button>
                            <div className="custom-tooltip">
                                <pre>
                                    Formato do CSV:
                                    <br />
                                    Nome,Email IPBEJA,Número,Data de
                                    Nascimento,Morada,Cidade,Telemóvel,Classe,Posto,Email
                                    Pessoal,NIM
                                    <br />
                                    AlunoX,email@ipbeja.pt,12345,2000-01-01,Rua
                                    X,Cidade Y,912345678,Classe A,Posto
                                    B,email@pessoal.pt,67890
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
                    <h2>Alunos Existentes</h2>

                    <table className="form-table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Número</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingStudents ? (
                                <tr>
                                    <td colSpan="2">
                                        Loading <ClipLoader size={15} />
                                    </td>
                                </tr>
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan="2">
                                        Nenhum aluno encontrado.
                                    </td>
                                </tr>
                            ) : (
                                students.map((student) => (
                                    <tr key={student.student_id}>
                                        <td>{student.name}</td>
                                        <td>{student.number}</td>
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

export default AddStudents;
