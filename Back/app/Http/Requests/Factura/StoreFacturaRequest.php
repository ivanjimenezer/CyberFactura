<?php

namespace App\Http\Requests\Factura;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreFacturaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        return [
            'DatosGenerales.Version' => 'required|string|max:10',
            'DatosGenerales.GeneraPDF' => 'required|boolean',
            'DatosGenerales.UsarLogo' => 'required|boolean',
            'DatosGenerales.CFDI' => 'required|string|in:Factura,Recibo',
            'DatosGenerales.OpcionDecimales' => 'required|string|in:0,1,2',
            'DatosGenerales.NumeroDecimales' => 'required|integer|min:0|max:4',
            'DatosGenerales.TipoCFDI' => 'required|string|in:Ingreso,Egreso,Traslado',
            'DatosGenerales.EnviaEmail' => 'required|boolean',
            'DatosGenerales.ReceptorEmail' => 'required_if:DatosGenerales.EnviaEmail,true|email',
            'DatosGenerales.ReceptorCC' => 'nullable|email',
            'DatosGenerales.ReceptorCCO' => 'nullable|email',
            'DatosGenerales.EmailMensaje' => 'nullable|string|max:255',
            'Encabezado.CFDIsRelacionados' => 'nullable|string|max:255',
            'Encabezado.TipoRelacion' => 'nullable|string|max:3|min:0',

            'Encabezado.Emisor.idEmisor' => 'required|string|max:36',
            'Encabezado.Emisor.RFC' => 'required|string|max:13',
            'Encabezado.Emisor.NombreRazonSocial' => 'required|string|max:255',
            'Encabezado.Emisor.RegimenFiscal' => 'required|string|max:3', 
             // Direccion .*.
             'Encabezado.Emisor.Direccion' => 'required|array',
             'Encabezado.Emisor.Direccion.*.NumeroExterior' => 'nullable|string|max:10',
             'Encabezado.Emisor.Direccion.*.NumeroInterior' => 'nullable|string|max:10',
             'Encabezado.Emisor.Direccion.*.CodigoPostal' => 'required|string|max:10',
             'Encabezado.Emisor.Direccion.*.colonia' => 'nullable|string|max:45',
             'Encabezado.Emisor.Direccion.*.municipio' => 'nullable|string|max:45',
             'Encabezado.Emisor.Direccion.*.estado' => 'nullable|string|max:45',

            'Encabezado.Receptor.idCliente' => 'required|string|max:36',
            'Encabezado.Receptor.RFC' => 'required|string|max:13',
            'Encabezado.Receptor.NombreRazonSocial' => 'required|string|max:255',
            'Encabezado.Receptor.UsoCFDI' => 'required|string|max:4',
            'Encabezado.Receptor.RegimenFiscal' => 'required|string|max:3',
            'Encabezado.Receptor.DomicilioFiscalReceptor' => 'required|string|max:10',
            // Direccion
            'Encabezado.Receptor.Direccion' => 'required',
            'Encabezado.Receptor.Direccion.CodigoPostal' => 'required|string|max:10',
            'Encabezado.Receptor.Direccion.Calle' => 'nullable|string|max:45',
            'Encabezado.Receptor.Direccion.NumeroExterior' => 'nullable|string|max:10',
            'Encabezado.Receptor.Direccion.NumeroInterior' => 'nullable|string|max:10',
            'Encabezado.Receptor.Direccion.colonia' => 'nullable|string|max:45',
            'Encabezado.Receptor.Direccion.municipio' => 'nullable|string|max:45',
            'Encabezado.Receptor.Direccion.estado' => 'nullable|string|max:45',


            'Encabezado.Fecha' => 'required|date_format:Y-m-d\TH:i:s',
            'Encabezado.Serie' => 'required|string|max:40',
            'Encabezado.Folio' => 'required|string|max:25',
            'Encabezado.MetodoPago' => 'required|string|max:3',
            'Encabezado.FormaPago' => 'required|string|max:2',
            'Encabezado.Moneda' => 'required|string|max:3',
            'Encabezado.LugarExpedicion' => 'required|string|max:10',
            'Encabezado.SubTotal' => 'required|numeric|min:0',
            'Encabezado.Total' => 'required|numeric|min:0',
            'Encabezado.Descuento' => 'required|numeric|min:0',
            'Encabezado.Retenciones' => 'required|numeric|min:0',
            'Encabezado.Traslados' => 'required|numeric|min:0',

            'Conceptos' => 'required|array|min:1',
            'Conceptos.*.idProdServ' => 'required|string|max:36',
            'Conceptos.*.Cantidad' => 'required|numeric|min:0',
            'Conceptos.*.CodigoUnidad' => 'required|string|max:10',
            'Conceptos.*.Unidad' => 'required|string|max:255',
            'Conceptos.*.CodigoProducto' => 'required|string|max:20',
            'Conceptos.*.Producto' => 'required|string|max:255',
            'Conceptos.*.PrecioUnitario' => 'required|numeric|min:0',
            'Conceptos.*.Importe' => 'required|numeric|min:0',
            'Conceptos.*.Descuento' => 'nullable|numeric|min:0',
            'Conceptos.*.Retenciones' => 'required|numeric|min:0',
            'Conceptos.*.Traslados' => 'required|numeric|min:0',
            'Conceptos.*.ObjetoDeImpuesto' => 'required|string|max:2',

            'Conceptos.*.Impuestos' => 'nullable|array',
        ];
    }


    public function messages()
    {
        return [
            // DatosGenerales
            'DatosGenerales.Version.required' => 'The version field is required.',
            'DatosGenerales.Version.max' => 'The version may not be greater than :max characters.',
            'DatosGenerales.GeneraPDF.required' => 'The GeneraPDF field is required.',
            'DatosGenerales.GeneraPDF.boolean' => 'The GeneraPDF field must be true or false.',

            'DatosGenerales.UsarLogo.required' => 'The UsarLogo field is required.',
            'DatosGenerales.UsarLogo.boolean' => 'The UsarLogo field must be true or false.',

            'DatosGenerales.CFDI.required' => 'The CFDI field is required.',
            'DatosGenerales.CFDI.in' => 'The selected CFDI is invalid.',
            'DatosGenerales.OpcionDecimales.required' => 'The OpcionDecimales field is required.',
            'DatosGenerales.OpcionDecimales.in' => 'The selected OpcionDecimales is invalid.',
            'DatosGenerales.NumeroDecimales.required' => 'The NumeroDecimales field is required.',
            'DatosGenerales.NumeroDecimales.integer' => 'The NumeroDecimales field must be an integer.',
            'DatosGenerales.NumeroDecimales.min' => 'The NumeroDecimales must be at least :min.',
            'DatosGenerales.NumeroDecimales.max' => 'The NumeroDecimales may not be greater than :max.',
            'DatosGenerales.TipoCFDI.required' => 'The TipoCFDI field is required.',
            'DatosGenerales.TipoCFDI.in' => 'The selected TipoCFDI is invalid.',
            'DatosGenerales.EnviaEmail.required' => 'The EnviaEmail field is required.',
            'DatosGenerales.EnviaEmail.boolean' => 'The EnviaEmail field must be true or false.',
            'DatosGenerales.ReceptorEmail.required_if' => 'The ReceptorEmail field is required when EnviaEmail is true.',
            'DatosGenerales.ReceptorEmail.email' => 'The ReceptorEmail must be a valid email address.',
            'DatosGenerales.ReceptorCC.email' => 'The ReceptorCC must be a valid email address.',
            'DatosGenerales.ReceptorCCO.email' => 'The ReceptorCCO must be a valid email address.',
            'DatosGenerales.EmailMensaje.max' => 'The EmailMensaje may not be greater than :max characters.',
            'Encabezado.TipoRelacion.max' => 'The TipoRelacion may not be greater than :max characters.',

           //DIRECCION EMISOR .*.
            'Encabezado.Emisor.Direccion.required' => 'La dirección del emisor es requerida.',
            'Encabezado.Emisor.Direccion.array' => 'La dirección del emisor debe ser un arreglo.',
            'Encabezado.Emisor.Direccion.*.NumeroExterior.string' => 'El número exterior del emisor debe ser una cadena de texto.',
            'Encabezado.Emisor.Direccion.*.NumeroExterior.max' => 'El número exterior del emisor no debe tener más de :max caracteres.',
            'Encabezado.Emisor.Direccion.*.NumeroInterior.string' => 'El número interior del emisor debe ser una cadena de texto.',
            'Encabezado.Emisor.Direccion.*.NumeroInterior.max' => 'El número interior del emisor no debe tener más de :max caracteres.',
            'Encabezado.Emisor.Direccion.*.CodigoPostal.required' => 'El código postal del emisor es requerido.',
            'Encabezado.Emisor.Direccion.*.CodigoPostal.string' => 'El código postal del emisor debe ser una cadena de texto.',
            'Encabezado.Emisor.Direccion.*.CodigoPostal.max' => 'El código postal del emisor no debe tener más de :max caracteres.',
             'Encabezado.Emisor.Direccion.*.colonia.string' => 'La colonia del emisor debe ser una cadena de texto.',
            'Encabezado.Emisor.Direccion.*.colonia.max' => 'La colonia del emisor no debe tener más de :max caracteres.',
             'Encabezado.Emisor.Direccion.*.municipio.string' => 'El municipio del emisor debe ser una cadena de texto.',
            'Encabezado.Emisor.Direccion.*.municipio.max' => 'El municipio del emisor no debe tener más de :max caracteres.',
             'Encabezado.Emisor.Direccion.*.estado.string' => 'El estado del emisor debe ser una cadena de texto.',
            'Encabezado.Emisor.Direccion.*.estado.max' => 'El estado del emisor no debe tener más de :max caracteres.',

            'Encabezado.Receptor.Direccion.required' => 'La dirección del receptor es requerida.',
            'Encabezado.Receptor.Direccion.CodigoPostal.required' => 'El código postal del receptor es requerido.',
            'Encabezado.Receptor.Direccion.CodigoPostal.string' => 'El código postal del receptor debe ser una cadena de texto.',
            'Encabezado.Receptor.Direccion.CodigoPostal.max' => 'El código postal del receptor no debe tener más de :max caracteres.',
             'Encabezado.Receptor.Direccion.Calle.string' => 'La calle del receptor debe ser una cadena de texto.',
            'Encabezado.Receptor.Direccion.Calle.max' => 'La calle del receptor no debe tener más de :max caracteres.',
            'Encabezado.Receptor.Direccion.NumeroExterior.string' => 'El número exterior del receptor debe ser una cadena de texto.',
            'Encabezado.Receptor.Direccion.NumeroExterior.max' => 'El número exterior del receptor no debe tener más de :max caracteres.',
             'Encabezado.Receptor.Direccion.NumeroInterior.string' => 'El número interior del receptor debe ser una cadena de texto.',
            'Encabezado.Receptor.Direccion.NumeroInterior.max' => 'El número interior del receptor no debe tener más de :max caracteres.',
             'Encabezado.Receptor.Direccion.colonia.string' => 'La colonia del receptor debe ser una cadena de texto.',
            'Encabezado.Receptor.Direccion.colonia.max' => 'La colonia del receptor no debe tener más de :max caracteres.',
             'Encabezado.Receptor.Direccion.municipio.string' => 'El municipio del receptor debe ser una cadena de texto.',
            'Encabezado.Receptor.Direccion.municipio.max' => 'El municipio del receptor no debe tener más de :max caracteres.',
            'Encabezado.Receptor.Direccion.estado.string' => 'El estado del receptor debe ser una cadena de texto.',
            'Encabezado.Receptor.Direccion.estado.max' => 'El estado del receptor no debe tener más de :max caracteres.',


            // Encabezado
            'Encabezado.CFDIsRelacionados.string' => 'Los CFDIs relacionados deben ser una cadena de texto.',
            'Encabezado.CFDIsRelacionados.max' => 'Los CFDIs relacionados no deben tener más de :max caracteres.',
            'Encabezado.TipoRelacion.string' => 'El tipo de relación debe ser una cadena de texto.',
            'Encabezado.TipoRelacion.max' => 'El tipo de relación no debe tener más de :max caracteres.',
            'Encabezado.TipoRelacion.min' => 'El tipo de relación no debe tener menos de :min caracteres.',

            'Encabezado.Emisor.idEmisor.required' => 'El ID del emisor es requerido.',
            'Encabezado.Emisor.idEmisor.string' => 'El ID del emisor debe ser una cadena de texto.',
            'Encabezado.Emisor.idEmisor.max' => 'El ID del emisor no debe tener más de :max caracteres.',
            'Encabezado.Emisor.RFC.required' => 'El RFC del emisor es requerido.',
            'Encabezado.Emisor.RFC.string' => 'El RFC del emisor debe ser una cadena de texto.',
            'Encabezado.Emisor.RFC.max' => 'El RFC del emisor no debe tener más de :max caracteres.',
            'Encabezado.Emisor.NombreRazonSocial.required' => 'El nombre o razón social del emisor es requerido.',
            'Encabezado.Emisor.NombreRazonSocial.string' => 'El nombre o razón social del emisor debe ser una cadena de texto.',
            'Encabezado.Emisor.NombreRazonSocial.max' => 'El nombre o razón social del emisor no debe tener más de :max caracteres.',
            'Encabezado.Emisor.RegimenFiscal.required' => 'El régimen fiscal del emisor es requerido.',
            'Encabezado.Emisor.RegimenFiscal.string' => 'El régimen fiscal del emisor debe ser una cadena de texto.',
            'Encabezado.Emisor.RegimenFiscal.max' => 'El régimen fiscal del emisor no debe tener más de :max caracteres.',
            'Encabezado.Emisor.Direccion.required' => 'La dirección del emisor es requerida.',
            'Encabezado.Emisor.Direccion.array' => 'La dirección del emisor debe ser un arreglo.',

            'Encabezado.Receptor.idCliente.required' => 'El ID del receptor es requerido.',
            'Encabezado.Receptor.idCliente.string' => 'El ID del receptor debe ser una cadena de texto.',
            'Encabezado.Receptor.idCliente.max' => 'El ID del receptor no debe tener más de :max caracteres.',
            'Encabezado.Receptor.RFC.required' => 'El RFC del receptor es requerido.',
            'Encabezado.Receptor.RFC.string' => 'El RFC del receptor debe ser una cadena de texto.',
            'Encabezado.Receptor.RFC.max' => 'El RFC del receptor no debe tener más de :max caracteres.',
            'Encabezado.Receptor.NombreRazonSocial.required' => 'El nombre o razón social del receptor es requerido.',
            'Encabezado.Receptor.NombreRazonSocial.string' => 'El nombre o razón social del receptor debe ser una cadena de texto.',
            'Encabezado.Receptor.NombreRazonSocial.max' => 'El nombre o razón social del receptor no debe tener más de :max caracteres.',
            'Encabezado.Receptor.UsoCFDI.required' => 'El uso de CFDI del receptor es requerido.',
            'Encabezado.Receptor.UsoCFDI.string' => 'El uso de CFDI del receptor debe ser una cadena de texto.',
            'Encabezado.Receptor.UsoCFDI.max' => 'El uso de CFDI del receptor no debe tener más de :max caracteres.',
            'Encabezado.Receptor.RegimenFiscal.required' => 'El régimen fiscal del receptor es requerido.',
            'Encabezado.Receptor.RegimenFiscal.string' => 'El régimen fiscal del receptor debe ser una cadena de texto.',
            'Encabezado.Receptor.RegimenFiscal.max' => 'El régimen fiscal del receptor no debe tener más de :max caracteres.',
            'Encabezado.Receptor.DomicilioFiscalReceptor.required' => 'El domicilio fiscal del receptor es requerido.',
            'Encabezado.Receptor.DomicilioFiscalReceptor.string' => 'El domicilio fiscal del receptor debe ser una cadena de texto.',
            'Encabezado.Receptor.DomicilioFiscalReceptor.max' => 'El domicilio fiscal del receptor no debe tener más de :max caracteres.',
            'Encabezado.Receptor.Direccion.required' => 'La dirección del receptor es requerida.',
            'Encabezado.Receptor.Direccion.array' => 'La dirección del receptor debe ser un arreglo.',

            'Encabezado.Fecha.required' => 'La fecha del encabezado es requerida.',
            'Encabezado.Fecha.date_format' => 'La fecha del encabezado debe tener el formato Y-m-d\TH:i:s.',
            'Encabezado.Serie.required' => 'La serie del encabezado es requerida.',
            'Encabezado.Serie.string' => 'La serie del encabezado debe ser una cadena de texto.',
            'Encabezado.Serie.max' => 'La serie del encabezado no debe tener más de :max caracteres.',
            'Encabezado.Folio.required' => 'El folio del encabezado es requerido.',
            'Encabezado.Folio.string' => 'El folio del encabezado debe ser una cadena de texto.',
            'Encabezado.Folio.max' => 'El folio del encabezado no debe tener más de :max caracteres.',
            'Encabezado.MetodoPago.required' => 'El método de pago del encabezado es requerido.',
            'Encabezado.MetodoPago.string' => 'El método de pago del encabezado debe ser una cadena de texto.',
            'Encabezado.MetodoPago.max' => 'El método de pago del encabezado no debe tener más de :max caracteres.',
            'Encabezado.FormaPago.required' => 'La forma de pago del encabezado es requerida.',
            'Encabezado.FormaPago.string' => 'La forma de pago del encabezado debe ser una cadena de texto.',
            'Encabezado.FormaPago.max' => 'La forma de pago del encabezado no debe tener más de :max caracteres.',
            'Encabezado.Moneda.required' => 'La moneda del encabezado es requerida.',
            'Encabezado.Moneda.string' => 'La moneda del encabezado debe ser una cadena de texto.',
            'Encabezado.Moneda.max' => 'La moneda del encabezado no debe tener más de :max caracteres.',
            'Encabezado.LugarExpedicion.required' => 'El lugar de expedición del encabezado es requerido.',
            'Encabezado.LugarExpedicion.string' => 'El lugar de expedición del encabezado debe ser una cadena de texto.',
            'Encabezado.LugarExpedicion.max' => 'El lugar de expedición del encabezado no debe tener más de :max caracteres.',
            'Encabezado.SubTotal.required' => 'El subtotal del encabezado es requerido.',
            'Encabezado.SubTotal.numeric' => 'El subtotal del encabezado debe ser un valor numérico.',
            'Encabezado.SubTotal.min' => 'El subtotal del encabezado no puede ser menor que :min.',
            'Encabezado.Descuento.required' => 'El descuento del encabezado es requerido.',
            'Encabezado.Descuento.numeric' => 'El descuento del encabezado debe ser un valor numérico.',
            'Encabezado.Descuento.min' => 'El descuento del encabezado no puede ser menor que :min.',
            'Encabezado.Retenciones.required' => 'Las retenciones del encabezado son requeridas.',
            'Encabezado.Retenciones.numeric' => 'Las retenciones del encabezado deben ser un valor numérico.',
            'Encabezado.Retenciones.min' => 'Las retenciones del encabezado no pueden ser menores que :min.',
            'Encabezado.Traslados.required' => 'Los traslados del encabezado son requeridos.',
            'Encabezado.Traslados.numeric' => 'Los traslados del encabezado deben ser un valor numérico.',
            'Encabezado.Traslados.min' => 'Los traslados del encabezado no pueden ser menores que :min.',
            'Encabezado.Total.required' => 'El total del encabezado es requerido.',
            'Encabezado.Total.numeric' => 'El total del encabezado debe ser un valor numérico.',
            'Encabezado.Total.min' => 'El total del encabezado no puede ser menor que :min.',


            // Conceptos
            'Conceptos.required' => 'The Conceptos field is required.',
            'Conceptos.array' => 'The Conceptos must be an array.',
            'Conceptos.min' => 'The Conceptos must have at least :min items.',
            'Conceptos.*.idProdServ.required' => 'The Concepto ID is required.',
            'Conceptos.*.idProdServ.max' => 'The Concepto ID may not be greater than :max characters.',
            'Conceptos.*.Cantidad.required' => 'The Concepto Cantidad is required.',
            'Conceptos.*.Cantidad.numeric' => 'The Concepto Cantidad must be a number.',
            'Conceptos.*.Cantidad.min' => 'The Concepto Cantidad must be at least :min.',
            'Conceptos.*.CodigoUnidad.required' => 'The Concepto CodigoUnidad is required.',
            'Conceptos.*.CodigoUnidad.max' => 'The Concepto CodigoUnidad may not be greater than :max characters.',
            'Conceptos.*.Unidad.required' => 'The Concepto Unidad is required.',
            'Conceptos.*.Unidad.max' => 'The Concepto Unidad may not be greater than :max characters.',
            'Conceptos.*.CodigoProducto.required' => 'The Concepto CodigoProducto is required.',
            'Conceptos.*.CodigoProducto.max' => 'The Concepto CodigoProducto may not be greater than :max characters.',
            'Conceptos.*.Producto.required' => 'The Concepto Producto is required.',
            'Conceptos.*.Producto.max' => 'The Concepto Producto may not be greater than :max characters.',
            'Conceptos.*.PrecioUnitario.required' => 'The Concepto PrecioUnitario is required.',
            'Conceptos.*.PrecioUnitario.numeric' => 'The Concepto PrecioUnitario must be a number.',
            'Conceptos.*.PrecioUnitario.min' => 'The Concepto PrecioUnitario must be at least :min.',

            'Conceptos.*.Importe.required' => 'The Concepto Importe is required.',
            'Conceptos.*.Importe.numeric' => 'The Concepto Importe must be a number.',
            'Conceptos.*.Importe.min' => 'The Concepto Importe must be at least :min.',


            'Conceptos.*.Descuento.numeric' => 'The Concepto Importe must be a number.',
            'Conceptos.*.Descuento.min' => 'The Concepto Importe must be at least :min.',

            'Conceptos.*.Retenciones.required' => 'The Concepto Retenciones is required.',
            'Conceptos.*.Retenciones.numeric' => 'The Concepto Retenciones must be a number.',
            'Conceptos.*.Retenciones.min' => 'The Concepto Retenciones must be at least :min.',

            'Conceptos.*.Traslados.required' => 'The Concepto Importe is required.',
            'Conceptos.*.Traslados.numeric' => 'The Concepto Importe must be a number.',
            'Conceptos.*.Traslados.min' => 'The Concepto Importe must be at least :min.',

            'Conceptos.*.ObjetoDeImpuesto.required' => 'The Concepto ObjetoDeImpuesto is required.',
            'Conceptos.*.ObjetoDeImpuesto.max' => 'The Concepto ObjetoDeImpuesto may not be greater than :max characters.',
            'Conceptos.*.Impuestos.array' => 'The Concepto Impuestos must be an array.',
            'Conceptos.*.Impuestos.*.idImpuesto.required' => 'The Impuesto ID is required.',
            'Conceptos.*.Impuestos.*.idImpuesto.max' => 'The Impuesto ID may not be greater than :max characters.',
            'Conceptos.*.Impuestos.*.TipoImpuesto.required' => 'The Impuesto TipoImpuesto is required.',
            'Conceptos.*.Impuestos.*.TipoImpuesto.max' => 'The Impuesto TipoImpuesto may not be greater than :max characters.',
            'Conceptos.*.Impuestos.*.Impuesto.required' => 'The Impuesto Impuesto is required.',
            'Conceptos.*.Impuestos.*.Impuesto.max' => 'The Impuesto Impuesto may not be greater than :max characters.',
            'Conceptos.*.Impuestos.*.Factor.required' => 'The Impuesto Factor is required.',
            'Conceptos.*.Impuestos.*.Factor.max' => 'The Impuesto Factor may not be greater than :max characters.',
            'Conceptos.*.Impuestos.*.Base.required' => 'The Impuesto Base is required.',
            'Conceptos.*.Impuestos.*.Base.numeric' => 'The Impuesto Base must be a number.',
            'Conceptos.*.Impuestos.*.Base.min' => 'The Impuesto Base must be at least :min.',
            'Conceptos.*.Impuestos.*.Tasa.required' => 'The Impuesto Tasa is required.',
            'Conceptos.*.Impuestos.*.Tasa.numeric' => 'The Impuesto Tasa must be a number.',
            'Conceptos.*.Impuestos.*.Tasa.min' => 'The Impuesto Tasa must be at least :min.',
            'Conceptos.*.Impuestos.*.ImpuestoImporte.required' => 'The Impuesto ImpuestoImporte is required.',
            'Conceptos.*.Impuestos.*.ImpuestoImporte.numeric' => 'The Impuesto ImpuestoImporte must be a number.',
            'Conceptos.*.Impuestos.*.ImpuestoImporte.min' => 'The Impuesto ImpuestoImporte must be at least :min.',
        ];
    }
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json(['error' => $validator->errors()], 422));
    }
}
