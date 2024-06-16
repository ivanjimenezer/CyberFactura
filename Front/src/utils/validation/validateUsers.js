
const validatenombre = (nombre) => {
    const errors = {};
    if (nombre === "") {
        errors.nombre = "El nombre del usuario es necesario";
    } else if (nombre.length > 45) {
        errors.nombre = "El nombre debe ser menor a 45 caracteres";
    } else if (nombre.length < 2) {
        errors.nombre = "El nombre debe ser mayor a 3 caracteres";
    }
    return errors;
}

const validateEmail = (email) => {
    const errors = {};
    if (email === "") {
        return errors;
    } else if (email.length > 45) {
        errors.email = "El email debe ser menor a 65 caracteres";
    } else if (email.length < 6) {
        errors.email = "El email debe ser mayor a 6 caracteres";
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(email)) {
        errors.email = "El email no tiene un formato válido";
    }
    return errors;
}

const validatepassword = (password, accion) => {
    const errors = {};
    console.log("validate pass: ", password, " acc: ", accion);
        if (password == "" || password == null) { // Checks for empty or null
        if (accion === 'update') {
            return errors;
        }
        else {
            errors.password = "La contraseña es necesaria";
            return errors;
        }
    } else {
        const lengthCheck = password.length > 8;
        const numberCheck = /[0-9]/.test(password);
        const symbolCheck = /[!@#$%^&*(),.?":{}|_<>\-]/.test(password); 
        const uppercaseCheck = /[A-Z]/.test(password);

        if (!lengthCheck) {
            errors.password = "La contraseña debe ser mayor a 8 caracteres";
        } else if (!numberCheck) {
            errors.password = "La contraseña debe contener al menos un número";
        } else if (!symbolCheck) {
            errors.password = "La contraseña debe contener al menos un símbolo";
        } else if (!uppercaseCheck) {
            errors.password = "La contraseña debe contener al menos una letra mayúscula";
        }
    }

    return errors;
};

const validatePassword_confirmation = (password, password_confirmation) => {
    const errors = {};
    if (password !== password_confirmation) {
        errors.password_confirmation = "Las contraseñas no coinciden";
    }
    return errors;
}

export const validateUsers = (formData, accion) => {
    const errors = {};
    Object.assign(errors, validatenombre(formData.name));
    Object.assign(errors, validateEmail(formData.email));
    Object.assign(errors, validatepassword(formData.password, accion));
    Object.assign(errors, validatePassword_confirmation(formData.password, formData.password_confirmation));

    return errors;
};