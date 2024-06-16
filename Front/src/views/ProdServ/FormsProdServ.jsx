import React, { useRef, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import axiosClient from "../../axios-client";

import 'bootstrap/dist/js/bootstrap.bundle.min.js';
//Utils
import { validateProdServ } from "../../utils/validation/validateProdServ";
//Componentes
//Autocompletado
import Autocomplete from '../../components/Autocomplete';
//Inputfield
import InputField from "../../components/inputField.jsx";
//Dropdown
import Dropdown from '../../components/dropdown.jsx';

export default function FormsProdServ() {
    const scrollForms = useRef(null);
    const location = useLocation();
    // console.log("location.state: ", location);
    const link = location.state.api_url;
    // create o update
    const accion = location.state.type;
    const id_table = location.state.id;
    const link_backend_update = link + id_table;
    const return_url = location.state.return_url;
    const title = location.state.title;
    //console.log("location : ", location.state);

    const initialFormData = location.state.singleobject ? location.state.singleobject : {
        ClaveSAT: "", //X 
        ClaveInv: "", // X
        ClaveUnidadSAT: "",// X
        Unidad: "", // X
        Nombre: "", //X
        PrecioUnitario: 1, //X
        Tipo: "Servicio"//X

    };

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({
        ClaveSAT: "",
        ClaveInv: "",
        ClaveUnidadSAT: "",
        Unidad: "",
        Nombre: "",
        PrecioUnitario: "",
        Tipo: ""

    });


    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [UnidadText, setUnidadText] = useState("");

    // Cambia los datos del objeto dependiendo del campo
    const handleChange = (e) => {
        const { name, value, texto } = e.target;

        setErrors({ ...errors, [name]: "" });

        if (name == "ClaveUnidadSAT") {
            setUnidadText(texto);
            setFormData({ ...formData, ["Unidad"]: texto, ["ClaveUnidadSAT"]: value });
            return
        }
        setFormData({ ...formData, [name]: value });
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
        let errores = validateProdServ(formData);
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
                   // 'Content-Type': 'application/json'
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
                    { /* CLAVE SAT del Producto */}
                    <div>
                        <Autocomplete
                            htmlFor="ClaveSAT"
                            label="Clave SAT del producto/servicio"
                            apiUrl="/catalogos/prodserv"
                            fieldName="ClaveSAT"
                            placeholder="Ingrese la descripción del servicio/producto"
                            onSelect={handleChange}
                            value={formData.ClaveSAT}
                        />
                        {errors.ClaveSAT !== "" && <div className="text-danger">{errors.ClaveSAT}</div>}
                    </div>


                    { /* CLAVE Unidad SAT*/}
                    <div>
                        <Autocomplete
                            htmlFor="ClaveUnidadSAT"
                            label="Clave SAT de la Unidad"
                            apiUrl="/catalogos/unidad"
                            fieldName="ClaveUnidadSAT"
                            onSelect={handleChange}
                            placeholder="Ingrese la clave o descripción de la unidad"
                            value={formData.ClaveUnidadSAT}
                        />
                        {errors.ClaveUnidadSAT !== "" && <div className="text-danger">{errors.ClaveUnidadSAT}</div>}
                    </div>
                    <div className="Forms-input-group">
                        { /*Nombre del Producto*/}
                        <InputField label="Nombre del Producto o Servicio"
                            id="Nombre"
                            name="Nombre" typefield="text"
                            value={formData.Nombre} texto=""
                            onChange={handleChange} error={errors.Nombre}
                        />


                        { /* CLAVE Inventario */}
                        <InputField label="Clave Inventario del Producto/Servicio"
                            id="ClaveInv"
                            name="ClaveInv" typefield="text"
                            value={formData.ClaveInv} texto=""
                            onChange={handleChange} error={errors.ClaveInv} />


                    </div>
                    <div className="Forms-input-group">
                        { /*Unidad Text*/}
                        <InputField
                            label="Descripción de unidad"
                            id="Unidad"
                            name="Unidad" typefield="text"
                            value={formData.Unidad} texto=""
                            onChange={handleChange} error={errors.Unidad}
                        />
                        { /*  PrecioUnitario */}
                        <InputField label="Precio Unitario"
                            id="PrecioUnitario"
                            name="PrecioUnitario" typefield="number"
                            value={formData.PrecioUnitario} texto=""
                            onChange={handleChange} error={errors.PrecioUnitario} />
                    </div>

                    { /* Tipo */}
                    <Dropdown
                        id="Tipo"
                        label={"Elija el tipo de elemento"}
                        presentedValues={['Servicio', 'Producto']}
                        realValues={['Servicio', 'Producto']}
                        //opcion elegida por default
                        selectedValue={formData.Tipo}
                        onChange={handleChange}
                    />
                    <button type="submit" className="btn btn-primary">Guardar</button>
                    <Link to={return_url} className="btn btn-back">Regresar</Link>
                </form>
            </div>
        </div>
    );

}