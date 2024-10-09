import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import ButtonMenu from "../../components/ButtonMenu";
import { professorsMenuButtons } from "../../../scripts/buttonsData";
import { fetchProfessors } from "../../../scripts/getProfessors";
import endpoints from "../../endpoints";
import { ClipLoader } from "react-spinners";

const ProfessorsList = () => {
    const [professors, setProfessors] = useState([]);
    const { accessTokenData, professor } = useAuth();

    useEffect(() => {
        fetchProfessors(accessTokenData.access_token)
            .then((data) => {
                setProfessors(data);
            })
            .catch((error) => {
                console.error("Error fetching professors:", error);
            });
    }, [accessTokenData.access_token, professor]); // Add professor to dependency array

    const handleDelete = (professorId) => {
        if (window.confirm("Are you sure you want to delete this professor?")) {
            fetch(`${endpoints.DELETE_PROFESSOR}/${professorId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessTokenData.access_token}`,
                    "Content-Type": "application/json",
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to delete professor");
                    }
                    return response.json();
                })
                .then(() => {
                    alert("Professor deleted successfully");
                    setProfessors(
                        professors.filter(
                            (prof) => prof.professor_id !== professorId
                        )
                    );
                })
                .catch((error) => {
                    console.error("Error deleting professor:", error);
                    alert("Failed to delete professor. Please try again.");
                });
        }
    };

    if (!professor) {
        return (
            <div>
                Loading professors... <ClipLoader size={15} />
            </div>
        );
    }

    return (
        <div>
            <ButtonMenu buttons={professorsMenuButtons} />
            <div className="table-list-container">
                <header>
                    <h1>Professors List</h1>
                </header>
                {
                    <table className="table-list" border="1" cellPadding="10">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Is Coordinator</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {professors.map((professorItem) => (
                                <tr key={professorItem.professor_id}>
                                    <td>{professorItem.name}</td>
                                    <td>{professorItem.email}</td>
                                    <td>
                                        {professorItem.is_coordinator
                                            ? "Yes"
                                            : "No"}
                                    </td>
                                    <td>
                                        {!professorItem.is_coordinator &&
                                            professorItem.professor_id !==
                                                professor.professor_id && (
                                                <button
                                                    className="buttons"
                                                    onClick={() =>
                                                        handleDelete(
                                                            professorItem.professor_id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                }
            </div>
        </div>
    );
};

export default ProfessorsList;
