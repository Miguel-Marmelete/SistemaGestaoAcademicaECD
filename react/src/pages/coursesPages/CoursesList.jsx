import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import { fetchCourses } from "../../../scripts/getCourses";
const CoursesList = () => {
    const [courses, setCourses] = useState([]);
    // Retrieve the token from context
    const { accessTokenData } = useAuth();
    useEffect(() => {
        fetchCourses(accessTokenData.access_token)
            .then((courses) => {
                setCourses(courses);
            })
            .catch((error) => {
                alert(error);
            });
    }, []);

    return (
        <div className="table-list-container">
            <header>
                <h1>Cursos</h1>
            </header>

            <table className="table-list" border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Abreviatura</th>
                        <th>Data de Inicio</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => (
                        <tr key={course.course_id}>
                            <td>{course.name}</td>
                            <td>{course.abbreviation}</td>
                            <td>{course.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CoursesList;
