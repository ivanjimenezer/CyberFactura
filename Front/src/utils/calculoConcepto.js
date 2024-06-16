export default function calculateInvoiceTotals(conceptos) {
    // Si el objeto de impuesto es 04, debe de haber calculo de impuestos
    // si es 1,3,4 no importa si se deja vacio el array de impuestos o si de plano no existe Impuestos
    //Si es 02 y no hay impuestos, hay error
    //Si es 1,3,4 y hay impuestos entonces habra error

    //Si el factor del impuesto es Exento entonces no se aplica el impuesto sobre el importe o el subtotal,
    // se calcula pero como si no existiese

    let subtotal = 0;
    let descuentoCuenta = 0;
    let retenciones = 0;
    let traslados = 0;
    //console.log("calculcateinvoice: ", conceptos);


    // Calculate subtotals and taxes for each concept
    conceptos.forEach(concepto => {
        concepto.Traslados = 0.00; 
        concepto.Retenciones = 0.00;

        const importeConcepto = parseFloat(concepto.Importe);
        subtotal += importeConcepto;
        // Apply discount (if any) to the subtotal
        if (!concepto.hasOwnProperty('Descuento') || concepto.Descuento === "") {
            delete concepto.Descuento;
            descuentoCuenta += 0;
        } else {
            descuentoCuenta += parseFloat(concepto.Descuento);
        }
        const ObjetoDeImpuesto = concepto.ObjetoDeImpuesto;
        if (ObjetoDeImpuesto == "02") {
            //console.log("ObjetoDeImpuesto: ", concepto.ObjetoDeImpuesto);
            concepto.Impuestos.forEach(impuesto => {
                impuesto.Base = importeConcepto;
                let impuestoImporte = 0.0000;
                //Aplicar o no aplicar
                const factorImpuesto = parseInt(impuesto.Factor);
                // Si se aplica, como se aplica
                const tipoImpuesto = parseInt(impuesto.TipoImpuesto);
                // Valor que se aplica al impuesto
                const valorImpuesto = parseFloat(impuesto.Tasa);
                //| const impuestoImporte = parseFloat(impuesto.ImpuestoImporte);
                if (factorImpuesto !== 3) {
                    if (factorImpuesto == 1) {//tasa
                        impuestoImporte = importeConcepto * valorImpuesto;
                        impuesto.ImpuestoImporte = impuestoImporte.toFixed(2);
                    }
                    else { //cuota
                        impuestoImporte = valorImpuesto;
                        impuesto.ImpuestoImporte = impuestoImporte.toFixed(2);
                    }
                    if (tipoImpuesto === 1) { // Traslado 
                        concepto.Traslados = impuestoImporte;  
                        traslados += impuestoImporte;

                    } else if (tipoImpuesto === 2) { // Retención 
                        concepto.Retenciones = impuestoImporte;
                        retenciones += impuestoImporte;
                    }
                }


            });
        }
    });

    // Calculate total
    const total = subtotal - retenciones - descuentoCuenta + traslados;
    //console.log("descuento cuenta: ",descuentoCuenta);
    return {
        "Conceptos":conceptos,

        "Cuenta": {
            SubTotal: subtotal.toFixed(2),
            Descuento: descuentoCuenta.toFixed(2),
            Retenciones: retenciones.toFixed(2),
            Traslados: traslados.toFixed(2),
            Total: total.toFixed(2)
        }
    };
}
/*
[
    {},
    {},
    {}
]
*/

// Example usage:
const conceptos = [
    {
        "Cantidad": "1",
        "CodigoUnidad": "E48",
        "Unidad": "Servicio",
        "Descuento": "50",
        "CodigoProducto": "84111506",
        "Producto": "Timbres de Facturacion",
        "PrecioUnitario": "100",
        "Importe": "100",
        "ObjetoDeImpuesto": "02",
        "Impuestos": [
            {
                "TipoImpuesto": "1",
                "Impuesto": "2",
                "Factor": "1",
                "Base": "100",
                "Tasa": "0.160000",
                "ImpuestoImporte": "16"
            }
        ]
    },
    // Additional concept objects
];

