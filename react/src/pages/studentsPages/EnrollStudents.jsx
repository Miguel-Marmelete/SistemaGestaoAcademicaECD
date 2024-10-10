import React, { useState, useEffect } from "react";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";
import { fetchCoursesAndModulesOfProfessor } from "../../../scripts/getCoursesandModulesOfProfessor";
import ButtonMenu from "../../components/ButtonMenu";
import { studentsMenuButtons } from "../../../scripts/buttonsData";
import customFetch from "../../../scripts/customFetch";

const EnrollStudents = () => {
    const { accessTokenData, setAccessTokenData } = useAuth();
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
        customFetch(endpoints.GET_STUDENTS, accessTokenData, setAccessTokenData)
            .then((data) => {
                setStudents(data.students.reverse());
            })
            .catch((error) => {
                console.error("Error fetching students:", error);
            });
    }, [accessTokenData]);

    // Fetch enrolled students whenever the selected course changes
    useEffect(() => {
        if (selectedCourse) {
            customFetch(
                `${endpoints.GET_STUDENTS}?course_id=${selectedCourse}`,
                accessTokenData,
                setAccessTokenData
            )
                .then((data) => {
                    setEnrolledStudents(data.students.reverse());
                })
                .catch((error) => {
                    console.error("Error fetching enrolled students:", error);
                });
        } else {
            setEnrolledStudents([]); // Reset if no course is selected
        }
    }, [selectedCourse, accessTokenData]);

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

        customFetch(
            endpoints.ENROLL_STUDENTS,
            accessTokenData,
            setAccessTokenData,
            "POST",
            enrollmentData
        )
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
                        <div className="form-table-responsive">
                            {students.length > 0 ? (
                                <table className="form-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Number</th>
                                            <th>Select</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((student) => (
                                            <tr key={student.student_id}>
                                                <td>{student.name}</td>
                                                <td>{student.number}</td>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        id={student.student_id}
                                                        value={
                                                            student.student_id
                                                        }
                                                        onChange={() =>
                                                            handleStudentChange(
                                                                student.student_id
                                                            )
                                                        }
                                                        checked={selectedStudents.includes(
                                                            student.student_id
                                                        )}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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
