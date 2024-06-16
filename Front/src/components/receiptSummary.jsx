export default function ReceiptSummary  ({ cuenta }) {
   // console.log("cuenta en summary", cuenta);
    //console.log("cuenta.SubTotal en summary", cuenta.SubTotal);
    return (
      <div className="receipt-summary">
        <p>Subtotal: ${cuenta.SubTotal}</p>
        <p>Descuento: ${cuenta.Descuento}</p>
        <p className="text-tax">Retenciones: ${cuenta.Retenciones}</p>
        <p className="text-tax">Traslados: ${cuenta.Traslados}</p>
        <hr />
        <p>Total: ${cuenta.Total}</p>
      </div>
    );
  };
  