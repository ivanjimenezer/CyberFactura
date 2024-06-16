<?php

namespace App\Services;

use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class InsertCFDIService
{
    public function InDatosGen($jsonData)
    {
        try {
            // DB::beginTransaction();
            $id = DB::select('CALL InsertDatosGen(?,?,?,?,?)', [
                $jsonData['DatosGenerales']['CFDI'],
                $jsonData['DatosGenerales']['TipoCFDI'],
                $jsonData['Encabezado']['TipoRelacion'],
                $jsonData['DatosGenerales']['ReceptorCC'],
                $jsonData['DatosGenerales']['ReceptorCCO']
            ])[0]->idDatosGen;
            return $id;
        } catch (QueryException $e) {
            // Log the error
            return response()->json(['error' => 'DatosGen: ' . $e->getMessage()], 500);
        }
    }

    public function InCFDI($idCFDI, $jsonData, $idDatosGenerales)
    {
        try {
            DB::statement('CALL InsertCFDITimbrado(?,?,?,?,?, ?,?,?,?,?, ?,?,?,?,?, ?,?,?)', [
                $idCFDI,
                $jsonData['Encabezado']['Fecha'],
                $jsonData['Encabezado']['Serie'],
                $jsonData['Encabezado']['Folio'],
                $jsonData['Encabezado']['MetodoPago'],

                $jsonData['Encabezado']['FormaPago'],
                $jsonData['Encabezado']['LugarExpedicion'],
                $jsonData['Encabezado']['SubTotal'],
                $jsonData['Encabezado']['Total'],
                $jsonData['Encabezado']['Emisor']['idEmisor'],

                $jsonData['Encabezado']['Receptor']['idCliente'],
                $idDatosGenerales,
                "Timbrado",
                $jsonData['Encabezado']['Receptor']['UsoCFDI'],
                $jsonData['Encabezado']['Moneda'],

                $jsonData['Encabezado']['Traslados'],
                $jsonData['Encabezado']['Retenciones'],
                $jsonData['Encabezado']['Descuento'],
            ]);
            return "OK";
        } catch (QueryException $e) {
            // Log the error
            return response()->json(['error' => 'CFDI: ' . $e->getMessage()], 500);
        }
    }
    public function InConcepto($Conceptos, $idCFDI)
    {
        try {
            $ite = 0;
            foreach ($Conceptos as $concepto) {
                // Check if 'Descuento' key exists
                if (!array_key_exists('Descuento', $concepto)) {
                    // If 'Descuento' key does not exist, set its value to 0
                    $concepto['Descuento'] = 0;
                }
    
                // Call the stored procedure for each set of elements
                $result = DB::select('CALL InsertConcepto(?,?,?, ?,?,?, ?,?)', [
                    $concepto['Cantidad'],
                    $concepto['Importe'],
                    $concepto['ObjetoDeImpuesto'],
                    $concepto['Descuento'], // Use the value of 'Descuento' key
                    $concepto['Traslados'],
                    $concepto['Retenciones'],
                    $idCFDI,
                    $concepto['idProdServ']
                ]);
    
                // Store the returned UUID in the array 
                $Conceptos[$ite]['idConcepto'] = $result[0]->idConcept;
                $ite++;
            }
            return $Conceptos;
        } catch (QueryException $e) {
            // Log the error
            return response()->json(['error' => 'Concepto: ' . $e->getMessage()], 500);
        }
    }
    

    public function InConImp($Conceptos)
    {
        try {
            foreach ($Conceptos as $concepto) {
                // Tomar el id recibido por conceptos 
                // Verificar si el array Impuestos está vacío
                Log::info('Concepto:', $concepto);
                if (!empty($concepto['Impuestos'])) { //<----------this line  
                    // Iterar sobre cada Impuesto
                    foreach ($concepto['Impuestos'] as $impuesto) {
                        DB::table('ConcepiImpuestos')->insert([
                            'idConcepto' => $concepto['idConcepto'],
                            'idImpuestos' => $impuesto['idImpuesto']
                        ]);
                    }
                }
            }
        } catch (QueryException $e) {
            // Log the error
            Log::error('ConcepiImpuestos Error:', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'ConcepiImpuestos: ' . $e->getMessage()], 500);
        }
    }

    public function InResponse($responseData, $idCFDI, $timbre_uuid)
    {
        try {
            // Decodificamos el contenido del PDF
            $pdfContent = base64_decode($responseData['cfdiTimbrado']['respuesta']['pdf']);

            // Generamos un uuid unico para el pdf
            $filename = $idCFDI . '.pdf';

            // Guardamos el contenido en el disco de forma publica
            Storage::disk('public')->put('facturas/pdf/' . $filename, $pdfContent);
            // Generate a public URL for the saved PDF file 
            $publicUrl =  '/storage/facturas/pdf/' . $filename ;
            // Check if $publicUrl is null
            ///storage/facturas/pdf/06b577e7-94e7-4ddc-87d9-e2f379d91873.pdf

            DB::table('Timbrado')->insert([
                'idTimbrado' => $timbre_uuid,
                'idSAT' =>  $responseData['cfdiTimbrado']['respuesta']['uuid'],
                'Fecha' => $responseData['cfdiTimbrado']['respuesta']['fecha'],
                'CadenaOriginal' => $responseData['cfdiTimbrado']['respuesta']['cadenaOriginal'],
                'CadenaOriginalCFDI' => $responseData['cfdiTimbrado']['respuesta']['cadenaOriginalCFD'],
                'NumCertificado' => $responseData['cfdiTimbrado']['respuesta']['noCertificado'],
                'RFCProvCertif' => $responseData['cfdiTimbrado']['respuesta']['rfcProvCertif'],
                'SelloCFD' => $responseData['cfdiTimbrado']['respuesta']['selloCFD'],
                'SelloSAT' => $responseData['cfdiTimbrado']['respuesta']['selloSAT'],
                'idCfdi' => $idCFDI,
                'RutaPDF' => $publicUrl
            ]);
            return $publicUrl;
        } catch (QueryException $e) {
            // Log the error
            return response()->json(['error' => 'Timbrado/Response: ' . $e->getMessage()], 500);
        }
    }
}
