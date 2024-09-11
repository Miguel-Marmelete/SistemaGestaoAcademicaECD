import React, { useState, useEffect } from "react";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";

const ProfessorsInChargeOfModulesList = () => {
    const { accessTokenData } = useAuth();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [professorsInCharge, setProfessorsInCharge] = useState([]);
    const [filteredProfessorsInCharge, setFilteredProfessorsInCharge] =
        useState([]);

    useEffect(() => {
        fetch(endpoints.GET_COURSES, {
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => setCourses(data.courses.reverse()))
            .catch((error) =>
                alert("Failed to fetch courses: " + error.message)
            );
    }, [accessTokenData.access_token]);

    useEffect(() => {
        fetch(endpoints.GET_PROFESSORS_IN_CHARGE_OF_MODULES, {
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setProfessorsInCharge(data.professorsInCharge);
                setFilteredProfessorsInCharge(data.professorsInCharge);
            })
            .catch((error) =>
                alert("Failed to fetch professors in charge: " + error.message)
            );
    }, [accessTokenData.access_token]);

    useEffect(() => {
        if (selectedCourse) {
            const courseId = Number(selectedCourse);
            setFilteredProfessorsInCharge(
                professorsInCharge.filter(
                    (professorInCharge) =>
                        professorInCharge.course_id === courseId
                )
            );
        } else {
            setFilteredProfessorsInCharge(professorsInCharge);
        }
    }, [selectedCourse, professorsInCharge]);

    return (
        <div className="table-list-container">
            <header>
                <h1>Professors in Charge of Modules</h1>
            </header>
            <div className="filters">
                <label>
                    Course:
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                    >
                        <option value="">All Courses</option>
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
                        <th>Module</th>
                        <th>Professor</th>
                        <th>Course</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProfessorsInCharge.map((professorInCharge) => (
                        <tr
                            key={`${professorInCharge.module.module_id}-${professorInCharge.professor.professor_id}-${professorInCharge.course.course_id}`}
                        >
                            <td>{professorInCharge.module.name}</td>
                            <td>{professorInCharge.professor.name}</td>
                            <td>{professorInCharge.course.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProfessorsInChargeOfModulesList;
