import axiosClient from "../../axios-client.js";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState, useRef } from 'react';

//Components
//Inputfield
import InputField from "../../components/inputField.jsx";
//Dropdown
import Dropdown from '../../components/dropdown.jsx';
import Autocomplete from "../../components/Autocomplete.jsx";
//Utils
import { validateImpuesto } from "../../utils/validation/validateImpuesto.js";

export default function FormsImpuestos() {
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
        "Nombre": "",
        "Tipo": '1',
        "Impuesto": '1',
        "Factor": '1',
        "Tasa": 0.000000
    };

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({
        "Nombre": "",
        "Tipo": "",
        "Impuesto": "",
        "Factor": "",
        "Tasa": ""
    });

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
        let errores = validateImpuesto(formData);
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
            <h2 className="title-view" >{title}</h2>
            <div className="forms-container" >
                {loading && <div className="alert alert-loading">Enviando y esperando respuesta...</div>}
                {successMessage && <div className="alert alert-success success-message">{successMessage}</div>}
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <InputField label="Nombre del Impuesto (Personalizado)"
                        id="Nombre"
                        name="Nombre" typefield="text"
                        placeholder="Ingrese un nombre para el Impuesto"
                        value={formData.Nombre} texto=""
                        onChange={handleChange} error={errors.Nombre}
                    />
                    { /* tipoImpuesto */}
                    <Dropdown
                        id="Tipo"
                        label={"Elija el tipo"}
                        presentedValues={['Impuestos trasladados: IVA, IEPS', 'Retenidos: IVA, ISR']}
                        realValues={[1, 2]}
                        //opcion elegida por default
                        selectedValue={formData.Tipo}
                        onChange={handleChange}
                    />

                    { /* Impuesto */}
                    <Dropdown
                        id="Impuesto"
                        label={"Elija el Impuesto"}
                        presentedValues={['ISR', 'IVA', 'IEPS']}
                        realValues={[1, 2, 3]}
                        //opcion elegida por default
                        selectedValue={formData.Impuesto}
                        onChange={handleChange}
                    />

                    { /* Factor */}
                    <Dropdown
                        id="Factor"
                        label={"Elija el Factor del Impuesto"}
                        presentedValues={['Tasa', 'Cuota', 'Exento']}
                        realValues={[1, 2, 3]}
                        //opcion elegida por default
                        selectedValue={formData.Factor}
                        onChange={handleChange}
                    />

                    { /*  Tasa */}
                    <InputField label="Tasa (0.160000, 0.080000, 0.350000, 0.106666)"
                        id="Tasa"
                        name="Tasa" typefield="number"
                        value={formData.Tasa} texto=""
                        placeholder={"Escribir en decimales"}
                        onChange={handleChange} error={errors.Tasa} />
                    <button type="submit" className="btn btn-primary">Enviar</button>
                    <Link to={return_url} className="btn btn-back">Regresar</Link>
                </form>

            </div>
        </div>
    )
}