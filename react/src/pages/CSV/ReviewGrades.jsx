import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

function ReviewGrades() {
    const location = useLocation();
    const { grades } = location.state || { grades: {} }; // Ensure grades is an object
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <div className="pauta-container" ref={componentRef}>
            <h1>Listagem de Pauta</h1>
            <div className="dados-pauta">
                <p>
                    <strong>DOCENTE:</strong> {grades.docente}
                </p>
                <p>
                    <strong>ANO:</strong> {grades.ano} - {grades.semestre}
                </p>
                <p>
                    <strong>DISCIPLINA:</strong> {grades.disciplina}
                </p>
                <p>
                    <strong>TURMA:</strong> {grades.turma}
                </p>
                <p>
                    <strong>SITUAÇÃO:</strong> {grades.situacao}
                </p>
                <p>
                    <strong>ÉPOCA:</strong> {grades.epoca}
                </p>
            </div>
            <table className="tabela-alunos">
                <thead>
                    <tr>
                        <th>Curso</th>
                        <th>Aluno</th>
                        <th>Nome</th>
                        <th>Data</th>
                        <th>Nota</th>
                        <th>Status</th>
                        <th>Época</th>
                        <th>Tipo de Aluno</th>
                    </tr>
                </thead>
                <tbody>
                    {grades.alunos &&
                        grades.alunos.map((aluno, index) => (
                            <tr key={index}>
                                <td>{aluno.curso}</td>
                                <td>{aluno.alunoId}</td>
                                <td>{aluno.nome}</td>
                                <td>{aluno.data}</td>
                                <td>{aluno.nota}</td>
                                <td>{aluno.status}</td>
                                <td>{aluno.epoca}</td>
                                <td>{aluno.tipo}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
            <button onClick={handlePrint}>Print</button>
        </div>
    );
}

export default ReviewGrades;
