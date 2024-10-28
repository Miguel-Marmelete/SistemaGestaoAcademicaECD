import React, { useState, useRef } from "react";
import ipbejaLogo from "../../assets/ipbejaLogo.png";

const PrintGrades = () => {
    const [dadosDocente, setDadosDocente] = useState(null);
    const [alunos, setAlunos] = useState([]);
    const fileInputRef = useRef(null);
    const printRef = useRef(null);

    const handleCSVUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const csvData = event.target.result;
                processCSVData(csvData);
            };
            reader.readAsText(file);
        }
    };

    const processCSVData = (csvData) => {
        const rows = csvData.split("\n").map((row) => row.split(","));

        const docenteData = {
            docente: rows[1][0],
            ano: rows[1][1],
            semestre: rows[1][2],
            disciplina: rows[1][3],
            turma: rows[1][4],
            situacao: rows[1][5],
            epoca: rows[1][6],
        };

        const parsedAlunos = rows.slice(4).map((row) => ({
            curso: row[0],
            alunoId: row[1],
            nome: row[2],
            data: row[3],
            nota: row[4],
            status: row[5],
            epoca: row[6],
            tipo: row[7],
        }));

        setDadosDocente(docenteData);
        setAlunos(parsedAlunos);
    };

    const handleImportClick = () => {
        fileInputRef.current.click();
    };

    const handlePrint = () => {
        const printContents = printRef.current.innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // reload to restore the original state
    };

    return (
        <div className="pauta-container">
            {!dadosDocente && (
                <div>
                    <button onClick={handleImportClick}>Importar CSV</button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleCSVUpload}
                        accept=".csv"
                    />
                </div>
            )}

            {dadosDocente && (
                <>
                    <div ref={printRef}>
                        <img
                            src={ipbejaLogo}
                            className="logo"
                            style={{ width: "20%", height: "15%" }}
                        />
                        <h2>Dados de Pauta</h2>
                        <div className="dados-pauta">
                            <p>
                                <strong>DOCENTE:</strong> {dadosDocente.docente}
                            </p>
                            <p>
                                <strong>ANO:</strong> {dadosDocente.ano} -{" "}
                                {dadosDocente.semestre}
                            </p>
                            <p>
                                <strong>DISCIPLINA:</strong>{" "}
                                {dadosDocente.disciplina}
                            </p>
                            <p>
                                <strong>TURMA:</strong> {dadosDocente.turma}
                            </p>
                            <p>
                                <strong>SITUAÇÃO:</strong>{" "}
                                {dadosDocente.situacao}
                            </p>
                            <p>
                                <strong>ÉPOCA:</strong> {dadosDocente.epoca}
                            </p>
                        </div>
                        <h2>Listagem de Alunos</h2>

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
                                {alunos.map((aluno, index) => (
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
                    </div>

                    <button onClick={handlePrint}>Imprimir</button>
                </>
            )}
        </div>
    );
};

export default PrintGrades;
