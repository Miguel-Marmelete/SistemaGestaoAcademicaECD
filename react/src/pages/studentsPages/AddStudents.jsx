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
            .catch((error) => alert(error.message));
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
            .catch((error) => alert(error.message));
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

        let createdStudentId = null;

        // First, create the student
        fetch(endpoints.ADD_STUDENTS, {
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
                        throw new Error(errorData.details);
                    });
                }
                return response.json();
            })
            .then((createdStudent) => {
                console.log(createdStudent);
                createdStudentId = createdStudent.student.student_id;

                // After the student is created, attempt to enroll them
                const enrollmentPayload = {
                    student_ids: [createdStudentId],
                    course_id: selectedCourse,
                };

                return fetch(endpoints.ENROLL_STUDENTS, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessTokenData.access_token}`,
                    },
                    body: JSON.stringify(enrollmentPayload),
                });
            })
            .then((enrollmentResponse) => {
                if (!enrollmentResponse.ok) {
                    // If enrollment fails, roll back by deleting the created student
                    return fetch(
                        `${endpoints.DELETE_STUDENT}/${createdStudentId}`,
                        {
                            method: "DELETE",
                            headers: {
                                Authorization: `Bearer ${accessTokenData.access_token}`,
                            },
                        }
                    ).then(() => {
                        throw new Error(
                            "Failed to enroll the student, rolling back."
                        );
                    });
                }
                return enrollmentResponse.json();
            })
            .then((data) => {
                alert(data.message);
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
                setSelectedCourse("");

                // Fetch updated students list after adding the new one
                return fetch(endpoints.GET_STUDENTS, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessTokenData.access_token}`,
                    },
                });
            })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => {
                        throw new Error(errorData.details);
                    });
                }
                return response.json();
            })
            .then((updatedData) => {
                setStudents(updatedData.students.reverse());
            })
            .catch((error) => alert(error.message));
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
                    <button type="submit">Submeter</button>
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
