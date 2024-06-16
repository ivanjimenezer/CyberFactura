<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Prod\StoreProdServRequest;
use App\Http\Requests\Prod\UpdateProdServRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
//uuid
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class ProdServController extends Controller
{
    //NOTA:  cambiar usuario y determinar credenciales
    public function index()
    {
        try {
            $prodserv = DB::select('SELECT idProdServ, Nombre, ClaveSAT, ClaveInv, PrecioUnitario, Tipo, Unidad, ClaveUnidadSAT  FROM ProdServ');
            return response()->json($prodserv, 200);
        } catch (QueryException $e) {

            return response()->json(['error' =>  'Hubo un error en la base de datos. No se pudo obtener la lista de productos/servicios' . $e->getMessage()], 500);
        } catch (\Exception $e) {

            return response()->json(['error' => 'Hubo un error en el sistema. No se pudo obtener la lista de productos/servicios' . $e->getMessage()], 500);
        }
    }
    //  
    public function getProdServ(Request $request)
    {
        try {
            $clavenombre = $request->query('clav'); 
            $prodserv = DB::select('SELECT * FROM VProdServ WHERE ClaveNombre like ? limit 7', ['%' . $clavenombre . '%']); 
            return response()->json(['data' => $prodserv], 200); 
        } catch (QueryException $e) {

            return response()->json(['error' =>  'Hubo un error en la base de datos. No se pudo obtener la lista de productos/servicios' . $e->getMessage()], 500);
        } catch (\Exception $e) {

            return response()->json(['error' => 'Hubo un error en el sistema. No se pudo obtener la lista de productos/servicios' . $e->getMessage()], 500);
        }
    }


    public function store(StoreProdServRequest $request)
    {
        try {
            DB::beginTransaction();
            // Retrieve validated data from request
            $data = $request->only([
                'Nombre',
                'ClaveSAT',
                'ClaveInv',
                'PrecioUnitario',

                'ClaveUnidadSAT',
                'Unidad',
                'Tipo',
            ]);
            // Generate UUID for the id column
            $data['idProdServ'] = Str::uuid();
            // Insert data into the database
            DB::table('ProdServ')->insert($data);
            DB::commit();
            return response()->json(['message' => 'Producto Guardado Exitosamente'], 201);
        } catch (QueryException $e) {
            DB::rollback();
            return response()->json(['error' =>  'Hubo un error en la base de datos. No se guardó el producto/servicio' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Hubo un error en el sistema. No se guardó el producto/servicio' . $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \App\Http\Requests\Prod\UpdateProdServRequest $request 
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateProdServRequest $request, $id)
    {
        try {
            DB::beginTransaction();
            //Para que reciba valores debe estar en formato JSON 
            $data = $request->validated();

            // Build the SQL query to update the prod record
            $sql = "UPDATE ProdServ SET ";
            $bindings = [];
            //se agregan los parametros 
            //      id = ?, calle =?
            foreach ($data as $key => $value) {
                $sql .= "$key = ?, ";
                $bindings[] = $value;
            }

            // Remove the trailing comma and space from the SQL string
            $sql = rtrim($sql, ", ");

            // Add the WHERE clause to update the record with the specified ID
            $sql .= " WHERE idProdServ = ?";
            $bindings[] = $id;

            // Execute the SQL query
            DB::update($sql, $bindings);

            DB::commit();
            return response()->json(['message' => 'Producto/Servicio Actualizado Exitosamente'], 200);
        } catch (QueryException $e) {
            DB::rollback();
            return response()->json(['error' =>  'Hubo un error en la base de datos. No se actualizo el producto/servicio' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Hubo un error en el sistema. No se actualizo el producto/servicio' . $e->getMessage()], 500);
        }
    }

    public function show($id)
    { // ctrl +shift +L <-- para seleccionar strings similares
        try {

            // Execute the SQL query to fetch the prod record with the specified ID
            $prod = DB::selectOne('SELECT * FROM ProdServ WHERE idProdServ = ?', [$id]);

            if (!$prod) {
                // If no prod record is found, return a 404 response
                return response()->json(['error' => 'Producto no encontrado'], 404);
            }

            // If the prod record is found, return it
            return response()->json([$prod], 200);
        } catch (QueryException $e) {
            DB::rollback();
            return response()->json(['error' =>  'Hubo un error en la base de datos. No se pudo obtener el producto/servicio' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Hubo un error en el sistema. No se pudo obtener el producto/servicio' . $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            DB::beginTransaction();
            $ref1 = DB::table('Concepto')
                ->where('idProdServ', $id)
                ->exists();

            

            if ($ref1 ) {
                DB::rollback();
                return response()->json(['error' => 'El producto está siendo utilizado en una cotización o factura y no puede ser eliminado.'], 400);
            }

            // Execute the SQL query to fetch the prod record with the specified ID
            $prod = DB::delete('DELETE FROM ProdServ WHERE idProdServ = ?', [$id]);
            DB::commit();
            if ($prod == 0) {
                // If no prod record is found, return a 404 response
                return response()->json(['error' => 'Producto/servicio no encontrado'], 404);
            }

            // If the prod record is found, return it
            return response()->json(["message" => "Producto/servicio borrado exitosamente"], 200);
        } catch (QueryException $e) {
            DB::rollback();
            return response()->json(['error' =>  'Hubo un error en la base de datos: ' . $e->getMessage()], 500);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Hubo un error en el sistema. No se pudo eliminar el elemento' . $e->getMessage()], 500);
        }
    }
}
