import React, { useState, useEffect } from 'react';

function Dropdown({ id, label, presentedValues, realValues, selectedValue, onChange }) {
  const [selected, setSelected] = useState(selectedValue);
  
  const handleChange = (e) => {
    //Creamos un evento sintetico para enviar al metodo que no es anidado
    const syntheticEvent = {
      target: {
        name: e.target.name,
        value: e.target.value
      }
    };
    //Definimos el valor del componente
    setSelected(e.target.value);
    ///definimos la seccion y el campoF¿
    const splitName = id.split('.');

    // Se define si el valor esta anidado
    if (splitName.length > 1) {
      onChange(splitName[0], splitName[1], e.target.value);

    } else { // Si no es un campo anidado solo se envia el valor sintetico
      onChange(syntheticEvent);
    }

  };
  useEffect(() => {
    setSelected(selectedValue);
  }, [selectedValue]);

  return (
    <div className="input-dropdown">
      <label htmlFor={id}>{label}</label>
      <select className='dropdown-selector' name={id} value={selected} onChange={handleChange}>
        {presentedValues.map((value, index) => (
          //Como la lista de valores presentados y valores reales tienen el mismo tamaño entonces no hay problema en usar el index
          <option key={index} value={realValues[index]}>
            {value}
          </option>
        ))}
      </select>
    </div>

  );
}



export default Dropdown;
