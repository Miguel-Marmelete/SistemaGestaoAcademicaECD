import React, { useState, useRef } from "react";
import img1 from "../../assets/WhatsApp_Image_2024-11-04_at_11.50.14-removebg-preview.png";
import img2 from "../../assets/WhatsApp_Image_2024-11-04_at_11.50.18-removebg-preview.png";
import img3 from "../../assets/emgfa.png";

const PrintCertificate = () => {
    const [dados, setDados] = useState(null);
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
        const dados = {
            nome: rows[1][0],
            cartao: rows[1][1],
            curso: rows[1][2],
            data: rows[1][3],
            media: rows[1][4],
            horas: rows[1][5],
            horasEstagio: rows[1][6],
            local: rows[1][7],
            dataEmissao: rows[1][8],
        };
        setDados(dados);
    };

    const formatDate = (date) => {
        const options = { day: "numeric", month: "long", year: "numeric" };
        return new Intl.DateTimeFormat("pt-PT", options).format(date);
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
            {!dados && (
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

            {dados && (
                <>
                    <div ref={printRef} className="certificate">
                        <div
                            className="certificate-container"
                            style={{
                                border: "2px solid black",
                                padding: "20px",
                                margin: "20px",
                            }}
                        >
                            <div
                                className="certificate-header"
                                style={{ textAlign: "center" }}
                            >
                                <img
                                    src={img3}
                                    alt="Logo"
                                    className="certificate-logo"
                                />
                                <div
                                    className="certificate-headers"
                                    style={{
                                        display: "inline-block",
                                        textAlign: "center",
                                        marginLeft: "10px",
                                    }}
                                >
                                    <br></br>
                                    <h3>
                                        Estado Maior - General das forças
                                        Armadas
                                    </h3>
                                    <h3>
                                        Centro de Comunicações e Informação,
                                        Ciberspaço e Espaço
                                    </h3>
                                    <h3>Comando de Operações de Ciberdefesa</h3>
                                </div>
                                <div className="certificate-symbols">
                                    <img
                                        src={img1}
                                        alt="Symbol 1"
                                        className="certificate-symbol"
                                        style={{ width: "57px" }}
                                    />

                                    <img
                                        src={img2}
                                        alt="Symbol 2"
                                        className="certificate-symbol"
                                    />
                                </div>
                            </div>
                            <div
                                className="certificate-title"
                                style={{ textAlign: "center" }}
                            >
                                <h3 className="title">Escola de Ciberdefesa</h3>
                                <h3 className="subtitle">Certificado</h3>
                            </div>
                            <div className="certificate-text">
                                <p>
                                    Certifica-se que {dados.nome}, portador do
                                    Cartão de Cidadão n.º {dados.cartao},
                                    concluiu o Curso {dados.curso}, a{" "}
                                    {dados.data} , com média final de{" "}
                                    {dados.media} valores, num total de{" "}
                                    {dados.horas} horas letivas e{" "}
                                    {dados.horasEstagio} horas de Estágio.
                                </p>
                                <div
                                    className="certificate-location-date"
                                    style={{
                                        textAlign: "right",
                                        marginTop: "20px",
                                    }}
                                >
                                    <p>
                                        {dados.local},{formatDate(new Date())}
                                    </p>
                                </div>
                            </div>
                            <div className="certificate-signatures">
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
export default PrintCertificate;
