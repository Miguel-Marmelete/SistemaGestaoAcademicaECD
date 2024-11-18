import React, { useState, useRef } from "react";
import ccice from "../../assets/CCICE.png";
import cociber from "../../assets/COCIBER.png";
import emgfa from "../../assets/emgfa.png";

const PrintGrades = () => {
    const [dadosPauta, setDadosPauta] = useState(null);
    const [notasAlunos, setNotasAlunos] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
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

    const generateLegenda = (headers) => {
        const legendaMap = {
            T1: "Trabalho",
            MT: "Média dos Trabalhos",
            T: "Teste",
            EN: "Nota Final de Avaliação por Época Normal",
            ER: "Nota Final de Avaliação por Época de Recurso",
            E: "Exame de Recurso",
            IAM: "Identificação e análise de malware",
            AASO: "Análise avançada em Sistemas Operativos",
            AC: "Ataque à cifra",
            IADF: "Investigações Avançadas em Digital Forense",
            TAED: "Técnicas avançadas de extração de dados",
            Web: "Ataques na Web",
            Apli: "Ataques a Aplicações",
            WiFi: "Ataques a Redes WiFi",
            MkT: "Segurança Ofensiva com Tecnologia MikroTik",
            CliOff: "Ataques do Lado do Cliente e Ofuscação de Comunicações",
            LinComBoF:
                "Operações Avançadas em Linha de Comandos e Ataques de Buffer Overflow",
        };

        return headers
            .map((header) => {
                const trimmedHeader = header.trim();
                if (trimmedHeader === "T1") {
                    return `Tx: ${legendaMap[trimmedHeader]}`;
                }
                return legendaMap[trimmedHeader]
                    ? `${trimmedHeader}: ${legendaMap[trimmedHeader]}`
                    : null;
            })
            .filter(Boolean)
            .join("; ");
    };

    const processCSVData = (csvData) => {
        const rows = csvData.split("\n").map((row) => row.split(","));
        const headers = rows[3].map((header) => header.trim());
        setTableHeaders(headers);

        const pautaData = {
            curso: rows[1][0],
            modulo: rows[1][1],
            dataCurso: rows[1][2],
            tipoPauta: rows[1][3],
            descricaoPauta: obterDescricao(rows[1][3]),
            dataLançamento: formatarDataAtual(),
        };

        const parsedNotasAlunos = rows
            .slice(4)
            .filter((row) => row.some((cell) => cell.trim() !== ""))
            .map((row) => {
                const alunoData = {};
                headers.forEach((header, index) => {
                    const key = header.toLowerCase().replace(/\s+/g, "");
                    alunoData[key] = row[index] ? row[index].trim() : "";
                });
                console.log(alunoData);
                return alunoData;
            });

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
                                    src={emgfa}
                                    className="logo"
                                    style={{ width: "65px", height: "15%" }}
                                />
                                <img
                                    src={ccice}
                                    className="logo"
                                    style={{ width: "90px", height: "15%" }}
                                />
                                <img
                                    src={cociber}
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
                                            {tableHeaders.map(
                                                (header, index) => (
                                                    <th key={index}>
                                                        {header}
                                                    </th>
                                                )
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {notasAlunos.map((aluno, index) => (
                                            <tr key={index}>
                                                {tableHeaders.map(
                                                    (header, i) => {
                                                        const key = header
                                                            .toLowerCase()
                                                            .replace(
                                                                /\s+/g,
                                                                ""
                                                            );
                                                        let value = aluno[key];

                                                        if (
                                                            header ===
                                                                "Número" &&
                                                            value !==
                                                                undefined &&
                                                            value !== ""
                                                        ) {
                                                            value = parseInt(
                                                                value,
                                                                10
                                                            );
                                                        } else if (
                                                            header === "EN" &&
                                                            value !==
                                                                undefined &&
                                                            value !== "" &&
                                                            !isNaN(value)
                                                        ) {
                                                            value = Math.round(
                                                                parseFloat(
                                                                    value
                                                                )
                                                            );
                                                        } else if (
                                                            header === "ER"
                                                        ) {
                                                            const eValue =
                                                                aluno["e"];
                                                            if (
                                                                eValue !==
                                                                    undefined &&
                                                                eValue !== "" &&
                                                                eValue !==
                                                                    "\r" &&
                                                                eValue !==
                                                                    null &&
                                                                !isNaN(eValue)
                                                            ) {
                                                                value =
                                                                    Math.round(
                                                                        parseFloat(
                                                                            eValue
                                                                        )
                                                                    );
                                                            } else {
                                                                value = "";
                                                            }
                                                        } else if (
                                                            value !==
                                                                undefined &&
                                                            value !== "" &&
                                                            !isNaN(value)
                                                        ) {
                                                            value =
                                                                parseFloat(
                                                                    value
                                                                ).toFixed(1);
                                                        } else {
                                                            value = value
                                                                ? value.trim()
                                                                : "";
                                                        }

                                                        return (
                                                            <td key={i}>
                                                                {value}
                                                            </td>
                                                        );
                                                    }
                                                )}
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
                                <p className="small-text legenda">
                                    <strong>Legenda:</strong>{" "}
                                    {generateLegenda(tableHeaders)}
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
