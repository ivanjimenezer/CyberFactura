const validateClaveSAT = (ClaveSAT) => {
    const errors = {};
    if (ClaveSAT === "") {
        errors.ClaveSAT = "La clave SAT del producto es necesaria";
    } else if (ClaveSAT.length > 10) {
        errors.ClaveSAT = "La clave SAT debe ser menor a 10 caracteres";
    } else if (ClaveSAT.length < 7) {
        errors.ClaveSAT = "La clave SAT debe ser mayor a 6 caracteres";
    }
    return errors;
}

const validateClaveUnidadSAT = (ClaveUnidadSAT) => {
    const errors = {};
    if (ClaveUnidadSAT === "") {
        errors.ClaveUnidadSAT = "La clave SAT de la unidad es necesaria";
    }
    return errors;
}

const validateNombre = (Nombre) => {
    const errors = {};
    if (Nombre === "") {
        errors.Nombre = "El nombre del producto es necesario";
    } else if (Nombre.length > 64) {
        errors.Nombre = "El nombre debe ser menor a 65 caracteres";
    } else if (Nombre.length < 5) {
        errors.Nombre = "El nombre debe ser mayor a 4 caracteres";
    }
    return errors; 
} 

const validatePrecioUnitario = (PrecioUnitario) => {
    const errors = {};
    if (PrecioUnitario <= 0) {
        errors.PrecioUnitario = "El precio del Producto/Servicio debe ser mayor a 0";
    }
    return errors;
}

const validateClaveInv = (ClaveInv) => {
    const errors = {};
    if (ClaveInv === "") {
        errors.ClaveInv = "La Clave Inventario es necesaria";
    } else if (ClaveInv.length > 15) {
        errors.ClaveInv = "La Clave Inventario debe ser menor a 15 caracteres";
    } else if (ClaveInv.length < 4) {
        errors.ClaveInv = "La Clave Inventario debe ser mayor a 3 caracteres";
    }
    return errors;
}

export const validateProdServ = (formData) => {
    const errors = {};
    Object.assign(errors, validateClaveSAT(formData.ClaveSAT));
    Object.assign(errors, validateClaveUnidadSAT(formData.ClaveUnidadSAT));
    Object.assign(errors, validateNombre(formData.Nombre));
    Object.assign(errors, validatePrecioUnitario(formData.PrecioUnitario));
    Object.assign(errors, validateClaveInv(formData.ClaveInv));
    return errors;
};
