import React, { useState } from "react";
import { Link } from "react-router-dom";
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
        {
            name: "Alunos",
            subItems: [{ name: "Lista de Alunos", path: "/students" }],
        },
        {
            name: "Cursos",
            subItems: [
                { name: "Lista de Cursos", path: "/courses" },
                { name: "Lista de Módulos", path: "/modules" },
                { name: "Lista de Submódulos", path: "/submodules" },
            ],
        },
        {
            name: "Aulas",
            subItems: [
                { name: "Lista de Aulas", path: "/lessons" },
                { name: "Adicionar Aulas", path: "/addLesson" },
            ],
        },
        {
            name: "Avaliações",
            subItems: [
                { name: "Momentos de Avaliação", path: "/evaluationMoments" },
                {
                    name: "Avaliar Momentos de Avaliação",
                    path: "/avaliacoes/avaliar",
                },
                { name: "Pauta", path: "/avaliacoes/pauta" },
            ],
        },
        {
            name: "Diplomas",
            subItems: [{ name: "Criar Diploma", path: "/diplomas/criar" }],
        },
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
                                <Link
                                    key={subIndex}
                                    to={subItem.path}
                                    className="dropdown-item" // Added class here
                                >
                                    {subItem.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    ) : null;
}

export default MenuBar;
