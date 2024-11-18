import React, { useState } from "react";
import Papa from "papaparse";
import emgfaPreto from "../../assets/emgfaPretoBranco.png";
import ccice from "../../assets/CCICE.png";
import cociber from "../../assets/COCIBER.png";
import ubinet from "../../assets/ubinet.jpg";
import ipbeja from "../../assets/ipbejaLogo.png";
import emgfaComTexto from "../../assets/emgfaComTexto.png";
const PrintCertificate2 = () => {
    const [dadosCSV, setDadosCSV] = useState([]);

    // Função para processar o arquivo CSV
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
                setDadosCSV(result.data); // Armazena os dados do CSV no estado
            },
        });
    };

    const handlePrint = () => {
        window.print();
    };

    const printStyles = `
        @media print {
            .diploma {
                background-image: url(${emgfaPreto});
                background-size: contain;
                background-position: center 20px;
                background-repeat: no-repeat;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                border: 3px solid #FFD700 !important;
                padding: 10px;
            }
            .diploma-inner {
                border: 2px solid #FFD700;
                padding: 20px;
            }
            .diploma-title {
                color: #808080 !important;
            }
        }
    `;

    return (
        <div style={{ fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ textAlign: "center" }}>Gerar Certificados</h1>
            <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                style={{
                    marginBottom: "20px",
                    display: "block",
                    margin: "0 auto",
                }}
            />
            <style>{printStyles}</style>
            {dadosCSV.map((dados, index) => (
                <div
                    key={index}
                    className="diploma"
                    style={{
                        fontFamily: "Arial, sans-serif",
                        width: "900px",
                        margin: "20px auto",
                        padding: "10px",
                        textAlign: "center",
                        lineHeight: "1.6",
                        position: "relative",
                        backgroundImage: `url(${emgfaPreto})`,
                        backgroundSize: "contain",
                        backgroundPosition: "center 90px",
                        backgroundRepeat: "no-repeat",
                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                    }}
                >
                    <div className="diploma-inner">
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginTop: "-10px",
                            }}
                        >
                            <img
                                src={emgfaComTexto}
                                alt="Logo"
                                style={{ width: "155px", height: "auto" }}
                            />
                            <div
                                style={{
                                    width: "60%",
                                    textAlign: "center",
                                }}
                            >
                                <h3 className="diploma-title">
                                    ESTADO-MAIOR-GERAL DAS FORÇAS ARMADAS
                                </h3>
                                <h4 style={{ marginTop: "-10px" }}>
                                    Centro de Comunicações e Informação,
                                    Ciberespaço e Espaço
                                </h4>
                                <h4 style={{ marginTop: "-10px" }}>
                                    Comando de Operações de Ciberdefesa
                                </h4>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    paddingTop: "80px",
                                    flexShrink: "0",
                                }}
                            >
                                <img
                                    src={ccice}
                                    alt="Logo"
                                    style={{ width: "70px", height: "50px" }}
                                />
                                <img
                                    src={cociber}
                                    alt="Logo"
                                    style={{
                                        width: "46px",
                                        height: "45px",
                                        marginTop: "3px",
                                    }}
                                />
                            </div>
                        </div>

                        <h2 style={{ marginTop: "-10px" }}>
                            ESCOLA DE CIBERDEFESA
                        </h2>
                        <h3>CERTIFICADO</h3>
                        <p>
                            <b>{dados.nome_curso}</b>
                        </p>
                        <p style={{ textAlign: "justify" }}>
                            Certifica-se que <b>{dados.nome}</b>, portador do
                            Cartão de Cidadão n.º <b>{dados.numero_cartao}</b>,
                            concluiu o Curso de <b>{dados.nome_curso}</b>, a{" "}
                            <b>
                                {dados.dia} de {dados.mes} de {dados.ano}
                            </b>
                            , com média final de <b>{dados.media}</b> valores,
                            num total de <b>{dados.horas_letivas}</b> horas
                            letivas e <b>{dados.horas_estagio}</b> horas de
                            Estágio.
                        </p>
                        <p style={{ textAlign: "right" }}>
                            Lisboa, {dados.dia} de {dados.mes} de {dados.ano}
                        </p>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-around",
                                marginTop: "50px",
                            }}
                        >
                            <div style={{ textAlign: "center" }}>
                                <div style={{ marginBottom: "20px" }}>
                                    Diretor da Escola de Ciberdefesa
                                </div>
                                <div>_______________________________</div>
                                <div>
                                    Vasco Miguel Ramos Marques Prates
                                    <br />
                                    Capitão-de-mar-e-guerra
                                </div>
                            </div>
                            <div
                                style={{
                                    textAlign: "center",
                                    position: "relative",
                                }}
                            >
                                <div style={{ marginBottom: "20px" }}>
                                    Coordenador da Equipa de Professores do
                                    IPBeja
                                </div>
                                <div>_______________________________</div>
                                <div>
                                    Rui Miguel Soares Silva
                                    <br />
                                    Professor Coordenador
                                </div>
                            </div>
                        </div>
                        <div
                            className="diploma-number"
                            style={{
                                padding: "2px",
                                position: "absolute",
                                bottom: "10px",
                                left: "10px",
                                fontSize: "0.875rem",
                                color: "#333",
                            }}
                        >
                            Número Diploma: <b>{dados.numero_certificado}</b>
                        </div>
                        <button
                            onClick={handlePrint}
                            className="print-button"
                            style={{ marginTop: "20px" }}
                        >
                            Imprimir Diploma
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PrintCertificate2;
