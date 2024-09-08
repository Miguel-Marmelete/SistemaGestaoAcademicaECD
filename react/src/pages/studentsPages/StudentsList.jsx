import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";
import { fetchCourses } from "../../../scripts/getCourses";

const StudentsList = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(""); // Set initial state to an empty string
    const [students, setStudents] = useState([]);
    const navigate = useNavigate();
    const { accessTokenData } = useAuth();

    // Fetch courses from API
    useEffect(() => {
        fetchCourses(accessTokenData.access_token)
            .then((courses) => {
                setCourses(courses.reverse()); // Reverse to show latest courses first
            })
            .catch((error) => {
                alert(error);
            });
    }, [accessTokenData.access_token]);

    // Fetch students when the selected course changes or when no course is selected
    useEffect(() => {
        const fetchStudentsUrl = selectedCourse
            ? `${endpoints.GET_FILTERED_STUDENTS}?course_id=${selectedCourse}`
            : endpoints.GET_FILTERED_STUDENTS; // No course_id for fetching all students

        fetch(fetchStudentsUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch students");
                }
                return response.json();
            })
            .then((data) => {
                console.log("students data:", data);
                setStudents(data);
            })
            .catch((error) => {
                console.error("Error fetching students:", error);
                alert(error.message);
            });

        // Update query string
        navigate(`?course=${selectedCourse}`);
    }, [selectedCourse, navigate]);

    const handleCourseChange = (event) => {
        const courseId = event.target.value;
        console.log("course id after change:", courseId);
        setSelectedCourse(courseId);
    };

    return (
        <div className="table-list-container">
            <header>
                <h1>Alunos Inscritos</h1>
            </header>
            <div className="filters">
                <label>
                    Curso:
                    <select
                        id="course-select"
                        value={selectedCourse}
                        onChange={handleCourseChange}
                    >
                        <option value="">Todos os cursos</option>
                        {courses.map((course) => (
                            <option
                                key={course.course_id}
                                value={course.course_id}
                            >
                                {course.name}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <table className="table-list" border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Número</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.student_id}>
                            <td>{student.name}</td>
                            <td>{student.number}</td>
                            <td>{student.personal_email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StudentsList;
