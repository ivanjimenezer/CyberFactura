import axiosClient from "../../axios-client.js";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';

//Components
//Inputfield
import InputField from "../../components/inputField.jsx";
//Autocomplete
import Autocomplete from "../../components/Autocomplete.jsx";
//Utils
import { validateCliente } from "../../utils/validation/validateCliente.js";

export default function FormsCliente() {
    const scrollForms = useRef(null);
    const location = useLocation();
    // console.log("location.state: ", location);
    const link = location.state.api_url;
    const accion = location.state.type;
    const id_table = location.state.id;
    const link_backend_update = link + id_table;
    const return_url = location.state.return_url;
    const title = location.state.title;

    const initialFormData = location.state.singleobject ? location.state.singleobject : {

    };
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({
        "Calle": "",
        "NumIn": "",
        "NumEx": "",
        "CP": "",
        "Municipio": "",
        "Estado": "",
        "Colonia": "",

        "RFC": "",
        "RazonSoc": "",
        "Regimen": "",
        "Correo": ""
    });
    // Mensajes de eventos
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


    // Cambio en otros valores
    const handleChange = (e) => {
        const { name, value, texto } = e.target;
        setErrors({ ...errors, [name]: "" });
        setFormData({ ...formData, [name]: value });
        console.log("formdata (HandleChange): ", formData);
    };

    const handleSubmit = (e) => { 
        e.preventDefault();
        scrollForms.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
          })
        setSuccessMessage("");
        setErrorMessage("");

        console.log("Datos a enviar: ", formData);
        // Client-side validation using the utility function
        let errores = validateCliente(formData);
        // console.log("DATOS(checados): ", formData);
        if (Object.keys(errores).length > 0) {
            console.log("Se agregan errores: ", errores);
            setErrors(errores);
            return;
        }

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
            <h2 className="title-view" ref={scrollForms}>{title}</h2>
            <div className="forms-container">
            {loading && <div className="alert alert-loading">Enviando y esperando respuesta...</div>}
            {successMessage && <div className="alert alert-success success-message">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="Forms-input-group"  >
                    { /*RFC*/}
                    <InputField label="RFC"
                        id="RFC"
                        name="RFC" typefield="text"
                        value={formData.RFC} texto=""
                        onChange={handleChange} error={errors.RFC}
                    />
                    {/* RazonSoc */}

                    <InputField label="Razón Social en mayúsculas y sin régimen de capital"
                        id="RazonSoc"
                        name="RazonSoc" typefield="text"
                        value={formData.RazonSoc}
                        onChange={handleChange} error={errors.RazonSoc}
                    />
                </div>
                {/* Regimen  - AUTOCOMPLETE */}
                <div>
                    <Autocomplete
                        htmlFor="Regimen"
                        label="Régimen Fiscal"
                        apiUrl="/catalogos/regimen"
                        fieldName="Regimen"
                        placeholder="Ingrese la descripción del Régimen Fiscal"
                        onSelect={handleChange}
                        value={formData.Regimen}
                    />
                    {errors.Regimen !== "" && <div className="text-danger">{errors.Regimen}</div>}
                </div>
                <div className="Forms-input-group">
                    { /*CORREO*/}
                    <InputField label="Correo de contacto"
                        id="Correo"
                        name="Correo" typefield="email"
                        value={formData.Correo} texto=""
                        placeholder={"correo@ejemplo.com"}
                        onChange={handleChange} error={errors.Correo}
                    />
                    {/* CP */}
                    <InputField label="Código Postal (Obligatorio)"
                        id="CP"
                        name="CP" typefield="text"
                        value={formData.CP} texto=""
                        onChange={handleChange} error={errors.CP}
                    />
                </div>
                <div className="Forms-input-address-group">
                    <div className="input-row">

                        {/* NumEx */}
                        <InputField label="Número Exterior"
                            id="NumEx"
                            name="NumEx" typefield="number"
                            value={formData.NumEx} texto=""
                            onChange={handleChange} error={errors.NumEx}
                        />
                        {/* NumIn */}
                        <InputField label="Número Interior "
                            id="NumIn"
                            name="NumIn" typefield="text"
                            value={formData.NumIn} texto=""
                            onChange={handleChange} error={errors.NumIn}
                        />
                        { /*Calle*/}
                        <InputField label="Calle"
                            id="Calle"
                            name="Calle" typefield="text"
                            value={formData.Calle} texto=""
                            onChange={handleChange} error={errors.Calle}
                        />
                    </div>
                    <div className="input-row">

                        {/* Municipio */}
                        <InputField label="Municipio"
                            id="Municipio"
                            name="Municipio" typefield="text"
                            value={formData.Municipio} texto=""
                            onChange={handleChange} error={errors.Municipio}
                        />
                        {/* Colonia */}
                        <InputField label="Colonia"
                            id="Colonia"
                            name="Colonia" typefield="text"
                            value={formData.Colonia} texto=""
                            onChange={handleChange} error={errors.Colonia}
                        />
                        {/* Estado */}
                        <InputField label="Estado"
                            id="Estado"
                            name="Estado" typefield="text"
                            value={formData.Estado} texto=""
                            onChange={handleChange} error={errors.Estado}
                        />
                    </div>



                </div>

                <button type="submit" className="btn btn-primary">Enviar</button>
                <Link to={return_url} className="btn btn-back">Regresar</Link>
            </form>
            </div>
        </div>
    );

}