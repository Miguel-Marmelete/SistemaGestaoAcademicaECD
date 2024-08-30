import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import endpoints from "../../endpoints";
const LessonsList = () => {
    const [lessons, setLessons] = useState([]);
    const { accessTokenData } = useAuth();

    useEffect(() => {
        fetch(endpoints.GET_LESSONS, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch lessons");
                }
                return response.json();
            })
            .then((data) => {
                setLessons(data.lessons); // Adjust according to the actual structure of the response
            })
            .catch((error) => {
                alert("Failed to fetch lessons: " + error.message);
            });
    }, []);

    return (
        <div className="table-list-container">
            <header>
                <h1>Lessons</h1>
            </header>

            <table className="table-list" border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Summary</th>
                        <th>Submodule</th>
                        <th>Course</th>
                        <th>Date</th>
                        <th>Professors</th>
                    </tr>
                </thead>
                <tbody>
                    {lessons.map((lesson) => (
                        <tr key={lesson.lesson_id}>
                            <td>{lesson.title}</td>
                            <td>{lesson.type}</td>
                            <td>{lesson.summary}</td>
                            <td>{lesson.submodule.name}</td>
                            <td>{lesson.course.name}</td>
                            <td>{lesson.date}</td>
                            <td>
                                {lesson.professors
                                    .map((professor) => professor.name)
                                    .join(", ")}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LessonsList;
