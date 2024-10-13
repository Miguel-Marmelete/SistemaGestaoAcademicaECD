import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import endpoints from "../endpoints.js";
import ClipLoader from "react-spinners/ClipLoader";

function Login() {
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        fetch(endpoints.LOGIN, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then(async (response) => {
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message);
                }
                return response.json();
            })
            .then((data) => {
                if (data.token_data && data.professor) {
                    login(data.professor, data.token_data);
                    console.log(data.token_data);
                    setLoading(false);
                    alert("Login successful");
                    navigate("/");
                }
            })
            .catch((error) => {
                console.error("Login error:", error.message);
                alert(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="login_container">
            <form className="login_form" onSubmit={handleSubmit}>
                <h1 className="login_header">Login</h1>
                <br></br>
                <div className="email_container">
                    {" "}
                    <label htmlFor="email" className="email_label">
                        {" "}
                        Email
                    </label>
                    <input
                        type="text"
                        className="email_input"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="password_container">
                    <label htmlFor="password" className="password_label">
                        Password
                    </label>
                    <input
                        type="password"
                        className="password_input"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <div className="login_button_container">
                    <button
                        type="submit"
                        className="form_button"
                        disabled={loading}
                    >
                        {loading ? <ClipLoader size={15} /> : "Login"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Login;
