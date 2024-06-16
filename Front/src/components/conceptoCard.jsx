import React from 'react';

const ConceptoCard = ({ concepto, onDelete }) => {
  const mapObjetoDeImpuesto = (realValue) => {
    const realValues = ["01", "02", "03", "04"];
    const presentedValues = ['No es objeto de impuesto', 'Sí es objeto de impuesto',
      'Sí es objeto del impuesto y no obligado al desglose', 'Si es objeto del impuesto y no causa impuesto'
    ];
    const index = realValues.indexOf(realValue);
    return index !== -1 ? presentedValues[index] : "Desconocido"; // Return "Unknown" if value not found
  };
  const handleDelete = () => {
    onDelete(concepto);
  };

  return (
    <div className="card">
      <div className="card-body d-flex flex-wrap">
      <div className="concepto-info">
          <h5 className="card-title">{concepto.Producto}</h5>
          <div className="card-text">
            <strong className="card-value">Cantidad:</strong> {concepto.Cantidad}
          </div>
          <div className="card-text">
            <strong className="card-value">Unidades:</strong> {concepto.Unidad}
          </div>
          <div className="card-text">
            <strong className="card-value">Precio Unitario:</strong> ${concepto.PrecioUnitario}
          </div>
          <div className="card-text">
            <strong className="card-value">Descuento:</strong> ${concepto.Descuento}
          </div>
          <div className="card-text">
            <strong className="card-value">Importe:</strong> ${concepto.Importe}
          </div>
        </div>
        <div className="impuestos">
          <h6>Impuestos:</h6>
          <div className="card-text">
          <strong>{mapObjetoDeImpuesto(concepto.ObjetoDeImpuesto)}</strong>
          </div>
          {concepto.Impuestos.length > 0 && (
            <ul>
              {concepto.Impuestos.map((impuesto, index) => (
                <li key={index}>{impuesto.Description}</li>
              ))}
            </ul>
          )}
        </div>
        <button className="btn btn-danger ml-auto btn-deletecard" onClick={handleDelete}>
          Borrar
        </button>
      </div>
    </div>
  );
};

export default ConceptoCard;
