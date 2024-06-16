import React, { useState, useEffect } from 'react';
//Utils 
import { deleteElementUtil } from '../utils/delete';

function DeleteElementModal({ showDeleteModal, closeDeleteModal, url, id, onDeleteSuccess }) {

    //Mensajes de respuesta
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); 

    useEffect(() => {
        let successTimer;
        let errorTimer;

        if (successMessage) {
            // Set a timer to hide the success message after 2000 milliseconds (2 seconds)
            successTimer = setTimeout(() => {
                setSuccessMessage("");
            }, 2000);
        }

        if (errorMessage) {
            // Set a timer to hide the error message after 4000 milliseconds (4 seconds)
            errorTimer = setTimeout(() => {
                setErrorMessage("");
            }, 4000);
        }

        // Clear the timers when the component unmounts or when the messages change
        return () => {
            clearTimeout(successTimer);
            clearTimeout(errorTimer);
        };
    }, [successMessage, errorMessage]);


    const confirmDelete = async () => { // 3.- 
        setSuccessMessage("");
        setErrorMessage("");
        console.log("Id recibido en Modal (id): ", id);
        const objectDelete = await deleteElementUtil(url, id);

        if (objectDelete["status"] === "ok") {
            setSuccessMessage(objectDelete["message"]);
            //Re-renderizar la tabla
            onDeleteSuccess();  

        } else {
            setErrorMessage(objectDelete["message"]); 
            closeDeleteModal();
        }
        
    };

    return (
        <div className='contenedor'>
            {successMessage && <div className="alert alert-success success-message">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {showDeleteModal && (
                <div className="modal">
                    <div className="modal-content">
                        <p>El elemento seleccionado no podrá eliminarse si está siendo utilizado en una factura o una cotización.</p>
                        <p>Si está siendo utilizado solo se podrá actualizar el elemento</p>
                        <p>¿Estás seguro de que quieres eliminar este elemento?</p>
                        <div>
                            <button onClick={confirmDelete} className="btn btn-danger">Sí</button>
                            <button onClick={closeDeleteModal} className="btn btn-secondary">No</button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
}

export default DeleteElementModal;
