import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import endpoints from "../endpoints";
import customFetch from "../../scripts/customFetch";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [professor, setProfessor] = useState(null);
    const [accessTokenData, setAccessTokenData] = useState(null);
    const logoutTimerRef = useRef(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // Check if token is expired
    const isTokenExpired = (issuedAt, expiresIn) => {
        const expirationTime = new Date(issuedAt * 1000 + expiresIn * 1000);
        return new Date() > expirationTime;
    };

    // Clear existing timeout and set a new one
    const setLogoutTimer = (expirationTime) => {
        if (logoutTimerRef.current) {
            clearTimeout(logoutTimerRef.current);
        }
        const timeUntilExpiration = expirationTime - new Date();
        logoutTimerRef.current = setTimeout(
            () => handleLogout(),
            timeUntilExpiration - 60000
        ); // 1 minute before expiry
    };

    // Load authentication state from sessionStorage on initial render
    useEffect(() => {
        const tokenData = JSON.parse(sessionStorage.getItem("tokenData"));

        if (tokenData) {
            const { issued_at, expires_in } = tokenData;
            if (isTokenExpired(issued_at, expires_in)) {
                alert("Sessão Expirada, faça o Login novamente.");
                handleLogout(); // Log out if token is expired
            } else {
                setAccessTokenData(tokenData); // Initial token data
                getProfessor(); // Fetch professor data from server

                const expirationTime = new Date(
                    issued_at * 1000 + expires_in * 1000
                );
                setLogoutTimer(expirationTime);
            }
        }
        setLoading(false);
    }, []); // Only run this effect once, on component mount

    // Sync accessTokenData with sessionStorage whenever it changes
    useEffect(() => {
        if (accessTokenData) {
            sessionStorage.setItem(
                "tokenData",
                JSON.stringify(accessTokenData)
            );
            getProfessor(); // Fetch professor data from server

            const { issued_at, expires_in } = accessTokenData;
            const expirationTime = new Date(
                issued_at * 1000 + expires_in * 1000
            );
            setLogoutTimer(expirationTime);
        }
    }, [accessTokenData]);

    const getProfessor = () => {
        setLoading(true);
        customFetch(endpoints.ME, accessTokenData, setAccessTokenData)
            .then((data) => {
                console.log(data);
                setProfessor(data.professor);
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    const login = (professorData, tokenData) => {
        const issuedAt = Math.floor(Date.now() / 1000); // Current time in seconds
        const expiresIn = tokenData.expires_in; // Token expiration time in seconds

        // Calculate expiration timestamp
        const expirationTime = new Date(issuedAt * 1000 + expiresIn * 1000);

        setAccessTokenData({
            ...tokenData,
            issued_at: issuedAt, // Store issued time
            expires_in: expiresIn, // Store expiration duration
        });
        setProfessor(professorData);

        // Store token and professor data in sessionStorage
        sessionStorage.setItem(
            "tokenData",
            JSON.stringify({
                ...tokenData,
                issued_at: issuedAt, // Store issued time
                expires_in: expiresIn, // Store expiration duration
            })
        );

        // Set up the logout timer
        setLogoutTimer(expirationTime);
    };

    const handleLogout = async () => {
        try {
            // Make API request to invalidate the token
            if (accessTokenData) {
                await fetch(endpoints.LOGOUT, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessTokenData.access_token}`,
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

            // Clear the logout timer
            if (logoutTimerRef.current) {
                clearTimeout(logoutTimerRef.current);
                logoutTimerRef.current = null;
            }

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
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
