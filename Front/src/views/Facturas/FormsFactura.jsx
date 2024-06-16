import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../axios-client.js";
import { useState,useEffect, useRef } from 'react';

//Componentes
//Fecha
import InputDateTime from "../../components/inputDateTime";
//Inputfield
import InputField from "../../components/inputField.jsx";
//Autocomplete
import Autocomplete from "../../components/Autocomplete.jsx";
//Dropdown
import Dropdown from "../../components/dropdown.jsx";
// Emisor - Receptor Autocomplete
import EmiRecepAutocomplete from "../../components/EmiReceAutocom.jsx";
// labels para Emisor/Receptor seleccionados
import EmiRecepLabels from "../../components/EmiReceLabels.jsx";
// Concepto
import ConceptosForms from "../../components/conceptos.jsx";
import ReceiptSummary from "../../components/receiptSummary.jsx";
//Utils
//plantilla de factura
import { initialFormData, errorsGeneral, initialEmisor, initialReceptor } from "../../utils/objectTemplates/facturaTemplate.js";
import { createJSON } from "../../utils/objectTemplates/crearJSON.js";
//calculo de total
import calculateInvoiceTotals from "../../utils/calculoConcepto.js";
// validacion de datos
import { validateFactura } from "../../utils/validation/validateFactura.js";
/*
- Juntar forms de producto servicio
- Hacer verificaciones de codigos/claves sat antes de guardar elementos para prevenir guardar claves erroneas
- Permitir guardar unidades personalizadas
- 
*/

export default function FormsFactura() { 

    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const [activePanel, setActivePanel] = useState('Datos generales');
    //objeto del formData
    const [formData, setFormData] = useState(initialFormData);
    //objeto del receptor
    const [formReceptor, setFormReceptor] = useState(initialReceptor);
    const [formEmisor, setFormEmisor] = useState(initialEmisor);
    const [pdfURL, setPdfURL] = useState("");
    const scrollForms = useRef(null);

    //plantilla de errores importada
    const [errors, setErrors] = useState(errorsGeneral);

    // Mensajes de eventos
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const cuentaInitial = {
        "SubTotal": 0.00,
        'Descuento': 0.00,
        'Retenciones': 0.00,
        'Traslados': 0.00,
        "Total": 0.00,
    };
    const [cuenta, setCuenta] = useState(cuentaInitial);


    //Almacena un array que a su vez almacena objetos
    const [conceptosParent, setConceptosParent] = useState([]);

    const handleChange = (e) => {
        const { name, value, texto } = e.target;
        setErrors({ ...errors, [name]: "" });
        setFormData({ ...formData, [name]: value });
        console.log("formdata (HandleChange): ", formData);
    };

    const handleEmiRecep = (data, tipo) => {
        if (tipo == "Receptor") {
            setFormReceptor(data);
        } else {
            setFormEmisor(data);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        scrollForms.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        setSuccessMessage("");
        setErrorMessage("");
        // console.log("Form Data antes de validate: ", formData);

        let errores = validateFactura(formData, conceptosParent, formEmisor, formReceptor, cuenta);
        //Retornar si algun error se encontro
        if (Object.keys(errores).length > 0) {
            console.log("Se agregan errores: ", errores);
            setErrors(errores);
            return;
        }
        let facturaJSON = createJSON(formData, conceptosParent, formEmisor, formReceptor, cuenta);
        console.log("JSON a Enviar: ", facturaJSON);
        //Ver mensaje de cargando
        setLoading(true);
        axiosClient.post('/factura', facturaJSON, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                setLoading(false);
                const URL_PDF = response.data.message;
                //console.log("Respuesta timbre: ",response.data.message);
                setPdfURL(URL_PDF);
                setSuccessMessage("Factura timbrada con exito, puedes ver el pdf "); // Access response.data.message
                setErrorMessage("");
                //initial form data
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

    const receiveConceptos = (arrayConceptos) => {
        if (arrayConceptos != null || arrayConceptos.length > 0) {
            //Funcion para calcular la cuenta
            console.log("parent receivinf coneptos_ : ", arrayConceptos);
            let concepto_cuenta = calculateInvoiceTotals(arrayConceptos);
            setConceptosParent(concepto_cuenta.Conceptos);
            //  console.log("receive: ", concepto_cuenta);
            setCuenta(prevState => ({
                ...prevState,
                ...concepto_cuenta.Cuenta
            }));
        }
    }


    return (
        <div className="container">
            <h2 className="title-view" >{"Crear Factura"}</h2>
            <div className="forms-container">
            {loading && <div className="alert alert-loading">Enviando y esperando respuesta...</div>}
            {successMessage &&
                <div className="alert alert-success success-message">
                    {successMessage}
                    <a href={`${apiUrl || ''}${pdfURL || ''}`} target="_blank" > aquí </a>
                </div>
            }
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            {/* Buttons to toggle between panels */}
            <div className="invoice-buttons" ref={scrollForms}>
                <button onClick={() => setActivePanel('Datos generales')} className={activePanel === 'Datos generales' ? 'active' : ''}>Datos generales</button>
                <button onClick={() => setActivePanel('Conceptos')} className={activePanel === 'Conceptos' ? 'active' : ''}>Conceptos</button>
            </div>
            <button onClick={handleSubmit} className="btn btn-primary btn-timbrar">Timbrar</button>
            <form >

                {activePanel === 'Datos generales' && (
                    <div>
                        <h3 className="mt-2"> Datos Generales </h3>
                        <div className="note-label">{'En caso de poner mas de un elemento, separar por comas'}</div>
                        <div className="Forms-input-group">
                            {/* ReceptorCC */}
                            <InputField label="Destinatarios CC (Opcional)"
                                id="ReceptorCC"
                                name="ReceptorCC" typefield="text"
                                placeholder={""}
                                value={formData.ReceptorCC}
                                onChange={handleChange} error={errors.ReceptorCC}
                            />

                            {/* ReceptorCCO */}
                            <InputField label="Destinatarios CCO (Opcional)"
                                id="ReceptorCCO"
                                name="ReceptorCCO" typefield="text"
                                value={formData.ReceptorCCO}
                                onChange={handleChange} error={errors.ReceptorCCO}
                            />
                            {/* EmailMensaje */}
                            <InputField label="Mensaje dentro del Correo (Opcional)"
                                id="EmailMensaje"
                                name="EmailMensaje" typefield="text"
                                value={formData.EmailMensaje}
                                onChange={handleChange} error={errors.EmailMensaje}
                            />

                        </div>

                        <h3> Datos de Encabezado </h3>
                        <div className="Forms-input-group">
                            {/* Folio */}
                            <InputField label="Folio *"
                                id="Estado"
                                name="Folio" typefield="text"
                                value={formData.Folio}
                                onChange={handleChange} error={errors.Folio}
                            />
                            {/* Serie */}
                            <InputField label="Serie *"
                                id="Estado"
                                name="Serie" typefield="text"
                                value={formData.Serie}
                                onChange={handleChange} error={errors.Serie}
                            />
                            {/* Fecha */}
                            <InputDateTime
                                fieldName={"Fecha"}
                                handleChange={handleChange}
                                title={'Fecha de emisión'}
                                error={errors['Fecha']}
                                date={formData.Fecha}
                            />
                        </div>
                        {/* Receptor.UsoCFI */}
                        <div>
                            <Autocomplete
                                htmlFor="UsoCFDI"
                                label="Uso del CFDI"
                                apiUrl="/catalogos/usocfdi"
                                fieldName="UsoCFDI"
                                placeholder="Ingrese la descripción del uso del CFDI"
                                onSelect={handleChange}
                                value={formData.UsoCFDI}
                            />
                            {errors.UsoCFDI !== "" && <div className="text-danger">{errors.UsoCFDI}</div>}
                        </div>

                        {/* formData.FormaPago */}
                        <div>
                            <Autocomplete
                                htmlFor="FormaPago"
                                label="Forma de Pago"
                                apiUrl="/catalogos/formapago"
                                fieldName="FormaPago"
                                placeholder="Ingrese la descripción de la forma de pago"
                                onSelect={handleChange}
                                value={formData.FormaPago}
                            />
                            {errors.FormaPago !== "" && <div className="text-danger">{errors.FormaPago}</div>}
                        </div>
                        <div className="Forms-input-group">
                            {/* MetodoPago */}
                            <Dropdown
                                id="MetodoPago"
                                label={"Elija el método de pago"}
                                presentedValues={['PPD - Pago en parcialidades o diferido', 'PUE - Pago en una sola exhibición']}
                                realValues={['PPD', 'PUE']}
                                //opcion elegida por default
                                selectedValue={formData.MetodoPago}
                                onChange={handleChange}
                            />

                            <Dropdown
                                id="Moneda"
                                label={"Elija la moneda"}
                                presentedValues={['MXN - Peso Mexicano', 'USD - Dolar americano']}
                                realValues={['MXN', 'USD']}
                                //opcion elegida por default
                                selectedValue={formData.Moneda}
                                onChange={handleChange}
                            />
                        </div>
                        {/* Cliente */}
                        <h4> Datos del Cliente </h4>
                        <EmiRecepAutocomplete tipo={'Receptor'} label={""}
                            apiUrl={"/clients/buscar"} paramName={'razon'}
                            placeholder={"Busque al cliente por su razón social"}
                            onSelect={handleEmiRecep} showsuggestion={'RazonSoc'} />
                        {errors.Receptor !== "" && <div className="text-danger">{errors.Receptor}</div>}
                        <EmiRecepLabels data={formReceptor} hiddenColumns={['idCliente']} />

                        {/* Emisor */}
                        <h4> Datos del Emisor </h4>
                        <EmiRecepAutocomplete tipo={'Emisor'} label={""}
                            apiUrl={"/emisores/buscar"} paramName={'razon'}
                            placeholder={"Busque al emisor por su razón social"}
                            onSelect={handleEmiRecep} showsuggestion={'RazonSoc'}
                        />
                        {errors.Emisor !== "" && <div className="text-danger">{errors.Emisor}</div>}
                        <EmiRecepLabels data={formEmisor} hiddenColumns={['idEmisor', 'CSD', 'Llave', 'Contra', 'Logo']} />
                    </div>)}
            </form>
            {/* Conceptos  //Here it goes the other panel      */}
            {activePanel === 'Conceptos' && (
                <div>
                    <ConceptosForms sendConceptos={receiveConceptos} conceptosFromParent={conceptosParent} />
                </div>
            )}
            {errors.Conceptos !== "" && <div className="text-danger">{errors.Conceptos}</div>}
            <ReceiptSummary cuenta={cuenta} />
            <button onClick={handleSubmit} className="btn btn-primary btn-timbrar">Timbrar</button>
            <Link to={"/factura/"} className="btn btn-back-factura">Regresar</Link>
        </div>
        </div>
    );
}