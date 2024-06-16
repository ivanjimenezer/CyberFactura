export const fillObject = (fetchedObject) => {
    const productObject = {
        "idProdServ":"",
        "Cantidad": "1", // XX
        "CodigoUnidad": "", 
        "Descripción": "",
        "Unidad": "",
        "CodigoProducto": "",
        "Producto": "",  
        "Descuento": "",// XX
        "PrecioUnitario": "",
        "Importe": "",// XX
        "ObjetoDeImpuesto": "01", // XX
        "Impuestos": []
    };
    productObject.idProdServ = fetchedObject['idProdServ'];
    productObject.CodigoUnidad = fetchedObject['ClaveUnidadSAT'];
    productObject.Producto = fetchedObject['ClaveInv'];
    productObject.Unidad = fetchedObject['Unidad'];
    productObject.CodigoProducto = fetchedObject['ClaveSAT'];
    productObject.Descripción = fetchedObject['Nombre']; 
    productObject.PrecioUnitario = fetchedObject['PrecioUnitario']; 
   // console.log("fillproduct", productObject);

    return productObject;



}