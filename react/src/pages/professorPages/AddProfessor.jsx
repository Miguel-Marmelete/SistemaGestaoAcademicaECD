import React, { useState, useEffect } from "react";
import ButtonMenu from "../../components/ButtonMenu";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";
import { professorsMenuButtons } from "../../../scripts/buttonsData";
import { ClipLoader } from "react-spinners";

const AddProfessor = () => {
    const { accessTokenData, setAccessTokenData } = useAuth();
    const [professors, setProfessors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        cc: "",
        cc_expire_date: "",
        mobile: "",
    });

    useEffect(() => {
        setLoading(true);
        fetch(endpoints.GET_PROFESSORS, {
            headers: {
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => setProfessors(data.professors.reverse()))
            .catch((error) =>
                alert("Error fetching professors: " + error.message)
            )
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        customFetch(
            endpoints.ADD_PROFESSOR,
            accessTokenData,
            setAccessTokenData,
            "POST",
            formData
        )
            .then(() => {
                alert("Professor added successfully!");
                setFormData({
                    name: "",
                    email: "",
                    cc: "",
                    cc_expire_date: "",
                    mobile: "",
                });
                // Fetch professors again after adding a new one
                return customFetch(
                    endpoints.GET_PROFESSORS,
                    accessTokenData,
                    setAccessTokenData
                );
            })
            .then((data) => setProfessors(data.professors.reverse()))
            .catch((error) => {
                alert(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div>
            <ButtonMenu buttons={professorsMenuButtons} />
            <div className="container">
                <form className="submitForm" onSubmit={handleSubmit}>
                    <h2>Add Professor</h2>
                    <div>
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            maxLength={255}
                        />
                    </div>
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            maxLength={255}
                        />
                    </div>
                    <div>
                        <label>CC (Optional)</label>
                        <input
                            type="text"
                            name="cc"
                            value={formData.cc}
                            onChange={handleChange}
                            pattern="\d+"
                        />
                    </div>
                    <div>
                        <label>CC Expiry Date (Optional)</label>
                        <input
                            type="date"
                            name="cc_expire_date"
                            value={formData.cc_expire_date}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Mobile (Optional)</label>
                        <input
                            type="text"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            pattern="\d+"
                        />
                    </div>

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? <ClipLoader size={15} /> : "Add Professor"}
                    </button>
                </form>
                <div className="list">
                    <h2>Existing Professors</h2>
                    <table className="form-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="2">
                                        Loading professors...{" "}
                                        <ClipLoader size={15} />
                                    </td>
                                </tr>
                            ) : (
                                professors.map((professor) => (
                                    <tr key={professor.professor_id}>
                                        <td>{professor.name}</td>
                                        <td>{professor.email}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AddProfessor;
