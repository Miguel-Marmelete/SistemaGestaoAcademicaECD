import React, { useState, useEffect } from "react";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";

const AddLesson = () => {
    const { accessTokenData } = useAuth();
    const [submodules, setSubmodules] = useState([]);
    const [courses, setCourses] = useState([]);
    const [professors, setProfessors] = useState([]);
    const [students, setStudents] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(false); // Add loading state
    const [lessonAdded, setLessonAdded] = useState(false); // State to track if a lesson was added
    const [formData, setFormData] = useState({
        title: "",
        type: "",
        summary: "",
        submodule_id: "",
        course_id: "",
        date: "",
        professor_ids: [],
        student_ids: [],
    });

    useEffect(() => {
        fetch(endpoints.GET_COURSES, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((courseResponse) => {
                if (courseResponse.ok) {
                    return courseResponse.json();
                } else {
                    throw new Error("Failed to fetch courses");
                }
            })
            .then((courseData) => {
                setCourses(courseData.courses.reverse());
            })
            .catch((error) => {
                console.error("Error:", error);
                alert(error.message);
            });

        fetch(endpoints.GET_PROFESSORS, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((professorResponse) => {
                if (professorResponse.ok) {
                    return professorResponse.json();
                } else {
                    throw new Error("Failed to fetch professors");
                }
            })
            .then((professorData) => {
                setProfessors(professorData.professors);
            })
            .catch((error) => {
                console.error("Error:", error);
                alert(error.message);
            });
    }, [accessTokenData]);

    useEffect(() => {
        fetch(
            `${endpoints.GET_LESSONS}?professor_id=${accessTokenData.professor_id}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessTokenData.access_token}`,
                },
            }
        )
            .then((lessonResponse) => {
                if (lessonResponse.ok) {
                    return lessonResponse.json();
                } else {
                    throw new Error("Failed to fetch lessons");
                }
            })
            .then((lessonData) => {
                setLessons(lessonData.lessons.reverse());
            })
            .catch((error) => {
                console.error("Error:", error);
                alert(error.message);
            });
    }, [lessonAdded, accessTokenData]);

    useEffect(() => {
        if (formData.course_id) {
            fetch(
                `${endpoints.GET_SUBMODULES_OF_PROFESSOR}?course_id=${formData.course_id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessTokenData.access_token}`,
                    },
                }
            )
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("Failed to fetch submodules");
                    }
                })
                .then((data) => {
                    setSubmodules(data.submodules);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert(error.message);
                });
        } else {
            setSubmodules([]);
        }
    }, [formData.course_id, accessTokenData]);

    useEffect(() => {
        if (formData.course_id) {
            fetch(
                `${endpoints.GET_STUDENTS_BY_COURSE}?course_id=${formData.course_id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessTokenData.access_token}`,
                    },
                }
            )
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("Failed to fetch students");
                    }
                })
                .then((data) => {
                    setStudents(data.students);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    alert(error.message);
                });
        } else {
            setStudents([]);
        }
    }, [formData.course_id, accessTokenData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleProfessorCheckboxChange = (e) => {
        const { value, checked } = e.target;
        const numericValue = parseInt(value, 10);

        setFormData((prevState) => {
            if (checked) {
                return {
                    ...prevState,
                    professor_ids: [...prevState.professor_ids, numericValue],
                };
            } else {
                return {
                    ...prevState,
                    professor_ids: prevState.professor_ids.filter(
                        (id) => id !== numericValue
                    ),
                };
            }
        });
    };

    const handleStudentCheckboxChange = (e) => {
        const { value, checked } = e.target;
        const numericValue = parseInt(value, 10);

        setFormData((prevState) => {
            if (checked) {
                return {
                    ...prevState,
                    student_ids: [...prevState.student_ids, numericValue],
                };
            } else {
                return {
                    ...prevState,
                    student_ids: prevState.student_ids.filter(
                        (id) => id !== numericValue
                    ),
                };
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (loading) return; // Prevent multiple submissions

        setLoading(true); // Set loading to true

        const formattedDate = new Date(formData.date)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
        const adjustedDate = formattedDate.slice(0, 13) + ":00:00";

        const updatedFormData = {
            ...formData,
            date: adjustedDate,
        };

        fetch(endpoints.ADD_LESSONS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
            body: JSON.stringify(updatedFormData),
        })
            .then((response) => {
                if (response.ok) {
                    alert("Lesson added successfully!");
                    setFormData({
                        title: "",
                        type: "",
                        summary: "",
                        submodule_id: "",
                        course_id: "",
                        date: "",
                        professor_ids: [],
                        student_ids: [],
                    });
                    setLessonAdded((prev) => !prev); // Toggle the state to trigger re-fetch
                } else {
                    return response.json().then((errorData) => {
                        throw new Error(
                            `Failed to add lesson: ${JSON.stringify(
                                errorData.errors
                            )}`
                        );
                    });
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert(error.message);
            })
            .finally(() => {
                setLoading(false); // Set loading to false
            });
    };

    return (
        <div className="container">
            <form className="submitForm" onSubmit={handleSubmit}>
                <h2>Add Lesson</h2>
                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        maxLength={255}
                    />
                </div>
                <div>
                    <label>Type</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>
                            Select a type
                        </option>
                        <option value="Teórica">Teórica</option>
                        <option value="Laboratorial">Laboratorial</option>
                        <option value="Teórica-Prática">Teórica-Prática</option>
                    </select>
                </div>
                <div>
                    <label>Summary</label>
                    <textarea
                        name="summary"
                        value={formData.summary}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <div>
                    <label>Course</label>
                    <select
                        name="course_id"
                        value={formData.course_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>
                            Select a course
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
                    <label>Submodule</label>
                    <select
                        name="submodule_id"
                        value={formData.submodule_id}
                        onChange={handleChange}
                        required
                        disabled={!formData.course_id} // Disable until a course is selected
                    >
                        <option value="" disabled>
                            Select a submodule
                        </option>
                        {submodules.map((submodule) => (
                            <option
                                key={submodule.submodule_id}
                                value={submodule.submodule_id}
                            >
                                {submodule.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Professors</label>
                    <div className="checkbox-group">
                        {professors.map((professor) => (
                            <div key={professor.professor_id}>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="professor_ids"
                                        value={professor.professor_id}
                                        checked={formData.professor_ids.includes(
                                            professor.professor_id
                                        )}
                                        onChange={handleProfessorCheckboxChange}
                                    />
                                    {professor.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                {formData.course_id && (
                    <div>
                        <label>Students</label>
                        <div className="checkbox-group">
                            {students.length > 0 ? (
                                students.map((student) => (
                                    <div key={student.student_id}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="student_ids"
                                                value={student.student_id}
                                                checked={formData.student_ids.includes(
                                                    student.student_id
                                                )}
                                                onChange={
                                                    handleStudentCheckboxChange
                                                }
                                            />
                                            {student.name}
                                        </label>
                                    </div>
                                ))
                            ) : (
                                <p>No students enrolled in course</p>
                            )}
                        </div>
                    </div>
                )}
                <div>
                    <label>Date</label>
                    <input
                        type="datetime-local"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>
            <div className="list">
                <h2>Existing Lessons</h2>
                <ul>
                    {lessons.map((lesson) => (
                        <li key={lesson.lesson_id}>
                            {lesson.title} - {lesson.date}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AddLesson;
