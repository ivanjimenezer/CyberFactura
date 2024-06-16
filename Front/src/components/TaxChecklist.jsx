import React, { useState, useEffect } from 'react';
import axiosClient from '../axios-client';

const TaxChecklist = ({ show, onSelect }) => {
    // I want to reset to unchecked values when show is false 
    const [fetchedtaxes, setFetchedTaxes] = useState({ 'Description': 'Cargando'});
    const [arrayTaxes, setArrayTaxes] = useState([]);

    useEffect(() => {
        // Fetch taxes from the database
        // Replace the placeholder URL with your actual endpoint  
        axiosClient.get('/impuestos')
            .then(response => {
               console.log("fetching" , response.data);
                setFetchedTaxes(response.data); 
            })
            .catch(error => console.error('Error fetching taxes:', error)); 
    }, []);

    useEffect(() => {
        // Reset arrayTaxes when show changes
        if (!show) {
            setArrayTaxes([]);
            onSelect([]);
        }
    }, [show]);

    useEffect(() => {
        // if the array of selected taxes is changed then it will send the updated array to the father
        onSelect(arrayTaxes);
    }, [arrayTaxes]);

    const handleCheckboxChange = (tax) => {
        console.log("tax : ", tax);
        setArrayTaxes(prevArrayTaxes => {
            const index = prevArrayTaxes.findIndex(t => t.idImpuestos === tax.idImpuestos);
                //console.log("CHECK TACXES: ", prevArrayTaxes);
                let updatedArrayTaxes; 
                if (index !== -1) {
                    // If tax is already selected, remove it from arrayTaxes
                    updatedArrayTaxes = [...prevArrayTaxes];
                    updatedArrayTaxes.splice(index, 1);
                }else {
                    const newTax = {
                        "idImpuesto":tax.idImpuestos,
                        "TipoImpuesto":tax.Tipo,
                        "Impuesto": tax.Impuesto,
                        "Factor": tax.Factor,
                        "Base": "XXX",
                        "Tasa": tax.Tasa,
                        "ImpuestoImporte": "XXX",
                        "Description" : tax.Description
                    };
                updatedArrayTaxes = [...prevArrayTaxes, newTax];
            }
            // Call onSelect with the updated arrayTaxes - REMOVED 
        // Return the updated arrayTaxes
        return updatedArrayTaxes;
        }); 
    }; 
    // Conditional rendering based on the show prop
    if (!show) {
        return null;
    }
    return (
        <div className='tax-list'>
            {fetchedtaxes.map((tax, index) => (
                <div className='tax-item' key={index}>
                    <input className='check-tax' type="checkbox" onChange={() => handleCheckboxChange(tax)}/>
                    <label >
                         {tax.Description}
                    </label>
                </div>
            ))}
        </div>
    )
};

export default TaxChecklist;
