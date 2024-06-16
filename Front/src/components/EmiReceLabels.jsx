import React from 'react';
 
const EmiRecepLabels = ({ data, hiddenColumns }) => {
    // Filter out keys starting with 'id'
    const filteredData = Object.fromEntries(
        Object.entries(data).filter(([key]) => !hiddenColumns.includes(key))
    );

    return (
        <div>
            <div className="entity-details d-flex flex-wrap"> {/* Flex container */}
                {Object.entries(filteredData).map(([key, value]) => (
                    <div key={key} className="col-md-3 entity-detail"> {/* Bootstrap grid column */}
                        <span className="entity-label">{formatLabel(key)}:</span> {/* Label with colon */}
                        <div className="entity-value">{value}</div> {/* Value */}
                    </div>
                ))}
            </div>
        </div>
    );
};

// Function to format the label based on the key
const formatLabel = (key) => {
    // Example: Convert "Calle" to "Calle"
    return key.charAt(0).toUpperCase() + key.slice(1);
};

export default EmiRecepLabels;
