<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tax\StoreTaxRequest;
use App\Http\Requests\Tax\UpdateTaxRequest;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
//uuid
use Illuminate\Support\Str;

class TaxController extends Controller
{
    public function index()
    {
        try {
            $taxes = DB::select('SELECT * FROM VImpuestos');
            return response()->json($taxes);
        } catch (QueryException $e) {
            return response()->json(['error' =>  'Hubo un error en la base de datos. No se pudo obtener la lista de impuestos' . $e->getMessage()], 500);
        } catch (\Exception $e) {

            return response()->json(['error' => 'Hubo un error en el sistema. No se pudo obtener la lista de impuestos' . $e->getMessage()], 500);
        }
    }
    public function store(StoreTaxRequest $request)
    {
        try {
            DB::beginTransaction();
            
            // Retrieve validated data from request
            $data = $request->only([
                'Nombre',
                'Tipo',
                'Impuesto',
                'Factor',
                'Tasa'
            ]); 
            
            // Check if the value of 'Nombre' already exists in the database
            if (DB::table('Impuestos')->where('Nombre', $data['Nombre'])->exists()) {
                return response()->json(['error' => 'El nombre del impuesto ya existe en la base de datos'], 422);
            }
    
            // Generate UUID for the id column
            $data['idImpuestos'] = Str::uuid();
    
            // Insert data into the database
            DB::table('Impuestos')->insert($data);
            
            DB::commit();
            return response()->json(['message' => 'Impuesto Guardado Exitosamente'], 201);
        } catch (QueryException $e) {
            DB::rollback();
            return response()->json(['error' =>  'Hubo un error en la base de datos. No se pudo almacenar el impuesto: ' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Hubo un error en el sistema. No se pudo almacenar el impuesto: ' . $e->getMessage()], 500);
        }
    }
    

    /**
     * Update the specified resource in storage.
     *
     * @param \App\Http\Requests\Tax\UpdateTaxRequest $request 
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateTaxRequest $request, $id)
    {
        try {
            DB::beginTransaction();
    
            // Retrieve validated data from request
            $data = $request->only([
                'Nombre',
                'Tipo',
                'Impuesto',
                'Factor',
                'Tasa'
            ]); 
            
            // Check if the value of 'Nombre' already exists for another record
            if (isset($data['Nombre']) && DB::table('Impuestos')->where('Nombre', $data['Nombre'])->where('idImpuestos', '!=', $id)->exists()) {
                DB::rollback();
                return response()->json(['error' => 'El nombre del impuesto ya existe para otro registro en la base de datos'], 422);
            }
    
            // Update data in the database
            DB::table('Impuestos')->where('idImpuestos', $id)->update($data);
    
            DB::commit();
            return response()->json(['message' => 'Impuesto actualizado exitosamente'], 200);
        } catch (QueryException $e) {
            DB::rollback();
            return response()->json(['error' =>  'Hubo un error en la base de datos. No se pudo actualizar el impuesto: ' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Hubo un error en el sistema. No se pudo actualizar el impuesto: ' . $e->getMessage()], 500);
        }
    }
    

    public function show($id)
    {
        try {
            // Execute the SQL query to fetch the tax record with the specified ID
            $tax = DB::selectOne('SELECT * FROM Impuestos WHERE idImpuestos = ?', [$id]);

            if (!$tax) {
                // If no tax record is found, return a 404 response
                return response()->json(['error' => 'Tax not found'], 404);
            }
            // If the tax record is found, return it
            return response()->json([$tax], 200);
        } catch (QueryException $e) {
            return response()->json(['error' =>  'Hubo un error en la base de datos. No se pudo obtener la lista de impuestos' . $e->getMessage()], 500);
        } catch (\Exception $e) {

            return response()->json(['error' => 'Hubo un error en el sistema. No se pudo obtener la lista de impuestos' . $e->getMessage()], 500);
        }
    }

    // Delete
    public function destroy($id)
    {
        try { 
            $ref1 = DB::table('ConcepiImpuestos')
            ->where('idImpuestos', $id)
            ->exists();
 
        if ($ref1) { 
            return response()->json(['error' => 'El impuesto está siendo utilizado en una cotización o factura y no puede ser eliminado.'], 400);
        } 
        DB::beginTransaction();
            // Execute the SQL query to fetch the tax record with the specified ID
            $tax = DB::delete('DELETE FROM Impuestos WHERE idImpuestos = ?', [$id]); 
            if ($tax == 0) {
                // If no tax record is found, return a 404 response
                return response()->json(['error' => 'Impuesto no encontrado'], 404);
            } 
            DB::commit();
            return response()->json(["message" => "Impuesto Eliminado"], 200);
        } catch (\Throwable $e) {
            DB::rollback();
            // If an error occurs, return an error response with the error message
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
