import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
//Componente 
// tabla
import Table from '../../components/table.jsx';
//paginacion
import Pagination from "../../components/pagination.jsx";
//Selección
import SelectLimit from "../../components/selectLimit.jsx";
// Utils
import { getDataWithLength } from '../../utils/getData.js';

export default function IndexEmisor() {
    const navigate = useNavigate();
    const [datajson, setDatajson] = useState([]);
    const [datalen, setDataLength] = useState(0);
    const [loading, setLoading] = useState(true); // State to track loading state


    const [error, setError] = useState(null); // New state to hold error information
    const [page, setPage] = useState(1); // State to track current page
    const [limit, setLimit] = useState(10);
    const link = '/emisor';
    const link_update = link + '/updating/';
    const reactUptCli = link + "/forms";
    const id_column = "idEmisor";

    //Columnas que quiero ocultar pero que usare despues
    const hiddenColumns = ["idEmisor", 'Colonia', 'Calle', 'Contra', 'NumEx', 'NumIn', 'Colonia', 'Municipio', 'Estado'];
    const singleobject = {
        "Calle": "",//variable value
        "NumEx": "", //variable value
        "NumIn": "", //variable value

        "Municipio": "", //variable value
        "Estado": "",//variable value
        "Colonia": "",//variable value

        'csd': null, //file
        'key': null, //file
        'pass': null,//file
        'img': null,//file

        "CP": "", //variable value
        "RFC": "", //variable value
        "RazonSoc": "", //variable value
        "Regimen": "",//variable value
    };


    let totalPage = datalen === 0 ? 1 : Math.ceil(datalen / limit);

    let pageNo;

    if (page <= totalPage) {
        pageNo = page;
    } else {
        setPage(totalPage);
        pageNo = page;
    }

    const fetchData = () => {
        setLoading(true);
        console.log("Fetching data...");
        getDataWithLength(link, page, limit)
            .then(({ data, dataLength }) => {
                // console.log("Data fetched function:", data);
                setDatajson(data);
                setDataLength(dataLength);
                setLoading(false);
                return data;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError(error);
                setLoading(false);
            });
    };

    function handlePageChange(value) {
        if (value === "&laquo;" || value === "... ") {
            setPage(1);
        }
        else if (value === "&lsaquo;") {
            if (page !== 1) {
                setPage(page - 1);
                console.log("this minus 1")
            }

        } else if (value === "&rsaquo;") {
            if (page !== totalPage) {
                setPage(page + 1);
            }
        } else if (value === "&raquo;" || value === " ...") {
            setPage(totalPage);
        } else {
            setPage(value);
        }
    }
    function HandleCreate() {
        navigate(reactUptCli, {
            state: {
                singleobject, api_url: link,
                api_update: link_update, type: "create",
                id: "none", return_url: link,
                title: 'Crear nuevo Emisor'
            }
        });
    }

    useEffect(() => {
        fetchData();
    }, [page, limit]); // Trigger fetch data whenever page changes

    if (loading) {
        return (
            <div className="loading-message">
                <div className="loading-spinner"></div>
                Cargando...
            </div>
        );
    }

    if (error) {
        return <div className="error-main-message">Error: {error.message}</div>;
    }

    return (
        <div className="container" >
            <div className="header-title">
            <h2>Gestión de Emisores</h2>
                <button onClick={() => HandleCreate()} className="btn btn-primary">Nuevo Emisor</button>
            </div>
            <Table datos={datajson} updateRoute={reactUptCli}
                apiUpdate={link_update} apiDelete={link+'/'} id={id_column} linkColumns={['']}
                HideColumns={hiddenColumns} returnURL={link} title='Actualizar Emisor' />
            <div className="pagination-container">  
                <SelectLimit onLimitChange={setLimit} limit_Value={limit} />
                <Pagination totalPage={totalPage} page={pageNo} limit={limit} siblings={1} onPageChange={handlePageChange} />
            </div>
        </div>
    );
}