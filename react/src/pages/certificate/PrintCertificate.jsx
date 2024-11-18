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
        Papa.parse(file, {
            header: true,
            complete: (results) => {
                if (results.data.length > 0) {
                    setCertificate(results.data[0]);
                }
            },
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
                            {certificate.name}, nascido(a) a{" "}
                            {certificate.birthday}, portador do cartão do
                            cidadão n.º {certificate.ccNumber}, concluiu o Curso
                            de {certificate.courseName}, da escola de
                            ciberdefesa, tendo obtido aproveitamento nas
                            seguintes unidades curriculares da área
                            Classificação Nacional das Áreas de Educação e
                            Formação (CNAEF), aprovada pela Portaria n.º
                            256/2005, de 16 de março, {certificate.text}
                        </p>
                        <p style={{ textAlign: "right" }}>
                            Lisboa, {certificate.day} de {certificate.month} de{" "}
                            {certificate.year}
                        </p>
                        <div className="signatures">
                            <div>
                                <p>O Diretor da Escola de Ciberdefesa</p>
                                <p>_________________________</p>
                                <p>Vasco Miguel Ramos Marques Prates</p>
                                <p>Capitão-de-mar-e-guerra</p>
                            </div>
                            <div>
                                <p>O Coordenador do Lab UbiNET, IPBeja</p>
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
