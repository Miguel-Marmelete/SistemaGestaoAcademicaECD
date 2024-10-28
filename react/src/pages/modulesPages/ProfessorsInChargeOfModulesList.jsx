import React, { useState, useEffect } from "react";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";
import ButtonMenu from "../../components/ButtonMenu";
import { modulesMenuButtons } from "../../../scripts/buttonsData";
import { ClipLoader } from "react-spinners";
import customFetch from "../../../scripts/customFetch"; // Import customFetch

const ProfessorsInChargeOfModulesList = () => {
    const { accessTokenData, setAccessTokenData } = useAuth();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [professorsInCharge, setProfessorsInCharge] = useState([]);
    const [filteredProfessorsInCharge, setFilteredProfessorsInCharge] =
        useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        customFetch(endpoints.GET_COURSES, accessTokenData, setAccessTokenData)
            .then((data) => setCourses(data.courses.reverse()))
            .catch((error) => alert(error))
            .finally(() => setLoading(false));
    }, [accessTokenData]);

    useEffect(() => {
        setLoading(true);
        customFetch(
            endpoints.GET_PROFESSORS_IN_CHARGE_OF_MODULES,
            accessTokenData,
            setAccessTokenData
        )
            .then((data) => {
                setProfessorsInCharge(data.professorsInCharge);
                setFilteredProfessorsInCharge(data.professorsInCharge);
            })
            .catch((error) =>
                alert("Failed to fetch professors in charge: " + error)
            )
            .finally(() => setLoading(false));
    }, [accessTokenData]);

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
        if (
            !window.confirm(
                "Are you sure you want to remove this professor from the module?"
            )
        ) {
            return;
        }

        customFetch(
            `${endpoints.DELETE_PROFESSOR_IN_CHARGE_OF_MODULE}/${professor_id}/${module_id}/${course_id}`,
            accessTokenData,
            setAccessTokenData,
            "DELETE"
        )
            .then(() => {
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
                alert(error);
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
                        {loading ? (
                            <tr>
                                <td colSpan="4">
                                    Loading <ClipLoader size={15} />
                                </td>
                            </tr>
                        ) : (
                            filteredProfessorsInCharge.map(
                                (professorInCharge) => (
                                    <tr
                                        key={`${professorInCharge.module.module_id}-${professorInCharge.professor.professor_id}-${professorInCharge.course.course_id}`}
                                    >
                                        <td>{professorInCharge.module.name}</td>
                                        <td>
                                            {professorInCharge.professor.name}
                                        </td>
                                        <td>{professorInCharge.course.name}</td>
                                        <td>
                                            <button
                                                className="buttons"
                                                onClick={() =>
                                                    handleDelete(
                                                        professorInCharge.module
                                                            .module_id,
                                                        professorInCharge
                                                            .professor
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
                                )
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProfessorsInChargeOfModulesList;
