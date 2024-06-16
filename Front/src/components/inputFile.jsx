import React, { useState } from 'react';

const InputFile = ({ mode, labelTitle, fileRoute, fieldName, fileExtension, setFile, stateMessage }) => {
  const mensajes = stateMessage;
  // Por default elegir actualizar archivos es falso
  const [isActive, setIsActive] = useState(false);
  const [labelDescription, setLabelDescription] = useState(mode == 'create' ? mensajes[1] : mensajes[0]);

  const handleToggle = () => {
    console.log("Estado actual del toggle: ", isActive);
    setIsActive(!isActive);
    //Si es true, entonces hacer null el archivo
    setLabelDescription(stateMessage[isActive ? 0 : 1]);
    setFile(null, fieldName);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile, fieldName);
  };

  return (
    <div className="mb-3">
      <label className="form-label">{labelTitle}</label>
      {mode === 'update' && (
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="flexSwitchCheckDefault"
            checked={isActive}
            onChange={handleToggle}
          />
          <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
            {labelDescription}
          </label>
        </div>
      )}
      {isActive || mode === 'create' ? (
        <input
          className="form-control input-file bg-primary bg-opacity-10 text-info"
          accept={fileExtension}
          type="file"
          onChange={handleFileChange}
        />
      ) : ( //Si el modo es create entonces es obligatorio recibir archivos
        <label className="form-label-route">{fileRoute}</label>
      )}
    </div>
  );
};

export default InputFile;
