import React from 'react';

function InputField({ typefield, label, id, name, value, placeholder, onChange, error }) {

  const handleChange = (event) => {

    let { name, value } = event.target;
    //console.log("inputfield", value)
    const splitName = name.split('.'); // Split fieldName into section and field
    // Se define si el valor esta anidado
    if (splitName.length > 1) {
      onChange(splitName[0], splitName[1], value);
    } else {
      onChange(event);
    }
  };


  return (
    <div className="input-simple">
      <label htmlFor={id} className="form-label">{label}</label>
      <input
        type={typefield}
        className="form-control inputfield"
        name={name}
        value={value}
        onInput={handleChange} // Handle typing and pasting
        onChange={handleChange} // Ensure onChange is also triggered
        placeholder={placeholder}
      />
      {error !== "" && <div className="text-danger">{error}</div>}
    </div>
  );
}

export default InputField;
