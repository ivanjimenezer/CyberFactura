<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Factura\StoreFacturaRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Services\FileService;
use App\Services\InsertCFDIService;
use Dotenv\jsonData;
use Dotenv\Validator;
use Illuminate\Database\QueryException;
use Illuminate\Http\Client\RequestException;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use PhpCfdi\CfdiToJson\JsonConverter;

class FacturaController extends Controller
{
    /*
    El problema era que no enviaba correctamente el json
        - enviaba un json (se jsonificaba 2 veces)
        - la estructura estaba mal
        - se debe enviar el array porque se hace json automaticamente
    Problemas con timbrado
        -   72 horas, checar fecha
    */
    protected $fileService;
    protected $insertCFDIService;
    //Dependency injection 
    public function __construct(FileService $fileService, InsertCFDIService $insertCFDIService)
    {
        $this->fileService = $fileService;
        $this->insertCFDIService = $insertCFDIService;
    }


    //index
    public function index()
    {
        try {
            $facturalist = DB::select('Select * from  VCFDIGen;');
            return response()->json($facturalist);
        } catch (QueryException $e) {
            return response()->json(['error' =>  'Hubo un error en la base de datos. No se pudo obtener la lista de Facturas' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Hubo un error en el sistema. No se pudo obtener la lista de Facturas' . $e->getMessage()], 500);
        }
    }

    //show one

    //Guardar datos de la factura
    //Objetivo, hacer request a facturo
    public function store(StoreFacturaRequest $request)
    {
        try {
            // Perform validation
            $jsonData = $request->validated();
            //$notValidated = $request->all();
            // Accedemos al contenido de los archivos que estan en formato JSON
            $contenido = $this->fileService->getContent($jsonData['Encabezado']['Emisor']['idEmisor'], $jsonData['DatosGenerales']['UsarLogo']);
            
            if (isset($contenido['error'])) {
                return response()->json($contenido['error'], 404);
            } 
            //El contenido obtenido lo insertamos en el array que sera convertido en JSON
            $jsonData['DatosGenerales']['CSDPassword'] = $contenido['pass'];
            $jsonData['DatosGenerales']['CSD'] = $contenido['csd'];
            $jsonData['DatosGenerales']['LlavePrivada'] = $contenido['key'];
            $jsonData['DatosGenerales']['Logotipo'] = $contenido['img'];
           
            $keysToRemove = [
                'DatosGenerales' => ['UsarLogo'],
                'Encabezado' => ['Descuento', 'Retenciones', 'Traslados'],
                'Conceptos' => ['idProdServ','Retenciones', 'Traslados'],
                'Impuestos' => ['idImpuesto', 'Description']
            ];
            
            $cleanedJsonData = $this->removeKeysFromJson($jsonData, $keysToRemove);
            
            
            if (isset($cleanedJsonData['error'])) {
                return response()->json($cleanedJsonData['error'], 404);
            } 
           
            $token = env('FACTURO_TOKEN');
            $api = env('LINK_TIMBRADO');
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $token,
            ])->timeout(25)->post($api, $cleanedJsonData);
           
                //return $response; si timbra
            // Get the response body as a string
            $responseBody = $response->body();
           // return $responseBody;
            // For example, you can decode the JSON response body
            $responseData = json_decode($responseBody, true);
            // Check if the request was successful
            if ($responseData['estatus']['codigo'] == "000") {
                //GUARDAR LA INFORMACION EN LA BASE DE DATOS 
                DB::beginTransaction();
                $result = $this->handleDataInsertion($jsonData, $responseData);
                DB::commit();
                // Return the response data
                return response()->json(["message" => $result], 201);
            } else {
                DB::rollback();
                // Handle the error condition 
                return response()->json(["error" => "Error al generar el timbrado: " . $responseData['estatus']['descripcion'] . $responseData['estatus']["informacionTecnica"]], 500);
            }
        } catch (\Exception $e) {  
            DB::rollback();
            if ($e->getCode() === 28) { // Check if the error code is related to a timeout
                return response()->json(['error' => 'El servidor de FacturoPorTi tardó mucho en responder'], 500);
            } 
            if (Str::startsWith($e->getMessage(), 'cURL error 28: Operation timed out after 25')) { 
                // Send a customized error message
                return response()->json(['error' => 'El servidor de FacturoPorTi tardó mucho en responder'], 500);
            }
            if (Str::startsWith($e->getMessage(), "cURL error 28: Operation timed out after 9")) { 
                // Send a customized error message
                return response()->json(['error' => 'El servidor de FacturoPorTi tardó mucho en responder'], 500);
            }
            // Check if the error message starts with the specified substring
            if (Str::startsWith($e->getMessage(), 'cURL error 28: Failed to connect to testapi.facturoporti.com.mx port')) {
                // Send a customized error message
                return response()->json(['error' => "El servidor de FacturoPorTi esta tardando mucho. Intente enviarlo de nuevo"], 500);
            } else {
                // Send the regular error message
                return response()->json(['error' => "Error en Controlador al generar el timbrado: " . $e->getMessage()], 500);
            }
        }
    }

    //guardar json -> se envia el json a la ruta store cuando se quiera guardar
    public function storeJSON(StoreFacturaRequest $request)
    {
        try {
            $jsonData = $request->validated();
            //($request,'Files/Emisor/Key', 'key');
            $path = $this->fileService->saveFile($request, 'Files/Facturas/JSON', 'key');

            return response()->json(['message' => 'JSON file saved successfully', "path" => $path], 200);
        } catch (\Exception $e) {
            // Handle any exceptions that occur during the request
            // For example, log the error or return an error response
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    //guardar xml 
    public function storeXML(Request $request)
    {
        try {
            // Check if the request has a file
            if ($request->hasFile('xml')) {
                // Get the file from the request
                $xmlFile = $request->file('xml');

                // Check if the file is valid
                if ($xmlFile->isValid()) {
                    // Get the contents of the file
                    $xmlContent = file_get_contents($xmlFile->path());
                    // retorna un string con la structura de un
                    $json = JsonConverter::convertToJson($xmlContent);

                    $jsonarray = json_decode($json, true);
                    // metodo para guardar los datos dentro de la BD
                    $xd = $this->xml_to_bd($jsonarray);

                    return $jsonarray;
                } else {
                    return response()->json(['error' => 'Invalid file'], 400);
                }
            } else {
                return response()->json(['error' => 'No se recibio ningun archivo XML'], 400);
            }
        } catch (\Exception $e) {
            // Handle any exceptions that occur during the request
            // For example, log the error or return an error response
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function xml_to_bd($json)
    {

        // Enviar el XML
        // Enviar el emisor
        // Enviar el receptor


        //comparar

        //Impuestos
        //tomar el factor
        //

        //comprobar productos
        //tomar id si hay existencia
        //insertar y tomar id

        //comprobar cliente
        //tomar id si hay existencia
        //insertar y tomar id

        //insertar datosGen
        //Insertar CFDI
        //Insertar conceptos
        //Insertar ConcepiImpuestos
        //In Datos de respuesta

    }
    public function removeKeysFromJson($jsonData, $keysToRemove)
    {
        try {
            // Remove keys from DatosGenerales section
            foreach ($keysToRemove['DatosGenerales'] as $key) {
                unset($jsonData['DatosGenerales'][$key]);
            }

            // Remove keys from Encabezado section
            foreach ($keysToRemove['Encabezado'] as $key) {
                unset($jsonData['Encabezado'][$key]);
            }

            // Remove keys from each Concepto in Conceptos section
            foreach ($jsonData['Conceptos'] as &$concepto) {
                foreach ($keysToRemove['Conceptos'] as $key) {
                    unset($concepto[$key]);
                }

                // Remove keys from each Impuesto in Impuestos array within Concepto
                foreach ($concepto['Impuestos'] as &$impuesto) {
                    foreach ($keysToRemove['Impuestos'] as $key) {
                        unset($impuesto[$key]);
                    }
                }
            }

            // Return the modified JSON data
            return $jsonData;
        } catch (\Exception $e) {
            // Return an error response with a 500 status code
            return ['error' => 'Error general al quitar keys del JSON' . $e->getMessage()];
        }
    }
    private function handleDataInsertion($jsonData, $responseData)
    {
        try {
            //uuid's
            $idCFDI  = Str::uuid();
            $timbre_uuid = Str::uuid();

            // Insertar en DatosGenerales y obtener idDatosGenerales
            $idDatosGenerales = $this->insertCFDIService->InDatosGen($jsonData);

            // Insert CFDITimbrado and retrieve idCFDI
            $message = $this->insertCFDIService->InCFDI($idCFDI, $jsonData, $idDatosGenerales);
            if ($message !== "OK") {
                throw new \Exception('Error al insertar datos en tabla CFDI: ' . json_encode($message), 500);
            }
            // Insertar conceptos en la BD e insertar los uuids
            
            //POssible error received
            $Conceptos = $this->insertCFDIService->InConcepto($jsonData['Conceptos'], $idCFDI);
            //throw new \Exception('Error PRUEBAAA conceptos: '. json_encode($Conceptos) , 500);
            
            // Insertar ConcepiImpuestos
            $this->insertCFDIService->InConImp($Conceptos);
            //Datos de timbrado
            //INSERTAR DATOS DE RESPUESTA  
            $url_pdf =   $this->insertCFDIService->InResponse($responseData, $idCFDI, $timbre_uuid);

            //return ["rutaPDF" => $url_pdf, "idDatosGen" => $idDatosGenerales, "idCFDI" => $idCFDI, "Conceptos" => $Conceptos, "idTimbrado" => $timbre_uuid];
        return $url_pdf;
        
        } catch (QueryException $e) {
            // Log the error
            return ['error' => 'Error al insertar datos en MySQL: ' . $e->getMessage()];
        } catch (\Exception $e) {
            // Return an error response with a 500 status code
            return ['error' => 'Error general al ingresar datos: ' . $e->getMessage()] ;
        }
    }
}
