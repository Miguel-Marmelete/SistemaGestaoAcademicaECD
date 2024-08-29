import React, { useState } from "react";
import { Link } from "react-router-dom";

function AdminPanel() {
    const [currentPanel, setCurrentPanel] = useState(null);
    const [subButtons, setSubButtons] = useState([]);

    const panelButtons = [
        {
            label: "Cursos",
            subButtons: [
                { label: "Listar Cursos", link: "/courses" },
                { label: "Adicionar Curso", link: "/addCourse" },
                { label: "Editar Curso", link: "/cursos/manage" },
                { label: "Apagar Curso", link: "/cursos/manage" },
            ],
        },
        {
            label: "Alunos",
            subButtons: [
                { label: "Listar Alunos", link: "/students" },
                { label: "Adicionar Alunos", link: "/addStudents" },
                { label: "Editar Alunos", link: "/cursos/manage" },
                { label: "Apagar Alunos", link: "/cursos/manage" },
            ],
        },
        {
            label: "Aulas",
            subButtons: [
                { label: "Listar Aulas", link: "/cursos/create" },
                { label: "Adicionar Aulas", link: "/cursos/create" },
                { label: "Editar Aulas", link: "/cursos/manage" },
                { label: "Apagar Aulas", link: "/cursos/manage" },
            ],
        },
        {
            label: "Módulos",
            subButtons: [
                { label: "Listar Módulos", link: "/cursos/create" },
                { label: "Adicionar Módulos", link: "/addModule" },
                { label: "Editar Módulos", link: "/cursos/manage" },
                { label: "Apagar Módulos", link: "/cursos/manage" },
                { label: "Listar Submódulos", link: "/cursos/create" },
                { label: "Adicionar Submódulos", link: "/cursos/create" },
                { label: "Editar Submódulos", link: "/cursos/manage" },
                { label: "Apagar Submódulos", link: "/cursos/manage" },
                {
                    label: "Associar Módulos a Curso",
                    link: "/cursos/manage",
                },
            ],
        },

        {
            label: "Momentos de Avaliação",
            subButtons: [
                {
                    label: "Listar Momentos de Avaliação",
                    link: "/cursos/create",
                },
                {
                    label: "Adicionar Momentos de Avaliação",
                    link: "/cursos/create",
                },
                {
                    label: "Editar Momentos de Avaliação",
                    link: "/cursos/manage",
                },
                {
                    label: "Apagar Momentos de Avaliação",
                    link: "/cursos/manage",
                },
                {
                    label: "Avaliar Momentos de Avaliação",
                    link: "/cursos/manage",
                },
            ],
        },
        {
            label: "Notas",
            subButtons: [
                {
                    label: "Atribuir Notas",
                    link: "/cursos/create",
                },
                {
                    label: "Editar Notas",
                    link: "/cursos/manage",
                },
                {
                    label: "Apagar Notas",
                    link: "/cursos/manage",
                },
                {
                    label: "Calcular Notas",
                    link: "/cursos/manage",
                },
                {
                    label: "Pauta",
                    link: "/cursos/manage",
                },
            ],
        },
    ];

    const handleMainButtonClick = (button) => {
        setCurrentPanel(button.label);
        setSubButtons(button.subButtons);
    };

    const handleBackClick = () => {
        setCurrentPanel(null);
        setSubButtons([]);
    };

    return (
        <div className="panel-container">
            {currentPanel ? (
                <>
                    <h2>Painel de Administrador - {currentPanel}</h2>
                    <div className="button-container">
                        {subButtons.map((subButton, index) => (
                            <Link key={index} to={subButton.link}>
                                <button className="panel-button">
                                    {subButton.label}
                                </button>
                            </Link>
                        ))}
                    </div>
                    <button className="back-button" onClick={handleBackClick}>
                        Voltar
                    </button>
                </>
            ) : (
                <>
                    <h2>Painel de Administrador</h2>
                    <div className="button-container">
                        {panelButtons.map((button, index) => (
                            <button
                                key={index}
                                className="panel-button"
                                onClick={() => handleMainButtonClick(button)}
                            >
                                {button.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default AdminPanel;
