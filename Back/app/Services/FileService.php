<?php

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

use Illuminate\Support\Str;


class FileService
{

    public function getContent($id, $using_img)
    {
        try {
            //obtener rutas de los archivos 
            $arrayrutas = $this->getRutas($id); 
            // Confirmar si los archivos se borraron
            if (Storage::exists($arrayrutas['keytPath']) && Storage::exists($arrayrutas['csdtPath']) && Storage::exists($arrayrutas['passPath']) ) {
                $imgContent = "";
                //Obtener contenido del archivo
                //Comprobar si el logotipo existe dentro del server
                if($using_img &&  Storage::exists($arrayrutas['imgPath'])){
                    $imgContent = Storage::get($arrayrutas['imgPath']);
                }
                $keytContent = Storage::get($arrayrutas['keytPath']);
                $csdtContent = Storage::get($arrayrutas['csdtPath']);
                
                //decodificarlo
                $passContent = base64_decode(Storage::get($arrayrutas['passPath']));

                // Construir el array con los contenidos
                $contents = [
                    'key' => $keytContent,
                    'csd' => $csdtContent,
                    'pass' => $passContent,
                    'img' => $imgContent
                ];

                return $contents;
            }else {
                // Identificar el archivo faltante
                $missingFile = '';
                if (!Storage::exists($arrayrutas['keytPath'])) {
                    $missingFile = 'LlavePrivada.key';
                } elseif (!Storage::exists($arrayrutas['csdtPath'])) {
                    $missingFile = 'Certificadocsd';
                } elseif (!Storage::exists($arrayrutas['passPath'])) {
                    $missingFile = 'Contraseña';
                }
                elseif (!Storage::exists($arrayrutas['imgPath'])) {
                    $missingFile = 'imagen del Logotipo';
                }
    
                // Devolver el error con el nombre del archivo faltante
                return ['error' => "El archivo {$missingFile} de la firma electrónica no existe. Actualice los contenidos"];
            }
        } catch (QueryException $e) {
             //Log the error
             Log::error('Error inserting client: ' . $e->getMessage()); 

            // Return an error response with a 500 status code
            return ['error' => 'File Service. Hubo un error en la base de datos y no se consiguio la ruta de un archivo: ' . $e->getMessage()];
        } catch (\Exception $e) {
            Log::error('Error inserting client: ' . $e->getMessage()); 
            // Return an error response with a 500 status code
            return ['error' => 'File Service. Hubo un error en el codigo y no se consiguio la ruta de un archivo: ' . $e->getMessage()];
        }
    }


    public function getRutas($id)
    {
        try {
            $results = [];
            $results['imgPath'] = DB::table('Emisor')->where('idEmisor', $id)->pluck('Logo')->first(); 
            $results['keytPath'] = DB::table('Emisor')->where('idEmisor', $id)->pluck('Llave')->first();
            $results['csdtPath'] = DB::table('Emisor')->where('idEmisor', $id)->pluck('CSD')->first();
            $results['passPath'] = DB::table('Emisor')->where('idEmisor', $id)->pluck('Contra')->first();

            if ($results['imgPath'] == null) {
                $results['imgPath'] = '';
            } 
            return $results;
        } catch (QueryException $e) {
            // Log the error
            // Log::error('Error inserting client: ' . $e->getMessage());

            // Return an error response with a 500 status code
            return  ['error' => 'Hubo un error en la base de datos. No se obtuvo una ruta de un archivo : ' . $e->getMessage()];
        } catch (\Exception $e) {
            // Return an error response with a 500 status code
            return  ['error' => 'Hubo un error en el servidor. No se obtuvo una ruta de un archivo : ' . $e->getMessage()];
        }
    }
    //EXAMPLE-> ($request,'Files/Emisor/Key', 'key');
    public function saveFile($request, $directory, $type)
    {
        try {
            if ($request->isJson()) {
                // Get the JSON data from the request body
                $jsonData = $request->json()->all();

                // Convert the JSON data to a JSON string
                $jsonString = json_encode($jsonData);

                // Generate a random filename for the JSON file
                $jsonFilename = $type . '_' . Carbon::now()->format('Ymd_His') . '.json';
                $jsonFilePath = "$directory/$jsonFilename";

                // Store the JSON string in a JSON file
                Storage::put($jsonFilePath, $jsonString);

                // Return the file path of the saved JSON file
                return $jsonFilePath;
            } else {
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
            }
        } catch (\Exception $e) {
            // Handle the exception
            return ['error' => 'Error al guardar el archivo en el sistema: ' . $e->getMessage()]; // Or handle the exception in another way
        }
    }

    public function savePass($pass, $directory)
    {try {
        // Encode the string to base64
        $encodedContent = base64_encode($pass);

        // Create filename
        $filename = 'pass_' . Carbon::now()->format('Ymd_His') . '.txt';

        // Get relative path within storage directory
        $filePath = "/$directory/$filename";

        // Create and write to txt file
        Storage::put($filePath, $encodedContent);
        return $filePath;
    }catch (\Exception $e) {
            // Handle the exception
            return ['error' => 'Error al guardar la contraseña en el sistema: ' . $e->getMessage()]; // Or handle the exception in another way
        }
    }

}
