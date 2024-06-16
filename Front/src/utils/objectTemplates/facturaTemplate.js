const now = new Date(); // Get the current date and time
const fiveHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000); // Subtract 5 hours in milliseconds

const isoDate = fiveHoursAgo.toISOString().slice(0, 19); // Convert to ISO format and remove seconds and microseconds
console.log('fecha inicial', isoDate);

export const initialReceptor = {
    "idCliente": "",

    "RazonSoc": "",
    "RFC": "",
    "Regimen": "",
    "Correo": "",

    "Calle": "",
    "NumIn": "",
    "NumEx": "", 
    "Municipio": "",
    "Estado": "",
    "Colonia": "",
    "CP": "",

}

export const initialEmisor = {
    "idEmisor": "",

    "RazonSoc": "",
    "RFC": "", 
    "Regimen": "",

    "Calle": "",
    "NumEx": "",
    "NumIn": "",
    "Municipio": "",
    "Estado": "",
    "Colonia": "",
    "CP": "",
};



export const initialFormData = {
    //DatosGenerales
    "Version": "4.0",
    "CSD": "",
    "LlavePrivada": "",
    "CSDPassword": "",
    "GeneraPDF": true,
    "UsarLogo": true,
    "Logotipo": "",
    "CFDI": "Factura",
    "OpcionDecimales": "1",
    "NumeroDecimales": "2",
    "TipoCFDI": "Ingreso",
    "EnviaEmail": false,
    "ReceptorEmail": "",
    "ReceptorCC": "",
    "ReceptorCCO": "",
    "EmailMensaje": "",

    // Encabezado
    "CFDIsRelacionados": "",
    "TipoRelacion": "04",

    //De Receptor
    "UsoCFDI": "",

    "Fecha": isoDate,
    "Serie": "",
    "Folio": "",
    "MetodoPago": "PUE",
    "FormaPago": "01",
    "Moneda": "MXN",
    "LugarExpedicion": "",
    "SubTotal": "",
    "Total": ""
};

export const errorsGeneral = {
    "Version": "4.0",
    "CSD": "",
    "LlavePrivada": "",
    "CSDPassword": "",
    "GeneraPDF": true,
    "UsarLogo": "",
    "Logotipo": "",
    "CFDI": "",
    "OpcionDecimales": "1",
    "NumeroDecimales": "2",
    "TipoCFDI": "Ingreso",
    "EnviaEmail": false,
    "ReceptorEmail": "",
    "ReceptorCC": "",
    "ReceptorCCO": "",
    "EmailMensaje": "",

    // Encabezado
    "CFDIsRelacionados": "",
    "TipoRelacion": "",
    //receptor
    "UsoCFDI": "",

    "Fecha": "",
    "Serie": "",
    "Folio": "",
    "MetodoPago": "",
    "FormaPago": "",
    "Moneda": "",
    "LugarExpedicion": "",
    "SubTotal": "",
    "Total": "",
    "Conceptos":"",
    "Emisor":"",
    "Receptor":""
};