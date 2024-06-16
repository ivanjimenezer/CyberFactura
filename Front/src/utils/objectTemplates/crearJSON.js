export const createJSON = (formData, conceptosParent, formEmisor, formReceptor, cuenta) => {
    const JSON_File = {
        "DatosGenerales": {
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
            "EnviaEmail": true,
            "ReceptorEmail": formReceptor.Correo,
            "ReceptorCC": formData.ReceptorCC,
            "ReceptorCCO": formData.ReceptorCCO,
            "EmailMensaje": formData.EmailMensaje
        },
        "Encabezado": {
            "CFDIsRelacionados": "",
            "TipoRelacion": "",
            "Emisor": {
                "idEmisor": formEmisor.idEmisor,
                "RFC": formEmisor.RFC,
                "NombreRazonSocial": formEmisor.RazonSoc,
                "RegimenFiscal": formEmisor.Regimen,
                "Direccion": [
                    {   "Calle":formEmisor.Calle,
                        "NumeroExterior": formEmisor.NumEx,
                        "NumeroInterior": formEmisor.NumIn,
                        "CodigoPostal": formEmisor.CP,
                        "colonia": formEmisor.Colonia,
                        "municipio": formEmisor.Municipio,
                        "estado": formEmisor.Estado
                    }
                ]
            },
            "Receptor": {
                "idCliente": formReceptor.idCliente,
                "RFC": formReceptor.RFC,
                "NombreRazonSocial": formReceptor.RazonSoc,
                "UsoCFDI": formData.UsoCFDI,
                "DomicilioFiscalReceptor": formReceptor.CP,
                "RegimenFiscal": formReceptor.Regimen,
                "Direccion": 
                    {   "Calle":formReceptor.Calle,
                        "NumeroExterior": formReceptor.NumEx,
                        "NumeroInterior": formReceptor.NumIn,
                        "CodigoPostal": formReceptor.CP,
                        "colonia": formReceptor.Colonia,
                        "municipio": formReceptor.Municipio,
                        "estado": formReceptor.Estado
                    }
                
            },
            "Fecha": formData.Fecha,
            "Serie": formData.Serie,
            "Folio": formData.Folio,
            "MetodoPago": formData.MetodoPago,
            "FormaPago": formData.FormaPago,
            "Moneda": formData.Moneda,
            "LugarExpedicion": formEmisor.CP,

            "SubTotal": cuenta.SubTotal,
            "Descuento": cuenta.Descuento,
            'Retenciones': cuenta.Retenciones,
            'Traslados': cuenta.Traslados,
            "Total": cuenta.Total,
        },
        "Conceptos": conceptosParent
    };

    const jsonString = JSON.stringify(JSON_File);

    return jsonString; 

}