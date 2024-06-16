import React, { useState } from 'react';

const InputDateTime = ({ fieldName, handleChange, title, error, date }) => {
    // Obtenemos fecha y hora
    const now = new Date(); // Current date and time 
    const isoDate = now.toISOString().slice(0, 16);// Convertir el formato en ISO. Eliminar segundos y microsegundos
 
    // State to hold the selected date and time
    const [selectedDateTime, setSelectedDateTime] = useState(date);


    const handleInputChange = (event) => {
        
        let { name, value } = event.target; 
        
        setSelectedDateTime(value);

        value = value.concat(':00');  
        const splitName = name.split('.'); // Split fieldName into section and field
        
        handleChange(event);
       /* if (splitName.length > 1) {
            handleChange(splitName[0], splitName[1], value);
        } else {
            handleChange(null, splitName[0], value);
        }*/
    };

    return (
        <div className="input-datefield">
            <label className='form-label' htmlFor={fieldName}>{title}</label>
            <input
            className='input-datetime'
                type="datetime-local"
                id={fieldName}
                name={fieldName}
                value={selectedDateTime}
                onChange={handleInputChange}
            />
            {error !== "" && <div className="text-danger">{error}</div>}
        </div>
    );
};

export default InputDateTime;
