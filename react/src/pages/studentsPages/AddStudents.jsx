import React, { useState } from "react";
import endpoints from "../../endpoints";
import { useAuth } from "../../auth/AuthContext";
const AddStudents = () => {
    const { accessTokenData } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        ipbeja_email: "",
        number: "",
        birthday: "",
        address: "",
        city: "",
        mobile: "",
        classe: "",
        posto: "",
        personal_email: "",
        nim: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateForm = () => {
        const {
            name,
            ipbeja_email,
            number,
            birthday,
            address,
            city,
            mobile,
            classe,
            posto,
            personal_email,
            nim,
        } = formData;

        if (name.trim() === "" || name.length > 255) {
            alert("name is required and should not exceed 255 characters.");
            return false;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(ipbeja_email) || ipbeja_email.length > 255) {
            alert("Email IPBEJA is invalid or exceeds 255 characters.");
            return false;
        }
        if (isNaN(number) || number.trim() === "") {
            alert("Número is required and must be an integer.");
            return false;
        }
        if (birthday && isNaN(new Date(birthday).getTime())) {
            alert("Data de Nascimento must be a valid date.");
            return false;
        }
        if (address.length > 255) {
            alert("address should not exceed 255 characters.");
            return false;
        }
        if (city.length > 255) {
            alert("city should not exceed 255 characters.");
            return false;
        }
        if (mobile && isNaN(mobile)) {
            alert("Telemóvel must be an integer.");
            return false;
        }
        if (posto.length > 255) {
            alert("Posto should not exceed 255 characters.");
            return false;
        }
        if (nim && isNaN(nim)) {
            alert("NIM must be an integer.");
            return false;
        }
        if (!emailPattern.test(personal_email) || personal_email.length > 255) {
            alert("Email Pessoal is invalid or exceeds 255 characters.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch(endpoints.ADD_STUDENTS, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessTokenData.access_token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Student added successfully!");
                // Reset form
                setFormData({
                    name: "",
                    ipbeja_email: "",
                    number: "",
                    birthday: "",
                    address: "",
                    city: "",
                    mobile: "",
                    classe: "",
                    posto: "",
                    personal_email: "",
                    nim: "",
                });
            } else {
                alert("Failed to add student");
            }
        } catch (error) {
            console.error("Error:", error);
            alert(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Adicionar Alunos</h2>
            <div>
                <label>Nome</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={255}
                />
            </div>
            <div className="date_input_container">
                <label className="date_input_label">Data de Nascimento</label>
                <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Telemóvel</label>
                <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    pattern="\d+"
                />
            </div>
            <div>
                <label>Classe</label>
                <input
                    type="text"
                    name="classe"
                    value={formData.classe}
                    onChange={handleChange}
                    required
                    maxLength={255}
                />
            </div>
            <div>
                <label>Email IPBEJA</label>
                <input
                    type="email"
                    name="ipbeja_email"
                    value={formData.ipbeja_email}
                    onChange={handleChange}
                    required
                    maxLength={255}
                />
            </div>
            <div>
                <label>Morada</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    maxLength={255}
                />
            </div>
            <div>
                <label>Posto</label>
                <input
                    type="text"
                    name="posto"
                    value={formData.posto}
                    onChange={handleChange}
                    required
                    maxLength={255}
                />
            </div>
            <div>
                <label>Número</label>
                <input
                    type="text"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    required
                    pattern="\d+"
                />
            </div>
            <div>
                <label>Cidade</label>
                <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    maxLength={255}
                />
            </div>
            <div>
                <label>NIM</label>
                <input
                    type="text"
                    name="nim"
                    value={formData.nim}
                    onChange={handleChange}
                    pattern="\d+"
                />
            </div>
            <div>
                <label>Email Pessoal</label>
                <input
                    type="email"
                    name="personal_email"
                    value={formData.personal_email}
                    onChange={handleChange}
                    required
                    maxLength={255}
                />
            </div>
            <button type="submit">Submeter</button>
        </form>
    );
};

export default AddStudents;
