import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import customFetch from "../../../scripts/customFetch";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";
import { ClipLoader } from "react-spinners";

const StudentDetails = () => {
    const { studentId } = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const { accessTokenData, setAccessTokenData } = useAuth();

    useEffect(() => {
        console.log("Fetching student details for ID:", studentId);
        customFetch(
            `${endpoints.GET_STUDENT}/${studentId}`,
            accessTokenData,
            setAccessTokenData
        )
            .then((data) => {
                console.log("Fetched student data:", data);
                setStudent(data.student);
            })
            .catch((error) => {
                console.error("Error fetching student details:", error);
                alert("Error fetching student details: " + error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [studentId, accessTokenData, setAccessTokenData]);

    if (loading) {
        return (
            <div>
                <h2>
                    Loading <ClipLoader size={15} />
                </h2>
            </div>
        );
    }

    if (!student) {
        return <div>No student data available</div>;
    }

    return (
        <div className="student-details">
            <h1 className="student-name">{student.name}</h1>
            <div className="student-info">
                <p>
                    <strong>Número:</strong> {student.number}
                </p>
                <p>
                    <strong>Email pessoal:</strong> {student.personal_email}
                </p>
                <p>
                    <strong>Telemóvel:</strong> {student.mobile}
                </p>
                <p>
                    <strong>IPBeja Email:</strong> {student.ipbeja_email}
                </p>
                <p>
                    <strong>Data de nascimento:</strong> {student.birthday}
                </p>
                <p>
                    <strong>Morada:</strong> {student.address}
                </p>
                <p>
                    <strong>Cidade:</strong> {student.city}
                </p>
                <p>
                    <strong>Posto:</strong> {student.posto}
                </p>
                <p>
                    <strong>NIM:</strong> {student.nim}
                </p>
                <p>
                    <strong>Classe:</strong> {student.classe}
                </p>
            </div>
        </div>
    );
};

export default StudentDetails;
