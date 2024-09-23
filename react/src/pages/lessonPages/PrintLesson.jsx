import React, { useRef, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";

function PrintLesson() {
    const location = useLocation();
    const { lesson } = location.state;
    const { accessTokenData } = useAuth();
    const [attendance, setAttendance] = useState({
        presentStudents: [],
        absentStudents: [],
    });

    const componentRef = useRef();
    console.log(lesson);
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    useEffect(() => {
        if (lesson) {
            fetch(`${endpoints.GET_ATTENDANCE}?lesson_id=${lesson.lesson_id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessTokenData.access_token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    setAttendance(data);
                    console.log(attendance.presentStudents);
                })
                .catch((error) => {
                    console.error("Error fetching attendance:", error);
                });
        }
    }, [lesson]);

    if (!lesson) {
        return <div>Loading...</div>;
    }

    // Parse the lesson date
    const lessonDate = new Date(lesson.date);

    // Format the date to day-month-year
    const formattedDate = lessonDate.toLocaleDateString("pt-PT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    // Get the hour for "Hora Inicial"
    const horaInicial = lessonDate.toLocaleTimeString("pt-PT", {
        hour: "2-digit",
        minute: "2-digit",
    });

    // Calculate "Hora Final" (1 hour after "Hora Inicial")
    const lessonEndDate = new Date(lessonDate.getTime() + 60 * 60 * 1000);
    const horaFinal = lessonEndDate.toLocaleTimeString("pt-PT", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div className="lesson-container">
            <button className="print_button" onClick={handlePrint}>
                Imprimir Aula
            </button>

            <div ref={componentRef} className="lesson-content">
                <img
                    src="https://www.ipbeja.pt/PublishingImages/IPBeja_banner_esq.png"
                    alt="Header"
                    className="lesson-image"
                />

                <h1 className="lesson-title">Detalhes da Aula</h1>

                <div className="lesson-summary-details">
                    <div className="lesson-info">
                        <p>
                            <b>Titulo:</b> {lesson.title}
                        </p>
                        <p>
                            <b>Data:</b> {formattedDate}
                        </p>
                    </div>
                    <div className="lesson-info">
                        <p>
                            <b>Curso:</b> {lesson.course.name}
                        </p>
                        <p>
                            <b>Docente:</b>{" "}
                            {lesson.professors
                                .map((professor) => professor.name)
                                .join(", ")}
                        </p>
                    </div>
                    <div className="lesson-info">
                        <p>
                            <b>Submódulo:</b> {lesson.submodule.name}
                        </p>
                    </div>
                    <div className="lesson-info">
                        <p>
                            <b>Tipo de Aula:</b> {lesson.type}
                        </p>
                        <p>
                            <b>Situação:</b> Lançado
                        </p>
                    </div>
                </div>

                <div className="lesson-time-details">
                    <div className="lesson-info">
                        <p>
                            <b>Hora Inicial:</b> {horaInicial}
                        </p>
                        <p>
                            <b>Hora Final:</b> {horaFinal}
                        </p>
                    </div>
                    <div className="lesson-info">
                        <p>
                            <b>Nº de Alunos:</b>{" "}
                            {attendance.presentStudents.length +
                                attendance.absentStudents.length}
                        </p>
                        <p>
                            <b>Nº de Presenças:</b>{" "}
                            {attendance.presentStudents.length}
                        </p>
                    </div>
                </div>

                <div className="lesson-description">
                    <p>
                        <b>Sumário</b>
                        <br></br> {lesson.summary}
                    </p>
                </div>

                <h2 className="lesson-subtitle">Presenças</h2>
                <table className="lesson-table">
                    <thead>
                        <tr>
                            <th>Número</th>
                            <th>Nome</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendance.presentStudents.map((student) => (
                            <tr key={student.student_id}>
                                <td>{student.number}</td>
                                <td>{student.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PrintLesson;
