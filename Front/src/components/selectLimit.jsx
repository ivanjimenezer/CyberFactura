import React, { useState} from 'react';



function SelectLimit(props) {

    const [limitValue, setLimitValue]= useState(props.limit_Value);

    const handleChange = (value) =>{
        setLimitValue(value);
        props.onLimitChange(value);
    }

    return (
        
            <select onChange={(e) =>  handleChange(e.target.value)} value={limitValue} className="select pagination-select"> 
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="25">25</option>
            </select>  
    );
}
export default SelectLimit;