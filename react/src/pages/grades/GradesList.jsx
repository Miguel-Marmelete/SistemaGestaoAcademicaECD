import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import customFetch from "../../../scripts/customFetch";
import ButtonMenu from "../../components/ButtonMenu";
import { gradesMenuButtons } from "../../../scripts/buttonsData";
import endpoints from "../../endpoints";

const GradesList = () => {
    const { accessTokenData, setAccessTokenData, professor } = useAuth();
    const [courses, setCourses] = useState([]);
    const [modules, setModules] = useState([]);
    const [students, setStudents] = useState([]); // Initialize as empty array
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedModule, setSelectedModule] = useState("");
    const [grades, setGrades] = useState({});

    // Fetch courses and modules on component mount
    useEffect(() => {
        customFetch(
            endpoints.GET_MODULES_OF_COURSE_OF_PROFESSOR,
            accessTokenData,
            setAccessTokenData
        )
            .then((data) => {
                setCourses(data.courseModules.reverse());
            })
            .catch((error) =>
                console.error("Error fetching courses and modules:", error)
            );
    }, [accessTokenData, setAccessTokenData]);

    // Fetch students and grades when a course and module are selected
    useEffect(() => {
        if (selectedCourse && selectedModule) {
            customFetch(
                `${endpoints.GET_STUDENTS_WITH_GRADES}?course_id=${selectedCourse}&module_id=${selectedModule}`,
                accessTokenData,
                setAccessTokenData
            )
                .then((data) => {
                    // Check if data.students exists and is an array
                    if (data.students && Array.isArray(data.students)) {
                        setStudents(data.students);
                        // Initialize grades state with existing grades
                        const initialGrades = {};
                        data.students.forEach((student) => {
                            initialGrades[student.student_id] =
                                student.grade_value;
                        });
                        setGrades(initialGrades);
                    } else {
                        console.error("Unexpected data format", data);
                        setStudents([]);
                        setGrades({});
                    }
                })
                .catch((error) =>
                    console.error("Error fetching students:", error)
                );
        }
    }, [selectedCourse, selectedModule, accessTokenData, setAccessTokenData]);

    const handleCourseChange = (e) => {
        const courseId = e.target.value;
        setSelectedCourse(courseId);
        setSelectedModule("");

        // Find the modules for the selected course
        const selectedCourseModules = courses.find(
            (course) => course.course.course_id === parseInt(courseId)
        );
        setModules(selectedCourseModules ? selectedCourseModules.modules : []);
    };

    const handleGradeChange = (studentId, value) => {
        setGrades((prevGrades) => ({
            ...prevGrades,
            [studentId]: value,
        }));
    };

    const submitGrades = (gradesToSubmit) => {
        customFetch(
            endpoints.SUBMIT_GRADES,
            accessTokenData,
            setAccessTokenData,
            "POST",
            { grades: gradesToSubmit }
        )
            .then(() => alert("Grades submitted successfully"))
            .catch((error) => console.error("Error submitting grades:", error));
    };

    const handleGradeSubmit = (studentId) => {
        const gradeValue = grades[studentId];
        if (gradeValue === undefined) return;

        const gradeData = [
            {
                module_id: selectedModule,
                student_id: studentId,
                course_id: selectedCourse,
                grade_value: parseInt(gradeValue),
            },
        ];

        submitGrades(gradeData);
    };

    const handleSubmitAllGrades = () => {
        const allGradesData = students
            .map((student) => ({
                module_id: selectedModule,
                student_id: student.student_id,
                course_id: selectedCourse,
                grade_value: parseInt(grades[student.student_id]) || null,
            }))
            .filter((grade) => grade.grade_value !== null);

        if (allGradesData.length > 0) {
            submitGrades(allGradesData);
        } else {
            alert("No grades to submit");
        }
    };

    return (
        <div>
            <ButtonMenu buttons={gradesMenuButtons} />
            <div className="table-list-container">
                <header>
                    <h1>Grades List</h1>
                </header>

                <div className="filters">
                    <label>
                        Course:
                        <select
                            value={selectedCourse}
                            onChange={handleCourseChange}
                        >
                            <option value="">Select Course</option>
                            {courses.length > 0 &&
                                courses.map((course) => (
                                    <option
                                        key={course.course.course_id}
                                        value={course.course.course_id}
                                    >
                                        {course.course.name}
                                    </option>
                                ))}
                        </select>
                    </label>

                    <label>
                        Module:
                        <select
                            value={selectedModule}
                            onChange={(e) => setSelectedModule(e.target.value)}
                            disabled={!selectedCourse}
                        >
                            <option value="">Select Module</option>
                            {modules.length > 0 &&
                                modules.map((module) => (
                                    <option
                                        key={module.module_id}
                                        value={module.module_id}
                                    >
                                        {module.name}
                                    </option>
                                ))}
                        </select>
                    </label>
                </div>

                <table className="table-list" border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Student Number</th>
                            <th>Grade</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length > 0 ? (
                            students.map((student) => (
                                <tr key={student.student_id}>
                                    <td>{student.student_name}</td>
                                    <td>{student.student_number}</td>
                                    <td>
                                        <input
                                            type="number"
                                            min="0"
                                            max="20"
                                            value={
                                                grades[student.student_id] || ""
                                            }
                                            placeholder={
                                                student.grade_value === null
                                                    ? "Grade not set"
                                                    : undefined
                                            }
                                            onChange={(e) =>
                                                handleGradeChange(
                                                    student.student_id,
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </td>
                                    <td>
                                        <button
                                            onClick={() =>
                                                handleGradeSubmit(
                                                    student.student_id
                                                )
                                            }
                                        >
                                            Save
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No students found</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <button onClick={handleSubmitAllGrades}>
                    Submit All Grades
                </button>
            </div>
        </div>
    );
};

export default GradesList;
