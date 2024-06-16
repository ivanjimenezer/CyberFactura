import React, { useState } from 'react';
import axiosClient from '../axios-client';

export default function EmiRecepAutocomplete({ tipo, label, apiUrl, formData, onSelect, placeholder, value, paramName, showsuggestion }) {
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false); // State to track loading status

    // 1.- Escribimos el input para buscar clientes
    const handleInputChange = (e) => {
        const value = e.target.value;
        // se define el valor
        setInputValue(value);
        //agregar sugerencias 
        if (value !== "") {
            fetchSuggestions(value);
        }
    };

    //2.- Obtener datos
    const fetchSuggestions = async (query) => {
        try {
            setLoading(true);
            const params = {};
            params[paramName] = query;
            const response = await axiosClient.get(apiUrl, { params });
            // console.log(apiUrl," : ",response.data);
            setLoading(false);
            setSuggestions(response.data.data);
        } catch (error) {
            setLoading(false);
            console.error('Error al intentar obtener datos:', error);
            throw error; // Throw the error to handle it in the component
        }
    };

    // 3.- Se gestiona la opcion seleccionada
    const handleSelectSuggestion = (suggestion) => {
        // se define el valor que se utilizara
        setInputValue("");
        setSuggestions([]);
        // Send the object to the parent and create the labels
        onSelect(suggestion, tipo);
    };

    return (
        <div className="mb-3" >
            <div className="dropdown autocomplete">
                <label className="form-label">{label}</label>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="form-control dropdown-toggle text-white bg-primary bg-opacity-10  border-dark"
                    placeholder={placeholder}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                />
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                {loading && <li className="dropdown-item">Buscando...</li>}
                    {suggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSelectSuggestion(suggestion)} className="dropdown-item">
                            {suggestion[showsuggestion]}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );

}