import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import endpoints from "../endpoints.js";
import ipbejaLogo from "../assets/ipbejaLogo.png";
import img1 from "../assets/WhatsApp_Image_2024-11-04_at_11.50.14-removebg-preview.png";
import img2 from "../assets/WhatsApp_Image_2024-11-04_at_11.50.18-removebg-preview.png";
import portugalIcon from "../assets/portugalIcon.png";
import { ClipLoader } from "react-spinners";
function Navbar() {
    const { accessTokenData, professor, logout, loading } = useAuth();

    const requestAdminAccess = () => {
        fetch(endpoints.REQUEST_ADMIN_ACCESS, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessTokenData.access_token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to request admin access");
                }
                return response.json();
            })
            .then((data) => {
                alert("Admin access requested successfully");
            })
            .catch((error) => {
                alert("Error: " + error.message);
            });
    };

    return (
        <div className="navbar">
            <div className="navbar-left">
                <img
                    src={ipbejaLogo}
                    className="logo"
                    style={{ width: "18%", height: "5%" }}
                />

                <h3>
                    <Link
                        to="/"
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        Escola de Ciberdefesa<br></br> Sistema de Gestão
                        Académica
                    </Link>
                </h3>
            </div>

            <div className="navbar-right">
                {loading ? (
                    <div>
                        Loading... <ClipLoader size={15} />
                    </div>
                ) : professor ? (
                    <div className="navbar-info">
                        <span>{professor.name}</span>
                        {professor.is_coordinator == 1 ? (
                            <Link
                                to="/adminPanel"
                                style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                }}
                            >
                                <button className="admin_panel_button">
                                    Painel de Administrador
                                </button>
                            </Link>
                        ) : (
                            <button
                                className="request_admin_button"
                                onClick={requestAdminAccess}
                            >
                                Pedir Admin
                            </button>
                        )}

                        <button className="logout_button" onClick={logout}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="auth-buttons">
                        <Link to={`/Login`}>
                            <button>Login</button>
                        </Link>
                        <Link to={`/SignUp`}>
                            <button>SignUp</button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navbar;
