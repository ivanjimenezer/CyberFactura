import axiosClient from "../axios-client.js";
import { Link } from "react-router-dom";

import { useStateContext } from "../context/ContextProvider.jsx";

import React, { useState, useEffect } from 'react';
//Components
import SalesChart from "../components/Charts/SalesChart.jsx";
import TopProductsChart from "../components/Charts/TopProducts.jsx";
import TopClientsChart from "../components/Charts/TopClient.jsx";
import RetencionSalesHistogram from "../components/Charts/ConRET.jsx";
import IVASalesHistogram from "../components/Charts/ConIVA.jsx";

export default function Dashboard() {

    //setear los hooks useState
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});

    //valor que se considera para filtrar
    const [search, setSearch] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);

    const [message, setMessage] = useState(null);


    const showData = () => {
        //---------------------------------------
        axiosClient.get('/stats')
            .then(Response => {
                //console.log("Responde: ", Response);
                setData(Response.data);
                setLoading(false);
                return;
            })//en caso de atrapar algun error
            .catch(error => {

                console.error('Error fetching data on resumen:', error);
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    const errorMessageString = JSON.stringify(error.response.data.error);
                    setErrorMessage(`Error de servidor: ${errorMessageString}`);
                } else if (error.request) {
                    // The request was made but no response was received
                    setErrorMessage('No se puede conectar al servidor. Intentelo de nuevo más tarde.');
                } else {
                    // Something happened in setting up the request that triggered an Error
                    setErrorMessage(`Error: ${error.message}`);
                }
                setLoading(false);
            });
    }

    useEffect(() => {
        showData()
    }, [])

    // Check if data for each chart is empty
    const salesDataIsEmpty = !data.Ventas || data.Ventas.length === 0;
    const topProductsDataIsEmpty = !data.TopItems || data.TopItems.length === 0;
    const topClientsDataIsEmpty = !data.TopClients || data.TopClients.length === 0;
    const retencionSalesDataIsEmpty = !data.ConRET || data.ConRET.length === 0;
    const ivaSalesDataIsEmpty = !data.ConIVA || data.ConIVA.length === 0;

    if (loading) {
        return (
            <div className="loading-message">
                <div className="loading-spinner"></div>
                Cargando Gráficos...
            </div>
        );
    }

     if (errorMessage) {
         return <div className="error-main-message">Error: {errorMessage}</div>;
   }
    //renderizamos la vista
    return (
        <div className='dashboard'>
            <div className='chart-section'>
                <div className='chart-row'>
                    {!salesDataIsEmpty ? (
                        <SalesChart salesData={data.Ventas} />
                    ) : (
                        <div className="chartplot">
                            <h3 className="chart-message">No hay datos suficientes para crear el gráfico de ventas.</h3>
                        </div>
                    )}
                    
                    {!topClientsDataIsEmpty ? (
                        <TopClientsChart topClients={data.TopClients} />
                    ) : (
                        <div className="chartplot">
                            <h3 className="chart-message">No hay datos suficientes para crear el gráfico de los clientes principales.</h3>
                        </div>
                    )}
                </div>
                <div className='chart-row'>
                {!topProductsDataIsEmpty ? (
                        <TopProductsChart topProducts={data.TopItems} />
                    ) : (
                        <div className="chartplot">
                            <h3 className="chart-message">No hay datos suficientes para crear el gráfico de los productos más vendidos.</h3>
                        </div>
                    )}
                    {!ivaSalesDataIsEmpty ? (
                        <IVASalesHistogram retencionSales={data.ConIVA} />
                    ) : (
                        <div className="chartplot">
                            <h3 className="chart-message">No hay datos suficientes para crear el gráfico de ventas con IVA.</h3>
                        </div>
                    )}
                    {!retencionSalesDataIsEmpty ? (
                        <RetencionSalesHistogram retencionSales={data.ConRET} />
                    ) : (
                        <div className="chartplot">
                            <h3 className="chart-message">No hay datos suficientes para crear el gráfico de ventas con retención.</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

}