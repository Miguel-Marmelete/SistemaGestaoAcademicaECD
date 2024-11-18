import React, { useState } from "react";
import Papa from "papaparse";
import emgfaPreto from "../../assets/emgfaPretoBranco.png";
import ccice from "../../assets/CCICE.png";
import cociber from "../../assets/COCIBER.png";
import ubinet from "../../assets/ubinet.jpg";
import ipbeja from "../../assets/ipbejaLogo.png";
import emgfaComTexto from "../../assets/emgfaComTexto2.png";
const PrintCertificate3 = () => {
    const [certificate, setCertificate] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) {
            console.error("No file selected");
            return;
        }
        Papa.parse(file, {
            complete: (results) => {
                const data = results.data;
                if (data.length > 6) {
                    const directorName = data[0][0];
                    const directorRank = data[1][0];
                    const courseName = data[2][0];
                    const studentName = data[3][0];
                    const day = data[4][0];
                    const month = data[4][1];
                    const year = data[4][2];
                    const ccNumber = data[5][0];
                    const finalGrade = data[6][0];
                    const certificateNumber = data[7][0];
                    const modules = data
                        .slice(8)
                        .filter((row) => row[0] && row[1] && row[2] && row[3])
                        .map((row) => ({
                            name: row[0],
                            contactHours: row[1],
                            ects: row[2],
                            finalGrade: row[3],
                        }));

                    setCertificate({
                        directorName,
                        directorRank,
                        courseName,
                        name: studentName,
                        birthday: `${day.trim()} de ${month.trim()} de ${year.trim()}`,
                        ccNumber,
                        modules,
                        day: day.trim(),
                        month: month.trim(),
                        year: year.trim(),
                        certificateNumber,
                        finalGrade,
                    });
                } else {
                    console.error("Insufficient data in the file");
                }
            },
            error: (error) => {
                console.error("Error parsing file:", error);
            },
            encoding: "UTF-8",
        });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div>
            <style>
                {`
                    .certificate {
                        border: 0.2px solid #000;
                        padding: 20px;
                        margin: 20px;
                        width: 80%;
                        max-width: 800px;
                        margin: auto;
                        font-family: 'Times New Roman', Times, serif;
                        position: relative;
                    }

                    .certificate h1 {
                        text-align: center;
                        font-size: 24px;
                        margin-bottom: 20px;
                    }

                    .certificate p {
                        font-size: 16px;
                        line-height: 1.5;
                        margin: 10px 0;
                        word-wrap: break-word;
                    }

                    .signatures {
                        display: flex;
                        justify-content: space-between;
                        margin-top: 40px;
                    }

                    .signatures div {
                        text-align: center;
                    }

                    .signatures p {
                        margin: 5px 0;
                    }

                    input[type="file"] {
                        display: block;
                        margin: 20px auto;
                    }

                    .header-images {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        margin-bottom: 20px;
                    }

                    

                    .right-images {
                        display: flex;
                        gap: 10px;
                        flex: 1;
                        justify-content: flex-end;
                    }

                    img {
                        max-height: 100px;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }

                    th, td {
                        border: 1px solid #000;
                        padding: 8px;
                        text-align: left;
                    }

                    th {
                        background-color: #f2f2f2;
                    }

                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        .certificate, .certificate * {
                            visibility: visible;
                        }
                        .certificate {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                        }
                    }
                `}
            </style>
            <input type="file" accept=".csv" onChange={handleFileChange} />
            {certificate && (
                <div>
                    <button onClick={handlePrint}>Imprimir Certificado</button>
                    <div className="certificate">
                        <div className="header-images">
                            <div className="left-image">
                                <img
                                    src={emgfaComTexto}
                                    style={{ width: "150px" }}
                                />
                            </div>
                            <div className="right-images">
                                <img
                                    src={ccice}
                                    style={{
                                        width: "70px",
                                        height: "50px",
                                        paddingTop: "10px",
                                    }}
                                />
                                <img
                                    src={cociber}
                                    style={{
                                        width: "46px",
                                        height: "45px",
                                        paddingTop: "13px",
                                    }}
                                />{" "}
                            </div>
                        </div>
                        <h1>CERTIDÃO</h1>
                        <p>
                            O Diretor da Escola de Ciberdefesa, Capitão de Mar e
                            Guerra, {certificate.directorName} e o Coordenador
                            da Equipa de Professores do Instituto Politécnico de
                            Beja que ministrou as aulas, Professor Coordenador
                            Rui Miguel Soares Silva, certificam que{" "}
                            {certificate.name}, nascido(a) a{" "}
                            {certificate.birthday}, portador do Cartão de
                            Cidadão n.º {certificate.ccNumber}, concluiu o{" "}
                            {certificate.courseName} na Escola de Ciberdefesa,
                            tendo obtido aproveitamento nos seguintes módulos de
                            formação:
                        </p>
                        <table>
                            <thead>
                                <tr>
                                    <th>Nome do Módulo</th>
                                    <th>Horas de Contacto</th>
                                    <th>ECTS</th>
                                    <th>Nota Final</th>
                                </tr>
                            </thead>
                            <tbody>
                                {certificate.modules.map((module, index) => (
                                    <tr key={index}>
                                        <td>{module.name}</td>
                                        <td>{module.contactHours}</td>
                                        <td>{module.ects}</td>
                                        <td>{module.finalGrade}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p>
                            A média final de curso foi {certificate.finalGrade}{" "}
                            valores.
                        </p>
                        <p style={{ textAlign: "right" }}>
                            Lisboa, {certificate.day} de {certificate.month} de{" "}
                            {certificate.year}
                        </p>
                        <div className="signatures">
                            <div>
                                <p>Diretor da Escola de Ciberdefesa</p>
                                <p>_________________________</p>
                                <p>Vasco Miguel Ramos Marques Prates</p>
                                <p>Capitão-de-mar-e-guerra</p>
                            </div>
                            <div>
                                <p>
                                    Coordenador da Equipa de Professores do
                                    IPBeja
                                </p>
                                <p>_________________________</p>
                                <p>Rui Miguel Soares Silva</p>
                                <p>Professor Coordenador</p>
                            </div>
                        </div>
                        <p>Número Certidão: {certificate.certificateNumber}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrintCertificate3;
