import React, { useState } from "react";
import ButtonMenu from "../components/ButtonMenu";
import {
    studentsMenuButtons,
    coursesMenuButtons,
    lessonsMenuButtons,
    modulesMenuButtons,
    evaluationMomentsMenuButtons,
    gradesMenuButtons,
    professorsMenuButtons,
    printMenu,
} from "../../scripts/buttonsData";

function AdminPanel() {
    const [currentPanel, setCurrentPanel] = useState(null);
    const [subButtons, setSubButtons] = useState([]);

    const panelButtons = [
        {
            label: "Cursos",
            subButtons: coursesMenuButtons,
        },
        {
            label: "Módulos",
            subButtons: modulesMenuButtons,
        },
        {
            label: "Alunos",
            subButtons: studentsMenuButtons,
        },
        {
            label: "Aulas",
            subButtons: lessonsMenuButtons,
        },

        {
            label: "Momentos de Avaliação",
            subButtons: evaluationMomentsMenuButtons,
        },
        {
            label: "Notas",
            subButtons: gradesMenuButtons,
        },
        {
            label: "Professores",
            subButtons: professorsMenuButtons,
        },
        {
            label: "Imprimir",
            subButtons: printMenu,
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
                    <h2>Painel de Coordenador - {currentPanel}</h2>
                    <ButtonMenu buttons={subButtons} />
                    <button className="back-button" onClick={handleBackClick}>
                        Voltar
                    </button>
                </>
            ) : (
                <>
                    <h2>Painel de Coordenador</h2>
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
