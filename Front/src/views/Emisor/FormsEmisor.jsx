import axiosClient from "../../axios-client.js";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
//Utils
//Validar cliente
import { validateEmisor } from "../../utils/validation/validateEmisor.js";

//Components
//Inputfield
import InputField from "../../components/inputField.jsx";
//AutoComplete
import Autocomplete from "../../components/Autocomplete.jsx";
//InputFile
import InputFile from "../../components/inputFile.jsx";
//password
import InputPassword from "../../components/inputPassword.jsx";

export default function FormsEmisor() {
    const location = useLocation();
    //console.log("location.state: ", location);
    const link = location.state.api_url;
    const accion = location.state.type;
    const id_table = location.state.id;
    //Cambiar
    const link_backend_update = 'emisor/updating/' + id_table;
    const return_url = location.state.return_url;
    const loc_object = location.state.singleobject;
    const title = location.state.title;
    const scrollForms = useRef(null);

    const initialFormData = {
        "Calle": loc_object.Calle,
        "NumEx": loc_object.NumEx,
        "NumIn": loc_object.NumIn,

        "Municipio": loc_object.Municipio,
        "Estado": loc_object.Estado,
        "Colonia": loc_object.Colonia,

        'csd': null,
        'key': null,
        'pass': null,
        'img': null,

        "CP": loc_object.CP,
        "RFC": loc_object.RFC,
        "RazonSoc": loc_object.RazonSoc,
        "Regimen": loc_object.Regimen

    };
    //Definir el forms data
    const [formData, setFormData] = useState(initialFormData);
    //Definir errores
    const [errors, setErrors] = useState({
        "Calle": "",
        "NumEx": "",
        "NumIn": "",

        "Municipio": "",
        "Estado": "",
        "Colonia": "",

        'csd': "",
        'key': "",
        'pass': "",
        'img': "",

        "CP": "",
        "RFC": "",
        "RazonSoc": "",
        "Regimen": "",
    });
    // Mensajes de eventos
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    //Gestionar el cambio de archivos
    const handleFileChange = (file, fieldName) => {
        if (fieldName !== 'Contra') {
            setFormData({ ...formData, [fieldName]: file });

        } else {
            // console.log("handlefile. contenido del file: ", file);
            setFormData({ ...formData, [fieldName]: file });
        }
        setErrors({ ...errors, [fieldName]: "" });
    };


    //Gest. el cambio de variables
    const handleVariable = (e) => {
        const { name, value, texto } = e.target;
        setErrors({ ...errors, [name]: "" });
        setFormData({ ...formData, [name]: value });
        console.log("formdata: ", formData);
    };

    //Enviar el archivo
    const handleSubmit = (e) => {
        e.preventDefault();
        scrollForms.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
        })
        setSuccessMessage("");
        setErrorMessage("");

        //validacion de datos antes de ser enviados
        let errores = validateEmisor(formData, accion);
        //Retornar si algun error se encontro
        if (Object.keys(errores).length > 0) {
            console.log("Se agregan errores: ", errores);
            setErrors(errores);
            return;
        }
        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null) {
                formDataToSend.append(key, value);
            }
        });

        // console.log("formdata to Send : ", formDataToSend);
        //console.log('link: ', link);

        for (var key of formDataToSend.entries()) {
            console.log(key[0] + ', ' + key[1]);
        }

        if (accion === "create") {
            setLoading(true);
            // Send data to the API
            axiosClient.post(link, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
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
        } else {
            setLoading(true);
            axiosClient.post(link_backend_update, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
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
    }


    return (
        <div className="container" >
            <h2 className="title-view" >{title}</h2>
            <div className="forms-container" >

                {loading && <div className="alert alert-loading">Enviando y esperando respuesta...</div>}
                {successMessage && <div className="alert alert-success success-message">{successMessage}</div>}
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="Forms-input-group" ref={scrollForms}>
                        { /*RFC*/}
                        <InputField label="RFC *"
                            id="RFC"
                            name="RFC" typefield="text"
                            value={formData.RFC} texto=""
                            onChange={handleVariable} error={errors.RFC}
                        />
                        {/* RazonSoc */}

                        <InputField label="Razón Social * en mayúsculas y sin régimen de capital"
                            id="RazonSoc"
                            name="RazonSoc" typefield="text"
                            value={formData.RazonSoc}
                            onChange={handleVariable} error={errors.RazonSoc}
                        />
                    </div>
                    {/* Regimen  - AUTOCOMPLETE */}
                    <div>
                        <Autocomplete
                            htmlFor="Regimen"
                            label="Régimen Fiscal *"
                            apiUrl="/catalogos/regimen"
                            fieldName="Regimen"
                            placeholder="Ingrese la descripción del Régimen Fiscal"
                            onSelect={handleVariable}
                            value={formData.Regimen}
                        />
                        {errors.Regimen !== "" && <div className="text-danger">{errors.Regimen}</div>}
                    </div>

                    <div className="inputfiles-block">
                        { /*csd  //AGREGAR ERRORES       */}
                        <InputFile labelTitle={'Archivo del certificado (.cer) *'} mode={accion}
                            fileRoute={'Certificado guardado en servidor'} fieldName="csd"
                            setFile={handleFileChange} fileExtension={'.cer'}
                            stateMessage={['¿Actualizar certificado?', 'Elegir certificado']} />
                        {errors.csd !== "" && <div className="text-danger">{errors.csd}</div>}

                        { /*key*/}
                        <InputFile labelTitle={'Archivo de clave privada (.key) *'} mode={accion}
                            fileRoute={'Llave guardada en servidor'} fieldName="key"
                            setFile={handleFileChange} fileExtension={'.key'}
                            stateMessage={['¿Actualizar clave privada?', 'Elegir clave privada']} />
                        {errors.key !== "" && <div className="text-danger">{errors.key}</div>}

                        { /*Logotipo*/}
                        <InputFile labelTitle={'Logotipo propio del emisor a insertar en la factura (.jpeg, .png, .jpg)'} mode={'update'}
                            fileRoute={'- - - - - - - '} fieldName="img"
                            setFile={handleFileChange} fileExtension={".jpg, .jpeg, .png"}
                            stateMessage={accion == 'create' ? ['¿Agregar logotipo?', 'Elegir Logotipo'] : ['¿Actualizar logotipo?', 'Elija su imagen']} />
                        {errors.img !== "" && <div className="text-danger">{errors.img}</div>}

                        {/* Password */}
                        <InputPassword
                            labelTitle={'Contraseña de la firma electronica'} mode={accion}
                            fieldName="pass" setPassword={handleFileChange}
                            stateMessage={['¿Actualizar contraseña?', 'Escriba la contraseña']} />
                        {errors.pass !== "" && <div className="text-danger">{errors.pass}</div>}

                    </div>
                    <div className="Forms-input-address-group">
                        <div className="input-row">
                            {/* CP */}
                            <InputField label="Código Postal *"
                                id="CP"
                                name="CP" typefield="text"
                                value={formData.CP} texto=""
                                onChange={handleVariable} error={errors.CP}
                            />
                            {/* NumEx */}
                            <InputField label="Número Exterior"
                                id="NumEx"
                                name="NumEx" typefield="number"
                                value={formData.NumEx} texto=""
                                onChange={handleVariable} error={errors.NumEx}
                            />
                            {/* NumIn */}
                            <InputField label="Número Interior "
                                id="NumIn"
                                name="NumIn" typefield="text"
                                value={formData.NumIn} texto=""
                                onChange={handleVariable} error={errors.NumIn}
                            />
                        </div>
                        <div className="input-row">
                            { /*Calle*/}
                            <InputField label="Calle"
                                id="Calle"
                                name="Calle" typefield="text"
                                value={formData.Calle} texto=""
                                onChange={handleVariable} error={errors.Calle}
                            />
                            {/* Municipio */}
                            <InputField label="Municipio"
                                id="Municipio"
                                name="Municipio" typefield="text"
                                value={formData.Municipio} texto=""
                                onChange={handleVariable} error={errors.Municipio}
                            />
                            {/* Colonia */}
                            <InputField label="Colonia"
                                id="Colonia"
                                name="Colonia" typefield="text"
                                value={formData.Colonia} texto=""
                                onChange={handleVariable} error={errors.Colonia}
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