import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext.jsx";

function Navbar() {
    const { professor, logout } = useAuth();

    return (
        <div className="navbar">
            <div className="navbar-left">
                <img src="logo1.png" alt="Logo 1" className="logo" />
                <img src="logo2.png" alt="Logo 2" className="logo" />
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
                {professor ? (
                    <div className="navbar-info">
                        <span>{professor.name}</span>
                        {professor.is_coordinator == 1 && (
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
