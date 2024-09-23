import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const ButtonMenu = ({ buttons }) => {
    const { professor } = useAuth();
    return (
        <div className="button-container">
            {professor.is_coordinator === 1 &&
                buttons.map((button, index) => (
                    <Link key={index} to={button.link}>
                        <button className="panel-button">{button.name}</button>
                    </Link>
                ))}
        </div>
    );
};

export default ButtonMenu;
