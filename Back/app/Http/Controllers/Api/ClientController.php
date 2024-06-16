<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\StoreClientRequest;
use App\Http\Requests\Client\UpdateClientRequest;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClientController extends Controller
{
    // Eliminar start transacc y commit de procedimientos
    public function index()
    {
        try {
            $prodserv = DB::select('SELECT * FROM VClientGen');
            return response()->json($prodserv, 200);
        } catch (QueryException $e) {
            return response()->json(['error' =>  'Hubo un error en la base de datos. No se pudo obtener la lista de Clientes' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Hubo un error en el sistema. No se pudo obtener la lista de Clientes' . $e->getMessage()], 500);
        }
    }

    public function getClientes(Request $request)
    {
        try {
            $razonsocial = $request->query('razon');

            $query = DB::select('SELECT * FROM VClientGen  WHERE RazonSoc like ? limit 7', ['%' . $razonsocial . '%']);
            return response()->json(['data' => $query], 200);
        } catch (QueryException $e) {
            return response()->json(['error' =>  'Hubo un error en la base de datos. No se pudo obtener al Cliente' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Hubo un error en el sistema. No se pudo obtener al Cliente' . $e->getMessage()], 500);
        }
    }

    public function store(StoreClientRequest $request)
    {
        try {
            DB::beginTransaction();
            // Validate request data
            $validatedData = $request->validated();
            // Call the stored procedure
            DB::statement('CALL InsertClientWithAddress(?,?,?, ?,?,?,?, ?,?, ?,?)', [
                $validatedData['Calle'],
                $validatedData['NumEx'],
                $validatedData['NumIn'],

                $validatedData['Municipio'],
                $validatedData['Colonia'],
                $validatedData['CP'],
                $validatedData['Estado'],

                $validatedData['RFC'],
                $validatedData['RazonSoc'],

                $validatedData['Regimen'],
                $validatedData['Correo']
            ]);
            DB::commit();
            // Return a success response
            return response()->json(['message' => 'Cliente creado satisfactoriamente'], 201);
        } catch (QueryException $e) {
            DB::rollback();
            return response()->json(['error' =>  'Hubo un error en la base de datos. No se guardó el cliente ' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Hubo un error en el sistema. No se guardó el cliente ' . $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \App\Http\Requests\Client\UpdateClientRequest $request 
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateClientRequest $request, $id)
    {
        try {
            // Validate request data
            $validatedData = $request->validated();
            // Call the stored procedure
            DB::statement('CALL UpdateClientWithClientID(?,?,?,?, ?,?,?,?, ?,?,?,?)', [
                $id,
                $validatedData['Calle'],
                $validatedData['NumEx'],
                $validatedData['NumIn'],

                $validatedData['Municipio'],
                $validatedData['Colonia'],
                $validatedData['CP'],
                $validatedData['Estado'],

                $validatedData['RFC'],
                $validatedData['RazonSoc'],
                $validatedData['Regimen'],
                $validatedData['Correo']
            ]);

            return response()->json(['message' => 'Se ha actualizado exitosamente'], 200);
        } catch (QueryException $e) {
            DB::rollback();
            return response()->json(['error' =>  'Hubo un error en la base de datos. No se actualizo el cliente: ' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Hubo un error en el sistema. No se actualizo el cliente: ' . $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $prodserv = DB::select('SELECT * FROM VClientGen WHERE idCliente  = ?', [$id]);
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
            
            $ref1 = DB::table('CFDI')
                ->where('idCliente', $id)
                ->exists();

            if ($ref1) {
                return response()->json(['error' => 'El cliente está siendo utilizado en una factura y no puede ser eliminado.'], 400);
            }
            DB::beginTransaction();
            $result = DB::statement('CALL DeleteClientWithClientID(?)', [$id]);
            
            // Check if the deletion was successful
            if ($result) {
                DB::commit();
                // If successful, return a success response
                return response()->json(["message" => "Cliente eliminado exitosamente"], 200);
            } else {
                DB::rollback();
                // If the stored procedure did not return a success result, return a not found response
                return response()->json(['error' => 'Cliente no encontrado'], 404);
            }
        } catch (\Throwable $e) {
            DB::rollback();
            return response()->json(['error' => 'Error en el controlador: ' . $e->getMessage()], 500);
        } catch (QueryException $e) {
            DB::rollback(); 
        return response()->json(['error' => 'Error al contactar con la BD: ' . $e->getMessage()], 500);
        }
    }


    /*
    //convertir a base64 un archivo
    $rutaImagen = "/micertificado.cer";
$contenidoBinario = file_get_contents($rutaImagen);
$imagenComoBase64 = base64_encode($contenidoBinario);
echo $imagenComoBase64;
    */
}
