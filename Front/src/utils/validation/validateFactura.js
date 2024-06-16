const validateReceptorCC = (ReceptorCC) => {
    const errors = {};
    const emailRegex = /^$|^([\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})+(,\s*[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})*$/;

    if (ReceptorCC !== "") {

        if (!emailRegex.test(ReceptorCC)) {
            errors.ReceptorCC = "Los correos deben tener la estructura correcta";
        }
    }
    return errors;
}
const validateReceptorCCO = (ReceptorCCO) => {
    const errors = {};
    const emailRegex = /^$|^([\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})+(,\s*[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})*$/;

    if (ReceptorCCO !== "") {

        if (!emailRegex.test(ReceptorCCO)) {
            errors.ReceptorCCO = "Los correos deben tener la estructura correcta";
        }
    }
    return errors;
}
const validateEmailMensaje = (EmailMensaje) => {
    const errors = {};

    if (EmailMensaje !== "") {
        if (EmailMensaje.length > 200) {
            errors.ReceptorCCO = "El mensaje del correo debe ser menor a 200 caracteres";
        }

    }
    return errors;
}
const validateFecha = (Fecha) => {
    // Convert ISO date string to Date object
    const dateReived = new Date(Fecha); 
    const dateFixed = new Date(dateReived.getTime() - 6 * 60 * 60 * 1000); // Subtract 5 hours in milliseconds 
    // Get the current time
    const currentTime = new Date();
    // Calculate the time difference in milliseconds
    const timeDifference = currentTime - dateFixed;
    // Convert 72 hours to milliseconds
    const seventyTwoHoursInMs = 72 * 60 * 60 * 1000;
    const errors = {};
    if (timeDifference > seventyTwoHoursInMs) {
        errors.Fecha = "La fecha es mayor a 72hrs";

    }
    return errors;
 
}
const validateUsoCFDI = (UsoCFDI) => {
    const errors = {};
    if (UsoCFDI === "") {
        errors.UsoCFDI = "El Uso del CFDI es necesario";
    }
    return errors;
}
const validateFolio = (Folio) => {
    const errors = {};
    if (Folio === "") {
        errors.Folio = "El Folio del producto es necesario";
    } else if (Folio.length > 40) {
        errors.Folio = "El Folio debe ser menor a 40 caracteres";
    }
    return errors;
}
const validateSerie = (Serie) => {
    const errors = {};
    if (Serie === "") {
        errors.Serie = "La Serie del producto es necesaria";
    } else if (Serie.length > 25) {
        errors.Serie = "La Seriedebe ser menor a 25 caracteres";
    }
    return errors;
}
const validateConceptos = (conceptos) => {
    const errors = {};
    if (conceptos.length <= 0) {
        errors.Conceptos = "Debe de existir al menos un concepto dentro de la factura";
    }
    return errors; // on conceptor
}
const validateCuenta = (cuenta) => {
    const errors = {};
    if (cuenta.Total < 0) {
        errors.cuenta = "El Total no debe contener valores negativos";
    }
    if (cuenta.SubTotal < 0) {
        errors.cuenta = "El Subtotal no debe contener valores negativos";
    }
    if (cuenta.Descuento > cuenta.SubTotal) {
        errors.cuenta = "El Descuento debe ser menor o igual a Subtotal";
    }
    return errors; // on conceptor
}
const validateEmisor = (obj) => {
    const errors = {};

    if (obj.RFC == "") {
        errors.Emisor = "Seleccione un Emisor";
    }
    return errors;
};
const validateReceptor = (obj) => {
    const errors = {};
    //console.log("CLIENTE: ", obj);
    if (obj.RFC == "") {
        errors.Receptor = "Seleccione un Cliente";
    }
    return errors;
};


export const validateFactura = (formData, conceptos, emisor, receptor, cuenta) => {
    const errors = {};
    Object.assign(errors, validateReceptorCC(formData.ReceptorCC));
    Object.assign(errors, validateReceptorCCO(formData.ReceptorCCO));
    Object.assign(errors, validateEmailMensaje(formData.EmailMensaje));
    Object.assign(errors, validateFecha(formData.Fecha));
    Object.assign(errors, validateUsoCFDI(formData.UsoCFDI));
    Object.assign(errors, validateFolio(formData.Folio));
    Object.assign(errors, validateSerie(formData.Serie));
    Object.assign(errors, validateConceptos(conceptos));
    Object.assign(errors, validateEmisor(emisor));
    Object.assign(errors, validateReceptor(receptor));
    /*
    Object.assign(errors, validateTipoImpuesto(formData.Impuesto));
    Object.assign(errors, validateFactor(formData.Factor)); */
    // Object.assign(errors, validateTasa(formData.Tasa));

    return errors;
};
