import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import endpoints from "../../endpoints";

const AttendanceList = () => {
    const [attendances, setAttendances] = useState([]);
    const [filteredAttendances, setFilteredAttendances] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState("");
    const { accessTokenData } = useAuth();

    useEffect(() => {
        // Fetch lessons and attendances
        Promise.all([
            fetch(endpoints.GET_LESSONS, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessTokenData.access_token}`,
                },
            }),
            fetch(endpoints.GET_ATTENDANCES, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessTokenData.access_token}`,
                },
            }),
        ])
            .then(async ([lessonsResponse, attendanceResponse]) => {
                if (!lessonsResponse.ok || !attendanceResponse.ok) {
                    throw new Error("Failed to fetch data");
                }
                const lessonsData = await lessonsResponse.json();
                const attendanceData = await attendanceResponse.json();

                setLessons(lessonsData.lessons);
                setAttendances(attendanceData.attendances);
                setFilteredAttendances(attendanceData.attendances);
            })
            .catch((error) => {
                alert(error.message);
            });
    }, []);

    useEffect(() => {
        // Apply filter when selection changes
        let filtered = attendances;
        if (selectedLesson) {
            filtered = filtered.filter(
                (attendance) => attendance.lesson_id === selectedLesson
            );
        }
        setFilteredAttendances(filtered);
    }, [selectedLesson, attendances]);

    return (
        <div className="table-list-container">
            <header>
                <h1>Attendance</h1>
            </header>

            <div className="filters">
                <label>
                    Lesson:
                    <select
                        value={selectedLesson}
                        onChange={(e) => setSelectedLesson(e.target.value)}
                    >
                        <option value="">All Lessons</option>
                        {lessons.map((lesson) => (
                            <option
                                key={lesson.lesson_id}
                                value={lesson.lesson_id}
                            >
                                {lesson.title}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <table className="table-list" border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Lesson</th>
                        <th>Student</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAttendances.map((attendance) => (
                        <tr
                            key={`${attendance.lesson_id}-${attendance.student_id}`}
                        >
                            <td>
                                {lessons.find(
                                    (lesson) =>
                                        lesson.lesson_id ===
                                        attendance.lesson_id
                                )?.title || "Unknown"}
                            </td>
                            <td>{attendance.student.name || "Unknown"}</td>
                            <td>
                                {new Date(
                                    attendance.created_at
                                ).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AttendanceList;
