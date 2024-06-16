import React from "react";
import { paginationRange } from "../utils/paginationRange";

function Pagination(props){
    let array = paginationRange(props.totalPage, props.page, props.limit, props.siblings);
    return (
<ul className="pagination pagination-md justify-content-end">
    <li onClick={() => props.onPageChange("&laquo;")}   className="page-item">
        <span className="page-link">&laquo;</span>
    </li>
    <li onClick={() => props.onPageChange("&lsaquo;")}  className="page-item">
        <span className="page-link">&lsaquo;</span>
    </li>
    {array.map(value =>  { 
        if(value === props.page){
            return(
                <li key={value} className="page-item-active">
                    <span onClick={() => props.onPageChange(value)} className="page-link active">{value}</span>
                </li>
            )
        } else{
            return (
                <li key={value} className="page-item">
                    <span onClick={() => props.onPageChange(value)}  className="page-link">{value}</span> 
                </li>
            )
        }
    })} 
    <li className="page-item">
        <span onClick={() => props.onPageChange("&rsaquo;")}  className="page-link">&rsaquo;</span>
    </li>
    <li className="page-item">
        <span onClick={() => props.onPageChange("&raquo;")}  className="page-link">&raquo;</span>
    </li>
</ul>
    );
}

export default Pagination;