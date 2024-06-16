<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Emisor\StoreEmisorRequest;
use App\Http\Requests\Emisor\UpdateEmisorRequest;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Services\FileService;
use App\Services\InsertCFDIService;

class EmisorController extends Controller
{ // ctrl +shift +L -> seleccionar similares
    // ctrl + } -> comentar varias lineas

    /*
        Si dice 404 not found entonces hubo problema con:
            - las reglas de validacion 
                -porque no retorna ningun mensaje de error, deben crearse manualmente
                - Checa cuando son arrays o subkeys
            - No se envio un archivo (postman elimina archivos al cerrarse)
            - PUT/Patch no acepta formdata
            - El JSON esta incorrecto
            - la ruta tiene un espacio o un caracter incorrecto
            - S
    */

    protected $fileService;
    protected $insertCFDIService;
    //Dependency injection 
    public function __construct(FileService $fileService)
    {
        $this->fileService = $fileService;
    }

    public function index()
    {
        try {
            $prodserv = DB::select('SELECT * from  VEmisorGen');
            return response()->json($prodserv, 200);
        } catch (QueryException $e) {
            // Log the error
            // Log::error('Error inserting client: ' . $e->getMessage());

            // Return an error response with a 500 status code
            return response()->json(['error' => 'Failed to query EMisor: ' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            // Return an error response with a 500 status code
            return response()->json(['error' => 'Failed to query EMisor: ' . $e->getMessage()], 500);
        }
    }
    // FETCH EMISOR LIST
    public function getEmisores(Request $request)
    {
        try {
            $razonsocial = $request->query('razon');

            $query = DB::select('SELECT * FROM VEmisorGen  WHERE RazonSoc like ? limit 7', ['%' . $razonsocial . '%']);
            return response()->json(['data' => $query], 200);
        } catch (QueryException $e) {
            return response()->json(['error' =>  'Hubo un error en la base de datos. No se pudo obtener al Cliente' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Hubo un error en el sistema. No se pudo obtener al Cliente' . $e->getMessage()], 500);
        }
    }


    // SOLO SE USARA UNA VEZ Y SOLAMENTE SE ACTUALIZARA
    public function store(StoreEmisorRequest $request)
    {
        try {

            // Retorna un array
            $validatedData = $request;
            $imgPath = '';
            // Hay un logotipo que guardar?
            // Check if there's an image to save
            if ($request->hasFile('img') && $request->file('img')->isValid()) {
                // Save image file and encode it in base64
                $imgPath = $this->fileService->saveFile($request, 'Files/Emisor/Logotipo', 'img');
                if (isset($imgPath['error'])) {
                    return response()->json(['error' => $imgPath['error']], 500);
                }
            }

            // Save key file and check for errors
            $keytPath = $this->fileService->saveFile($request, 'Files/Emisor/Key', 'key');
            if (isset($keytPath['error'])) {
                return response()->json(['error' => $keytPath['error']], 500);
            }

            // Save CSD file and check for errors
            $csdtPath = $this->fileService->saveFile($request, 'Files/Emisor/CSD', 'csd');
            if (isset($csdtPath['error'])) {
                return response()->json(['error' => $csdtPath['error']], 500);
            }

            // Save password file and check for errors
            $passPath = $this->fileService->savePass($request->pass, 'Files/Emisor/Pass');
            if (isset($passPath['error'])) {
                return response()->json(['error' => $passPath['error']], 500);
            }

            //Llamar el Procedimiento para guardar emisores
            DB::beginTransaction();
            DB::statement('CALL InsertEmisorWithAddress(?,?,?, ?,?,?,?, ?,?,?, ?,?,?,?)', [
                $validatedData['Calle'],
                $validatedData['NumEx'],
                $validatedData['NumIn'],

                $validatedData['Colonia'],
                $validatedData['CP'],
                $validatedData['Municipio'],
                $validatedData['Estado'],

                $validatedData['RFC'],
                $validatedData['RazonSoc'],
                $validatedData['Regimen'],

                $keytPath,
                $csdtPath,
                $imgPath,
                $passPath
            ]);
            DB::commit();
            return response()->json(['message' => 'Emisor creado satisfactoriamente'], 201);
        } catch (QueryException $e) {
            DB::rollback();
            return response()->json(['error' =>  'Hubo un error en la base de datos. No se guardó el EMISOR :' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Hubo un error en el sistema. No se guardó el EMISOR :' . $e->getMessage()], 500);
        }
    }

    public function updating(UpdateEmisorRequest $request, $id)
    {
        try {

            // $passPath = $request->pass ? 'si hay': null; 
            $validatedData = $request;

            // Iterate over the fields to check if they are not null and contain files
            $imgPath =  $request->hasFile('img') ? "Existe" : null;
            $keytPath = $request->hasFile('key') ? "Existe" : null;
            $csdtPath = $request->hasFile('csd') ? "Existe" : null;
            $passPath = $request->pass ? $request->pass : null;

            $arrayrutas = $this->fileService->getRutas($id);
            if (isset($arrayrutas['error'])) {
                return response()->json([$arrayrutas['error']], 500);
            }

            if ($passPath !== null) {
                // Delete existing password file if exists
                if (Storage::exists($arrayrutas['passPath'])) {
                    Storage::delete($arrayrutas['passPath']);
                }
                // Save new password file
                $passPath = $this->fileService->savePass($passPath, 'Files/Emisor/Pass');
                if (isset($passPath['error'])) {
                    return response()->json($passPath['error'], 500);
                }
            }

            // Check and save image file
            $imgPath = $request->hasFile('img') ? "Existe" : null;
            if ($imgPath == "Existe") {
                // Delete existing image file if exists
                if (Storage::exists($arrayrutas['imgPath'])) {
                    Storage::delete($arrayrutas['imgPath']);
                }
                // Save new image file
                $imgPath = $this->fileService->saveFile($request, 'Files/Emisor/Logotipo', 'img');
                if (isset($imgPath['error'])) {
                    return response()->json($imgPath['error'], 500);
                }
            }

            // Check and save key file
            $keytPath = $request->hasFile('key') ? "Existe" : null;
            if ($keytPath == "Existe") {
                // Delete existing key file if exists
                if (Storage::exists($arrayrutas['keytPath'])) {
                    Storage::delete($arrayrutas['keytPath']);
                }
                // Save new key file
                $keytPath = $this->fileService->saveFile($request, 'Files/Emisor/Key', 'key');
                if (isset($keytPath['error'])) {
                    return response()->json($keytPath['error'], 500);
                }
            }

            // Check and save CSD file
            $csdtPath = $request->hasFile('csd') ? "Existe" : null;
            if ($csdtPath == "Existe") {
                // Delete existing CSD file if exists
                if (Storage::exists($arrayrutas['csdtPath'])) {
                    Storage::delete($arrayrutas['csdtPath']);
                }
                // Save new CSD file
                $csdtPath = $this->fileService->saveFile($request, 'Files/Emisor/CSD', 'csd');
                if (isset($csdtPath['error'])) {
                    return response()->json($csdtPath['error'], 500);
                }
            }
            DB::beginTransaction();
            //Llamar el Procedimiento para actualizar datos en la tabla
            DB::statement('CALL UpdateEmisorWithEmisorID(?,?,?, ?,?,  ?, ?, ?,   ?, ?, ?,   ?, ?, ?, ?)', [
                $id,
                $validatedData['Calle'],
                $validatedData['NumEx'],

                $validatedData['NumIn'],
                $validatedData['Colonia'],

                $validatedData['Municipio'],
                $validatedData['Estado'],
                $validatedData['CP'],

                $validatedData['RFC'],
                $validatedData['RazonSoc'],
                $validatedData['Regimen'],

                $keytPath,
                $csdtPath,
                $imgPath,
                $passPath
            ]);
            DB::commit();
            return response()->json(['message' => 'Emisor actualizado satisfactoriamente'], 201);
        } catch (QueryException $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al actualizar emisor:  ' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Error al actualizar emisor:   ' . $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $prodserv = DB::select('SELECT * FROM VEmisorGen WHERE idEmisor  = ?', [$id]);
            return response()->json($prodserv, 200);
        } catch (QueryException $e) {
            // Log the error
            // Log::error('Error inserting client: ' . $e->getMessage()); 
            // Return an error response with a 500 status code
            return response()->json(['error' => 'Failed to query client: ' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            // Return an error response with a 500 status code
            return response()->json(['error' => 'Failed to queriee client: ' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try { 
            
            //obtener rutas de los archivos
            $arrayrutas = $this->fileService->getRutas($id);
           // return response()->json(["message" => $arrayrutas], 200);
            $ref1 = DB::table('CFDI')
                ->where('idEmisor', $id)
                ->exists();
            
            if ($ref1) {
                return response()->json(['error' => 'El Emisor está siendo utilizado en una factura y no puede ser eliminado.'], 400);
            }

            if (isset($arrayrutas['keytPath']) && Storage::exists($arrayrutas['keytPath'])) {
                Storage::delete($arrayrutas['keytPath']);
            }
            
            if (isset($arrayrutas['csdtPath']) && Storage::exists($arrayrutas['csdtPath'])) {
                Storage::delete($arrayrutas['csdtPath']);
            }
            
            if (isset($arrayrutas['passPath']) && Storage::exists($arrayrutas['passPath'])) {
                Storage::delete($arrayrutas['passPath']);
            }
            
            if (isset($arrayrutas['imgPath']) && Storage::exists($arrayrutas['imgPath'])) {
                Storage::delete($arrayrutas['imgPath']);
            }
            DB::beginTransaction();
            // Execute the SQL query to call the stored procedure for deleting records
            DB::statement('CALL DeleteEmisorWithEmisorID (?)', [$id]); 
            DB::commit();
            return response()->json(["message" => "Emisor eliminado correctamente"], 200);
        } catch (\Throwable $e) {
            DB::rollback();
            return response()->json(['error' => 'Error en el controlador emisor: ' . $e->getMessage()], 500);
        } catch (QueryException $e) {
            DB::rollback(); 
        return response()->json(['error' => 'Error al contactar con la BD: ' . $e->getMessage()], 500);
        }
    }

    public function getContent($id)
    {
        try {
            //obtener rutas de los archivos
            $arrayrutas = $this->getRutas($id);

            // Confirmar si los archivos se borraron
            if (Storage::exists($arrayrutas['keytPath']) && Storage::exists($arrayrutas['csdtPath']) && Storage::exists($arrayrutas['passPath']) && Storage::exists($arrayrutas['imgPath'])) {
                //Obtener contenido del archivo
                $keytContent = Storage::get($arrayrutas['keytPath']);
                $csdtContent = Storage::get($arrayrutas['csdtPath']);
                $imgContent = Storage::get($arrayrutas['imgPath']);
                //decodificarlo
                $passContent = base64_decode(Storage::get($arrayrutas['passPath']));

                return response()->json(['key' => $keytContent, 'csd' => $csdtContent, 'pass' => $passContent, 'img' => $imgContent], 200);
                //return Storage::download('/Files/Facturas/PDF/GuiaAnexo20Global.pdf');
            }

            return response()->json(['error' => 'Uno de los archivos no existe. Actualice los contendos'], 404);
        } catch (QueryException $e) {
            // Log the error
            // Log::error('Error inserting client: ' . $e->getMessage());

            // Return an error response with a 500 status code
            return response()->json(['error' => 'Failed to query EMisor: ' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            // Return an error response with a 500 status code
            return response()->json(['error' => 'Failed to query EMisor: ' . $e->getMessage()], 500);
        }
    }

    public function getRutas($id)
    {
        try {
            $results = [];

            $results['keytPath'] = DB::table('Emisor')->where('idEmisor', $id)->pluck('Llave')->first();
            $results['csdtPath'] = DB::table('Emisor')->where('idEmisor', $id)->pluck('CSD')->first();
            $results['passPath'] = DB::table('Emisor')->where('idEmisor', $id)->pluck('Contra')->first();
            $results['imgPath'] = DB::table('Emisor')->where('idEmisor', $id)->pluck('Logo')->first();

            return $results;
        } catch (QueryException $e) {
            // Log the error
            // Log::error('Error inserting client: ' . $e->getMessage());

            // Return an error response with a 500 status code
            return response()->json(['error' => 'Failed to query EMisor: ' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            // Return an error response with a 500 status code
            return response()->json(['error' => 'Failed to query EMisor: ' . $e->getMessage()], 500);
        }
    }

    //EXAMPLE-> ($request,'Files/Emisor/Key', 'key');
    public function saveFile($request, $directory, $type)
    {
        try {
            // Get the file from the request
            $file = $request->file($type);

            // Check if a file was received
            if (!$file) {
                throw new \Exception('No file received.');
            }

            // Store the uploaded file in the storage directory
            $filename = Str::random(40) . '.' . $file->getClientOriginalExtension();
            $storedFilePath = $file->storeAs($directory, $filename);

            // Read the content of the stored file
            $content = Storage::get($storedFilePath);

            // Encode content to base64
            $encodedContent = base64_encode($content);

            // Create filename for the TXT file
            $txtFilename = $type . '_' . Carbon::now()->format('Ymd_His') . '.txt';
            $txtFilePath = "$directory/$txtFilename";

            // Save the encoded content to a TXT file
            Storage::put($txtFilePath, $encodedContent);

            // Delete the original uploaded file
            Storage::delete($storedFilePath);

            // Return the file path of the saved TXT file
            return $txtFilePath;
        } catch (\Exception $e) {
            // Handle the exception
            return $e->getMessage(); // Or handle the exception in another way
        }
    }


    public function savePass($pass, $directory)
    {
        // Encode the string to base64
        $encodedContent = base64_encode($pass);

        // Create filename
        $filename = 'pass_' . Carbon::now()->format('Ymd_His') . '.txt';

        // Get relative path within storage directory
        $filePath = "/$directory/$filename";

        // Create and write to txt file
        Storage::put($filePath, $encodedContent);
        return $filePath;
    }
}
