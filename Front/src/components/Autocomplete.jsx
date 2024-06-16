
import axiosClient from '../axios-client';
import React, { useState, useEffect } from 'react';

function Autocomplete({ htmlFor, label, apiUrl, fieldName, onSelect, placeholder, value }) {
    const [inputValue, setInputValue] = useState(value);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false); // State to track loading status

    useEffect(() => {
        // Update inputValue when the value prop changes
        setInputValue(value);
    }, [value]);

    
    //2.- Obtener datos
    const fetchSuggestions = (query) => {
        setLoading(true); // Set loading to true when fetching suggestions
        axiosClient.get(apiUrl, { params: { Texto: query } })
            .then(response => {
                setSuggestions(response.data.data);
                setLoading(false); // Set loading to false when suggestions are fetched
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false); // Set loading to false if there's an error
                throw error;
            });
    }

    // 1.- se ingresa texto
    const handleInputChange = (e) => {
        const value = e.target.value;
        // se define el valor
        setInputValue(value);
        //agregar sugerencias

        if (value !== "") {
            fetchSuggestions(value);
        }

    };
    // 3.- Se gestiona la opcion seleccionada
    const handleSelectSuggestion = (suggestion) => {
        const syntheticEvent = {
            target: {
                name: fieldName, // Set the name property to the fieldName
                value: suggestion.id, // Set the value property to the selected suggestion's ID
                texto: suggestion.texto
            }
        };
        // se define el valor que se utilizara
        setInputValue(suggestion.id);
        setSuggestions([]);

        const splitName = fieldName.split('.'); // Split fieldName into section and field
        // Se define si el valor esta anidado
        if (splitName.length > 1) {
            onSelect(splitName[0], splitName[1], suggestion.id);
        } else {
            //Se envia el evento sintetico a la función padre cuando no esta anidado
            onSelect(syntheticEvent);
        }
    };

    return (
        <div className="mb-3" >
            <div className="dropdown autocomplete ">
                <label htmlFor={htmlFor} className="form-label">{label}</label>
                <input
                    type="text"
                    value={inputValue}
                    onInput={handleInputChange}
                    className="form-control dropdown-toggle text-white bg-primary bg-opacity-10  border-dark"
                    placeholder={placeholder}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                />
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                {loading && <li className="dropdown-item">Buscando...</li>}
                    {suggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSelectSuggestion(suggestion)} className="dropdown-item">
                            {suggestion.clavetext}
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
}

export default Autocomplete;
