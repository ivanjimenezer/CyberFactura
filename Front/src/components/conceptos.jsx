import { useState, useEffect } from 'react';
//Componentes
//Autocomplete para obtener todos los datos
import EmiRecepAutocomplete from './EmiReceAutocom';
//Inputfield
import InputField from './inputField.jsx';
//AutoComplete
import Autocomplete from "./Autocomplete.jsx";
//Dropdown
import Dropdown from './dropdown.jsx';
//Tax checklist
import TaxChecklist from './TaxChecklist';
import ConceptoCard from './conceptoCard.jsx';
//Utils
//Fill
import { fillObject } from '../utils/fillproduct.js';
import { validateConcepto } from '../utils/validation/validateCocepto.js';
export default function ConceptosForms({ sendConceptos, conceptosFromParent }) {
    const [showTaxChecklist, setShowTaxChecklist] = useState(false);
    // si no es objeto de impuesto (01), entonces se deja vacio como default
    // Si el descuento es vacio o null, o 0, se elimina del objeto
    const initialConcepto = {
        "idProdServ": "",
        "Cantidad": "1",
        "CodigoUnidad": "",
        "Descripción": "",
        "Producto": "",
        "Unidad": "",
        "CodigoProducto": "",

        "Descuento": "",
        "PrecioUnitario": "",
        "Importe": "", // Cantidad * PrecioUnitario
        "ObjetoDeImpuesto": "01",
        "Impuestos": []
    }

    const [objectConcept, setObjectConcept] = useState(initialConcepto);
    //this object works as a template for errors
    const initialError = {
        "idProdServ": "",
        "Cantidad": "",
        "CodigoUnidad": "",
        "Descripción": "",
        "Producto": "",
        "Unidad": "",
        "CodigoProducto": "",

        "Descuento": "",
        "PrecioUnitario": "",
        "Importe": "",
        "ObjetoDeImpuesto": ""
    };

    //errors of the data product before of the concept being created
    const [errorsConcepto, setErrorsConcepto] = useState(initialError);
    //Create cards from this array of concepts, when the button of create new concept is selected, it must add the object into this array
    const [arrayobjects, setArrayObjects] = useState(conceptosFromParent);


    useEffect(() => {
        sendConceptos(arrayobjects);
    }, [arrayobjects]);



    const handleChangeConcepto = (e) => {
        const { name, value, texto } = e.target;
        //Definir nuevamente validación de errores
        // console.log("e.target: ", e.target);
        setErrorsConcepto({ ...errorsConcepto, [name]: "" });
        if (name == "CodigoUnidad") {
            setObjectConcept({ ...objectConcept, ["Unidad"]: texto, ['CodigoUnidad']: value });
            //console.log("arrayobjects dentro CodigoUnidad: ", objectConcept);
            return;
        }
        setObjectConcept({ ...objectConcept, [name]: value });
        console.log("arrayobjects: ", objectConcept);
    }

    const handleFill = (data, tipo) => {
        let newConcept = fillObject(data);
        setObjectConcept(prevState => ({
            ...prevState,
            ...newConcept
        }));
        setErrorsConcepto("");
    }

    const handleObjetoImpuesto = (e) => {
        const { name, value } = e.target;
        //set ObjetoDeImpuesto
        setObjectConcept({ ...objectConcept, [name]: value });
        // show a list of the existing Impuestos waiting to be checked and added
        setShowTaxChecklist(value === '02');
    }

    const handleTaxSelection = (tax) => {
        //console.log('Tax selected on conceptor: ', tax);
        setObjectConcept({ ...objectConcept, ['Impuestos']: tax });
    }

    const handleNewConcept = () => {
        console.log("Nuevo Concepto", objectConcept);
        // Calculate the importe based on the quantity and unit price
        const importe = parseFloat(objectConcept.Cantidad) * parseFloat(objectConcept.PrecioUnitario);

        //validacion de datos antes de ser enviados
        let errores = validateConcepto(objectConcept, importe);
        //Retornar si algun error se encontro
        if (Object.keys(errores).length > 0) {
            console.log("Se agregan errores: ", errores);
            setErrorsConcepto(errores);
            return;
        }


        // Create a new concepto object with the calculated importe
        const newConcepto = {
            ...objectConcept,
            Importe: importe.toFixed(2), // Format importe to two decimal places
        };
        setArrayObjects(prevArrayObjects => [...prevArrayObjects, newConcepto]);
        console.log("AAdding new concepot: ", arrayobjects);
        // Reset the objectConcept state to its initial values for the next concepto
        setObjectConcept(initialConcepto);
        setErrorsConcepto("");
    };

    const handleDeleteConcepto = (conceptoToDelete) => {
        // Update the arrayobjects state with the updated conceptos
        setArrayObjects(prevArrayObjects => prevArrayObjects.filter(concepto => concepto !== conceptoToDelete));
        console.log("delete: ", arrayobjects);
    };

    useEffect(() => {
        setShowTaxChecklist(objectConcept.ObjetoDeImpuesto === '02');
    }, [objectConcept.ObjetoDeImpuesto]);

    return (<div>

        <h4 className='mt-3'> Datos del Producto </h4>
        {errorsConcepto.Importe !== "" && <div className="text-danger">{errorsConcepto.Importe}</div>} 
        <EmiRecepAutocomplete tipo={'Producto'} label={"Es necesario usar un producto registrado en el sistema"}
            apiUrl={"/getprodserv"}
            paramName={'clav'}
            placeholder={"Ingrese el nombre o Clave Inventario del producto/servicio"}
            onSelect={handleFill} showsuggestion={'ClaveNombre'} />
        { /* id de Producto*/}
        <div className="mb-3">
            <label htmlFor="Unidad" className="form-label fw-bold">Id del Producto/Servicio:</label>
            <p className="text-muted">{objectConcept.idProdServ}</p>
            {errorsConcepto.idProdServ !== "" && <div className="text-danger">{errorsConcepto.idProdServ}</div>}
        </div>

        { /* CLAVE Producto/Servicio SAT*/}
        <div>
            <Autocomplete
                htmlFor="CodigoProducto"
                label="Clave SAT del Producto/Servicio"
                apiUrl="/catalogos/prodserv"
                fieldName="CodigoProducto"
                onSelect={handleChangeConcepto}
                placeholder="Ingrese la descripción del Producto"
                value={objectConcept.CodigoProducto}
            />
            {errorsConcepto.CodigoProducto !== "" && <div className="text-danger">{errorsConcepto.CodigoProducto}</div>}
        </div>
        <div className="Forms-input-group">
            { /* CLAVE Inventario  | Nombre del Producto*/}
            <InputField label="Clave Inventario del Producto o Servicio"
                id="Producto"
                name="Producto" typefield="text"
                value={objectConcept.Producto} texto=""
                onChange={handleChangeConcepto} error={errorsConcepto.Producto}
            />
            { /* Descripcion del Producto*/}
            <div className="mb-3 mt-3">
                <label htmlFor="Descripción" className="form-label fw-bold">Descripción del Producto/Servicio:</label>
                <p className="text-muted">{objectConcept.Descripción}</p>
                {errorsConcepto.Descripción !== "" && <div className="text-danger">{errorsConcepto.Descripción}</div>}
            </div>
        </div>

        <div className="Forms-input-group">
            { /*Cantidad*/}
            <InputField label="Cantidad"
                id="Cantidad"
                name="Cantidad" typefield="number"
                value={objectConcept.Cantidad} texto=""
                onChange={handleChangeConcepto} error={errorsConcepto.Cantidad}
            />

            { /*  PrecioUnitario */}
            <InputField label="Precio Unitario"
                id="PrecioUnitario"
                name="PrecioUnitario" typefield="number"
                value={objectConcept.PrecioUnitario} texto=""
                onChange={handleChangeConcepto} error={errorsConcepto.PrecioUnitario} />
            { /*Descuento*/}
            <InputField label="Descuento (opcional)"
                id="Descuento"
                name="Descuento" typefield="number"
                value={objectConcept.Descuento} texto=""
                onChange={handleChangeConcepto} error={errorsConcepto.Descuento}
            />
        </div>
        { /* CLAVE Unidad SAT*/}
        <div>
            <Autocomplete
                htmlFor="CodigoUnidad"
                label="Clave SAT de la Unidad"
                apiUrl="/catalogos/unidad"
                fieldName="CodigoUnidad"
                onSelect={handleChangeConcepto}
                placeholder="Ingrese la descripción de la unidad"
                value={objectConcept.CodigoUnidad}
            />
            {errorsConcepto.CodigoUnidad !== "" && <div className="text-danger">{errorsConcepto.CodigoUnidad}</div>}
        </div>
        <div className="Forms-input-group">
        { /*Unidad Text*/}
        <InputField
            label="Descripción de unidad"
            id="Unidad"
            name="Unidad" typefield="text"
            value={objectConcept.Unidad} texto=""
            onChange={handleChangeConcepto} error={errorsConcepto.Unidad}
        />
        { /* DEFINIR OBJETO DE IMPUESTO
 
        */}
        <Dropdown
            id="ObjetoDeImpuesto"
            label={"Elija el Objeto de Impuesto"}
            presentedValues={['No objeto de impuesto', 'Sí objeto de impuesto',
                'Sí objeto del impuesto y no obligado al desglose', 'Si objeto del impuesto y no causa impuesto'
            ]}
            realValues={["01", "02", "03", "04"]}
            //opcion elegida por default
            selectedValue={objectConcept.ObjetoDeImpuesto}
            onChange={handleObjetoImpuesto}
        />

        {errorsConcepto.ObjetoDeImpuesto !== "" && <div className="text-danger">{errorsConcepto.ObjetoDeImpuesto}</div>}
        <TaxChecklist show={showTaxChecklist} onSelect={handleTaxSelection} />
        </div>
        <button onClick={handleNewConcept} className="btn btn-addConcepto" >Agregar Concepto</button>
        {/* Concepto cards list */}

        <div className="card-list card-Message">
            {arrayobjects.length === 0 ? (
                <h3>Sin conceptos por mostrar</h3>
            ) : (
                arrayobjects.map((concepto, index) => (
                    <ConceptoCard key={index} concepto={concepto} onDelete={handleDeleteConcepto} />
                ))
            )}

        </div>
    </div>);
}

