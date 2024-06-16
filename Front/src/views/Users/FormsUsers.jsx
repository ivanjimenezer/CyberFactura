
import axiosClient from "../../axios-client.js";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState, useEffect } from 'react';

//Components
//Inputfield
import InputField from "../../components/inputField.jsx";
//Dropdown
import Dropdown from '../../components/dropdown.jsx';
//password
import InputPassword from "../../components/inputPassword.jsx";
//Utils
import { validateUsers } from "../../utils/validation/validateUsers.js";

export default function FormsUsers() {
    const location = useLocation();
    //console.log("location.state: ", location.state);
    const link = location.state.api_url;
    const accion = location.state.type;
    const id_table = location.state.id;
    const link_backend_update = link +id_table;
    const return_url = location.state.return_url;
    const title = location.state.title;


    const initialFormData = location.state.singleobject ? location.state.singleobject : {
        'id': '',
        'name': '',
        'email': '',
        'type': 'common',
        'password': '',
        'password_confirmation': ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({
        'name': '',
        'email': '',
        'password': '',
        'password_confirmation': ''
    });
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const { name, value, texto } = e.target;
        setErrors({ ...errors, [name]: "" });
        setFormData({ ...formData, [name]: value });
        console.log("formdata (HandleChange): ", formData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");
        console.log("Datos a enviar: ", formData);
        // Client-side validation using the utility function
         let errores = validateUsers(formData, accion); 
        if (Object.keys(errores).length > 0) {
            console.log("Se agregan errores: ", errores);
            setErrors(errores);
            return; 
       }
        console.log("Datos Correctos: ", formData);

        if (accion == "create") {
            setLoading(true);
            // Send data to the API
            axiosClient.post(link, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    setLoading(false);
                    setSuccessMessage(response.data.message); // Access response.data.message
                    setErrorMessage("");
                    setFormData(initialFormData); // Reset form after successful submission
                })
                .catch(error => {
                    setLoading(false);
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        const errorMessageString = JSON.stringify(error.response.data.error);
                        setErrorMessage(errorMessageString);
                        setSuccessMessage("");
                    } else if (error.request) {
                        // The request was made but no response was received
                        setErrorMessage("No se puede conectar al servidor. Intentelo de nuevo más tarde.");
                        setSuccessMessage("");
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error:', error.message);
                    }
                });
        }
        else {
            setLoading(true);
            axiosClient.put(link_backend_update, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    setLoading(false);
                    setSuccessMessage(response.data.message); // Access response.data.message
                    setErrorMessage("");

                })
                .catch(error => {
                    setLoading(false);
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        const errorMessageString = JSON.stringify(error.response.data.error);
                        setErrorMessage(errorMessageString);
                        setSuccessMessage("");
                    } else if (error.request) {
                        // The request was made but no response was received
                        setErrorMessage("No se puede conectar al servidor. Intentelo de nuevo más tarde.");
                        setSuccessMessage("");
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error:', error.message);
                    }
                });
        }

    };
    return (
        <div className="container">
            <h2 className="title-view">{title}</h2>
            
            {loading && <div className="alert alert-loading">Enviando y esperando respuesta...</div>}
            {successMessage && <div className="alert alert-success success-message">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
                <InputField label="Nombre del Impuesto (Personalizado)"
                    id="name"
                    name="name" typefield="text"
                    placeholder="Ingrese un nombre para el usuario"
                    value={formData.name} texto=""
                    onChange={handleChange} error={errors.name}
                />
                <InputField label="Email del usuario"
                    id="email"
                    name="email" typefield="email"
                    value={formData.email} texto=""
                    placeholder={"email@ejemplo.com"}
                    onChange={handleChange} error={errors.email}
                />

                { /* type Usuario */}
                <Dropdown
                    id="type"
                    label={"Elija el tipo de usuario"}
                    presentedValues={['Común', 'Administrador']}
                    realValues={['common', 'admin']}
                    //opcion elegida por default
                    selectedValue={formData.type}
                    onChange={handleChange}
                />
                {/* Password */}
                <InputField label="Contraseña del usuario"
                    id="password"
                    name="password" typefield="password"
                    value={formData.password} texto=""
                    placeholder={"Contr4$eñA12_"}
                    onChange={handleChange} error={errors.password}
                />
                {/* Confirm Password */}
                <InputField label="Confirme la contraseña "
                    id="password_confirmation"
                    name="password_confirmation" typefield="password"
                    value={formData.password_confirmation} texto=""
                    placeholder={""}
                    onChange={handleChange} error={errors.password_confirmation}
                />




                <button type="submit" className="btn btn-primary">Enviar</button>
                <Link to={return_url} className="btn btn-back">Regresar</Link>
            </form>

        </div>

    )

}