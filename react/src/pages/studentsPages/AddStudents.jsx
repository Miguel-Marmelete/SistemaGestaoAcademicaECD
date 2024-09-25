import React, { useState, useEffect } from "react";
import ButtonMenu from "../../components/ButtonMenu";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";
import { studentsMenuButtons } from "../../../scripts/buttonsData";

const AddStudents = () => {
    const { accessTokenData } = useAuth();
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

    useEffect(() => {
        fetch(endpoints.GET_COURSES, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        throw new Error(errorData.details);
                    });
                }
                return response.json();
            })
            .then((data) => setCourses(data.courses.reverse()))
            .catch((error) => alert(error.message))
            .finally(() => {});
    }, []);

    useEffect(() => {
        const fetchUrl = selectedCourse
            ? `${endpoints.GET_STUDENTS_BY_COURSE}?course_id=${selectedCourse}`
            : endpoints.GET_STUDENTS;

        fetch(fetchUrl, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        throw new Error(errorData.details);
                    });
                }
                return response.json();
            })
            .then((data) => setStudents(data.students.reverse()))
            .catch((error) => alert(error.message))
            .finally(() => {});
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

        // Send a single request to create the student and enroll them
        fetch(endpoints.ADD_AND_ENROLL_STUDENT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
            body: JSON.stringify({
                ...formData, // Student data
                course_id: selectedCourse, // Enrollment data
            }),
        })
            .then((response) => {
                // Handle errors if the request failed
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        throw new Error(
                            errorData.details ||
                                "Error creating and enrolling student."
                        );
                    });
                }
                return response.json(); // Return response JSON
            })
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
                    <button type="submit" disabled={loading}>
                        {loading ? "Submitting..." : "Submeter"}
                    </button>
                </form>

                <div className="list">
                    <h2>Existing Students</h2>
                    <ul>
                        {students.map((student) => (
                            <li key={student.student_id}>
                                {student.name} - {student.number}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AddStudents;
