import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

const PrivateRoute = ({ children }) => {
    const { professor, loading, accessTokenData } = useAuth(); // Assume loading is managed in the AuthContext
    const [isAuthenticating, setIsAuthenticating] = useState(true);

    useEffect(() => {
        // Assume we have a function to check the authentication state
        const checkAuthState = async () => {
            await professor; // or any async call to check auth state
            setIsAuthenticating(false);
        };

        checkAuthState();
    }, [professor]);

    if (isAuthenticating || loading) {
        return <div>Loading...</div>;
    }

    if (!professor && !loading && !accessTokenData) {
        alert("Não autenticado. Redirecionando para a página de login.");
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute;
