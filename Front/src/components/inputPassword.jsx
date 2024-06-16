import React, { useState } from 'react';

const InputPassword = ({ labelTitle, fieldName, setPassword, stateMessage, mode }) => {
    const mensajes = stateMessage;
    const [isActive, setIsActive] = useState(false);
    const [labelDescription, setLabelDescription] = useState(stateMessage[mode == 'update' ? 0 : 1]);

    const handleToggle = () => {
        console.log("Estado actual del toggle: ", isActive);
        setIsActive(!isActive);
        setLabelDescription(stateMessage[isActive ? 0 : 1]);
        setPassword(null, fieldName);
    };

    const handlePasswordChange = (event) => {
        const newPassword = event.target.value;
        setPassword(newPassword, fieldName);
    };

    return (
        <div className="mb-3">
            <label className="form-label">{labelTitle}</label>
            {mode === 'update' && (
                <div className="form-check form-switch">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="passwordToggle"
                        checked={isActive}
                        onChange={handleToggle}
                    />
                    <label className="form-check-label" htmlFor="passwordToggle">
                        {labelDescription}
                    </label>
                </div>
            )}
            {isActive || mode === 'create' ? (
                <input
                    className="form-control-password"
                    type="password"
                    onChange={handlePasswordChange}
                />
            ) : (
                <label className="form-label">********</label>
            )}
        </div>
    );
};

export default InputPassword;
