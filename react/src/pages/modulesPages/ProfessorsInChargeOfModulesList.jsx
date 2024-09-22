import React, { useState, useEffect } from "react";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";
import ButtonMenu from "../../components/ButtonMenu";
import { modulesMenuButtons } from "../../../scripts/buttonsData";

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

    const handleDelete = (module_id, professor_id, course_id) => {
        console.log(typeof module_id, typeof professor_id, typeof course_id);
        if (
            !window.confirm(
                "Are you sure you want to remove this professor from the module?"
            )
        ) {
            return;
        }

        fetch(
            `${endpoints.DELETE_PROFESSOR_IN_CHARGE_OF_MODULE}/${professor_id}/${module_id}/${course_id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessTokenData.access_token}`,
                },
            }
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to delete professor from module");
                }
                setFilteredProfessorsInCharge((prevProfessorsInCharge) =>
                    prevProfessorsInCharge.filter(
                        (professorInCharge) =>
                            !(
                                professorInCharge.module.module_id ===
                                    module_id &&
                                professorInCharge.professor.professor_id ===
                                    professor_id &&
                                professorInCharge.course.course_id === course_id
                            )
                    )
                );
                alert("Professor removed successfully from the module");
            })
            .catch((error) => {
                alert(error.message);
            });
    };

    return (
        <div>
            <ButtonMenu buttons={modulesMenuButtons} />
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
                            <th>Ações</th>
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
                                <td>
                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                professorInCharge.module
                                                    .module_id,
                                                professorInCharge.professor
                                                    .professor_id,
                                                professorInCharge.course
                                                    .course_id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProfessorsInChargeOfModulesList;
