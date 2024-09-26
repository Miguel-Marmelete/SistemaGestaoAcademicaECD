import React, { useState, useEffect } from "react";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";
import { fetchCoursesAndModulesOfProfessor } from "../../../scripts/getCoursesandModulesOfProfessor";
import ButtonMenu from "../../components/ButtonMenu";
import { studentsMenuButtons } from "../../../scripts/buttonsData";

const EnrollStudents = () => {
    const { accessTokenData } = useAuth();
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [loading, setLoading] = useState(false); // Add loading state

    // Fetch courses on component mount
    useEffect(() => {
        fetchCoursesAndModulesOfProfessor(accessTokenData.access_token)
            .then((data) => {
                setCourses(data.courses.reverse());
            })
            .catch((error) => {
                alert(error);
                console.error("Error fetching courses:", error);
            });
    }, [accessTokenData.access_token]);

    // Fetch all students on component mount
    useEffect(() => {
        fetch(endpoints.GET_STUDENTS, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch students");
                }
                return response.json();
            })
            .then((data) => {
                setStudents(data.students.reverse());
            })
            .catch((error) => {
                console.error("Error fetching students:", error);
            });
    }, [accessTokenData.access_token]);

    // Fetch enrolled students whenever the selected course changes
    useEffect(() => {
        if (selectedCourse) {
            fetch(
                `${endpoints.GET_STUDENTS_BY_COURSE}?course_id=${selectedCourse}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessTokenData.access_token}`,
                    },
                }
            )
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch enrolled students");
                    }
                    return response.json();
                })
                .then((data) => {
                    setEnrolledStudents(data.students.reverse());
                })
                .catch((error) => {
                    console.error("Error fetching enrolled students:", error);
                });
        } else {
            setEnrolledStudents([]); // Reset if no course is selected
        }
    }, [selectedCourse, accessTokenData.access_token]);

    const handleCourseChange = (e) => {
        setSelectedCourse(e.target.value);
        setSelectedStudents([]); // Reset selected students when course changes
    };

    const handleStudentChange = (studentId) => {
        setSelectedStudents((prevSelected) =>
            prevSelected.includes(studentId)
                ? prevSelected.filter((id) => id !== studentId)
                : [...prevSelected, studentId]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true); // Set loading to true when form is submitted

        const enrollmentData = {
            course_id: selectedCourse,
            student_ids: selectedStudents,
        };

        fetch(endpoints.ENROLL_STUDENTS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
            body: JSON.stringify(enrollmentData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to enroll students");
                }
                return response.json();
            })
            .then(() => {
                alert("Students enrolled successfully!");
                // Reset form
                setSelectedCourse("");
                setSelectedStudents([]);
                setEnrolledStudents([]); // Reset enrolled students
            })
            .catch((error) => {
                console.error("Error:", error);
                alert(error.message);
            })
            .finally(() => {
                setLoading(false); // Set loading to false after request completes
            });
    };

    return (
        <div>
            <ButtonMenu buttons={studentsMenuButtons} />

            <div className="container">
                <form className="submitForm" onSubmit={handleSubmit}>
                    <h2>Inscrições</h2>
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
                        <label>Students</label>
                        <div className="checkbox-group">
                            {students.length > 0 ? (
                                students.map((student) => (
                                    <div key={student.student_id}>
                                        <input
                                            type="checkbox"
                                            id={student.student_id}
                                            value={student.student_id}
                                            onChange={() =>
                                                handleStudentChange(
                                                    student.student_id
                                                )
                                            }
                                            checked={selectedStudents.includes(
                                                student.student_id
                                            )}
                                        />
                                        <label htmlFor={student.student_id}>
                                            {student.name}
                                        </label>
                                    </div>
                                ))
                            ) : (
                                <p>No students available</p>
                            )}
                        </div>
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                </form>

                <div className="list">
                    <h2>
                        Students Enrolled in{" "}
                        {selectedCourse
                            ? courses.find(
                                  (course) =>
                                      course.course_id === selectedCourse
                              )?.name
                            : ""}
                    </h2>
                    <ul>
                        {enrolledStudents.map((student) => (
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

export default EnrollStudents;
