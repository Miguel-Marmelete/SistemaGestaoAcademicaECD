import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import endpoints from "../../endpoints";
import ButtonMenu from "../../components/ButtonMenu";
import { evaluationMomentsMenuButtons } from "../../../scripts/buttonsData";
const EvaluationStudents = () => {
    const { accessTokenData } = useAuth();
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [evaluationMoments, setEvaluationMoments] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [grades, setGrades] = useState({});

    useEffect(() => {
        // Fetch courses
        fetch(endpoints.GET_COURSES, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setCourses(data.courses);
            })
            .catch((error) => alert(error.message));
    }, [accessTokenData]);

    const handleCourseChange = (e) => {
        const courseId = e.target.value;
        setSelectedCourse(courseId);

        // Fetch evaluation moments and students by course
        fetch(`${endpoints.GET_EVALUATION_MOMENTS_BY_COURSE}/${courseId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setEvaluationMoments(data.evaluation_moments);
            })
            .catch((error) => alert(error.message));

        fetch(`${endpoints.GET_STUDENTS_BY_COURSE}/${courseId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setStudents(data.students);
            })
            .catch((error) => alert(error.message));
    };

    const handleGradeChange = (studentId, value) => {
        setGrades({
            ...grades,
            [studentId]: value,
        });
    };

    const handleSubmitGrades = () => {
        const gradeData = students.map((student) => ({
            student_id: student.student_id,
            evaluation_moment_grade_value: grades[student.student_id] || 0,
        }));

        console.log("Grades to submit:", gradeData);
        // Submit logic to backend can go here
    };

    return (
        <div className="table-list-container">
            <header>
                <h1>Avaliação dos Estudantes</h1>
            </header>

            <div className="filters">
                <label>
                    Curso:
                    <select
                        value={selectedCourse}
                        onChange={handleCourseChange}
                    >
                        <option value="">Todos os Cursos</option>
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

            <h2>Momentos de Avaliação</h2>
            <ul>
                {evaluationMoments.map((moment) => (
                    <li key={moment.evaluation_moment_id}>
                        {moment.type} - {moment.date}
                    </li>
                ))}
            </ul>

            <h2>Estudantes</h2>
            <table className="table-list" border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Nome do Estudante</th>
                        <th>Email</th>
                        <th>Inserir Nota</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.student_id}>
                            <td>{student.name}</td>
                            <td>{student.ipbeja_email}</td>
                            <td>
                                <input
                                    type="number"
                                    value={grades[student.student_id] || ""}
                                    onChange={(e) =>
                                        handleGradeChange(
                                            student.student_id,
                                            e.target.value
                                        )
                                    }
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button onClick={handleSubmitGrades}>Submeter Notas</button>
        </div>
    );
};

export default EvaluationStudents;
