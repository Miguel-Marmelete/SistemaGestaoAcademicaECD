import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";

function MenuBar() {
    const [hovered, setHovered] = useState(null);
    const { professor } = useAuth();

    const handleMouseEnter = (index) => {
        setHovered(index);
    };

    const handleMouseLeave = () => {
        setHovered(null);
    };

    const menuItems = [
        { name: "Alunos", subItems: ["Lista de Alunos"] },
        { name: "Cursos", subItems: ["Lista de Cursos", "Lista de Módulos"] },
        { name: "Aulas", subItems: ["Lista de Aulas", "Adicionar Aulas"] },
        {
            name: "Avaliações",
            subItems: [
                "Momentos de Avaliação",
                "Avaliar Momentos de Avaliação",
                "Pauta",
            ],
        },
        { name: "Diplomas", subItems: ["Criar Diploma"] },
    ];

    return professor ? (
        <div className="menu-bar">
            {menuItems.map((item, index) => (
                <div
                    key={index}
                    className="menu-item-container"
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="menu-item">{item.name}</div>
                    {hovered === index && item.subItems.length > 0 && (
                        <div className="dropdown">
                            {item.subItems.map((subItem, subIndex) => (
                                <div key={subIndex} className="dropdown-item">
                                    {subItem}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    ) : null;
}

export default MenuBar;
