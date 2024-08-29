import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SIGNUP_ENDPOINT = "http://localhost:8000/api/signup";

function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validação de senha
        const { password, password_confirmation } = formData;

        if (password.length < 10) {
            alert("Password must be at least 10 characters long.");
            return;
        }
        if (!/[A-Z]/.test(password)) {
            alert("Password must contain at least one uppercase letter.");
            return;
        }
        if (!/[a-z]/.test(password)) {
            alert("Password must contain at least one lowercase letter.");
            return;
        }
        if (!/[0-9]/.test(password)) {
            alert("Password must contain at least one digit.");
            return;
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            alert("Password must contain at least one special character.");
            return;
        }
        if (password !== password_confirmation) {
            alert("Passwords do not match.");
            return;
        }

        // Envio de dados para o backend
        fetch(SIGNUP_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw await response.json();
                }
                return response.json();
            })
            .then((data) => {
                console.log("Backend response:", data);
                alert(data.message);
                navigate("/Login");
            })
            .catch((error) => {
                console.error(error.message);
                alert(error.message);
            });
    };

    return (
        <div className="signup_container">
            <form className="signup_form" onSubmit={handleSubmit}>
                <h1 className="signup_header">SignUp</h1>
                <br />
                <div className="name_container">
                    <label htmlFor="name" className="name_label">
                        Name
                    </label>
                    <br />
                    <input
                        type="text"
                        className="name_input"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="email_container">
                    <label htmlFor="email" className="email_label">
                        Email
                    </label>
                    <br />
                    <input
                        type="email"
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
                    <br />
                    <input
                        type="password"
                        className="password_input"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <div className="password_confirmation_container">
                    <label
                        htmlFor="password_confirmation"
                        className="password_confirmation_label"
                    >
                        Confirm Password
                    </label>
                    <br />
                    <input
                        type="password"
                        className="password_confirmation_input"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                    />
                </div>

                <div className="signup_button_container">
                    <button type="submit" className="form_button">
                        SignUp
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SignUp;
