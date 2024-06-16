import axiosClient from "../../axios-client";

const checkIfExists = async (value, apiUrl) => {
    try {
        const response = await axiosClient.get(apiUrl, { params: { Clave: value } });
        console.log(response.data);
        return response.data.message;
    } catch (error) {
        return error.message;
    }
};



const validateCantidad = (Cantidad) => {
    const errors = {};
    if (Cantidad <= 0) {
        errors.Cantidad = "La cantidad debe ser mayor a 0";
        return errors;
    }
    return errors;
}

const validateCodigoUnidad = (CodigoUnidad) => {
    const errors = {};
    if (CodigoUnidad === "") {
        errors.CodigoUnidad = "La clave SAT de la unidad es necesaria";
        return errors;
    }
    /* Implementación futura para  
    const message = checkIfExists(CodigoUnidad, '/catalogos/check/unidad');
     if(message != 'OK'){
         errors.CodigoUnidad = message;
         return errors;
     }*/
    return errors;
}
const validateUnidad = (Unidad) => {
    const errors = {};
    if (Unidad === "") {
        errors.Unidad = "La descripción de la unidad es necesaria";
        return errors;
    }
    if (Unidad.length > 45) {
        errors.Unidad = "La descripción de la unidad debe ser menor a 45 caracteres";
    }
    return errors;
}
const validateCodigoProducto = (CodigoProducto) => {
    const errors = {};
    if (CodigoProducto === "") {
        errors.CodigoProducto = "La clave SAT del producto es necesaria";
    } else if (CodigoProducto.length > 10) {
        errors.CodigoProducto = "La clave SAT debe ser menor a 10 caracteres";
    } else if (CodigoProducto.length < 7) {
        errors.CodigoProducto = "La clave SAT debe ser mayor a 6 caracteres";
    }
    return errors;
}
const validateProducto = (Producto) => {
    const errors = {};
    if (Producto === "") {
        errors.Producto = "El Nombre del producto es necesario";
    } else if (Producto.length > 64) {
        errors.Producto = "El Nombre debe ser menor a 65 caracteres";
    } else if (Producto.length < 4) {
        errors.Producto = "El Nombre debe ser mayor a 4 caracteres";
    }
    return errors; 
} 

const validateDescuento = (Descuento, importe) => {
    const errors = {};
    if (Descuento < 0) {
        errors.Descuento = "El Descuento del Producto/Servicio debe ser mayor o igual a 0";
    }
    else if(Descuento > importe){
        errors.Descuento = `El Descuento debe ser menor o igual al importe calculado: $${importe}`;
    }
    return errors;
}

const validateObjetoDeImpuesto = (ObjetoDeImpuesto, impuestosArray) => {
    const errors = {};
    if (ObjetoDeImpuesto == '02' && impuestosArray.length <= 0) {
        errors.ObjetoDeImpuesto = "Si el producto es objeto de impuesto, debe seleccionar al menos una opción";
    }
    return errors; // on conceptor
}
const validateidProdServ = (idProdServ) => {
    const errors = {};
    if (idProdServ == "") {
        errors.idProdServ = "El Producto/Servicio debe estar registrado en el sistema";
    }
    return errors;
}
//Si el tipo de comprobante es de “I” (Ingreso), este valor debe ser mayor a cero. 
const validatePrecioUnitario = (PrecioUnitario) => {
    const errors = {};
    if (PrecioUnitario <= 0) {
        errors.PrecioUnitario = "El PrecioUnitario del Producto/Servicio debe ser mayor a 0";
    }
    return errors;
}
const validateImporte = (Importe) => {
    const errors = {};
    if (Importe <= 0) {
        errors.Importe = "El Importe del Producto/Servicio no debe ser negativo";
    }
    return errors;
}





export const validateConcepto = (objectConcepto, importe) => {
    const errors = {};
    Object.assign(errors, validateidProdServ(objectConcepto.idProdServ));
    Object.assign(errors, validateCantidad(objectConcepto.Cantidad));
    Object.assign(errors, validateCodigoUnidad(objectConcepto.CodigoUnidad));
    Object.assign(errors, validateUnidad(objectConcepto.Unidad));
    Object.assign(errors, validateCodigoProducto(objectConcepto.CodigoProducto));
    Object.assign(errors, validateProducto(objectConcepto.Producto));
    Object.assign(errors, validatePrecioUnitario(objectConcepto.PrecioUnitario));
    Object.assign(errors, validateImporte(importe)); 

    Object.assign(errors, validateDescuento(objectConcepto.Descuento, importe));
    Object.assign(errors, validateObjetoDeImpuesto(objectConcepto.ObjetoDeImpuesto,objectConcepto.Impuestos));
 
    return errors;
};
