const validateNombre = (Nombre) => {
    const errors = {};
    if (Nombre === "") {
        errors.Nombre = "El nombre del producto es necesario";
    } else if (Nombre.length > 45) {
        errors.Nombre = "El nombre debe ser menor a 45 caracteres";
    } else if (Nombre.length < 2) {
        errors.Nombre = "El nombre debe ser mayor a 3 caracteres";
    }
    return errors; 
}
/*
const validateTipo = (Tipo) => {
    const errors = {};
    if (Tipo === "" || Tipo === 0) {
        errors.Tipo = "El tipo de impuesto es necesario";
    } else if (Tipo !== "1" || Tipo !== "2") {
        console.log("Error Tipo: ",Tipo);
        errors.Tipo = "Elija una de las opciones listadas ";
    } 
    return errors; 
}

const validateTipoImpuesto = (Impuesto) => {
    const errors = {};
    if (Impuesto === "" || Impuesto === 0) {
        errors.Impuesto = "El Impuesto es necesario";
    } else if (Impuesto != 1 ||Impuesto != 2 ||Impuesto != 3) {
        errors.Impuesto = "Elija una de las opciones listadas ";
    } 
    return errors; 
}

const validateFactor = (Factor) => {
    const errors = {};
    if (Factor == "" || 0) {
        errors.Factor = "El tipo de impuesto es necesario";
    } else if (Factor != 1 ||Factor != 2) {
        errors.Factor = "Elija una de las opciones listadas ";
    } 
    return errors; 
}
*/
const validateTasa = (Tasa) => {
    const errors = {};
    const parsedTasa = parseFloat(Tasa); 
     if (!(parsedTasa >= 0)) {
        errors.Tasa = "El valor de Tasa debe ser mayor o igual que cero";
    } else if (!/^\d{1,6}\.\d{6}$/.test(Tasa)) {
        errors.Tasa = "El Tasa debe tener el formato correcto con 6 decimales. Por ejemplo: 0.265000";
    }
    return errors; 
  }


  
export const validateImpuesto = (formData) => {
    const errors = {};
    Object.assign(errors, validateNombre(formData.Nombre));
    /*Object.assign(errors, validateTipo(formData.Tipo));
    Object.assign(errors, validateTipoImpuesto(formData.Impuesto));
    Object.assign(errors, validateFactor(formData.Factor)); */
    Object.assign(errors, validateTasa(formData.Tasa));
    
    return errors;
};

// "Nombre": "",
// "Tipo": 1,
// "Impuesto": 1,
// "Factor": 1,
// "Tasa": 0.0