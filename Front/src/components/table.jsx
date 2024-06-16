//ProdServ  - ActualizarFree / Eliminar Si Factura (Advertir)
//Impuestos  - ActualizarFree/ Eliminar Si Factura (Advertir)
//Cliente  - ActualizarFree  / Eliminar Si Factura (Advertir)
//Emisor  - ActualizarFree   / Eliminar Si Factura (Advertir)

//Factura  - No Actualizar/ No Eliminar / Timbrar / ¿Guardar para despues?
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//Components
import DeleteElementModal from './deleteElementModal';


function Table({ datos, updateRoute, apiUpdate ,apiDelete, id, linkColumns ,HideColumns, title, returnURL}) {
    const navigate = useNavigate(); 
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingRow, setDeletingRow] = useState({}); 
    const [tableData, setTableData] = useState(datos); // State to hold table data 

    //Cerrar modal desde el componente padre
    const closeDeleteModal = () => {  
        setShowDeleteModal(false);
        setDeletingRow({});
    };

    if (!tableData || tableData.length === 0) {
        return <p className='no-content-message'>No existen datos disponibles a mostrar</p>;
    }
    // Extract column names from the first item in the datos array
    const columns = Object.keys(tableData[0]);

    // Function to determine if a column represents an ID field
    const isHiddenColumn = (columnName) => {
        // Check if the column name is included in the HideColumns array
        return HideColumns.includes(columnName);
    }; 
    
    // Determinar si los botones de eliminar o actualizar deberian mostrarse
    const shouldShowButtons = () => {
        return id != "idCfdi"; 
    };

    // Filter out ID columns from the list of columns
    const visibleColumns = columns.filter(column => !isHiddenColumn(column));

    const HandleUpdate = (row) => {
        console.log(row);
        let singleobject = row;
        console.log('single object: ', singleobject, 'api url: ', apiUpdate);
        // Redirect to the form page and pass the row data as state    
        navigate(updateRoute, { state: { singleobject, id: singleobject[id] , api_url: apiUpdate, return_url : returnURL, type:"update", title: title} });
    }

    //Abrir el modal y asignar valor al elemento que se eliminara
    const HandleDelete = (row) => {  
        console.log("row[id]: ",row[id]); 
        setDeletingRow(row);
        setShowDeleteModal(true); 
    }; 
    const handleDeleteSuccess = () => { 
        //quitar elemento eliminado de la tabla
        setTableData(prevData => prevData.filter(row => row[id] !== deletingRow[id]));  
        //ocultar modal
        setShowDeleteModal(false);
        //hacer vacio el elemento a eliminar
        setDeletingRow({});
    };
    return (
        <div className='table-container'> 
            <table className="custom-table">
                <thead>
                    <tr>
                        {visibleColumns.map((column, index) => (
                            <th key={index} scope="col">{column}</th>
                        ))}
                        {shouldShowButtons() && <th>Acción</th>}
                    </tr>
                </thead>
    
                <tbody>
                    {tableData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {visibleColumns.map((column, colIndex) => (
                                <td key={colIndex}>
                                    { linkColumns.includes(column) ? ( // Check if the column should be a link
                                        <a href={row[column]}  target="_blank" >{`Ver ${column}`}</a>
                                    ) : (
                                        row[column]
                                    )}
                                </td>
                            ))}
                            {shouldShowButtons() && ( // Render buttons if necessary
                                <td>
                                    <div className="button-container">
                                    <button onClick={() => HandleUpdate(row)} className="btn btn-update">Actualizar</button>
                                    <button onClick={() => HandleDelete(row)} className="btn btn-deleteItem">Eliminar</button>
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {/* Componente Modal de eliminacion de items*/}
            <DeleteElementModal 
                showDeleteModal={showDeleteModal} 
                closeDeleteModal={closeDeleteModal}  
                url={apiDelete} 
                id={deletingRow[id]}
                onDeleteSuccess={handleDeleteSuccess}
            /> 
        </div>
        
    );
    
}

export default Table;
