import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import endpoints from "../endpoints";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [professor, setProfessor] = useState(null);
    const [accessTokenData, setAccessTokenData] = useState(null);
    const navigate = useNavigate();

    // Check if token is expired
    const isTokenExpired = (issuedAt, expiresIn) => {
        const expirationTime = new Date(issuedAt * 1000 + expiresIn * 1000);
        return new Date() > expirationTime;
    };

    // Load authentication state from sessionStorage on initial render
    useEffect(() => {
        const tokenData = JSON.parse(sessionStorage.getItem("tokenData"));
        const professorData = JSON.parse(
            sessionStorage.getItem("professorData")
        );

        if (tokenData && professorData) {
            const { issued_at, expires_in } = tokenData;
            console.log("issued at", issued_at);
            console.log("expires in", issued_at);
            if (isTokenExpired(issued_at, expires_in)) {
                alert("Sessão Expirada, faça o Login novamente.");
                handleLogout(); // Log out if token is expired
            } else {
                setAccessTokenData(tokenData);
                setProfessor(professorData);

                // Calculate the remaining time until the token expires
                const expirationTime = new Date(
                    issued_at * 1000 + expires_in * 1000
                );
                const timeUntilExpiration = expirationTime - new Date();

                // Set up the logout timer to log out just before token expires
                setTimeout(() => handleLogout(), timeUntilExpiration - 60000); // 1 minute before expiry
            }
        }
    }, []);

    const login = (professorData, tokenData) => {
        const issuedAt = Math.floor(Date.now() / 1000); // Current time in seconds
        const expiresIn = tokenData.expires_in; // Token expiration time in seconds

        // Calculate expiration timestamp
        const expirationTime = new Date(issuedAt * 1000 + expiresIn * 1000);

        setProfessor(professorData);
        console.log("professorData", professorData);
        setAccessTokenData({
            ...tokenData,
            issued_at: issuedAt, // Store issued time
            expires_in: expiresIn, // Store expiration duration
        });

        // Store token and professor data in sessionStorage
        sessionStorage.setItem(
            "tokenData",
            JSON.stringify({
                ...tokenData,
                issued_at: issuedAt, // Store issued time
                expires_in: expiresIn, // Store expiration duration
            })
        );
        sessionStorage.setItem("professorData", JSON.stringify(professorData));

        // Set up the logout timer to log out just before token expires
        const timeUntilExpiration = expirationTime - new Date();
        setTimeout(() => handleLogout(), timeUntilExpiration - 300000); // 1 minute before expiry
    };

    const handleLogout = async () => {
        try {
            // Make API request to invalidate the token
            if (accessTokenData) {
                await fetch(endpoints.LOGOUT, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessTokenData.access_token}`, // Adjust according to your token format
                    },
                });
            }
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            // Clear session storage and state
            setProfessor(null);
            setAccessTokenData(null);
            sessionStorage.removeItem("tokenData");
            sessionStorage.removeItem("professorData");

            // Redirect to Login page
            navigate("/login");
        }
    };

    const logout = () => handleLogout();

    return (
        <AuthContext.Provider
            value={{
                professor,
                accessTokenData,
                setAccessTokenData,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
