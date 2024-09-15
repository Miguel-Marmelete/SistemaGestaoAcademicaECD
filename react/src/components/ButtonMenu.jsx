import React from "react";
import { Link } from "react-router-dom";

const ButtonMenu = ({ buttons }) => {
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
