import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const ButtonMenu = ({ buttons }) => {
    const { professor } = useAuth();
    const [isCoordinator, setIsCoordinator] = useState(false);

    useEffect(() => {
        if (professor) {
            setIsCoordinator(professor.is_coordinator === 1);
        }
    }, [professor]);

    if (!isCoordinator) {
        return null;
    }

    return (
        <div className="button-container">
            {buttons.map((button, index) => (
                <Link key={index} to={button.link}>
                    <button className="panel-button">{button.name}</button>
                </Link>
            ))}
        </div>
    );
};

export default ButtonMenu;
