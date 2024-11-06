import React, { useState, useRef } from "react";
import img1 from "../../assets/WhatsApp_Image_2024-11-04_at_11.50.14-removebg-preview.png";
import img2 from "../../assets/WhatsApp_Image_2024-11-04_at_11.50.18-removebg-preview.png";
import img3 from "../../assets/emgfa.png";

const PrintGrades = () => {
    const [dadosPauta, setDadosPauta] = useState(null);
    const [notasAlunos, setNotasAlunos] = useState([]);
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

    const obterDescricao = (chave) => {
        const texto =
            "Global Final : Resultados Globais Finais; " +
            "Teste: Resultados do Teste Global; " +
            "Exame: Resultados do Exame Global";
        const pares = texto.split(";");

        for (let par of pares) {
            const [chaveAtual, descricao] = par.split(":").map((s) => s.trim());
            if (chaveAtual === chave) {
                return descricao;
            }
        }
        return "Descrição não encontrada";
    };

    const formatarDataAtual = () => {
        const dataAtual = new Date();
        const formatador = new Intl.DateTimeFormat("pt-BR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
        return formatador.format(dataAtual);
    };

    const processCSVData = (csvData) => {
        const rows = csvData.split("\n").map((row) => row.split(","));
        const pautaData = {
            curso: rows[1][0],
            modulo: rows[1][1],
            dataCurso: rows[1][2],
            tipoPauta: rows[1][3],
            descricaoPauta: obterDescricao(rows[1][3]),
            dataLançamento: formatarDataAtual(),
        };

        const parsedNotasAlunos = rows.slice(4).map((row) => ({
            numero: row[0],
            nome: row[1],
            t1: row[2],
            t2: row[3],
            t3: row[4],
            t4: row[5],
            t5: row[6],
            t6: row[7],
            mediaTrab: row[8],
            notaTeste: row[9],
            notaFinal: row[10],
            notaExameRec: row[11],
        }));

        setDadosPauta(pautaData);
        setNotasAlunos(parsedNotasAlunos);
    };

    const handlePrint = () => {
        const printContents = printRef.current.innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
    };

    return (
        <div className="pauta-container">
            {!dadosPauta && (
                <div>
                    <button onClick={() => fileInputRef.current.click()}>
                        Importar CSV
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleCSVUpload}
                        accept=".csv"
                    />
                </div>
            )}

            {dadosPauta && (
                <>
                    <div ref={printRef}>
                        <div className="page">
                            <div className="image-container">
                                <img
                                    src={img3}
                                    className="logo"
                                    style={{ width: "65px", height: "15%" }}
                                />
                                <img
                                    src={img1}
                                    className="logo"
                                    style={{ width: "90px", height: "15%" }}
                                />
                                <img
                                    src={img2}
                                    className="logo"
                                    style={{
                                        width: "63px",
                                        height: "15%",
                                    }}
                                />
                                <h1 style={{ marginLeft: "20px" }}>
                                    Escola de Ciberdefesa
                                </h1>{" "}
                            </div>
                            <h2>Dados de Pauta</h2>
                            <div className="dados-pauta">
                                <p>
                                    <strong>Curso:</strong> {dadosPauta.curso}
                                </p>
                                <p>
                                    <strong>Módulo:</strong> {dadosPauta.modulo}
                                </p>
                                <p>
                                    <strong>Data do Curso:</strong>{" "}
                                    {dadosPauta.dataCurso}
                                </p>
                                <p>
                                    <strong>Tipo de Pauta:</strong>{" "}
                                    {dadosPauta.tipoPauta}
                                </p>
                                <p>
                                    <strong>Descrição da Pauta:</strong>{" "}
                                    {dadosPauta.descricaoPauta}
                                </p>
                                <p>
                                    <strong>Data de Lançamento:</strong>{" "}
                                    {dadosPauta.dataLançamento}
                                </p>
                            </div>
                            <h2>Listagem de Alunos</h2>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <table className="tabela-alunos">
                                    <thead>
                                        <tr>
                                            <th>Número</th>
                                            <th>Nome</th>
                                            <th>T1</th>
                                            <th>T2</th>
                                            <th>T3</th>
                                            <th>T4</th>
                                            <th>T5</th>
                                            <th>T6</th>
                                            <th>MT</th>
                                            <th>T</th>
                                            <th>EN</th>
                                            <th>E</th>
                                            <th>ER</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {notasAlunos
                                            .filter(
                                                (aluno) => aluno && aluno.nome
                                            )
                                            .map((aluno, index) => (
                                                <tr key={index}>
                                                    <td>{aluno.numero}</td>
                                                    <td>{aluno.nome}</td>
                                                    <td>
                                                        {parseFloat(
                                                            aluno.t1
                                                        ).toFixed(2)}
                                                    </td>
                                                    <td>
                                                        {parseFloat(
                                                            aluno.t2
                                                        ).toFixed(2)}
                                                    </td>
                                                    <td>
                                                        {parseFloat(
                                                            aluno.t3
                                                        ).toFixed(2)}
                                                    </td>
                                                    <td>
                                                        {parseFloat(
                                                            aluno.t4
                                                        ).toFixed(2)}
                                                    </td>
                                                    <td>
                                                        {parseFloat(
                                                            aluno.t5
                                                        ).toFixed(2)}
                                                    </td>
                                                    <td>
                                                        {parseFloat(
                                                            aluno.t6
                                                        ).toFixed(2)}
                                                    </td>
                                                    <td>
                                                        {parseFloat(
                                                            aluno.mediaTrab
                                                        ).toFixed(2)}
                                                    </td>
                                                    <td>
                                                        {parseFloat(
                                                            aluno.notaTeste
                                                        ).toFixed(2)}
                                                    </td>
                                                    <td>{aluno.notaFinal}</td>
                                                    <td>
                                                        {aluno.notaExameRec}
                                                    </td>
                                                    <td>
                                                        {aluno.notaExameRec ===
                                                        "\r"
                                                            ? ""
                                                            : Math.round(
                                                                  aluno.notaExameRec
                                                              )}
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <p className="small-text">
                                    <strong>Legenda:</strong> Tx = Trabalho; MT:
                                    Média dos Trabalhos; T: Teste; EN: Nota
                                    Final de Avaliação por Época Normal; ER:
                                    Nota Final de Avaliação por Época de
                                    Recurso; E: Exame de Recurso;
                                </p>
                            </div>
                            <div className="signature-container">
                                <div className="signature-left">
                                    <hr className="signature-line" />
                                    <p className="signature-text">
                                        Diretor da Escola de Ciberdefesa
                                    </p>
                                </div>
                                <div className="signature-right">
                                    <hr className="signature-line" />
                                    <p className="signature-text">
                                        Coordenador da prestação de Serviços do
                                        IPBeja
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button onClick={handlePrint}>Imprimir</button>
                </>
            )}
        </div>
    );
};

export default PrintGrades;
