const validateRFC= (RFC) => {
    const errors = {};
    if (RFC === "") {
        errors.RFC = "El RFC es necesario";
    } else if (RFC.length > 14) {
        errors.RFC = "El RFC debe ser menor a 14 caracteres";
    } else if (RFC.length < 12) {
        errors.RFC = "El RFC debe ser mayor a 12 caracteres";
    }
    return errors;
}

const validateRazonSoc = (RazonSoc) => {
    const errors = {};
    if (RazonSoc === "") {
        errors.RazonSoc = "La Razón Social es necesaria";
    } else if (RazonSoc.length > 45) {
        errors.RazonSoc = "La Razón Social debe ser menor a 45 caracteres";
    } else if (RazonSoc.length < 10) {
        errors.RazonSoc = "La Razón Social debe ser mayor a 10 caracteres";
    } else if (!/^[A-Z\s]+$/.test(RazonSoc)) {
        errors.RazonSoc = "La Razón Social debe estar en mayúsculas";
    }

    return errors;
}

const validateRegimen = (Regimen) => {
    const errors = {};
    if (Regimen === "") {
        errors.Regimen = "El Regimen Fiscal es necesario";
    } else if (Regimen.length > 4) {
        errors.Regimen = "El Regimen Fiscal debe ser menor a 4 caracteres";
    } else if (Regimen.length < 2) {
        errors.Regimen = "El Regimen Fiscal debe ser mayor a 2 caracteres";
    }
    return errors;
}

const validateCorreo = (Correo) => {
    const errors = {};
    if (Correo === "") {
        return errors;
    } else if (Correo.length > 45) {
        errors.Correo = "El Correo debe ser menor a 45 caracteres";
    } else if (Correo.length < 6) {
        errors.Correo = "El Correo debe ser mayor a 6 caracteres";
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(Correo)) {
        errors.Correo = "El Correo no tiene un formato válido";
    }
    return errors;
}

const validateCalle = (Calle) => {
    const errors = {};
    if (Calle === "" || Calle == null) {
        return errors;
    } else if (Calle.length > 55) {
        errors.Calle = "La Calle debe ser menor a 55 caracteres";
    } else if (Calle.length < 1) {
        errors.Calle = "La Calle debe ser mayor a 1 carácter";
    }
    return errors;
}

const validateEstado = (Estado) => {
    const errors = {};
    if (Estado == "" || Estado == null ) {
        return errors;
    } else if (Estado.length > 45) {
        errors.Estado = "La Estado debe ser menor a 45 caracteres";
    } else if (Estado.length < 2) {
        errors.Estado = "La Estado debe ser mayor a 2 carácter";
    }
    return errors;
}

const validateColonia = (Colonia) => {
    const errors = {};
    if (Colonia === "" || Colonia == null) {
        return errors;
    } else if (Colonia.length > 45) {
        errors.Colonia = "La Colonia debe ser menor a 45 caracteres";
    } else if (Colonia.length < 2) {
        errors.Colonia = "La Colonia debe ser mayor a 2 caracteres";
    }
    return errors;
}

const validateMunicipio = (Municipio) => {
    const errors = {};
    if (Municipio === "" || Municipio == null) {
        return errors;
    } else if (Municipio.length > 45) {
        errors.Municipio = "La Municipio debe ser menor a 45 caracteres";
    } else if (Municipio.length < 1) {
        errors.Municipio = "La Municipio debe ser mayor a 1 carácter";
    }
    return errors;
}

const validateNumIn = (NumIn) => {
    const errors = {};
    if (NumIn === ""|| NumIn == null) {
        return errors;
    } else if (NumIn.length > 10) {
        errors.NumIn = "La NumIn debe ser menor a 10 caracteres";
    } 
    return errors;
}

const validateNumEx = (NumEx) => {
    const errors = {};
    if (NumEx === ""|| NumEx == null) {
        return errors;
    } else if (NumEx.length > 10) {
        errors.NumEx = "La NumEx debe ser menor a 10 digitos";
    }  
    return errors;
}

const validateCP = (CP) => {
    const errors = {};
    if (CP === "") {
        errors.CP = "El Codigo Postal es necesario";
    } else if (CP.length > 10) {
        errors.CP = "El Codigo Postal debe ser menor a 10 caracteres";
    } else if (CP.length < 3) {
        errors.CP = "El Codigo Postal debe ser mayor a 3 caracteres";
    }
    return errors;
}

export const validateCliente = (formData) => {
    const errors = {}; 
    Object.assign(errors, validateRFC(formData.RFC));
    Object.assign(errors, validateRazonSoc(formData.RazonSoc));
    Object.assign(errors, validateRegimen(formData.Regimen));
    Object.assign(errors, validateCorreo(formData.Correo));
    Object.assign(errors, validateCalle(formData.Calle));
    Object.assign(errors, validateEstado(formData.Estado));
    Object.assign(errors, validateCP(formData.CP));
    Object.assign(errors, validateColonia(formData.Colonia));
    Object.assign(errors, validateMunicipio(formData.Municipio));
    Object.assign(errors, validateNumIn(formData.NumIn));
    Object.assign(errors, validateNumEx(formData.NumEx)); 
    return errors; 
};


